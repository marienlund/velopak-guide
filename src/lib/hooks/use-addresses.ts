'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isMockMode, mockAddresses } from '@/lib/mock-data'
import type { Address, AddressFormData } from '@/lib/types'

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAddresses = useCallback(async () => {
    if (isMockMode()) {
      setAddresses(mockAddresses)
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('addresses')
      .select(`
        *,
        photos:address_photos(*)
      `)
      .order('company_name')

    if (!error && data) {
      setAddresses(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const createAddress = async (formData: AddressFormData) => {
    if (isMockMode()) {
      const newAddr: Address = {
        id: crypto.randomUUID(),
        ...formData,
        created_by: 'mock-admin-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        photos: [],
      }
      setAddresses(prev => [...prev, newAddr])
      return newAddr
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...formData, created_by: user?.id })
      .select()
      .single()

    if (error) throw error
    await fetchAddresses()
    return data
  }

  const updateAddress = async (id: string, formData: AddressFormData) => {
    if (isMockMode()) {
      setAddresses(prev =>
        prev.map(a => a.id === id ? { ...a, ...formData, updated_at: new Date().toISOString() } : a)
      )
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('addresses')
      .update(formData)
      .eq('id', id)

    if (error) throw error
    await fetchAddresses()
  }

  const deleteAddress = async (id: string) => {
    if (isMockMode()) {
      setAddresses(prev => prev.filter(a => a.id !== id))
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchAddresses()
  }

  return { addresses, loading, createAddress, updateAddress, deleteAddress, refetch: fetchAddresses }
}

export function useAddress(id: string) {
  const [address, setAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAddress = useCallback(async () => {
    if (isMockMode()) {
      const found = mockAddresses.find(a => a.id === id) || null
      setAddress(found)
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('addresses')
      .select(`
        *,
        photos:address_photos(*)
      `)
      .eq('id', id)
      .single()

    if (!error && data) {
      // Build public URLs for photos
      if (data.photos) {
        data.photos = data.photos.map((photo: { storage_path: string; [key: string]: unknown }) => ({
          ...photo,
          url: supabase.storage.from('address-photos').getPublicUrl(photo.storage_path).data.publicUrl,
        }))
      }
      setAddress(data)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchAddress()
  }, [fetchAddress])

  return { address, loading, refetch: fetchAddress }
}
