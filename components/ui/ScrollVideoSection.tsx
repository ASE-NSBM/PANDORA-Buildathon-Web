'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ScrollVideoSectionProps {
  src: string
  children: ReactNode
  scrollHeight?: string
  overlay?: number
  contentClassName?: string
  id?: string
}

export default function ScrollVideoSection({
  src,
  children,
  scrollHeight = '250vh',
  overlay = 0.55,
  contentClassName = '',
  id,
}: ScrollVideoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const video   = videoRef.current
    if (!section || !video) return

    const scrub = () => {
      if (!video.duration) return
      const rect       = section.getBoundingClientRect()
      const scrollable = section.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const progress   = Math.max(0, Math.min(1, -rect.top / scrollable))
      video.currentTime = progress * video.duration
    }

    window.addEventListener('scroll', scrub, { passive: true })
    video.addEventListener('loadedmetadata', scrub)

    return () => {
      window.removeEventListener('scroll', scrub)
      video.removeEventListener('loadedmetadata', scrub)
    }
  }, [])

  return (
    <div ref={sectionRef} id={id} style={{ height: scrollHeight }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-deep-ocean pointer-events-none"
          style={{ opacity: overlay }}
        />
        <div className={`relative z-10 h-full ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
