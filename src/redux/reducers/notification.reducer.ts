import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NotificationDetail, NotificationPagination } from "../../services/notifications/notifications.type";

// Reducer
export interface NotificationSlice {
    notificationPagination: NotificationPagination | null,
    currentNotification: NotificationDetail | null
}

const initialState: NotificationSlice = {
    notificationPagination: null,
    currentNotification: null
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        resetAllStateNotification: (state) => {
            state = initialState
        },

        setNotificationPagination: (state, action: PayloadAction<NotificationPagination | null>) => {
            state.notificationPagination = action.payload
        },

        updateNotification: (state, action: PayloadAction<NotificationDetail>) => {

            if (!state.notificationPagination) return

            const notification = action.payload

            const filterdNotification: NotificationDetail[] = state.notificationPagination.data.filter(n => n.id != notification.id)

            state.notificationPagination = {
                data: [notification, ...filterdNotification],
                pagination: state.notificationPagination.pagination,
            }
        },

        removeNotification: (state, action: PayloadAction<{ ids: string[] }>) => {
            const idsList = action.payload.ids
            if (!state.notificationPagination) return
            if (idsList.length === 0) return

            const filterdNotification = state.notificationPagination?.data.filter(n => !idsList.includes(n.id))

            state.notificationPagination = {
                data: [...filterdNotification],
                pagination: state.notificationPagination.pagination,
            }
        },

        setCurrentNotification: (state, action: PayloadAction<NotificationDetail | null>) => {
            state.currentNotification = action.payload
        }
    }
})

export const {
    resetAllStateNotification,
    setNotificationPagination,
    updateNotification,
    removeNotification,
    setCurrentNotification

} = notificationSlice.actions

export default notificationSlice.reducer