import { io } from "socket.io-client"
import { store } from "../redux/store"
import { updateTopicInLecturerList, setMyTopicAsStudent } from "../redux/reducers/topicsSlice.reducer"
import TopicsService from "../services/topics/topics.service"

const socket = io(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL}/topics`)

export const topicsSocketEventName = {
    OnTopicUpdated: "topic-updated",
}

export class TopicsGateway {
    static connect() {
        if (!socket.connected) socket.connect()
    }

    static OnTopicUpdated() {
        socket.on(topicsSocketEventName.OnTopicUpdated, async (data: { topicId: string, classId: string }) => {
            const { topicId, classId } = data
            if (!topicId || !classId) return

            const currentClassId = store.getState().class.currentClass.info.id
            if (currentClassId !== classId) return

            const topic = await TopicsService.getOneTopic(topicId)
            if (!topic) return

            const userId = store.getState().auth.user.info.id

            // Lecturer: cập nhật vào danh sách nếu mình là supervisor hoặc reviewer
            if (topic.supervisor?.id === userId || topic.reviewer?.id === userId) {
                store.dispatch(updateTopicInLecturerList(topic))
            }

            // Student: cập nhật nếu mình là chủ topic
            if (topic.student?.id === userId) {
                store.dispatch(setMyTopicAsStudent(topic))
            }
        })
    }

    static disconnect() {
        if (socket.connected) socket.disconnect()
    }

    static off(event: string) {
        socket.off(event)
    }
}
