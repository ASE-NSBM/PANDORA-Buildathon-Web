'use client'

import { useState } from 'react'
import {
  Target,
  Users,
  Shield,
  Award,
  HelpCircle,
  Trophy,
  Compass,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react'



const OBJECTIVES = [
  {
    icon: Compass,
    title: 'Explore & Innovate',
    description: 'Dive deep into uncharted technical waters to solve real-world industry challenges.'
  },
  {
    icon: Users,
    title: 'Collaborate',
    description: 'Work in diverse teams of 1 to 5 to co-create, learn, and grow together under pressure.'
  },
  {
    icon: Zap,
    title: 'Rapid Prototyping',
    description: 'Accelerate your ideas from concept to a functioning prototype in just 24 hours.'
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
    date: 'August 10, 2026',
    title: 'Registration Deadline',
    desc: 'Team registrations close. Ensure all member profiles are fully submitted.',
    status: 'Upcoming'
  },
  {
    date: 'August 15, 2026',
    title: 'Day 1 – Kickoff & Development',
    desc: 'Opening ceremony, theme announcement, and start of the 24-hour hacking marathon.',
    status: 'Hackathon'
  },
  {
    date: 'August 16, 2026',
    title: 'Day 2 – Pitching & Awards',
    desc: 'Hackathon ends. Teams submit code and present live demo pitches to judges. Winners announced.',
    status: 'Awards'
  }
]

const SCHEDULE_DAY_1 = [
  { time: '08:00 AM – 09:00 AM', title: 'Arrival & Registration Check-in', desc: 'Welcome desk check-in, credential collection, and breakfast.' },
  { time: '09:00 AM – 10:00 AM', title: 'Opening Ceremony', desc: 'Introduction by the ASE Club, guest speeches, and official hackathon rules briefing.' },
  { time: '10:00 AM', title: 'The Theme Announcement', desc: 'The secret challenge topic is revealed. Hacking begins immediately!' },
  { time: '01:00 PM – 02:00 PM', title: 'Lunch & Mentoring Session 1', desc: 'Fuel up and get feedback on your architecture from industry expert mentors.' },
  { time: '04:00 PM – 05:00 PM', title: 'Checkpoint Review 1', desc: 'Progress check-in. Teams submit their high-level solution outline.' },
  { time: '07:30 PM – 08:30 PM', title: 'Dinner & Mentoring Session 2', desc: 'Technical mentoring focusing on backend, database, and deployment setup.' },
  { time: '12:00 AM (Midnight)', title: 'Midnight Snack & Chill Out', desc: 'Mini-games and quick coffee breaks to keep the energy levels high.' }
]

const SCHEDULE_DAY_2 = [
  { time: '07:00 AM – 08:00 AM', title: 'Rise & Shine Breakfast', desc: 'Morning coffee and fresh meals to prepare for the final sprint.' },
  { time: '09:00 AM – 10:00 AM', title: 'Checkpoint Review 2 & Mentoring 3', desc: 'Final push. Mentors review demo readiness and presentation decks.' },
  { time: '10:00 AM', title: 'Hacking Stop & Code Freeze', desc: 'All repositories must be pushed. Late submissions will not be accepted.' },
  { time: '10:30 AM – 01:00 PM', title: 'Preliminary Round Pitches', desc: 'Teams present 5-minute demos to panel judges. Top teams advance to finals.' },
  { time: '01:00 PM – 02:00 PM', title: 'Lunch Break', desc: 'Judges deliberate and score sheet verification.' },
  { time: '02:00 PM – 04:00 PM', title: 'Final Pitch Showcase', desc: 'The top finalist teams pitch live on the main stage to all attendees.' },
  { time: '04:00 PM – 05:00 PM', title: 'Award Ceremony & Closing', desc: 'Prizes, trophies, certificates distribution, and closing photography.' }
]

const PRIZES = [
  {
    rank: '2nd Place',
    amount: 'Rs. 30,000',
    perks: ['Silver Trophies', 'Individual Certificates', 'ASE Premium Merch'],
    glowClass: 'shadow-[0_0_20px_rgba(163,247,255,0.25)] border-ice-blue/30',
    badgeBg: 'bg-ice-blue/10 text-ice-blue'
  },
  {
    rank: '1st Place',
    amount: 'Rs. 50,000',
    perks: ['Champion Gold Trophies', 'Winner Certificates', 'Direct Incubation Opportunity', 'ASE Premium Merch'],
    glowClass: 'shadow-[0_0_30px_rgba(100,230,255,0.4)] border-bright-cyan/50 scale-105 z-10',
    badgeBg: 'bg-bright-cyan/25 text-bright-cyan font-bold ring-1 ring-bright-cyan/30'
  },
  {
    rank: '3rd Place',
    amount: 'Rs. 20,000',
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
    q: 'Who is eligible to participate in BuilderThan 2026?',
    a: 'Any undergraduate student currently enrolled in a recognized university or higher education institution is eligible. Teams can consist of members from different departments or universities, as long as everyone is an undergraduate.'
  },
  {
    q: 'What is the required team size?',
    a: 'Teams must consist of a minimum of 1 member and a maximum of 5 members. Cross-institutional teams are permitted.'
  },
  {
    q: 'Is there a registration fee for the hackathon?',
    a: 'No! Registration is completely free for all selected participants. ASE Club and Pandora fully sponsor the venue, food, and mentorship.'
  },
  {
    q: 'Can we use pre-built templates or libraries?',
    a: 'Yes, using open-source libraries, frameworks, and boilerplates is allowed. However, all project core code, features, and custom designs must be built from scratch during the 24-hour hacking window. Pre-existing projects cannot be submitted.'
  },
  {
    q: 'What should we bring to the venue?',
    a: 'Bring your laptops, chargers, adapters, notebooks, personal toiletries, and your enthusiasm! Stable high-speed Wi-Fi, power outlets, meals, and snacks will be provided by the organizers.'
  },
  {
    q: 'Who do we contact if we have questions during registration?',
    a: 'You can reach out to the ASE Club organizers via our social channels linked in the footer, or email us at ase@pandora.org for immediate assistance.'
  }
]

export default function AboutEventPage() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="relative min-h-screen bg-deep-ocean text-white overflow-x-hidden selection:bg-bright-cyan/30">
      
      {/* Background Glows */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[40%] bg-glow-cyan pointer-events-none opacity-40" />
      <div className="absolute top-[60%] right-[-10%] w-[50%] h-[40%] bg-glow-purple pointer-events-none opacity-30" />
      
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <video
          src="/vids/clip2.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Bioluminescent Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-deep-ocean/50 via-deep-ocean/75 to-deep-ocean" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="font-papyrus text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 uppercase drop-shadow-[0_4px_12px_rgba(100,230,255,0.3)]">
            About the Event
          </h1>
          
          <p className="font-poppins text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            BuilderThan 2026 is the signature hackathon organized by the Association of Software Engineering (ASE) Club. 
            A competitive arena where innovators dive deep to build solutions beyond imagination.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-20 space-y-24">
        <hr className="border-white/10 mb-16" />
        
        {/* Overview & Objectives Section */}
        <section id="overview" className="scroll-mt-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="section-heading text-4xl mb-4">BuilderThan 2026</h2>
            <p className="font-poppins text-white/50 text-sm md:text-base">
              Explore the core vision of our flagship software engineering challenge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Introduction */}
            <div className="lg:col-span-5 glass-card glow-border-cyan border-l-4 border-l-bright-cyan p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-bio-cyan/15 flex items-center justify-center border border-bio-cyan/30 shadow-cyan-glow">
                  <Award className="text-bright-cyan" size={24} />
                </div>
                <h3 className="font-papyrus text-2xl font-bold text-white tracking-wide">
                  Build Beyond Imagination
                </h3>
                <p className="font-poppins text-sm md:text-base text-white/70 leading-relaxed">
                  BuilderThan is more than a competition; it is a collaborative platform designed to test the limits 
                  of your technical prowess and product thinking. In partnership with Pandora, the ASE Club hosts 
                  undergraduates from across the region to tackle modern, complex industry problems.
                </p>
                <p className="font-poppins text-sm md:text-base text-white/70 leading-relaxed">
                  Over a 24-hour sprint, your team will conceptualize, develop, test, and pitch an application, 
                  proving that you can convert high-level requirements into clean, production-ready systems.
                </p>
              </div>
              <div className="border-t border-white/10 pt-6 mt-8 flex items-center justify-between text-xs font-inter text-bright-cyan font-bold uppercase tracking-wider">
                <span>ASE Signature Event</span>
                <span>August 15-16, 2026</span>
              </div>
            </div>

            {/* Right Column: Objectives */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {OBJECTIVES.map((obj, i) => {
                const IconComponent = obj.icon
                return (
                  <div 
                    key={i} 
                    className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-bio-cyan/30 hover:shadow-cyan-glow transition-all duration-300 group"
                  >
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-bio-cyan/30 group-hover:bg-bio-cyan/10 transition-colors">
                        <IconComponent className="text-white/60 group-hover:text-bright-cyan transition-colors" size={20} />
                      </div>
                      <h4 className="font-papyrus text-lg font-bold text-white group-hover:text-bright-cyan transition-colors">
                        {obj.title}
                      </h4>
                      <p className="font-poppins text-xs md:text-sm text-white/60 leading-relaxed">
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
        <section id="eligibility" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Eligibility Card */}
          <div className="glass-card glow-border-cyan p-8 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-bright-cyan/5 rounded-full blur-xl group-hover:bg-bright-cyan/10 transition-all duration-500" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-bio-cyan/15 flex items-center justify-center border border-bio-cyan/30">
                <Users className="text-bright-cyan" size={24} />
              </div>
              <div>
                <h3 className="font-papyrus text-2xl font-bold text-white">Eligibility Criteria</h3>
                <p className="font-inter text-xs text-bright-cyan font-semibold tracking-wider uppercase">Who can build</p>
              </div>
            </div>

            <ul className="space-y-4">
              {[
                { title: 'Undergraduate Status', desc: 'Open exclusively to all undergraduate students enrolled in a recognized university.' },
                { title: 'Flexible Team Sizes', desc: 'Participate as an individual builder or team up in groups of up to 5 members.' },
                { title: 'Cross-Institutional Teams', desc: 'Collaborators from different universities and courses are allowed and encouraged.' },
                { title: 'Clean Track Record', desc: 'All registered participants must adhere to university guidelines and represent a clean conduct history.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 items-start font-poppins">
                  <CheckCircle2 size={18} className="text-bright-cyan flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-semibold text-white/90">{item.title}</h4>
                    <p className="text-xs md:text-sm text-white/60 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Rules Card */}
          <div className="glass-card glow-border-cyan p-8 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/5 rounded-full blur-xl group-hover:bg-accent-purple/10 transition-all duration-500" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent-purple/15 flex items-center justify-center border border-accent-purple/30">
                <Shield className="text-accent-purple" size={24} />
              </div>
              <div>
                <h3 className="font-papyrus text-2xl font-bold text-white">Codex of the Deep</h3>
                <p className="font-inter text-xs text-accent-purple font-semibold tracking-wider uppercase">Competition Rules</p>
              </div>
            </div>

            <ul className="space-y-4">
              {[
                { title: 'Originality First', desc: 'All submitted projects must be designed and coded entirely during the 24-hour hackathon window.' },
                { title: 'Template Disclosure', desc: 'Pre-existing templates, boilers, or component packages must be fully disclosed upon submission.' },
                { title: 'Intellectual Honesty', desc: 'Plagiarism, copying code from other participants, or submitting pre-built projects results in instant disqualification.' },
                { title: 'Final Arbiters', desc: 'The scoring and decisions of the judging panel are final, absolute, and not subject to appeal.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 items-start font-poppins">
                  <CheckCircle2 size={18} className="text-accent-purple flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-semibold text-white/90">{item.title}</h4>
                    <p className="text-xs md:text-sm text-white/60 mt-0.5 leading-relaxed">{item.desc}</p>
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
            <h2 className="section-heading text-4xl mb-4">Milestones & Timeline</h2>
            <p className="font-poppins text-white/50 text-sm md:text-base">
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
                  <h3 className="font-papyrus text-lg font-bold text-white/90 mt-1 group-hover:text-bright-cyan transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-poppins text-xs md:text-sm text-white/60 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Daily Schedule tabs */}
            <div className="lg:col-span-7 glass-card glow-border-cyan p-8 space-y-8">
              
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveDay('day1')}
                    className={`font-inter text-sm px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                      activeDay === 'day1'
                        ? 'bg-bio-cyan text-deep-ocean shadow-cyan-glow'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Day 1 (Aug 15)
                  </button>
                  <button
                    onClick={() => setActiveDay('day2')}
                    className={`font-inter text-sm px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                      activeDay === 'day2'
                        ? 'bg-bio-cyan text-deep-ocean shadow-cyan-glow'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Day 2 (Aug 16)
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-inter text-white/40">
                  <Clock size={14} />
                  <span>UTC+5:30 Colombo</span>
                </div>
              </div>

              {/* Schedule listing */}
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {(activeDay === 'day1' ? SCHEDULE_DAY_1 : SCHEDULE_DAY_2).map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start border-l border-white/5 pl-4 hover:border-bio-cyan/30 transition-colors">
                    <span className="font-inter text-xs text-bright-cyan font-bold min-w-[140px] pt-0.5">
                      {item.time}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-papyrus text-base font-bold text-white">
                        {item.title}
                      </h4>
                      <p className="font-poppins text-xs md:text-sm text-white/50 leading-relaxed">
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
            <h2 className="section-heading text-4xl mb-4">The Prize Pool</h2>
            <p className="font-poppins text-white/50 text-sm md:text-base">
              A total cash prize pool along with outstanding awards, trophies, and premium incubation pathways.
            </p>
          </div>

          {/* Podiums */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
            {PRIZES.map((prize, idx) => (
              <div
                key={idx}
                className={`glass-card p-8 border flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 ${prize.glowClass}`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className={`font-inter text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${prize.badgeBg}`}>
                      {prize.rank}
                    </span>
                    <Trophy className={idx === 1 ? "text-bright-cyan" : idx === 0 ? "text-ice-blue" : "text-accent-purple"} size={24} />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-inter text-xs text-white/40 uppercase tracking-widest">Cash Prize</p>
                    <p className="font-papyrus text-3xl md:text-4xl font-bold text-white tracking-wide">
                      {prize.amount}
                    </p>
                  </div>

                  <ul className="space-y-2 border-t border-white/5 pt-4">
                    {prize.perks.map((perk, i) => (
                      <li key={i} className="flex gap-2 items-center text-xs md:text-sm font-poppins text-white/70">
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
            <h3 className="font-papyrus text-xl font-bold text-white text-center">Special Recognition</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SPECIAL_AWARDS.map((award, idx) => (
                <div key={idx} className="glass-card p-6 border border-white/5 hover:border-bio-cyan/20 hover:scale-[1.01] transition-all duration-300">
                  <h4 className="font-papyrus text-base font-bold text-bright-cyan mb-2">
                    {award.title}
                  </h4>
                  <p className="font-poppins text-xs md:text-sm text-white/50 leading-relaxed">
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
            <h2 className="section-heading text-4xl mb-4">Frequently Asked Questions</h2>
            <p className="font-poppins text-white/50 text-sm md:text-base">
              Got questions? We have compiled the most common inquiries about the competition.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="glass-card border border-white/10 hover:border-bio-cyan/30 transition-all duration-300 rounded-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 cursor-pointer text-left select-none outline-none focus:outline-none"
                >
                  <div className="flex gap-3 items-center">
                    <HelpCircle size={18} className={`transition-colors duration-300 ${openFaq === idx ? 'text-bright-cyan' : 'text-bright-cyan/60'}`} />
                    <span className={`font-inter text-sm md:text-base font-semibold transition-colors duration-300 ${openFaq === idx ? 'text-white' : 'text-white/80'}`}>
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
                    <div className="px-6 pb-5 pt-3 border-t border-white/5 bg-white/[0.01]">
                      <p className="font-poppins text-xs md:text-sm text-white/60 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
