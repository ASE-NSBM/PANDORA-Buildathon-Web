'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Mail } from 'lucide-react'

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

/**
 * HUD-styled slider that presents committee members one at a time, in the
 * shape of a testimonial slider: avatar + role + name + org + contact.
 * Autoplays (paused on hover/focus and under reduced-motion), supports
 * arrows, dots, swipe, and arrow-key navigation.
 */
export default function CommitteeSlider({ members }: { members: CommitteeMember[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = members.length

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count])
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  // Autoplay — disabled when paused or when the user prefers reduced motion.
  useEffect(() => {
    if (paused || count <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, count])

  // Touch swipe
  const touchX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
    touchX.current = null
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev() }
  }

  const member = members[index]

  return (
    <div
      className="relative max-w-2xl mx-auto"
      role="group"
      aria-roledescription="carousel"
      aria-label="Organizing committee"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Prev */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous member"
          className="focus-ring shrink-0 w-11 h-11 rounded-full border border-bio-cyan/40 text-bright-cyan
                     flex items-center justify-center hover:bg-bio-cyan/10 hover:border-bright-cyan
                     hover:shadow-cyan-glow transition-all duration-300"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Slide */}
        <div
          className="hud-corners glass-card glow-border-cyan flex-1 px-6 py-10 sm:px-10 text-center"
          aria-live="polite"
        >
          <div className="w-20 h-20 rounded-full bg-bio-cyan/10 border border-bio-cyan/30 flex items-center justify-center mx-auto mb-5 font-display font-bold text-bright-cyan text-2xl shadow-cyan-glow">
            {initials(member.name)}
          </div>
          <p className="font-display text-bright-cyan text-[11px] tracking-[0.3em] uppercase mb-3">
            {member.role}
          </p>
          <h3 className="font-display font-semibold text-white text-xl sm:text-2xl mb-1">{member.name}</h3>
          <p className="font-poppins text-white/40 text-xs mb-5">
            {member.org ?? 'Association of Software Engineering'}
          </p>
          <a
            href={`mailto:${member.email}`}
            className="focus-ring inline-flex items-center gap-2 font-poppins text-sm text-white/60
                       hover:text-bright-cyan transition-colors duration-200"
          >
            <Mail size={15} className="text-bright-cyan" />
            <span className="break-all">{member.email}</span>
          </a>
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={next}
          aria-label="Next member"
          className="focus-ring shrink-0 w-11 h-11 rounded-full border border-bio-cyan/40 text-bright-cyan
                     flex items-center justify-center hover:bg-bio-cyan/10 hover:border-bright-cyan
                     hover:shadow-cyan-glow transition-all duration-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2.5 mt-7">
        {members.map((m, i) => (
          <button
            key={m.email}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show ${m.name}`}
            aria-current={i === index}
            className={`focus-ring h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-7 bg-bright-cyan shadow-cyan-glow' : 'w-2 bg-white/25 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
