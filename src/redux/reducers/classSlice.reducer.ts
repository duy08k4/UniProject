import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ClassPagination, CreateNewClass, Members, Pagination } from "../../services/class/class.type";
import { sizePage } from "../../services/class/class.service";

// Reducer

export interface ClassSlice {
    classList: CreateNewClass[],
    pagination: Pagination,
    currentClass: {
        info: CreateNewClass,
        members: Members[] | []
    }
}

const initialState: ClassSlice = {
    classList: [],
    pagination: {
        page: 0,
        size: sizePage,
        total_classes: 0,
        totalPage: 0
    },
    currentClass: {
        info: {
            id: "",
            join_code: "",
            label: "",
            description: "",
            subject: "",
            created_approval: false,
            required_approval: false,
            required_join_form: false,
            is_deleted: false,
            is_banned: false,
            created_at: "",
            updated_at: "",
            roleClass: "",
            createdBy: {
                id: "",
                full_name: "",
                email: "",
                role: "",
            },
            counts: {
                student: "",
                lecturer: "",
                committee: "",
                pending: ""
            },
            owner: {
                full_name: "",
                email: "",
            }
        },
        members: []
    }
}

export const classSlice = createSlice({
    name: 'class',
    initialState,
    reducers: {
        // Add class
        addClass: (state, action: PayloadAction<CreateNewClass>) => {
            state.classList.unshift(action.payload)
        },

        // Set class list
        setClassList: (state, action: PayloadAction<ClassPagination>) => {
            if (action.payload.data) {
                state.classList = action.payload.data
                state.pagination = action.payload.pagination
            }
        },


        // Recent class ------------------------------------------------------------
        // Get info class
        currentClass_UpdateInfo: (state, action: PayloadAction<CreateNewClass>) => {
            state.currentClass.info = action.payload
        },

        currentClass_ResetInfo: (state) => {
            state.currentClass = {
                info: {
                    id: "",
                    join_code: "",
                    label: "",
                    description: "",
                    subject: "",
                    created_approval: false,
                    required_approval: false,
                    required_join_form: false,
                    is_deleted: false,
                    is_banned: false,
                    created_at: "",
                    updated_at: "",
                    roleClass: "",
                    createdBy: {
                        id: "",
                        full_name: "",
                        email: "",
                        role: "",
                    },
                    counts: {
                        student: "",
                        lecturer: "",
                        committee: "",
                        pending: ""
                    },
                    owner: {
                        full_name: "",
                        email: "",
                    }
                },
                members: []
            }
        },

        currentClass_SetMembers: (state, action: PayloadAction<Members[]>) => {
            state.currentClass.members = action.payload
        }
    }
})

export const {
    addClass,
    setClassList,

    currentClass_UpdateInfo,
    currentClass_ResetInfo,
    currentClass_SetMembers
} = classSlice.actions

export default classSlice.reducer