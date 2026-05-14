import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { useEffect, useState } from "react"
import { AuthService } from "../../services/auth/auth.service"
import { useLocation, useNavigate } from "react-router-dom"
import { changeStateFetching } from "../../redux/reducers/global.reducer"

const SessionChecker = () => {
    // Redux
    const isAuth = useSelector((state: RootState) => state.auth.user.auth)
    const user = useSelector((state: RootState) => state.auth.user.info)
    const [isAuthCheck, setIsAuthCheck] = useState<boolean>(false)
    const navigate = useNavigate()
    const path = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {
        (async () => {
            dispatch(changeStateFetching(true))
            await AuthService.authUser().finally(() => {
                setIsAuthCheck(true)
                dispatch(changeStateFetching(false))
            })
        })()
    }, [])

    useEffect(() => {
        if (!isAuthCheck) return

        const pathName = path.pathname

        if (isAuth) {
            if (pathName === "/" || pathName === "/projects") return

            switch (user.role) {
                case "uniadmin":
                    if (pathName.startsWith("/super-admin")) return
                    navigate("/super-admin")
                    break;

                default:
                    if (pathName.startsWith("/main")) return
                    navigate("/main")
                    break;
            }
        } else {
            if (pathName.startsWith("/super-admin") || pathName.startsWith("/main")) navigate("/")
        }

    }, [isAuth, path.pathname, isAuthCheck])

    return null
}

export default SessionChecker