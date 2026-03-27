import { toast } from "sonner"
import errorCatch from "../../config/errorCatch"
import api from "../../config/gateway"
import type { ClassPagination, CreateNewClass, Members } from "./class.type"
import apiPath from "../path"
import { store } from "../../redux/store"
import { addClass, currentClass_SetMembers, currentClass_UpdateInfo, setClassList } from "../../redux/reducers/classSlice.reducer"

export const sizePage = 9

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
                    size: size || sizePage,
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
                return true
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

    // Get members
    static async getMembers(classId: string) {
        let loading

        try {
            if (!classId) {
                toast.error("Không tìm thấy danh sách thành viên")
                console.error("ClassId is invalid")
                return false
            }

            loading = toast.loading("Đang tải danh sách thành viên...")
            const { status, data } = await api.get<Members[]>(apiPath.class.getMembers, {
                params: { classId }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(currentClass_SetMembers(data))
                return true
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

    // Update class's info
    static async updateClass(classId: string, optionChange?: { label?: string, description?: string, subject?: string, required_approval?: boolean, required_join_form?: boolean }) {
        if (!optionChange) return false
        let loading

        try {
            const state = store.getState()
            const userId = state.auth.user.info.id
            
            const { label, description, subject, required_approval, required_join_form } = optionChange
            if (!classId || !userId) {
                toast.error("Không thể cập nhật thông tin lớp học")
                return false
            }

            const currentClassData = store.getState().class.currentClass.info

            if (!currentClassData) {
                toast.error("Không thể cập nhật thông tin lớp học")
                return
            }

            let dataUpdate = {}

            if (label && currentClassData.label != label) {
                dataUpdate = { ...dataUpdate, label }
            }

            if (description && currentClassData.description != description) {
                dataUpdate = { ...dataUpdate, description }
            }

            if (subject && currentClassData.subject != subject) {
                dataUpdate = { ...dataUpdate, subject }
            }

            if (typeof required_approval === "boolean" && currentClassData.required_approval != required_approval) {
                dataUpdate = { ...dataUpdate, required_approval }
            }

            if (typeof required_join_form === "boolean" && currentClassData.required_join_form != required_join_form) {
                dataUpdate = { ...dataUpdate, required_join_form }
            }

            if (Object.values(dataUpdate).length === 0) {
                toast.error("Vui lòng chỉnh sửa thông tin trước khi cập nhật")
                return false
            }

            loading = toast.loading("Đang cập nhật...")
            const { status } = await api.put(apiPath.class.updateClass, { ...dataUpdate })

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

    // Create a new class
    static async createNewClass(label: string, subject: string, description?: string | undefined) {
        let loading

        try {
            const userId = store.getState().auth.user.info.id

            if (!userId || !label || !subject) {
                toast.error("Vui lòng điền đầy đủ thông tin")
                return false
            }

            loading = toast.loading("Đang tạo lớp học mới...")

            const { status, data } = await api.post<CreateNewClass>(apiPath.class.createNewClass, {
                userId,
                label,
                description: description ? description : undefined,
                subject
            })


            if (status >= 200 && status < 300) {
                toast.success("Đã tạo lớp học mới")
                store.dispatch(addClass(data))
                return true
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
}