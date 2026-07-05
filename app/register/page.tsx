import RegisterForm from '@/components/RegisterForm'

export default function RegisterPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden min-h-[38vh] flex items-center">
        <video src="/vids/clip4.mp4" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-deep-ocean/72" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
          <p className="font-display text-bright-cyan text-xs tracking-[0.3em] uppercase mb-4">Join BuilderThan 2026</p>
          <h1 className="section-heading text-5xl md:text-6xl mb-4">Assemble Your Crew</h1>
          <p className="font-poppins text-white/50 max-w-lg mx-auto">
            Name your team, choose your crew size, and fill in every member&apos;s details to secure your spot.
          </p>
        </div>
      </section>

      {/* Registration form (shared with home page) */}
      <section className="bg-deep-ocean">
        <RegisterForm />
      </section>
    </>
  )
}
