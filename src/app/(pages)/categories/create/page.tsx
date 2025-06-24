'use client'

import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory } from '@/app/api/services/categories/categories'
import type { Category } from '@/models/categories/categories'

export default function CreateCategoryPage() {
  const router = useRouter()
  const [titleEn, setTitleEn] = useState('')
  const [titleEs, setTitleEs] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionEs, setDescriptionEs] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const MAX_SIZE_MB = 2

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0] ?? null
    if (!file) {
      setImageFile(null)
      setPreviewUrl(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes.')
      setImageFile(null)
      setPreviewUrl(null)
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`La imagen no puede superar ${MAX_SIZE_MB} MB.`)
      setImageFile(null)
      setPreviewUrl(null)
      return
    }
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleEn.trim()) {
      setError('El título en inglés es obligatorio.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const form = new FormData()
      form.append('title_en', titleEn)
      form.append('title_es', titleEs)
      form.append('description_en', descriptionEn)
      form.append('description_es', descriptionEs)
      if (imageFile) form.append('image', imageFile)

      const newCat: Category = await createCategory(form)
      router.push(`/categories/${newCat.id}/show`)
    } catch (err) {
      console.error(err)
      setError('Error al crear la categoría.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-xl shadow-lg text-white mt-8">
      <h1 className="text-2xl font-bold mb-6">Crear nueva categoría</h1>

      {error && <p className="mb-4 text-red-400">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title-en" className="block text-sm mb-1">
            Título (EN) *
          </label>
          <input
            id="title-en"
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-gray-600"
            required
          />
        </div>

        <div>
          <label htmlFor="title-es" className="block text-sm mb-1">
            Título (ES)
          </label>
          <input
            id="title-es"
            type="text"
            value={titleEs}
            onChange={(e) => setTitleEs(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="desc-en" className="block text-sm mb-1">
            Descripción (EN)
          </label>
          <textarea
            id="desc-en"
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-gray-600"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="desc-es" className="block text-sm mb-1">
            Descripción (ES)
          </label>
          <textarea
            id="desc-es"
            value={descriptionEs}
            onChange={(e) => setDescriptionEs(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-gray-600"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="image-upload" className="block text-sm mb-1">
            Imagen (max {MAX_SIZE_MB} MB)
          </label>
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-gray-200
               file:mr-2 file:py-2 file:px-4 file:rounded file:border-0
               file:text-sm file:font-semibold file:bg-blue-600 file:text-white
               hover:file:bg-blue-500"
          />
        </div>

        {previewUrl && (
          <div className="mt-4">
            <p className="text-gray-200 mb-1">Vista previa:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto rounded shadow-md"
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded text-white disabled:opacity-50"
          >
            {loading ? 'Creando…' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </div>
  )
}
