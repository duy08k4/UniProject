import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ClassPagination, CreateNewClass, Members, MembersPagination, Pagination } from "../../services/class/class.type";
import { clasSizePage, memberSizePage } from "../../config/pageSize";

// Reducer

export interface ClassSlice {
    classList: CreateNewClass[],
    pagination: Pagination,
    currentClass: {
        info: CreateNewClass,
        members: MembersPagination
    }
}

const initialState: ClassSlice = {
    classList: [],
    pagination: {
        page: "0",
        size: clasSizePage.toString(),
        total_classes: "0",
        totalPage: "0"
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
            user: {
                role: "",
                is_banned: false,
                roomadmin_approved: false
            },
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
                pending: "",
                forms: "",
                milestones: "",
                score_forms: ""
            },
            owner: {
                full_name: "",
                email: "",
            }
        },
        members: {
            data: {
                lecturer: [],
                pending: [],
                roomadmin: [],
                student: [],
            },
            pagination: {
                page: "1",
                size: "50",
                total_members: "0",
                totalPage: "1"
            }
        }
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

        // Update class
        updateClass: (state, action: PayloadAction<CreateNewClass>) => {
            const updatedClass = action.payload;

            const index = state.classList.findIndex(c => c.id === updatedClass.id);

            if (index !== -1) {
                state.classList[index] = {
                    ...state.classList[index],
                    ...updatedClass
                };
            }
        },

        // Set class list
        setClassList: (state, action: PayloadAction<ClassPagination>) => {
            if (action.payload.data) {
                state.classList = action.payload.data
                state.pagination = action.payload.pagination
            }
        },

        // Update data of a class in list
        updateClassInList: (state, action: PayloadAction<CreateNewClass>) => {
            const classList = state.classList
            const classUpdate = action.payload

            state.classList = [
                ...classList.filter(c => c.id !== classUpdate.id),
                classUpdate
            ]
        },

        // Remove a class
        removeClassInList: (state, action: PayloadAction<{ classId: string }>) => {
            const isClass = state.classList.find(c => c.id === action.payload.classId)

            if (isClass) {
                state.classList = [
                    ...state.classList.filter(c => c.id !== action.payload.classId)
                ]
            }
        },

        // Recent class ------------------------------------------------------------
        currentClass_UpdateInfo: (state, action: PayloadAction<CreateNewClass>) => {
            state.currentClass.info = {
                ...action.payload
            }
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
                    user: {
                        role: "",
                        is_banned: false,
                        roomadmin_approved: false
                    },
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
                        pending: "",
                        forms: "",
                        milestones: "",
                        score_forms: ""
                    },
                    owner: {
                        full_name: "",
                        email: "",
                    }
                },
                members: {
                    data: {
                        lecturer: [],
                        pending: [],
                        roomadmin: [],
                        student: [],
                    },
                    pagination: {
                        page: "1",
                        size: "50",
                        total_members: "0",
                        totalPage: "1"
                    }
                }
            }
        },

        currentClass_UpdatePagination: (state) => {
            const data = state.currentClass.members.data;
            const pagination = state.currentClass.members.pagination;

            const totalMembers = Object.values(data).flat().length;
            const pageSize = parseInt(pagination.size || memberSizePage.toString());
            const newTotalPage = Math.ceil(totalMembers / pageSize);

            state.currentClass.members.pagination = {
                ...pagination,
                total_members: totalMembers.toString(),
                totalPage: Math.max(1, newTotalPage).toString()
            };
        },

        currentClass_AddPending: (state, action: PayloadAction<Members>) => {
            const userPending = action.payload

            const isUserPending = Object.values(state.currentClass.members.data).flat().find(m => m.user.id === userPending.user.id)

            if (isUserPending) return

            // Add pending
            state.currentClass.members.data.pending = [
                ...state.currentClass.members.data.pending,
                userPending
            ]

            // Update amount of pending in the current class
            state.currentClass.info.counts = {
                ...state.currentClass.info.counts,
                pending: (Number(state.currentClass.info.counts.pending) + 1).toString()
            }

            classSlice.caseReducers.currentClass_UpdatePagination(state)
        },

        currentClass_SetMembers: (state, action: PayloadAction<MembersPagination>) => {
            state.currentClass.members = action.payload
        },

        currentClass_UpdateMember: (state, action: PayloadAction<Members>) => {
            const member = action.payload;
            const { data } = state.currentClass.members;
            const { counts } = state.currentClass.info;

            let oldRole: keyof typeof data | null = null;

            // Remove member in all roles
            (Object.keys(data) as Array<keyof typeof data>).forEach(key => {
                const i = data[key].findIndex(m => m.user.id === member.user.id);
                if (i !== -1) { (oldRole = key), data[key].splice(i, 1); }
            });

            // 2. Add the member to role
            data[member.role].push(member);

            // 3. update count when role change
            if (oldRole !== member.role) {
                if (oldRole && oldRole in counts) {
                    counts[oldRole as keyof typeof counts] = Math.max(0, Number(counts[oldRole as keyof typeof counts]) - 1).toString();
                }
                if (member.role in counts) {
                    counts[member.role as keyof typeof counts] = (Number(counts[member.role as keyof typeof counts]) + 1).toString();
                }
            }

            classSlice.caseReducers.currentClass_UpdatePagination(state);
        },
        
        currentClass_RemoveMember: (state, action: PayloadAction<{ memberRemoved: Members; newAdminId?: string }>) => {
            const { memberRemoved, newAdminId } = action.payload;
            const data = state.currentClass.members.data;
            const info = state.currentClass.info;

            if (!memberRemoved.roomadmin_approved) {
                const pendingList = state.currentClass.members.data.pending

                state.currentClass.info.counts = {
                    ...state.currentClass.info.counts,
                    pending: (Number(state.currentClass.info.counts.pending) - 1).toString()
                }

                state.currentClass.members.data.pending = [
                    ...pendingList.filter(p => p.id != memberRemoved.id)
                ]
                return
            }

            const removedRole = memberRemoved.role; // "roomadmin" | "student" | "lecturer"
            data[removedRole] = data[removedRole].filter(m => m.user.id !== memberRemoved.user.id);

            if (removedRole in info.counts) {
                const targetKey = removedRole as keyof typeof info.counts;
                const currentCount = parseInt(info.counts[targetKey] || "0");
                info.counts[targetKey] = Math.max(0, currentCount - 1).toString();
            }

            if (removedRole === 'roomadmin') {

                const allMembers = Object.values(data).flat();
                const newAdminData = allMembers.find(m => m.user.id === newAdminId);

                console.log(newAdminData)

                if (newAdminData) {
                    const oldRole = newAdminData.role;

                    data[oldRole] = data[oldRole].filter(m => m.user.id !== newAdminId);

                    if (oldRole in info.counts) {
                        const targetOldKey = oldRole as keyof typeof info.counts;
                        const currentOldCount = parseInt(info.counts[targetOldKey] || "0");
                        info.counts[targetOldKey] = Math.max(0, currentOldCount - 1).toString();
                    }

                    data.roomadmin.push({
                        ...newAdminData,
                        role: "roomadmin"
                    });
                } else {
                    window.location.reload();
                    return;
                }
            }

            const total = parseInt(state.currentClass.members.pagination.total_members || "0");

            state.currentClass.members.pagination.total_members = Math.max(0, total - 1).toString();
        },
    }
})

export const {
    addClass,
    updateClass,
    setClassList,
    updateClassInList,
    removeClassInList,

    currentClass_UpdateInfo,
    currentClass_ResetInfo,
    currentClass_UpdatePagination,
    currentClass_AddPending,
    currentClass_SetMembers,
    currentClass_UpdateMember,
    currentClass_RemoveMember
} = classSlice.actions

export default classSlice.reducer