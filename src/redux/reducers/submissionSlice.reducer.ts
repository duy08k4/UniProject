import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SubmissionPaginationType, UpdateSubmissionResponse } from "../../services/submission/submission.type";

export interface SubmissionSlice {
    currentSubmission: UpdateSubmissionResponse | null
    submissionPagination: SubmissionPaginationType | null
}

const initialState: SubmissionSlice = {
    currentSubmission: null,
    submissionPagination: null,
}

export const submissionSlice = createSlice({
    name: 'submission',
    initialState,
    reducers: {
        setCurrentSubmission: (state, action: PayloadAction<UpdateSubmissionResponse | null>) => {
            state.currentSubmission = action.payload
        },
        setSubmissionPagination: (state, action: PayloadAction<SubmissionPaginationType | null>) => {
            state.submissionPagination = action.payload
        },
    }
})

export const { setCurrentSubmission, setSubmissionPagination } = submissionSlice.actions
export default submissionSlice.reducer