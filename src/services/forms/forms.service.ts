import { toast } from "sonner"
import errorCatch from "../../config/errorCatch"
import api from "../../config/gateway"
import apiPath from "../path"
import { store } from "../../redux/store"
import { Role } from "../../config/enum"
import type { DetailForm, FormPaginationType, UpdateFormsType } from "./forms.type"
import { setCurrentForm, setFormPagination } from "../../redux/reducers/formSlice.reducer"
import isIsoWithTimezone from "../../utils/isIsoWithTimezone"

export class FormsService {
    // FormsPagination
    static async formsPagination(page: number, size: number, search?: string, is_deleted?: boolean, is_stopped?: boolean, classId?: string) {
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

            const params: any = {
                page, size, classId
            }

            if (search) params.search = search
            if (typeof is_deleted === "boolean") params.is_deleted = is_deleted
            if (typeof is_stopped === "boolean") params.is_stopped = is_stopped

            loading = toast.loading("Đang tải danh sách...")

            const { status, data } = await api.get<FormPaginationType>(apiPath.form.formPagination, { params })

            if (status >= 200 && status < 300) {
                store.dispatch(setFormPagination(data))
                return data
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Get detail form
    static async getFormDetail(classId: string, formId: string) {
        let loading

        try {
            if (!classId || !formId) {
                toast.error("Không tìm thể lấy chi tiết biểu mẫu")
                return false
            }

            loading = toast.loading("Đang lấy thông tin biểu mẫu")
            const { status, data } = await api.get<DetailForm>(apiPath.form.getOneForm, {
                params: { classId, formId }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentForm(data))
                return true
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Update form (Create and update)
    static async updateForm(dataUpdate: UpdateFormsType) {
        let loading

        try {
            const {
                classId,
                milestoneId,
                notificationId,
                formId,
                label,
                description,
                field_count,
                is_auto_open,
                is_auto_close,
                open_at,
                close_at,
                fields,
                checkboxFields,
            } = dataUpdate

            if (!classId) {
                toast.error("Không tìm thấy lớp học")
                return false
            }

            if (!label) {
                toast.error("Bạn cần cung cấp tên biểu mẫu")
                return false
            }

            if (is_auto_open && (open_at && !isIsoWithTimezone(open_at))) {
                toast.error("Thời gian mở biểu mẫu không hợp lệ")
                console.error("Error: Incorrect timing, ISO 8601 structure")
                return false
            }

            if (is_auto_close && (close_at && !isIsoWithTimezone(close_at))) {
                toast.error("Thời gian đóng biểu mẫu không hợp lệ")
                console.error("Error: Incorrect timing, ISO 8601 structure")
                return false
            }

            let body: any = {
                classId, label
            }

            if (milestoneId) body.milestoneId = milestoneId
            if (notificationId) body.notificationId = notificationId
            if (formId) body.formId = formId
            if (description) body.description = description
            
            if (is_auto_open) {
                body.open_at = open_at
                body.is_auto_open = is_auto_open
            } else body.is_auto_open = is_auto_open
            
            if (is_auto_close) {
                body.close_at = close_at
                body.is_auto_close = is_auto_close
            } else body.is_auto_close

            if (Number(field_count) !== (fields.length + checkboxFields.length)) {
                body.field_count = (fields.length + checkboxFields.length).toString()
            } else body.field_count = field_count

            body.fields = fields
            body.checkboxFields = checkboxFields

            loading = toast.loading("Đang lưu biểu mẫu...")

            const { status, data } = await api.post<DetailForm>(apiPath.form.updateForm, body)

            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentForm(data))
                toast.success("Lưu biểu mẫu thành công")
                return true
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Get submission
    static async getSubmission(classId: string, formId: string) {
        let loading

        try {
            if (!classId || !formId) {
                toast.error("Không thể lấy danh sách nộp bài")
                return false
            }

            loading = toast.loading("Đang tải danh sách nộp bài...")

            const { status, data } = await api.get(apiPath.form.getSubmission, {
                params: { classId, formId }
            })

            if (status >= 200 && status < 300) return data

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove form
    static async removeForms(ids: string[]) {
        let loading

        try {
            if (!ids?.length) {
                toast.error("Không tìm thấy biểu mẫu cần xóa")
                return false
            }

            loading = toast.loading("Đang xóa biểu mẫu...")

            const { status, data } = await api.delete(apiPath.form.removeForms, {
                params: { ids }
            })

            if (status >= 200 && status < 300) {
                toast.success("Xóa biểu mẫu thành công")
                return data
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove field
    static async removeFields(ids: string[]) {
        let loading

        try {
            if (!ids?.length) {
                toast.error("Không tìm thấy trường cần xóa")
                return false
            }

            loading = toast.loading("Đang xóa trường...")

            const { status, data } = await api.delete(apiPath.form.removeFields, {
                params: { ids }
            })

            if (status >= 200 && status < 300) {
                toast.success("Xóa trường thành công")
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