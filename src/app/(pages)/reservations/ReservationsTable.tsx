'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Pencil, X } from 'lucide-react'
import Modal from 'react-modal'
import { Reservations } from '@/models/reservations/reservations'

type Props = {
  reservations: Reservations[],
}

const RESERVATIONS_PER_PAGE = 10

export default function ReservationsTable({ reservations }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReservation, setSelectedReservation] = useState<Reservations | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("")
  const router = useRouter()

  useEffect(() => {
    Modal.setAppElement(document.body)
  }, [])

  const openModal = (reservation: Reservations) => {
    setSelectedReservation(reservation)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedReservation(null)
    setIsModalOpen(false)
  }

  const filteredReservations = reservations.filter(reservation =>
    filterStatus === "" || reservation.status === filterStatus
  )

  const currentReservations = filteredReservations.slice(
    (currentPage - 1) * RESERVATIONS_PER_PAGE,
    currentPage * RESERVATIONS_PER_PAGE
  )



  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-lg text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista de Reservaciones</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded-md border border-gray-600"
        >
          <option value="">Todos</option>
          <option value="active">Activas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Oferta</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Cliente</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {currentReservations.map(reservation => (
              <tr key={reservation.id} className="hover:bg-gray-800 transition">
                <td className="px-4 py-3 text-sm">{reservation.post.title}</td>
                <td className="px-4 py-3 text-sm">{reservation.user.firstName} {reservation.user.lastName}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{reservation.status}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{new Date(reservation.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(reservation)}
                      className="btn btn-info m-1"
                    >
                      <Eye size={16} className="mr-2" /> Ver
                    </button>
                    <button
                      onClick={() => router.push(`/reservations/${reservation.id}/edit`)}
                      className="btn btn-warning m-1"
                    >
                      <Pencil size={16} className="mr-2" /> Editar
                    </button>
                   
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-300">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
        >
          Anterior
        </button>
        <span>Página {currentPage} de {Math.ceil(filteredReservations.length / RESERVATIONS_PER_PAGE)}</span>
        <button
          onClick={() =>
            setCurrentPage(prev =>
              Math.min(prev + 1, Math.ceil(filteredReservations.length / RESERVATIONS_PER_PAGE))
            )
          }
          disabled={currentPage === Math.ceil(filteredReservations.length / RESERVATIONS_PER_PAGE)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Detalle de Reservación"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedReservation && (
          <>
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4">Detalle de Reservación</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Oferta:</strong> {selectedReservation.post.title}</p>
              <p><strong>Cliente:</strong> {selectedReservation.user.firstName} {selectedReservation.user.lastName}</p>
              <p><strong>Correo:</strong> {selectedReservation.user.email}</p>
              <p><strong>Fecha:</strong> {new Date(selectedReservation.created_at).toLocaleString()}</p>
              <p><strong>Estado:</strong> {selectedReservation.status}</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {selectedReservation.status === 'active' ? (
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
                  Cancelar
                </button>
              ) : (
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm">
                  Verificar
                </button>
              )}
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
