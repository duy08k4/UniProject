import { io } from "socket.io-client"
import { store } from "../redux/store"
import { setCurrentProgress, updateProgressInPagination } from "../redux/reducers/progressSlice.reducer"
import { Role } from "../config/enum"
import ProgressService from "../services/progress/progress.service"

const socket = io(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL}/progress`)

export const progressSocketEventName = {
    OnUpdateProgress: "update-progress"
}

export class ProgressGateway {
    static connect() {
        if (!socket.connected) {
            socket.connect()
        }
    }

    // Update progress
    static OnUpdateProgress() {
        socket.on(progressSocketEventName.OnUpdateProgress, async (data: { classId: string }) => {
            const { classId } = data

            if (!classId) return

            const progress = await ProgressService.getProgressDetail(classId)
            if (!progress) return

            const client = store.getState().auth.user.info

            // Check role
            if (client.role === Role.UNIADMIN) {
                const progressPagination = store.getState().progress.progressPagination
                if (!progressPagination) return

                store.dispatch(updateProgressInPagination({
                    ...progress,
                    milestones: progress.milestones.length
                }))
            }

            const currentClass = store.getState().class.currentClass.info
            const currentProgress = store.getState().progress.currentProgress

            if (!currentClass || currentClass.id !== classId || !currentProgress || currentProgress.id !== progress.id) return

            store.dispatch(setCurrentProgress(progress))

        })
    }



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