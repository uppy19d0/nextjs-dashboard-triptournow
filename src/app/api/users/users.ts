import { User } from '@/models/users/users'
import { apiService } from '../authService/apis'

export const getUsers = async (): Promise<User[]> => {
  const response = await apiService.get<{ status: string; data: User[] }>('/admin/users')
  return response.data;
}
