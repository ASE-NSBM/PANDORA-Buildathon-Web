import connectDB from '@/lib/mongodb'
import Registration from '@/models/Registration'
import Link from 'next/link'
import { Users, UserCheck, Clock, ArrowRight } from 'lucide-react'

interface RegistrationRecord {
  _id: string;
  teamName: string;
  memberCount: number;
  createdAt: string;
}

export default async function AdminDashboard() {
  await connectDB()

  const [totalTeams, membersAgg, recentCount, latestRegs] = await Promise.all([
    Registration.countDocuments(),
    Registration.aggregate([{ $group: { _id: null, count: { $sum: '$memberCount' } } }]),
    Registration.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    Registration.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])

  const totalMembers = membersAgg[0]?.count || 0

  const stats = [
    { label: 'Total Teams',     value: totalTeams,   icon: Users,      color: 'text-bright-cyan',   bg: 'bg-bio-cyan/10',    border: 'border-bio-cyan/20' },
    { label: 'Total Members',   value: totalMembers, icon: UserCheck,  color: 'text-accent-purple', bg: 'bg-accent-purple/10', border: 'border-accent-purple/20' },
    { label: 'Last 7 Days',     value: recentCount,  icon: Clock,      color: 'text-green-400',     bg: 'bg-green-500/10',   border: 'border-green-500/20' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-papyrus text-2xl font-bold text-white">Dashboard</h1>
        <p className="font-inter text-sm text-white/40 mt-1">BuilderThan 2026 registration overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-white/5 border ${border} rounded-xl p-5`}>
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <div className={`font-papyrus text-3xl font-bold ${color}`}>{value}</div>
            <div className="font-inter text-xs text-white/40 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent registrations */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-papyrus font-bold text-white text-base">Recent Registrations</h2>
          <Link href="/admin/teams" className="font-inter text-xs text-bright-cyan hover:text-white flex items-center gap-1 transition-colors">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {latestRegs.length === 0 ? (
          <div className="px-5 py-10 text-center font-inter text-sm text-white/30">
            No registrations yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left font-inter text-xs text-white/30 uppercase tracking-wider">Team</th>
                <th className="px-5 py-3 text-left font-inter text-xs text-white/30 uppercase tracking-wider">Members</th>
                <th className="px-5 py-3 text-left font-inter text-xs text-white/30 uppercase tracking-wider">Registered</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {latestRegs.map((reg: RegistrationRecord) => (
                <tr key={String(reg._id)} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 font-inter text-sm text-white">{reg.teamName}</td>
                  <td className="px-5 py-3 font-inter text-sm text-white/60">{reg.memberCount}</td>
                  <td className="px-5 py-3 font-inter text-xs text-white/40">
                    {new Date(reg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/teams/${reg._id}`}
                      className="font-inter text-xs text-bright-cyan hover:text-white transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
