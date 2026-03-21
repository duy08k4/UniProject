// Gate way
import { toast } from "sonner"
import api from "../../config/gateway"
import errorCatch from "../../config/errorCatch"
import apiPath from "../path"

// Type
import type { SignInResponse } from "./auth.type"
import { store } from "../../redux/store"
import { updateUser } from "../../redux/reducers/authSlice.reducer"

export class AuthService {
    // Sign up
    static async signUp(dataUser: { fullName: string, gmail: string, password: string, confirmPassword: string }) {
        const loading = toast.loading("Đang tạo tài khoản...")
        try {
            const { fullName, gmail, password, confirmPassword } = dataUser

            if (fullName && gmail && password && confirmPassword && password === confirmPassword) {
                const { status } = await api.post(apiPath.auth.signUp, { fullname: fullName, email: gmail, password })

                if (status >= 200 && status < 300) {
                    toast.success("Tài khoản đã được tạo! Vui lòng kiểm tra gmail")
                    return true
                }

            } else {
                toast.error("Vui lòng cung cấp thông tin tài khoản")
                return false
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Sign in
    static async signIn(dataUser: { email: string, password: string }) {
        const loading = toast.loading('Đang xác thực người dùng...')

        try {
            const { email, password } = dataUser

            if (email && password) {
                const { data, status } = await api.post<SignInResponse>(apiPath.auth.signIn, { email, password })

                if (status >= 200 && status < 300) {
                    store.dispatch(updateUser(data.data))
                    toast.success("Đăng nhập thành công")
                    
                    return data.data.role === "uniadmin" ? "/super-admin/overview" : "/main"
                }
                
            } else {
                toast.error("Vui lòng cung cấp thông tin đăng nhập")
                return false
            }

        } catch (error) {
            errorCatch(error)
            return false
        } finally {
            toast.dismiss(loading)
        }
    }
}