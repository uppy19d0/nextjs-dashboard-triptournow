import { apiService } from '../apis'
import { Posts } from '@/models/posts/posts';

export const getPosts = async (): Promise<Posts[]> => {
  const response = await apiService.get<{ status: string; data: Posts[] }>('/admin/posts')
  return response.data;
}


export const changeVerificationStatus = async (
  id: number,
  status: string
): Promise<string> => {
  const response = await apiService.post<{ status: string; data: string }>(
    "/post/change_status",
    {
      id,
      status,
    }
  );
  return response.data;
};