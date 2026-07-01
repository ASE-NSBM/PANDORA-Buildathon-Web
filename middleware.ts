import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, type AdminSession } from '@/lib/session'

// Guards every /admin route except the login page. Also stamps security
// headers on all responses.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // ── Security headers (site-wide) ──
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('X-XSS-Protection', '0')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // ── Auth gate for /admin (login page stays public) ──
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = await getIronSession<AdminSession>(req, res, sessionOptions)
    if (!session.userId) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return res
}

export const config = {
  matcher: [
    // Run on everything except Next internals and static assets
    '/((?!_next/static|_next/image|favicon.ico|vids|.*\\.(?:jpg|jpeg|png|svg|mp4|ttf|woff2?)$).*)',
  ],
}
