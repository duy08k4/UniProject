// Gate way
import { toast } from "sonner"
import api from "../../config/gateway"
import errorCatch from "../../config/errorCatch"
import apiPath from "../path"

// Type
import type { SignInResponse } from "./auth.type"
import { store } from "../../redux/store"
import { updateUser } from "../../redux/reducers/authSlice.reducer"
import type { AxiosError } from "axios"

export class AuthService {
    // Sign up
    static async signUp(dataUser: { fullName: string, gmail: string, password: string, confirmPassword: string }) {
        let loading
        try {
            const { fullName, gmail, password, confirmPassword } = dataUser

            loading = toast.loading("Đang tạo tài khoản...")
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
        let loading

        try {
            const { email, password } = dataUser

            loading = toast.loading('Đang xác thực người dùng...')
            if (email && password) {
                const { data, status } = await api.post<SignInResponse>(apiPath.auth.signIn, { email, password })

                if (status >= 200 && status < 300) {
                    store.dispatch(updateUser(data.data))
                    localStorage.setItem("hasLogin", "true");                    
                    return data.data.role === "uniadmin" ? "/super-admin" : "/main"
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

    // Sign out
    static async signOut () {
        let loading
        try {
            loading = toast.loading('Đang xử lý...')
            const { status } = await api.get(apiPath.auth.signOut)

            if (status >= 200 && status <300) {
                toast.success("Đã thoát tài khoản")
                store.dispatch(updateUser(null))
                return true
            }

        } catch (error) {
            const errorStatus = (error as AxiosError).status
            if (errorStatus === 401 || errorStatus === 403) {
                store.dispatch(updateUser(null))
                return true
            }

            errorCatch(error, {
                401: { message: 'Đã thoát tài khoản', type: "success" },
                403: { message: 'Đã thoát tài khoản', type: "success" }
            })
            return false
        } finally {
            toast.dismiss(loading)
        }
    }

    // Session check - Check user session when they return to the website if they haven't signed out
    static async authUser () {
        let loading
        
        try {
            loading = toast.loading('Đang kiểm tra phiên đăng nhập')
            const { status, data } = await api.get<SignInResponse["data"]>(apiPath.auth.authUser, {
                params: {
                    isUserData: true
                }
            })

            if (status >= 200 && status < 300) {
                store.dispatch(updateUser(data))
                return true
            }
        } catch (error) {
            const errorStatus = (error as AxiosError).status
            if (errorStatus === 401 && localStorage.getItem("hasLogin")) toast.info("Phiên đăng nhập hết hạn")
            return false
        } finally {
            toast.dismiss(loading)
        }
    }
}