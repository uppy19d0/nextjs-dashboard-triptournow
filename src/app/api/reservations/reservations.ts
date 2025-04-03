import { Reservations } from '@/models/reservations/reservations';
import { apiService } from '../services/apis'

export const getReservations = async (): Promise<Reservations[]> => {
  const response = await apiService.get<{ status: string; data: Reservations[] }>('/reservations')
  console.log("!!!reservations!!!!");
  console.log(response.data)
  return response.data;
}
