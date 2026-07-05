'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'

export interface CommitteeMember {
  role: string
  name: string
  email: string
  org?: string
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2)
}

const AUTOPLAY_MS = 5000
// Deterministic per-slot rotation so the stack looks organic without Math.random (SSR-safe).
const ROTATIONS = [-8, 6, -4, 9, -6, 5]

/**
 * Animated testimonials layout inspired by the eldora-ui / Aceternity design:
 * a stacked, rotating portrait on the left and role/name/blurb/contact on the
 * right with a staggered word reveal. Committee members are the slides.
 */
export default function AnimatedTestimonials({ members }: { members: CommitteeMember[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = members.length

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count])
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    if (paused || count <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, count])

  const touchX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
    touchX.current = null
  }

  const active = members[index]
  const blurb = `${active.role} at the ${active.org ?? 'Association of Software Engineering'}, helping bring BuilderThon 2026 to life at NSBM Green University.`

  return (
    <div
      className="relative max-w-4xl mx-auto"
      role="group"
      aria-roledescription="carousel"
      aria-label="Organizing committee"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:grid-cols-2 gap-5 sm:gap-10 md:gap-12 items-center">
        {/* Left — stacked rotating portraits (fixed-size box so centering is exact) */}
        <div className="relative h-52 sm:h-72 w-full max-w-[13rem] sm:max-w-[18rem] mx-auto justify-self-center">
          {members.map((m, i) => {
            const isActive = i === index
            const rot = ROTATIONS[i % ROTATIONS.length]
            return (
              <div
                key={m.email}
                className="glass-card glow-border-cyan border-l-4 border-l-bright-cyan absolute inset-0
                           flex flex-col items-center justify-center text-center transition-all duration-500 ease-out"
                style={{
                  opacity: isActive ? 1 : 0,
                  zIndex: isActive ? 30 : 10,
                  transform: isActive
                    ? 'scale(1) rotate(0deg) translateY(0)'
                    : `scale(0.94) rotate(${rot}deg) translateY(14px)`,
                }}
                aria-hidden={!isActive}
              >
                <div
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-display font-bold text-white text-xl sm:text-3xl mb-3 sm:mb-4 shadow-cyan-glow"
                  style={{ background: 'linear-gradient(135deg, #1E5F7A 0%, #24A3C7 60%, #64E6FF 100%)' }}
                >
                  {initials(m.name)}
                </div>
                <p className="font-display font-semibold text-white text-sm sm:text-lg px-2">{m.name}</p>
                <p className="font-poppins text-bright-cyan/70 text-[9px] sm:text-[11px] tracking-[0.25em] uppercase mt-1">
                  {m.role}
                </p>
              </div>
            )
          })}
        </div>

        {/* Right — content with word reveal (keyed on index to replay).
            min-h reserves space for the longest slide so arrows/dots never jump. */}
        <div className="text-left flex flex-col justify-center min-h-[280px] sm:min-h-[300px]">
          <div key={index} className="flex-1 flex flex-col justify-center">
            <p className="testi-enter font-display text-bright-cyan text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-2 sm:mb-3">
              {active.role}
            </p>
            <h3 className="testi-enter font-display font-bold text-white text-lg sm:text-3xl leading-tight mb-1">
              {active.name}
            </h3>
            <p className="testi-enter font-poppins text-white/60 text-xs mb-3 sm:mb-5">
              {active.org ?? 'Association of Software Engineering'}
            </p>
            <p
              className="font-poppins text-white/85 leading-relaxed text-sm sm:text-lg mb-4 sm:mb-6 min-h-[6.5rem] sm:min-h-[5.25rem]"
              aria-live="polite"
            >
              {blurb.split(' ').map((word, i) => (
                <span key={`${index}-${i}`} className="testi-word mr-[0.28em]" style={{ animationDelay: `${i * 0.022}s` }}>
                  {word}
                </span>
              ))}
            </p>
            <a
              href={`mailto:${active.email}`}
              className="focus-ring self-start inline-flex items-center gap-2 font-poppins text-xs sm:text-sm text-white/80 hover:text-bright-cyan transition-colors duration-200"
            >
              <Mail size={15} className="text-bright-cyan shrink-0" />
              <span className="break-all">{active.email}</span>
            </a>
          </div>

          {/* Arrows — pinned below the reserved content area so they never move */}
          <div className="flex flex-wrap items-center justify-start gap-3 mt-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous member"
              className="focus-ring group/btn w-11 h-11 rounded-full border border-bio-cyan/40 text-bright-cyan
                         flex items-center justify-center hover:bg-bio-cyan/10 hover:border-bright-cyan
                         hover:shadow-cyan-glow transition-all duration-300"
            >
              <ArrowLeft size={18} className="transition-transform duration-300 group-hover/btn:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next member"
              className="focus-ring group/btn w-11 h-11 rounded-full border border-bio-cyan/40 text-bright-cyan
                         flex items-center justify-center hover:bg-bio-cyan/10 hover:border-bright-cyan
                         hover:shadow-cyan-glow transition-all duration-300"
            >
              <ArrowRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2 ml-3">
              {members.map((m, i) => (
                <button
                  key={m.email}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show ${m.name}`}
                  aria-current={i === index}
                  className={`focus-ring h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'w-6 bg-bright-cyan shadow-cyan-glow' : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
