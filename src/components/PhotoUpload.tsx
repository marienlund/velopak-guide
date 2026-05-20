'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isMockMode } from '@/lib/mock-data'

interface PhotoUploadProps {
  addressId: string
  onUploadComplete: () => void
}

export default function PhotoUpload({ addressId, onUploadComplete }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Filen er for stor. Maks 10 MB.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    setError('DEBUG: handleUpload kaldt')
    if (!fileRef.current?.files?.[0]) {
      setError('DEBUG: ingen fil valgt')
      return
    }
    setUploading(true)
    setError('DEBUG: starter upload...')

    try {
      if (isMockMode()) {
        await new Promise(resolve => setTimeout(resolve, 500))
        onUploadComplete()
        reset()
        return
      }

      const supabase = createClient()
      const file = fileRef.current.files[0]
      const ext = file.name.split('.').pop()
      const path = `${addressId}/${crypto.randomUUID()}.${ext}`

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('address-photos')
        .upload(path, file)

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        setError(`Storage fejl: ${uploadError.message}`)
        setUploading(false)
        return
      }

      setError('✅ Storage OK: ' + path)

      const { error: dbError } = await supabase
        .from('address_photos')
        .insert({
          address_id: addressId,
          storage_path: path,
          caption: caption || null,
          sort_order: 0,
        })

      if (dbError) {
        console.error('DB insert error:', dbError)
        setError(`Database fejl: ${dbError.message}`)
        setUploading(false)
        return
      }

      setError('✅ ALT OK — billedet er gemt!')
      onUploadComplete()
      reset()
    } catch (err) {
      console.error('Upload failed:', err)
      const msg = err instanceof Error ? err.message : 'Ukendt fejl'
      setError(`Upload mislykkedes: ${msg}`)
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setPreview(null)
    setCaption('')
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className={`p-4 rounded-xl text-sm font-medium ${error.startsWith('✅') ? 'bg-green-500/20 border border-green-500/30 text-green-300' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
          <AlertTriangle className="w-4 h-4 shrink-0 inline mr-2" />
          {error}
        </div>
      )}

      {!preview ? (
        <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-700 rounded-xl hover:border-green-500/50 active:border-green-500 cursor-pointer transition-colors min-h-[120px]">
          <Camera className="w-10 h-10 text-gray-500" />
          <span className="text-sm text-gray-400 font-medium">Tryk for at tilføje foto</span>
          <span className="text-xs text-gray-600">JPG, PNG — maks 10 MB</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full rounded-xl max-h-64 object-cover" />
            <button
              onClick={reset}
              className="absolute top-2 right-2 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Fjern foto"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Billedtekst (valgfri)"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-base min-h-[48px]"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl transition-colors min-h-[48px]"
          >
            <Upload className="w-5 h-5" />
            {uploading ? 'Uploader...' : 'Upload foto'}
          </button>
        </div>
      )}
    </div>
  )
}
