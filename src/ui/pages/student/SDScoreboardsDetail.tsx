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
    const scoreCols = columns.filter(c => c.column_label === null)
    const myRow = rows[0]

    const getCellValue = (colId: string) =>
        myRow?.cells.find(c => c.column.id === colId)?.value ?? null

    if (loading) return <div className="flex justify-center items-center h-64"><ScaleLoader color="#499c40" /></div>
    if (!detail) return <div className="flex justify-center items-center h-64 text-gray">Không tìm thấy bảng điểm</div>

    // Tìm cột tổng kết (formula hoặc cột cuối)
    const summaryCol = scoreCols.find(c => c.formula_content) ?? scoreCols.at(-1)

    return (
        <div className="w-full flex flex-col gap-6 pt-topPadding pb-BottomPadding max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-start gap-3">
                <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-lightGray dark:hover:bg-gray rounded-full transition-colors shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 dark:stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-largeSize font-bold dark:text-white">{detail.label}</h1>
                    {detail.description && <p className="text-smallSize text-gray mt-0.5">{detail.description}</p>}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-tinySize font-bold ${detail.is_stopped ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                            {detail.is_stopped ? "Điểm đã chốt" : "Đang cập nhật"}
                        </span>
                        {detail.is_auto_open && detail.open_at && !detail.is_stopped && (
                            <span className="text-[11px] text-blue-500 font-medium">⏱ Mở lúc {formatVNTime(detail.open_at)}</span>
                        )}
                        {detail.is_auto_close && detail.close_at && !detail.is_stopped && (
                            <span className="text-[11px] text-orange-500 font-medium">⏱ Chốt điểm lúc {formatVNTime(detail.close_at)}</span>
                        )}
                    </div>
                </div>
            </div>

            {!myRow ? (
                <div className="p-12 bg-white dark:bg-lightDark rounded-big border border-gray/10 text-center flex flex-col items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 text-gray/30">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                    </svg>
                    <p className="text-gray text-smallSize">Bạn chưa có dữ liệu điểm trong bảng này</p>
                </div>
            ) : (
                <>
                    {/* Điểm tổng kết nổi bật */}
                    {summaryCol && (
                        <div className="bg-white dark:bg-lightDark rounded-big border border-gray/10 p-6 flex items-center justify-between shadow-sm">
                            <div className="flex flex-col gap-1">
                                <p className="text-[11px] font-bold text-gray uppercase tracking-wider">{summaryCol.label}</p>
                                <p className="text-smallSize text-gray/60">{summaryCol.formula_content ? "Điểm tổng kết (tính tự động)" : "Điểm tổng kết"}</p>
                            </div>
                            <div className="flex items-end gap-1.5">
                                <span className={`text-5xl font-black leading-none ${getCellValue(summaryCol.id!) ? "text-mainColor" : "text-gray/20"}`}>
                                    {getCellValue(summaryCol.id!) ?? "—"}
                                </span>
                                {getCellValue(summaryCol.id!) && <span className="text-smallSize text-gray pb-1">điểm</span>}
                            </div>
                        </div>
                    )}

                    {/* Các cột điểm thành phần */}
                    {scoreCols.filter(c => c.id !== summaryCol?.id).length > 0 && (
                        <div className="bg-white dark:bg-lightDark rounded-big border border-gray/10 overflow-hidden shadow-sm">
                            <div className="px-5 py-3 border-b border-gray/10">
                                <p className="text-smallSize font-bold dark:text-white">Điểm thành phần</p>
                            </div>
                            <div className="divide-y divide-gray/5">
                                {scoreCols.filter(c => c.id !== summaryCol?.id).map(col => {
                                    const val = getCellValue(col.id!)
                                    return (
                                        <div key={col.id} className="flex items-center justify-between px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                {col.formula_content && <span className="text-[10px] font-mono text-mainColor/60">ƒ</span>}
                                                <p className="text-smallSize dark:text-white">{col.label}</p>
                                            </div>
                                            <span className={`text-normalSize font-bold ${val ? "text-mainColor" : "text-gray/30"}`}>
                                                {val ?? "—"}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Ghi chú */}
            <p className="text-[11px] text-gray/60 dark:text-gray/40 text-center">
                {detail.is_stopped
                    ? "Điểm đã được chốt. Nếu có thắc mắc, vui lòng liên hệ giảng viên hoặc quản lý lớp."
                    : "Điểm có thể thay đổi cho đến khi bảng điểm được chốt."}
            </p>
        </div>
    )
}

export default SDScoreboardsDetail
