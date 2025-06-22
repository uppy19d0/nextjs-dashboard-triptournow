'use client' 

import { getCategoryById } from '@/app/api/services/categories/categories'
import ViewCategoryClient from './ViewCategoryClient'

interface PageProps {
  params: {
    id: string
  }
}

export default async function Page({ params: { id } }: PageProps) {
  const category = await getCategoryById(Number(id))
  return <ViewCategoryClient initialCategory={category} />
}
