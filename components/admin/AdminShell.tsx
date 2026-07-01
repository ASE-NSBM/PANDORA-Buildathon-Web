'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut } from 'lucide-react'

export default function AdminShell({
  email,
  children,
}: {
  email: string
  children: React.ReactNode
}) {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-midnight-blue/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-bio-cyan/20 border border-bio-cyan/50 flex items-center justify-center">
              <LayoutDashboard size={16} className="text-bright-cyan" />
            </div>
            <span className="font-papyrus font-bold text-white tracking-wider">PANDORA ADMIN</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-poppins text-xs text-white/40">{email}</span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 font-inter text-sm text-white/60 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
