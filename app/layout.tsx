import type { Metadata } from 'next'
import { Cinzel, Poppins, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
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
    <html lang="en" className={`${cinzel.variable} ${poppins.variable} ${inter.variable}`}>
      <body className="font-poppins bg-deep-ocean text-white antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
