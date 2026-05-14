import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DetailForm, FormPaginationType } from "../../services/forms/forms.type";

// Reducer
export interface FormSlice {
    formPagination: FormPaginationType | null,
    currentForm: DetailForm | null
}

const initialState: FormSlice = {
    formPagination: null,
    currentForm: null
}

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        resetAllStateProgress: () => initialState,

        setFormPagination: (state, action: PayloadAction<FormPaginationType | null>) => {
            state.formPagination = action.payload
        },

        setCurrentForm: (state, action: PayloadAction<DetailForm | null>) => {
            state.currentForm = action.payload
        },

        removeFormFromPagination: (state, action: PayloadAction<string>) => {
            if (state.formPagination) {
                state.formPagination.data = state.formPagination.data.filter(f => f.id !== action.payload)
            }
        },

        updateFormIsStopped: (state, action: PayloadAction<{ formId: string; is_stopped: boolean }>) => {
            const { formId, is_stopped } = action.payload
            if (state.currentForm?.id === formId) state.currentForm.is_stopped = is_stopped
            if (state.formPagination) {
                const f = state.formPagination.data.find(f => f.id === formId)
                if (f) f.is_stopped = is_stopped
            }
        },

        updateCurrentFormData: (state, action: PayloadAction<DetailForm>) => {
            if (state.currentForm?.id === action.payload.id) state.currentForm = action.payload
        },

        clearCurrentFormIfDeleted: (state, action: PayloadAction<string[]>) => {
            if (state.currentForm && action.payload.includes(state.currentForm.id)) state.currentForm = null
        }
    }
})

export const {
    resetAllStateProgress,
    setFormPagination,
    setCurrentForm,
    removeFormFromPagination,
    updateFormIsStopped,
    updateCurrentFormData,
    clearCurrentFormIfDeleted
} = formSlice.actions

export default formSlice.reducer
