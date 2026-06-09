import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ScaleLoader } from "react-spinners"
import type { RootState } from "../../../redux/store"
import { store } from "../../../redux/store"
import ScoreFormsService from "../../../services/scoreforms/scoreforms.service"
import { setCurrentScoreForm, setScoreFormRows } from "../../../redux/reducers/scoreformSlice.reducer"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { ColumnLabel, VNColumnAllowedRole } from "../../../config/enum"
import { confirmDialog } from "primereact/confirmdialog"
import formatVNTime from "../../../utils/formatVNTime"
import { computeFormulaValue } from "../../../utils/computeFormulaValue"
import FormulaPreview from "../../components/FormulaPreview"
import ApproveDialog from "../../components/ApproveDialog"

const SAScoreboardsDetail: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const detail = useSelector((state: RootState) => state.scoreForm.currentScoreForm)
    const rows = useSelector((state: RootState) => state.scoreForm.scoreFormRows)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const [loading, setLoading] = useState(true)
    const [showApproveDialog, setShowApproveDialog] = useState(false)
    const [approving, setApproving] = useState(false)

    useEffect(() => {
        if (!boardId) return
        store.dispatch(setCurrentScoreForm(null))
        store.dispatch(setScoreFormRows([]))
        setLoading(true)
        Promise.all([
            ScoreFormsService.getScoreFormDetail(boardId),
            ScoreFormsService.getScoreFormRows(boardId),
        ]).finally(() => setLoading(false))
    }, [boardId])

    const columns = [...(detail?.columns ?? [])].sort((a, b) => a.index - b.index).map(c => ({
        id: c.id,
        label: c.label,
        index: c.index,
        formula_content: c.formula_content ?? null,
        allowed_role: c.allowed_role ?? null,
        column_label: c.column_label ?? null,
    }))

    const nameCols = columns.filter(c => c.column_label !== null)
    const scoreCols = columns.filter(c => c.column_label === null)
    const firstNameCol = nameCols.find(c => c.column_label === ColumnLabel.FIRST_NAME)

    const sortedRows = [...rows].sort((a, b) => {
        const getVal = (row: typeof rows[0]) =>
            row.cells.find(c => c.column.id === firstNameCol?.id)?.value ?? ''
        return getVal(a).localeCompare(getVal(b), 'vi')
    })

    const getCellValue = (rowId: string, colId: string) =>
        rows.find(r => r.id === rowId)?.cells.find(c => c.column.id === colId)?.value ?? ""

    const filledRows = rows.filter(r => scoreCols.some(c => getCellValue(r.id, c.id!) !== "")).length

    const handleToggleStop = async () => {
        if (!detail) return
        dispatch(changeStateFetching(true))
        try { await ScoreFormsService.toggleStop(detail.id, detail.class.id) }
        finally { dispatch(changeStateFetching(false)) }
    }

    const handleDelete = () => {
        if (!detail) return
        if (detail.status === "accept") {
            confirmDialog({
                header: "Lưu trữ bảng điểm",
                message: <p>Bảng điểm <b>"{detail.label}"</b> đã được duyệt và sẽ được <b>lưu trữ</b> (xóa mềm). Bạn có chắc chắn?</p>,
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
                message: <p>Bảng điểm <b>"{detail.label}"</b> chưa được duyệt và sẽ bị <b className="text-red-500">xóa vĩnh viễn</b>. Bạn có chắc chắn?</p>,
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

    if (loading) return (
        <div className="flex justify-center items-center h-64"><ScaleLoader color="#499c40" /></div>
    )
    if (!detail) return (
        <div className="flex justify-center items-center h-64 text-gray">Không tìm thấy bảng điểm</div>
    )

    return (
        <div className="w-full flex flex-col gap-6 pt-topPadding pb-BottomPadding">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-lightGray dark:hover:bg-gray rounded-full transition-colors shrink-0">
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

                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-smallSize text-gray dark:text-gray-400 mr-2">
                        <b className="text-mainColor dark:text-white">{filledRows}</b>/{rows.length} SV có điểm
                        {" · "}
                        <b className="dark:text-white">{columns.length}</b> cột
                    </span>
                    {detail.status !== "accept" && (
                        <button
                            onClick={handleDelete}
                            disabled={isFetching}
                            title={detail.is_stopped ? "Lưu trữ bảng điểm" : "Xóa vĩnh viễn"}
                            className="p-2 hover:bg-red/10 text-red rounded-normal text-smallSize transition-all disableState flex items-center gap-2.5 bg-redRGB"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4.5 stroke-red">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Xóa bảng điểm
                        </button>
                    )}
                    <button
                        onClick={handleToggleStop}
                        disabled={isFetching || detail.status === 'accept'}
                        className={`px-4 py-2 border rounded-normal text-smallSize font-bold transition-colors disableState ${detail.is_stopped ? 'border-mainColor text-mainColor hover:bg-mainColor/5' : 'border-red/50 text-red hover:bg-red/5'} ${detail.status === 'accept' ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                        {detail.is_stopped ? "Mở bảng điểm" : "Đóng bảng điểm"}
                    </button>

                    {detail.is_stopped && detail.status !== 'accept' && (
                        <button
                            onClick={() => setShowApproveDialog(true)}
                            disabled={isFetching || approving}
                            className="px-4 py-2 bg-mainColor text-white rounded-normal text-smallSize font-bold hoverBtn disableState"
                        >
                            Duyệt bảng điểm
                        </button>
                    )}

                    {detail.status === 'accept' && (
                        <span className="px-3 py-1.5 bg-mainColor/10 text-mainColor rounded-normal text-smallSize font-bold flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 stroke-mainColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            Đã duyệt
                        </span>
                    )}
                </div>
            </div>

            {/* Section Thời hạn */}
            <div className="bg-white dark:bg-lightDark rounded-big border border-gray/10 p-5 flex flex-col gap-4">
                <p className="text-smallSize font-bold dark:text-white uppercase tracking-wider border-b border-gray/10 pb-2">Thời hạn</p>
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
            </div>

            {/* Table */}
            <div className="rounded-big border border-gray/10 shadow-[0_0_10px_rgba(0,0,0,0.05)] overflow-hidden bg-white dark:bg-lightDark">
                <div className="overflow-x-auto overflow-y-auto max-h-[60vh] p-1">
                    <table className="table-auto text-left border-collapse">
                        <thead className="sticky top-0 z-20">
                            <tr className="border-b border-gray/10 bg-lightGray/50 dark:bg-gray/10">
                                {nameCols.map(col => (
                                    <th key={col.id} className="px-5 py-4 text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-lightGray/50 dark:bg-gray/10 z-10">
                                        {col.label}
                                    </th>
                                ))}
                                {scoreCols.map(col => (
                                    <th key={col.id} className="px-2 py-2 whitespace-nowrap w-px">
                                        <div className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-normal text-tinySize font-bold uppercase tracking-wider text-gray dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                {col.formula_content && <span className="font-mono">ƒ</span>}
                                                {col.label}
                                            </span>
                                            {col.formula_content
                                                ? <span className="text-[8px] px-1 py-0.5 rounded normal-case font-bold bg-mainColor/10 text-mainColor">Tự động</span>
                                                : <span className="text-[8px] px-1 py-0.5 rounded normal-case font-bold bg-gray/10 text-gray">
                                                    {col.allowed_role ? VNColumnAllowedRole[col.allowed_role] : "Nhập tay"}
                                                </span>
                                            }
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRows.length === 0 ? (
                                <tr>
                                    <td colSpan={nameCols.length + scoreCols.length} className="px-5 py-10 text-center text-gray text-smallSize">
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
                                    {scoreCols.map(col => {
                                        const val = col.formula_content
                                            ? (() => {
                                                const rowData = rows.find(r => r.id === row.id)
                                                if (!rowData) return ""
                                                const cellMap = new Map(rowData.cells.map(c => [c.column.id, c.value ?? ""]))
                                                return computeFormulaValue(col.formula_content!, cellMap) ?? ""
                                            })()
                                            : getCellValue(row.id, col.id ?? "")

                                        return (
                                            <td key={col.id} className="px-4 py-3 text-center whitespace-nowrap w-px">
                                                {col.formula_content ? (
                                                    <div className="relative group/tooltip w-full flex justify-center">
                                                        <span className={`text-smallSize ${val ? "font-bold text-mainColor" : "text-gray/40"}`}>
                                                            {val || "—"}
                                                        </span>
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tooltip:block z-50 pointer-events-none">
                                                            <div className="bg-dark dark:bg-lightDark border border-gray/20 rounded-normal px-2.5 py-1.5 shadow-lg flex items-center gap-1">
                                                                <span className="text-[11px] text-gray-400 font-mono mr-1">ƒ =</span>
                                                                <FormulaPreview formula={col.formula_content!} cols={scoreCols} nowrap />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className={`text-smallSize ${val ? "font-bold text-mainColor" : "text-gray/40"}`}>
                                                        {val || "—"}
                                                    </span>
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

            <ApproveDialog
                visible={showApproveDialog}
                label={detail.label}
                loading={approving}
                onHide={() => setShowApproveDialog(false)}
                onConfirm={async () => {
                    setApproving(true)
                    await ScoreFormsService.approveScoreForm(detail.id, detail.class.id)
                    setApproving(false)
                    setShowApproveDialog(false)
                }}
            />
        </div>
    )
}

export default SAScoreboardsDetail
