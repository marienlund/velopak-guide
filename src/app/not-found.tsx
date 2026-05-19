import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <FileQuestion className="w-12 h-12 text-gray-500 mx-auto" />
        <h1 className="text-xl font-bold text-white">Side ikke fundet</h1>
        <p className="text-gray-400 text-sm">
          Siden du leder efter findes ikke.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Tilbage til oversigt
        </Link>
      </div>
    </div>
  )
}
