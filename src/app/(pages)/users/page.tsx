'use client';

import { useEffect, useState } from 'react'
import { getUsers } from '@/app/api/services/users/userssevices'
import { changeVerificationStatus } from '@/app/api/services/users/userssevices'
import { User } from '@/models/users/users'
import UsersTable from './UsersTable'

export default function Page() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const response = await getUsers()
      console.log("🚀 ~ fetchUsers ~ response:", response)
      setUsers(response)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ✅ Función para verificar usuario y actualizar lista
  const verifiedAndCancel = async (user: User) => {
    try {
      await changeVerificationStatus(user.id, "verified")
      alert('Estado de verificación actualizado con éxito')
      fetchUsers() // 🔄 Actualiza la lista después de la verificación
    } catch (error) {
      console.error('Error al cambiar el estado de verificación:', error)
      alert('Hubo un error al actualizar el estado')
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <h1 className="text-2xl text-white font-bold mb-4">Usuarios</h1>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <UsersTable users={users} onVerify={verifiedAndCancel} />
      )}
    </div>
  )
}
