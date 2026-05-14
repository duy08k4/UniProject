import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ScaleLoader } from "react-spinners"
import type { RootState } from "../../../redux/store"
import { store } from "../../../redux/store"
import ScoreFormsService from "../../../services/scoreforms/scoreforms.service"
import { setCurrentScoreForm, setScoreFormRows, updateCellByRowCol } from "../../../redux/reducers/scoreformSlice.reducer"
import { ColumnAllowedRole, ColumnLabel, VNColumnAllowedRole } from "../../../config/enum"
import { confirmDialog } from "primereact/confirmdialog"
import CommitteeService from "../../../services/committee/committee.service"
import type { CommitteeMemberDetail } from "../../../services/committee/committee.type"
import formatVNTime from "../../../utils/formatVNTime"
import { computeFormulaValue } from "../../../utils/computeFormulaValue"
import FormulaPreview from "../../components/FormulaPreview"

const LTScoreboardsDetail: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const detail = useSelector((state: RootState) => state.scoreForm.currentScoreForm)
    const rows = useSelector((state: RootState) => state.scoreForm.scoreFormRows)
    const user = useSelector((state: RootState) => state.auth.user.info)
    const classInfo = useSelector((state: RootState) => state.class.currentClass.info)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const [loading, setLoading] = useState(true)
    const [editingCell, setEditingCell] = useState<{ rowId: string; colId: string } | null>(null)
    const [cellInput, setCellInput] = useState("")
    const [myCommitteeMember, setMyCommitteeMember] = useState<CommitteeMemberDetail | null>(null)
    const [isRoomAdmin, setIsRoomAdmin] = useState(false)
    const abortControllers = useRef<Map<string, AbortController>>(new Map())
    const originalCellVal = useRef("")

    useEffect(() => {
        if (!boardId || !classInfo.id) return
        store.dispatch(setCurrentScoreForm(null))
        store.dispatch(setScoreFormRows([]))
        setLoading(true)

        const classState = store.getState().class.currentClass
        const members = Array.isArray(classState.members) ? classState.members : []
        const meInClass = members.find((m: any) => m.user?.id === user.id)
        setIsRoomAdmin(meInClass?.role === "roomadmin")

        Promise.all([
            ScoreFormsService.getScoreFormDetail(boardId),
            ScoreFormsService.getScoreFormRows(boardId),
            CommitteeService.getByClassId(classInfo.id).then(res => {
                const me = (res as any)?.members?.find((m: any) => m.user.id === user.id)
                if (me) setMyCommitteeMember(me)
            })
        ]).finally(() => setLoading(false))
    }, [boardId, classInfo.id])

    useEffect(() => {
        if (detail?.is_stopped && editingCell) setEditingCell(null)
    }, [detail?.is_stopped])

    const canEditColumn = React.useMemo(() => (col: any) => {
        if (col.formula_content) return false
        
        // Kiểm tra trạng thái mới nhất từ detail
        if (detail?.is_stopped) return false
        
        const now = new Date()
        if (detail?.is_auto_open && detail.open_at && new Date(detail.open_at) > now) return false
        if (detail?.is_auto_close && detail.close_at && new Date(detail.close_at) < now) return false

        if (isRoomAdmin) return true
        const allowed = col.allowed_role
        if (!allowed || allowed === ColumnAllowedRole.LECTURER) return true
        if (allowed === ColumnAllowedRole.ROOMADMIN) return isRoomAdmin
        return myCommitteeMember?.role === allowed
    }, [detail, isRoomAdmin, myCommitteeMember])

    const getEditableErrorMessage = () => {
        const now = new Date()
        if (detail?.is_stopped) return "Bảng điểm đã bị khóa bởi RA."
        if (detail?.is_auto_open && detail.open_at && new Date(detail.open_at) > now) return `Chưa đến giờ mở (từ ${formatVNTime(detail.open_at)})`
        if (detail?.is_auto_close && detail.close_at && new Date(detail.close_at) < now) return "Đã hết thời gian nhập điểm."
        return "Bạn không có quyền nhập cột này."
    }

    // ... (logic bên dưới sử dụng canEditColumn và detail.is_stopped)

    const columns = [...(detail?.columns ?? [])].sort((a, b) => a.index - b.index)
    const nameCols = columns.filter(c => c.column_label !== null)
    const scoreCols = columns.filter(c => c.column_label === null)
    const firstNameCol = nameCols.find(c => c.column_label === ColumnLabel.FIRST_NAME)

    const sortedRows = [...rows].sort((a, b) => {
        const getVal = (row: typeof rows[0]) =>
            row.cells.find(c => c.column.id === firstNameCol?.id)?.value ?? ''
        return getVal(a).localeCompare(getVal(b), 'vi')
    })

    const getRawCellValue = (rowId: string, colId: string) =>
        rows.find(r => r.id === rowId)?.cells.find(c => c.column.id === colId)?.value ?? ""

    const getCellValue = (rowId: string, colId: string) => {
        const col = columns.find(c => c.id === colId)
        if (col?.formula_content) {
            const row = rows.find(r => r.id === rowId)
            
            if (!row) return ""

            const cellMap = new Map(row.cells.map(c => [c.column.id, c.value ?? ""]))
            return computeFormulaValue(col.formula_content, cellMap) ?? ""
        }
        return getRawCellValue(rowId, colId)
    }

    const commitCell = async (inputVal: string) => {
        if (!editingCell || !boardId) return
        const { rowId, colId } = editingCell
        const currentVal = getRawCellValue(rowId, colId)
        setEditingCell(null)

        if (inputVal === currentVal) return
        const numVal = parseFloat(inputVal)
        if (isNaN(numVal)) return

        const doCommit = async () => {
            dispatch(updateCellByRowCol({ rowId, columnId: colId, value: inputVal }))
            const key = `${rowId}:${colId}`
            abortControllers.current.get(key)?.abort()

            const controller = new AbortController()
            abortControllers.current.set(key, controller)

            const result = await ScoreFormsService.updateCell(boardId, rowId, colId, numVal, controller.signal)
            abortControllers.current.delete(key)
            
            if (result === false) dispatch(updateCellByRowCol({ rowId, columnId: colId, value: currentVal }))
        }

        if (currentVal !== originalCellVal.current) {
            confirmDialog({
                header: 'Xung đột dữ liệu',
                message: `Điểm đã được cập nhật thành ${currentVal || '(trống)'} trong lúc bạn chỉnh sửa. Bạn có muốn ghi đè thành ${inputVal} không?`,
                acceptLabel: 'Ghi đè',
                rejectLabel: 'Hủy',
                acceptClassName: 'p-button-danger',
                accept: doCommit,
            })
            return
        }

        await doCommit()
    }

    if (loading) return <div className="flex justify-center items-center h-64"><ScaleLoader color="#499c40" /></div>
    if (!detail) return <div className="flex justify-center items-center h-64 text-gray">Không tìm thấy bảng điểm</div>

    const filledRows = rows.filter(r => scoreCols.some(c => getCellValue(r.id, c.id!) !== "")).length
    const editableCols = scoreCols.filter(c => canEditColumn(c))

    return (
        <div className="w-full flex flex-col gap-6 pt-topPadding pb-BottomPadding">
            {/* Header */}
            <div className="flex items-start gap-4">
                <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-lightGray dark:hover:bg-gray rounded-full transition-colors shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 dark:stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-largeSize font-bold dark:text-white">{detail.label}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-tinySize font-bold ${detail.is_stopped ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                            {detail.is_stopped ? "Đã khóa điểm" : "Đang nhận điểm"}
                        </span>
                    </div>
                    {detail.description && <p className="text-smallSize text-gray mt-0.5">{detail.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-gray dark:text-gray-400">
                        <span><b className="text-black dark:text-white">{filledRows}</b>/{rows.length} sinh viên đã có điểm</span>
                        {detail.is_auto_open && detail.open_at && (
                            <span className="text-blue-500 font-medium">⏱ Mở lúc {formatVNTime(detail.open_at)}</span>
                        )}
                        {detail.is_auto_close && detail.close_at && (
                            <span className="text-orange-500 font-medium">⏱ Đóng lúc {formatVNTime(detail.close_at)}</span>
                        )}
                        {myCommitteeMember && (
                            <span className="px-2 py-0.5 bg-mainColor/10 text-mainColor rounded font-bold uppercase text-[10px]">
                                Vai trò: {myCommitteeMember.role}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Vai trò nhập điểm */}
            {editableCols.length > 0 && !detail.is_stopped && (
                <div className="flex items-center gap-3 px-4 py-3 bg-mainColor/5 border border-mainColor/15 rounded-normal">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 text-mainColor shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                    </svg>
                    <p className="text-[11px] text-mainColor font-medium">
                        Bạn có thể nhập điểm cho: <b>{editableCols.map(c => c.label).join(", ")}</b>. Nhấn vào ô điểm để chỉnh sửa.
                    </p>
                </div>
            )}

            {/* Bảng điểm */}
            <div className="rounded-big border border-gray/10 shadow-sm overflow-hidden bg-white dark:bg-lightDark">
                <div className="px-5 py-3 border-b border-gray/10 flex items-center justify-between">
                    <p className="text-smallSize font-bold dark:text-white">Danh sách điểm</p>
                    <p className="text-[11px] text-gray">{rows.length} sinh viên</p>
                </div>
                <div className="overflow-x-auto overflow-y-auto max-h-[65vh]">
                    <table className="text-left border-collapse">
                        <thead className="sticky top-0 z-20">
                            <tr className="border-b border-gray/10 bg-lightGray/50 dark:bg-gray/10">
                                {nameCols.map(col => (
                                    <th key={col.id} className="px-5 py-3 text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-lightGray/50 dark:bg-gray/10 z-10">
                                        {col.label}
                                    </th>
                                ))}
                                {scoreCols.map(col => (
                                    <th key={col.id} className="px-4 py-3 whitespace-nowrap w-px text-center">
                                        <div className="flex flex-col gap-0.5 items-center">
                                            <span className="text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                {col.formula_content && <span className="font-mono text-mainColor/60 text-[10px]">ƒ</span>}
                                                {col.label}
                                            </span>
                                            {col.formula_content ? (
                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-mainColor/10 text-mainColor font-bold">Tự động</span>
                                            ) : (
                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray/10 text-gray font-bold">
                                                    {col.allowed_role && canEditColumn(col) ? VNColumnAllowedRole[col.allowed_role] : "Nhập tay"}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        
                        <tbody>
                            {sortedRows.length === 0 ? (
                                <tr><td colSpan={columns.length} className="px-5 py-10 text-center text-gray text-smallSize">Chưa có sinh viên nào.</td></tr>
                            ) : sortedRows.map((row, idx) => (
                                <tr key={row.id} className={`border-b border-gray/5 hover:bg-lightGray/20 dark:hover:bg-gray/5 transition-colors ${idx === sortedRows.length - 1 ? "border-b-0" : ""}`}>
                                    {nameCols.map(col => (
                                        <td key={col.id} className="px-5 py-3 whitespace-nowrap sticky left-0 bg-white dark:bg-lightDark z-10">
                                            <p className="text-smallSize dark:text-white">{getCellValue(row.id, col.id!) || "—"}</p>
                                        </td>
                                    ))}
                                    {scoreCols.map(col => {
                                        const val = getCellValue(row.id, col.id!)
                                        const isFormula = !!col.formula_content
                                        const isEditing = editingCell?.rowId === row.id && editingCell?.colId === col.id
                                        const editable = canEditColumn(col)

                                        return (
                                            <td key={col.id} className="px-4 py-3 text-center whitespace-nowrap w-px">
                                                {isFormula ? (
                                                    <div className="relative group/tooltip w-full flex justify-center">
                                                        <span className={`text-smallSize font-bold ${val ? "text-mainColor" : "text-gray/30"}`}>
                                                            {val || "—"}
                                                        </span>
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tooltip:block z-50 pointer-events-none">
                                                            <div className="bg-dark dark:bg-lightDark border border-gray/20 rounded-normal px-2.5 py-1.5 shadow-lg flex items-center gap-1">
                                                                <span className="text-[11px] text-gray-400 font-mono mr-1">ƒ =</span>
                                                                <FormulaPreview formula={col.formula_content!} cols={columns} nowrap />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : isEditing ? (
                                                    <input
                                                        type="number" value={cellInput}
                                                        onChange={e => setCellInput(e.target.value)}
                                                        onBlur={() => setEditingCell(null)}
                                                        onKeyDown={e => { if (e.key === "Enter") commitCell(cellInput); if (e.key === "Escape") { setCellInput(getRawCellValue(editingCell!.rowId, editingCell!.colId)); setEditingCell(null) } }}
                                                        autoFocus
                                                        className="w-20 px-2 py-1 border border-mainColor rounded-normal text-smallSize text-center outline-none dark:bg-dark dark:text-white"
                                                    />
                                                ) : (
                                                    <button
                                                        onClick={() => { if (!detail.is_stopped && editable && !isFetching) { originalCellVal.current = val; setEditingCell({ rowId: row.id, colId: col.id! }); setCellInput(val) } }}
                                                        disabled={detail.is_stopped || !editable || isFetching}
                                                        title={detail.is_stopped ? "Bảng điểm đã khóa" : !editable ? getEditableErrorMessage() : "Nhấn để nhập điểm"}
                                                        className={`min-w-12 px-2 py-1 rounded text-smallSize transition-colors disableState
                                                            ${val ? "font-bold text-mainColor" : "text-gray/30"}
                                                            ${!detail.is_stopped && editable ? "hover:bg-mainColor/10 cursor-pointer ring-1 ring-transparent hover:ring-mainColor/30" : "cursor-default"}
                                                        `}
                                                    >
                                                        {val || "—"}
                                                    </button>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default LTScoreboardsDetail
