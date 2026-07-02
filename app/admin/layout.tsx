import { cookies } from 'next/headers'
import { createHmac } from 'crypto'
import AdminNav from '@/components/admin/AdminNav'
import AdminLogout from '@/components/admin/AdminLogout'
import PageTransition from '@/components/PageTransition'
import Link from 'next/link'

function verifyToken(token: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update('admin:authenticated').digest('hex')
  if (token.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore   = await cookies()
  const token         = cookieStore.get('admin_token')?.value
  const secret        = process.env.ADMIN_SECRET ?? ''
  const authenticated = token ? verifyToken(token, secret) : false

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#030d15] flex items-center justify-center">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030d15] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#050f18] border-r border-white/10 flex flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-bio-cyan/20 border border-bio-cyan/50 flex items-center justify-center group-hover:shadow-cyan-glow transition-all duration-300">
              <span className="text-bright-cyan text-xs font-papyrus font-bold">P</span>
            </div>
            <div>
              <div className="font-papyrus text-white font-bold tracking-wider text-sm leading-none">PANDORA</div>
              <div className="font-inter text-white/35 text-[10px] mt-0.5 uppercase tracking-widest">Admin Panel</div>
            </div>
          </Link>
        </div>

        <AdminNav />

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-inter text-xs text-white/35 hover:text-white/60 transition-colors"
          >
            ← Back to site
          </Link>
          <AdminLogout />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-60 min-h-screen p-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  )
}
