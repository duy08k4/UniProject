import { toast } from "sonner"
import errorCatch from "../../config/errorCatch"
import api from "../../config/gateway"
import type { ClassPagination, CreateNewClass, Members, MembersPagination } from "./class.type"
import apiPath from "../path"
import { store } from "../../redux/store"
import { addClass, currentClass_RemoveMember, currentClass_UpdateInfo, setClassList, updateClassInList } from "../../redux/reducers/classSlice.reducer"
import { clasSizePage } from "../../config/pageSize"

export class ClassService {
    // Get all class
    static async getAllClasses(page: number, size: number, search?: string) {
        let loading

        try {
            const userId = store.getState().auth.user.info.id

            if (!userId) toast.error("Không thể tải danh sách lớp học")

            loading = toast.loading("Đang tải lớp học...")
            const { status, data } = await api.get<ClassPagination>(apiPath.class.getAllClasses, {
                params: {
                    userId,
                    page: page || 1,
                    size: size || clasSizePage,
                    search: search
                }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(setClassList(data))
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Get one class
    static async getClass(classId: string) {
        let loading
        try {
            if (!classId) {
                toast.error("Không tìm thấy lớp ")
                return false
            }

            loading = toast.loading("Đang lấy thông tin lớp học...")
            const { status, data } = await api.get<CreateNewClass>(apiPath.class.getOneClasses, {
                params: { classId }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(currentClass_UpdateInfo(data))
                return data
            }


        } catch (error) {
            errorCatch(error, {
                404: { message: "Không tìm thấy lớp học", type: "error" }
            })
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove a class
    static async removeClass(classId: string, userId: string) {
        let loading

        try {
            const currentClass = store.getState().class.currentClass.info.id

            if (!classId || !userId || currentClass !== classId) return // currentClass !== classId => breake if user don't access class with id is classId

            loading = toast.loading("Đang giải tán lớp học...")
            const { status } = await api.delete<CreateNewClass>(apiPath.class.removeClass, {
                params: { classId, userId }
            })

            if (status >= 200 && status < 300) {
                return true
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Get members
    static async getMembers(page?: number, size?: number, search?: string, roleSearch?: string) {
        let loading

        try {
            const classId = store.getState().class.currentClass.info.id

            if (!classId) {
                toast.error("Không tìm thấy danh sách thành viên")
                console.error("ClassId is invalid")
                return false
            }

            const params: any = {
                classId,
                page: page ? page : 1,
                size: size ? size : 50,
                search
            }

            if (roleSearch) params.roleSearch = roleSearch

            loading = toast.loading("Đang tải danh sách thành viên...")
            const { status, data } = await api.get<MembersPagination>(apiPath.class.getMembers, { params })

            if (status >= 200 && status < 300) {
                // store.dispatch(currentClass_SetMembers(data))
                return data
            }

        } catch (error) {
            errorCatch(error, {
                400: { message: "Không tìm thấy danh sách thành viên", type: "error" },
                404: { message: "Không tìm thấy danh sách thành viên", type: "error" }
            })
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Update member
    static async updateMember(
        classId: string,
        memberId: string,
        option?: {
            role?: Members["role"],
            can_create_forms?: boolean,
            can_create_notifications?: boolean,
            can_create_score_forms?: boolean,
            roomadmin_approved?: boolean,
            is_banned?: boolean
        }
    ) {
        let loading

        try {
            if (!classId || !memberId) {
                toast.error("Vui lòng chọn thành viên")
                return
            }

            if (!option) {
                toast.error("Không có dữ liệu cần cập nhật")
                return false
            }
            const { role, can_create_forms, can_create_notifications, can_create_score_forms, is_banned, roomadmin_approved } = option
            const dataUpdate: any = {
                classId,
                memberId
            }

            if (role !== undefined) dataUpdate.role = role
            if (can_create_forms !== undefined) dataUpdate.can_create_forms = can_create_forms
            if (can_create_score_forms !== undefined) dataUpdate.can_create_score_forms = can_create_score_forms
            if (can_create_notifications !== undefined) dataUpdate.can_create_notifications = can_create_notifications
            if (roomadmin_approved !== undefined) dataUpdate.roomadmin_approved = roomadmin_approved
            if (is_banned !== undefined) dataUpdate.is_banned = is_banned

            if (Object.values(dataUpdate).length === 0) {
                toast.error("Không có dữ liệu cần cập nhật")
                return false
            }

            loading = toast.loading("Đang cập nhật dữ liệu...")
            const { status, data } = await api.put<Members>(apiPath.class.updateMember, dataUpdate)

            if (status >= 200 && status < 300) {
                return data
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }
    // Update class's info
    static async updateClass(classId: string, optionChange?: { label?: string, description?: string, subject?: string, created_approval?: boolean, is_banned?: boolean, required_approval?: boolean, required_join_form?: boolean }) {
        if (!optionChange) return false
        let loading

        try {
            const state = store.getState()
            const userId = state.auth.user.info.id

            const { label, description, subject, required_approval, required_join_form, created_approval, is_banned } = optionChange
            if (!classId || !userId) {
                toast.error("Không thể cập nhật thông tin lớp học")
                return false
            }

            let dataUpdate = {}

            if (label) {
                dataUpdate = { ...dataUpdate, label }
            }

            if (description) {
                dataUpdate = { ...dataUpdate, description }
            }

            if (subject) {
                dataUpdate = { ...dataUpdate, subject }
            }

            if (typeof required_approval === "boolean") {
                dataUpdate = { ...dataUpdate, required_approval }
            }

            if (typeof required_join_form === "boolean") {
                dataUpdate = { ...dataUpdate, required_join_form }
            }

            if (typeof is_banned === "boolean") {
                dataUpdate = { ...dataUpdate, is_banned }
            }

            if (typeof created_approval === "boolean") {
                dataUpdate = { ...dataUpdate, created_approval }
            }

            if (Object.values(dataUpdate).length === 0) {
                toast.error("Thông tin không thay đổi. Không thể cập nhật")
                return false
            }

            loading = toast.loading("Đang cập nhật...")
            const { status, data } = await api.put<CreateNewClass>(apiPath.class.updateClass, { userId, classId, ...dataUpdate })

            if (status >= 200 && status < 300) {
                store.dispatch(currentClass_UpdateInfo(data))
                store.dispatch(updateClassInList(data))
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Create a new class
    static async createNewClass(label: string, subject: string, description?: string | undefined) {
        let loading

        try {
            if (!label || !subject) {
                toast.error("Vui lòng điền đầy đủ thông tin")
                return false
            }

            loading = toast.loading("Đang tạo lớp học mới...")

            const { status, data } = await api.post<CreateNewClass>(apiPath.class.createNewClass, {
                label,
                description: description ? description : undefined,
                subject
            })


            if (status >= 200 && status < 300) {
                store.dispatch(addClass(data))
                return data
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Join class
    static async joinClass(joinCode: string) {
        let loading
        try {
            if (!joinCode) {
                toast.error("Vui lòng nhập mã lớp học")
                return false
            }

            const userId = store.getState().auth.user.info.id

            loading = toast.loading("Đang tìm lớp học...")
            const { status, data } = await api.post<CreateNewClass>(apiPath.class.joinClass, {
                userId,
                joinCode,
                joinRole: "student"
            })

            if (status >= 200 && status < 300) {
                toast.success("Bạn đã tham gia lớp học")
                store.dispatch(addClass(data))
                return data
            }
        } catch (error) {
            errorCatch(error, {
                404: { message: "Lớp học không tồn tại", type: "error" },
                409: { message: "Bạn đã là thành viên của lớp", type: "error" }
            })

            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove member
    static async removeMember(userId: string, classId: string, newAdminId?: string) {
        let loading

        try {
            if (!userId || !classId) {
                toast.error("Vui lòng chọn thành viên để xóa")
                return false
            }

            const clientId = store.getState().auth.user.info.id

            const params: any = {
                userId,
                classId
            }

            if (clientId === userId && newAdminId) {
                params.newOwnerId = newAdminId
            }

            loading = toast.loading("Đang xóa ...")

            const { status, data } = await api.delete(apiPath.class.removeMember, { params })

            if (status >= 200 && status < 300) {
                toast.success("Thành công")
                const memberRemoved = Object.values(store.getState().class.currentClass.members.data).flat().find(m => m.user.id === userId)
                if (memberRemoved) store.dispatch(currentClass_RemoveMember({ memberRemoved, newAdminId }))
                return data
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }
}