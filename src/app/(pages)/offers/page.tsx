'use client';

import { changeVerificationStatus, getPosts } from '@/app/api/services/posts/posts';
import { Posts } from '@/models/posts/posts';
import { useEffect, useState } from 'react'
import PostTable from './PostTable';

export default function Page() {
  const [posts, setPosts] = useState<Posts[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    

    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await getPosts()
      console.log("🚀 ~ fetchPosts ~ response:", response)
    
      setPosts(response)
    } catch (error) {
      console.error('Error fetching Posts:', error)
    } finally {
      setLoading(false)
    }
  }

    const verifiedAndCancel = async (user: Posts) => {
      try {
        // Determinar el nuevo estado basado en el estado actual
        const newStatus = user.status === "active" ? "inactive" : "active";
    
        await changeVerificationStatus(user.id, newStatus);
    
        alert(`Estado de verificación actualizado a ${newStatus} con éxito`);
    
        fetchPosts(); // 🔄 Actualiza la lista después de la verificación
      } catch (error) {
        console.error("Error al cambiar el estado de verificación:", error);
        alert("Hubo un error al actualizar el estado");
      }
    };

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <h1 className="text-2xl text-white font-bold mb-4">Ofertas</h1>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <PostTable posts={posts} onVerify={verifiedAndCancel} />
      )}
    </div>
  )
}
