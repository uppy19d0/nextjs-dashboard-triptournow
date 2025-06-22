export type Category = {
    id: number
    title: string
    description: string
    title_en: string
    title_es: string
    description_en: string | null
    description_es: string | null
    image: string | null
    image_url: string | null
    created_at: string
    updated_at: string
  }
  
export interface CategoryResponse {
  status: string
  data: Category[]
}

export interface CategorysResponse {
  status: string
  data: Category
}

export interface CategoriesTableProps {
  categories: Category[]
}
