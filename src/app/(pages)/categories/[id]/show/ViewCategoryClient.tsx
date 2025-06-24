'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Category } from '@/models/categories/categories'
import { Pencil, Eye, AlertCircle } from 'lucide-react'

function InfoCard({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`p-4 bg-gray-800 rounded-lg ${className ?? ''}`}>
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-lg">{children}</div>
    </div>
  )
}

export default function ViewCategoryClient({ initialCategory }: { initialCategory: Category }) {
  const [category] = useState<Category>(initialCategory)
  const router = useRouter()

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('es-DO', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(new Date(date))

  if (!category) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h3 className="text-red-500 text-xl">❌ Categoría no encontrada</h3>
        <button
          onClick={() => router.push('/categories')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white"
        >
          Volver al listado
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-xl shadow-lg text-white">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full"
      >
        ← Volver
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center text-info">📂 Detalles de la Categoría</h2>

      {category.image_url && (
        <div className="mb-6 relative w-full h-64 rounded-lg overflow-hidden border border-gray-700">
          <Image
            src={category.image_url}
            alt={category.title_es ?? category.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard label="Título (ES)">{category.title_es ?? '—'}</InfoCard>
        <InfoCard label="Título (EN)">{category.title_en ?? '—'}</InfoCard>
        <InfoCard label="Descripción (ES)" className="md:col-span-2">
          {category.description_es ?? '—'}
        </InfoCard>
        <InfoCard label="Descripción (EN)" className="md:col-span-2">
          {category.description_en ?? '—'}
        </InfoCard>
        <InfoCard label="Creado">{formatDate(category.created_at)}</InfoCard>
        <InfoCard label="Actualizado">{formatDate(category.updated_at)}</InfoCard>
      </div>

      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={() => router.push(`/categories/${category.id}/edit`)}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded inline-flex items-center"
        >
          <Pencil size={16} className="mr-2" /> Editar
        </button>
        <button
          onClick={() => router.push('/categories')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded inline-flex items-center"
        >
          <Eye size={16} className="mr-2" /> Volver al listado
        </button>
      </div>
    </div>
  )
}
