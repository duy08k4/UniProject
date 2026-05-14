import type { CommitteeRoleType } from "../../config/enum"

export type CommitteeMember = {
    userId: string
    role: CommitteeRoleType
}

export type CommitteeMemberDetail = {
    id: string
    role: CommitteeRoleType
    user: {
        id: string
        full_name: string
        email: string
    }
}

export type Committee = {
    id: string
    created_at: string
    updated_at: string
    class: {
        id: string
        label: string
    }
    milestone: {
        id: string
        label: string
    }
    members: CommitteeMemberDetail[]
}

export type UpsertCommitteeRequest = {
    classId: string
    milestoneId: string
    members: CommitteeMember[]
}
