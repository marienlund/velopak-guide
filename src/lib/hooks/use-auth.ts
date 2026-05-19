'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isMockMode, mockProfile } from '@/lib/mock-data'
import type { Profile } from '@/lib/types'

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isMockMode()) {
      setProfile(mockProfile)
      setLoading(false)
      return
    }

    const supabase = createClient()

    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    getProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getProfile()
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    if (isMockMode()) {
      setProfile(null)
      return
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    setProfile(null)
  }

  return { profile, loading, signOut, isAdmin: profile?.role === 'admin' }
}
