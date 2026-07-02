import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function generateToken(secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode('admin:authenticated'))
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  const token  = req.cookies.get('admin_token')?.value
  const secret = process.env.ADMIN_SECRET

  if (!secret || !token) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  const expected = await generateToken(secret)
  if (!timingSafeEqual(token, expected)) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
