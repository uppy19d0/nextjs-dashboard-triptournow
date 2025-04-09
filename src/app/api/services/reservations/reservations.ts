import { apiService } from '../apis'
import { Reservations } from '@/models/reservations/reservations'

export const getReservationById = async (id: number): Promise<any> => {
  const response = await apiService.get<{ status: string; data: Reservations }>(`/reservations/${id}`);
  console.log(`${JSON.stringify(response.data)}`,null, 2);
  return response.data
}

export const updateReservation = async (id: number, data: Partial<Reservations>): Promise<Reservations> => {
  const response = await apiService.put<{ status: string; data: Reservations }>(`/reservations/${id}`, data)
  return response.data
}
