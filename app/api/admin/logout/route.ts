import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/adminAuth'

export async function POST() {
  try {
    await destroySession()
  } catch (error) {
    console.error('[admin/logout]', error)
  }
  return NextResponse.json({ success: true })
}
