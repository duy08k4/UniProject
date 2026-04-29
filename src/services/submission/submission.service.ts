import { toast } from "sonner"
import errorCatch from "../../config/errorCatch"
import api from "../../config/gateway"
import type { UpdateSubmission, UpdateSubmissionResponse } from "./submission.type"
import { store } from "../../redux/store"
import apiPath from "../path"
import { setCurrentSubmission } from "../../redux/reducers/submissionSlice.reducer"

export default class SubmissionService {
    // Upload file
    static async uploadFile(file: File, oldUrl?: string) {
        let loading

        try {
            loading = toast.loading("Đang tải file lên...")
            const formData = new FormData()

            formData.append('file', file)

            if (oldUrl) formData.append('oldUrl', oldUrl)

            const { status, data } = await api.post<{ url: string }>(apiPath.submission.uploadFile, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (status >= 200 && status < 300) return data.url

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove file
    static async removeFiles(urls: string[]) {
        try {
            await api.delete(apiPath.submission.removeFile, { 
                data: { urls },
                
                paramsSerializer: {
                    indexes: null
                }
            })
        } catch { /* silent fail */ }
    }

    // Get submission (pagination)
    static async getSubmissionPagination(pagination: { page: string, size: string, search?: string, status?: string, classId?: string, formId?: string }) {
        let loading

        try {
            const { page, size, search, status, classId, formId } = pagination

            if (!page || !size) {
                toast.error(`Không thể tải trang ${page}`)
                return false
            }

            // const { } = await api.get

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }
    // Get submission (detail)
    static async getOneSubmission(classId: string, formId: string, userId: string) {
        let loading

        try {
            if (!userId || !classId || !formId) {
                return false
            }

            loading = toast.loading("Đang tải câu trả lời...")
            const { status, data } = await api.get<UpdateSubmissionResponse>(apiPath.submission.getOneSubmission, {
                params: { classId, formId, userId }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentSubmission(data))
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            if (toast) toast.dismiss(loading)
        }
    }

    // Update submission
    static async updateSubmission(submission: UpdateSubmission) {
        let loading

        try {
            const currentForm = store.getState().form.currentForm
            const { formId, answer, answer_checkbox } = submission

            if (!currentForm || currentForm.id !== formId) {
                toast.error("Bạn không thể cung cấp câu trả lời")
                return false
            }

            let validAnswer: boolean = true
            answer.forEach(a => {
                if (!a.body) {
                    const field = currentForm.fields.find(f => f.id === a.fieldId)

                    if (field && field.is_required) validAnswer = false
                }
            })

            if (!validAnswer) {
                toast.error("Vui lòng cung cấp đầy đủ câu trả lời")
                return false
            }


            let validCheckboxAnswer: boolean = true
            answer_checkbox.forEach(a => {
                if (!a.fieldChoicesId) {
                    const checkboxField = currentForm.checkboxFields.find(f => f.id === a.checkboxFieldId)

                    if (checkboxField && checkboxField.is_required) validCheckboxAnswer = false
                }
            })
            if (!validCheckboxAnswer) {
                toast.error("Vui lòng cung cấp đầy đủ lựa chọn")
                return false
            }

            loading = toast.loading("Đang cập nhật câu trả lời...")

            const { status, data } = await api.post<UpdateSubmissionResponse>(apiPath.submission.updateSubmission, submission)

            if (status >= 200 && status < 300) {
                store.dispatch(setCurrentSubmission(data))
                console.log(data)
                toast.success("Đã cập nhật câu trả lời")
                return true
            }


        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            if (loading) toast.dismiss(loading)
        }
    }
}