import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

function generateToken(secret: string): string {
  return createHmac('sha256', secret).update('admin:authenticated').digest('hex')
}

export async function POST(req: Request) {
  const { password } = await req.json()

  const adminPassword = process.env.ADMIN_PASSWORD
  const adminSecret   = process.env.ADMIN_SECRET

  if (!adminPassword || !adminSecret) {
    return NextResponse.json({ success: false, message: 'Server misconfiguration.' }, { status: 500 })
  }

  if (password !== adminPassword) {
    return NextResponse.json({ success: false, message: 'Invalid password.' }, { status: 401 })
  }

  const token    = generateToken(adminSecret)
  const response = NextResponse.json({ success: true })

  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path:     '/',
    maxAge:   60 * 60 * 24 * 7,
  })

  return response
}
