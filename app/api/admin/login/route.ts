import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSession, checkRateLimit, resetRateLimit } from '@/lib/auth'
import { getAdminByEmail } from '@/lib/db'

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const { allowed, retryAfterMin } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${retryAfterMin} minute(s).` },
      { status: 429 }
    )
  }

  let email = '', password = ''
  try {
    const body = await req.json()
    email    = String(body.email ?? '').toLowerCase().trim()
    password = String(body.password ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const user = getAdminByEmail(email)

  // Constant-ish time: always run a compare even when the user is missing,
  // so response timing doesn't reveal whether an email exists.
  const hash = user?.passwordHash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva'
  const ok = await bcrypt.compare(password, hash)

  if (!user || !ok) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const session = await getSession()
  session.userId = user.id
  session.email  = user.email
  session.role   = user.role
  await session.save()

  resetRateLimit(ip)
  return NextResponse.json({ success: true })
}
