'use client';

import { useEffect, useState } from 'react'
import ReservationsTable from './ReservationsTable';
import { Reservations } from '@/models/reservations/reservations';
import { getReservations } from '@/app/api/reservations/reservations';

export default function Page() {
  const [reservations, setReservation] = useState<Reservations[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const fetchUsers = async () => {
      try {
        const response = await getReservations()
        setReservation(response)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <h1 className="text-2xl text-white font-bold mb-4">Reservaciones</h1>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <ReservationsTable reservations={reservations} />
      )}
    </div>
  )
}
