export interface User {
    id: number
    firstName: string
    lastName: string
    birthday: string
    dni: string
    country: string
    phone: string
    email: string
    is_2FA_activated: boolean
    email_verified: boolean
    type: string
    entropy_created: boolean
    address: string
    percentaje?: number | null
    verification_status: string
    verified_at?: string | null
    id_back?: string
    id_front?: string
    selfie?: string
    created_at: string
  }
  