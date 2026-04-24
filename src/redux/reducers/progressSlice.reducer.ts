import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MilestoneDetail, ProgressDeatil, ProgressDeatilPagination, ProgressPagination, UpdateMilestone } from "../../services/progress/progress.type";

// Reducer
export interface ProgressSlice {
    progressPagination: ProgressPagination | null,
    currentProgress: ProgressDeatil | null,
    currentMilestone: MilestoneDetail | null
}

const initialState: ProgressSlice = {
    progressPagination: null,
    currentProgress: null,
    currentMilestone: null
}

export const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        resetAllStateProgress: (state) => {
            state = initialState
        },

        // Progress
        setProgressPaginationData: (state, action: PayloadAction<ProgressPagination | null>) => {
            state.progressPagination = action.payload
        },

        updateProgressInPagination: (state, action: PayloadAction<ProgressDeatilPagination>) => {

            const progressPagination = state.progressPagination
            if (!progressPagination) return

            const progressUpdate = action.payload
            const progressIndex = progressPagination.data.findIndex(p => p.id === progressUpdate.id)

            if (progressIndex >= 0) {
                progressPagination.data[progressIndex] = progressUpdate
            }
        },

        setCurrentProgress: (state, action: PayloadAction<ProgressDeatil | null>) => {
            state.currentProgress = action.payload
        },

        // Milestone
        setCurrentMilestone: (state, action: PayloadAction<MilestoneDetail | null>) => {
            state.currentMilestone = action.payload
        },

        updateMilestone: (state, action: PayloadAction<UpdateMilestone>) => {
            if (state.currentProgress) {
                const dataUpdate = action.payload
                const milestoneList = [...dataUpdate.added, ...dataUpdate.updated].sort((a, b) => a.index - b.index)

                state.currentProgress.milestones = milestoneList
            }
        },

        removeMilestone: (state, action: PayloadAction<{ ids: string[] }>) => {
            const removedIds = action.payload.ids
            if (removedIds.length > 0 && state.currentProgress) {
                const newMilestoneList = state.currentProgress.milestones.filter(m => !removedIds.includes(m.id))

                state.currentProgress.milestones = newMilestoneList
            }
        },

        // Forms in Milestone
        addFormToCurrentMilestone: (state, action: PayloadAction<MilestoneDetail['forms'][0]>) => {
            if (state.currentMilestone) {
                state.currentMilestone.forms.push(action.payload)
            }
        },

        updateFormInCurrentMilestone: (state, action: PayloadAction<MilestoneDetail['forms'][0]>) => {
            if (state.currentMilestone) {
                const idx = state.currentMilestone.forms.findIndex(f => f.id === action.payload.id)
                if (idx >= 0) state.currentMilestone.forms[idx] = action.payload
            }
        },

        removeFormsFromCurrentMilestone: (state, action: PayloadAction<string[]>) => {
            if (state.currentMilestone) {
                state.currentMilestone.forms = state.currentMilestone.forms.filter(f => !action.payload.includes(f.id))
            }
        },

        // Notifications in Milestone
        updateNotificationInCurrentMilestone: (state, action: PayloadAction<MilestoneDetail['notifications'][0]>) => {
            if (!state.currentMilestone) return
            const idx = state.currentMilestone.notifications.findIndex(n => n.id === action.payload.id)
            if (idx >= 0) {
                state.currentMilestone.notifications[idx] = action.payload
            } else {
                state.currentMilestone.notifications.unshift(action.payload)
            }
        },

        removeNotificationFromCurrentMilestone: (state, action: PayloadAction<string>) => {
            if (state.currentMilestone) {
                state.currentMilestone.notifications = state.currentMilestone.notifications.filter(n => n.id !== action.payload)
            }
        }
    }
})

export const {
    resetAllStateProgress,

    // Progress
    setProgressPaginationData,
    updateProgressInPagination,
    setCurrentProgress,

    // Milestone
    setCurrentMilestone,
    updateMilestone,
    removeMilestone,

    // Forms in Milestone
    addFormToCurrentMilestone,
    updateFormInCurrentMilestone,
    removeFormsFromCurrentMilestone,

    // Notifications in Milestone
    updateNotificationInCurrentMilestone,
    removeNotificationFromCurrentMilestone
} = progressSlice.actions

export default progressSlice.reducer
