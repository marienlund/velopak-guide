'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Building2, StickyNote, ExternalLink, Pencil, Trash2, Map, AlertTriangle } from 'lucide-react'
import Header from '@/components/Header'
import AddressForm from '@/components/AddressForm'
import PhotoUpload from '@/components/PhotoUpload'
import EmptyState from '@/components/EmptyState'
import { SkeletonDetail } from '@/components/Skeleton'
import { useAuth } from '@/lib/hooks/use-auth'
import { useAddress } from '@/lib/hooks/use-addresses'
import { useAddresses } from '@/lib/hooks/use-addresses'
import type { AddressFormData } from '@/lib/types'

export default function AddressDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { isAdmin } = useAuth()
  const { address, loading, refetch } = useAddress(id)
  const { updateAddress, deleteAddress } = useAddresses()
  const [editing, setEditing] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          <div className="h-5 w-20 skeleton rounded" />
          <SkeletonDetail />
        </main>
      </div>
    )
  }

  if (!address) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-6">
          <EmptyState
            title="Adresse ikke fundet"
            description="Adressen er muligvis blevet slettet eller eksisterer ikke."
            action={
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Tilbage til oversigt
              </button>
            }
          />
        </main>
      </div>
    )
  }

  const handleDeletePhoto = async (photoId: string, storagePath: string) => {
    if (!confirm('Slet dette foto?')) return

    try {
      const supabase = (await import('@/lib/supabase/client')).createClient()

      // Delete from storage
      await supabase.storage.from('address-photos').remove([storagePath])

      // Delete from database
      await supabase.from('address_photos').delete().eq('id', photoId)

      // Refresh
      refetch()
    } catch (err) {
      console.error('Delete photo failed:', err)
    }
  }

  const handleUpdate = async (data: AddressFormData) => {
    setFormLoading(true)
    setFormError('')
    try {
      await updateAddress(id, data)
      setEditing(false)
    } catch (err) {
      console.error(err)
      setFormError('Kunne ikke opdatere adressen. Prøv igen.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteAddress(id)
      router.push('/')
    } catch (err) {
      console.error(err)
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Back button — big touch target */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-2 pr-4 -ml-1 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Tilbage</span>
        </button>

        {editing ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 text-green-400">Rediger adresse</h2>
            {formError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}
            <AddressForm
              initial={address}
              onSubmit={handleUpdate}
              onCancel={() => { setEditing(false); setFormError('') }}
              loading={formLoading}
            />
          </div>
        ) : (
          <>
            {/* Address info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-500 shrink-0" />
                  {address.company_name}
                </h1>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(true)}
                      className="p-3 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Rediger"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Slet"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500 shrink-0" />
                  {address.street_address}, {address.zip} {address.city}
                </p>

                {address.notes && (
                  <div className="flex items-start gap-2 text-gray-300">
                    <StickyNote className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <p className="whitespace-pre-wrap">{address.notes}</p>
                  </div>
                )}

                {address.google_maps_url && (
                  <a
                    href={address.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600/10 text-green-400 hover:bg-green-600/20 active:bg-green-600/30 px-5 py-3 rounded-xl transition-colors font-medium min-h-[48px]"
                  >
                    <Map className="w-5 h-5" />
                    Åbn i Google Maps
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <p className="text-xs text-gray-600 pt-2 border-t border-gray-800">
                Oprettet: {new Date(address.created_at).toLocaleDateString('da-DK')}
                {address.updated_at !== address.created_at && (
                  <> · Opdateret: {new Date(address.updated_at).toLocaleDateString('da-DK')}</>
                )}
              </p>
            </div>

            {/* Photos section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-300">Fotos</h2>

              {address.photos && address.photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {address.photos.map((photo) => (
                    <div key={photo.id} className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900 relative group">
                      <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-600">
                        {photo.url ? (
                          <img
                            src={photo.url}
                            alt={photo.caption || 'Foto'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm">📷 {photo.storage_path}</span>
                        )}
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeletePhoto(photo.id, photo.storage_path)}
                          className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-red-600 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                          title="Slet foto"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      )}
                      {photo.caption && (
                        <p className="px-3 py-2 text-sm text-gray-400 bg-gray-900">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm py-4">Ingen fotos endnu</p>
              )}

              {isAdmin && (
                <PhotoUpload
                  addressId={address.id}
                  onUploadComplete={() => refetch()}
                />
              )}
            </div>
          </>
        )}

        {/* Delete confirmation modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-full">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Slet adresse?</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Er du sikker på du vil slette <strong className="text-white">{address.company_name}</strong>? Handlingen kan ikke fortrydes.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors min-h-[48px]"
                >
                  {deleteLoading ? 'Sletter...' : 'Ja, slet'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleteLoading}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-300 font-medium py-3 rounded-xl transition-colors min-h-[48px]"
                >
                  Annuller
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
