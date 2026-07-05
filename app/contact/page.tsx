import { Mail, Phone } from 'lucide-react'
import ScrollScrubBackground from '@/components/ui/ScrollScrubBackground'
import FlowFieldOverlay from '@/components/ui/FlowFieldOverlay'
import Reveal from '@/components/ui/Reveal'
import { DiaTextReveal } from '@/components/ui/dia-text-reveal'
import MemberCards from '@/components/ui/MemberCards'
import { committee, developmentTeam } from '@/lib/team'

const REVEAL_COLORS = ['#A3F7FF', '#64E6FF', '#24A3C7']

export const metadata = {
  title: 'Contact | Buildathon 2026 – Pandora',
  description: 'Get in touch with the Buildathon 2026 organizing committee and development team.',
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden selection:bg-bright-cyan/30">
      {/* Pinned video background (matches the rest of the site) */}
      <ScrollScrubBackground src="/vids/story.mp4" overlay={0.62} />

      {/* Ambient flow-field particles over the video (below content) */}
      <FlowFieldOverlay />

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <Reveal className="flex flex-col items-center text-center mb-10">
          <p className="font-display text-bright-cyan text-xs tracking-[0.3em] uppercase mb-4">Get in Touch</p>
          <h1 className="section-heading text-4xl sm:text-5xl md:text-6xl">
            <DiaTextReveal text="Contact Us" colors={REVEAL_COLORS} textColor="#FFFFFF" />
          </h1>
          <p className="font-poppins text-white/60 max-w-xl mx-auto mt-4">
            Reach out to the team behind Buildathon 2026.
          </p>
        </Reveal>

        {/* Contact channels */}
        <Reveal className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-16 font-poppins text-sm text-white/80">
          <a
            href="mailto:ase@nsbm.ac.lk"
            className="focus-ring flex items-center gap-2 px-2 py-1 hover:text-bright-cyan transition-colors duration-200"
          >
            <Mail size={15} className="text-bright-cyan" />
            <span>ase@nsbm.ac.lk</span>
          </a>
          <div className="hidden sm:block w-px h-4 bg-white/20" />
          <a
            href="tel:+94718729888"
            className="focus-ring flex items-center gap-2 px-2 py-1 hover:text-bright-cyan transition-colors duration-200"
          >
            <Phone size={15} className="text-bright-cyan" />
            <span>+94 71 872 9888</span>
          </a>
        </Reveal>

        {/* Organizing committee */}
        <Reveal className="flex flex-col items-center mb-8">
          <h2 className="section-heading text-2xl sm:text-3xl">
            <DiaTextReveal text="Organizing Committee" colors={REVEAL_COLORS} textColor="#FFFFFF" />
          </h2>
        </Reveal>
        <Reveal>
          <MemberCards members={committee} columns={4} />
        </Reveal>

        {/* Development team */}
        <Reveal className="flex flex-col items-center mt-16 mb-8">
          <h2 className="section-heading text-2xl sm:text-3xl">
            <DiaTextReveal text="Development Team" colors={REVEAL_COLORS} textColor="#FFFFFF" />
          </h2>
        </Reveal>
        <Reveal>
          <MemberCards members={developmentTeam} columns={5} />
        </Reveal>
      </section>
    </div>
  )
}
