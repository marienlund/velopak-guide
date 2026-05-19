'use client'

export function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-gray-700" />
        <div className="h-5 bg-gray-700 rounded w-48" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded bg-gray-800" />
        <div className="h-4 bg-gray-800 rounded w-64" />
      </div>
      <div className="flex items-start gap-2">
        <div className="w-3.5 h-3.5 rounded bg-gray-800 mt-0.5" />
        <div className="h-3 bg-gray-800 rounded w-full" />
      </div>
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div className="h-6 bg-gray-700 rounded w-56" />
        <div className="h-4 bg-gray-800 rounded w-72" />
        <div className="h-12 bg-gray-800 rounded w-full" />
        <div className="h-10 bg-gray-800 rounded w-40" />
      </div>
      <div className="space-y-3">
        <div className="h-5 bg-gray-800 rounded w-20" />
        <div className="h-48 bg-gray-800 rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
