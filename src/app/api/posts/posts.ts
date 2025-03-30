import { apiService } from '../authService/apis'
import { Posts } from '@/models/posts/posts';

export const getPosts = async (): Promise<Posts[]> => {
  const response = await apiService.get<{ status: string; data: Posts[] }>('/admin/posts')
  return response.data;
}
