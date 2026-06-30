'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export interface StorySection {
  src: string
  overlay?: number
  content: ReactNode
}

const TRANSITION_MS = 700

export default function VideoStory({ sections }: { sections: StorySection[] }) {
  const [index, setIndex]     = useState(0)
  const [ended, setEnded]     = useState(false)
  const [progress, setProgress] = useState(0)
  const [released, setReleased] = useState(false)

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const locked    = useRef(false)
  const last      = sections.length - 1

  const goTo = (i: number) => {
    if (i < 0 || i > last || locked.current) return
    locked.current = true
    setIndex(i)
    setEnded(false)
    setProgress(0)
    window.setTimeout(() => { locked.current = false }, TRANSITION_MS + 50)
  }

  // Play active clip from start, pause + reset others
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === index) {
        v.currentTime = 0
        const p = v.play()
        if (p) p.catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [index])

  // Scroll-jack: wheel
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const down = e.deltaY > 0

      // Released zone (footer visible below) — only re-engage at very top scrolling up
      if (released) {
        if (window.scrollY <= 0 && !down) {
          setReleased(false)
          e.preventDefault()
        }
        return
      }

      // At last section, finished -> release to let page scroll to footer
      if (index === last && ended && down) {
        setReleased(true)
        return // do NOT preventDefault: let native scroll begin
      }

      e.preventDefault()
      if (locked.current) return

      if (down) {
        if (ended && index < last) goTo(index + 1)
      } else {
        if (index > 0) goTo(index - 1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [index, ended, released, last])

  // Scroll-jack: touch
  useEffect(() => {
    let startY = 0

    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY }

    const onTouchMove = (e: TouchEvent) => {
      if (released && window.scrollY > 0) return
      // block native scroll while in story
      if (!(released && window.scrollY > 0)) e.preventDefault()
    }

    const onTouchEnd = (e: TouchEvent) => {
      const delta = startY - e.changedTouches[0].clientY
      if (Math.abs(delta) < 40) return
      const down = delta > 0

      if (released) {
        if (window.scrollY <= 0 && !down) setReleased(false)
        return
      }
      if (index === last && ended && down) { setReleased(true); return }
      if (locked.current) return
      if (down) {
        if (ended && index < last) goTo(index + 1)
      } else {
        if (index > 0) goTo(index - 1)
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [index, ended, released, last])

  return (
    <section className="h-screen overflow-hidden relative">
      {/* Track */}
      <div
        className="will-change-transform"
        style={{
          transform: `translateY(-${index * 100}vh)`,
          transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
        }}
      >
        {sections.map((s, i) => (
          <div key={i} className="h-screen w-full relative overflow-hidden">
            <video
              ref={(el) => { videoRefs.current[i] = el }}
              src={s.src}
              muted
              playsInline
              preload="auto"
              onEnded={() => { if (i === index) setEnded(true) }}
              onTimeUpdate={(e) => {
                if (i !== index) return
                const v = e.currentTarget
                if (v.duration) setProgress(v.currentTime / v.duration)
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-deep-ocean pointer-events-none"
              style={{ opacity: s.overlay ?? 0.55 }}
            />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
              {s.content}
            </div>
          </div>
        ))}
      </div>

      {/* Playback progress bar */}
      <div className="fixed top-16 left-0 right-0 z-40 h-[2px] bg-white/10">
        <div
          className="h-full bg-bright-cyan shadow-cyan-glow transition-[width] duration-150 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Section dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
        {sections.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === index ? 'bg-bright-cyan shadow-cyan-glow scale-125' : 'bg-white/25'
            }`}
          />
        ))}
      </div>

      {/* Scroll hint — only when current clip finished */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 transition-opacity duration-500 ${
          ended ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="font-inter text-[10px] tracking-[0.3em] uppercase text-bright-cyan/80">
          {index === last ? 'Continue' : 'Scroll'}
        </span>
        <ChevronDown size={18} className="text-bright-cyan animate-bounce" />
      </div>
    </section>
  )
}
