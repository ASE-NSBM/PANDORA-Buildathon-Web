import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { getRegistration, getMembers } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import StatusEditor from '@/components/admin/StatusEditor'
import { ArrowLeft, Crown, Mail, Phone, MessageCircle, IdCard } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function RegistrationDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await requireAdmin()
  const { id } = await params
  const regId = Number(id)
  if (!Number.isInteger(regId)) notFound()

  const reg = getRegistration(regId)
  if (!reg) notFound()

  const members = getMembers(regId)

  return (
    <AdminShell email={session.email ?? ''}>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-white/50 hover:text-bright-cyan text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-heading">{reg.teamName}</h1>
          <p className="font-poppins text-white/40 text-sm mt-1">
            Registration #{reg.id} · {reg.memberCount} member(s) · registered {reg.createdAt}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-papyrus font-bold text-bright-cyan text-lg">Team Members</h2>
          {members.map((m) => (
            <div key={m.id} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-poppins font-semibold text-white">{m.fullName}</span>
                  {m.isLeader === 1 && (
                    <span className="inline-flex items-center gap-1 text-xs text-yellow-300 bg-yellow-500/15 border border-yellow-500/30 rounded-full px-2 py-0.5">
                      <Crown size={11} /> Leader
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-poppins text-sm text-white/60">
                <div className="flex items-center gap-2"><IdCard size={14} className="text-bright-cyan" /> {m.studentId}</div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-bright-cyan" /> {m.email}</div>
                <div className="flex items-center gap-2"><Phone size={14} className="text-bright-cyan" /> {m.contactNumber}</div>
                {m.whatsappNumber && (
                  <div className="flex items-center gap-2"><MessageCircle size={14} className="text-bright-cyan" /> {m.whatsappNumber}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Status editor */}
        <div className="lg:col-span-1">
          <StatusEditor id={reg.id} initialStatus={reg.status} initialNotes={reg.notes ?? ''} />
        </div>
      </div>
    </AdminShell>
  )
}
