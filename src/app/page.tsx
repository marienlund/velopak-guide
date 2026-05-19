'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import AddressCard from '@/components/AddressCard'
import AddressForm from '@/components/AddressForm'
import EmptyState from '@/components/EmptyState'
import { SkeletonList } from '@/components/Skeleton'
import { useAuth } from '@/lib/hooks/use-auth'
import { useAddresses } from '@/lib/hooks/use-addresses'
import type { AddressFormData } from '@/lib/types'

export default function HomePage() {
  const { profile, loading: authLoading, isAdmin } = useAuth()
  const { addresses, loading: addrLoading, createAddress } = useAddresses()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return addresses
    const q = search.toLowerCase()
    return addresses.filter(
      (a) =>
        a.company_name.toLowerCase().includes(q) ||
        a.street_address.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.zip.includes(q) ||
        (a.notes && a.notes.toLowerCase().includes(q))
    )
  }, [addresses, search])

  const handleCreate = async (data: AddressFormData) => {
    setFormLoading(true)
    setFormError('')
    try {
      await createAddress(data)
      setShowForm(false)
    } catch (err) {
      console.error(err)
      setFormError('Kunne ikke oprette adressen. Prøv igen.')
    } finally {
      setFormLoading(false)
    }
  }

  if (authLoading || addrLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-12 skeleton rounded-xl" />
          </div>
          <SkeletonList count={4} />
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <a href="/login" className="text-green-500 underline text-lg py-3 px-6">Log ind</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          {isAdmin && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium px-5 py-3.5 rounded-xl transition-colors shrink-0 min-h-[48px]"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Ny adresse</span>
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 text-green-400">Opret ny adresse</h2>
            {formError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {formError}
              </div>
            )}
            <AddressForm
              onSubmit={handleCreate}
              onCancel={() => { setShowForm(false); setFormError('') }}
              loading={formLoading}
            />
          </div>
        )}

        <div className="space-y-3">
          {filtered.length === 0 ? (
            search ? (
              <EmptyState
                variant="search"
                title={`Ingen resultater for "${search}"`}
                description="Prøv at søge efter firmanavn, adresse eller by"
                action={
                  <button
                    onClick={() => setSearch('')}
                    className="text-green-500 hover:text-green-400 font-medium py-2 px-4 transition-colors"
                  >
                    Ryd søgning
                  </button>
                }
              />
            ) : (
              <EmptyState
                title="Ingen adresser endnu"
                description={isAdmin ? 'Kom i gang ved at oprette den første adresse.' : 'Administratoren har ikke oprettet nogen adresser endnu.'}
                action={
                  isAdmin ? (
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Opret adresse
                    </button>
                  ) : undefined
                }
              />
            )
          ) : (
            <>
              <p className="text-sm text-gray-500">
                {filtered.length} adresse{filtered.length !== 1 ? 'r' : ''}
                {search && ` for "${search}"`}
              </p>
              {filtered.map((address) => (
                <AddressCard key={address.id} address={address} />
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
