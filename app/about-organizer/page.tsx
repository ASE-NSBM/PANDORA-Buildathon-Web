import Image from 'next/image'
import { Instagram, Facebook, Linkedin, ExternalLink } from 'lucide-react'

const socialLinks = [
  { icon: Facebook,  href: 'https://www.facebook.com/ase.nsbm/',      label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/ase.nsbm/',     label: 'Instagram' },
  { icon: Linkedin,  href: 'https://www.linkedin.com/company/asensbm', label: 'LinkedIn' },
]

export default function AboutOrganizerPage() {
  return (
    <>
      {/* Hero with video background */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[50vh] flex items-center">
        <video
          src="/vids/clip3.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-deep-ocean/65" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-display text-bright-cyan text-xs tracking-[0.3em] uppercase mb-4">
            Meet the Team
          </p>
          <h1 className="section-heading text-4xl sm:text-5xl md:text-6xl mb-4">About the Organizer</h1>
          <p className="font-poppins text-white/60 max-w-xl mx-auto">
            Buildathon is proudly organized by the Association of Software Engineering (ASE) Club under Pandora.
          </p>
        </div>
      </section>

      {/* Club content */}
      <section className="py-16 bg-deep-ocean">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="section-subheading mb-2">ASE Club</h2>
              <h3 className="font-display font-bold text-white text-2xl mb-6">
                Association of Software Engineering
              </h3>
              <p className="font-poppins text-white/60 leading-relaxed mb-8">
                The Association of Software Engineering (ASE) Club is the official student body for Software Engineering
                under Pandora. We aim to empower students by creating opportunities to learn, connect and grow through
                technical and non-technical activities.
              </p>
              <a
                href="https://asensbm.live/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                Learn More About ASE
                <ExternalLink size={16} />
              </a>
            </div>

            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full glass-card glow-border-cyan flex items-center justify-center p-6 animate-float">
                <Image
                  src="/ase-logo.jpg"
                  alt="ASE Club logo"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain rounded-full"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            <div className="glass-card glow-border-cyan border-l-4 border-l-bright-cyan p-8 hover:scale-[1.01] hover:shadow-cyan-glow transition-all duration-300">
              <h3 className="font-display font-bold text-bright-cyan text-xl mb-4">Vision</h3>
              <p className="font-poppins text-white/60 leading-relaxed">
                To be the leading student organization that nurtures innovation and technical excellence
                among Software Engineering undergraduates.
              </p>
            </div>
            <div className="glass-card glow-border-cyan border-l-4 border-l-bright-cyan p-8 hover:scale-[1.01] hover:shadow-cyan-glow transition-all duration-300">
              <h3 className="font-display font-bold text-bright-cyan text-xl mb-4">Mission</h3>
              <p className="font-poppins text-white/60 leading-relaxed">
                To create an inclusive community that bridges academia and industry through meaningful
                events, workshops, and competitions like Buildathon.
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
                  target="_blank"
                  rel="noopener noreferrer"
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
