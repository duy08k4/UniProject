import { toast } from "sonner"
import errorCatch from "../../config/errorCatch"
import api from "../../config/gateway"
import apiPath from "../path"
import { addUsecase, removeUsecase, setSelectedPermission, updateUsecases, type Permission, type Usecase } from "../../redux/reducers/adminSlice.reducer"
import { store } from "../../redux/store"

export default class AdminService {

    // Get use case
    static async getUseCase(usecaseID?: string, search?: string, sort_order?: 'ASC' | 'DESC', sort_by?: 'module' | 'uc_name' | 'description' | 'priority') {
        const loading = toast.loading("Đang tải chức năng...")
        try {
            const { status, data } = await api.get<Usecase[]>(apiPath.admin.getUsecase, {
                params: { usecaseID, search, sort_order, sort_by }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(updateUsecases(data))
                return true
            }
        } catch (error) {
            errorCatch(error, {
                404: { message: "Không tìm thấy chức năng", type: "error" }
            })
            return false
        }

        finally {
            toast.dismiss(loading)
        }
    }
    // Add usecase
    static async addUsecase(uc_name: string, uc_key: string, module: string, priority: string) {
        const loading = toast.loading("Đang thêm chức năng mới...")

        try {
            if (!uc_name || !uc_key || !module || !priority) {
                toast.error("Vui lòng điền đầy đủ thông tin!")
                return false
            }

            const { status, data } = await api.post<Usecase>(apiPath.admin.addUsecase, { module, uc_key, uc_name, priority })

            if (status >= 200 && status < 300) {
                store.dispatch(addUsecase(data))
                toast.success("Chức năng đã được thêm")
                return true
            }

        } catch (error) {
            errorCatch(error, {
                409: { message: "Chức năng đã tồn tại", type: "error" }
            })
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Remove usecase
    static async removeUsecase(usecaseId: string) {
        const loading = toast.loading("Đang xóa chức năng...")

        try {
            if (!usecaseId) {
                toast.error("Vui lòng chọn chức năng cần xóa!")
                return false
            }

            const { status } = await api.delete(apiPath.admin.removeUsecase, {
                params: {
                    id: usecaseId
                }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(removeUsecase(usecaseId))
                toast.success("Đã xóa chức năng")
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Get one permission
    static async getOnePermission(usecaseID: string) {
        const loading = toast.loading("Đang tải quyền hạn...")
        try {
            const { status, data } = await api.get<Permission[]>(apiPath.admin.getPermission, {
                params: { usecaseID }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(setSelectedPermission(data))
                return true
            }
        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Update permission
    static async updatePermission(usecaseID: string, permissions: Permission[]) {
        const loading = toast.loading("Đang cập nhật quyền...")
        try {
            const allPermissions = permissions.map(({ usecase, ...rest }) => rest)

            const { status } = await api.put(apiPath.admin.updatePermission, {
                usecaseId: usecaseID,
                permissions: allPermissions
            })

            if (status >= 200 && status < 300) {
                store.dispatch(setSelectedPermission(permissions))
                toast.success("Đã cập nhật quyền hạn!")
                return true
            }

        } catch (error) {
            errorCatch(error, {
                404: { message: "Chức năng không tồn tại", type: "error" }
            })
            return false
        } finally {
            toast.dismiss(loading)
        }
    }
}