import { confirmDialog } from "primereact/confirmdialog"
import { io } from "socket.io-client"
import { store } from "../redux/store"
import { removeClassInList, updateClassInList } from "../redux/reducers/classSlice.reducer"
import { Role, RoomRole, type RoleType, type RoomRoleType } from "../config/role"

const socket = io(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL}/class`)

export const classSocketEventName = {
    OnSuspendMemberFromClass: "suspend-user-from-class",
    OnLeaveTheClass: "leave-class",
    OnDissolveClass: "dissolve-class"
}

export class ClassGateway {
    static connect() {
        if (!socket.connected) {
            socket.connect()
        }
    }

    // Suspend a member from class
    static OnSuspendMemberFromClass() {
        socket.on(classSocketEventName.OnSuspendMemberFromClass, (data: { memberId: string, classId: string, result: boolean }) => {
            const { classId, memberId, result } = data;
            const state = store.getState();
            const clientId = state.auth.user.info.id;
            const currentClassId = state.class.currentClass.info.id;

            if (clientId !== memberId || typeof result !== "boolean") return;

            const isClassInList = state.class.classList.find(c => c.id === classId);

            if (isClassInList) {
                store.dispatch(updateClassInList({
                    ...isClassInList,
                    user: {
                        ...isClassInList.user,
                        is_banned: result
                    }
                }));
            }

            if (currentClassId === classId) {
                confirmDialog({
                    header: "Thông báo lớp học",
                    message: "Bạn tạm thời không thể truy cập lớp học",
                    acceptLabel: "Về danh sách lớp học",
                    rejectLabel: "Về trang chủ",
                    accept: () => {
                        window.location.pathname = "/main"
                    },
                    reject: () => {
                        window.location.pathname = "/"
                    }
                })
            }
        })
    }

    // A member leaves the class
    static OnLeaveTheClass() {
        socket.on(classSocketEventName.OnLeaveTheClass, (data: { userId: string, classId: string, role: RoomRoleType, removeByRole: RoleType, roomadmin_approved: boolean, newOwnerId?: string }) => {
            const { classId, role, userId, removeByRole, newOwnerId, roomadmin_approved } = data
            const client = store.getState().auth.user.info
            const currentClass = store.getState().class.currentClass.info
            if (!classId || !role || !userId || !removeByRole || typeof roomadmin_approved !== "boolean") return

            // The client is removed and they are pending member => Remove class from class list
            if ((!roomadmin_approved && client.id === userId) || (client.id === userId && !currentClass.id)) {
                store.dispatch(removeClassInList({ classId }))
                return
            }

            if (newOwnerId && newOwnerId === client.id && currentClass.id === classId) {
                window.location.reload()
                return
            }

            // If the client is not in the class and the removed user is not client, break 
            if (currentClass.id !== classId || client.id != userId) return

            // The client already removed by uniadmin => Implement a confirmDialog
            if (removeByRole === Role.UNIADMIN) {
                confirmDialog({
                    header: "Thông báo hệ thống",
                    message: `Quản trị viên hệ thống đã xóa bạn khỏi lớp học`,
                    acceptLabel: "Về danh sách lớp học",
                    rejectLabel: "Về trang chủ",
                    accept: () => {
                        window.location.pathname = "/main"
                    },
                    reject: () => {
                        window.location.pathname = "/"
                    }
                })

                return
            }

            // The client removed themselves with roles: roomadmin, student, lecturer
            if (role === removeByRole) {
                window.location.pathname = "/main"
                return
            }

            // The client was removed by roomadmin
            if (removeByRole === RoomRole.ROOMADMIN) {
                confirmDialog({
                    header: "Thông báo lớp học",
                    message: `Quản trị viên lớp học đã xóa bạn khỏi lớp`,
                    acceptLabel: "Về danh sách lớp học",
                    rejectLabel: "Về trang chủ",
                    accept: () => {
                        window.location.pathname = "/main"
                    },
                    reject: () => {
                        window.location.pathname = "/"
                    }
                })

                return
            }

        })
    }

    static OnDissolveClass() {
        socket.on(classSocketEventName.OnDissolveClass, (data: { classId: string, removeByRole: RoleType | RoomRoleType }) => {
            const { classId, removeByRole } = data

            if (!classId || !removeByRole) return

            const currenClass = store.getState().class.currentClass
            if (currenClass.info.id != classId) {
                store.dispatch(removeClassInList({ classId }))
                return
            }

            const userData = store.getState().auth.user.info
            if (currenClass.info.user.role !== removeByRole && userData.role !== Role.UNIADMIN) {
                confirmDialog({
                    header: "Thông báo lớp học",
                    message: `${removeByRole === Role.UNIADMIN ? "Quản trị viên hệ thống" : "Quản trị viên lớp học"} đã giải tán lớp học`,
                    acceptLabel: "Về danh sách lớp học",
                    rejectLabel: "Về trang chủ",
                    accept: () => {
                        window.location.pathname = "/main"
                    },
                    reject: () => {
                        window.location.pathname = "/"
                    }
                })
            }

        })
    }


    static disconnect() {
        if (socket.connected) {
            socket.disconnect()
        }
    }

    // Main connect

    static off(event: string) {
        socket.off(event)
    }
}