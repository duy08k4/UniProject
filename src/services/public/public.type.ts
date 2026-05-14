export interface ThesisItem {
    id: string
    file_url: string
    file_name: string | null
    submitted_at: string
    title: string | null
    thesis_type: 'thesis' | 'capstone' | null
    outline_file_url: string | null
    student_name: string | null
    supervisor_name: string | null
}

export interface ThesisPagination {
    data: ThesisItem[]
    pagination: {
        page: number
        size: number
        total: number
        totalPage: number
    }
}
