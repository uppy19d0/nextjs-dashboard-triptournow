'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from 'js-cookie'
import { getReservationById, updateReservation } from '@/app/api/services/reservations/reservations'
import { Reservations } from '@/models/reservations/reservations'

const schema = z.object({
  id: z.number(),
  start_date: z.string().min(1, 'Fecha de inicio requerida'),
  end_date: z.string().min(1, 'Fecha de fin requerida'),
  people_count: z.coerce.number().min(1, 'Cantidad de personas requerida'),
  additional_people_count: z.coerce.number().min(0),
  babies_count: z.coerce.number().min(0),
  pets_count: z.coerce.number().min(0),
  user_id: z.coerce.number().min(1, 'Usuario requerido'),
  post_id: z.coerce.number().min(1, 'Oferta requerida'),
  status: z.string().min(1, 'Estado requerido')
})

type FormValues = z.infer<typeof schema>

export default function EditReservationPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState<Reservations | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    const theme = Cookies.get('theme') || 'light'
    document.documentElement.setAttribute('data-bs-theme', theme)
  }, [])

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await getReservationById(Number(id))
        const r = response.reservation

        setReservation(r)
        setValue('id', r.id)
        setValue('start_date', r.start_date)
        setValue('end_date', r.end_date)
        setValue('people_count', r.people_count)
        setValue('additional_people_count', r.additional_people_count)
        setValue('babies_count', r.babies_count)
        setValue('pets_count', r.pets_count)
        setValue('user_id', r.user_id)
        setValue('post_id', r.post_id)
        setValue('status', r.status)
      } catch (error) {
        console.error('Error al obtener la reservación:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchReservation()
  }, [id, setValue])

  const onSubmit = async (data: FormValues) => {
    try {
      await updateReservation(data.id, data)
      alert('✅ Reservación actualizada correctamente')
      // router.push('/reservations')
    } catch (error) {
      alert('❌ Error al actualizar la reservación')
      console.error(error)
    }
  }

  if (loading || !reservation) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        Cargando...
      </div>
    )
  }

  const values = watch()

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 rounded shadow-lg"
        style={{ backgroundColor: 'var(--bs-body-bg)', color: 'var(--bs-body-color)' }}
      >
        <h2 className="text-center mb-4">Editar Reservación</h2>

        <input type="hidden" {...register('id')} />

        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <div className="form-control">
            <strong>Nombre:</strong> {reservation.user.firstName} {reservation.user.lastName} <br />
            <strong>Email:</strong> {reservation.user.email} <br />
            <strong>Teléfono:</strong> {reservation.user.phone}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Oferta</label>
          <div className="form-control">
            <strong>Título:</strong> {reservation.post.title} <br />
            <strong>Expira:</strong> {reservation.post.expire_date} <br />
            <strong>Creada:</strong> {reservation.post.created_at} <br />
            <strong>Estado:</strong> {reservation.post.status}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Fecha de Inicio</label>
            <input
              type="date"
              className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
              {...register('start_date')}
              defaultValue={values.start_date}
            />
            {errors.start_date && <div className="invalid-feedback">{errors.start_date.message}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Fecha de Fin</label>
            <input
              type="date"
              className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
              {...register('end_date')}
              defaultValue={values.end_date}
            />
            {errors.end_date && <div className="invalid-feedback">{errors.end_date.message}</div>}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">Personas</label>
            <input
              type="number"
              className={`form-control ${errors.people_count ? 'is-invalid' : ''}`}
              {...register('people_count')}
              defaultValue={values.people_count}
            />
            {errors.people_count && <div className="invalid-feedback">{errors.people_count.message}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label">Adicionales</label>
            <input
              type="number"
              className={`form-control ${errors.additional_people_count ? 'is-invalid' : ''}`}
              {...register('additional_people_count')}
              defaultValue={values.additional_people_count}
            />
            {errors.additional_people_count && <div className="invalid-feedback">{errors.additional_people_count.message}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label">Bebés</label>
            <input
              type="number"
              className={`form-control ${errors.babies_count ? 'is-invalid' : ''}`}
              {...register('babies_count')}
              defaultValue={values.babies_count}
            />
            {errors.babies_count && <div className="invalid-feedback">{errors.babies_count.message}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label">Mascotas</label>
            <input
              type="number"
              className={`form-control ${errors.pets_count ? 'is-invalid' : ''}`}
              {...register('pets_count')}
              defaultValue={values.pets_count}
            />
            {errors.pets_count && <div className="invalid-feedback">{errors.pets_count.message}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select
            className={`form-control ${errors.status ? 'is-invalid' : ''}`}
            {...register('status')}
            defaultValue={values.status}
          >
            <option value="">Seleccionar</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobada</option>
            <option value="completed">Completada</option>
            <option value="canceled">Cancelada</option>
          </select>
          {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}
