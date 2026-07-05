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
    <div className="min-h-dvh bg-[#030d15] flex">
      {/* Sidebar (desktop) / top bar (mobile) */}
      <aside className="fixed z-40 bg-[#050f18] border-white/10 flex
                        top-0 left-0 right-0 h-auto flex-row items-center gap-1 border-b px-2
                        lg:right-auto lg:h-full lg:w-60 lg:flex-col lg:items-stretch lg:gap-0 lg:border-b-0 lg:border-r lg:px-0">
        {/* Logo */}
        <div className="p-2.5 shrink-0 lg:p-5 lg:border-b border-white/10">
          <Link href="/admin" className="group inline-flex flex-col gap-1.5">
            <Image
              src="/logo-Pandora.png"
              alt="Pandora"
              width={1201}
              height={239}
              priority
              className="h-auto w-[104px] lg:w-[150px] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(100,230,255,0.45)]"
            />
            <span className="hidden lg:block pl-0.5 font-inter text-[10px] uppercase tracking-[0.25em] text-white/35">
              Admin Panel
            </span>
          </Link>
        </div>

        <AdminNav />

        {/* Bottom (desktop) / right end (mobile) */}
        <div className="flex items-center gap-1 p-2 shrink-0 lg:block lg:p-4 lg:border-t border-white/10 lg:space-y-1">
          <Link
            href="/"
            className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg font-inter text-xs text-white/35 hover:text-white/60 transition-colors"
          >
            ← Back to site
          </Link>
          <AdminLogout />
        </div>
      </aside>

      {/* Content — offset for the top bar (mobile) / sidebar (desktop) */}
      <main className="flex-1 pt-20 lg:pt-8 lg:ml-60 min-h-dvh p-4 sm:p-6 lg:p-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  )
}
