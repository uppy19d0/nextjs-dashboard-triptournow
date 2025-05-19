type User = {
    id: number
    firstName: string
    lastName: string
    email: string
    selfie: string | null
    phone: string
  }
  
  export type Posts = {
    id: number
    title: string
    subTitle: string
    description: string
    phone: string | null
    address: string | null
    created_at: string
    updated_at: string
    expire_date: string
    price: number
    bought: number
    urlPost: string
    images: string | null
    status: 'draft' | 'published' | string
    percentaje: number
    deleted_at: string | null
    category_id: number
    average_rating: number
    totalReviews: number
    additional_price_per_person: string
    established_quantity: number
    cancellation_time: number
    disabled_days: string[]
    user: User
  }
  