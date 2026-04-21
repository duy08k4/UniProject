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