import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { useEffect, useState } from "react"
import { AuthService } from "../../services/auth/auth.service"
import { useLocation, useNavigate } from "react-router-dom"

const SessionChecker = () => {
    // Redux
    const isAuth = useSelector((state: RootState) => state.auth.user.auth)
    const user = useSelector((state: RootState) => state.auth.user.info)
    const [isAuthCheck, setIsAuthCheck] = useState<boolean>(false)
    const navigate = useNavigate()
    const path = useLocation()

    useEffect(() => {
        (async () => {
            await AuthService.authUser().finally(() => { setIsAuthCheck(true) })
        })()
    }, [])

    useEffect(() => {
        if (!isAuthCheck) return
        const recentPath = path.pathname

        if (isAuth) {
            if (recentPath === "/" || recentPath === "/projects") return

            if (
                (!recentPath.includes("/main") || !recentPath.includes("/main")) ||
                (user.role === "user" && path.pathname.includes("/super-admin"))
            ) {
                navigate('/main')
            }
        } else {
            if (recentPath.includes("/main") || recentPath.includes("/super-admin")) navigate('/')
        }

    }, [isAuth, path.pathname, isAuthCheck])

    return null
}

export default SessionChecker