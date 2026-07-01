import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { redirect } from 'next/navigation'
import { sessionOptions, type AdminSession } from './session'

/** Read the current admin session (server components / route handlers). */
export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<AdminSession>(cookieStore, sessionOptions)
}

/** Guard a server component — redirects to login if not authenticated. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession()
  if (!session.userId) redirect('/admin/login')
  return session
}

// ── In-memory login rate limiter (per IP) ──────────────────
// Single-instance dev/deploy. For multi-instance, back this with the DB or Redis.
const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterMin: number } {
  const now = Date.now()
  const entry = attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfterMin: 0 }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMin: Math.ceil((entry.resetAt - now) / 60000) }
  }

  entry.count += 1
  return { allowed: true, retryAfterMin: 0 }
}

/** Clear failed-attempt counter after a successful login. */
export function resetRateLimit(ip: string): void {
  attempts.delete(ip)
}
