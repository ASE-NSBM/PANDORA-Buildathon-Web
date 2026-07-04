import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { createSession } from '@/lib/adminAuth'

export async function POST(req: Request) {
  let body: { username?: unknown; password?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 })
  }

  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!username || !password) {
    return NextResponse.json({ success: false, message: 'Username and password are required.' }, { status: 400 })
  }

  try {
    await connectDB()

    const admin = await Admin.findOne({ username }).lean<{ _id: unknown; username: string; passwordHash: string } | null>()

    // Always run a bcrypt compare (even when the user is missing) to keep the
    // response time uniform and avoid leaking which usernames exist.
    const hash = admin?.passwordHash ?? '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin'
    const valid = await bcrypt.compare(password, hash)

    if (!admin || !valid) {
      return NextResponse.json({ success: false, message: 'Invalid username or password.' }, { status: 401 })
    }

    await createSession({ _id: admin._id, username: admin.username })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/login]', error)
    return NextResponse.json({ success: false, message: 'Login failed. Try again.' }, { status: 500 })
  }
}
