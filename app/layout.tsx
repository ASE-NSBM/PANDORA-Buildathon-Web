import type { Metadata } from 'next'
import { Poppins, Inter, Cinzel } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/SiteChrome'
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
  title: 'BuilderThan 2026 | Pandora – ASE Club',
  description:
    'BuilderThan: Build Beyond Imagination. A competitive challenge for innovators, dreamers and builders. 15th–16th August 2026, Colombo, Sri Lanka.',
  keywords: ['BuilderThan', 'Pandora', 'ASE Club', 'hackathon', 'competition', 'Sri Lanka'],
  openGraph: {
    title: 'BuilderThan 2026 | Pandora – ASE Club',
    description: 'A competitive challenge for innovators, dreamers and builders.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-poppins bg-deep-ocean text-white antialiased">
        <SiteChrome>{children}</SiteChrome>
        <Toaster />
      </body>
    </html>
  )
}
