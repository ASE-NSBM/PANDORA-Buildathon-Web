import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Registration from '@/models/Registration'
import { getAdminSession } from '@/lib/adminAuth'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })

  await connectDB()
  const { id } = await params
  const reg = await Registration.findById(id).lean()
  if (!reg) return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 })
  return NextResponse.json({ success: true, registration: reg })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 })

  await connectDB()
  const { id } = await params
  const reg = await Registration.findByIdAndDelete(id)
  if (!reg) return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 })
  return NextResponse.json({ success: true })
}
