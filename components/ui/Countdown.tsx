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

function Pad({ n }: { n: number }) {
  return String(n).padStart(2, '0')
}

export default function Countdown() {
  const [t, setT] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { label: 'Days',    value: t.days    },
    { label: 'Hours',   value: t.hours   },
    { label: 'Minutes', value: t.minutes },
    { label: 'Seconds', value: t.seconds },
  ]

  return (
    <div className="flex items-center gap-3 sm:gap-5">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-3 sm:gap-5">
          <div className="text-center">
            <div className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white glow-text-cyan tabular-nums leading-none">
              <Pad n={value} />
            </div>
            <div className="font-display text-bright-cyan text-[10px] sm:text-xs tracking-[0.25em] uppercase mt-1">
              {label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="font-display text-2xl sm:text-3xl text-bright-cyan/40 font-bold leading-none mb-3">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
