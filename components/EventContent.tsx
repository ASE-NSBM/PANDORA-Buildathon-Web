'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Target,
  Users,
  Shield,
  Award,
  HelpCircle,
  Trophy,
  Compass,
  Zap,
  CheckCircle2
} from 'lucide-react'
import { DiaTextReveal } from '@/components/ui/dia-text-reveal'

// Bioluminescent sweep palette (matches the home page headings)
const REVEAL_COLORS = ['#A3F7FF', '#64E6FF', '#24A3C7']

const OBJECTIVES = [
  {
    icon: Compass,
    title: 'Explore & Innovate',
    description: 'Dive deep into uncharted technical waters to solve real-world industry challenges.'
  },
  {
    icon: Users,
    title: 'Collaborate',
    description: 'Work in diverse teams of 1 to 4 to co-create, learn, and grow together under pressure.'
  },
  {
    icon: Zap,
    title: 'Rapid Prototyping',
    description: 'Accelerate your ideas from concept to a functioning prototype in a single build day.'
  },
  {
    icon: Target,
    title: 'Real Impact',
    description: 'Design solutions that address real needs and present them to a panel of expert judges.'
  }
]

const TIMELINE = [
  {
    date: 'July 2026',
    title: 'Registration Launch',
    desc: 'Assemble your team of builders and secure your spot in the depths of innovation.',
    status: 'Upcoming'
  },
  {
    date: 'August 3, 2026',
    title: 'Registration Deadline',
    desc: 'Team registrations close. Ensure all member profiles are fully submitted.',
    status: 'Upcoming'
  },
  {
    date: 'Aug 5 · Morning',
    title: 'Kickoff & Build Session',
    desc: 'Opening ceremony, challenge briefing, and the start of the one-day build session.',
    status: 'Buildathon'
  },
  {
    date: 'Aug 5 · Evening',
    title: 'Pitching & Awards',
    desc: 'Teams submit their projects and present live demos to judges. Winners announced at the closing ceremony.',
    status: 'Awards'
  }
]

const SCHEDULE = [
  { time: '08:30 AM', title: 'Registration & Opening Ceremony', desc: 'Welcome desk check-in, credential collection, and the official opening of the event.' },
  { time: '09:00 AM', title: 'Welcome Address & Introduction', desc: 'Introduction by the ASE and guest speeches to kick off the Buildathon.' },
  { time: '09:30 AM', title: 'Challenge Briefing & Rules', desc: 'The challenge domains and evaluation criteria are revealed, with a full rules briefing.' },
  { time: '10:00 AM', title: 'Buildathon Officially Begins', desc: 'Building starts. Teams begin turning their ideas into working prototypes.' },
  { time: '12:30 PM', title: 'Lunch Break', desc: 'Refuel and regroup before the afternoon development session.' },
  { time: '01:30 PM', title: 'Development Session Continues', desc: 'Teams keep building, with mentors on hand for technical guidance.' },
  { time: '04:00 PM', title: 'Project Submission Deadline', desc: 'All repositories must be pushed. Late submissions will not be accepted.' },
  { time: '04:15 PM', title: 'Team Presentations & Demonstrations', desc: 'Teams present live demos of their solutions to the panel of judges.' },
  { time: '05:30 PM', title: 'Judges’ Deliberation', desc: 'Judges score the submissions and verify the final results.' },
  { time: '06:00 PM', title: 'Awards Ceremony & Closing Remarks', desc: 'Prizes, trophies, certificates, and closing photography.' }
]

const PRIZES = [
  {
    rank: '2nd Place',
    amount: 'Rs. 20,000',
    perks: ['Silver Trophies', 'Individual Certificates', 'ASE Premium Merch'],
    glowClass: 'shadow-[0_0_20px_rgba(163,247,255,0.25)] border-ice-blue/30',
    badgeBg: 'bg-ice-blue/10 text-ice-blue'
  },
  {
    rank: '1st Place',
    amount: 'Rs. 30,000',
    perks: ['Champion Gold Trophies', 'Winner Certificates', 'Direct Incubation Opportunity', 'ASE Premium Merch'],
    glowClass: 'shadow-[0_0_30px_rgba(100,230,255,0.4)] border-bright-cyan/50 scale-105 z-10',
    badgeBg: 'bg-bright-cyan/25 text-bright-cyan font-bold ring-1 ring-bright-cyan/30'
  },
  {
    rank: '3rd Place',
    amount: 'Rs. 10,000',
    perks: ['Bronze Trophies', 'Individual Certificates', 'ASE Premium Merch'],
    glowClass: 'shadow-[0_0_20px_rgba(138,43,226,0.25)] border-accent-purple/30',
    badgeBg: 'bg-accent-purple/10 text-accent-purple'
  }
]

const SPECIAL_AWARDS = [
  { title: 'Best Innovation', desc: 'Awarded to the team presenting the most technologically creative and unique solution.' },
  { title: 'Best UI/UX Design', desc: 'Awarded for exceptional product aesthetics, layout simplicity, and smooth user flow.' },
  { title: 'Most Popular Choice', desc: 'Voted on by fellow participants and audience members during the demo presentations.' }
]

const FAQS = [
  {
    q: 'Who is eligible to participate in Buildathon 2026?',
    a: 'Only undergraduate students currently enrolled in the Faculty of Computing at NSBM Green University are eligible to participate in Buildathon 2026. Participants must form teams according to the stated team-size requirements.'
  },
  {
    q: 'What is the required team size?',
    a: 'Teams can consist of a minimum of 1 member and a maximum of 4 members. Cross-institutional teams are permitted.'
  },
  {
    q: 'Is there a registration fee for the hackathon?',
    a: 'No! Registration is completely free for all selected participants. ASE and Pandora fully sponsor the venue, food, and mentorship.'
  },
  {
    q: 'Can we use pre-built templates or libraries?',
    a: 'Yes, using open-source libraries, frameworks, and boilerplates is allowed. However, all project core code, features, and custom designs must be built from scratch during the build window on event day. Pre-existing projects cannot be submitted.'
  },
  {
    q: 'What should we bring to the venue?',
    a: 'Bring your laptops, chargers, adapters, notebooks, personal, and your enthusiasm! Stable high-speed Wi-Fi, power outlets, meals, and snacks will be provided by the organizers.'
  },
  {
    q: 'Who do we contact if we have questions during registration?',
    a: 'You can reach out to the ASE organizers via our social channels linked in the footer, or email us at ase@nsbm.ac.lk for immediate assistance.'
  }
]

/**
 * The full Buildathon event body — Overview, Eligibility & Rules, Timeline &
 * Schedule, Prizes and FAQ. Shared by the About Event page and the home page.
 * Background-neutral so it adapts to whichever page renders it.
 */
export default function EventContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const [mousePos1, setMousePos1] = useState({ x: 0, y: 0 })
  const [mousePos2, setMousePos2] = useState({ x: 0, y: 0 })

  const handleMouseMove1 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos1({ x, y })
  }

  const handleMouseLeave1 = () => {
    setMousePos1({ x: 0, y: 0 })
  }

  const handleMouseMove2 = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos2({ x, y })
  }

  const handleMouseLeave2 = () => {
    setMousePos2({ x: 0, y: 0 })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16 md:space-y-24">

      {/* Overview & Objectives Section */}
      <section id="overview" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="section-heading text-4xl mb-4">
            <DiaTextReveal text="Buildathon 2026" colors={REVEAL_COLORS} textColor="#FFFFFF" />
          </h2>
          <p className="font-poppins text-white/70 text-sm md:text-base">
            Explore the core vision of our flagship software engineering challenge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Introduction */}
          <div className="lg:col-span-5 glass-card glow-border-cyan border-l-4 border-l-bright-cyan p-6 md:p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-bio-cyan/15 flex items-center justify-center border border-bio-cyan/30 shadow-cyan-glow">
                <Award className="text-bright-cyan" size={24} />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-wide">
                Build Beyond Imagination
              </h3>
              <p className="font-poppins text-xs md:text-sm lg:text-base text-white/85 leading-relaxed">
                PANDORA is more than a competition—it is an immersive buildathon experience where
                creativity, technology, and teamwork come together.
              </p>
              <p className="font-poppins text-xs md:text-sm lg:text-base text-white/85 leading-relaxed">
                During one intensive build day, teams will analyse a challenge, design a solution, develop
                and test their application, and present their final concept to a panel of judges. It is a
                platform created to push technical skills, product thinking, collaboration, and
                problem-solving beyond the expected.
              </p>
            </div>
            <div className="border-t border-white/10 pt-6 mt-8 flex items-center justify-between text-xs font-inter text-bright-cyan font-bold uppercase tracking-wider">
              <span>ASE Signature Event</span>
              <span>August 5, 2026</span>
            </div>
          </div>

          {/* Right Column: Objectives */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {OBJECTIVES.map((obj, i) => {
              const IconComponent = obj.icon
              return (
                <div
                  key={i}
                  className="glass-card glow-border-cyan border-l-4 border-l-bright-cyan p-5 md:p-6 flex flex-col justify-between hover:scale-[1.02] hover:shadow-cyan-glow transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-bio-cyan/30 group-hover:bg-bio-cyan/10 transition-colors">
                      <IconComponent className="text-white/80 group-hover:text-bright-cyan transition-colors" size={20} />
                    </div>
                    <h4 className="font-display text-base md:text-lg font-bold text-white group-hover:text-bright-cyan transition-colors">
                      {obj.title}
                    </h4>
                    <p className="font-poppins text-xs md:text-sm text-white/80 leading-relaxed">
                      {obj.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <hr className="border-white/10" />

      {/* Eligibility & Rules Section */}
      <section id="eligibility" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

        {/* Eligibility Card */}
        <div
          onMouseMove={handleMouseMove1}
          onMouseLeave={handleMouseLeave1}
          className="glass-card glow-border-cyan border-l-4 border-l-bright-cyan p-6 md:p-8 hover:scale-[1.01] transition-all duration-300 relative overflow-visible group"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-bright-cyan/5 rounded-full blur-xl group-hover:bg-bright-cyan/10 transition-all duration-500" />

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-bio-cyan/15 flex items-center justify-center border border-bio-cyan/30">
                <Users className="text-bright-cyan" size={24} />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white">Eligibility Criteria</h3>
                <p className="font-inter text-xs text-bright-cyan font-semibold tracking-wider uppercase">Who can build</p>
              </div>
            </div>

            {/* Flower Image */}
            <div className="relative md:absolute -top-4 -right-4 md:-top-10 md:-right-10 w-24 h-24 md:w-40 md:h-40 flex-shrink-0 z-20 pointer-events-none">
              <Image
                src="/flower-1.png"
                alt="Bioluminescent flower asset 1"
                fill
                sizes="(max-width: 768px) 96px, 160px"
                className="object-contain"
                style={{
                  transform: `translate3d(${mousePos1.x * 25}px, ${mousePos1.y * 25}px, 50px) rotateX(${mousePos1.y * -20}deg) rotateY(${mousePos1.x * 20}deg)`,
                  transition: 'transform 0.1s ease-out',
                }}
              />
            </div>
          </div>

          <ul className="space-y-4">
            {[
              { title: 'Undergraduate Status', desc: 'Participation is exclusively open to undergraduate students of the Faculty of Computing of NSBM.' },
              { title: 'Flexible Team Sizes', desc: 'Participate as an individual builder or team up in groups of up to 4 members.' },
              { title: 'Cross-Institutional Teams', desc: 'Collaborators from different universities and courses are allowed and encouraged.' },
              { title: 'Clean Track Record', desc: 'All registered participants must adhere to university guidelines and represent a clean conduct history.' }
            ].map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start font-poppins">
                <CheckCircle2 size={18} className="text-bright-cyan flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-semibold text-white/90">{item.title}</h4>
                  <p className="text-xs md:text-sm text-white/80 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Rules Card */}
        <div
          onMouseMove={handleMouseMove2}
          onMouseLeave={handleMouseLeave2}
          className="glass-card glow-border-cyan border-l-4 border-l-accent-purple p-6 md:p-8 hover:scale-[1.01] transition-all duration-300 relative overflow-visible group"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/5 rounded-full blur-xl group-hover:bg-accent-purple/10 transition-all duration-500" />

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-purple/15 flex items-center justify-center border border-accent-purple/30">
                <Shield className="text-accent-purple" size={24} />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white">Codex of the Deep</h3>
                <p className="font-inter text-xs text-accent-purple font-semibold tracking-wider uppercase">Competition Rules</p>
              </div>
            </div>

            {/* Flower Image */}
            <div className="relative md:absolute -top-4 -right-4 md:-top-10 md:-right-10 w-24 h-24 md:w-40 md:h-40 flex-shrink-0 z-20 pointer-events-none">
              <Image
                src="/flower-2.png"
                alt="Bioluminescent flower asset 2"
                fill
                sizes="(max-width: 768px) 96px, 160px"
                className="object-contain"
                style={{
                  transform: `translate3d(${mousePos2.x * 25}px, ${mousePos2.y * 25}px, 50px) rotateX(${mousePos2.y * -20}deg) rotateY(${mousePos2.x * 20}deg)`,
                  transition: 'transform 0.1s ease-out',
                }}
              />
            </div>
          </div>

          <ul className="space-y-4">
            {[
              { title: 'Originality First', desc: 'All submitted projects must be designed and coded entirely during the build window on event day.' },
              { title: 'Template Disclosure', desc: 'Pre-existing templates, boilerplates, or component packages must be fully disclosed upon submission.' },
              { title: 'Intellectual Honesty', desc: 'Plagiarism, copying code from other participants, or submitting pre-built projects results in instant disqualification.' },
              { title: 'Final Arbiters', desc: 'The scoring and decisions of the judging panel are final, absolute, and not subject to appeal.' }
            ].map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start font-poppins">
                <CheckCircle2 size={18} className="text-accent-purple flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-semibold text-white/90">{item.title}</h4>
                  <p className="text-xs md:text-sm text-white/80 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr className="border-white/10" />

      {/* Timeline & Schedule Section */}
      <section id="timeline" className="scroll-mt-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="section-heading text-4xl mb-4">
            <DiaTextReveal text="Milestones & Timeline" colors={REVEAL_COLORS} textColor="#FFFFFF" />
          </h2>
          <p className="font-poppins text-white/70 text-sm md:text-base">
            Mark the dates and follow our progression timeline from launch to presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Timeline phase grid */}
          <div className="lg:col-span-5 relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-bright-cyan before:to-accent-purple">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="relative pl-10 group">
                <div className="absolute left-[9px] top-1.5 w-4 h-4 rounded-full bg-deep-ocean border-2 border-bright-cyan group-hover:bg-bright-cyan group-hover:shadow-cyan-glow transition-all duration-300" />

                <span className="font-inter text-xs text-bright-cyan font-bold tracking-widest uppercase">
                  {item.date}
                </span>
                <h3 className="font-display text-lg font-bold text-white/90 mt-1 group-hover:text-bright-cyan transition-colors">
                  {item.title}
                </h3>
                <p className="font-poppins text-xs md:text-sm text-white/80 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Event Day Schedule */}
          <div className="lg:col-span-7 glass-card glow-border-cyan border-l-4 border-l-bright-cyan p-5 md:p-8 space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-lg md:text-xl font-bold text-white tracking-wide">
                Event Day Schedule
              </h3>
              <span className="font-inter text-xs text-bright-cyan font-bold tracking-widest uppercase">
                August 5, 2026 · 10 AM – 5 PM
              </span>
            </div>

            {/* Schedule listing */}
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {SCHEDULE.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start border-l border-white/5 pl-4 hover:border-bio-cyan/30 transition-colors">
                  <span className="font-inter text-xs text-bright-cyan font-bold sm:min-w-[140px] pt-0.5">
                    {item.time}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-display text-base font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="font-poppins text-xs md:text-sm text-white/70 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      <hr className="border-white/10" />

      {/* Prizes Showcase Section */}
      <section id="prizes" className="scroll-mt-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="section-heading text-4xl mb-4">
            <DiaTextReveal text="The Prize Pool" colors={REVEAL_COLORS} textColor="#FFFFFF" />
          </h2>
          <p className="font-poppins text-white/70 text-sm md:text-base">
            A total cash prize pool along with outstanding awards, trophies, and premium incubation pathways.
          </p>
        </div>

        {/* Podiums */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
          {PRIZES.map((prize, idx) => (
            <div
              key={idx}
              className={`glass-card p-6 md:p-8 border flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 ${prize.glowClass} ${
                idx === 1 ? 'order-1 md:order-2' : idx === 0 ? 'order-2 md:order-1' : 'order-3'
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className={`font-inter text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${prize.badgeBg}`}>
                    {prize.rank}
                  </span>
                  <Trophy className={idx === 1 ? "text-bright-cyan" : idx === 0 ? "text-ice-blue" : "text-accent-purple"} size={24} />
                </div>

                <div className="space-y-1">
                  <p className="font-inter text-xs text-white/60 uppercase tracking-widest">Cash Prize</p>
                  <p className="font-display text-3xl md:text-4xl font-bold text-white tracking-wide">
                    {prize.amount}
                  </p>
                </div>

                <ul className="space-y-2 border-t border-white/5 pt-4">
                  {prize.perks.map((perk, i) => (
                    <li key={i} className="flex gap-2 items-center text-xs md:text-sm font-poppins text-white/85">
                      <span className="text-bright-cyan">•</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Special Awards */}
        <div className="space-y-8 pt-8">
          <h3 className="font-display text-xl font-bold text-white text-center">
            <DiaTextReveal text="Special Recognition" colors={REVEAL_COLORS} textColor="#FFFFFF" />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPECIAL_AWARDS.map((award, idx) => (
              <div key={idx} className="glass-card glow-border-cyan border-l-4 border-l-bright-cyan p-5 md:p-6 hover:shadow-cyan-glow hover:scale-[1.01] transition-all duration-300">
                <h4 className="font-display text-base font-bold text-bright-cyan mb-2">
                  {award.title}
                </h4>
                <p className="font-poppins text-xs md:text-sm text-white/70 leading-relaxed">
                  {award.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-white/10" />

      {/* Frequently Asked Questions */}
      <section id="faq" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="section-heading text-4xl mb-4">
            <DiaTextReveal text="Frequently Asked Questions" colors={REVEAL_COLORS} textColor="#FFFFFF" />
          </h2>
          <p className="font-poppins text-white/70 text-sm md:text-base">
            Got questions? We have compiled the most common inquiries about the competition.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card glow-border-cyan border-l-4 border-l-bright-cyan hover:shadow-cyan-glow transition-all duration-300 rounded-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-4 md:px-6 py-4 md:py-5 cursor-pointer text-left select-none outline-none focus:outline-none"
              >
                <div className="flex gap-3 items-center">
                  <HelpCircle size={18} className={`transition-colors duration-300 ${openFaq === idx ? 'text-bright-cyan' : 'text-bright-cyan/60'}`} />
                  <span className={`font-inter text-xs sm:text-sm md:text-base font-semibold transition-colors duration-300 ${openFaq === idx ? 'text-white' : 'text-white/80'}`}>
                    {faq.q}
                  </span>
                </div>
                <span className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  <span className={`absolute w-3 h-[2px] transition-all duration-300 ${openFaq === idx ? 'bg-bright-cyan rotate-180' : 'bg-white/40'}`} />
                  <span className={`absolute w-[2px] h-3 bg-white/40 transition-all duration-300 ${openFaq === idx ? 'scale-0' : 'scale-100'}`} />
                </span>
              </button>

              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  openFaq === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 md:px-6 pb-4 md:pb-5 pt-3 border-t border-white/5 bg-white/[0.01]">
                    <p className="font-poppins text-xs md:text-sm text-white/80 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
