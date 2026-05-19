'use client'

import { MapPin, Building2, StickyNote, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Address } from '@/lib/types'

interface AddressCardProps {
  address: Address
}

export default function AddressCard({ address }: AddressCardProps) {
  return (
    <Link
      href={`/adresse/${address.id}`}
      className="block bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 hover:border-green-500/50 hover:bg-gray-900/80 transition-all active:scale-[0.98] min-h-[72px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          <h3 className="font-semibold text-white truncate flex items-center gap-2">
            <Building2 className="w-4 h-4 text-green-500 shrink-0" />
            {address.company_name}
          </h3>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{address.street_address}, {address.zip} {address.city}</span>
          </p>
          {address.notes && (
            <p className="text-xs text-gray-500 flex items-start gap-2 line-clamp-2">
              <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{address.notes}</span>
            </p>
          )}
          {address.photos && address.photos.length > 0 && (
            <span className="inline-block text-xs text-gray-600 mt-1">
              📷 {address.photos.length} foto{address.photos.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
      </div>
    </Link>
  )
}
