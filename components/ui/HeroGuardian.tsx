'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

/**
 * Hero "guardian" figure. A transparent PNG treated as a pseudo-3D element:
 * a gentle vertical float (outer wrapper) plus a subtle tilt toward the mouse
 * (inner wrapper) for depth. Desktop-only and non-interactive so it never
 * blocks the hero CTA. Respects reduced-motion via the .guardian-float rule.
 */
export default function HeroGuardian() {
  const tilt = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: MouseEvent) => {
      const el = tilt.current
      if (!el) return
      const dx = e.clientX / window.innerWidth - 0.5
      const dy = e.clientY / window.innerHeight - 0.5
      el.style.transform = `perspective(1200px) rotateX(${(-dy * 6).toFixed(2)}deg) rotateY(${(dx * 10).toFixed(2)}deg)`
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="pointer-events-none absolute bottom-0 right-0 z-[5] hidden lg:block xl:right-8">
      <div className="guardian-float">
        <div
          ref={tilt}
          className="relative transition-transform duration-200 ease-out"
          style={{ transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)' }}
        >
          {/* Bioluminescent glow behind the figure */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bright-cyan/20 blur-3xl" />
          <Image
            src="/navi-guardian.png"
            alt="Pandora guardian"
            width={640}
            height={900}
            priority
            className="h-[58vh] w-auto drop-shadow-[0_0_45px_rgba(100,230,255,0.35)] xl:h-[70vh]"
          />
        </div>
      </div>
    </div>
  )
}
