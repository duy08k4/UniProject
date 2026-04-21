import type { ScoreForm_TypeType } from "../../config/enum"

export type ScoreFormColumn = {
    id?: string
    label: string
    formula_content?: string
    index?: string
}

export type UpdateScoreFormType = {
    classId: string
    id?: string
    score_form_type: ScoreForm_TypeType
    label: string
    description?: string
    field_count: string
    is_auto_open: boolean
    is_auto_close: boolean
    is_deleted: boolean
    is_stopped: boolean
    open_at?: Date | null
    close_at?: Date | null
    columns: ScoreFormColumn[]
}

export type ScoreFormDataForPagination = {
    id: string
    score_form_type: ScoreForm_TypeType
    label: string
    description: string | null
    field_count: number
    is_auto_open: boolean
    is_auto_close: boolean
    is_deleted: boolean
    is_stopped: boolean
    open_at: string | null
    close_at: string | null
    created_at: string
    update_at: string
    createdBy: {
        id: string
        full_name: string
        email: string
    }
    class: {
        id: string
        label: string
    }
}

export type ScoreFormPaginationType = {
    data: ScoreFormDataForPagination[]
    pagination: {
        total: number
        page: number
        size: number
        totalPages: number
    }
}

export type DetailScoreForm = {
    id: string
    score_form_type: ScoreForm_TypeType
    label: string
    description: string | null
    field_count: number
    is_auto_open: boolean
    is_auto_close: boolean
    is_deleted: boolean
    is_stopped: boolean
    open_at: string | null
    close_at: string | null
    created_at: string
    update_at: string
    createdBy: {
        id: string
        full_name: string
        email: string
    }
    class: {
        id: string
        join_code: string
        label: string
    }
    milestone: {
        id: string
        label: string
    } | null
    columns: {
        id: string
        label: string
        formula_content: string | null
        index: number
    }[]
}
