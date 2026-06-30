import { Github, Instagram, Facebook, Youtube, ExternalLink } from 'lucide-react'

const socialLinks = [
  { icon: Facebook,  href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Github,    href: '#', label: 'GitHub' },
  { icon: Youtube,   href: '#', label: 'YouTube' },
]

export default function AboutOrganizerPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-glow-purple opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-cinzel text-bright-cyan text-xs tracking-[0.3em] uppercase mb-4">
            Meet the Team
          </p>
          <h1 className="section-heading text-5xl md:text-6xl mb-4">About the Organizer</h1>
          <p className="font-poppins text-white/50 max-w-xl mx-auto">
            BuilderThan is proudly organized by the Association of Software Engineering (ASE) Club under Pandora.
          </p>
        </div>
      </section>

      {/* Club intro */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Content */}
            <div>
              <h2 className="section-subheading mb-2">ASE Club</h2>
              <h3 className="font-cinzel font-bold text-white text-2xl mb-6">
                Association of Software Engineering
              </h3>
              <p className="font-poppins text-white/60 leading-relaxed mb-8">
                The Association of Software Engineering (ASE) Club is the official student body for Software Engineering
                under Pandora. We aim to empower students by creating opportunities to learn, connect and grow through
                technical and non-technical activities.
              </p>
              <a href="#" className="btn-outline inline-flex items-center gap-2">
                Learn More About ASE
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Logo placeholder */}
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full glass-card glow-border-cyan flex items-center justify-center">
                <div className="text-center">
                  <div className="font-cinzel font-bold text-bright-cyan text-4xl mb-1">ASE</div>
                  <div className="font-poppins text-white/40 text-xs tracking-[0.3em] uppercase">Club</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            <div className="glass-card p-8">
              <h3 className="font-cinzel font-bold text-bright-cyan text-xl mb-4">Vision</h3>
              <p className="font-poppins text-white/60 leading-relaxed">
                To be the leading student organization that nurtures innovation and technical excellence
                among Software Engineering undergraduates.
              </p>
            </div>
            <div className="glass-card p-8">
              <h3 className="font-cinzel font-bold text-bright-cyan text-xl mb-4">Mission</h3>
              <p className="font-poppins text-white/60 leading-relaxed">
                To create an inclusive community that bridges academia and industry through meaningful
                events, workshops, and competitions like BuilderThan.
              </p>
            </div>
          </div>

          {/* Social */}
          <div className="text-center">
            <h3 className="section-subheading mb-8">Follow ASE Club</h3>
            <div className="flex justify-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-12 h-12 rounded-full glass-card glow-border-cyan flex items-center justify-center text-white/50 hover:text-bright-cyan hover:shadow-cyan-glow transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
