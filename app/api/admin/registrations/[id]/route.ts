import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getRegistration, updateRegistration } from '@/lib/db'

const VALID_STATUS = ['pending', 'confirmed', 'rejected']

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const regId = Number(id)
  if (!Number.isInteger(regId) || regId < 1) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  if (!getRegistration(regId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  let status = '', notes = ''
  try {
    const body = await req.json()
    status = String(body.status ?? '')
    notes  = String(body.notes ?? '').slice(0, 2000)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!VALID_STATUS.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  updateRegistration(regId, status, notes)
  return NextResponse.json({ success: true })
}
