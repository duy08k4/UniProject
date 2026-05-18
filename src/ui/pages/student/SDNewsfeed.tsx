import type React from "react"
import { useEffect,  } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import type { RootState } from "../../../redux/store"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import NotificationsService from "../../../services/notifications/notifications.service"
import NotificationCard from "../../components/NotificationCard"
import { RoomRole } from "../../../config/enum"

const SDNewsfeed: React.FC = () => {
    const { classId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const classData = useSelector((state: RootState) => state.class.currentClass)
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const notification = useSelector((state: RootState) => state.notification.notificationPagination)


    const roomRole = classData?.info?.user?.role ?? RoomRole.STUDENT
    const basePath = roomRole === RoomRole.LECTURER
        ? `/main/lecturer/class/${classId}`
        : `/main/student/class/${classId}`

    useEffect(() => {
        if (!classId || !userData) return
        (async () => {
            dispatch(changeStateFetching(true))
            // if (!progress || progress.class?.id !== classId) await ProgressService.getProgressDetail(classId)

            await NotificationsService.notificationPagination(classId, 1, 200)
            dispatch(changeStateFetching(false))
        })()

    }, [classId, userData.id])

    return (
        <div className="w-full h-fit flex flex-col gap-5 pt-topPadding pb-20">
            <h2 className="text-largeSize font-bold dark:text-white uppercase">Bảng tin</h2>

            <div className="flex flex-col gap-8 items-center-safe w-full">
                {notification && notification.data.length === 0 && (
                    <p className="text-gray italic">Chưa có thông báo nào.</p>
                )}

                {notification && notification.data.map(n => (
                    <div key={n.id} className="w-3/5 max-2xl:w-3/4 max-lg:w-full">
                        <NotificationCard
                            notification={n}
                            onFormClick={(formId) => navigate(`${basePath}/forms`, { state: { openFormId: formId } })}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SDNewsfeed
