'use client';

import { getPosts } from '@/app/api/posts/posts';
import { Posts } from '@/models/posts/posts';
import { useEffect, useState } from 'react'
import PostTable from './PostTable';

export default function Page() {
  const [posts, setPosts] = useState<Posts[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const fetchUsers = async () => {
      try {
        const response = await getPosts()

        debugger;
        setPosts(response)
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
      <h1 className="text-2xl text-white font-bold mb-4">Ofertas</h1>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <PostTable posts={posts} />
      )}
    </div>
  )
}
