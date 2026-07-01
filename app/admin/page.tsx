import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { listRegistrations, countStats } from '@/lib/db'
import AdminShell from '@/components/admin/AdminShell'
import { Users, ClipboardList, CheckCircle2, Clock, Search, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

const statusBadge: Record<string, string> = {
  pending:   'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  confirmed: 'bg-green-500/15 text-green-300 border-green-500/30',
  rejected:  'bg-red-500/15 text-red-300 border-red-500/30',
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const session = await requireAdmin()
  const { q = '' } = await searchParams
  const rows  = listRegistrations(q.trim())
  const stats = countStats()

  const cards = [
    { label: 'Total Teams', value: stats.total,     icon: ClipboardList, color: 'text-bright-cyan' },
    { label: 'Members',     value: stats.members,   icon: Users,         color: 'text-ice-blue'    },
    { label: 'Pending',     value: stats.pending,   icon: Clock,         color: 'text-yellow-300'  },
    { label: 'Confirmed',   value: stats.confirmed, icon: CheckCircle2,  color: 'text-green-300'   },
  ]

  return (
    <AdminShell email={session.email ?? ''}>
      <h1 className="section-heading mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-poppins text-xs text-white/40 uppercase tracking-wider">{label}</span>
              <Icon size={18} className={color} />
            </div>
            <span className={`font-papyrus font-bold text-3xl ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <form className="mb-4 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search team name or status…"
          className="form-input pl-10"
        />
      </form>

      {/* Registrations table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 font-inter text-xs text-white/40 uppercase tracking-wider">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Team</th>
                <th className="px-5 py-3">Leader</th>
                <th className="px-5 py-3">Members</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Registered</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="font-poppins text-sm">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-white/30">
                    No registrations found.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 text-white/40">{r.id}</td>
                  <td className="px-5 py-4 text-white font-medium">{r.teamName}</td>
                  <td className="px-5 py-4 text-white/60">{r.leader ?? '—'}</td>
                  <td className="px-5 py-4 text-white/60">{r.memberCount}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs capitalize ${statusBadge[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/40 text-xs">{r.createdAt}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/registrations/${r.id}`}
                      className="inline-flex items-center gap-1 text-bright-cyan hover:text-ice-blue text-xs"
                    >
                      View <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
