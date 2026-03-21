import axios from "axios"
import { toast } from "sonner"

const errorCatch = (error: any, optionalToastMessage?: Record<number, string>) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const optionalToast = optionalToastMessage

        switch (status) {
            case 400:
                toast.error(optionalToast ? optionalToastMessage[status] : `Dữ liệu không hợp lệ`)
                break;

            case 401:
                toast.error(optionalToast ? optionalToastMessage[status] : `Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại`)
                break;

            case 403:
                toast.error(optionalToast ? optionalToastMessage[status] : `Quyền truy cập bị từ chối`)
                break;

            case 404:
                toast.error(optionalToast ? optionalToastMessage[status] : `Không tìm thấy dữ liệu`)
                break;

            case 409:
                toast.error(optionalToast ? optionalToastMessage[status] : `Yêu cầu bị từ chối`)
                break;

            case 422:
                toast.error(optionalToast ? optionalToastMessage[status] : `Xác thực dữ liệu thất bại`)
                break;

            case 500:
                toast.error(optionalToast ? optionalToastMessage[status] : `Mất kết nối máy chủ`)
                break;

            case 502:
            case 503:
                toast.error(optionalToast ? optionalToastMessage[status] : `Dịch vụ không khả dụng`)
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