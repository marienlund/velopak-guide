export type UserRole = 'admin' | 'courier'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface Address {
  id: string
  company_name: string
  street_address: string
  city: string
  zip: string
  notes: string | null
  google_maps_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  photos?: AddressPhoto[]
}

export interface AddressPhoto {
  id: string
  address_id: string
  storage_path: string
  caption: string | null
  sort_order: number
  created_at: string
  url?: string // resolved public URL
}

export interface AddressFormData {
  company_name: string
  street_address: string
  city: string
  zip: string
  notes: string
  google_maps_url: string
}
