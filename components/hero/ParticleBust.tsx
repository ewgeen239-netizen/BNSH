'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

/**
 * The bust: a point cloud of a human head and shoulders, built in code.
 *
 * There is no model file. The figure is a union of ellipsoids (skull, nose,
 * lips, chin, neck, shoulders, chest); points are sampled on each surface and
 * thrown away when they fall inside another part, which leaves a clean shell
 * with real facial structure instead of a blurred blob.
 *
 * Everything that moves per frame happens on the GPU:
 *  - breathing is a sine on the vertex, phase-shifted per particle;
 *  - the cursor pushes particles away inside a radius, and they spring back
 *    on their own because the displacement is a pure function of a smoothed
 *    mouse uniform rather than stored state;
 *  - the scroll turns the bust to three-quarter profile, slides it right and
 *    scales it up, which is done on the group, not on 30 000 vertices.
 *
 * Colour is baked per particle: lavender over the head, amber across the
 * shoulders, with a short blend between them and two brighter eye clusters.
 */

const COUNT_DESKTOP = 46000;
const COUNT_MOBILE = 18000;

/** How far down the page the hero choreography runs, in viewport heights. */
export const HERO_SCROLL_VH = 2.4;

type Prim = {
  /** centre */
  c: [number, number, number];
  /** radii */
  r: [number, number, number];
  /** relative share of the particle budget */
  w: number;
  /** points below this y are dropped (used to open the bottom of the chest) */
  cut?: number;
  /** the hair shell: only the top and back of the skull are kept */
  hair?: boolean;
  /** sits inside another part on purpose (the eyeballs) */
  embedded?: boolean;
  /** brightness multiplier for this part */
  tone?: number;
};

/**
 * The figure, in model units: y = 0 is the bottom of the chest, the eyes sit
 * at about y = 1.45. Parts overlap on purpose — the sampler keeps only what
 * is on the outside of the union, which is what fuses them into one body.
 */
const PARTS: Prim[] = [
  { c: [0, 1.5, 0], r: [0.5, 0.57, 0.52], w: 26 }, // skull
  { c: [0, 1.54, -0.05], r: [0.55, 0.6, 0.56], w: 12, hair: true, tone: 0.55 }, // hair
  { c: [0, 1.17, 0.05], r: [0.35, 0.3, 0.4], w: 8 }, // jaw

  // The nose is a body, not a drawn line: the part of it that sticks out
  // past the skull is all that survives the union.
  { c: [0, 1.37, 0.42], r: [0.09, 0.19, 0.24], w: 5 }, // bridge
  { c: [0, 1.28, 0.5], r: [0.12, 0.1, 0.24], w: 5 }, // tip
  { c: [-0.095, 1.26, 0.44], r: [0.06, 0.06, 0.16], w: 2 }, // left nostril
  { c: [0.095, 1.26, 0.44], r: [0.06, 0.06, 0.16], w: 2 }, // right nostril

  // Ears, likewise — wide enough to clear the side of the head.
  { c: [-0.51, 1.43, -0.03], r: [0.05, 0.16, 0.12], w: 3, tone: 0.85 },
  { c: [0.51, 1.43, -0.03], r: [0.05, 0.16, 0.12], w: 3, tone: 0.85 },

  // The eyes sit in their sockets darker than the skin, each with one small
  // catchlight — bright eyeballs read as a cartoon.
  { c: [-0.22, 1.47, 0.33], r: [0.055, 0.055, 0.05], w: 1.6, embedded: true, tone: 0.6 },
  { c: [0.22, 1.47, 0.33], r: [0.055, 0.055, 0.05], w: 1.6, embedded: true, tone: 0.6 },
  { c: [-0.235, 1.49, 0.36], r: [0.011, 0.011, 0.01], w: 0.2, embedded: true, tone: 1.5 },
  { c: [0.235, 1.49, 0.36], r: [0.011, 0.011, 0.01], w: 0.2, embedded: true, tone: 1.5 },

  { c: [0, 0.82, -0.02], r: [0.23, 0.32, 0.22], w: 7 }, // neck

  // The t-shirt is the torso: there is no bare body under it to draw, so the
  // garment's own shell is what the shoulders, chest and sleeves are made of.
  { c: [0, 0.34, 0], r: [0.78, 0.3, 0.3], w: 13, tone: 0.82 }, // shoulder yoke
  { c: [0, -0.12, 0], r: [0.63, 0.64, 0.35], w: 16, cut: -0.56, tone: 0.82 }, // body
  { c: [-0.72, 0.08, 0], r: [0.27, 0.32, 0.28], w: 6, tone: 0.82 }, // left sleeve
  { c: [0.72, 0.08, 0], r: [0.27, 0.32, 0.28], w: 6, tone: 0.82 }, // right sleeve
];

/**
 * Gaussian bumps that carve the face out of the skull:
 * [x, y, sigmaX, sigmaY, amplitude]. Negative amplitudes are hollows.
 * The nose is missing from this list on purpose — it is real geometry now.
 */
const FEATURES: [number, number, number, number, number][] = [
  [0, 1.6, 0.32, 0.055, 0.07], // brow ridge
  [-0.23, 1.47, 0.1, 0.065, -0.1], // left eye socket
  [0.23, 1.47, 0.1, 0.065, -0.1], // right eye socket
  [-0.28, 1.35, 0.11, 0.08, 0.06], // left cheekbone
  [0.28, 1.35, 0.11, 0.08, 0.06], // right cheekbone
  [0, 1.2, 0.12, 0.045, 0.08], // lips
  [0, 1.15, 0.1, 0.03, -0.03], // mouth line
  [0, 1.04, 0.14, 0.085, 0.09], // chin
  [-0.33, 1.18, 0.1, 0.12, -0.05], // left jaw hollow
  [0.33, 1.18, 0.1, 0.12, -0.05], // right jaw hollow
];

/**
 * The seams of the shirt: a collar, two sleeve hems and the bottom hem. Each
 * is a real torus of particles, so it reads as a rolled edge of fabric rather
 * than as a line drawn on the figure.
 */
type Ring = {
  /** centre of the ring */
  c: [number, number, number];
  /** ring radius */
  R: number;
  /** tube radius */
  t: number;
  /** squash of the ring front-to-back */
  depth: number;
  /** share of the ring budget */
  w: number;
  tone: number;
};

const RINGS: Ring[] = [
  { c: [0, 0.56, -0.01], R: 0.27, t: 0.035, depth: 0.85, w: 10, tone: 0.95 }, // collar
  { c: [-0.78, -0.08, 0], R: 0.26, t: 0.03, depth: 1, w: 7, tone: 0.9 }, // left sleeve hem
  { c: [0.78, -0.08, 0], R: 0.26, t: 0.03, depth: 1, w: 7, tone: 0.9 }, // right sleeve hem
  { c: [0, -0.54, 0], R: 0.55, t: 0.035, depth: 0.55, w: 14, tone: 0.9 }, // bottom hem
];

/** Is `p` inside primitive `k`, with a margin so unions do not seam? */
function inside(p: THREE.Vector3, k: Prim, margin = 0.94) {
  const x = (p.x - k.c[0]) / (k.r[0] * margin);
  const y = (p.y - k.c[1]) / (k.r[1] * margin);
  const z = (p.z - k.c[2]) / (k.r[2] * margin);
  return x * x + y * y + z * z < 1;
}

/** Face relief at (x, y): the sum of the gaussian features. */
function relief(x: number, y: number) {
  let bump = 0;
  for (const [fx, fy, sx, sy, amp] of FEATURES) {
    const dx = (x - fx) / sx;
    const dy = (y - fy) / sy;
    bump += amp * Math.exp(-0.5 * (dx * dx + dy * dy));
  }
  return bump;
}

function buildGeometry(count: number) {
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);

  const shellCount = Math.floor(count * 0.9);
  const totalW = PARTS.reduce((s, p) => s + p.w, 0);
  const point = new THREE.Vector3();
  const colHead = new THREE.Color('#ffffff');
  const colBody = new THREE.Color('#cdcdd8');
  const tmp = new THREE.Color();

  let i = 0;
  let guard = 0;

  const write = (
    x: number,
    y: number,
    z: number,
    nx: number,
    ny: number,
    nz: number,
    tone: number,
    size: number,
  ) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    const nl = Math.hypot(nx, ny, nz) || 1;
    normals[i * 3] = nx / nl;
    normals[i * 3 + 1] = ny / nl;
    normals[i * 3 + 2] = nz / nl;

    const t = THREE.MathUtils.smoothstep(y, 0.2, 1.1);
    tmp.copy(colBody).lerp(colHead, t);
    tmp.multiplyScalar(tone * (0.72 + Math.random() * 0.38));
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;

    phases[i] = Math.random() * Math.PI * 2;
    sizes[i] = size;
    i++;
  };

  /* ------------------------------ the shell ----------------------------- */

  while (i < shellCount && guard < shellCount * 60) {
    guard++;

    // Pick a part proportionally to its share of the budget.
    let pick = Math.random() * totalW;
    let part = PARTS[0];
    for (const p of PARTS) {
      pick -= p.w;
      if (pick <= 0) {
        part = p;
        break;
      }
    }

    // A random point on that ellipsoid's surface.
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    point.set(
      s * Math.cos(theta) * part.r[0] + part.c[0],
      u * part.r[1] + part.c[1],
      s * Math.sin(theta) * part.r[2] + part.c[2],
    );

    if (part.cut !== undefined && point.y < part.cut) continue;
    // Hair covers the crown and the back of the head, never the face.
    if (part.hair && !(point.y > 1.62 || point.z < -0.1)) continue;
    // Drop whatever another part already covers: only the shell survives.
    if (
      !part.hair &&
      !part.embedded &&
      PARTS.some((other) => other !== part && !other.hair && !other.embedded && inside(point, other))
    ) {
      continue;
    }

    // Carve the rest of the face into the front of the head.
    if (!part.hair && !part.embedded && point.y > 0.85 && point.z > 0) {
      const front = Math.min(1, point.z / 0.45);
      point.z += relief(point.x, point.y) * front;
    }

    // Most points hug the surface; a tenth drift off it, which is what makes
    // the figure look like it is made of dust rather than moulded.
    const stray = Math.random() < 0.1 ? 0.07 + Math.random() * 0.16 : 0.012;
    const px = point.x + (Math.random() - 0.5) * stray * 2;
    const py = point.y + (Math.random() - 0.5) * stray * 2;
    const pz = point.z + (Math.random() - 0.5) * stray * 2;

    // Ellipsoid normal, used by the shader to shade and to fade the rim.
    const nx = (point.x - part.c[0]) / (part.r[0] * part.r[0]);
    const ny = (point.y - part.c[1]) / (part.r[1] * part.r[1]);
    const nz = (point.z - part.c[2]) / (part.r[2] * part.r[2]);

    write(px, py, pz, nx, ny, nz, part.tone ?? 1, 0.6 + Math.random() * 0.55);
  }

  /* ----------------------------- the seams ------------------------------ */

  const ringBudget = count - i;
  const ringW = RINGS.reduce((s, r) => s + r.w, 0);

  for (const r of RINGS) {
    const n = Math.max(1, Math.round((r.w / ringW) * ringBudget));
    for (let k = 0; k < n && i < count; k++) {
      const a = Math.random() * Math.PI * 2; // around the ring
      const b = Math.random() * Math.PI * 2; // around the tube
      const rad = r.R + r.t * Math.cos(b);
      const x = r.c[0] + rad * Math.cos(a);
      const z = r.c[2] + rad * Math.sin(a) * r.depth;
      const y = r.c[1] + r.t * Math.sin(b);
      const j = 0.014;
      write(
        x + (Math.random() - 0.5) * j,
        y + (Math.random() - 0.5) * j,
        z + (Math.random() - 0.5) * j,
        Math.cos(b) * Math.cos(a),
        Math.sin(b),
        Math.cos(b) * Math.sin(a),
        r.tone,
        0.6 + Math.random() * 0.45,
      );
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, i * 3), 3));
  geo.setAttribute('aNormal', new THREE.BufferAttribute(normals.subarray(0, i * 3), 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(colors.subarray(0, i * 3), 3));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phases.subarray(0, i), 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes.subarray(0, i), 1));
  return geo;
}

const VERT = /* glsl */ `
  attribute vec3 aColor;
  attribute vec3 aNormal;
  attribute float aPhase;
  attribute float aSize;

  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uPush;
  uniform float uRadius;
  uniform float uPixelRatio;
  uniform float uScale;

  varying vec3 vColor;
  varying float vLit;
  varying float vFace;
  varying float vShade;

  void main() {
    vec3 p = position;

    // breathing — the chest moves more than the head
    float chest = smoothstep(0.6, -0.3, p.y);
    float b = sin(uTime * 1.1 + aPhase * 0.35);
    p.y += b * 0.01;
    p.z += b * 0.012 * chest;
    p.xz *= 1.0 + b * 0.012 * chest;

    // the cursor pushes particles out of the way; the spring back is free,
    // because this is a pure function of the (smoothed) mouse position
    vec3 d = p - uMouse;
    float dist = length(d);
    float f = smoothstep(uRadius, 0.0, dist);
    p += normalize(d + 0.0001) * f * uPush;
    vLit = f;

    vColor = aColor;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // How squarely this particle faces the camera: 1 on the front of the
    // form, 0 at the silhouette and on the far side.
    vec3 n = normalize(normalMatrix * aNormal);
    vec3 toEye = normalize(-mv.xyz);
    float facing = max(0.0, dot(n, toEye));
    vFace = 0.16 + 0.84 * pow(facing, 1.1);

    // Two fixed lights in view space sculpt the cloud: a key from the upper
    // left front and a hard rim from behind on the right. Without them the
    // figure is a flat field of dots whichever way it turns.
    float key = max(0.0, dot(n, normalize(vec3(-0.55, 0.55, 0.65))));
    float rim = pow(max(0.0, dot(n, normalize(vec3(0.85, 0.05, -0.45)))), 2.5);
    vShade = 0.22 + 0.95 * key + 0.85 * rim;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uScale * uPixelRatio * (46.0 / max(0.001, -mv.z));
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;

  uniform float uOpacity;

  varying vec3 vColor;
  varying float vLit;
  varying float vFace;
  varying float vShade;

  void main() {
    // round, soft-edged dot
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.15, d);
    if (a < 0.02) discard;
    // Additive blending stacks fast; keep each dot faint so the cloud reads
    // as particles rather than as a lit silhouette.
    vec3 c = mix(vColor * vShade, vec3(1.0), vLit * 0.5);
    gl_FragColor = vec4(c, a * uOpacity * vFace * 0.22);
  }
`;

export function ParticleBust({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 767px)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      // No WebGL (or it is blocked): the hero still reads without the bust.
      return;
    }

    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 1.05, 5.4);
    camera.lookAt(0, 1.0, 0);

    const geometry = buildGeometry(mobile ? COUNT_MOBILE : COUNT_DESKTOP);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 10) },
      uPush: { value: 0.16 },
      uRadius: { value: 0.55 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uScale: { value: mobile ? 0.85 : 1.0 },
      uOpacity: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(points);
    group.position.y = -0.12;
    // Turned slightly toward the copy on the left, and it keeps turning that
    // way as the scroll slides it to the right of the view.
    group.rotation.y = -0.14;
    scene.add(group);

    /* ------------------------------ pointer ------------------------------ */

    // The pointer is projected onto a plane through the face, so the push
    // happens where the cursor visually is rather than at the near plane.
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.5);
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2(0, 0);
    const hit = new THREE.Vector3();
    const target = new THREE.Vector3(0, 0, 12); // far away = no push
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
    let pointerSeen = false;

    const onPointer = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      parallax.tx = ndc.x;
      parallax.ty = ndc.y;
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        // into the group's own space
        target.set(hit.x - group.position.x, hit.y - group.position.y, hit.z);
        pointerSeen = true;
      }
    };
    const onLeave = () => {
      target.set(0, 0, 12);
      pointerSeen = false;
    };

    if (!reduce) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('pointerdown', onPointer, { passive: true });
      window.addEventListener('blur', onLeave);
    }

    /* ------------------------------- scroll ------------------------------ */

    let progress = 0;
    const readScroll = () => {
      // The sticky stage only travels for (height - one viewport), so that
      // is the range the choreography has to fit into.
      const span = window.innerHeight * (HERO_SCROLL_VH - 1);
      progress = Math.min(1.4, Math.max(0, window.scrollY / span));
    };
    readScroll();
    window.addEventListener('scroll', readScroll, { passive: true });

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };
    window.addEventListener('resize', resize);

    /* ------------------------------- frames ------------------------------ */

    const clock = new THREE.Clock();
    let raf = 0;
    const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

    const frame = () => {
      raf = requestAnimationFrame(frame);

      // Once the hero has scrolled away the scene is idle — nothing to draw.
      if (progress > 1.25) {
        host.style.opacity = '0';
        return;
      }

      const dt = Math.min(0.05, clock.getDelta());
      uniforms.uTime.value = clock.getElapsedTime();

      // 0 → 0.3: centred and facing front. 0.3 → 0.9: turns to three-quarter
      // profile, slides right and grows, clearing the left third of the view.
      const e = ease(Math.min(1, Math.max(0, (progress - 0.26) / 0.5)));

      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, -0.14 - e * 0.5 + parallax.x * 0.12, 0.12);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -parallax.y * 0.06, 0.12);
      group.position.x = THREE.MathUtils.lerp(group.position.x, mobile ? e * 0.22 : e * 1.55, 0.1);
      group.position.y = THREE.MathUtils.lerp(group.position.y, -0.12 + e * 0.08, 0.1);
      const sc = 1 + e * (mobile ? 0.12 : 0.38);
      group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, sc, 0.1));

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, -e * 0.35, 0.08);
      camera.lookAt(group.position.x * 0.45, 1.0, 0);

      // smooth the mouse so the push has weight
      const m = uniforms.uMouse.value as THREE.Vector3;
      m.lerp(target, pointerSeen ? 0.18 : 0.08);
      uniforms.uPush.value = reduce ? 0 : 0.18;

      // fade in on first frames, fade out as the hero leaves
      const want = progress > 1 ? Math.max(0, 1 - (progress - 1) / 0.25) : 1;
      uniforms.uOpacity.value = THREE.MathUtils.lerp(uniforms.uOpacity.value, want, dt * 6);
      host.style.opacity = '1';

      parallax.x += (parallax.tx - parallax.x) * 0.06;
      parallax.y += (parallax.ty - parallax.y) * 0.06;

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={cn('pointer-events-none transition-opacity duration-500', className)}
    />
  );
}
