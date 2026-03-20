export type SignInResponse = {
    message: string,
    data: {
        id: string,
        supabase_id: string,
        full_name: string,
        email: string,
        is_banned:boolean,
        is_deleted:boolean,
        role: string,
        phone_number:string,
        created_at: string,
        updated_at: string
    }
}