import connectDB from '@/lib/mongodb'
import Registration from '@/models/Registration'
import Link from 'next/link'
import { Download, Users, UserCheck, Gauge } from 'lucide-react'
import TeamsSearch from '@/components/admin/TeamsSearch'
import { Suspense } from 'react'

interface RegistrationRecord {
  _id: string
  teamName: string
  memberCount: number
  createdAt: string
  members?: { fullName?: string; email?: string }[]
}

const PAGE_SIZE = 20
const TZ = 'Europe/Warsaw'

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const { search = '', page: pageStr = '1' } = await searchParams
  const page = Math.max(1, parseInt(pageStr))

  await connectDB()

  const query = search ? { teamName: { $regex: search, $options: 'i' } } : {}

  const [registrations, total, totalTeams, membersAgg] = await Promise.all([
    Registration.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Registration.countDocuments(query),
    Registration.countDocuments(),
    Registration.aggregate([{ $group: { _id: null, count: { $sum: '$memberCount' } } }]),
  ])

  const totalMembers = membersAgg[0]?.count || 0
  const avgTeamSize = totalTeams > 0 ? (totalMembers / totalTeams).toFixed(1) : '0'
  const pages = Math.ceil(total / PAGE_SIZE)

  const stats = [
    { label: 'Total Teams', value: totalTeams, icon: Users, color: 'text-bright-cyan', bg: 'bg-bio-cyan/10', ring: 'border-bio-cyan/20' },
    { label: 'Participants', value: totalMembers, icon: UserCheck, color: 'text-accent-purple', bg: 'bg-accent-purple/10', ring: 'border-accent-purple/20' },
    { label: 'Avg Team Size', value: avgTeamSize, icon: Gauge, color: 'text-ice-blue', bg: 'bg-ice-blue/10', ring: 'border-ice-blue/20' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-poppins text-xl font-bold text-white sm:text-2xl">Teams Management</h1>
          <p className="mt-1 font-inter text-sm text-white/40">
            {total} team{total !== 1 ? 's' : ''} registered
            {search && ` matching "${search}"`}
          </p>
        </div>

        <Link
          href="/api/admin/registrations/export"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-bio-cyan/30 bg-bio-cyan/10 px-4 py-2 font-inter text-sm font-medium text-bright-cyan transition-all hover:bg-bio-cyan/20"
        >
          <Download size={14} />
          Export CSV
        </Link>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, ring }) => (
          <div key={label} className={`flex items-center gap-3 rounded-xl border ${ring} bg-white/5 p-4`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <div className={`font-poppins text-xl font-bold ${color}`}>{value}</div>
              <div className="font-inter text-xs text-white/40">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <Suspense>
        <TeamsSearch />
      </Suspense>

      {/* Registry */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="font-poppins text-base font-bold text-white">Registered Registry</h2>
        </div>

        {registrations.length === 0 ? (
          <div className="px-5 py-16 text-center font-inter text-sm text-white/30">
            {search ? `No teams match "${search}".` : 'No registrations yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-5 py-3 text-left font-inter text-[11px] uppercase tracking-wider text-white/30">Team Name</th>
                  <th className="px-5 py-3 text-left font-inter text-[11px] uppercase tracking-wider text-white/30">Leader</th>
                  <th className="px-5 py-3 text-left font-inter text-[11px] uppercase tracking-wider text-white/30">Crew Size</th>
                  <th className="px-5 py-3 text-left font-inter text-[11px] uppercase tracking-wider text-white/30">Registered</th>
                  <th className="px-5 py-3 text-right font-inter text-[11px] uppercase tracking-wider text-white/30">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg: RegistrationRecord) => {
                  const leader = reg.members?.[0]?.fullName || reg.members?.[0]?.email || '—'
                  const initial = (reg.teamName?.[0] || '?').toUpperCase()
                  const shortId = String(reg._id).slice(-6).toUpperCase()
                  return (
                    <tr key={String(reg._id)} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-bio-cyan/30 bg-bio-cyan/15 font-poppins text-xs font-bold text-bright-cyan">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-inter text-sm font-medium text-white">{reg.teamName}</div>
                            <div className="font-inter text-[10px] uppercase tracking-wider text-white/30">ID · {shortId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-inter text-sm text-white/60">{leader}</td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full border border-bio-cyan/20 bg-bio-cyan/10 px-2.5 py-0.5 font-inter text-xs text-bright-cyan">
                          {reg.memberCount} {reg.memberCount === 1 ? 'member' : 'members'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-inter text-xs text-white/40">
                        {new Intl.DateTimeFormat('en-GB', {
                          timeZone: TZ,
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }).format(new Date(reg.createdAt))}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/teams/${reg._id}`}
                          className="inline-flex items-center rounded-lg border border-white/10 px-3 py-1.5 font-inter text-xs text-bright-cyan transition-all hover:border-bio-cyan/40 hover:bg-bio-cyan/10"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between font-inter text-sm">
          <span className="text-xs text-white/40">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/teams?${new URLSearchParams({ ...(search ? { search } : {}), page: String(page - 1) })}`}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-all hover:border-bio-cyan/40 hover:text-white"
              >
                ← Prev
              </Link>
            )}
            {page < pages && (
              <Link
                href={`/admin/teams?${new URLSearchParams({ ...(search ? { search } : {}), page: String(page + 1) })}`}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-all hover:border-bio-cyan/40 hover:text-white"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
