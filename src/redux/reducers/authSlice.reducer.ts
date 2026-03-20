import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SignInResponse } from "../../services/auth/auth.type";

// Reducer
export interface AuthSlice {
    user: {
        info: {
            id: string | null,
            email: string | null,
            full_name: string | null,
            role: string | null
        },
        auth: boolean
    }
}

const initialState: AuthSlice = {
    user: {
        info: {
            id: "",
            email: "",
            full_name: "",
            role: ""
        },
        auth: false
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Update user data
        updateUser: (state, action: PayloadAction<SignInResponse["data"]>) => {
            state.user = {
                info: action.payload,
                auth: action.payload.id ? true : false
            }
        }
    }
})

export const {
    updateUser
} = authSlice.actions

export default authSlice.reducer