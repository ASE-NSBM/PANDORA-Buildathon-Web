import connectDB from '@/lib/mongodb'
import Registration from '@/models/Registration'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteTeamButton from '@/components/admin/DeleteTeamButton'
import { ArrowLeft, Users, Calendar } from 'lucide-react'

interface Member {
  fullName: string;
  studentId: string;
  email: string;
  contactNumber: string;
  whatsappNumber: string;
  [key: string]: string;
}

interface RegistrationDetail {
  _id: string;
  teamName: string;
  memberCount: number;
  createdAt: string;
  members: Member[];
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await connectDB()
  const reg = await Registration.findById(id).lean() as RegistrationDetail | null

  if (!reg) notFound()

  const fields: { key: string; label: string }[] = [
    { key: 'fullName',       label: 'Full Name' },
    { key: 'studentId',      label: 'Student ID' },
    { key: 'email',          label: 'Email' },
    { key: 'contactNumber',  label: 'Contact' },
    { key: 'whatsappNumber', label: 'WhatsApp' },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/teams"
        className="inline-flex items-center gap-1.5 font-inter text-sm text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to Teams
      </Link>

      {/* Team header */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div>
            <p className="font-inter text-xs text-white/30 uppercase tracking-widest mb-1">Team</p>
            <h1 className="font-display text-2xl font-bold text-white">{reg.teamName}</h1>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-bright-cyan">
              <Users size={14} />
              <span className="font-inter text-sm">
                {reg.memberCount} {reg.memberCount === 1 ? 'member' : 'members'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40">
              <Calendar size={14} />
              <span className="font-inter text-xs">
                Registered{' '}
                {new Date(reg.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <DeleteTeamButton id={String(reg._id)} teamName={reg.teamName} />
      </div>

      {/* Members */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="font-display font-bold text-white text-base">Team Members</h2>
        </div>

        <div className="divide-y divide-white/5">
          {reg.members.map((member: Member, idx: number) => (
            <div key={idx} className="px-5 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-bio-cyan/15 border border-bio-cyan/30 flex items-center justify-center">
                  <span className="font-inter text-xs text-bright-cyan font-bold">{idx + 1}</span>
                </div>
                <span className="font-display text-sm font-bold text-white">{member.fullName}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {fields.slice(1).map(({ key, label }) => (
                  <div key={key} className="bg-white/[0.03] rounded-lg px-3 py-2.5">
                    <p className="font-inter text-[10px] text-white/30 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="font-inter text-sm text-white/80">{member[key] || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
