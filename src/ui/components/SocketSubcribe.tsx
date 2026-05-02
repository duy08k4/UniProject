import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { GlobalGateway, globalSocketEventName } from "../../websocket/global.gateway"
import { ClassGateway, classSocketEventName } from "../../websocket/class.gateway"
import { NotificationGateway, notificationSocketEventName } from "../../websocket/notification.gateway"
import { ProgressGateway, progressSocketEventName } from "../../websocket/progress.gateway"
import { FormsGateway, formsSocketEventName } from "../../websocket/forms.gateway"
import { ScoreFormsGateway, scoreFormsSocketEventName } from "../../websocket/scoreforms.gateway"

const SocketSubcriber = () => {
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const auth = useSelector((state: RootState) => state.auth.user.auth)

    useEffect(() => {
        if (!userData.id || !auth) return

        GlobalGateway.OnApproveMember()
        GlobalGateway.OnNewMember()
        GlobalGateway.OnCreateNewClass()
        GlobalGateway.OnUpdateClassStatus()

        ClassGateway.OnSuspendMemberFromClass()
        ClassGateway.OnLeaveTheClass()
        ClassGateway.OnDissolveClass()
        ClassGateway.OnUpdateMemberData()
        ClassGateway.OnRemoveClass()

        ProgressGateway.OnUpdateProgress()

        NotificationGateway.OnUpdateNotification()
        NotificationGateway.OnRemoveNotification()

        FormsGateway.OnToggleStop()
        FormsGateway.OnFormSaved()
        FormsGateway.OnFormDeleted()

        ScoreFormsGateway.OnToggleStop()
        ScoreFormsGateway.OnScoreFormSaved()
        ScoreFormsGateway.OnScoreFormDeleted()
        ScoreFormsGateway.OnCellUpdated()
        ScoreFormsGateway.OnScoreFormApproved()

        return () => {
            GlobalGateway.off(globalSocketEventName.OnApproveMember)
            GlobalGateway.off(globalSocketEventName.OnNewMember)
            GlobalGateway.off(globalSocketEventName.OnCreateNewClass)
            GlobalGateway.off(globalSocketEventName.OnUpdateClassStatus)

            ClassGateway.off(classSocketEventName.OnSuspendMemberFromClass)
            ClassGateway.off(classSocketEventName.OnLeaveTheClass)
            ClassGateway.off(classSocketEventName.OnDissolveClass)
            ClassGateway.off(classSocketEventName.OnUpdateMemberData)
            ClassGateway.off(classSocketEventName.OnRemoveClass)

            ProgressGateway.off(progressSocketEventName.OnUpdateProgress)

            NotificationGateway.off(notificationSocketEventName.OnUpdateNotification)
            NotificationGateway.off(notificationSocketEventName.OnRemoveNotification)

            FormsGateway.off(formsSocketEventName.OnToggleStop)
            FormsGateway.off(formsSocketEventName.OnFormSaved)
            FormsGateway.off(formsSocketEventName.OnFormDeleted)

            ScoreFormsGateway.off(scoreFormsSocketEventName.OnToggleStop)
            ScoreFormsGateway.off(scoreFormsSocketEventName.OnScoreFormSaved)
            ScoreFormsGateway.off(scoreFormsSocketEventName.OnScoreFormDeleted)
            ScoreFormsGateway.off(scoreFormsSocketEventName.OnCellUpdated)
            ScoreFormsGateway.off(scoreFormsSocketEventName.OnScoreFormApproved)
        }
    }, [userData.id])

    return null
}

export default SocketSubcriber