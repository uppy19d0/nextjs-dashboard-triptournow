'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Pencil } from 'lucide-react'
import { Reservations } from '@/models/reservations/reservations'


type Props = {
  reservations: Reservations[]
}

const RESERVATIONS_PER_PAGE = 10

export default function ReservationsTable({ reservations }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReservation, setSelectedReservation] = useState<Reservations | null>(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()


  const totalPages = Math.ceil(reservations.length / RESERVATIONS_PER_PAGE)

  const currentReservations = reservations.slice(
    (currentPage - 1) * RESERVATIONS_PER_PAGE,
    currentPage * RESERVATIONS_PER_PAGE
  )

  const handleView = (reservation: Reservations) => {
    setSelectedReservation(reservation)
    setShowModal(true)
  }

  const handleEdit = (id: number) => {
    router.push(`/reservations/${id}/edit`)
  }

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Lista de Reservaciones</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Oferta</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Cliente</th>
              {/* <th className="px-4 py-3 text-left text-sm font-semibold">Correo Electronico</th> */}
              <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Fecha de Creación</th>
              {/* <th className="px-4 py-3 text-left text-sm font-semibold">Estado del usuario</th> */}
              <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
              {/* <th className="px-4 py-3 text-left text-sm font-semibold">{lang.users.attribute.firstName}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">{lang.users.attribute.lastName}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">{lang.users.attribute.email}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">{lang.users.attribute.phone}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">{lang.users.attribute.date}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">{lang.users.attribute.verification_status}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">{lang.actions.label}</th> */}
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {currentReservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-800 transition">
                <td className="px-4 py-3 text-sm">
                  {reservation.post.title}
                </td>
                <td className="px-4 py-3 text-sm">
                  {reservation.user.firstName} {reservation.user.lastName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{reservation.status}</td>

                {/* <td className="px-4 py-3 text-sm text-gray-300">{user.email}</td> */}
                {/* <td className="px-4 py-3 text-sm text-gray-300">{user.phone}</td> */}
                <td className="px-4 py-3 text-sm text-gray-400">
                  {new Date(reservation.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(reservation)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-150"
                      title="Ver usuario"
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                    <button
                      onClick={() => handleEdit(reservation.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-all duration-150"
                      title="Editar usuario"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-300">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
        >
          Anterior
        </button>
        <span>
          Página <strong>{currentPage}</strong> de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">Detalle del Reservaciones</h3>
            <div className="space-y-2 text-sm">
              {/* <p><strong>Nombre:</strong> {selectedReservation.firstName} {selectedUser.lastName}</p>
              <p><strong>Email:</strong> {selectedReservation.email}</p>
              <p><strong>Teléfono:</strong> {selectedReservation.phone}</p>
              <p><strong>Fecha de Registro:</strong> {new Date(selectedReservation.created_at).toLocaleString()}</p> */}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
