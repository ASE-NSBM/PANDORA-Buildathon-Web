'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res  = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      })
      const data = await res.json()

      if (data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.message || 'Login failed.')
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-full bg-bio-cyan/20 border border-bio-cyan/50 flex items-center justify-center shadow-cyan-glow">
            <span className="text-bright-cyan text-sm font-papyrus font-bold">P</span>
          </div>
          <div>
            <div className="font-papyrus text-white font-bold tracking-wider leading-none">PANDORA</div>
            <div className="font-inter text-white/35 text-[10px] uppercase tracking-widest mt-0.5">Admin Panel</div>
          </div>
        </div>

        <h1 className="font-papyrus text-xl font-bold text-white mb-1">Welcome back</h1>
        <p className="font-inter text-sm text-white/40 mb-6">Enter your admin password to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-inter text-white/60 text-xs mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
              className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 font-inter text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-bio-cyan/60 transition-all"
            />
          </div>

          {error && (
            <p className="font-inter text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bio-cyan text-deep-ocean font-inter font-semibold text-sm py-2.5 rounded-lg hover:bg-bright-cyan hover:shadow-cyan-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
