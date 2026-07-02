'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/PageTransition'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin  = pathname?.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <Navbar />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  )
}
