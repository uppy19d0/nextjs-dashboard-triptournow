import { apiService } from '../apis'
import { Category } from '@/models/categories/categories'
import { CategoryResponse } from '@/models/categories/categories'
import { CategorysResponse } from '@/models/categories/categories'


export async function getCategories(): Promise<CategorysResponse> {
  const response = await apiService.get<CategorysResponse>('/categories')
  console.debug('[getCategories] raw response:', response)
  return response
}

export async function getCategoryById(id: number): Promise<CategoryResponse> {
  const response = await apiService.get<CategoryResponse>(`/categories/${id}`)
  console.debug(`[getCategoryById ${id}] raw response:`, response)
  return response
}

export async function createCategory(
  payload: Partial<Category>
): Promise<CategoryResponse> {
  const response = await apiService.post<CategoryResponse>('/categories', payload)
  console.debug('[createCategory] raw response:', response)
  return response
}

export async function updateCategory(
  id: number,
  payload: Partial<Category>
): Promise<CategoryResponse> {
  const response = await apiService.put<CategoryResponse>(
    `/categories/${id}`,
    payload
  )
  console.debug(`[updateCategory ${id}] raw response:`, response)
  return response
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await apiService.delete<void>(`/categories/${id}`)
  console.debug(`[deleteCategory ${id}] raw response:`, response)
  return response
}
