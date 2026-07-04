import connectDB from '@/lib/mongodb'
import Registration from '@/models/Registration'
import Link from 'next/link'
import { Download } from 'lucide-react'
import TeamsSearch from '@/components/admin/TeamsSearch'
import { Suspense } from 'react'

interface RegistrationRecord {
  _id: string;
  teamName: string;
  memberCount: number;
  createdAt: string;
  members?: { email?: string }[];
}

const PAGE_SIZE = 20

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const { search = '', page: pageStr = '1' } = await searchParams
  const page = Math.max(1, parseInt(pageStr))

  await connectDB()

  const query = search ? { teamName: { $regex: search, $options: 'i' } } : {}

  const [registrations, total] = await Promise.all([
    Registration.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Registration.countDocuments(query),
  ])

  const pages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-papyrus text-2xl font-bold text-white">Teams</h1>
          <p className="font-inter text-sm text-white/40 mt-1">
            {total} team{total !== 1 ? 's' : ''} registered
            {search && ` matching "${search}"`}
          </p>
        </div>

        <Link
          href="/api/admin/registrations/export"
          className="inline-flex items-center gap-2 px-4 py-2 bg-bio-cyan/10 border border-bio-cyan/30 text-bright-cyan font-inter text-sm font-medium rounded-lg hover:bg-bio-cyan/20 transition-all"
        >
          <Download size={14} />
          Export CSV
        </Link>
      </div>

      {/* Search */}
      <Suspense>
        <TeamsSearch />
      </Suspense>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {registrations.length === 0 ? (
          <div className="px-5 py-16 text-center font-inter text-sm text-white/30">
            {search ? `No teams match "${search}".` : 'No registrations yet.'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-5 py-3 text-left font-inter text-xs text-white/30 uppercase tracking-wider">Team Name</th>
                <th className="px-5 py-3 text-left font-inter text-xs text-white/30 uppercase tracking-wider">Members</th>
                <th className="px-5 py-3 text-left font-inter text-xs text-white/30 uppercase tracking-wider">Lead Email</th>
                <th className="px-5 py-3 text-left font-inter text-xs text-white/30 uppercase tracking-wider">Registered</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg: RegistrationRecord) => (
                <tr key={String(reg._id)} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-3.5 font-inter text-sm text-white font-medium">{reg.teamName}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-inter text-xs bg-bio-cyan/10 text-bright-cyan border border-bio-cyan/20 px-2 py-0.5 rounded-full">
                      {reg.memberCount} {reg.memberCount === 1 ? 'member' : 'members'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-inter text-sm text-white/50">{reg.members?.[0]?.email ?? '—'}</td>
                  <td className="px-5 py-3.5 font-inter text-xs text-white/40">
                    {new Date(reg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
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

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between font-inter text-sm">
          <span className="text-white/40 text-xs">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/teams?${new URLSearchParams({ ...(search ? { search } : {}), page: String(page - 1) })}`}
                className="px-3 py-1.5 bg-white/5 border border-white/15 text-white/60 rounded-lg hover:border-bio-cyan/40 hover:text-white transition-all text-xs"
              >
                ← Prev
              </Link>
            )}
            {page < pages && (
              <Link
                href={`/admin/teams?${new URLSearchParams({ ...(search ? { search } : {}), page: String(page + 1) })}`}
                className="px-3 py-1.5 bg-white/5 border border-white/15 text-white/60 rounded-lg hover:border-bio-cyan/40 hover:text-white transition-all text-xs"
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
