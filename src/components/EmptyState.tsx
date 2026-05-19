'use client'

import { PackageOpen, SearchX } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  variant?: 'default' | 'search'
}

export default function EmptyState({ icon, title, description, action, variant = 'default' }: EmptyStateProps) {
  const defaultIcon = variant === 'search' 
    ? <SearchX className="w-12 h-12 text-gray-600" />
    : <PackageOpen className="w-12 h-12 text-gray-600" />

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
      {icon || defaultIcon}
      <h3 className="text-lg font-medium text-gray-400">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
