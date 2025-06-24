'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Pencil, Plus } from 'lucide-react'
import { CategoriesTableProps } from '@/models/categories/categories'

const ITEMS_PER_PAGE = 10

export default function CategoriesTable({ categories = [] }: CategoriesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const filtered = categories.filter(({ title, title_es }) => {
    const term = searchTerm.toLowerCase()
    return (
      title.toLowerCase().includes(term) ||
      title_es?.toLowerCase().includes(term) ||
      term === ''
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('es-DO', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(new Date(dateString))

  return (
    <section className="p-6 bg-gray-900 rounded-xl shadow-lg text-white">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Categorías</h2>
        <div className="flex space-x-2 w-1/3">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 bg-gray-800 text-white rounded-md border border-gray-600"
            aria-label="Buscar categorías"
          />
          <button
            type="button"
            onClick={() => router.push('/categories/create')}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md transition"
          >
            <Plus size={16} className="mr-2" />
            Crear categoría
          </button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-left divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold">Título (ES)</th>
              <th className="px-4 py-3 text-sm font-semibold">Creación</th>
              <th className="px-4 py-3 text-sm font-semibold">Imagen</th>
              <th className="px-4 py-3 text-sm font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentItems.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 text-sm truncate">
                  {cat.title_es ?? cat.title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {formatDate(cat.created_at)}
                </td>
                <td className="px-4 py-3">
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={`Imagen de ${cat.title_es ?? cat.title}`}
                      className="w-10 h-10 object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-gray-500">Sin imagen</span>
                  )}
                </td>
                <td className="px-4 py-3 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/categories/${cat.id}/show`)}
                    aria-label="Ver categoría"
                    className="btn btn-info px-2 py-1 rounded flex items-center"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/categories/${cat.id}/edit`)}
                    aria-label="Editar categoría"
                    className="btn btn-warning px-2 py-1 rounded flex items-center"
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No hay categorías para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center text-sm text-gray-300">
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </section>
  )
}
