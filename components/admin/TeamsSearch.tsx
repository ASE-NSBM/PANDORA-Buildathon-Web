'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function TeamsSearch() {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') || '')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (value.trim()) params.set('search', value.trim())
    router.push(`/admin/teams?${params.toString()}`)
  }

  const clear = () => {
    setValue('')
    router.push('/admin/teams')
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Search team name…"
          className="pl-9 pr-4 py-2 bg-white/5 border border-white/15 rounded-lg font-inter text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-bio-cyan/60 transition-all w-56"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-bio-cyan text-deep-ocean font-inter text-sm font-semibold rounded-lg hover:bg-bright-cyan transition-colors">
        Search
      </button>
      {searchParams.get('search') && (
        <button type="button" onClick={clear} className="p-2 text-white/40 hover:text-white transition-colors">
          <X size={16} />
        </button>
      )}
    </form>
  )
}
