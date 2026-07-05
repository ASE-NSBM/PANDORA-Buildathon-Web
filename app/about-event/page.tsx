import EventContent from '@/components/EventContent'

export default function AboutEventPage() {
  return (
    <div className="relative min-h-screen bg-deep-ocean text-white overflow-x-hidden selection:bg-bright-cyan/30">

      {/* Background Glows */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[40%] bg-glow-cyan pointer-events-none opacity-40" />
      <div className="absolute top-[60%] right-[-10%] w-[50%] h-[40%] bg-glow-purple pointer-events-none opacity-30" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[50vh] flex items-center">
        <video
          src="/vids/clip2.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-deep-ocean/65" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-display text-bright-cyan text-xs tracking-[0.3em] uppercase mb-4">
            Discover More
          </p>
          <h1 className="section-heading text-4xl sm:text-5xl md:text-6xl mb-4">
            About the Event
          </h1>

          <p className="font-poppins text-white/60 max-w-xl mx-auto">
            Everything you need to know about BuilderThan 2026.
          </p>
        </div>
      </section>

      {/* Shared event body */}
      <div className="relative border-t border-white/10">
        <EventContent />
      </div>
    </div>
  )
}
