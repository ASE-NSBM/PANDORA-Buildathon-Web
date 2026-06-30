'use client'

import { useEffect, useRef } from 'react'

interface ScrollScrubBackgroundProps {
  src: string
  /** Dark overlay opacity over the video (0–1). */
  overlay?: number
  /** Interpolation smoothing (0–1). Lower = smoother trailing follow. */
  ease?: number
}

/**
 * Fixed, full-viewport video locked behind the page content.
 * Stays pinned while content scrolls over it; currentTime is scrubbed
 * to whole-page scroll progress (0 at top → duration at bottom).
 * Never autoplays — only scroll drives playback.
 */
export default function ScrollScrubBackground({
  src,
  overlay = 0.5,
  ease = 0.12,
}: ScrollScrubBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.pause()

    let raf = 0
    let displayed = 0
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

    const tick = () => {
      const dur = video.duration
      if (dur && Number.isFinite(dur)) {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0
        const target = progress * dur

        displayed += (target - displayed) * ease
        if (Math.abs(target - displayed) < 0.001) displayed = target

        // Skip while a seek is pending — prevents seek stacking (lag).
        if (!video.seeking && Math.abs(video.currentTime - displayed) > 1 / 30) {
          video.currentTime = displayed
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    if (video.readyState >= 1) start()
    else video.addEventListener('loadedmetadata', start, { once: true })

    return () => {
      cancelAnimationFrame(raf)
      video.removeEventListener('loadedmetadata', start)
    }
  }, [ease])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-deep-ocean" style={{ opacity: overlay }} />
    </div>
  )
}
