import { useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { ClassService } from "../../services/class/class.service"

const ClassContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { classId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const currentClass = useSelector((state: RootState) => state.class.currentClass)
    const userData = useSelector((state: RootState) => state.auth.user.info)

    useEffect(() => {
        if (!userData.id || !currentClass.info.id) return
        const pathName = location.pathname
        if (!pathName.includes(currentClass.info.user.role)) {
            navigate(`/main/${currentClass.info.user.role}/class/${classId}`)
        }
    }, [userData.id, currentClass, location.pathname])

    useEffect(() => {
        if (!classId || currentClass.info?.id === classId) return
        (async () => {
            const result = await ClassService.getClass(classId)
            if (!result) navigate("/main")
            if (result) {
                const memberInClass = result.user

                if (!memberInClass.role) navigate("/main")
            }
        })()

    }, [classId, userData.id])

    return <>{children}</>
}

export default ClassContextProvider