import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, Zap, Code2, BookOpen, Trophy } from 'lucide-react'
import ScrollScrubBackground from '@/components/ui/ScrollScrubBackground'

const whyParticipate = [
  { icon: Zap,      title: 'Real World Impact', description: 'Solve meaningful problems that create impact.' },
  { icon: Code2,    title: 'Innovate & Create', description: 'Bring your ideas to life with cutting-edge tech.' },
  { icon: BookOpen, title: 'Learn & Grow',       description: 'Learn from experts and grow your skills.' },
  { icon: Trophy,   title: 'Win Rewards',        description: 'Exciting prizes and recognition await.' },
]

export default function HomePage() {
  return (
    <div className="relative">
      {/* Pinned video — scrubbed by total page scroll */}
      <ScrollScrubBackground src="/vids/story.mp4" overlay={0.5} />

      {/* Content scrolls over the locked video */}
      <div id="scrub-track" className="relative z-10">

        {/* ── 1: Hero ── */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-bio-cyan/20 border border-bio-cyan/50 flex items-center justify-center">
              <span className="text-bright-cyan text-[10px] font-papyrus font-bold">P</span>
            </div>
            <span className="font-papyrus text-bright-cyan text-sm tracking-[0.3em] uppercase">Pandora</span>
          </div>
          <h1 className="font-papyrus font-bold text-6xl md:text-8xl lg:text-[9rem] text-white mb-4 glow-text-cyan tracking-wider leading-none">
            BUILDERTHAN
          </h1>
          <p className="font-papyrus text-base md:text-lg text-bright-cyan/80 tracking-[0.25em] uppercase mb-8">
            Build Beyond Imagination
          </p>
          <p className="font-poppins text-white/60 text-base md:text-lg max-w-xl mx-auto mb-10">
            A competitive challenge for innovators, dreamers and builders.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12 font-poppins text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-bright-cyan" />
              <span>15th – 16th August 2026</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-bright-cyan" />
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>
          <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
            Register Now
            <ArrowRight size={18} />
          </Link>
        </section>

        {/* ── 2: About ── */}
        <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto md:mx-0">
            <p className="font-papyrus text-bright-cyan text-xs tracking-[0.3em] uppercase mb-4">
              About the Event
            </p>
            <h2 className="section-heading mb-6">BuilderThan</h2>
            <p className="font-poppins text-white/70 leading-relaxed text-lg mb-8">
              BuilderThan is a platform for passionate minds to solve real-world problems and build
              innovative solutions. Dive into the journey of creativity, collaboration and impact.
            </p>
            <Link href="/about-event" className="btn-outline inline-flex items-center gap-2">
              Explore Event
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ── 3: Why Participate ── */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl w-full mx-auto text-center">
            <h2 className="section-heading mb-12">Why Participate?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyParticipate.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="glass-card glow-border-cyan p-6 text-center group hover:shadow-cyan-glow transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-bio-cyan/10 border border-bio-cyan/30 flex items-center justify-center mx-auto mb-4 group-hover:border-bright-cyan group-hover:shadow-cyan-glow transition-all duration-300">
                    <Icon size={20} className="text-bright-cyan" />
                  </div>
                  <h3 className="font-papyrus font-semibold text-white text-sm mb-2">{title}</h3>
                  <p className="font-poppins text-white/50 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4: Final CTA ── */}
        <section id="contact" className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <p className="font-papyrus text-bright-cyan text-xs tracking-[0.3em] uppercase mb-6">
            Ready to Build?
          </p>
          <h2 className="font-papyrus font-bold text-4xl md:text-6xl text-white mb-6 glow-text-cyan">
            Join BuilderThan 2026
          </h2>
          <p className="font-poppins text-white/60 max-w-xl mx-auto mb-10 text-lg">
            Secure your team&apos;s spot before registration closes.
          </p>
          <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
            Register Now
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </div>
  )
}
