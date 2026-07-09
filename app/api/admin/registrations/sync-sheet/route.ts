import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Registration from '@/models/Registration'
import { getAdminSession } from '@/lib/adminAuth'
import { syncAllRegistrationsToSheet } from '@/lib/googleSheets'

/**
 * Admin-only: push every existing registration into the Google Sheet,
 * replacing its current contents (header + all rows). Use to backfill the
 * sheet with records created before the sync was wired up.
 */
export async function POST() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })
  }

  try {
    await connectDB()
    const regs = await Registration.find().sort({ createdAt: 1 }).lean()

    const { synced } = await syncAllRegistrationsToSheet(
      regs.map((r) => ({
        teamName: r.teamName,
        memberCount: r.memberCount,
        members: r.members,
        createdAt: r.createdAt,
      })),
    )

    return NextResponse.json({ success: true, synced })
  } catch (err) {
    console.error('[sheets] sync failed:', err)
    const message = err instanceof Error ? err.message : 'Sheet sync failed.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
