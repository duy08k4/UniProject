import { toast } from "sonner"
import api from "../../config/gateway"
import apiPath from "../path"
import errorCatch from "../../config/errorCatch"
import type { NotificationDetail, NotificationPagination } from "./notifications.type"
import { store } from "../../redux/store"
import { removeNotification, setNotificationPagination, updateNotification } from "../../redux/reducers/notification.reducer"

export default class NotificationsService {
    // Get notification (pagination)
    static async notificationPagination(classId: string, page: number, size: number) {
        let loading

        try {
            if (!classId) {
                toast.error("Không tìm thấy lớp học")
                return false
            }

            loading = toast.loading("Đang tải thông báo...")

            const { status, data } = await api.get<NotificationPagination>(apiPath.notifications.getPagination, {
                params: { classId, page, size }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(setNotificationPagination(data))
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Get notification (detail)
    static async getOneNotification(id: string) {
        let loading

        try {
            if (!id) {
                toast.error("Không tìm thấy thông báo")
                return false
            }

            loading = toast.loading("Đang tải thông báo...")
            const { status, data } = await api.get<NotificationDetail>(`${apiPath.notifications.getOne}/${id}`)

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

    // Update and create Notification
    static async upsertNotification(payload: {
        id?: string
        classId: string
        title: string
        body: string
        milestoneId?: string
        formIds?: string[]
    }) {
        let loading

        try {
            loading = toast.loading(payload.id ? "Đang cập nhật..." : "Đang tạo thông báo...")
            const { status, data } = await api.post<NotificationDetail>(apiPath.notifications.upsert, payload)
            if (status >= 200 && status < 300) {
                toast.success(payload.id ? "Thông báo đã được cập nhật" : "Thông báo đã được tạo")
                store.dispatch(updateNotification(data))
                return true
            }
        } catch (error) {
            errorCatch(error, {
                403: { message: "Không thể chỉnh sửa thông báo đã quá 1 ngày", type: "error" }
            })

            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove notification
    static async removeNotification(id: string) {
        let loading

        try {
            if (!id) {
                toast.error("Không thể xóa thông báo")
                return false
            }
            loading = toast.loading("Đang xóa thông báo...")

            const { status } = await api.delete(`${apiPath.notifications.remove}/${id}`)
            if (status >= 200 && status < 300) {
                toast.success("Thông báo đã được thu hồi");
                store.dispatch(removeNotification({ ids: [id] }))
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
        return false
    }
}
