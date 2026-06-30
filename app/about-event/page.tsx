'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const tabs = ['Overview', 'Eligibility', 'Rules', 'Timeline', 'Prizes', 'FAQ'] as const
type Tab = (typeof tabs)[number]

const overviewCards = [
  { title: 'Innovate',    description: 'Bring fresh ideas into exciting solutions.' },
  { title: 'Collaborate', description: 'Work, Learn, Grow together.' },
  { title: 'Impact',      description: 'Build for a better future.' },
]

const faqs = [
  { q: 'Who can participate in BuilderThan?', a: 'All undergraduate students are eligible to participate.' },
  { q: 'What is the team size?',              a: 'Teams can consist of 1 to 5 members.' },
  { q: 'Is there a registration fee?',        a: 'Registration details will be announced soon.' },
  { q: 'What do I need to bring?',            a: 'Bring your laptop, ideas, and enthusiasm.' },
]

export default function AboutEventPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [openFaq, setOpenFaq]     = useState<number | null>(null)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-glow-cyan opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-cinzel text-bright-cyan text-xs tracking-[0.3em] uppercase mb-4">
            Discover More
          </p>
          <h1 className="section-heading text-5xl md:text-6xl mb-4">About the Event</h1>
          <p className="font-poppins text-white/50 max-w-xl mx-auto">
            Everything you need to know about BuilderThan 2026.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tab nav */}
          <div className="flex flex-wrap gap-2 mb-12 border-b border-white/10 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-inter text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-bio-cyan/20 text-bright-cyan border border-bio-cyan/50'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'Overview' && (
            <div className="space-y-8">
              <div className="max-w-2xl">
                <h2 className="section-subheading mb-4">BuilderThan Overview</h2>
                <p className="font-poppins text-white/60 leading-relaxed">
                  BuilderThan is a competition that brings together creative minds to build innovative solutions
                  for real-world challenges. Teams will go through exciting rounds to showcase their ideas,
                  build prototypes, and present impactful solutions.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {overviewCards.map(({ title, description }) => (
                  <div key={title} className="glass-card p-6">
                    <h3 className="font-cinzel font-bold text-bright-cyan text-lg mb-2">{title}</h3>
                    <p className="font-poppins text-white/50 text-sm">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility */}
          {activeTab === 'Eligibility' && (
            <div className="max-w-2xl">
              <h2 className="section-subheading mb-6">Eligibility</h2>
              <ul className="space-y-3 font-poppins text-white/60">
                {[
                  'Open to all undergraduate students.',
                  'Teams of 1–5 members allowed.',
                  'Participants must register before the deadline.',
                  'Each member can only be part of one team.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-bright-cyan mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rules */}
          {activeTab === 'Rules' && (
            <div className="max-w-2xl">
              <h2 className="section-subheading mb-6">Competition Rules</h2>
              <ul className="space-y-3 font-poppins text-white/60">
                {[
                  'All team members must be present during the event.',
                  'Solutions must be original and built during the competition.',
                  'Use of pre-built templates is allowed with disclosure.',
                  'Plagiarism results in immediate disqualification.',
                  "Judges' decisions are final.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-bright-cyan mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timeline */}
          {activeTab === 'Timeline' && (
            <div className="max-w-2xl">
              <h2 className="section-subheading mb-8">Schedule</h2>
              <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-bio-cyan/30">
                {[
                  { date: 'July 2026',       event: 'Registration Opens' },
                  { date: 'Aug 10, 2026',    event: 'Registration Closes' },
                  { date: 'Aug 15, 2026',    event: 'Day 1 – Kickoff & Ideation' },
                  { date: 'Aug 16, 2026',    event: 'Day 2 – Pitching & Awards' },
                ].map(({ date, event }) => (
                  <div key={date} className="pl-10 relative">
                    <div className="absolute left-1 top-1.5 w-4 h-4 rounded-full bg-bio-cyan border-2 border-deep-ocean" />
                    <p className="font-cinzel text-bright-cyan text-sm">{date}</p>
                    <p className="font-poppins text-white/70 mt-0.5">{event}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prizes */}
          {activeTab === 'Prizes' && (
            <div className="max-w-2xl">
              <h2 className="section-subheading mb-6">Prizes</h2>
              <div className="space-y-3">
                {[
                  { place: '1st Place',      prize: 'LKR 50,000 + Trophies + Certificates' },
                  { place: '2nd Place',      prize: 'LKR 30,000 + Trophies + Certificates' },
                  { place: '3rd Place',      prize: 'LKR 20,000 + Trophies + Certificates' },
                  { place: 'Special Awards', prize: 'Best Innovation · Best UI/UX' },
                ].map(({ place, prize }) => (
                  <div key={place} className="glass-card p-4 flex items-center gap-4">
                    <span className="font-cinzel font-bold text-bright-cyan min-w-[130px] text-sm">{place}</span>
                    <span className="font-poppins text-white/60 text-sm">{prize}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'FAQ' && (
            <div className="max-w-2xl">
              <h2 className="section-subheading mb-6">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {faqs.map(({ q, a }, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-6 py-4 text-left"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-poppins text-white/80 font-medium text-sm">{q}</span>
                      {openFaq === i
                        ? <ChevronUp   size={16} className="text-bright-cyan flex-shrink-0" />
                        : <ChevronDown size={16} className="text-white/30 flex-shrink-0" />
                      }
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-4">
                        <p className="font-poppins text-white/50 text-sm leading-relaxed">{a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
