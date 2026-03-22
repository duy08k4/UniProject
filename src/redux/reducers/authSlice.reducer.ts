import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SignInResponse } from "../../services/auth/auth.type";

// Reducer
export interface AuthSlice {
    user: {
        info: {
            id: string | null,
            supabase_id: string | null,
            full_name: string | null,
            email: string | null,
            is_banned: boolean,
            is_deleted: boolean,
            role: string | null,
            phone_number: string | null,
            created_at: string | null,
            updated_at: string | null
        },
        auth: boolean,
        sessionCheck: boolean
    }
}

const initialState: AuthSlice = {
    user: {
        info: {
            id: "",
            supabase_id: "",
            full_name: "",
            email: "",
            is_banned: false,
            is_deleted: false,
            role: "",
            phone_number: "",
            created_at: "",
            updated_at: ""
        },
        auth: false,
        sessionCheck: false
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Update user data
        updateUser: (state, action: PayloadAction<SignInResponse["data"] | null>) => {
            if (action.payload) {
                state.user = {
                    info: action.payload,
                    auth: action.payload.id ? true : false,
                    sessionCheck: true
                }
            } else {
                state.user = {
                    info: {
                        id: "",
                        supabase_id: "",
                        full_name: "",
                        email: "",
                        is_banned: false,
                        is_deleted: false,
                        role: "",
                        phone_number: "",
                        created_at: "",
                        updated_at: ""
                    },
                    auth: false,
                    sessionCheck: false
                }
            }
        }
    }
})

export const {
    updateUser
} = authSlice.actions

export default authSlice.reducer