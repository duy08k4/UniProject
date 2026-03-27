import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { ClassService } from "../../services/class/class.service"

const ClassContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { classId } = useParams()
    const currentClass = useSelector((state: RootState) => state.class.currentClass)
    const userData = useSelector((state: RootState) => state.auth.user.info)

    useEffect(() => {
        if (!classId || currentClass.info?.id === classId) return
        (async () => {
            await ClassService.getClass(classId)
        })()

    }, [classId, userData.id])

    return <>{children}</>
}

export default ClassContextProvider