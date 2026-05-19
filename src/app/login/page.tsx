'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bike, LogIn, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isMockMode } from '@/lib/mock-data'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isMockMode()) {
      router.push('/')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError('Forkert email eller adgangskode')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Noget gik galt. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-4 bg-green-500/10 rounded-2xl">
              <Bike className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Velopak Guide</h1>
          <p className="text-gray-400 text-sm">Log ind for at se adresser</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.dk"
              autoComplete="email"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-base min-h-[48px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Adgangskode</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-base min-h-[48px]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl transition-colors min-h-[48px] text-base"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Logger ind...' : 'Log ind'}
          </button>
        </form>

        {isMockMode() && (
          <div className="text-center">
            <p className="text-xs text-yellow-500/70 bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3">
              🧪 Mock-tilstand — klik &ldquo;Log ind&rdquo; for at fortsætte uden rigtig auth
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
