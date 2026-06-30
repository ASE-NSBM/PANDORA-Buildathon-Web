'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { Member } from '@/types'

const emptyMember = (): Member => ({
  fullName:      '',
  studentId:     '',
  email:         '',
  contactNumber: '',
  whatsappNumber:'',
})

const MEMBER_FIELDS: { field: keyof Member; label: string; placeholder: string; type: string }[] = [
  { field: 'fullName',       label: 'Full Name',       placeholder: 'Enter full name',        type: 'text'  },
  { field: 'studentId',      label: 'Student ID',      placeholder: 'Enter student ID',       type: 'text'  },
  { field: 'email',          label: 'Email Address',   placeholder: 'Enter email address',    type: 'email' },
  { field: 'contactNumber',  label: 'Contact Number',  placeholder: 'Enter contact number',   type: 'tel'   },
  { field: 'whatsappNumber', label: 'WhatsApp Number', placeholder: 'Enter WhatsApp number',  type: 'tel'   },
]

export default function RegisterPage() {
  const [teamName,     setTeamName]     = useState('')
  const [memberCount,  setMemberCount]  = useState(1)
  const [members,      setMembers]      = useState<Member[]>([emptyMember()])
  const [activeMember, setActiveMember] = useState(0)
  const [submitting,   setSubmitting]   = useState(false)
  const [submitted,    setSubmitted]    = useState(false)

  const handleMemberCountChange = (count: number) => {
    setMemberCount(count)
    setMembers((prev) => {
      const next = [...prev]
      while (next.length < count) next.push(emptyMember())
      return next.slice(0, count)
    })
    setActiveMember(0)
  }

  const updateMember = (index: number, field: keyof Member, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // TODO: POST to /api/register
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="glass-card glow-border-cyan p-12 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-bio-cyan/20 border border-bio-cyan/50 flex items-center justify-center mx-auto mb-6">
            <span className="text-bright-cyan text-2xl">✓</span>
          </div>
          <h2 className="font-cinzel font-bold text-white text-2xl mb-3">Registration Successful!</h2>
          <p className="font-poppins text-white/60 text-sm leading-relaxed">
            Team <span className="text-bright-cyan font-semibold">{teamName}</span> has been registered.
            We&apos;ll be in touch soon!
          </p>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-10 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-cinzel text-bright-cyan text-xs tracking-[0.3em] uppercase mb-4">
            Join BuilderThan
          </p>
          <h1 className="section-heading text-5xl md:text-6xl mb-4">Register Your Team</h1>
          <p className="font-poppins text-white/50 max-w-xl mx-auto">
            Fill in your team details and member information to secure your spot.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Team Information */}
            <div className="glass-card p-8 space-y-6 h-fit">
              <h2 className="font-cinzel font-bold text-bright-cyan text-lg">Team Information</h2>

              <div>
                <label className="form-label">
                  Team Name <span className="text-accent-purple">*</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">
                  Number of Members <span className="text-accent-purple">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleMemberCountChange(n)}
                      className={`w-10 h-10 rounded-lg font-inter text-sm font-semibold transition-all duration-200 ${
                        memberCount === n
                          ? 'bg-bio-cyan text-deep-ocean shadow-cyan-glow'
                          : 'bg-white/5 border border-white/15 text-white/50 hover:border-bio-cyan/50 hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Member Details */}
            <div className="glass-card p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-cinzel font-bold text-bright-cyan text-lg">Member Details</h2>
                <div className="flex gap-1">
                  {members.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveMember(i)}
                      className={`w-8 h-8 rounded-lg font-inter text-xs font-semibold transition-all duration-200 ${
                        activeMember === i
                          ? 'bg-bio-cyan text-deep-ocean'
                          : 'bg-white/5 border border-white/15 text-white/50 hover:border-bio-cyan/50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {MEMBER_FIELDS.map(({ field, label, placeholder, type }) => (
                  <div key={field}>
                    <label className="form-label">
                      {label} <span className="text-accent-purple">*</span>
                    </label>
                    <input
                      type={type}
                      value={members[activeMember]?.[field] ?? ''}
                      onChange={(e) => updateMember(activeMember, field, e.target.value)}
                      placeholder={placeholder}
                      required
                      className="form-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="lg:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting…' : 'Submit Registration'}
                {!submitting && <ChevronRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
