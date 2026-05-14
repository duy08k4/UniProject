import { io } from "socket.io-client"
import { store } from "../redux/store"
import { updateFormIsStopped, updateCurrentFormData, clearCurrentFormIfDeleted } from "../redux/reducers/formSlice.reducer"
import { addFormToCurrentMilestone, updateFormInCurrentMilestone, removeFormsFromCurrentMilestone } from "../redux/reducers/progressSlice.reducer"
import { FormsService } from "../services/forms/forms.service"
import { toast } from "sonner"
import { Role } from "../config/enum"

const socket = io(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL}/forms`)

export const formsSocketEventName = {
    OnToggleStop: "toggle-stop",
    OnFormSaved: "form-saved",
    OnFormDeleted: "form-deleted"
}

export class FormsGateway {
    static connect() {
        if (!socket.connected) {
            socket.connect()
        }
    }

    static OnToggleStop() {
        socket.on(formsSocketEventName.OnToggleStop, (data: { formId: string; classId: string; is_stopped: boolean }) => {
            const { formId, classId, is_stopped } = data

            if (!formId || !classId || typeof is_stopped !== 'boolean') return

            const userData = store.getState().auth.user.info

            if (userData.role !== Role.UNIADMIN) {
                const currentClass = store.getState().class.currentClass
                const currentForm = store.getState().form.currentForm

                if (currentForm && currentForm.id === formId && currentClass && currentClass.info.id === classId) {
                    store.dispatch(updateFormIsStopped({ formId, is_stopped }))
                }
            } else store.dispatch(updateFormIsStopped({ formId, is_stopped }))

            // Cập nhật is_stopped trong currentMilestone.forms
            const currentMilestone = store.getState().progress.currentMilestone
            if (currentMilestone) {
                const form = currentMilestone.forms.find(f => f.id === formId)
                if (form) store.dispatch(updateFormInCurrentMilestone({ ...form, is_stopped }))
            }
        })
    }

    static OnFormSaved() {
        socket.on(formsSocketEventName.OnFormSaved, async (data: { formId: string; classId: string; milestoneId: string | null; isNew: boolean }) => {
            const { formId, classId, milestoneId, isNew } = data

            const currentMilestone = store.getState().progress.currentMilestone
            const currentForm = store.getState().form.currentForm

            // Nếu đang xem form này thì fetch lại và cập nhật currentForm
            if (!isNew && currentForm?.id === formId) {
                const result = await FormsService.getFormDetail(classId, formId)
                if (result) {
                    const updated = store.getState().form.currentForm
                    if (updated) store.dispatch(updateCurrentFormData(updated))
                }
            }

            // Nếu currentMilestone khớp thì cập nhật danh sách forms
            if (currentMilestone && milestoneId && currentMilestone.id === milestoneId) {
                const result = await FormsService.getFormDetail(classId, formId)
                if (result) {
                    const saved = store.getState().form.currentForm
                    if (!saved) return

                    const formSummary: typeof currentMilestone.forms[0] = {
                        id: saved.id,
                        is_join_form: saved.is_join_form,
                        label: saved.label,
                        description: saved.description ?? null,
                        field_count: saved.field_count,
                        is_auto_open: saved.is_auto_open,
                        is_auto_close: saved.is_auto_close,
                        email_notification_enabled: false,
                        is_deleted: saved.is_deleted,
                        is_stopped: saved.is_stopped,
                        open_at: saved.open_at,
                        close_at: saved.close_at,
                        update_at: saved.update_at,
                        created_at: saved.created_at
                    }

                    if (isNew) {
                        store.dispatch(addFormToCurrentMilestone(formSummary))
                    } else {
                        store.dispatch(updateFormInCurrentMilestone(formSummary))
                    }
                }
            }
        })
    }

    static OnFormDeleted() {
        socket.on(formsSocketEventName.OnFormDeleted, (data: { formIds: string[]; classId: string }) => {
            const { formIds } = data

            const currentForm = store.getState().form.currentForm
            if (currentForm && formIds.includes(currentForm.id)) {
                store.dispatch(clearCurrentFormIfDeleted(formIds))
                toast.warning("Biểu mẫu bạn đang xem đã bị xóa", { duration: 30000 })
            }

            store.dispatch(removeFormsFromCurrentMilestone(formIds))
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
