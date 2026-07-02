'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Check, AlertTriangle } from 'lucide-react'
import type { Member } from '@/types'
import { toast } from 'sonner'

const emptyMember = (): Member => ({
  fullName:       '',
  studentId:      '',
  email:          '',
  contactNumber:  '',
  whatsappNumber: '',
})

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.trim().slice(0, 2).toUpperCase()
}

function isMemberComplete(m: Member) {
  return !!(m.fullName.trim() && m.studentId.trim() && m.email.trim() && m.contactNumber.trim() && m.whatsappNumber.trim())
}

function getIntraDuplicates(members: Member[], index: number) {
  const m      = members[index]
  const others = members.filter((_, i) => i !== index)
  return {
    email:     !!m.email     && others.some(o => o.email     && o.email.toLowerCase()     === m.email.toLowerCase()),
    studentId: !!m.studentId && others.some(o => o.studentId && o.studentId.trim()        === m.studentId.trim()),
  }
}

export default function RegisterPage() {
  const [teamName,      setTeamName]      = useState('')
  const [memberCount,   setMemberCount]   = useState(2)
  const [members,       setMembers]       = useState<Member[]>([emptyMember(), emptyMember()])
  const [activeMember,  setActiveMember]  = useState(0)
  const [submitting,    setSubmitting]    = useState(false)
  const [submitted,     setSubmitted]     = useState(false)

  const handleMemberCountChange = (count: number) => {
    setMemberCount(count)
    setMembers(prev => {
      const next = [...prev]
      while (next.length < count) next.push(emptyMember())
      return next.slice(0, count)
    })
    setActiveMember(prev => Math.min(prev, count - 1))
  }

  const updateMember = (index: number, field: keyof Member, value: string) =>
    setMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m))

  const completedCount = members.filter(isMemberComplete).length
  const dupes          = getIntraDuplicates(members, activeMember)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Block if intra-team duplicates exist
    for (let i = 0; i < members.length; i++) {
      const d = getIntraDuplicates(members, i)
      if (d.email || d.studentId) {
        toast.error(`Member ${i + 1} has a duplicate ${d.email ? 'email' : 'student ID'} within this team.`, {
          position: 'top-right',
          style: { background: 'rgba(8,27,42,0.95)', color: '#64E6FF', border: '1px solid rgba(239,68,68,0.4)' },
        })
        setActiveMember(i)
        return
      }
    }

    setSubmitting(true)
    try {
      const res  = await fetch('/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ teamName, memberCount, members }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
      } else {
        toast.error(data.message || 'Registration failed.', {
          position: 'top-right',
          style: { background: 'rgba(8,27,42,0.95)', color: '#64E6FF', border: '1px solid rgba(100,230,255,0.3)' },
        })
      }
    } catch {
      toast.error('Network error. Please try again.', { position: 'top-right' })
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="glass-card glow-border-cyan p-10 text-center max-w-md w-full space-y-6">
          <div className="w-16 h-16 rounded-full bg-bio-cyan/20 border border-bio-cyan/50 flex items-center justify-center mx-auto shadow-cyan-glow">
            <Check size={28} className="text-bright-cyan" />
          </div>
          <div>
            <h2 className="font-papyrus font-bold text-white text-2xl mb-2">Crew Registered!</h2>
            <p className="font-poppins text-white/60 text-sm leading-relaxed">
              Team <span className="text-bright-cyan font-semibold">{teamName}</span> ({memberCount} member{memberCount !== 1 ? 's' : ''}) is locked in. We&apos;ll be in touch soon.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 pt-2">
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-bio-cyan/20 border border-bio-cyan/30 flex items-center justify-center font-inter text-xs font-bold text-bright-cyan flex-shrink-0">
                  {getInitials(m.fullName)}
                </div>
                <div className="text-left min-w-0">
                  <div className="font-inter text-sm text-white/80 truncate">{m.fullName}</div>
                  <div className="font-inter text-xs text-white/35 truncate">{m.email}</div>
                </div>
                <Check size={12} className="text-green-400 flex-shrink-0 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ── Main form ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden min-h-[38vh] flex items-center">
        <video src="/vids/clip4.mp4" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-deep-ocean/72" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
          <p className="font-papyrus text-bright-cyan text-xs tracking-[0.3em] uppercase mb-4">Join BuilderThan 2026</p>
          <h1 className="section-heading text-5xl md:text-6xl mb-4">Assemble Your Crew</h1>
          <p className="font-poppins text-white/50 max-w-lg mx-auto">
            Name your team, choose your crew size, and fill in every member&apos;s details to secure your spot.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-deep-ocean">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} noValidate>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">

              {/* ── Left: Crew manifest ──────────────────────────────── */}
              <div className="lg:col-span-2 space-y-4">

                {/* Team info card */}
                <div className="glass-card p-6 space-y-5">
                  <h2 className="font-papyrus font-bold text-bright-cyan text-xs tracking-[0.25em] uppercase">Mission Setup</h2>

                  <div>
                    <label className="form-label">Team Name <span className="text-accent-purple">*</span></label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      placeholder="Enter your team name"
                      required
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Crew Size <span className="text-accent-purple">*</span></label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
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

                {/* Roster card */}
                <div className="glass-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-papyrus font-bold text-bright-cyan text-xs tracking-[0.25em] uppercase">Crew Manifest</h2>
                    <span className="font-inter text-xs text-white/35">{completedCount}/{memberCount} ready</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-bio-cyan rounded-full transition-all duration-500"
                      style={{ width: `${memberCount > 0 ? (completedCount / memberCount) * 100 : 0}%` }}
                    />
                  </div>

                  {/* Member slots */}
                  <div className="space-y-2 pt-1">
                    {members.map((m, i) => {
                      const done   = isMemberComplete(m)
                      const active = i === activeMember
                      const hasDupe = !!m.email && getIntraDuplicates(members, i).email
                                   || !!m.studentId && getIntraDuplicates(members, i).studentId

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveMember(i)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                            active
                              ? 'bg-bio-cyan/10 border border-bio-cyan/40'
                              : hasDupe
                              ? 'bg-red-500/5 border border-red-500/25 hover:border-red-500/40'
                              : done
                              ? 'bg-green-500/5 border border-green-500/20 hover:border-green-500/35'
                              : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
                          }`}
                        >
                          {/* Avatar */}
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-inter text-xs font-bold transition-all ${
                            active    ? 'bg-bio-cyan/20 border border-bio-cyan/60 text-bright-cyan'  :
                            hasDupe   ? 'bg-red-500/20  border border-red-500/40  text-red-400'      :
                            done      ? 'bg-green-500/20 border border-green-500/40 text-green-400'  :
                                        'bg-white/5 border border-white/15 text-white/30'
                          }`}>
                            {m.fullName.trim() ? getInitials(m.fullName) : String(i + 1)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className={`font-inter text-sm font-medium truncate ${
                              active  ? 'text-bright-cyan' :
                              hasDupe ? 'text-red-400'     :
                              done    ? 'text-white/80'    :
                                        'text-white/30'
                            }`}>
                              {m.fullName.trim() || `Member ${i + 1}`}
                            </div>
                            {m.studentId.trim() && (
                              <div className="font-inter text-[11px] text-white/30 truncate">{m.studentId}</div>
                            )}
                          </div>

                          <div className="flex-shrink-0">
                            {hasDupe ? (
                              <AlertTriangle size={13} className="text-red-400" />
                            ) : done ? (
                              <Check size={13} className="text-green-400" />
                            ) : null}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* ── Right: Member form ───────────────────────────────── */}
              <div className="lg:col-span-3 glass-card p-6 flex flex-col gap-5">

                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-papyrus font-bold text-white text-lg">
                      Member {activeMember + 1}{memberCount > 1 ? ` of ${memberCount}` : ''}
                    </h2>
                    <p className="font-inter text-xs text-white/35 mt-0.5">
                      {members[activeMember]?.fullName.trim() || 'Fill in details below'}
                    </p>
                  </div>

                  {/* Member dots */}
                  <div className="flex gap-1.5">
                    {members.map((m, i) => {
                      const done   = isMemberComplete(m)
                      const active = i === activeMember
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveMember(i)}
                          className={`w-7 h-7 rounded-full font-inter text-[11px] font-bold transition-all ${
                            active ? 'bg-bio-cyan text-deep-ocean' :
                            done   ? 'bg-green-500/20 border border-green-500/40 text-green-400' :
                                     'bg-white/5 border border-white/15 text-white/40 hover:border-bio-cyan/50'
                          }`}
                        >
                          {done && !active ? '✓' : i + 1}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="form-label">Full Name <span className="text-accent-purple">*</span></label>
                    <input
                      type="text"
                      value={members[activeMember]?.fullName ?? ''}
                      onChange={e => updateMember(activeMember, 'fullName', e.target.value)}
                      placeholder="Enter full name"
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Student ID <span className="text-accent-purple">*</span></label>
                      <input
                        type="text"
                        value={members[activeMember]?.studentId ?? ''}
                        onChange={e => updateMember(activeMember, 'studentId', e.target.value)}
                        placeholder=""
                        required
                        className={`form-input ${dupes.studentId ? 'border-red-500/60 focus:border-red-500/60' : ''}`}
                      />
                      {dupes.studentId && (
                        <p className="mt-1.5 font-inter text-[11px] text-red-400 flex items-center gap-1">
                          <AlertTriangle size={10} /> Already used by another member
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="form-label">Email Address <span className="text-accent-purple">*</span></label>
                      <input
                        type="email"
                        value={members[activeMember]?.email ?? ''}
                        onChange={e => updateMember(activeMember, 'email', e.target.value)}
                        placeholder="name@email.com"
                        required
                        className={`form-input ${dupes.email ? 'border-red-500/60 focus:border-red-500/60' : ''}`}
                      />
                      {dupes.email && (
                        <p className="mt-1.5 font-inter text-[11px] text-red-400 flex items-center gap-1">
                          <AlertTriangle size={10} /> Already used by another member
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Contact Number <span className="text-accent-purple">*</span></label>
                      <input
                        type="tel"
                        value={members[activeMember]?.contactNumber ?? ''}
                        onChange={e => updateMember(activeMember, 'contactNumber', e.target.value)}
                        placeholder="+94 7x or 07x"
                        required
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">WhatsApp Number <span className="text-accent-purple">*</span></label>
                      <input
                        type="tel"
                        value={members[activeMember]?.whatsappNumber ?? ''}
                        onChange={e => updateMember(activeMember, 'whatsappNumber', e.target.value)}
                        placeholder="+94 7x or 07x"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Member navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveMember(p => Math.max(0, p - 1))}
                    disabled={activeMember === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/15 text-white/60 font-inter text-sm rounded-lg hover:border-bio-cyan/40 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>

                  {activeMember < memberCount - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveMember(p => Math.min(memberCount - 1, p + 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-bio-cyan/10 border border-bio-cyan/30 text-bright-cyan font-inter text-sm rounded-lg hover:bg-bio-cyan/20 transition-all"
                    >
                      Next <ChevronRight size={15} />
                    </button>
                  ) : (
                    <span className="font-inter text-xs text-white/25">Last member</span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit row */}
            <div className="flex items-center justify-between">
              <p className="font-inter text-xs text-white/30">
                {completedCount === memberCount && teamName.trim()
                  ? '✓ All fields complete — ready to submit'
                  : `${memberCount - completedCount} member${memberCount - completedCount !== 1 ? 's' : ''} still incomplete`}
              </p>
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
