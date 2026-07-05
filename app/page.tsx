import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight, Zap, Code2, BookOpen, Trophy, Mail, Phone } from 'lucide-react'
import ScrollScrubBackground from '@/components/ui/ScrollScrubBackground'
import FlowFieldOverlay from '@/components/ui/FlowFieldOverlay'
import ScrollProgress from '@/components/ui/ScrollProgress'
import Countdown from '@/components/ui/Countdown'
import Reveal from '@/components/ui/Reveal'
import TypewriterText from '@/components/ui/TypewriterText'
import { DiaTextReveal } from '@/components/ui/dia-text-reveal'
import AnimatedTestimonials from '@/components/ui/AnimatedTestimonials'
import EventContent from '@/components/EventContent'
import RegisterForm from '@/components/RegisterForm'

// Bioluminescent sweep palette for DiaTextReveal (ice-blue → bright-cyan → bio-cyan)
const REVEAL_COLORS = ['#A3F7FF', '#64E6FF', '#24A3C7']

const whyParticipate = [
  { icon: Zap,      title: 'Real World Impact', description: 'Solve meaningful problems that create impact.' },
  { icon: Code2,    title: 'Innovate & Create', description: 'Bring your ideas to life with cutting-edge tech.' },
  { icon: BookOpen, title: 'Learn & Grow',       description: 'Learn from experts and grow your skills.' },
  { icon: Trophy,   title: 'Win Rewards',        description: 'Exciting prizes and recognition await.' },
]

const committee = [
  { role: 'President',      name: 'Samsudeen Ashad',        email: 'samsudeenashad@gmail.com' },
  { role: 'Vice President', name: 'Nethum Bashitha',        email: 'bashithanethum4@gmail.com' },
  { role: 'Vice President', name: 'Dilara Wickramanayake',  email: 'dilarawickramanayake@gmail.com' },
  { role: 'Secretary',      name: 'Hirushi Nethmini',       email: 'hirushinethmini5@gmail.com' },
]

/** Small HUD chapter marker, e.g. "01 / HERO" */
function SectionIndex({ n, label }: { n: string; label: string }) {
  return (
    <span className="hud-index">
      {n} <span className="text-white/25">/</span> {label}
    </span>
  )
}

export default function HomePage() {
  return (
    <div className="relative">
      {/* Whole-page scroll progress indicator (storytelling pattern) */}
      <ScrollProgress />

      {/* Pinned video — scrubbed by total page scroll */}
      <ScrollScrubBackground src="/vids/story.mp4" overlay={0.62} />

      {/* Ambient flow-field particles over the video (below content) */}
      <FlowFieldOverlay />

      {/* Content scrolls over the locked video */}
      <div id="scrub-track" className="relative z-10">

        {/* ── 1: Hero ── */}
        <section className="relative min-h-dvh flex flex-col items-center justify-center text-center px-6 sm:px-12 lg:px-20 pt-28 pb-20">
          <div className="pointer-events-none absolute inset-0 hud-grid" aria-hidden="true" />
          <Reveal className="relative flex flex-col items-center w-full max-w-4xl mx-auto">
            <Image
              src="/logo-Pandora.png"
              alt="Pandora"
              width={1201}
              height={239}
              priority
              className="mb-6 h-8 w-auto drop-shadow-[0_0_20px_rgba(100,230,255,0.45)] sm:h-12 md:h-16"
            />
            <h1 className="font-display font-bold text-[clamp(2rem,7.5vw,6rem)] mb-4 tracking-wider leading-none drop-shadow-[0_0_45px_rgba(100,230,255,0.35)]">
              <TypewriterText
                words={['BUILDERTHON']}
                typingMs={110}
                holdMs={3500}
                className="text-gradient-cyan"
              />
            </h1>
            <p className="font-display text-base md:text-lg tracking-[0.35em] uppercase mb-8">
              <DiaTextReveal
                text="Build Beyond Imagination"
                colors={REVEAL_COLORS}
                textColor="#64E6FF"
                delay={0.3}
              />
            </p>
            <Countdown />
            <p className="font-poppins text-white/80 text-base md:text-lg max-w-xl mx-auto mt-8 mb-10">
              A competitive challenge for{' '}
              <TypewriterText
                words={['innovators.', 'dreamers.', 'builders.']}
                className="text-bright-cyan font-semibold"
              />
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12 font-poppins text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-bright-cyan" />
                <span>5th August 2026 · 10 AM – 5 PM</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-bright-cyan" />
                <span>NSBM Green University</span>
              </div>
            </div>
            <Link href="/register" className="btn-primary focus-ring inline-flex items-center gap-2 text-base px-8 py-4 group">
              Register Now
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </section>

        {/* ── 2: About ── */}
        <section className="min-h-dvh flex items-center px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl w-full mx-auto glass-card glow-border-cyan border-l-4 border-l-bright-cyan p-8 md:p-10 text-center">
            <div className="mb-4">
              <SectionIndex n="01" label="About the Event" />
            </div>
            <h2 className="section-heading mb-6">
              <DiaTextReveal text="BuilderThan" colors={REVEAL_COLORS} textColor="#FFFFFF" />
            </h2>
            <p className="font-poppins text-white/85 leading-relaxed text-lg mb-8">
              BuilderThan is a platform for passionate minds to solve real-world problems and build
              innovative solutions. Dive into the journey of creativity, collaboration and impact.
            </p>
            <Link href="/about-event" className="btn-outline focus-ring inline-flex items-center gap-2 group">
              Explore Event
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </section>

        {/* ── 3: Why Participate ── */}
        <section className="min-h-dvh flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl w-full mx-auto text-center">
            <Reveal className="flex flex-col items-center mb-12">
              <SectionIndex n="02" label="Why Join" />
              <h2 className="section-heading mt-4">
                <DiaTextReveal text="Why Participate?" colors={REVEAL_COLORS} textColor="#FFFFFF" />
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyParticipate.map(({ icon: Icon, title, description }, i) => (
                <Reveal key={title} delay={i * 90}>
                  <div
                    className="glass-card glow-border-cyan border-l-4 border-l-bright-cyan p-6 text-center group h-full
                               hover:shadow-cyan-glow hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-bio-cyan/10 border border-bio-cyan/30 flex items-center justify-center mx-auto mb-4 group-hover:border-bright-cyan group-hover:shadow-cyan-glow transition-all duration-300">
                      <Icon size={20} className="text-bright-cyan" />
                    </div>
                    <h3 className="font-display font-semibold text-white text-sm mb-2">{title}</h3>
                    <p className="font-poppins text-white/70 text-sm leading-relaxed">{description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3.5: Full event details (shared with /about-event) ── */}
        <EventContent />

        {/* ── 4: Final CTA ── */}
        <section className="min-h-dvh flex flex-col items-center justify-center text-center px-4">
          <Reveal className="flex flex-col items-center glass-card glow-border-cyan border-l-4 border-l-bright-cyan w-full max-w-3xl px-6 py-12 sm:px-12 md:py-16">
            <div className="mb-6">
              <SectionIndex n="03" label="Ready to Build?" />
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-6 glow-text-cyan">
              <DiaTextReveal text="Join BuilderThan 2026" colors={REVEAL_COLORS} textColor="#FFFFFF" />
            </h2>
            <p className="font-poppins text-white/80 max-w-xl mx-auto mb-10 text-lg">
              Secure your team&apos;s spot before registration closes.
            </p>
            <Link href="/register" className="btn-primary focus-ring inline-flex items-center gap-2 text-base px-10 py-4 group">
              Register Now
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </section>

        {/* ── 4.5: Registration form (shared with /register) ── */}
        <section id="register" className="scroll-mt-20 px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-5xl mx-auto text-center pt-8">
            <div className="flex justify-center mb-4">
              <SectionIndex n="04" label="Join BuilderThan 2026" />
            </div>
            <h2 className="section-heading text-4xl md:text-5xl mb-4">
              <DiaTextReveal text="Assemble Your Crew" colors={REVEAL_COLORS} textColor="#FFFFFF" />
            </h2>
            <p className="font-poppins text-white/70 max-w-lg mx-auto">
              Name your team, choose your crew size, and fill in every member&apos;s details to secure your spot.
            </p>
          </Reveal>
          <RegisterForm />
        </section>

        {/* ── 5: Contact ── */}
        <section id="contact-team" className="min-h-dvh flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-7xl w-full mx-auto text-center">
            <Reveal className="flex flex-col items-center mb-6">
              <SectionIndex n="05" label="Get in Touch" />
              <h2 className="section-heading mt-4">
                <DiaTextReveal text="Contact Us" colors={REVEAL_COLORS} textColor="#FFFFFF" />
              </h2>
            </Reveal>

            {/* Shared contact channels */}
            <Reveal className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-14 font-poppins text-sm text-white/80">
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

            {/* Committee — animated testimonials style */}
            <Reveal>
              <AnimatedTestimonials members={committee} />
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  )
}
