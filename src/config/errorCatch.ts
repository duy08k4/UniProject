import axios from "axios"
import { toast } from "sonner"
import { store } from "../redux/store"
import { updateUser } from "../redux/reducers/authSlice.reducer"

type ToastType = "error" | "success" | "warning" | "info"

const errorCatch = (error: any, optionalToastMessage?: Record<number, { message: string, type: ToastType }>) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const optionalToast = optionalToastMessage

        switch (status) {
            case 400:
                toast[optionalToast && optionalToast[status] ? optionalToast[status].type : "error"](optionalToast && optionalToast[status] ? optionalToast[status].message : `Dữ liệu không hợp lệ`)
                break;

            case 401:
                toast[optionalToast && optionalToast[status] ? optionalToast[status].type : "error"](optionalToast && optionalToast[status] ? optionalToast[status].message : `Phiên đăng nhập hết hạn`)
                store.dispatch(updateUser(null))
                break;

            case 403:
                toast[optionalToast && optionalToast[status] ? optionalToast[status].type : "error"](optionalToast && optionalToast[status] ? optionalToast[status].message : `Quyền truy cập bị từ chối`)
                break;

            case 404:
                toast[optionalToast && optionalToast[status] ? optionalToast[status].type : "error"](optionalToast && optionalToast[status] ? optionalToast[status].message : `Không tìm thấy dữ liệu`)
                break;

            case 409:
                toast[optionalToast && optionalToast[status] ? optionalToast[status].type : "error"](optionalToast && optionalToast[status] ? optionalToast[status].message : `Yêu cầu bị từ chối`)
                break;

            case 422:
                toast[optionalToast && optionalToast[status] ? optionalToast[status].type : "error"](optionalToast && optionalToast[status] ? optionalToast[status].message : `Xác thực dữ liệu thất bại`)
                break;

            case 500:
                toast[optionalToast && optionalToast[status] ? optionalToast[status].type : "error"](optionalToast && optionalToast[status] ? optionalToast[status].message : `Mất kết nối máy chủ`)
                break;

            case 502:
            case 503:
                toast[optionalToast && optionalToast[status] ? optionalToast[status].type : "error"](optionalToast && optionalToast[status] ? optionalToast[status].message : `Dịch vụ không khả dụng`)
                break;

            default:
                toast.error(`Dịch vụ không khả dụng`)
        }
    } else {
        toast.error('Dịch vụ không khả dụng!')
    }

    console.error(error)
}

export default errorCatch