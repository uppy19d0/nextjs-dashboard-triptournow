type ReservationUser = {
    id: number
    firstName: string
    lastName: string
    birthday: string
    email: string
    dni: string
    country: string
    phone: string
    email_verified_at: string | null
    percentaje: number | null
    account_verified_at: string | null
    address: string | null
    is_exchange_house: number
    type: 'user' | 'admin' | 'seller' | string
    verification_status: 'verified' | 'unverified' | string
    id_back: string | null
    id_front: string | null
    selfie: string | null
    created_at: string
    updated_at: string
    stripe_id: string | null
    pm_type: string | null
    pm_last_four: string | null
    trial_ends_at: string | null
    twofa_secret: string | null
    entropy: string
  }
  
  type ReservationPost = {
    id: number
    title: string
    subTitle: string
    description: string
    phone: string | null
    bought: number
    address: string | null
    expire_date: string
    disabled_days: string[] | null
    price: number
    established_quantity: number
    cancellation_time: number
    additional_price_per_person: string | null
    status: 'draft' | 'active' | 'inactive' | string
    user_id: number
    category_id: number
    image: string
    images: string | null
    percentaje: number
    deleted_at: string | null
    aproved_at: string | null
    created_at: string
    updated_at: string
    user: ReservationUser
  }
  
  export type Reservations = {
    id: number
    start_date: string
    end_date: string
    people_count: number
    additional_people_count: number
    babies_count: number
    pets_count: number
    user_id: number
    post_id: number
    status: 'pending' | 'approved' | 'completed' | 'canceled' | string
    created_at: string
    updated_at: string
    deleted_at: string | null
    post: ReservationPost
    user: ReservationUser
  }
  