import { toast } from "sonner"
import api from "../../config/gateway"
import errorCatch from "../../config/errorCatch"
import apiPath from "../path"
import type { AdminUser, AdminUserPagination } from "./admin.type"

export class AdminService {
    static async getUsers(page: number, size: number, search?: string, is_banned?: boolean, is_deleted?: boolean) {
        try {
            const params: any = { page, size }
            if (search) params.search = search
            if (typeof is_banned === 'boolean') params.is_banned = is_banned
            if (typeof is_deleted === 'boolean') params.is_deleted = is_deleted

            const { status, data } = await api.get<AdminUserPagination>(apiPath.admin.getUsers, { params })
            if (status >= 200 && status < 300) return data
        } catch (error) {
            errorCatch(error)
            return null
        }
    }

    static async getOneUser(id: string) {
        try {
            const { status, data } = await api.get<AdminUser>(`${apiPath.admin.getOneUser}/${id}`)
            if (status >= 200 && status < 300) return data
        } catch (error) {
            errorCatch(error, { 404: { message: "Không tìm thấy người dùng", type: "error" } })
            return null
        }
    }

    static async updateUser(id: string, body: { is_banned?: boolean; is_deleted?: boolean }) {
        let loading
        try {
            loading = toast.loading("Đang xử lý...")
            const { status, data } = await api.post<AdminUser>(`${apiPath.admin.updateUser}/${id}`, body)
            if (status >= 200 && status < 300) return data
        } catch (error) {
            errorCatch(error)
            return null
        } finally {
            toast.dismiss(loading)
        }
    }
}
