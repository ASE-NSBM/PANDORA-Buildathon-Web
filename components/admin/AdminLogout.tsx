'use client'

import { LogOut } from 'lucide-react'

export default function AdminLogout() {
  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    // Hard navigation forces middleware + a fresh server render of the
    // admin layout, so the sidebar disappears now that the cookie is gone.
    window.location.href = '/admin/login'
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
