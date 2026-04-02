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
    user: {
        role: string,
        is_banned: boolean,
        roomadmin_approved: boolean
    }
}

export type CreateNewClass = ClassType & {
    createdBy: {
        id: string;
        full_name: string;
        email: string;
        role: string;
    };
    counts: Record<"student" | "lecturer" | "committee" | "pending", string>;
    owner: {
        full_name: string;
        email: string;
    } | null;
}

export type Pagination = {
    page: string,
    size: string,
    total_classes: string,
    totalPage: string
}

export type ClassPagination = {
    data: CreateNewClass[] | null,
    pagination: Pagination
}

export type Members = {
    id: string,
    role: "roomadmin" | "student" | "lecturer",
    roomadmin_approved: boolean,
    is_banned: boolean,
    is_committee_member: boolean,
    can_create_notifications: boolean,
    can_create_forms: boolean,
    can_create_score_forms: boolean,
    joined_at: string,
    updated_at: string,
    created_at: string,
    user: {
        id: string,
        full_name: string,
        email: string
    }
}

export type MemberData = {
    lecturer: Members[],
    student: Members[],
    roomadmin: Members[],
    pending: Members[]
}

export type MembersPagination = {
    data: MemberData,
    pagination: {
        page: string,
        size: string,
        total_members: string,
        totalPage: string
    }
}