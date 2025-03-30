'use client';

import { useEffect, useState } from 'react'
import { getUsers } from '@/app/api/users/users'
import { User } from '@/models/users/users'
import UsersTable from './UsersTable'
// import { getDictionary } from '@/locales/dictionary'

export default function Page() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const fetchUsers = async () => {
      try {
        const response = await getUsers()
        setUsers(response)
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
      <h1 className="text-2xl text-white font-bold mb-4">Usuarios</h1>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  )
}
