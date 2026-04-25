import { io } from "socket.io-client"
import { store } from "../redux/store"
import {
    updateScoreFormIsStopped,
    clearCurrentScoreFormIfDeleted,
    updateCell
} from "../redux/reducers/scoreformSlice.reducer"
import { toast } from "sonner"
import ScoreFormsService from "../services/scoreforms/scoreforms.service"

const socket = io(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL}/scoreforms`)

export const scoreFormsSocketEventName = {
    OnToggleStop: "toggle-stop",
    OnScoreFormSaved: "score-form-saved",
    OnScoreFormDeleted: "score-form-deleted",
    OnCellUpdated: "cell-updated"
}

export class ScoreFormsGateway {
    static connect() {
        if (!socket.connected) socket.connect()
    }

    static OnToggleStop() {
        socket.on(scoreFormsSocketEventName.OnToggleStop, (data: { scoreFormId: string; is_stopped: boolean }) => {
            const { scoreFormId, is_stopped } = data
            if (!scoreFormId || typeof is_stopped !== "boolean") return

            store.dispatch(updateScoreFormIsStopped({ scoreFormId, is_stopped }))
            toast.info(`Bảng điểm đã được ${is_stopped ? "khóa" : "mở"}.`)
        })
    }

    static OnScoreFormSaved() {
        socket.on(scoreFormsSocketEventName.OnScoreFormSaved, async (data: { scoreFormId: string }) => {
            const { scoreFormId } = data
            const currentScoreForm = store.getState().scoreForm.currentScoreForm
            if (currentScoreForm?.id === scoreFormId) {
                await ScoreFormsService.getScoreFormDetail(scoreFormId)
            }
        })
    }

    static OnScoreFormDeleted() {
        socket.on(scoreFormsSocketEventName.OnScoreFormDeleted, (data: { scoreFormIds: string[] }) => {
            const { scoreFormIds } = data
            const currentScoreForm = store.getState().scoreForm.currentScoreForm
            if (currentScoreForm && scoreFormIds.includes(currentScoreForm.id)) {
                toast.warning("Bảng điểm bạn đang xem đã bị xóa.", { duration: 30000 })
            }
            store.dispatch(clearCurrentScoreFormIfDeleted(scoreFormIds))
        })
    }

    static OnCellUpdated() {
        socket.on(scoreFormsSocketEventName.OnCellUpdated, (data: { scoreFormId: string; cell: any }) => {
            const { scoreFormId, cell } = data
            const currentScoreForm = store.getState().scoreForm.currentScoreForm
            if (currentScoreForm?.id !== scoreFormId) return

            console.log(cell)

            store.dispatch(updateCell({
                cellId: cell.id,
                value: cell.value
            }))
        })
    }

    static disconnect() {
        if (socket.connected) socket.disconnect()
    }

    static off(event: string) {
        socket.off(event)
    }
}
