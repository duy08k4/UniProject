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
        resetAllStateProgress: (state) => {
            state = initialState
        },

        setFormPagination: (state, action: PayloadAction<FormPaginationType | null>) => {
            state.formPagination = action.payload
        },

        setCurrentForm: (state, action: PayloadAction<DetailForm | null>) => {
            state.currentForm = action.payload
        }
    }
})

export const {
    resetAllStateProgress,
    setFormPagination,
    setCurrentForm

} = formSlice.actions

export default formSlice.reducer
