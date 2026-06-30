'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home',            href: '/' },
  { label: 'About Event',     href: '/about-event' },
  { label: 'About Organizer', href: '/about-organizer' },
  { label: 'Register',        href: '/register' },
  { label: 'Contact',         href: '#contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-deep-ocean/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-bio-cyan/20 border border-bio-cyan/50 flex items-center justify-center group-hover:shadow-cyan-glow transition-all duration-300">
              <span className="text-bright-cyan text-xs font-papyrus font-bold">P</span>
            </div>
            <span className="font-papyrus font-bold text-white text-lg tracking-wider">PANDORA</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-inter text-sm text-white/70 hover:text-bright-cyan transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link href="/register" className="hidden md:inline-flex btn-primary text-sm">
              Register Now
            </Link>
            <button
              className="md:hidden text-white/70 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-midnight-blue/95 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block font-inter text-sm text-white/70 hover:text-bright-cyan transition-colors duration-200 py-2 px-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/register"
              className="block btn-primary text-sm text-center"
              onClick={() => setMobileOpen(false)}
            >
              Register Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
