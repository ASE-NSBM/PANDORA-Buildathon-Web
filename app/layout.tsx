import type { Metadata } from 'next'
import { Poppins, Inter, Cinzel } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/SiteChrome'
import JellyfishLoader from '@/components/ui/JellyfishLoader'
import { Toaster } from "@/components/ui/sonner"

// Trajan-style display serif per the Pandora design spec (Cinzel / Trajan Pro)
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pandora 2026 | ASE',
  description:
    'Pandora 2026: Build Beyond Imagination. A competitive challenge for innovators, dreamers and builders. 5th August 2026, NSBM Green University.',
  keywords: ['Pandora 2026', 'Pandora', 'ASE', 'buildathon', 'hackathon', 'competition', 'Sri Lanka'],
  openGraph: {
    title: 'Pandora 2026 | ASE',
    description: 'A competitive challenge for innovators, dreamers and builders.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-poppins bg-deep-ocean text-white antialiased">
        <JellyfishLoader />
        <SiteChrome>{children}</SiteChrome>
        <Toaster />
      </body>
    </html>
  )
}
