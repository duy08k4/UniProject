export const Role = {
  USER: "user",
  UNIADMIN: "uniadmin",
  ROOMADMIN: "roomadmin",
  STUDENT: "student",
  LECTURER: "lecturer",
} as const

export type RoleType = typeof Role[keyof typeof Role];

export const VNRoleName = {
  user: "Người dùng",
  uniadmin: "Quản trị viên hệ thống",
  roomadmin: "Quản trị viên lớp học",
  student: "Sinh viên",
  lecturer: "Giảng viên"
}

export const MainRole = {
  USER: "user",
  UNIADMIN: "uniadmin",
} as const

export type MainRoleType = typeof MainRole[keyof typeof MainRole];

export const RoomRole = {
  ROOMADMIN: "roomadmin",
  STUDENT: "student",
  LECTURER: "lecturer",
} as const

export type RoomRoleType = typeof RoomRole[keyof typeof RoomRole];

export const Field_Type = {
  STRING: "string",
  NUMBER: "number",
  FILE: "file",
  CHECKBOX: "checkbox",
}

export type Field_TypeType = typeof Field_Type[keyof typeof Field_Type]

export const Unit = {
  FILE:"file",
  UNIT: "unit",
  CHARACTER: "character"
}

export type UnitType = typeof Unit[keyof typeof Unit]

export const ScoreForm_Type = {
  OTHERS: "others",
  THESIS: "thesis",
  INTERNSHIP: "internship",
} as const

export type ScoreForm_TypeType = typeof ScoreForm_Type[keyof typeof ScoreForm_Type]

export const ThesisType = {
  THESIS: "thesis",
  CAPSTONE: "capstone",
} as const

export type ThesisTypeType = typeof ThesisType[keyof typeof ThesisType]

export const VNThesisType: Record<string, string> = {
  thesis: "Khóa luận tốt nghiệp (KLTN)",
  capstone: "Tiểu luận tốt nghiệp (TLTN)",
}

export const TopicStatus = {
  DRAFT: "draft",
  INVITED: "invited",
  SUPERVISOR_REJECTED: "supervisor_rejected",
  SUPERVISOR_ACCEPTED: "supervisor_accepted",
  OUTLINE_PENDING: "outline_pending",
  OUTLINE_REJECTED: "outline_rejected",
  APPROVED: "approved",
} as const

export type TopicStatusType = typeof TopicStatus[keyof typeof TopicStatus]

export const VNTopicStatus: Record<string, { label: string, color: string }> = {
  draft:               { label: "Bản nháp",              color: "text-gray" },
  invited:             { label: "Chờ GVHD phản hồi",     color: "text-yellow-500" },
  supervisor_rejected: { label: "GVHD từ chối",           color: "text-red" },
  supervisor_accepted: { label: "GVHD đồng ý",            color: "text-blue-500" },
  outline_pending:     { label: "Chờ duyệt đề cương",     color: "text-yellow-500" },
  outline_rejected:    { label: "Đề cương bị từ chối",    color: "text-red" },
  approved:            { label: "Đã duyệt",               color: "text-mainColor" },
}