import type { Field_TypeType, UnitType } from "../../config/enum"

export type FormInfoType = {
    classId: string
    milestoneId?: string // Đây là tùy chọn
    notificationId?: string // Đây là tùy chọn
    formId?: string // Khi tạo mới thì sẽ không có trường này. Khi update thì bắt buộc phải có.
    label: string
    description?: string
    field_count: string
    is_auto_open: boolean
    is_auto_close: boolean
    open_at: null
    close_at: null
    update_at?: string, // Khi tạo mới hoặc update form thì field này không tồn tại
    created_at?: string, // Khi tạo mới hoặc update form thì field này không tồn tại
}

export type FieldType = {
    fieldId?: string // Trường này chỉ tồn tại khi update
    index: string
    label: string
    title: string
    description: string
    input_type: Field_TypeType
    is_deleted: boolean,
    is_required: boolean
    unit: UnitType
    max_attempts: string
    min_attempts: string
    update_at?: string, // Khi tạo mới hoặc update form thì field này không tồn tại
    created_at?: string, // Khi tạo mới hoặc update form thì field này không tồn tại
}

export type UpdateFormsType = FormInfoType & {
    fields: FieldType[]
    checkboxFields: [
        {
            checkboxFieldId?: string // Trường này chỉ tồn tại khi update
            index: string
            label: string
            description: string
            input_type: Field_TypeType
            choice_count: string
            is_deleted: boolean
            is_required: boolean
            is_multiple: boolean
            update_at?: string, // Khi tạo mới hoặc update form thì field này không tồn tại
            created_at?: string, // Khi tạo mới hoặc update form thì field này không tồn tại
            checkbox_field_choices: {
                choiceId?: string // Trường này chỉ tồn tại khi update
                index: string
                body: string
            }[]
        }
    ]
}

// Pagination
export type FormDataForPagination = {
    id: string,
    is_join_form: boolean,
    label: string,
    description: string,
    field_count: number,
    is_auto_open: boolean,
    is_auto_close: boolean,
    is_deleted: boolean,
    is_stopped: boolean,
    open_at: string | null,
    close_at: string | null,
    update_at: string,
    created_at: string,
    createdBy: {
        id: string,
        full_name: string,
        email: string
    },
    class: {
        id: string,
        label: string
    }
}

export type FormPaginationType = {
    data: FormDataForPagination[],
    pagination: {
        total: number,
        page: number,
        size: number,
        totalPages: number
    }
}

// Form detail
export type DetailForm = {
    id: string,
    is_join_form: boolean,
    label: string,
    description?: string,
    field_count: number,
    is_auto_open: boolean,
    is_auto_close: boolean,
    is_deleted: boolean,
    is_stopped: boolean,
    open_at: null | string,
    close_at: null | string,
    update_at: string,
    created_at: string,
    milestone: null | {
        id: string,
        label: string
    },
    notification: null | {
        id: string
    },
    createdBy: {
        id: string,
        full_name: string,
        email: string
    },
    class: {
        id: string,
        join_code: string,
        label: string,
        description?: string,
        subject: string
    },
    fields: [
        {
            id: string
            index: string
            label: string
            title: string
            description: string
            input_type: Field_TypeType
            is_deleted: boolean,
            is_required: boolean
            unit: UnitType
            max_attempts: string
            min_attempts: string
            update_at: string,
            created_at: string
        }
    ],
    checkboxFields: [
        {
            id?: string
            index: string
            label: string
            description: string
            input_type: Field_TypeType
            choice_count: string
            is_deleted: boolean
            is_required: boolean
            is_multiple: boolean
            update_at: string,
            created_at: string,
            checkbox_field_choices: {
                id: string
                index: string
                body: string
            }[]
        }
    ]
}