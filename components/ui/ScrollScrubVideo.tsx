'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ScrollScrubVideoProps {
  src: string
  children?: ReactNode
  /** Total scroll distance the section occupies. Longer = slower scrub. */
  scrollHeight?: string
  /** Dark overlay opacity over the video (0–1). */
  overlay?: number
  /** Interpolation smoothing (0–1). Lower = smoother/laggier follow. */
  ease?: number
  contentClassName?: string
  id?: string
}

export default function ScrollScrubVideo({
  src,
  children,
  scrollHeight = '300vh',
  overlay = 0.55,
  ease = 0.12,
  contentClassName = '',
  id,
}: ScrollScrubVideoProps) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const wrap  = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return

    video.pause()

    let raf = 0
    let displayed = 0   // smoothed currentTime we drive the video to
    let active = true   // rAF runs only while section is on screen

    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

    const tick = () => {
      const dur = video.duration
      if (dur && Number.isFinite(dur)) {
        const rect       = wrap.getBoundingClientRect()
        const scrollable = wrap.offsetHeight - window.innerHeight
        const progress   = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0
        const target     = progress * dur

        // Smoothly approach target; snap when very close.
        displayed += (target - displayed) * ease
        if (Math.abs(target - displayed) < 0.001) displayed = target

        // Only issue a seek if the previous one finished — prevents seek stacking (the lag).
        if (!video.seeking && Math.abs(video.currentTime - displayed) > 1 / 30) {
          video.currentTime = displayed
        }
      }
      if (active) raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!active) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    // Run rAF only when the section is in/near the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting
        if (active) start()
        else cancelAnimationFrame(raf)
      },
      { rootMargin: '100px' }
    )
    io.observe(wrap)

    if (video.readyState >= 1) start()
    else video.addEventListener('loadedmetadata', start, { once: true })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      video.removeEventListener('loadedmetadata', start)
    }
  }, [ease])

  return (
    <div ref={wrapRef} id={id} style={{ height: scrollHeight }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-deep-ocean pointer-events-none"
          style={{ opacity: overlay }}
        />
        <div className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-4 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
