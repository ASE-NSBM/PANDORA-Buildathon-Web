'use client'

import Image from 'next/image'

/**
 * Ambient sea-creature drifting in the hero. A transparent PNG with a gentle
 * float and a slight base tilt so it reads as "swimming" through the scene.
 * Decorative only: non-interactive, desktop-first, and respects reduced-motion
 * through the shared .guardian-float rule.
 */
export default function HeroCreature() {
  return (
    <div className="pointer-events-none absolute left-[-2%] top-[58%] z-[4] block w-[120px] opacity-60 sm:left-[2%] sm:w-[160px] md:left-[3%] md:top-[40%] md:w-[240px] md:opacity-90 lg:w-[320px] xl:w-[390px]">
      <div className="guardian-float" style={{ animationDuration: '8s' }}>
        <div className="relative -rotate-6">
          {/* Soft glow trailing the creature */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bio-cyan/15 blur-3xl" />
          <Image
            src="/sea-creature.png"
            alt="Pandora sea creature"
            width={1230}
            height={909}
            priority
            className="h-auto w-full drop-shadow-[0_0_35px_rgba(80,200,230,0.30)]"
          />
        </div>
      </div>
    </div>
  )
}
