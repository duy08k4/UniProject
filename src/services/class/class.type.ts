export type ClassType = {
    id: string,
    join_code: string,
    label: string,
    description: string | null,
    subject: string,
    created_approval: boolean,
    required_approval: boolean,
    required_join_form: boolean,
    is_deleted: boolean,
    is_banned: boolean,
    created_at: string,
    updated_at: string,
    roleClass: string | null,
}

export type CreateNewClass = ClassType & {
    createdBy: {
        id: string;
        full_name: string;
        email: string;
        role: string;
    };
    counts: {
        student: string;
        lecturer: string;
        committee: string;
        pending: string;
    };
    owner: {
        full_name: string;
        email: string;
    } | null;
}

export type Pagination = {
    page: string | number,
    size: string | number,
    total_classes: string | number,
    totalPage: string | number
}

export type ClassPagination = {
    data: CreateNewClass[] | null,
    pagination: Pagination
}

export type Members = {
    id: string,
    role: string,
    roomadmin_approved: boolean,
    is_committee_member: boolean,
    can_create_notifications: boolean,
    can_create_forms: boolean,
    can_create_score_forms: boolean,
    joined_at: string,
    updated_at: string,
    user: {
        id: string,
        full_name: string,
        email: string
    }
}