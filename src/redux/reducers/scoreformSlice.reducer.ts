import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { DetailScoreForm, ScoreFormPaginationType, ScoreFormRow } from "../../services/scoreforms/scoreforms.type"

export interface ScoreFormSlice {
    scoreFormPagination: ScoreFormPaginationType | null
    currentScoreForm: DetailScoreForm | null
    scoreFormRows: ScoreFormRow[]
}

const initialState: ScoreFormSlice = {
    scoreFormPagination: null,
    currentScoreForm: null,
    scoreFormRows: [],
}

export const scoreFormSlice = createSlice({
    name: 'scoreform',
    initialState,
    reducers: {
        setScoreFormPagination: (state, action: PayloadAction<ScoreFormPaginationType | null>) => {
            state.scoreFormPagination = action.payload
        },

        removeScoreFormFromPagination: (state, action: PayloadAction<string[]>) => {
            if (state.scoreFormPagination) {
                state.scoreFormPagination.data = state.scoreFormPagination.data.filter(sf => !action.payload.includes(sf.id))
                state.scoreFormPagination.pagination.total -= action.payload.length
            }
        },

        setCurrentScoreForm: (state, action: PayloadAction<DetailScoreForm | null>) => {
            state.currentScoreForm = action.payload
        },

        setScoreFormRows: (state, action: PayloadAction<ScoreFormRow[]>) => {
            state.scoreFormRows = action.payload
        },

        updateCell: (state, action: PayloadAction<{ cellId: string, value: string }>) => {
            const { cellId, value } = action.payload
            for (const row of state.scoreFormRows) {
                const cell = row.cells.find(c => c.id === cellId)
                if (cell) {
                    cell.value = value
                    return
                }
            }
        },

        updateCellByRowCol: (state, action: PayloadAction<{ rowId: string; columnId: string; value: string }>) => {
            const { rowId, columnId, value } = action.payload
            const row = state.scoreFormRows.find(r => r.id === rowId)
            if (!row) return
            const cell = row.cells.find(c => c.column.id === columnId)
            if (cell) {
                cell.value = value
            } else {
                row.cells.push({ id: '', value, column: { id: columnId }, updatedBy: null, updated_at: new Date().toISOString() } as any)
            }
        },

        updateScoreFormIsStopped: (state, action: PayloadAction<{ scoreFormId: string; is_stopped: boolean }>) => {
            const { scoreFormId, is_stopped } = action.payload
            if (state.currentScoreForm && state.currentScoreForm.id === scoreFormId) {
                state.currentScoreForm.is_stopped = is_stopped
            }
            if (state.scoreFormPagination) {
                const sf = state.scoreFormPagination.data.find(item => item.id === scoreFormId)
                if (sf) sf.is_stopped = is_stopped
            }
        },

        clearCurrentScoreFormIfDeleted: (state, action: PayloadAction<string[]>) => {
            if (state.currentScoreForm && action.payload.includes(state.currentScoreForm.id)) {
                state.currentScoreForm = null
                state.scoreFormRows = []
            }
            if (state.scoreFormPagination) {
                state.scoreFormPagination.data = state.scoreFormPagination.data.filter(sf => !action.payload.includes(sf.id))
            }
        },
    }
})

export const {
    setScoreFormPagination,
    removeScoreFormFromPagination,
    setCurrentScoreForm,
    setScoreFormRows,
    updateCell,
    updateCellByRowCol,
    updateScoreFormIsStopped,
    clearCurrentScoreFormIfDeleted,
} = scoreFormSlice.actions

export default scoreFormSlice.reducer
