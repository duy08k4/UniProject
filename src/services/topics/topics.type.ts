import type { ThesisTypeType, TopicStatusType } from "../../config/enum"

export type TopicDetail = {
    id: string
    title: string
    description: string | null
    thesis_type: ThesisTypeType
    status: TopicStatusType
    rejection_note: string | null
    outline_file_url: string | null
    created_at: string
    updated_at: string
    milestone: { id: string; label: string; is_registration_milestone: boolean }
    student: { id: string; full_name: string; email: string }
    supervisor: { id: string; full_name: string; email: string } | null
    reviewer: { id: string; full_name: string; email: string } | null
}
