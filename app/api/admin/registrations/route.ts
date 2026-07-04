import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Registration from '@/models/Registration'
import { getAdminSession } from '@/lib/adminAuth'

export async function GET(req: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })
  }

  await connectDB()

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const page   = Math.max(1, parseInt(searchParams.get('page')  || '1'))
  const limit  = Math.min(100, parseInt(searchParams.get('limit') || '20'))

  const query = search ? { teamName: { $regex: search, $options: 'i' } } : {}

  const [registrations, filteredTotal, totalTeams, membersAgg, recentCount] = await Promise.all([
    Registration.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Registration.countDocuments(query),
    Registration.countDocuments(),
    Registration.aggregate([{ $group: { _id: null, count: { $sum: '$memberCount' } } }]),
    Registration.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
  ])

  return NextResponse.json({
    registrations,
    total: filteredTotal,
    page,
    pages: Math.ceil(filteredTotal / limit),
    stats: {
      totalTeams,
      totalMembers: membersAgg[0]?.count || 0,
      recentCount,
    },
  })
}
