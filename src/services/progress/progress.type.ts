import type { RoomRoleType, ScoreFormStatusType, ScoreForm_TypeType as ScoreFormTagType } from "../../config/enum"

export type MilestoneShortDetail = {
    id: string,
    index: number,
    label: string,
    description: string,
    is_deleted: boolean,
    is_stopped: boolean,
    is_registration_milestone: boolean,
    updated_at: string,
    created_at: string
}

export type ProgressDeatil = {
    id: string,
    label: string,
    description: string,
    is_submitted: boolean,
    is_deleted: boolean,
    is_banned: boolean,
    created_approval: boolean,
    created_at: string,
    updated_at: string,
    createdBy: {
        id: string,
        full_name: string,
        email: string
    },
    class: {
        id: string,
        join_code: string,
        label: string,
        subject: string
    },
    milestones: MilestoneShortDetail[]
}

export type ProgressDeatilPagination = {
    id: string,
    label: string,
    description: string,
    is_submitted: boolean,
    is_deleted: boolean,
    is_banned: boolean,
    created_approval: boolean,
    created_at: string,
    updated_at: string,
    createdBy: {
        id: string,
        full_name: string,
        email: string
    },
    class: {
        id: string,
        join_code: string,
        label: string,
        subject: string
    },
    milestones: number
}

export type ProgressPagination = {
    data: ProgressDeatilPagination[],
    pagination: {
        page: number,
        size: number,
        total_progress: number,
        total_page: number
    }
}

//  ---------------------------------------------------------------------------------------- MILESTONE --------------------------------------------------------------------------------------------
export type MilestoneDetail = {
    id: string,
    index: number,
    label: string,
    description: string,
    is_deleted: boolean,
    is_stopped: boolean,
    updated_at: string,
    created_at: string,
    forms: {
        id: string,
        is_join_form: boolean,
        label: string,
        description: string | null,
        field_count: number,
        is_auto_open: boolean,
        is_auto_close: boolean,
        email_notification_enabled: boolean,
        is_deleted: boolean,
        is_stopped: boolean,
        open_at: string | null,
        close_at: string | null,
        update_at: string,
        created_at: string
    }[],
    scoreForms: {
        id: string,
        score_form_type: ScoreFormTagType,
        status: ScoreFormStatusType,
        label: string,
        description: string | null,
        field_count: number,
        is_auto_open: boolean,
        is_auto_close: boolean,
        email_notification_enabled: boolean,
        is_deleted: boolean,
        is_stopped: boolean,
        open_at: string | null,
        close_at: string | null,
        created_at: string,
        update_at: string
    }[],
    notifications: {
        id: string,
        title: string,
        body: string,
        created_at: string,
        updated_at: string
        createdBy: {
            id: string,
            full_name: string,
            email: string,
            classMember: {
                id: string,
                role: RoomRoleType
            }[]
        }
    }[]
}

export type UpdateMilestone = {
    updated: MilestoneShortDetail[],
    added: MilestoneShortDetail[]
}

export type MilestonePagination = {
    data: MilestoneShortDetail[],
    pagination: {
        page: number,
        size: number,
        total_progress: number,
        total_page: number
    }
}