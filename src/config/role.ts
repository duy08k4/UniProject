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