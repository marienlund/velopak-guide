'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { Bike, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  const { profile, signOut, isAdmin } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-green-500 font-bold text-lg py-2">
          <Bike className="w-6 h-6" />
          <span>Velopak Guide</span>
        </Link>

        {profile && (
          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <span className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 px-2.5 py-1.5 rounded-full font-medium">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            )}
            <span className="text-sm text-gray-400 hidden sm:inline truncate max-w-[150px]">
              {profile.full_name || profile.email}
            </span>
            <button
              onClick={signOut}
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Log ud"
              aria-label="Log ud"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
