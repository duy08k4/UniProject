import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ScaleLoader } from "react-spinners"
import type { RootState } from "../../../redux/store"
import { store } from "../../../redux/store"
import ScoreFormsService from "../../../services/scoreforms/scoreforms.service"
import { setCurrentScoreForm, setScoreFormRows, updateCellByRowCol } from "../../../redux/reducers/scoreformSlice.reducer"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import type { UpdateScoreFormType } from "../../../services/scoreforms/scoreforms.type"
import { ColumnAllowedRole, ColumnLabel, ColumnType, VNColumnAllowedRole, VNColumnType } from "../../../config/enum"
import type { ColumnAllowedRoleType, ColumnLabelType, ColumnTypeType } from "../../../config/enum"
import { confirmDialog } from "primereact/confirmdialog"
import CommitteeService from "../../../services/committee/committee.service"
import type { CommitteeMemberDetail } from "../../../services/committee/committee.type"
import formatVNTime from "../../../utils/formatVNTime"
import { computeFormulaValue } from "../../../utils/computeFormulaValue"
import FormulaPreview from "../../components/FormulaPreview"

type Col = {
    id?: string
    label: string
    index: number
    formula_content: string | null
    allowed_role: ColumnAllowedRoleType | null
    column_type: ColumnTypeType
    column_label: ColumnLabelType | null
    // local-only flags (không gửi lên API)
    pendingDelete?: boolean
    formulaInvalid?: boolean
    isNew?: boolean
    _savedFormula?: string | null
}

type DraftCol = {
    label: string
    column_type: ColumnTypeType
    allowed_role: ColumnAllowedRoleType | ""
    formula_content: string
}


const ColumnSettingsPanel: React.FC<{
    col: Col
    allCols: Col[]
    onSave: (draft: DraftCol) => void
    onDelete: () => void
    onUndoDelete: () => void
}> = ({ col, allCols, onSave, onDelete, onUndoDelete }) => {
    const [draft, setDraft] = useState<DraftCol>({
        label: col.label,
        column_type: col.column_type,
        allowed_role: col.allowed_role ?? "",
        formula_content: col.formula_content ?? "",
    })
    const [showFormula, setShowFormula] = useState(!!col.formula_content)
    const [validateResult, setValidateResult] = useState<{ ok: boolean; msg: string } | null>(null)
    const taRef = useRef<HTMLTextAreaElement>(null)

    const otherCols = allCols.filter(c => c.id !== col.id && c.column_label === null)

    // Click chip cột → chèn col[uuid] vào vị trí con trỏ trong textarea
    const insertColRef = (colId: string) => {
        const ta = taRef.current
        if (!ta) return
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const token = `col[${colId}]`
        const next = draft.formula_content.slice(0, start) + token + draft.formula_content.slice(end)
        setDraft(d => ({ ...d, formula_content: next }))
        setTimeout(() => {
            ta.focus()
            ta.setSelectionRange(start + token.length, start + token.length)
        }, 0)
    }

    const hasInvalidRef = [...draft.formula_content.matchAll(/col\[([^\]]+)\]/g)]
        .map(m => m[1]).some(ref => !otherCols.find(c => c.id === ref))

    const checkFormula = () => {
        if (!draft.formula_content.trim()) {
            setValidateResult({ ok: false, msg: 'Công thức không hợp lệ.' })
            return
        }
        try {
            const testExpr = draft.formula_content.replace(/col\[[^\]]+\]/g, '1')
            if (!/^[\d\s+\-*/().]+$/.test(testExpr)) {
                setValidateResult({ ok: false, msg: 'Công thức chứa ký tự không hợp lệ. Chỉ dùng: + - * / ( ) và số.' })
                return
            }
            // eslint-disable-next-line no-new-func
            const result = new Function(`return ${testExpr}`)()
            if (typeof result !== 'number' || !isFinite(result)) {
                setValidateResult({ ok: false, msg: 'Công thức không hợp lệ (kết quả không phải số).' })
                return
            }
            setValidateResult({ ok: true, msg: 'Công thức hợp lệ.' })
        } catch {
            setValidateResult({ ok: false, msg: 'Công thức có lỗi cú pháp, vui lòng kiểm tra lại.' })
        }
    }

    return (
        <div className="border-t border-gray/10">
            {/* Header panel */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray/10 bg-lightGray/40 dark:bg-gray/10">
                <p className="text-smallSize font-bold text-black dark:text-white">
                    <p className="dark:text-white">Cài đặt cột: <b className="text-mainColor">{col.label}</b></p>
                </p>

                <button onClick={onDelete} className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600 font-bold transition-colors hoverBtn bg-redRGB px-2.5 py-1.5 rounded-normal">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-3.5 stroke-red">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Xóa cột
                </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
                {/* Row 1: Tên + Loại + Quyền nhập */}
                <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Tên cột <span className="text-red-500">*</span></label>
                        <input
                            value={draft.label}
                            onChange={e => setDraft(d => ({ ...d, label: e.target.value }))}
                            placeholder="VD: Điểm Chủ tịch, Điểm TB..."
                            className="px-3 py-2 border border-gray/20 dark:border-gray/30 rounded-normal text-smallSize bg-white dark:bg-lightDark text-black dark:text-white placeholder:text-gray/40 dark:placeholder:text-gray/30 outline-none focus:border-mainColor transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Loại cột</label>
                        <select
                            value={draft.column_type}
                            onChange={e => setDraft(d => ({ ...d, column_type: e.target.value as ColumnTypeType, allowed_role: "" }))}
                            className="px-3 py-2 border border-gray/20 dark:border-gray/30 rounded-normal text-smallSize bg-white dark:bg-lightDark text-black dark:text-white outline-none focus:border-mainColor transition-colors"
                        >
                            {Object.values(ColumnType).map(t => <option key={t} value={t} className="dark:text-white">{VNColumnType[t]}</option>)}
                        </select>
                        <p className="text-[11px] text-gray dark:text-gray">
                            {draft.column_type === ColumnType.NORMAL && "Cột dữ liệu thông thường, mọi giảng viên trong lớp đều nhập được."}
                            {draft.column_type === ColumnType.COMPONENT && "Điểm thành phần, nhập tay, không tự động tính. Có thể giới hạn chỉ một vai trò nhất định mới được nhập (VD: chỉ Chủ tịch HĐ)."}
                            {draft.column_type === ColumnType.SUMMARY && "Điểm tổng kết, thường gắn công thức để tự động tính từ các cột khác. Nếu có công thức thì không cho nhập tay."}
                        </p>
                    </div>

                    {draft.column_type === ColumnType.COMPONENT && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider">
                                Quyền nhập
                            </label>
                            <select
                                value={draft.allowed_role}
                                onChange={e => setDraft(d => ({ ...d, allowed_role: e.target.value as ColumnAllowedRoleType | "" }))}
                                className="px-3 py-2 border border-gray/20 dark:border-gray/30 rounded-normal text-smallSize bg-white dark:bg-lightDark text-black dark:text-white outline-none focus:border-mainColor transition-colors"
                            >
                                <option value="">Không giới hạn (mọi GV)</option>
                                {Object.values(ColumnAllowedRole).map(r => <option key={r} value={r}>{VNColumnAllowedRole[r]}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Row 2: Formula */}
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => setShowFormula(v => !v)}
                        className="flex items-center gap-1.5 text-smallSize font-bold text-mainColor w-fit hover:opacity-80 transition-opacity"
                    >
                        <span className="text-[10px]">{showFormula ? "▾" : "▸"}</span>
                        {showFormula ? "Ẩn công thức" : "Thêm công thức tính tự động"}
                    </button>

                    {showFormula && (
                        <div className="flex flex-col gap-3 p-4 rounded-normal border border-gray/15 dark:border-gray/20 dark:bg-dark">
                            {/* Chip cột */}
                            {otherCols.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    <p className="text-[11px] font-bold text-gray dark:text-gray-400">Nhấn để chèn cột vào công thức:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {otherCols.map(c => (
                                            <button
                                                key={c.id} type="button"
                                                onClick={() => insertColRef(c.id!)}
                                                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 rounded text-[11px] font-medium hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                                            >
                                                {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[11px] text-gray dark:text-gray/60 italic">Chưa có cột nào khác để tham chiếu</p>
                            )}

                            {/* Textarea */}
                            <div className="flex flex-col gap-1.5">
                                <p className="text-[11px] font-bold text-gray dark:text-gray-400">
                                    Công thức <span className="font-normal text-gray/70 dark:text-gray/50">(gõ trực tiếp hoặc nhấn tên cột bên trên để chèn)</span>
                                </p>

                                <textarea
                                    ref={taRef}
                                    value={draft.formula_content}
                                    onChange={e => { setDraft(d => ({ ...d, formula_content: e.target.value })); setValidateResult(null) }}
                                    placeholder="VD: (col[...] + col[...]) / 3"
                                    rows={2}
                                    className="px-3 py-2 border border-gray/20 dark:border-gray/30 rounded-normal text-smallSize font-mono bg-white dark:bg-lightDark text-black dark:text-white placeholder:text-gray/40 dark:placeholder:text-gray/30 outline-none focus:border-mainColor transition-colors resize-none"
                                />

                                <div className="flex flex-col gap-1 p-2.5 rounded-normal bg-lightGray/60 dark:bg-gray/10 border border-gray/10 dark:border-gray/20">
                                    <p className="text-[11px] font-bold text-gray dark:text-gray-400">Hướng dẫn viết công thức:</p>
                                    <ul className="text-[11px] flex flex-col gap-0.5 list-disc list-inside">
                                        <li className="text-gray dark:text-white">Nhấn chip tên cột bên trên để chèn cột vào công thức</li>
                                        <li className="text-gray dark:text-white">Dùng <code className="bg-gray/10 dark:bg-gray/20 dark:text-white px-1 rounded">+</code> <code className="bg-gray/10 dark:bg-gray/20 px-1 rounded dark:text-white">-</code> <code className="bg-gray/10 dark:bg-gray/20 px-1 rounded dark:text-white">*</code> <code className="bg-gray/10 dark:bg-gray/20 px-1 rounded dark:text-white">/</code> và dấu ngoặc <code className="bg-gray/10 dark:bg-gray/20 px-1 rounded dark:text-white">( )</code></li>
                                        
                                        <li className="text-gray dark:text-white">Ví dụ tính trung bình 3 cột: <code className="bg-gray/10 dark:bg-gray/20 px-1 rounded dark:text-white">(col[...] + col[...] + col[...]) / 3</code></li>
                                        <li className="text-gray dark:text-white">Ví dụ tính tổng có trọng số: <code className="bg-gray/10 dark:bg-gray/20 px-1 rounded dark:text-white">col[...] * 0.4 + col[...] * 0.6</code></li>
                                    </ul>
                                </div>

                                <button
                                    type="button"
                                    onClick={checkFormula}
                                    disabled={!draft.formula_content.trim()}
                                    className="self-start px-3 py-1.5 border border-gray/20 dark:border-gray/30 rounded-normal text-[11px] font-bold text-black dark:text-white hover:bg-lightGray dark:hover:bg-gray/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Kiểm tra công thức
                                </button>
                                
                                {validateResult && (
                                    <p className={`text-[11px] font-medium ${validateResult.ok ? 'text-mainColor' : 'text-red-500 dark:text-red-400'}`}>
                                        {validateResult.ok ? '✓' : '✗'} {validateResult.msg}
                                    </p>
                                )}
                            </div>

                            {/* Preview */}
                            {draft.formula_content && (
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-[11px] font-bold text-gray dark:text-gray-400">Xem trước:</p>
                                    <div className="px-3 py-2 rounded-normal border border-gray/10 dark:border-gray/20 bg-white dark:bg-lightDark min-h-8 flex items-center flex-wrap gap-1">
                                        <FormulaPreview formula={draft.formula_content} cols={otherCols} />
                                    </div>
                                </div>
                            )}

                            {hasInvalidRef && (
                                <p className="text-[11px] text-red-500 dark:text-red-400">⚠️ Công thức chứa cột không tồn tại</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-gray/10 flex-wrap">
                    {col.pendingDelete ? (
                        <button
                            onClick={onUndoDelete}
                            className="px-5 py-2 bg-orange-500 text-white rounded-normal text-smallSize font-bold hoverBtn"
                        >
                            Hủy xóa
                        </button>
                    ) : (
                        <>
                            {col.formulaInvalid && (
                                <p className="w-full text-[11px] text-orange-500 font-medium">⚠️ Công thức không còn hợp lệ vì một cột tham chiếu đã bị xóa. Vui lòng cập nhật lại công thức.</p>
                            )}
                            {(() => {
                                const isDirty = draft.label !== col.label
                                    || draft.column_type !== col.column_type
                                    || draft.allowed_role !== (col.allowed_role ?? "")
                                    || draft.formula_content !== (col.formula_content ?? "")
                                return (
                                    <>
                                        <button
                                            onClick={() => { if (isDirty) onSave(draft) }}
                                            disabled={!draft.label.trim()}
                                            className="px-5 py-2 bg-mainColor text-white rounded-normal text-smallSize font-bold hoverBtn disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Áp dụng
                                        </button>
                                        {isDirty && (
                                            <button
                                                type="button"
                                                onClick={() => confirmDialog({
                                                    message: 'Các thay đổi chưa lưu sẽ bị hủy, dữ liệu cột sẽ về trạng thái ban đầu.',
                                                    header: 'Khôi phục',
                                                    acceptLabel: 'Khôi phục',
                                                    rejectLabel: 'Hủy',
                                                    accept: () => setDraft({
                                                        label: col.label,
                                                        column_type: col.column_type,
                                                        allowed_role: col.allowed_role ?? "",
                                                        formula_content: col.formula_content ?? "",
                                                    })
                                                })}
                                                className="px-4 py-2 border border-gray/20 dark:border-gray/30 rounded-normal text-smallSize font-bold text-black dark:text-white hover:bg-lightGray dark:hover:bg-gray/20 transition-colors"
                                            >
                                                Khôi phục
                                            </button>
                                        )}
                                    </>
                                )
                            })()}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

// Main
const RAScoreboardsDetail: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const detail = useSelector((state: RootState) => state.scoreForm.currentScoreForm)
    const rows = useSelector((state: RootState) => state.scoreForm.scoreFormRows)
    const user = useSelector((state: RootState) => state.auth.user.info)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const [loading, setLoading] = useState(true)
    const [isEditMode, setIsEditMode] = useState(false)
    const [localCols, setLocalCols] = useState<Col[]>([])
    const [localColsSnapshot, setLocalColsSnapshot] = useState<Col[]>([])
    const [selectedColId, setSelectedColId] = useState<string | null>(null)
    const [editingCell, setEditingCell] = useState<{ rowId: string; colId: string } | null>(null)
    const [cellInput, setCellInput] = useState("")
    const [myCommitteeMember, setMyCommitteeMember] = useState<CommitteeMemberDetail | null>(null)
    const [scheduleInfo, setScheduleInfo] = useState({
        is_auto_open: false,
        is_auto_close: false,
        open_at: null as string | null,
        close_at: null as string | null,
    })
    const [savingSchedule, setSavingSchedule] = useState(false)
    const isScheduleDirty = detail ? (
        scheduleInfo.is_auto_open !== detail.is_auto_open ||
        scheduleInfo.is_auto_close !== detail.is_auto_close ||
        scheduleInfo.open_at !== detail.open_at ||
        scheduleInfo.close_at !== detail.close_at
    ) : false

    const [scoreFormOriginState, setScoreFormOriginState] = useState<boolean>(false)
    const abortControllers = useRef<Map<string, AbortController>>(new Map())
    const originalCellVal = useRef("")

    const toggleEditMode = () => {
        if (isEditMode) {
            setIsEditMode(false)
            setSelectedColId(null)
            setLocalCols([])
            setLocalColsSnapshot([])
            if (scoreFormOriginState) {
                handleToggleStop()
                setScoreFormOriginState(false)
            }
        } else {
            const snapshot = scoreCols.map(c => ({ ...c }))
            setLocalCols(snapshot)
            setLocalColsSnapshot(snapshot)
            setIsEditMode(true)
            setSelectedColId(null)
            if (detail && !detail.is_stopped) {
                handleToggleStop()
                setScoreFormOriginState(true)
            }
        }
    }

    const formatToInputDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return ""
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return ""
        const pad = (n: number) => n < 10 ? '0' + n : n
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    }

    const formatToInputTime = (dateStr: string | null | undefined) => {
        if (!dateStr) return ""
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return ""
        const pad = (n: number) => n < 10 ? '0' + n : n
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    const mergeDateTimeToISO = (dateVal: string, timeVal: string) => {
        if (!dateVal) return null
        const offset = -new Date().getTimezoneOffset()
        const sign = offset >= 0 ? '+' : '-'
        const pad = (n: number) => String(Math.abs(Math.floor(n))).padStart(2, '0')
        return `${dateVal}T${timeVal || '00:00'}:00${sign}${pad(offset / 60)}:${pad(offset % 60)}`
    }

    useEffect(() => {
        if (!boardId) return
        store.dispatch(setCurrentScoreForm(null))
        store.dispatch(setScoreFormRows([]))
        setLoading(true)

        const fetchDetails = async () => {
            const [sfRes] = await Promise.all([
                ScoreFormsService.getScoreFormDetail(boardId),
                ScoreFormsService.getScoreFormRows(boardId),
            ])

            if (sfRes && (sfRes as any).class?.id) {
                const committee = await CommitteeService.getByClassId((sfRes as any).class.id)
                const members = (committee && Array.isArray((committee as any).members)) ? (committee as any).members : []
                const me = members.find((m: any) => m.user?.id === user.id)
                if (me) setMyCommitteeMember(me)
            }

            const currentDetail = store.getState().scoreForm.currentScoreForm
            if (currentDetail) {
                setScheduleInfo({
                    is_auto_open: currentDetail.is_auto_open,
                    is_auto_close: currentDetail.is_auto_close,
                    open_at: currentDetail.open_at,
                    close_at: currentDetail.close_at,
                })
            }

            setLoading(false)
        }

        fetchDetails()
    }, [boardId])

    useEffect(() => {
        if (detail?.is_stopped && editingCell) setEditingCell(null)
    }, [detail?.is_stopped])

    // Kiểm tra quyền chỉnh sửa của một cột
    const canEditColumn = (col: any) => {
        if (col.formula_content) return false // Cột công thức thì không ai được sửa

        // Mặc định RoomAdmin có quyền sửa tất cả các cột NHẬP TAY (không có formula)
        const allowed = col.allowed_role
        if (!allowed || allowed === ColumnAllowedRole.LECTURER || allowed === ColumnAllowedRole.ROOMADMIN) return true

        // Nếu cột yêu cầu vai trò hội đồng cụ thể, kiểm tra xem RoomAdmin này có vai trò đó không
        return myCommitteeMember?.role === allowed
    }

    // Helpers
    const columns: Col[] = [...(detail?.columns ?? [])].sort((a, b) => a.index - b.index).map(c => ({
        id: c.id,
        label: c.label,
        index: c.index,
        formula_content: c.formula_content ?? null,
        allowed_role: c.allowed_role ?? null,
        column_type: c.column_type ?? ColumnType.NORMAL,
        column_label: c.column_label ?? null,
    }))

    // 2 cột mặc định (Họ lót, Tên) — không cho chỉnh sửa/xóa
    const nameCols = columns.filter(c => c.column_label !== null)
    // Các cột điểm do user tạo
    const scoreCols = columns.filter(c => c.column_label === null)
    // Khi edit mode dùng localCols, khi không dùng scoreCols từ Redux
    const activeCols = isEditMode ? localCols : scoreCols

    // Cột Tên để sort rows
    const firstNameCol = nameCols.find(c => c.column_label === ColumnLabel.FIRST_NAME)

    // Sort rows theo Tên
    const sortedRows = [...rows].sort((a, b) => {
        const getVal = (row: typeof rows[0]) =>
            row.cells.find(c => c.column.id === firstNameCol?.id)?.value ?? ''
        return getVal(a).localeCompare(getVal(b), 'vi')
    })

    const toPayload = (cols: Col[]): UpdateScoreFormType["columns"] =>
        cols.map((c, i) => ({
            id: c.isNew ? undefined : c.id,
            label: c.label,
            formula_content: c.formula_content || undefined,
            allowed_role: c.allowed_role || undefined,
            column_type: c.column_type,
            index: String(i + 2),
        }))

    const submitUpdate = async (cols: Col[]) => {
        if (!detail) return false
        return ScoreFormsService.updateScoreForm({
            id: detail.id, classId: detail.class.id, label: detail.label,
            score_form_type: detail.score_form_type, description: detail.description ?? undefined,
            field_count: String(cols.length),
            is_auto_open: detail.is_auto_open, is_auto_close: detail.is_auto_close,
            is_deleted: detail.is_deleted, is_stopped: detail.is_stopped,
            open_at: detail.open_at ? new Date(detail.open_at) : null,
            close_at: detail.close_at ? new Date(detail.close_at) : null,
            columns: toPayload(cols),
        })
    }

    // Column actions — chỉ mutate localCols, không gọi API
    const addColumn = (afterIndex: number) => {
        const tempId = `new-${Date.now()}`
        const newCol: Col = {
            id: tempId,
            label: `Cột ${localCols.length + 1}`,
            index: afterIndex + 1,
            formula_content: null,
            allowed_role: null,
            column_type: ColumnType.NORMAL,
            column_label: null,
            isNew: true,
        }
        setLocalCols(prev => [
            ...prev.slice(0, afterIndex + 1),
            newCol,
            ...prev.slice(afterIndex + 1),
        ].map((c, i) => ({ ...c, index: i + 2 })))
        setSelectedColId(tempId)
    }

    const saveColumn = (colId: string | undefined, draft: DraftCol) => {
        setLocalCols(prev => prev.map(c =>
            c.id === colId ? {
                ...c,
                label: draft.label,
                column_type: draft.column_type,
                allowed_role: draft.allowed_role || null,
                formula_content: draft.formula_content || null,
                formulaInvalid: false,
            } : c
        ))
        setSelectedColId(null)
    }

    const moveColumn = (colId: string, direction: 'left' | 'right') => {
        setLocalCols(prev => {
            const idx = prev.findIndex(c => c.id === colId || (c.isNew && c.label === colId))
            if (direction === 'left' && idx === 0) return prev
            if (direction === 'right' && idx === prev.length - 1) return prev
            const updated = [...prev]
            const swapIdx = direction === 'left' ? idx - 1 : idx + 1
            ;[updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]]
            return updated.map((c, i) => ({ ...c, index: i + 2 }))
        })
    }

    const deleteColumn = (colId: string) => {
        const col = localCols.find(c => c.id === colId)
        if (!col) return

        // Tìm các cột có công thức tham chiếu đến cột này
        const affected = localCols.filter(c =>
            c.id !== colId && c.formula_content?.includes(`col[${colId}]`)
        )

        if (affected.length > 0) {
            confirmDialog({
                message: `Cột "${col.label}" đang được dùng trong công thức của: ${affected.map(c => `"${c.label}"`).join(', ')}. Các công thức đó sẽ bị xóa. Tiếp tục?`,
                header: 'Xóa cột ảnh hưởng công thức',
                acceptLabel: 'Xóa',
                rejectLabel: 'Hủy',
                acceptClassName: 'p-button-danger',
                accept: () => {
                    setLocalCols(prev => prev.map(c => {
                        if (c.id === colId) return { ...c, pendingDelete: true }
                        if (affected.find(a => a.id === c.id)) return { ...c, formulaInvalid: true, _savedFormula: c.formula_content, formula_content: null }
                        return c
                    }))
                    setSelectedColId(null)
                }
            })
        } else {
            confirmDialog({
                message: `Cột "${col.label}" sẽ bị xóa khi bạn lưu cấu trúc. Tiếp tục?`,
                header: 'Xóa cột',
                acceptLabel: 'Xóa',
                rejectLabel: 'Hủy',
                acceptClassName: 'p-button-danger',
                accept: () => {
                    setLocalCols(prev => prev.map(c => c.id === colId ? { ...c, pendingDelete: true } : c))
                    setSelectedColId(null)
                }
            })
        }
    }

    const undoDeleteColumn = (colId: string) => {
        setLocalCols(prev => prev.map(c => {
            if (c.id === colId) return { ...c, pendingDelete: false }
            if (c.formulaInvalid && c._savedFormula?.includes(`col[${colId}]`))
                return { ...c, formulaInvalid: false, formula_content: c._savedFormula, _savedFormula: undefined }
            return c
        }))
    }

    // Cell actions
    const getCellValue = (rowId: string, colId: string) =>
        rows.find(r => r.id === rowId)?.cells.find(c => c.column.id === colId)?.value ?? ""

    const commitCell = async (inputVal: string) => {
        if (!editingCell || !boardId) return
        const { rowId, colId } = editingCell
        const originalVal = originalCellVal.current
        const currentVal = getCellValue(rowId, colId)
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

        // Conflict: người khác đã đổi trong lúc đang nhập
        if (currentVal !== originalVal) {
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

    const handleToggleStop = async () => {
        if (!detail) return
        dispatch(changeStateFetching(true))
        try { await ScoreFormsService.toggleStop(detail.id, detail.class.id) }
        finally { dispatch(changeStateFetching(false)) }
    }

    const handleSaveSchedule = async () => {
        if (!detail) return
        setSavingSchedule(true)
        dispatch(changeStateFetching(true))
        try {
            await ScoreFormsService.updateScoreForm({
                id: detail.id, classId: detail.class.id, label: detail.label,
                score_form_type: detail.score_form_type, description: detail.description ?? undefined,
                field_count: String(scoreCols.length),
                is_auto_open: scheduleInfo.is_auto_open,
                is_auto_close: scheduleInfo.is_auto_close,
                is_deleted: detail.is_deleted, is_stopped: detail.is_stopped,
                open_at: scheduleInfo.open_at ? new Date(scheduleInfo.open_at) : null,
                close_at: scheduleInfo.close_at ? new Date(scheduleInfo.close_at) : null,
                columns: toPayload(scoreCols),
            })
        } finally {
            setSavingSchedule(false)
            dispatch(changeStateFetching(false))
        }
    }

    const handleDeleteScoreBoard = () => {
        if (!detail) return
        const isAccepted = detail.is_stopped

        if (isAccepted) {
            confirmDialog({
                header: "Lưu trữ bảng điểm",
                message: (
                    <p>Bảng điểm <b>"{detail.label}"</b> đã được duyệt và sẽ được <b>lưu trữ</b> (xóa mềm). Bạn có chắc chắn?</p>
                ),
                acceptLabel: "Lưu trữ",
                rejectLabel: "Hủy",
                accept: async () => {
                    dispatch(changeStateFetching(true))
                    try {
                        const result = await ScoreFormsService.softDeleteScoreForms([detail.id])
                        if (result) navigate(-1)
                    } finally { dispatch(changeStateFetching(false)) }
                }
            })
        } else {
            confirmDialog({
                header: "Xóa bảng điểm",
                message: (
                    <p>Bảng điểm <b>"{detail.label}"</b> chưa được duyệt và sẽ bị <b className="text-red-500">xóa vĩnh viễn</b>. Bạn có chắc chắn?</p>
                ),
                acceptLabel: "Xóa vĩnh viễn",
                rejectLabel: "Hủy",
                acceptClassName: "p-button-danger",
                accept: async () => {
                    dispatch(changeStateFetching(true))
                    try {
                        const result = await ScoreFormsService.hardDeleteScoreForms([detail.id])
                        if (result) navigate(-1)
                    } finally { dispatch(changeStateFetching(false)) }
                }
            })
        }
    }

    // Render
    if (loading) return (
        <div className="flex justify-center items-center h-64"><ScaleLoader color="#499c40" /></div>
    )
    if (!detail) return (
        <div className="flex justify-center items-center h-64 text-gray">Không tìm thấy bảng điểm</div>
    )

    const selectedCol = activeCols.find(c => c.id === selectedColId) ?? null
    const filledRows = rows.filter(r => scoreCols.some(c => getCellValue(r.id, c.id!) !== "")).length

    return (
        <div className="w-full flex flex-col gap-6 pt-topPadding pb-BottomPadding">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-lightGray dark:hover:bg-gray rounded-full transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 dark:stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-largeSize font-bold dark:text-white">{detail.label}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-tinySize font-bold ${detail.is_stopped ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                            {detail.is_stopped ? "Đã khóa" : "Đang hoạt động"}
                        </span>
                    </div>
                    {detail.description && <p className="text-smallSize text-gray mt-0.5">{detail.description}</p>}
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-smallSize text-gray dark:text-gray-400 mr-2">
                        <b className="text-mainColor dark:text-white">{filledRows}</b>/{rows.length} SV có điểm
                        {" · "}
                        <b className="dark:text-white">{columns.length}</b> cột
                    </span>
                    {detail.status !== "accept" && (
                        <button
                            onClick={handleDeleteScoreBoard}
                            disabled={isFetching}
                            title={detail.is_stopped ? "Lưu trữ bảng điểm" : "Xóa vĩnh viễn"}
                            className="p-2 hover:bg-red/10 text-red rounded-normal text-smallSize transition-all disableState flex items-center-safe gap-2.5 bg-redRGB"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4.5 stroke-red">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Xóa bảng điểm
                        </button>
                    )}
                    <button
                        onClick={handleToggleStop}
                        disabled={isFetching}
                        className={`px-4 py-2 border rounded-normal text-smallSize font-bold transition-colors disableState ${detail.is_stopped ? 'border-mainColor text-mainColor hover:bg-mainColor/5' : 'border-red/50 text-red hover:bg-red/5'}`}
                    >
                        {detail.is_stopped ? "Mở bảng điểm" : "Đóng bảng điểm"}
                    </button>

                    {isEditMode ? (
                        <>
                            <button
                                onClick={async () => {
                                    const toCommit = localCols.filter(c => !c.pendingDelete)
                                    dispatch(changeStateFetching(true))
                                    try {
                                        const result = await submitUpdate(toCommit)
                                        if (result) {
                                            setIsEditMode(false)
                                            setSelectedColId(null)
                                            setLocalCols([])
                                            setLocalColsSnapshot([])
                                            if (scoreFormOriginState) {
                                                handleToggleStop()
                                                setScoreFormOriginState(false)
                                            }
                                        }
                                    } finally { dispatch(changeStateFetching(false)) }
                                }}
                                disabled={isFetching}
                                className="px-4 py-2 bg-mainColor text-white rounded-normal text-smallSize font-bold hoverBtn disableState"
                            >
                                Lưu cấu trúc cột
                            </button>
                            <button
                                onClick={() => {
                                    setLocalCols(localColsSnapshot.map(c => ({ ...c })))
                                    setSelectedColId(null)
                                }}
                                disabled={isFetching}
                                className="px-4 py-2 border border-gray/20 dark:border-gray/30 rounded-normal text-smallSize font-bold text-black dark:text-white hover:bg-lightGray dark:hover:bg-gray/20 transition-colors disableState"
                            >
                                Hoàn tác
                            </button>
                            <button
                                onClick={toggleEditMode}
                                disabled={isFetching}
                                className="px-4 py-2 border border-red/30 rounded-normal text-smallSize font-bold text-red hover:bg-red/5 transition-colors disableState"
                            >
                                Hủy chỉnh sửa
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={toggleEditMode}
                            disabled={isFetching}
                            className="px-4 py-2 bg-mainColor text-white rounded-normal text-smallSize font-bold hoverBtn disableState"
                        >
                            Chỉnh sửa cột
                        </button>
                    )}
                </div>
            </div>

            {/* Section Thời hạn */}
            <div className="bg-white dark:bg-lightDark rounded-big border border-gray/10 p-5 flex flex-col gap-4">
                <p className="text-smallSize font-bold dark:text-white uppercase tracking-wider border-b border-gray/10 pb-2">Thời hạn</p>
                {isEditMode ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <p className="text-smallSize font-bold dark:text-white uppercase">Mở tự động</p>
                            <input type="checkbox" checked={scheduleInfo.is_auto_open} onChange={e => setScheduleInfo(s => ({ ...s, is_auto_open: e.target.checked, open_at: e.target.checked ? s.open_at : null }))} className="size-5 accent-mainColor" />
                        </div>
                        {scheduleInfo.is_auto_open && (
                            <div className="flex gap-2">
                                <input type="date" className="flex-1 border border-gray/20 dark:border-gray/30 rounded-normal px-3 py-2 dark:text-white outline-none text-smallSize focus:border-mainColor bg-transparent dark:bg-lightDark" value={formatToInputDate(scheduleInfo.open_at)} onChange={e => setScheduleInfo(s => ({ ...s, open_at: mergeDateTimeToISO(e.target.value, formatToInputTime(s.open_at)) }))} />
                                <input type="time" disabled={!formatToInputDate(scheduleInfo.open_at)} className="border border-gray/20 dark:border-gray/30 rounded-normal px-3 py-2 dark:text-white outline-none text-smallSize focus:border-mainColor bg-transparent dark:bg-lightDark disabled:opacity-30" value={formatToInputTime(scheduleInfo.open_at)} onChange={e => setScheduleInfo(s => ({ ...s, open_at: mergeDateTimeToISO(formatToInputDate(s.open_at), e.target.value) }))} />
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <p className="text-smallSize font-bold dark:text-white uppercase">Đóng tự động</p>
                            <input type="checkbox" checked={scheduleInfo.is_auto_close} onChange={e => setScheduleInfo(s => ({ ...s, is_auto_close: e.target.checked, close_at: e.target.checked ? s.close_at : null }))} className="size-5 accent-mainColor" />
                        </div>
                        {scheduleInfo.is_auto_close && (
                            <div className="flex gap-2">
                                <input type="date" className="flex-1 border border-gray/20 dark:border-gray/30 rounded-normal px-3 py-2 dark:text-white outline-none text-smallSize focus:border-mainColor bg-transparent dark:bg-lightDark" value={formatToInputDate(scheduleInfo.close_at)} onChange={e => setScheduleInfo(s => ({ ...s, close_at: mergeDateTimeToISO(e.target.value, formatToInputTime(s.close_at)) }))} />
                                <input type="time" disabled={!formatToInputDate(scheduleInfo.close_at)} className="border border-gray/20 dark:border-gray/30 rounded-normal px-3 py-2 dark:text-white outline-none text-smallSize focus:border-mainColor bg-transparent dark:bg-lightDark disabled:opacity-30" value={formatToInputTime(scheduleInfo.close_at)} onChange={e => setScheduleInfo(s => ({ ...s, close_at: mergeDateTimeToISO(formatToInputDate(s.close_at), e.target.value) }))} />
                            </div>
                        )}
                        {isScheduleDirty && <button onClick={handleSaveSchedule} disabled={savingSchedule} className="self-start px-5 py-2 bg-mainColor text-white rounded-normal text-smallSize font-bold hoverBtn disabled:opacity-50">
                            {savingSchedule ? "Đang lưu..." : "Lưu lịch"}
                        </button>}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <p className="text-smallSize dark:text-white font-bold uppercase">Mở tự động</p>
                            <p className={`text-[11px] font-bold ${detail.is_auto_open ? 'text-mainColor' : 'text-gray'}`}>{detail.is_auto_open ? "BẬT" : "TẮT"}</p>
                        </div>
                        {detail.is_auto_open && <p className="text-smallSize text-gray dark:text-gray-400 italic">{detail.open_at ? formatVNTime(detail.open_at) : "Chưa thiết lập"}</p>}
                        <div className="flex items-center justify-between">
                            <p className="text-smallSize dark:text-white font-bold uppercase">Đóng tự động</p>
                            <p className={`text-[11px] font-bold ${detail.is_auto_close ? 'text-red' : 'text-gray'}`}>{detail.is_auto_close ? "BẬT" : "TẮT"}</p>
                        </div>
                        {detail.is_auto_close && <p className="text-smallSize text-gray dark:text-gray-400 italic">{detail.close_at ? formatVNTime(detail.close_at) : "Chưa thiết lập"}</p>}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="rounded-big border border-gray/10 shadow-[0_0_10px_rgba(0,0,0,0.05)] overflow-hidden bg-white dark:bg-lightDark">
                <div className="overflow-x-auto overflow-y-auto max-h-[60vh] p-1">
                    <table className="table-auto text-left border-collapse">
                        <thead className="sticky top-0 z-20">
                            <tr className="border-b border-gray/10 bg-lightGray/50 dark:bg-gray/10">
                                {/* 2 cột mặc định: Họ lót, Tên — sticky, không chỉnh sửa */}
                                {nameCols.map(col => (
                                    <th key={col.id} className="px-5 py-4 text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-lightGray/50 dark:bg-gray/10 z-10">
                                        {col.label}
                                    </th>
                                ))}

                                {/* Các cột điểm */}
                                {activeCols.map((col, idx) => (
                                    <th key={col.id ?? `new-${idx}`} className={`px-2 py-2 whitespace-nowrap w-px group/col relative transition-opacity ${col.pendingDelete ? 'opacity-40' : ''}`}>
                                        {/* Nút di chuyển */}
                                        {detail.is_stopped && isEditMode && !col.pendingDelete && (
                                            <div className="opacity-0 group-hover/col:opacity-100 transition-opacity absolute top-[-5px] left-1/2 -translate-x-1/2 flex gap-5 z-10">
                                                <button onClick={e => { e.stopPropagation(); moveColumn(col.id!, 'left') }}
                                                    disabled={idx === 0}
                                                    title="Di chuyển sang trái"
                                                    className="w-5 h-4 rounded text-[10px] text-gray dark:text-gray-400 hover:bg-lightGray dark:hover:bg-gray disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                                    </svg>
                                                </button>
                                                <button onClick={e => { e.stopPropagation(); moveColumn(col.id!, 'right') }}
                                                    disabled={idx === activeCols.length - 1}
                                                    title="Di chuyển sang phải"
                                                    className="w-5 h-4 rounded text-[10px] text-gray dark:text-gray-400 hover:bg-lightGray dark:hover:bg-gray disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            {detail.is_stopped && isEditMode && !col.pendingDelete && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); addColumn(idx - 1) }}
                                                    title="Thêm cột bên trái"
                                                    className="opacity-0 group-hover/col:opacity-100 transition-opacity flex-shrink-0 w-5 h-5 rounded-full bg-mainColor text-white flex items-center justify-center text-xs font-bold hover:scale-110 mr-1"
                                                >+</button>
                                            )}
                                            <button
                                                onClick={() => isEditMode && setSelectedColId(selectedColId === (col.id ?? `new-${idx}`) ? null : (col.id ?? `new-${idx}`))}
                                                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-normal text-tinySize font-bold uppercase tracking-wider transition-colors
                                                    ${selectedColId === (col.id ?? `new-${idx}`) ? 'bg-mainColor text-white' : col.pendingDelete ? 'text-red-400 line-through' : 'text-gray dark:text-gray-400 hover:bg-lightGray dark:hover:bg-gray'}
                                                    ${!isEditMode ? 'cursor-default' : ''}`}
                                            >
                                                <span className="flex items-center gap-1">
                                                    {col.formulaInvalid && <span title="Công thức không hợp lệ">⚠️</span>}
                                                    {col.formula_content && !col.formulaInvalid && <span className="font-mono">ƒ</span>}
                                                    {col.label}
                                                    {col.isNew && <span className="text-[8px] px-1 py-0.5 rounded bg-green-100 text-green-600 normal-case font-bold">Mới</span>}
                                                </span>
                                                {col.formula_content && !col.formulaInvalid
                                                    ? <span className={`text-[8px] px-1 py-0.5 rounded normal-case font-bold ${selectedColId === (col.id ?? `new-${idx}`) ? 'bg-white/20 text-white' : 'bg-mainColor/10 text-mainColor'}`}>Tự động</span>
                                                    : !col.pendingDelete && <span className={`text-[8px] px-1 py-0.5 rounded normal-case font-bold ${selectedColId === (col.id ?? `new-${idx}`) ? 'bg-white/20 text-white' : 'bg-gray/10 text-gray'}`}>
                                                        {col.allowed_role ? VNColumnAllowedRole[col.allowed_role] : "Nhập tay"}
                                                    </span>
                                                }
                                            </button>
                                            {detail.is_stopped && isEditMode && !col.pendingDelete && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); addColumn(idx) }}
                                                    title="Thêm cột bên phải"
                                                    className="opacity-0 group-hover/col:opacity-100 transition-opacity flex-shrink-0 w-5 h-5 rounded-full bg-mainColor text-white flex items-center justify-center text-xs font-bold hover:scale-110 ml-1"
                                                >+</button>
                                            )}
                                        </div>
                                    </th>
                                ))}

                                {detail.is_stopped && isEditMode && (
                                    <th className="px-3 py-4">
                                        <button
                                            onClick={() => addColumn(activeCols.length - 1)}
                                            title="Thêm cột mới"
                                            className="w-7 h-7 rounded-full border-2 border-dashed border-gray/30 text-gray hover:border-mainColor hover:text-mainColor flex items-center justify-center text-sm font-bold transition-colors"
                                        >+</button>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className={selectedColId ? "hidden" : ""}>
                            {sortedRows.length === 0 ? (
                                <tr>
                                    <td colSpan={nameCols.length + activeCols.length + 1} className="px-5 py-10 text-center text-gray text-smallSize">
                                        Chưa có sinh viên nào trong bảng điểm này.
                                    </td>
                                </tr>
                            ) : sortedRows.map((row, idx) => (
                                <tr key={row.id} className={`border-b border-gray/5 hover:bg-lightGray/20 dark:hover:bg-gray/5 transition-colors ${idx === sortedRows.length - 1 ? "border-b-0" : ""}`}>
                                    {nameCols.map(col => (
                                        <td key={col.id} className="px-5 py-3 whitespace-nowrap sticky left-0 bg-white dark:bg-lightDark z-10">
                                            <p className="text-smallSize dark:text-white">{getCellValue(row.id, col.id!) || "—"}</p>
                                        </td>
                                    ))}
                                    {activeCols.map(col => {
                                        if (col.pendingDelete) return (
                                            <td key={col.id} className="px-4 py-3 text-center whitespace-nowrap w-px opacity-30">
                                                <span className="text-smallSize line-through text-gray">—</span>
                                            </td>
                                        )
                                        // Tính giá trị: công thức → computeFormulaValue, nhập tay → getCellValue
                                        const val = col.formula_content && !col.formulaInvalid
                                            ? (() => {
                                                const rowData = rows.find(r => r.id === row.id)
                                                if (!rowData) return ""
                                                const cellMap = new Map(rowData.cells.map(c => [c.column.id, c.value ?? ""]))
                                                return computeFormulaValue(col.formula_content!, cellMap) ?? ""
                                            })()
                                            : getCellValue(row.id, col.id ?? "")
                                        const isFormula = !!col.formula_content && !col.formulaInvalid
                                        const isEditing = editingCell?.rowId === row.id && editingCell?.colId === col.id
                                        const editable = canEditColumn(col)

                                        return (
                                            <td key={col.id ?? col.label} className="px-4 py-3 text-center whitespace-nowrap w-px">
                                                {col.formulaInvalid ? (
                                                    <span className="text-smallSize text-orange-400" title="Công thức không hợp lệ">⚠️</span>
                                                ) : isFormula ? (
                                                    <div className="relative group/tooltip w-full flex justify-center">
                                                        <span className={`text-smallSize ${val ? "font-bold text-mainColor" : "text-gray/40"}`}>
                                                            {val || "—"}
                                                        </span>
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tooltip:block z-50 pointer-events-none">
                                                            <div className="bg-dark dark:bg-lightDark border border-gray/20 rounded-normal px-2.5 py-1.5 shadow-lg flex items-center gap-1">
                                                                <span className="text-[11px] text-gray-400 font-mono mr-1">ƒ =</span>
                                                                <FormulaPreview formula={col.formula_content!} cols={activeCols} nowrap />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={cellInput}
                                                        onChange={e => setCellInput(e.target.value)}
                                                        onBlur={() => setEditingCell(null)}
                                                        onKeyDown={e => { if (e.key === "Enter") commitCell(cellInput); if (e.key === "Escape") { setCellInput(getCellValue(editingCell!.rowId, editingCell!.colId)); setEditingCell(null) } }}
                                                        autoFocus
                                                        className="w-20 px-2 py-1 border border-mainColor rounded-normal text-smallSize text-center outline-none dark:bg-dark dark:text-white"
                                                    />
                                                ) : (
                                                    <button
                                                        onClick={() => { if (!detail.is_stopped && editable && !isFetching) { originalCellVal.current = val; setEditingCell({ rowId: row.id, colId: col.id! }); setCellInput(val) } }}
                                                        disabled={detail.is_stopped || !editable || isFetching}
                                                        title={detail.is_stopped ? "Bảng điểm đã khóa" : !editable ? "Bạn không có quyền nhập cột này" : "Nhấn để nhập điểm"}
                                                        className={`min-w-12 px-2 py-1 rounded text-smallSize transition-colors disableState ${val ? "font-bold text-mainColor" : "text-gray/40"} ${(!detail.is_stopped && editable) ? "hover:bg-lightGray dark:hover:bg-gray cursor-pointer" : "cursor-default opacity-60"}`}
                                                    >
                                                        {val || "—"}
                                                    </button>
                                                )}
                                            </td>
                                        )
                                    })}
                                    {detail.is_stopped && isEditMode && <td />}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Column settings panel — hiện bên dưới bảng khi click cột */}
                {selectedCol && isEditMode && (
                    <ColumnSettingsPanel
                        key={selectedCol.id ?? selectedCol.label}
                        col={selectedCol}
                        allCols={columns}
                        onSave={(draft) => saveColumn(selectedCol.id, draft)}
                        onDelete={() => deleteColumn(selectedCol.id!)}
                        onUndoDelete={() => undoDeleteColumn(selectedCol.id!)}
                    />
                )}
            </div>
        </div>
    )
}

export default RAScoreboardsDetail
