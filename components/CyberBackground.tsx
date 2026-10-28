'use client';

import { cn } from '@/lib/utils';

/**
 * The world behind the interface: a blue-black void, a perspective floor grid
 * running to a horizon, one slow scan beam and grain. Pure CSS — no WebGL, so
 * it costs nothing on a phone and keeps the page battery-friendly.
 */
export function CyberBackground({
  horizon = true,
  className,
}: {
  /** The vanishing-point floor grid. Off for short, dense sections. */
  horizon?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-ink-950" />

      {/* two cold blooms, slowly drifting */}
      <div className="absolute left-1/2 top-[-14%] h-[52vw] w-[52vw] -translate-x-1/2 bg-[radial-gradient(circle,rgba(40,224,240,0.13),transparent_62%)] blur-3xl animate-drift" />
      <div className="absolute right-[-12%] top-[26%] h-[40vw] w-[40vw] bg-[radial-gradient(circle,rgba(255,61,138,0.07),transparent_60%)] blur-3xl animate-drift [animation-delay:-9s]" />

      {/* flat grid over the whole plane */}
      <div className="absolute inset-0 bg-grid-faint bg-[size:72px_72px] [mask-image:radial-gradient(75%_60%_at_50%_25%,black,transparent)]" />

      {/* perspective floor running to the horizon */}
      {horizon && (
        <div className="absolute inset-x-[-25%] bottom-0 h-[48vh] [perspective:420px]">
          <div
            className="h-full w-full bg-grid-neon bg-[size:64px_64px] opacity-50 animate-grid-pan"
            style={{
              transform: 'rotateX(74deg)',
              transformOrigin: 'bottom center',
              maskImage: 'linear-gradient(to top, black, transparent 72%)',
              WebkitMaskImage: 'linear-gradient(to top, black, transparent 72%)',
            }}
          />
          {/* the horizon itself */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/35 to-transparent" />
        </div>
      )}

      {/* one scan beam crossing the view */}
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,transparent,rgba(40,224,240,0.07),transparent)] animate-scan-beam" />

      {/* top highlight, vignette, grain */}
      <div className="absolute inset-x-0 top-0 h-64 bg-radial-fade" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent,rgba(4,6,10,0.88))]" />
      <div className="grain absolute inset-0 opacity-[0.055]" />
    </div>
  );
}
