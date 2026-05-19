'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <h1 className="text-xl font-bold text-white">Noget gik galt</h1>
        <p className="text-gray-400 text-sm">
          Der opstod en fejl. Prøv at genindlæse siden.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Prøv igen
        </button>
      </div>
    </div>
  )
}
