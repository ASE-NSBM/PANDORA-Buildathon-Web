import connectDB from '@/lib/mongodb'
import Registration from '@/models/Registration'
import Link from 'next/link'
import { Users, UserCheck, Clock, Gauge, ArrowRight, UserPlus } from 'lucide-react'
import GrowthChart from '@/components/admin/GrowthChart'
import CompositionDonut from '@/components/admin/CompositionDonut'

const TZ = 'Europe/Warsaw'
const GROWTH_DAYS = 14

interface RegistrationRecord {
  _id: string
  teamName: string
  memberCount: number
  createdAt: string
}

function warsawDay(d: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

function warsawLabel(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: '2-digit', month: 'short' }).format(d)
}

function relativeTime(date: Date) {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export default async function AdminDashboard() {
  await connectDB()

  const since = new Date(Date.now() - GROWTH_DAYS * 24 * 60 * 60 * 1000)

  const [totalTeams, membersAgg, recentCount, latestRegs, growthAgg, sizeAgg] = await Promise.all([
    Registration.countDocuments(),
    Registration.aggregate([{ $group: { _id: null, count: { $sum: '$memberCount' } } }]),
    Registration.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    Registration.find().sort({ createdAt: -1 }).limit(6).lean(),
    Registration.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: TZ } },
          count: { $sum: 1 },
        },
      },
    ]),
    Registration.aggregate([
      { $group: { _id: '$memberCount', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ])

  const totalMembers = membersAgg[0]?.count || 0
  const avgTeamSize = totalTeams > 0 ? (totalMembers / totalTeams).toFixed(1) : '0'

  // ── Build growth series (fill missing days with 0) ──────────────────────
  const growthMap = new Map<string, number>(growthAgg.map((g: { _id: string; count: number }) => [g._id, g.count]))
  const growth = Array.from({ length: GROWTH_DAYS }, (_, i) => {
    const d = new Date(Date.now() - (GROWTH_DAYS - 1 - i) * 24 * 60 * 60 * 1000)
    const key = warsawDay(d)
    return { label: warsawLabel(d), value: growthMap.get(key) || 0 }
  })

  // ── Team-size composition ───────────────────────────────────────────────
  const sizeMap = new Map<number, number>(sizeAgg.map((s: { _id: number; count: number }) => [s._id, s.count]))
  const bucket = (n: number) => sizeMap.get(n) || 0
  const fivePlus = Array.from(sizeMap.entries())
    .filter(([k]) => k >= 5)
    .reduce((sum, [, v]) => sum + v, 0)
  const composition = [
    { label: 'Solo (1)', value: bucket(1), color: '#64E6FF' },
    { label: 'Pairs (2)', value: bucket(2), color: '#24A3C7' },
    { label: 'Trios (3)', value: bucket(3), color: '#8A2BE2' },
    { label: 'Quads (4)', value: bucket(4), color: '#A3F7FF' },
    { label: '5+ members', value: fivePlus, color: '#4361ee' },
  ].filter((s) => s.value > 0)

  const stats = [
    { label: 'Total Teams', value: totalTeams, icon: Users, color: 'text-bright-cyan', ring: 'border-bio-cyan/20', bg: 'bg-bio-cyan/10' },
    { label: 'Participants', value: totalMembers, icon: UserCheck, color: 'text-accent-purple', ring: 'border-accent-purple/20', bg: 'bg-accent-purple/10' },
    { label: 'Last 7 Days', value: recentCount, icon: Clock, color: 'text-green-400', ring: 'border-green-500/20', bg: 'bg-green-500/10' },
    { label: 'Avg Team Size', value: avgTeamSize, icon: Gauge, color: 'text-ice-blue', ring: 'border-ice-blue/20', bg: 'bg-ice-blue/10' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-poppins text-xl font-bold text-white sm:text-2xl">Admin Overview</h1>
        <p className="mt-1 font-inter text-sm text-white/40">Pandora 2026 registration analytics</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
        {stats.map(({ label, value, icon: Icon, color, ring, bg }) => (
          <div key={label} className={`rounded-xl border ${ring} bg-white/5 p-4 sm:p-5`}>
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div className={`font-poppins text-2xl font-bold sm:text-3xl ${color}`}>{value}</div>
            <div className="mt-1 font-inter text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Growth */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-poppins text-base font-bold text-white">Registration Growth</h2>
              <p className="mt-0.5 font-inter text-xs text-white/40">Teams registered per day · last {GROWTH_DAYS} days</p>
            </div>
            <span className="rounded-full border border-bio-cyan/20 bg-bio-cyan/10 px-2.5 py-1 font-inter text-[10px] font-medium uppercase tracking-wider text-bright-cyan">
              Daily
            </span>
          </div>
          <GrowthChart data={growth} />
        </div>

        {/* Composition */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 font-poppins text-base font-bold text-white">Team Composition</h2>
          <CompositionDonut segments={composition} centerValue={totalTeams} centerLabel="Total Teams" />
        </div>
      </div>

      {/* Recent activity */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-poppins text-base font-bold text-white">Recent Activity</h2>
          <Link
            href="/admin/teams"
            className="flex items-center gap-1 font-inter text-xs text-bright-cyan transition-colors hover:text-white"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {latestRegs.length === 0 ? (
          <div className="px-5 py-10 text-center font-inter text-sm text-white/30">No registrations yet.</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {latestRegs.map((reg: RegistrationRecord) => (
              <li key={String(reg._id)} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-bio-cyan/20 bg-bio-cyan/10">
                  <UserPlus size={15} className="text-bright-cyan" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-inter text-sm text-white">
                    New registration · <span className="font-medium text-bright-cyan">{reg.teamName}</span>
                  </p>
                  <p className="font-inter text-xs text-white/35">
                    {reg.memberCount} member{reg.memberCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="shrink-0 font-inter text-xs text-white/30">{relativeTime(new Date(reg.createdAt))}</span>
                <Link
                  href={`/admin/teams/${reg._id}`}
                  className="hidden shrink-0 font-inter text-xs text-bright-cyan transition-colors hover:text-white sm:inline"
                >
                  View →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
