// Gate way
import { toast } from "sonner"
import api from "../../config/gateway"

export class AuthService {
    // Sign up
    static async signUp(dataUser: { fullName: string, gmail: string, password: string, confirmPassword: string }) {
        const loading = toast.loading("Đang tạo tài khoản...")
        try {
            const { fullName, gmail, password, confirmPassword } = dataUser

            if (fullName && gmail && password && confirmPassword && password === confirmPassword) {
                const { status } = await api.post("auth/signup", { fullname: fullName, email: gmail, password })

                if (status === 201) {
                    toast.success("Tài khoản đã được tạo! Vui lòng kiểm tra gmail")
                    return true
                }
            }

            toast.error("Thất bại!")
            return false

        } catch (error) {
            console.error(error)
            toast.error("Thất bại!")
            return false
        } finally {
            toast.dismiss(loading)
        }
    }
}