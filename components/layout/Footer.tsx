import Link from 'next/link'
import { Github, Instagram, Facebook, Linkedin } from 'lucide-react'

const quickLinks = [
  { label: 'Home',            href: '/' },
  { label: 'About Event',     href: '/about-event' },
  { label: 'About Organizer', href: '/about-organizer' },
  { label: 'Register',        href: '/register' },
  { label: 'Contact',         href: 'mailto:scse.nsbm@gmail.com' },
]

const socialLinks = [
  { icon: Facebook,  href: 'https://www.facebook.com/ase.nsbm/',      label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/ase.nsbm/',     label: 'Instagram' },
  { icon: Linkedin,  href: 'https://www.linkedin.com/company/asensbm', label: 'LinkedIn' },
  { icon: Github,    href: 'https://github.com/ASE-NSBM',             label: 'GitHub' },
]

export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 bg-midnight-blue/70 backdrop-blur-md border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-bio-cyan/20 border border-bio-cyan/50 flex items-center justify-center">
                <span className="text-bright-cyan text-xs font-papyrus font-bold">P</span>
              </div>
              <span className="font-papyrus font-bold text-white text-lg tracking-wider">PANDORA</span>
            </div>
            <p className="font-poppins text-sm text-white/50 leading-relaxed">
              Explore. Connect. Create.<br />Build beyond imagination.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-papyrus font-semibold text-bright-cyan text-xs tracking-[0.2em] uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-poppins text-sm text-white/50 hover:text-bright-cyan transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-papyrus font-semibold text-bright-cyan text-xs tracking-[0.2em] uppercase mb-4">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-bright-cyan hover:border-bright-cyan hover:shadow-cyan-glow transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-papyrus font-semibold text-bright-cyan text-xs tracking-[0.2em] uppercase mb-4">
              Contact Us
            </h4>
            <div className="space-y-2 font-poppins text-sm text-white/50">
              <p>builderthan@pandora.lk</p>
              <p>+94 77 123 4567</p>
              <p>Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-poppins text-xs text-white/30">© 2026 Pandora. All rights reserved.</p>
          <p className="font-poppins text-xs text-white/30">Designed with ♥ for innovators.</p>
        </div>
      </div>
    </footer>
  )
}
