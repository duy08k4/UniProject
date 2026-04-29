import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UpdateSubmissionResponse } from "../../services/submission/submission.type";

// Reducer
export interface SubmissionSlice {
    currentSubmission: UpdateSubmissionResponse | null
}

const initialState: SubmissionSlice = {
    currentSubmission: null

}

export const submissionSlice = createSlice({
    name: 'submission',
    initialState,
    reducers: {
        setCurrentSubmission: (state, action: PayloadAction<UpdateSubmissionResponse | null>) => {
            state.currentSubmission = action.payload
        }
    }
})

export const {
    setCurrentSubmission
} = submissionSlice.actions

export default submissionSlice.reducer