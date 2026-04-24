import { io } from "socket.io-client"
import { store } from "../redux/store"
import { removeNotification, updateNotification } from "../redux/reducers/notification.reducer"
import { updateNotificationInCurrentMilestone, removeNotificationFromCurrentMilestone } from "../redux/reducers/progressSlice.reducer"
import NotificationsService from "../services/notifications/notifications.service"

const socket = io(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL}/notification`)

export const notificationSocketEventName = {
    OnUpdateNotification: "update-notification",
    OnRemoveNotification: "remove-notification"
}

export class NotificationGateway {
    static connect() {
        if (!socket.connected) {
            socket.connect()
        }
    }

    // Update and create notification
    static OnUpdateNotification() {
        socket.on(notificationSocketEventName.OnUpdateNotification, async (data: { notificationId: string, classId: string }) => {
            const { notificationId, classId } = data
            const currentClassInfo = store.getState().class.currentClass.info
            
            if (!notificationId || !classId || currentClassInfo.id !== classId) return
            const notification = await NotificationsService.getOneNotification(notificationId)
            
            if (notification) {
                store.dispatch(updateNotification(notification))

                const currentMilestone = store.getState().progress.currentMilestone
                if (currentMilestone && notification.milestone?.id === currentMilestone.id) {
                    store.dispatch(updateNotificationInCurrentMilestone({
                        id: notification.id,
                        title: notification.title,
                        body: notification.body,
                        created_at: notification.created_at,
                        updated_at: notification.updated_at,
                        createdBy: notification.createdBy as any
                    }))
                }
            }
        })
    }
    
    static OnRemoveNotification() {
        socket.on(notificationSocketEventName.OnRemoveNotification, (data: { notificationId: string, classId: string }) => {
            const { notificationId, classId } = data
            const currentClassInfo = store.getState().class.currentClass.info
            
            if (!notificationId || !classId || currentClassInfo.id !== classId) return

            store.dispatch(removeNotification({ ids: [notificationId] }))
            store.dispatch(removeNotificationFromCurrentMilestone(notificationId))
        })
    }

    // Remove notification

    static disconnect() {
        if (socket.connected) {
            socket.disconnect()
        }
    }

    // Main connect

    static off(event: string) {
        socket.off(event)
    }
}