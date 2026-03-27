import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Reducer
export interface GlobalSlice {
    isFetching: boolean
}

const initialState: GlobalSlice = {
    isFetching: false
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        changeStateFetching: (state, action: PayloadAction<boolean>) => {
            if (state.isFetching != action.payload) {
                state.isFetching = action.payload
            }
        }
    }
})

export const {
    changeStateFetching
} = globalSlice.actions

export default globalSlice.reducer