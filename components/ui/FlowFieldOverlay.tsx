'use client'

import { useEffect, useState } from 'react'
import FlowFieldBackground from '@/components/ui/flow-field-background'

/**
 * Ambient flow-field particle layer that sits above the scrubbed background
 * video but below the page content. Uses mix-blend-screen so the canvas's
 * black trail fill disappears and only the cyan particles glow additively
 * over the video. Skipped entirely under prefers-reduced-motion.
 */
export default function FlowFieldOverlay() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setEnabled(!mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (!enabled) return null

  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none mix-blend-screen opacity-70"
      aria-hidden="true"
    >
      <FlowFieldBackground
        className="!bg-transparent"
        color="#64E6FF"
        trailOpacity={0.12}
        particleCount={420}
        speed={0.9}
      />
    </div>
  )
}
