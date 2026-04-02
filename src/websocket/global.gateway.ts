import { io } from "socket.io-client"
import { store } from "../redux/store"
import { currentClass_AddPending, updateClass } from "../redux/reducers/classSlice.reducer"
import { ClassService } from "../services/class/class.service"
import { toast } from "sonner"
import { memberSizePage } from "../config/pageSize"

const socket = io(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL}`)

export const globalSocketEventName = {
    OnApproveMember: "approve-member",
    OnNewMember: "new-member",
}

export class GlobalGateway {
    static connect() {
        if (!socket.connected) {
            socket.connect()
        }
    }
    // Recieve

    static OnApproveMember() {
        socket.on(globalSocketEventName.OnApproveMember, (data: { receiver: string, classId: string, result: boolean }) => {
            const { receiver, classId, result } = data
            const client = store.getState().auth.user.info

            if (!receiver || !classId || receiver !== client.id) return

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

    static OnNewMember() {
        socket.on(globalSocketEventName.OnNewMember, async (data: { receiverEmail: string, classId: string, newMemberId: string, newMemberName: string, newMemberEmail: string }) => {
            const client = store.getState().auth.user.info
            
            const { classId, newMemberId, receiverEmail, newMemberEmail, newMemberName } = data
            

            if (!classId || !newMemberId || !receiverEmail || receiverEmail !== client.email || !newMemberEmail || !newMemberName) return

            const currenClass = store.getState().class.currentClass.info
            if (currenClass.id !== classId) return
            
            const search = await ClassService.getMembers(1, memberSizePage, newMemberEmail)
            
            if (!search) {
                toast.info(`Có ${currenClass.required_approval ? "yêu cầu tham gia" : "thành viên"} mới`, { duration: 10000 })
                toast.info("Hãy tải lại trang", { duration: 10000 })
                return
            }
            
            const member = Object.values(search.data).flat().find(m => m.user.email === newMemberEmail && m.user.id === newMemberId)

            if (member) {
                store.dispatch(currentClass_AddPending(member))
                toast.info('Có yêu cầu tham gia lớp học')
            } else {
                toast.info(`Có ${currenClass.required_approval ? "yêu cầu tham gia" : "thành viên"} mới`, { duration: 10000 })
                toast.info("Hãy tải lại trang", { duration: 10000 })
                return
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