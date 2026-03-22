import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"

const SessionChecker = () => {
    // Redux
    const isAuth = useSelector((state: RootState) => state.auth.user.auth)
    
    return null
}