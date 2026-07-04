import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'admin_session'

/**
 * Edge middleware can't reach MongoDB, so it only performs a lightweight
 * presence check on the session cookie for admin pages (fast redirect / good
 * UX). The authoritative validation against the DB happens server-side in the
 * admin layout and in each admin API route handler.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value)

  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
