import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { TopicDetail } from "../../services/topics/topics.type"

interface TopicsSlice {
    // Lecturer: danh sách topics mà mình là supervisor
    myTopicsAsLecturer: TopicDetail[]
    // Student: topic của mình
    myTopicAsStudent: TopicDetail | null
}

const initialState: TopicsSlice = {
    myTopicsAsLecturer: [],
    myTopicAsStudent: null,
}

export const topicsSlice = createSlice({
    name: 'topics',
    initialState,
    reducers: {
        setMyTopicsAsLecturer: (state, action: PayloadAction<TopicDetail[]>) => {
            state.myTopicsAsLecturer = action.payload
        },
        updateTopicInLecturerList: (state, action: PayloadAction<TopicDetail>) => {
            const idx = state.myTopicsAsLecturer.findIndex(t => t.id === action.payload.id)
            if (idx >= 0) {
                state.myTopicsAsLecturer[idx] = action.payload
            } else {
                state.myTopicsAsLecturer.unshift(action.payload)
            }
        },
        setMyTopicAsStudent: (state, action: PayloadAction<TopicDetail | null>) => {
            state.myTopicAsStudent = action.payload
        },
    }
})

export const { setMyTopicsAsLecturer, updateTopicInLecturerList, setMyTopicAsStudent } = topicsSlice.actions
export default topicsSlice.reducer
