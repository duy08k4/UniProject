export type MilestoneShortDetail = {
    id: string,
    index: number,
    label: string,
    description: string,
    is_deleted: boolean,
    is_stopped: boolean,
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
export type UpdateMilestone = {
    updated: MilestoneShortDetail[],
    added: MilestoneShortDetail[]
}