import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ThesisItem, ThesisPagination } from "../../services/public/public.type"

interface ThesisSlice {
    thesisList: ThesisItem[]
    pagination: {
        page: number
        size: number
        total: number
        totalPage: number
    }
    currentThesis: ThesisItem | null
}

const initialState: ThesisSlice = {
    thesisList: [],
    pagination: { page: 1, size: 10, total: 0, totalPage: 0 },
    currentThesis: null
}

export const thesisSlice = createSlice({
    name: 'thesis',
    initialState,
    reducers: {
        setThesisList: (state, action: PayloadAction<ThesisPagination>) => {
            state.thesisList = action.payload.data
            state.pagination = action.payload.pagination
        },
        setCurrentThesis: (state, action: PayloadAction<ThesisItem | null>) => {
            state.currentThesis = action.payload
        }
    }
})

export const { setThesisList, setCurrentThesis } = thesisSlice.actions
export default thesisSlice.reducer
