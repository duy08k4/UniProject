import { confirmDialog } from "primereact/confirmdialog"
import { io } from "socket.io-client"
import { store } from "../redux/store"
import { currentClass_RemoveMember, currentClass_UpdateMember, removeClassInList, updateClassInList } from "../redux/reducers/classSlice.reducer"
import { Role, RoomRole, type RoleType, type RoomRoleType } from "../config/enum"
import { toast } from "sonner"
import { changeStateFetching } from "../redux/reducers/global.reducer"

const socket = io(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL}/class`)

export const classSocketEventName = {
    OnSuspendMemberFromClass: "suspend-user-from-class",
    OnLeaveTheClass: "leave-class",
    OnDissolveClass: "dissolve-class",
    OnUpdateMemberData: "update-member-data",
    OnRemoveClass: "remove-class"
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
            const client = state.auth.user.info;
            const currentClassId = state.class.currentClass.info.id;

            // Admin
            if (client.role === Role.UNIADMIN) {
                const getMemberSespend = Object.values(store.getState().class.currentClass.members.data).flat().find(m => m.user.id === memberId)

                if (getMemberSespend) {
                    store.dispatch(currentClass_UpdateMember({
                        ...getMemberSespend,
                        is_banned: result
                    }))

                } else {
                    if (result) toast.info("Có thành viên vừa bị đình chỉ")
                }
                return
            }

            if (client.id !== memberId || typeof result !== "boolean") return;

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

            console.log(client.role)
            console.log(client.role === Role.UNIADMIN)
            if (client.role === Role.UNIADMIN) {
                const memberRemoved = store.getState().class.currentClass.members.data[role].find(m => m.user.id === userId) || store.getState().class.currentClass.members.data.pending.find(m => m.user.id === userId)

                if (memberRemoved) {
                    store.dispatch(currentClass_RemoveMember({ memberRemoved }))
                    toast.info(`${memberRemoved.user.email} vừa ${removeByRole === RoomRole.ROOMADMIN ? "bị xóa" : "rời"} khỏi lớp`, {
                        duration: 10000
                    })
                }

                return
            }

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
            if (currentClass.id !== classId) return

            if (client.id != userId && currentClass.id === classId) {
                const memberRemoved = store.getState().class.currentClass.members.data[role].find(m => m.user.id === userId)
                if (memberRemoved) store.dispatch(currentClass_RemoveMember({ memberRemoved }))
                return
            }

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
            if (client.id === userId && role === removeByRole) {
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

    // Uniadmin or Roomadmin dissolve the current class
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

    // Update member data in class
    static OnUpdateMemberData() {
        socket.on(classSocketEventName.OnUpdateMemberData, (data: { memberId: string, classId: string, role: RoomRoleType }) => {
            const { classId, memberId, role } = data
            const currentClass = store.getState().class.currentClass.info
            const userData = store.getState().auth.user.info

            if (!classId || !memberId || !role || !currentClass.id || !userData.id) return

            if (userData.role === Role.UNIADMIN) {
                const memberUpdated = Object.values(store.getState().class.currentClass.members.data).flat().find(m => m.user.id === memberId)

                if (memberUpdated) {
                    store.dispatch(currentClass_UpdateMember({
                        ...memberUpdated,
                        role,
                    }))
                } else {
                    toast.info("Danh sách thành viên có cập nhật mới. Hãy làm mới danh sách!", {
                        duration: 10000
                    })
                }
                return
            }

            if (currentClass.id === classId && userData.id === memberId) {
                store.dispatch(changeStateFetching(true))

                if (currentClass.user.role != RoomRole.ROOMADMIN && role === RoomRole.ROOMADMIN) { // If the client is authorized roomadmin 'role'
                    toast.info("Bạn vừa được trao quyền quản trị viên", { duration: 20000, closeButton: false })
                }

                toast.info("Thông tin của bạn vừa được cập nhật! Làm mới trang sau 3 giây", { duration: 5000, closeButton: false })
                setTimeout(() => {
                    window.location.reload()
                }, 5000) // 2 second to read the toast and 3 second to reload
            }
        })
    }

    // System admin remove the class
    static OnRemoveClass() {
        socket.on(classSocketEventName.OnRemoveClass, async (data: { classId: string }) => {
            const { classId } = data

            if (!classId) return

            const client = store.getState().auth.user.info

            if (client.role === Role.UNIADMIN) { // System admin
                window.location.pathname = "/super-admin/classes"
            } else { // user: roomadmin, student, lecturer
                const currentClass = store.getState().class.currentClass.info

                if (currentClass.id) { // the user is viewing the class detail
                    confirmDialog({
                        header: "Thông báo hệ thống",
                        message: "Quản trị viên hệ thống vừa xóa vĩnh viễn lớp học của bạn.",
                        acceptLabel: "Quay lại danh sách lớp",
                        rejectLabel: "Quay về trang chủ",
                        accept: () => { window.location.pathname = "/main" },
                        reject: () => { window.location.pathname = "/" }
                    })
                } else store.dispatch(removeClassInList({ classId }))
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