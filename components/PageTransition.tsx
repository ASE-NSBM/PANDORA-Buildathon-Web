'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.animate(
      [
        { opacity: 0 },
        { opacity: 1 },
      ],
      { duration: 350, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'none' }
    )
  }, [pathname])

  return <div ref={ref}>{children}</div>
}
