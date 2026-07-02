'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function AdminLogout() {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <button
      onClick={logout}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-inter text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
    >
      <LogOut size={16} />
      Logout
    </button>
  )
}
