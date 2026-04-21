import { io } from "socket.io-client"
import { store } from "../redux/store"
import { currentClass_AddPending, currentClass_UpdateMember, updateClass, updateClassInList } from "../redux/reducers/classSlice.reducer"
import { ClassService } from "../services/class/class.service"
import { toast } from "sonner"
import { memberSizePage } from "../config/pageSize"
import { Role, type RoomRoleType } from "../config/enum"
import { confirmDialog } from "primereact/confirmdialog"

const socket = io(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL}`)

export const globalSocketEventName = {
    OnApproveMember: "approve-member",
    OnNewMember: "new-member",
    OnCreateNewClass: "new-class",
    OnUpdateClassStatus: "update-class-status"
}

export class GlobalGateway {
    static connect() {
        if (!socket.connected) {
            socket.connect()
        }
    }
    // Recieve

    // Subcriber when owner's class approve a member
    static OnApproveMember() {
        socket.on(globalSocketEventName.OnApproveMember, (data: { memberId: string, role: RoomRoleType, classId: string, result: boolean }) => {
            const { classId, result, memberId, role } = data

            if (!classId) return

            const approvedMember = store.getState().class.currentClass.members.data.pending.find(m => m.user.id === memberId)
            if (approvedMember) store.dispatch(currentClass_UpdateMember({
                ...approvedMember,
                role,
                roomadmin_approved: result
            }))

            const getClass = store.getState().class.classList.find(c => c.id === classId)

            if (!getClass) return

            store.dispatch(updateClass({
                ...getClass,
                user: {
                    is_banned: getClass.user.is_banned,
                    role: getClass.user.role,
                    roomadmin_approved: result
                }
            }))
        })
    }

    // Subcriber when there is a user who joins class
    static OnNewMember() {
        socket.on(globalSocketEventName.OnNewMember, async (data: { receiverEmail: string, classId: string, newMemberId: string, newMemberName: string, newMemberEmail: string }) => {
            const { classId, newMemberId, newMemberEmail, newMemberName } = data


            if (!classId || !newMemberId || !newMemberEmail || !newMemberName) return

            const currentClass = store.getState().class.currentClass.info
            if (currentClass.id !== classId) return

            const search = await ClassService.getMembers(1, memberSizePage, newMemberEmail)

            if (!search) {
                toast.info(`Có ${currentClass.required_approval ? "yêu cầu tham gia" : "thành viên"} mới`, { duration: 10000 })
                toast.info("Hãy tải lại trang", { duration: 10000 })
                return
            }

            const member = Object.values(search.data).flat().find(m => m.user.email === newMemberEmail && m.user.id === newMemberId)

            if (member) {
                store.dispatch(currentClass_AddPending(member))
                toast.info('Có yêu cầu tham gia lớp học')
            } else {
                toast.info(`Có ${currentClass.required_approval ? "yêu cầu tham gia" : "thành viên"} mới`, { duration: 10000 })
                toast.info("Hãy tải lại trang", { duration: 10000 })
                return
            }

        })
    }

    // Subcriber when some user creates a new class
    static OnCreateNewClass() { // Only system admin receive
        socket.on(globalSocketEventName.OnCreateNewClass, async (data: { classId: string }) => {
            const { classId } = data
            console.log(data)
            const client = store.getState().auth.user.info

            if (!classId || client.role !== Role.UNIADMIN) return

            const newClass = await ClassService.getClass(classId)

            if (newClass) {
                store.dispatch(updateClassInList(newClass))
            } else {
                toast.info("Có lớp học mới vừa được tạo!", {
                    duration: 5000
                })

                setTimeout(() => {
                    toast.info("Làm mới danh sách lớp để xem")
                }, 8000)
            }
        })
    }

    // Subcriber when system admin approves or bans (locks) a class
    static OnUpdateClassStatus() {
        socket.on(globalSocketEventName.OnUpdateClassStatus, (data: { classId: string, approvalClass?: boolean, banned?: boolean }) => {
            const { classId, approvalClass, banned } = data
            const client = store.getState().auth.user.info

            if (!classId) return

            // Check client's role
            if (!client.id) return

            /*
                Note: Skip update for 'uniadmin' role; handled by updateClass service."
            */

            if (client.role !== Role.UNIADMIN) { //User: roomadmin, student, lecturer
                const getClassInClassList = store.getState().class.classList.find(c => c.id === classId)

                if (typeof approvalClass === 'boolean') {
                    if (getClassInClassList) {
                        store.dispatch(updateClassInList({
                            ...getClassInClassList,
                            created_approval: approvalClass
                        }))
                    } // else the mechanism auomatically reloads class list

                    return
                }


                const currentClass = store.getState().class.currentClass.info
                /*
                    Note:
                    - The website has a mechanism that automatically removes data of the previously accessed class and reloads class list.
                */
                if (typeof banned === 'boolean' && banned) { // System admin locks the class
                    if (currentClass.id) { // The user is viewing the class detail
                        confirmDialog({
                            header: "Thông báo hệ thống",
                            message: "Quản trị viên hệ thống vừa đóng lớp học của bạn. Hiện tại bạn không thể truy cập vào lớp.",
                            acceptLabel: "Quay lại danh sách lớp",
                            rejectLabel: "Quay về trang chủ",
                            accept: () => { window.location.pathname = "/main" },
                            reject: () => { window.location.pathname = "/" }
                        })

                        return
                    } else if (getClassInClassList) {
                        store.dispatch(updateClassInList({
                            ...getClassInClassList,
                            is_banned: banned
                        }))
                    }

                } else if (typeof banned === 'boolean' && !banned) {
                    if (getClassInClassList) {
                        store.dispatch(updateClassInList({
                            ...getClassInClassList,
                            is_banned: banned
                        }))
                    }
                }

            }
        })
    }

    static disconnect() {
        if (socket.connected) {
            socket.disconnect()
        }
    }


    static off(event: string) {
        socket.off(event)
    }
}