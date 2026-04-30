import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { ScaleLoader } from "react-spinners"
import type { RootState } from "../../../redux/store"
import SubmissionService from "../../../services/submission/submission.service"
import { SubmissionStatus } from "../../../config/enum"
import formatVNTime from "../../../utils/formatVNTime"
import { useDebounce } from "../../../hooks/Debounce"

const PAGE_SIZE = 10

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
    [SubmissionStatus.PENDING]: { label: "Chờ duyệt", className: "bg-yellow-50 text-yellow-600" },
    [SubmissionStatus.RECEIVE]: { label: "Đã nhận", className: "bg-blue-50 text-blue-600" },
    [SubmissionStatus.ACCEPT]: { label: "Đã duyệt", className: "bg-green-50 text-mainColor" },
    [SubmissionStatus.REJECT]: { label: "Từ chối", className: "bg-red-50 text-red" },
}

const RASubmissions: React.FC = () => {
    const navigate = useNavigate()
    const classInfo = useSelector((state: RootState) => (state as any).class.currentClass.info)
    const paginationData = useSelector((state: RootState) => state.submission.submissionPagination)

    const submissions = paginationData?.data ?? []
    const pagination = paginationData?.pagination ?? { total: 0, page: 1, totalPages: 1 }

    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search, 400)

    useEffect(() => { setPage(1) }, [debouncedSearch, statusFilter])

    useEffect(() => {
        if (!classInfo.id) return
        setLoading(true)
        const params: any = { page: String(page), size: String(PAGE_SIZE), classId: classInfo.id }
        if (debouncedSearch) params.search = debouncedSearch
        if (statusFilter) params.status = statusFilter
        SubmissionService.getSubmissionPagination(params).finally(() => setLoading(false))
    }, [page, debouncedSearch, statusFilter, classInfo.id])

    return (
        <div className="w-full flex flex-col gap-6 pt-topPadding pb-BottomPadding">
            <h1 className="text-largeSize font-bold dark:text-white">Quản lý bài nộp</h1>

            {/* Filters */}
            <div className="flex gap-3 max-md:flex-col">
                <div className="relative flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray dark:text-white/40 pointer-events-none">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Tìm theo tên sinh viên, biểu mẫu..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-lightDark border border-gray/10 rounded-normal text-smallSize dark:text-white outline-none focus:border-mainColor/40 transition-colors"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-3 py-2.5 bg-white dark:bg-lightDark border border-gray/10 rounded-normal text-smallSize dark:text-white outline-none focus:border-mainColor/40 transition-colors"
                >
                    <option value="">Tất cả trạng thái</option>
                    {Object.entries(STATUS_LABEL).map(([val, { label }]) => (
                        <option key={val} value={val}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-lightDark rounded-big border border-gray/10 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20"><ScaleLoader color="#499c40" /></div>
                ) : submissions.length === 0 ? (
                    <div className="py-20 text-center text-gray text-smallSize italic">Không có bài nộp nào.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray/10 bg-lightGray/50 dark:bg-gray/10">
                                    <th className="px-5 py-3 text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Sinh viên</th>
                                    <th className="px-5 py-3 text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Biểu mẫu</th>
                                    <th className="px-5 py-3 text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Thời gian nộp</th>
                                    <th className="px-5 py-3 text-[11px] font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((s, idx) => {
                                    const statusInfo = STATUS_LABEL[s.status] ?? { label: s.status, className: "bg-gray/10 text-gray" }
                                    return (
                                        <tr key={s.id} className={`border-b border-gray/5 hover:bg-lightGray/20 dark:hover:bg-gray/5 transition-colors ${idx === submissions.length - 1 ? "border-b-0" : ""}`}>
                                            <td className="px-5 py-3">
                                                <p className="text-smallSize font-medium dark:text-white">{s.user.full_name}</p>
                                                <p className="text-[11px] text-gray">{s.user.email}</p>
                                            </td>
                                            <td className="px-5 py-3">
                                                <p className="text-smallSize dark:text-white">{s.form.label}</p>
                                            </td>
                                            <td className="px-5 py-3 whitespace-nowrap">
                                                <p className="text-smallSize text-gray dark:text-gray-400">{formatVNTime(s.created_at)}</p>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-tinySize font-bold ${statusInfo.className}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <button
                                                    onClick={() => navigate(s.id)}
                                                    className="text-[11px] font-bold text-mainColor hover:opacity-70 transition-opacity"
                                                >
                                                    Xem →
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray dark:text-gray-400">
                        Tổng <b className="text-black dark:text-white">{pagination.total}</b> bài nộp
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-normal border border-gray/20 text-smallSize text-gray dark:text-gray-400 hover:bg-lightGray dark:hover:bg-gray/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >←</button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                            .reduce<(number | "...")[]>((acc, p, i, arr) => {
                                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...")
                                acc.push(p)
                                return acc
                            }, [])
                            .map((p, i) => p === "..." ? (
                                <span key={`ellipsis-${i}`} className="px-2 text-gray">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => setPage(p as number)}
                                    className={`px-3 py-1.5 rounded-normal border text-smallSize font-bold transition-colors ${page === p ? 'bg-mainColor text-white border-mainColor' : 'border-gray/20 text-gray dark:text-gray-400 hover:bg-lightGray dark:hover:bg-gray/20'}`}
                                >{p}</button>
                            ))}
                        <button
                            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                            disabled={page === pagination.totalPages}
                            className="px-3 py-1.5 rounded-normal border border-gray/20 text-smallSize text-gray dark:text-gray-400 hover:bg-lightGray dark:hover:bg-gray/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >→</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RASubmissions
