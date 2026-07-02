'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users } from 'lucide-react'

const links = [
  { href: '/admin',       label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/teams', label: 'Teams',     icon: Users,           exact: false },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-4 space-y-1">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-bio-cyan/15 text-bright-cyan border border-bio-cyan/30'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
