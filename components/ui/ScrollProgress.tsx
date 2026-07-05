'use client'

import { useEffect, useState } from 'react'

/**
 * Thin fixed progress bar at the top of the viewport, tracking whole-page
 * scroll. Reinforces the scroll-triggered storytelling pattern by giving
 * the reader a sense of how far through the narrative they are.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/5"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-bio-cyan to-bright-cyan shadow-cyan-glow origin-left"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
