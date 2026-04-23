import { toast } from "sonner"
import errorCatch from "../../config/errorCatch"
import api from "../../config/gateway"
import apiPath from "../path"
import type { ProgressDeatil, ProgressPagination, UpdateMilestone } from "./progress.type"
import { store } from "../../redux/store"
import { removeMilestone, setCurrentProgress, setProgressPaginationData, updateMilestone } from "../../redux/reducers/progressSlice.reducer"
import { Role } from "../../config/enum"

export default class ProgressService {
    /* ------------------------------------------------------------------------------ PROGRESS ---------------------------------------------------------------------------------------------- */
    // Get progress pagination (Only system admin)
    static async progressPagination(page: string, size: string, search?: string, created_approval?: boolean, is_deleted?: boolean) {
        let loading

        try {
            if (!page || !size) {
                toast.error("Không tìm thấy dữ liệu")
                return false
            }

            const params: any = {
                page, size
            }

            if (search) params.search = search
            if (typeof created_approval === "boolean") params.created_approval = created_approval
            if (typeof is_deleted === "boolean") params.is_deleted = is_deleted

            loading = toast.loading("Đang tải quy trình...")
            const { status, data } = await api.get<ProgressPagination>(apiPath.progress.progressPagination, { params })

            if (status >= 200 && status < 300) {
                store.dispatch(setProgressPaginationData(data))
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Get one progress
    static async getProgressDetail(classId: string) {
        let loading

        try {
            if (!classId) {
                toast.error("Không tìm thấy mã định danh lớp học")
                return false
            }

            loading = toast.loading("Đang tải quy trình...")
            const { status, data } = await api.get<ProgressDeatil>(apiPath.progress.getProgressDetail, {
                params: { classId }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentProgress(data))
                return data
            }

        } catch (error) {
            errorCatch(error, {
                404: { type: "info", message: "", dissmis: true }
            })
            store.dispatch(setCurrentProgress(null))
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Create new progress
    static async createNewProgress(classId: string, label: string, description: string) {
        let loading

        try {
            if (!classId) {
                toast.error("Không tìm thấy lớp học")
                return false
            }

            if (!label || !description) {
                toast.error("Vui lòng điền đầy đủ thông tin để khởi tạo quy trình")
                return false
            }

            if (label.length < 8 || description.length < 8) {
                toast.error("Các mục yêu cầu ít nhất 8 ký tự")
                return false
            }

            loading = toast.loading("Đang khởi tạo quy trình...")
            const { data, status } = await api.post(apiPath.progress.createNewProgress, { classId, label, description })

            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentProgress({
                    ...data,
                    milestones: []
                } as ProgressDeatil))

                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Update progress
    static async updateProgressInfo(dataUpdate: { classId: string, progressId: string, label?: string, description?: string, is_submitted?: boolean, is_banned?: boolean, created_approval?: boolean }) {
        let loading

        try {
            const { classId, progressId, label, description, is_submitted, created_approval, is_banned } = dataUpdate

            if (!classId || !progressId) {
                toast.error("Không tìm thấy lớp học")
                return false
            }

            const dataForUpdate: any = {}
            const currentProgressInfo = store.getState().progress.currentProgress

            if (typeof created_approval === "boolean" || typeof is_banned === "boolean") {
                const client = store.getState().auth.user.info

                if (client.role === Role.UNIADMIN) {
                    if (typeof created_approval === "boolean" && currentProgressInfo && created_approval !== currentProgressInfo.created_approval) dataForUpdate.created_approval = created_approval
                    if (typeof is_banned === "boolean" && currentProgressInfo && is_banned !== currentProgressInfo.is_banned) dataForUpdate.is_banned = is_banned

                }
            }

            if (label && currentProgressInfo && label !== currentProgressInfo.label) dataForUpdate.label = label
            if (description && currentProgressInfo && description !== currentProgressInfo.description) dataForUpdate.description = description
            if (typeof is_submitted === "boolean" && currentProgressInfo && is_submitted !== currentProgressInfo.is_submitted) dataForUpdate.is_submitted = is_submitted

            if (Object.values(dataForUpdate).length === 0) {
                toast.error("Không có dữ liệu cần cập nhật")
                return false
            } else {
                dataForUpdate.classId = classId
                dataForUpdate.progressId = progressId
            }

            loading = toast.loading("Đang cập nhật quy trình...")
            const { status, data } = await api.put<ProgressDeatil>(apiPath.progress.updateProgressInfo, dataForUpdate)

            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentProgress(data))
                return data
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove progress
    static async removeProgress(progressIds: string[]) {
        let loading

        try {
            if (progressIds.length === 0) {
                toast.error("Không tìm thấy quy trình cần xóa")
                return false
            }
            const userData = store.getState().auth.user.info

            if (userData.role !== Role.UNIADMIN && progressIds.length > 1) {
                toast.error("Bạn không có quyền xóa nhiều quy trình")
                return false
            }

            loading = toast.loading("Đang xóa quy trình...")
            const { status, data } = await api.delete(apiPath.progress.removeProgress, {
                params: {
                    ids: progressIds
                },
                paramsSerializer: {
                    indexes: null
                }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentProgress(null))
                return data
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    /* ------------------------------------------------------------------------------ MILESTONE ---------------------------------------------------------------------------------------------- */
    // Get milestone

    // Update milestone (create new and)
    static async updateMilestone(classId: string, progressId: string, milestone: { id?: string, index: string | number, label: string, description: string, is_stopped: boolean }[]) {
        let loading

        try {
            if (milestone.length === 0) return false

            if (!classId || !progressId) {
                toast.error("Không thể cập nhật các cột mốc")
                return false
            }

            loading = toast.loading("Đang cập nhật các cột mốc...")
            const filterMilestone = milestone.map((m) => {
                return { ...m, index: m.index.toString() }
            })
            const { status, data } = await api.post<UpdateMilestone>(apiPath.progress.updateMilestone, { classId, progressId, milestone: filterMilestone })

            if (status >= 200 && status < 300) {
                store.dispatch(updateMilestone(data))
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    static async createRegistrationMilestone(classId: string) {
        let loading
        try {
            loading = toast.loading("Đang tạo cột đăng ký đề tài...")
            const { status, data } = await api.post<ProgressDeatil>(apiPath.progress.createRegistrationMilestone, {}, { params: { classId } })
            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentProgress(data))
                toast.success("Đã tạo lại cột đăng ký đề tài")
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove milestone
    static async removeMilestone(milestoneIds: string[]) {
        let loading

        try {
            if (milestoneIds.length === 0) return false

            loading = toast.loading("Đang xóa cột mốc...")
            const { status } = await api.delete(apiPath.progress.removeMilestone, {
                params: {
                    ids: milestoneIds
                },
                paramsSerializer: {
                    indexes: null
                }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(removeMilestone({ ids: milestoneIds }))
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