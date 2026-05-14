import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { ScaleLoader } from "react-spinners"
import type { RootState } from "../../../redux/store"
import { store } from "../../../redux/store"
import ScoreFormsService from "../../../services/scoreforms/scoreforms.service"
import { setCurrentScoreForm, setScoreFormRows } from "../../../redux/reducers/scoreformSlice.reducer"
import formatVNTime from "../../../utils/formatVNTime"
import { ColumnLabel } from "../../../config/enum"
import { computeFormulaValue } from "../../../utils/computeFormulaValue"

const SDScoreboardsDetail: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>()
    const navigate = useNavigate()

    const detail = useSelector((state: RootState) => state.scoreForm.currentScoreForm)
    const rows = useSelector((state: RootState) => state.scoreForm.scoreFormRows)

    const [loading, setLoading] = useState(true)

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

    const columns = [...(detail?.columns ?? [])].sort((a, b) => a.index - b.index)
    const nameCols = columns.filter(c => c.column_label !== null)
    const scoreCols = columns.filter(c => c.column_label === null)
    const myRow = rows[0]

    const getCellValue = (colId: string) => {
        const col = columns.find(c => c.id === colId)
        if (col?.formula_content && myRow) {
            const cellMap = new Map(myRow.cells.filter(c => c.value !== null).map(c => [c.column.id, c.value as string]))
            return computeFormulaValue(col.formula_content, cellMap) ?? "—"
        }
        return myRow?.cells.find(c => c.column.id === colId)?.value ?? "—"
    }

    if (loading) return <div className="flex justify-center items-center h-64"><ScaleLoader color="#499c40" /></div>
    if (!detail) return <div className="flex justify-center items-center h-64 text-gray">Không tìm thấy bảng điểm</div>

    return (
        <div className="w-full flex flex-col gap-5 pt-topPadding pb-BottomPadding">
            {/* Back + Header */}
            <div className="flex items-start gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-lightGray dark:hover:bg-gray rounded-full transition-colors shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 dark:stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-largeSize font-bold dark:text-white">{detail.label}</h1>
                    {detail.description && <p className="text-smallSize text-gray mt-0.5">{detail.description}</p>}
                </div>
            </div>

            {/* Info card */}
            <div className="bg-white dark:bg-lightDark rounded-big border border-gray/10 px-5 py-4 flex flex-wrap gap-x-6 gap-y-2 items-center">
                <span className={`px-2.5 py-0.5 rounded-full text-tinySize font-bold ${detail.is_stopped ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {detail.is_stopped ? "Điểm đã chốt" : "Đang cập nhật"}
                </span>
                {detail.is_auto_open && detail.open_at && (
                    <span className="text-[11px] text-blue-500 font-medium">⏱ Mở lúc {formatVNTime(detail.open_at)}</span>
                )}
                {detail.is_auto_close && detail.close_at && (
                    <span className="text-[11px] text-orange-500 font-medium">⏱ Chốt điểm lúc {formatVNTime(detail.close_at)}</span>
                )}
                {!detail.is_stopped && (
                    <span className="text-[11px] text-gray dark:text-gray/60 ml-auto">Điểm có thể thay đổi cho đến khi bảng điểm được chốt.</span>
                )}
            </div>

            {/* Bảng điểm dạng A4 */}
            {!myRow ? (
                <div className="p-12 bg-white dark:bg-lightDark rounded-big border border-gray/10 text-center text-gray text-smallSize">
                    Bạn chưa có dữ liệu điểm trong bảng này.
                </div>
            ) : (
                <div className="bg-white dark:bg-lightDark rounded-big border border-gray/10 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray/10 bg-lightGray/50 dark:bg-gray/10">
                                    {nameCols.map(col => (
                                        <th key={col.id} className="px-5 py-3 text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                            {col.label}
                                        </th>
                                    ))}
                                    {scoreCols.map(col => (
                                        <th key={col.id} className="px-5 py-3 text-center whitespace-nowrap">
                                            <div className="flex flex-col gap-0.5 items-center">
                                                <span className="text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    {col.formula_content && <span className="font-mono text-mainColor/60 text-[10px]">ƒ</span>}
                                                    {col.label}
                                                </span>
                                                {col.formula_content
                                                    ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-mainColor/10 text-mainColor font-bold">Tự động</span>
                                                    : <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray/10 text-gray font-bold">Nhập tay</span>
                                                }
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {nameCols.map(col => (
                                        <td key={col.id} className="px-5 py-4 whitespace-nowrap">
                                            <p className="text-smallSize dark:text-white font-medium">
                                                {col.column_label === ColumnLabel.LAST_NAME || col.column_label === ColumnLabel.FIRST_NAME
                                                    ? (myRow.cells.find(c => c.column.id === col.id)?.value ?? "—")
                                                    : "—"}
                                            </p>
                                        </td>
                                    ))}
                                    {scoreCols.map(col => {
                                        const val = getCellValue(col.id!)
                                        return (
                                            <td key={col.id} className="px-5 py-4 text-center whitespace-nowrap">
                                                <span className={`text-normalSize font-bold ${val && val !== "—" ? "text-mainColor" : "text-gray/30"}`}>
                                                    {val}
                                                </span>
                                            </td>
                                        )
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SDScoreboardsDetail
