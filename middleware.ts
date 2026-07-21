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

  // Forward the current path so the admin layout can distinguish the login
  // route (which must render for unauthenticated users) from protected pages.
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', pathname)
  const pass = () => NextResponse.next({ request: { headers: requestHeaders } })

  if (pathname === '/admin/login') return pass()

  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value)

  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return pass()
}

export const config = {
  matcher: ['/admin/:path*'],
}
