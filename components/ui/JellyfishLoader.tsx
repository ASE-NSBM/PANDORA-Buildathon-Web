'use client'

import { useEffect, useState } from 'react'

const MIN_SHOW_MS = 1600
const FADE_MS = 600

/**
 * Full-screen bioluminescent jellyfish splash shown while the page loads.
 * Stays up until the window `load` event AND a minimum display time, then
 * fades out and unmounts. Only appears on hard loads (layout mount) — SPA
 * navigations never remount it.
 */
export default function JellyfishLoader() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let fadeTimer: ReturnType<typeof setTimeout>
    let goneTimer: ReturnType<typeof setTimeout>
    const started = performance.now()

    const dismiss = () => {
      const elapsed = performance.now() - started
      fadeTimer = setTimeout(() => {
        setFading(true)
        goneTimer = setTimeout(() => setGone(true), FADE_MS)
      }, Math.max(0, MIN_SHOW_MS - elapsed))
    }

    if (document.readyState === 'complete') dismiss()
    else {
      window.addEventListener('load', dismiss, { once: true })
    }
    // Safety net: never trap the user on the splash.
    const failsafe = setTimeout(dismiss, 6000)

    return () => {
      window.removeEventListener('load', dismiss)
      clearTimeout(fadeTimer)
      clearTimeout(goneTimer)
      clearTimeout(failsafe)
    }
  }, [])

  if (gone) return null

  return (
    <div
      role="status"
      aria-label="Loading Pandora"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep-ocean transition-opacity"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms`, pointerEvents: fading ? 'none' : 'auto' }}
    >
      {/* Ambient glow behind the jellyfish */}
      <div className="absolute w-72 h-72 rounded-full bg-glow-cyan animate-glow-pulse" aria-hidden="true" />

      {/* Jellyfish */}
      <svg
        width="140"
        height="170"
        viewBox="0 0 140 170"
        fill="none"
        aria-hidden="true"
        className="jelly-float relative drop-shadow-[0_0_25px_rgba(100,230,255,0.45)]"
      >
        <defs>
          <radialGradient id="jellyBell" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#A3F7FF" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#64E6FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#24A3C7" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {/* Bell — gentle pulse */}
        <g className="jelly-pulse" style={{ transformOrigin: '70px 45px' }}>
          <path
            d="M20 55 C20 22 42 8 70 8 C98 8 120 22 120 55 C120 64 109 70 70 70 C31 70 20 64 20 55 Z"
            fill="url(#jellyBell)"
            stroke="rgba(163,247,255,0.6)"
            strokeWidth="1.5"
          />
          {/* Inner glow dots */}
          <circle cx="52" cy="34" r="3" fill="#A3F7FF" opacity="0.9" />
          <circle cx="70" cy="26" r="2.4" fill="#A3F7FF" opacity="0.7" />
          <circle cx="88" cy="36" r="2.8" fill="#A3F7FF" opacity="0.8" />
        </g>

        {/* Tentacles — staggered sway */}
        {[34, 48, 62, 76, 90, 104].map((x, i) => (
          <path
            key={x}
            className="jelly-tentacle"
            style={{ animationDelay: `${i * 0.22}s`, transformOrigin: `${x}px 70px` }}
            d={`M${x} 70 C ${x - 5} 95, ${x + 6} 115, ${x - 3} 150`}
            stroke="rgba(100,230,255,0.55)"
            strokeWidth={i % 2 ? 2 : 2.8}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </svg>

      {/* Loading label + shimmer bar */}
      <p className="relative font-display text-bright-cyan/90 text-xs tracking-[0.45em] uppercase mt-10 mb-4">
        Loading
      </p>
      <div className="relative w-40 h-[3px] rounded-full bg-white/10 overflow-hidden" aria-hidden="true">
        <div className="jelly-shimmer absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-bright-cyan to-transparent" />
      </div>
    </div>
  )
}
