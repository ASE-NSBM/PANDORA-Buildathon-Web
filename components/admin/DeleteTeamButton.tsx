'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

export default function DeleteTeamButton({ id, teamName }: { id: string; teamName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete team "${teamName}"? This cannot be undone.`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/teams')
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.message || 'Delete failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 font-inter text-sm font-medium rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 size={14} />
      {loading ? 'Deleting…' : 'Delete Team'}
    </button>
  )
}
