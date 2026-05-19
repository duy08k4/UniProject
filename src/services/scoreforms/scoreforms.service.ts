import { toast } from "sonner"
import errorCatch from "../../config/errorCatch"
import api from "../../config/gateway"
import apiPath from "../path"
import { store } from "../../redux/store"
import { Role, type ScoreForm_TypeType } from "../../config/enum"
import type { DetailScoreForm, ScoreFormPaginationType, ScoreFormRow, UpdateScoreFormType } from "./scoreforms.type"
import {
    removeScoreFormFromPagination,
    setCurrentScoreForm,
    setScoreFormPagination,
    setScoreFormRows,
} from "../../redux/reducers/scoreformSlice.reducer"

export default class ScoreFormsService {
    // Score form (pagination)
    static async scoreFormsPagination(page: number, size: number, classId?: string, search?: string, scoreform_type?: ScoreForm_TypeType, is_deleted?: boolean, is_stopped?: boolean) {
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
            if (scoreform_type) params.scoreform_type = scoreform_type
            if (typeof is_deleted === "boolean") params.is_deleted = is_deleted
            if (typeof is_stopped === "boolean") params.is_stopped = is_stopped

            loading = toast.loading("Đang tải danh sách...")

            const { status, data } = await api.get<ScoreFormPaginationType>(apiPath.scoreform.scoreFormPagination, { params })

            if (status >= 200 && status < 300) {
                store.dispatch(setScoreFormPagination(data))
                return true
            }

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

            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentScoreForm(data))
                return true
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Get rows + cells
    static async getScoreFormRows(scoreFormId: string) {
        try {
            const { status, data } = await api.get<ScoreFormRow[]>(apiPath.scoreform.getScoreFormRows, { params: { scoreFormId } })
            if (status >= 200 && status < 300) {
                store.dispatch(setScoreFormRows(data))
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        }
    }

    // Update score form (create / update columns)
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
                toast.success("Bảng điểm đã cập nhật")
                if (dataUpdate.id) {
                    // Merge response (có columns mới) với detail hiện tại (có class, milestone, ...)
                    const current = store.getState().scoreForm.currentScoreForm
                    if (current) {
                        store.dispatch(setCurrentScoreForm({ ...current, ...data, class: current.class, milestone: current.milestone }))
                    }
                }
                return data
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Update cell
    static async updateCell(scoreFormId: string, rowId: string, columnId: string, value: number, signal?: AbortSignal) {
        try {
            const { status } = await api.post(apiPath.scoreform.updateCell, { scoreFormId, rowId, columnId, value }, { signal })
            if (status >= 200 && status < 300) return true
        } catch (error: any) {
            if (error?.name === 'CanceledError' || error?.name === 'AbortError') return 'aborted'
            errorCatch(error)
            return false
        }
    }

    // Toggle stop
    static async toggleStop(id: string, classId: string) {
        try {
            const { status, data } = await api.patch<{ is_stopped: boolean }>(apiPath.scoreform.toggleStop, { id, classId })
            if (status >= 200 && status < 300) return data
        } catch (error) {
            errorCatch(error)
            return false
        }
    }

    // Approve score form (SA only)
    static async approveScoreForm(id: string, classId: string) {
        let loading
        try {
            loading = toast.loading("Đang duyệt bảng điểm...")
            const { status } = await api.patch(apiPath.scoreform.approve, { id, classId })
            if (status >= 200 && status < 300) {
                toast.success("Duyệt bảng điểm thành công")
                const current = store.getState().scoreForm.currentScoreForm
                if (current) store.dispatch(setCurrentScoreForm({ ...current, status: "accept" }))
                return true
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
                store.dispatch(removeScoreFormFromPagination(ids))
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
                store.dispatch(removeScoreFormFromPagination(ids))
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
