import type { SessionOptions } from 'iron-session'

export interface AdminSession {
  userId?: number
  email?:  string
  role?:   string
}

const password = process.env.ADMIN_SESSION_SECRET ?? ''

if (process.env.NODE_ENV === 'production' && password.length < 32) {
  throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters in production')
}

export const sessionOptions: SessionOptions = {
  // iron-session requires >= 32 chars; fall back to a dev-only value locally.
  password: password.length >= 32 ? password : 'dev-only-insecure-secret-change-me-32chars!!',
  cookieName: 'pandora_admin',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   8 * 60 * 60, // 8 hours
    path:     '/',
  },
}
