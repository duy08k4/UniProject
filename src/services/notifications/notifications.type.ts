export type NotificationDetail = {
    id: string
    title: string
    body: string  // JSON string của Tiptap
    created_at: string
    updated_at: string
    createdBy: { id: string; full_name: string; email: string }
    class: { id: string; label: string }
    milestone: { id: string; label: string } | null
    forms: { id: string; label: string; is_stopped: boolean }[]
}

export type NotificationPagination = {
    data: NotificationDetail[]
    pagination: { total: number; page: number; size: number; totalPages: number }
}
