'use client'

import { useState } from 'react'
import { Save, X } from 'lucide-react'
import type { AddressFormData, Address } from '@/lib/types'

interface AddressFormProps {
  initial?: Address | null
  onSubmit: (data: AddressFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function AddressForm({ initial, onSubmit, onCancel, loading }: AddressFormProps) {
  const [form, setForm] = useState<AddressFormData>({
    company_name: initial?.company_name ?? '',
    street_address: initial?.street_address ?? '',
    city: initial?.city ?? 'København',
    zip: initial?.zip ?? '',
    notes: initial?.notes ?? '',
    google_maps_url: initial?.google_maps_url ?? '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(form)
  }

  const inputClass =
    'w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors text-base min-h-[48px]'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Firmanavn *</label>
        <input
          type="text"
          required
          value={form.company_name}
          onChange={(e) => setForm(prev => ({ ...prev, company_name: e.target.value }))}
          placeholder="F.eks. Novo Nordisk"
          className={inputClass}
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Adresse *</label>
        <input
          type="text"
          required
          value={form.street_address}
          onChange={(e) => setForm(prev => ({ ...prev, street_address: e.target.value }))}
          placeholder="F.eks. Novo Allé 1"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Postnr. *</label>
          <input
            type="text"
            required
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.zip}
            onChange={(e) => setForm(prev => ({ ...prev, zip: e.target.value }))}
            placeholder="2100"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">By *</label>
          <input
            type="text"
            required
            value={form.city}
            onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
            placeholder="København"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Noter</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="F.eks. levering ved bagindgang, ring til reception..."
          rows={3}
          className={`${inputClass} min-h-[96px]`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Google Maps link</label>
        <input
          type="url"
          value={form.google_maps_url}
          onChange={(e) => setForm(prev => ({ ...prev, google_maps_url: e.target.value }))}
          placeholder="https://maps.google.com/..."
          className={inputClass}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl transition-colors min-h-[48px]"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Gemmer...' : initial ? 'Opdater' : 'Opret adresse'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-300 rounded-xl transition-colors min-h-[48px]"
        >
          <X className="w-5 h-5" />
          Annuller
        </button>
      </div>
    </form>
  )
}
