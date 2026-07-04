import AdminNav from '@/components/admin/AdminNav'
import AdminLogout from '@/components/admin/AdminLogout'
import PageTransition from '@/components/PageTransition'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminSession } from '@/lib/adminAuth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session       = await getAdminSession()
  const authenticated = session !== null

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
          <Link href="/admin" className="group inline-flex flex-col gap-1.5">
            <Image
              src="/logo-Pandora.png"
              alt="Pandora"
              width={1201}
              height={239}
              priority
              className="h-auto w-[150px] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(100,230,255,0.45)]"
            />
            <span className="pl-0.5 font-inter text-[10px] uppercase tracking-[0.25em] text-white/35">
              Admin Panel
            </span>
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
