'use client';

/**
 * Premium abstract background: deep ink base, two slow-drifting aurora blobs,
 * a faint grid, a top radial highlight and a subtle grain overlay.
 * Pure CSS — no heavy WebGL, keeps it fast and battery-friendly.
 */
export function AuroraBackground({ dim = false }: { dim?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* base */}
      <div className="absolute inset-0 bg-ink-950" />

      {/* aurora blobs */}
      <div className="absolute left-1/2 top-[-10%] h-[55vw] w-[55vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,141,239,0.18),transparent_62%)] blur-3xl animate-aurora-1" />
      <div className="absolute right-[-10%] top-[20%] h-[45vw] w-[45vw] rounded-full bg-[radial-gradient(circle,rgba(198,161,91,0.14),transparent_60%)] blur-3xl animate-aurora-2" />
      <div className="absolute bottom-[-15%] left-[-5%] h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle,rgba(124,140,255,0.10),transparent_60%)] blur-3xl animate-aurora-1" />

      {/* faint grid */}
      <div className="absolute inset-0 bg-grid-faint bg-[size:64px_64px] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />

      {/* top highlight */}
      <div className="absolute inset-x-0 top-0 h-64 bg-radial-fade" />

      {/* vignette + optional dim for content readability */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent,rgba(5,5,5,0.85))]" />
      {dim && <div className="absolute inset-0 bg-ink-950/40" />}

      {/* grain */}
      <div className="grain absolute inset-0 opacity-[0.05]" />
    </div>
  );
}
