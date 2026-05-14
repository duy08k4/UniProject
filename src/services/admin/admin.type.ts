export interface AdminUser {
    id: string
    supabase_id: string
    full_name: string
    email: string
    role: string
    is_banned: boolean
    is_deleted: boolean
    phone_number: string | null
    created_at: string
    updated_at: string
    email_confirm?: string | null
}

export interface AdminUserPagination {
    data: AdminUser[]
    pagination: {
        page: number
        size: number
        total_users: number
        totalPage: number
    }
}
