import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Reducer
export interface Usecase {
    id: string,
    module: string,
    uc_name: string,
    uc_key: string,
    priority: string
}

export interface Permission {
    id: string,
    role: string,
    can_view: boolean,
    can_create: boolean,
    can_edit: boolean,
    can_delete: boolean,
    can_approve: boolean,
    usecase: {
        id: string,
        module: string,
        uc_key: string,
        uc_name: string,
        priority: string
    }
}

export interface AdminSlice {
    usecase: Usecase[],
    selectedUsecasePermission: Permission[]
}

const initialState: AdminSlice = {
    usecase: [],
    selectedUsecasePermission: []
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        // Add usecase
        addUsecase: (state, action: PayloadAction<Usecase>) => {
            state.usecase.unshift(action.payload)
        },

        // Update usecase
        updateUsecases: (state, action: PayloadAction<AdminSlice["usecase"]>) => {
            const usecase = action.payload
            state.usecase = usecase
        },

        // Remove usecase
        removeUsecase: (state, action: PayloadAction<string>) => {
            state.usecase = state.usecase.filter(uc => uc.id !== action.payload)
        },

        // Set selected permission
        setSelectedPermission: (state, action: PayloadAction<Permission[]>) => {
            const isPermission = action.payload && Object.keys(action.payload).length > 0 && true
            if (isPermission) state.selectedUsecasePermission = action.payload
        }
    }
})

export const {
    addUsecase,
    updateUsecases,
    removeUsecase,
    setSelectedPermission
} = adminSlice.actions

export default adminSlice.reducer