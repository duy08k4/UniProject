import { toast } from "sonner"
import errorCatch from "../../config/errorCatch"
import api from "../../config/gateway"
import apiPath from "../path"
import { store } from "../../redux/store"
import { Role } from "../../config/enum"
import type { DetailScoreForm, ScoreFormPaginationType, UpdateScoreFormType } from "./scoreforms.type"

export default class ScoreFormsService {
    // Score form (pagination)
    static async scoreFormsPagination(page: number, size: number, search?: string, is_deleted?: boolean, is_stopped?: boolean, classId?: string) {
        let loading
        try {
            if (!page || !size) {
                toast.error("Không thể tải danh sách")
                return false
            }

            if (!classId) {
                const userData = store.getState().auth.user.info
                if (userData.role !== Role.UNIADMIN) {
                    toast.error("Không tìm thấy lớp học")
                    return false
                }
            }

            const params: any = { page, size, classId }
            if (search) params.search = search
            if (typeof is_deleted === "boolean") params.is_deleted = is_deleted
            if (typeof is_stopped === "boolean") params.is_stopped = is_stopped

            loading = toast.loading("Đang tải danh sách...")

            const { status, data } = await api.get<ScoreFormPaginationType>(apiPath.scoreform.scoreFormPagination, { params })

            if (status >= 200 && status < 300) return data

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Get detail score form
    static async getScoreFormDetail(id: string) {
        let loading
        try {
            if (!id) {
                toast.error("Không thể lấy chi tiết bảng điểm")
                return false
            }

            loading = toast.loading("Đang lấy thông tin bảng điểm...")

            const { status, data } = await api.get<DetailScoreForm>(apiPath.scoreform.getScoreFormDetail, { params: { id } })

            if (status >= 200 && status < 300) return data

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Update score form
    static async updateScoreForm(dataUpdate: UpdateScoreFormType) {
        let loading
        try {
            const { classId, label, columns } = dataUpdate

            if (!classId) {
                toast.error("Không tìm thấy lớp học")
                return false
            }

            if (!label) {
                toast.error("Bạn cần cung cấp tên bảng điểm")
                return false
            }

            loading = toast.loading("Đang lưu bảng điểm...")

            const { status, data } = await api.post<DetailScoreForm>(apiPath.scoreform.updateScoreForm, {
                ...dataUpdate,
                field_count: columns.length.toString()
            })

            if (status >= 200 && status < 300) {
                toast.success("Lưu bảng điểm thành công")
                return data
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove score form (soft)
    static async softDeleteScoreForms(ids: string[]) {
        let loading
        try {
            if (!ids?.length) {
                toast.error("Không tìm thấy bảng điểm cần xóa")
                return false
            }

            loading = toast.loading("Đang xóa bảng điểm...")

            const { status } = await api.delete(apiPath.scoreform.softDeleteScoreForms, { data: { ids } })

            if (status >= 200 && status < 300) {
                toast.success("Xóa bảng điểm thành công")
                return true
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove score form (hard)
    static async hardDeleteScoreForms(ids: string[]) {
        let loading
        try {
            if (!ids?.length) {
                toast.error("Không tìm thấy bảng điểm cần xóa")
                return false
            }

            loading = toast.loading("Đang xóa vĩnh viễn bảng điểm...")

            const { status } = await api.delete(apiPath.scoreform.hardDeleteScoreForms, { data: { ids } })

            if (status >= 200 && status < 300) {
                toast.success("Xóa vĩnh viễn bảng điểm thành công")
                return true
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }
}
