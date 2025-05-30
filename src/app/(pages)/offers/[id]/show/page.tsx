'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPostById } from '@/app/api/services/posts/posts'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const API_BASE = 'https://triptournow.com/public/images/'

export default function ViewOfferPage() {
  const { id } = useParams()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const formatDate = (datetimeString: string) => datetimeString?.split(' ')[0] ?? ''

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts: any = await getPostById(id as string)
        setPost(posts[0])
      } catch (error) {
        console.error('Error al obtener la oferta:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPost()
  }, [id])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-white fs-4">
        Cargando...
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mt-5">
        <h3 className="text-center text-danger">❌ Oferta no encontrada</h3>
      </div>
    )
  }

  return (
    <div className="container py-5 text-white">
      <div className="mx-auto" style={{ maxWidth: '860px' }}>
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="btn btn-outline-light rounded-pill px-4"
          >
            ← Volver
          </button>
        </div>

        <h2 className="mb-4 fw-bold text-center text-info">
          📄 Detalles de la Oferta
        </h2>

        {post.urlPost && (
          <div className="text-center mb-4">
            <img
              src={`${API_BASE}${post.urlPost}`}
              alt="Imagen principal"
              className="img-fluid rounded-3 border border-secondary-subtle"
              style={{ maxHeight: '360px', objectFit: 'cover' }}
            />
          </div>
        )}

        <div className="row gy-4">
          {[
            { label: 'Título', value: post.title },
            { label: 'Subtítulo', value: post.subTitle },
            { label: 'Descripción', value: post.description },
            { label: 'Precio', value: `$${post.price}` },
            { label: 'Fecha de expiración', value: formatDate(post.expire_date) },
            { label: 'Cantidad establecida', value: post.established_quantity },
            { label: 'Tiempo de cancelación', value: post.cancellation_time },
            { label: 'Estado', value: post.status },
            { label: 'Correo del vendedor', value: post.user?.email ?? 'N/A' },
          ].map((item, index) => (
            <div key={index} className="col-md-6">
              <div className="p-3 rounded bg-dark border border-secondary-subtle h-100">
                <div className="text-secondary small fw-semibold mb-1">{item.label}</div>
                <div className="text-light">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {post.images && JSON.parse(post.images).length > 0 && (
          <div className="mt-5">
            <h5 className="fw-semibold mb-3 text-info">🖼 Galería de Imágenes</h5>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={15}
              slidesPerView={1}
              className="rounded-3 border border-secondary-subtle"
            >
              {JSON.parse(post.images).map((img: string, idx: number) => (
                <SwiperSlide key={idx}>
                  <img
                    src={`${API_BASE}${img}`}
                    alt={`Imagen ${idx + 1}`}
                    className="img-fluid rounded"
                    style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  )
}
