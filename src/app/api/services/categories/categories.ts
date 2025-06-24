import { apiService } from '../apis'
import { Category } from '@/models/categories/categories'
import { CategoryResponse } from '@/models/categories/categories'
import { CategorysResponse } from '@/models/categories/categories'


export async function getCategories(): Promise<CategorysResponse> {
  const response = await apiService.get<CategorysResponse>('/categories/show/all')
  console.debug('[getCategories] raw response:', response)
  return response
}

export async function getCategoryById(id: number): Promise<CategoryResponse> {
  const response = await apiService.get<CategoryResponse>(`/categories/${id}`)
  console.debug(`[getCategoryById ${id}] raw response:`, response)
  return response
}

export async function createCategory(data: FormData) {
  const res = await fetch('https://triptournow.com/api/V1/categories', {
    method: 'POST',
    body: data,
    credentials: 'include', // incluir cookies de sesión
  });
  if (res.status === 302) {
    throw new Error('Redirigido: verifica tu autenticación o la URL de la API');
  }
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error al crear categoría');
  }
  return res.json();
}


export async function updateCategory(
  id: number,
  form: FormData
): Promise<CategoryResponse> {
  console.log('updateCategory', id, JSON.stringify(form))
  const response = await apiService.post<CategoryResponse>(
    `/categories/${id}`,
    form
  )
  console.debug(`[updateCategory ${id}] raw response:`, response)
  return response
}


export async function deleteCategory(id: number): Promise<void> {
  const response = await apiService.delete<void>(`/categories/${id}`)
  console.debug(`[deleteCategory ${id}] raw response:`, response)
  return response
}
