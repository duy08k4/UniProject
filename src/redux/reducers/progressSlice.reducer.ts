import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProgressDeatil, ProgressDeatilPagination, ProgressPagination, UpdateMilestone } from "../../services/progress/progress.type";

// Reducer
export interface ProgressSlice {
    progressPagination: ProgressPagination | null,
    currentProgress: ProgressDeatil | null
}

const initialState: ProgressSlice = {
    progressPagination: null,
    currentProgress: null,
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
    updateMilestone,
    removeMilestone
} = progressSlice.actions

export default progressSlice.reducer
