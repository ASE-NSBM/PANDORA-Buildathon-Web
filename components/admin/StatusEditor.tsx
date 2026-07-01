'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'

const STATUSES = ['pending', 'confirmed', 'rejected'] as const

export default function StatusEditor({
  id,
  initialStatus,
  initialNotes,
}: {
  id: number
  initialStatus: string
  initialNotes: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [notes,  setNotes]  = useState(initialNotes)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const save = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      })
      if (res.ok) {
        setSaved(true)
        router.refresh()
      } else {
        const d = await res.json().catch(() => ({}))
        alert(d.error ?? 'Save failed')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass-card p-6 space-y-5">
      <h2 className="font-papyrus font-bold text-bright-cyan text-lg">Manage</h2>

      <div>
        <label className="form-label">Status</label>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setStatus(s); setSaved(false) }}
              className={`px-3 py-2 rounded-lg font-inter text-xs capitalize transition-all ${
                status === s
                  ? 'bg-bio-cyan text-deep-ocean font-semibold'
                  : 'bg-white/5 border border-white/15 text-white/50 hover:border-bio-cyan/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setSaved(false) }}
          rows={4}
          placeholder="Internal notes about this team…"
          className="form-input resize-none"
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="btn-primary w-full justify-center inline-flex items-center gap-2 disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
      </button>
    </div>
  )
}
