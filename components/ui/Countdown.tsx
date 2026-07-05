'use client'

import { useEffect, useState } from 'react'

const TARGET = new Date('2026-08-05T10:00:00')

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function Countdown() {
  // Start null so server and first client render match (avoids hydration drift),
  // then hydrate the live value on mount.
  const [t, setT] = useState<ReturnType<typeof getTimeLeft> | null>(null)

  useEffect(() => {
    setT(getTimeLeft())
    const id = setInterval(() => setT(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { label: 'Days',    value: t?.days    },
    { label: 'Hours',   value: t?.hours   },
    { label: 'Minutes', value: t?.minutes },
    { label: 'Seconds', value: t?.seconds },
  ]

  const label = t
    ? `${t.days} days, ${t.hours} hours, ${t.minutes} minutes and ${t.seconds} seconds until the event`
    : 'Countdown to the event'

  return (
    <div
      className="flex items-stretch gap-2 sm:gap-4"
      role="timer"
      aria-live="off"
      aria-label={label}
    >
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="hud-corners glass-card glow-border-cyan flex flex-col items-center justify-center
                     px-3 py-3 sm:px-5 sm:py-4 min-w-[64px] sm:min-w-[84px]"
        >
          <span className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white glow-text-cyan tabular-nums leading-none">
            {value === undefined ? '––' : pad(value)}
          </span>
          <span className="font-poppins text-bright-cyan/70 text-[9px] sm:text-[10px] tracking-[0.28em] uppercase mt-2">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
