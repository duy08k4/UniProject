import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ScaleLoader } from "react-spinners"
import type { RootState } from "../../redux/store"
import { store } from "../../redux/store"
import SubmissionService from "../../services/submission/submission.service"
import { SubmissionStatus } from "../../config/enum"
import formatVNTime from "../../utils/formatVNTime"
import type { SubmissionListItem } from "../../services/submission/submission.type"
import FormViewer from "./FormViewer"
import type { DetailForm } from "../../services/forms/forms.type"
import { useDebounce } from "../../hooks/Debounce"
import { confirmDialog } from "primereact/confirmdialog"
import { changeStateFetching } from "../../redux/reducers/global.reducer"

const PAGE_SIZE = 10

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
    [SubmissionStatus.PENDING]: { label: "Chờ duyệt", className: "bg-yellow-50 text-yellow-600" },
    [SubmissionStatus.RECEIVE]: { label: "Đã nhận", className: "bg-blue-50 text-blue-600" },
    [SubmissionStatus.ACCEPT]: { label: "Đã duyệt", className: "bg-green-50 text-mainColor" },
    [SubmissionStatus.REJECT]: { label: "Từ chối", className: "bg-red-50 text-red" },
}

interface Props {
    form: DetailForm
    classId: string
    onClose: () => void
}

const RAFormSubmissions: React.FC<Props> = ({ form, classId, onClose }) => {
    const dispatch = useDispatch()
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const [submissions, setSubmissions] = useState<SubmissionListItem[]>([])
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 400)
    const [statusFilter, setStatusFilter] = useState("")
    const [selected, setSelected] = useState<SubmissionListItem | null>(null)
    const [updating, setUpdating] = useState(false)

    const fetchData = async (p = page, s = debouncedSearch, sf = statusFilter) => {
        setLoading(true)
        dispatch(changeStateFetching(true))
        const params: any = { page: String(p), size: String(PAGE_SIZE), classId, formId: form.id }
        if (s) params.search = s
        if (sf) params.status = sf
        const result = await SubmissionService.getSubmissionPagination(params)
        if (result) {
            const data = store.getState().submission.submissionPagination
            if (data) {
                setSubmissions(data.data)
                setPagination(data.pagination)
            }
        }
        setLoading(false)
        dispatch(changeStateFetching(false))
    }

    useEffect(() => { setPage(1) }, [debouncedSearch, statusFilter])
    useEffect(() => { fetchData(page, debouncedSearch, statusFilter) }, [page, debouncedSearch, statusFilter])

    const updateLocalStatus = (ids: string[], status: string) => {
        setSubmissions(prev => prev.map(s => ids.includes(s.id) ? { ...s, status: status as SubmissionListItem['status'] } : s))
        if (selected && ids.includes(selected.id)) {
            setSelected(prev => prev ? { ...prev, status: status as SubmissionListItem['status'] } : null)
        }
    }

    const handleUpdateOne = async (status: 'accept' | 'reject') => {
        if (!selected) return
        setUpdating(true)
        dispatch(changeStateFetching(true))
        const ok = await SubmissionService.updateStatus([selected.id], status)
        if (ok) updateLocalStatus([selected.id], status)
        setUpdating(false)
        dispatch(changeStateFetching(false))
    }

    const handleUpdateAll = (status: 'accept' | 'reject') => {
        if (!submissions.length) return
        const label = status === 'accept' ? 'duyệt' : 'từ chối'
        confirmDialog({
            header: `Xác nhận ${label} tất cả`,
            message: `Bạn sắp ${label} ${submissions.length} câu trả lời trên trang này. Hành động này sẽ gửi mail thông báo đến từng người.`,
            acceptLabel: "Xác nhận", rejectLabel: "Hủy",
            accept: async () => {
                setUpdating(true)
                dispatch(changeStateFetching(true))
                const ids = submissions.map((s: SubmissionListItem) => s.id)
                const ok = await SubmissionService.updateStatus(ids, status)
                if (ok) { updateLocalStatus(ids, status); setSelected(null) }
                setUpdating(false)
                dispatch(changeStateFetching(false))
            }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm">
            {/* Left 30% */}
            <div className="w-[25%] h-full bg-white dark:bg-bgDark flex flex-col border-r border-gray/10">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray/10 flex items-center justify-between">
                    <div>
                        <p className="font-bold dark:text-white text-smallSize line-clamp-1">{form.label}</p>
                        <p className="text-tinySize text-gray">{pagination.total} câu trả lời</p>
                    </div>

                    <button onClick={onClose} className="p-1.5 hover:bg-gray/10 rounded-normal transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-gray dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="px-4 py-2 border-b border-gray/10 flex flex-col gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm theo tên, email..."
                        disabled={isFetching}
                        className="w-full px-3 py-1.5 border border-gray/20 rounded-normal text-smallSize dark:bg-lightDark dark:text-white outline-none focus:border-mainColor/40 transition-colors disableState"
                    />

                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        disabled={isFetching}
                        className="w-full px-3 py-1.5 border border-gray/20 rounded-normal text-smallSize dark:bg-lightDark dark:text-white outline-none disableState"
                    >
                        <option value="">Tất cả trạng thái</option>
                        {Object.entries(STATUS_LABEL).map(([val, { label }]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-10"><ScaleLoader color="#499c40" height={10} width={4} /></div>
                    ) : submissions.length === 0 ? (
                        <p className="text-center text-gray text-smallSize italic py-10">Chưa có câu trả lời nào.</p>
                    ) : submissions.map((s: SubmissionListItem) => {
                        const statusInfo = STATUS_LABEL[s.status] ?? { label: s.status, className: "bg-gray/10 text-gray" }
                        return (
                            <div
                                key={s.id}
                                onClick={() => setSelected(s)}
                                className={`px-4 py-3 border-b border-gray/5 cursor-pointer hover:bg-lightGray/30 dark:hover:bg-white/5 transition-colors ${selected?.id === s.id ? "bg-mainColor/5 border-l-2 border-l-mainColor" : ""}`}
                            >
                                <p className="text-smallSize font-medium dark:text-white">{s.user.full_name}</p>
                                <p className="text-tinySize text-gray">{s.user.email}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-tinySize font-bold ${statusInfo.className}`}>{statusInfo.label}</span>
                                    <span className="text-tinySize text-gray">{formatVNTime(s.created_at)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Pagination */}
                <div className="px-4 py-2 border-t border-gray/10 flex items-center justify-between">
                    <span className="text-tinySize text-gray dark:text-white/60">Trang {page}/{pagination.totalPages || 1}</span>
                    
                    <div className="flex gap-1">
                        <button disabled={page === 1 || isFetching} onClick={() => setPage(1)} className="px-3 py-2 text-smallSize border border-gray/20 rounded-normal disabled:opacity-30 dark:text-white dark:border-white/20 disableState">«</button>
                        <button disabled={page === 1 || isFetching} onClick={() => setPage(p => p - 1)} className="px-3 py-2 text-smallSize border border-gray/20 rounded-normal disabled:opacity-30 dark:text-white dark:border-white/20 disableState">‹</button>
                        <button disabled={page >= pagination.totalPages || isFetching} onClick={() => setPage(p => p + 1)} className="px-3 py-2 text-smallSize border border-gray/20 rounded-normal disabled:opacity-30 dark:text-white dark:border-white/20 disableState">›</button>
                        <button disabled={page >= pagination.totalPages || isFetching} onClick={() => setPage(pagination.totalPages)} className="px-3 py-2 text-smallSize border border-gray/20 rounded-normal disabled:opacity-30 dark:text-white dark:border-white/20 disableState">»</button>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="px-4 py-3 border-t border-gray/10 flex gap-2">
                    <button
                        onClick={() => handleUpdateAll('accept')}
                        disabled={isFetching || updating || !submissions.length || submissions.every((s: SubmissionListItem) => s.status === 'accept')}
                        className="flex-1 py-2 bg-mainColor text-white text-tinySize font-bold rounded-normal hoverBtn disableState"
                    >
                        Duyệt tất cả
                    </button>

                    <button
                        onClick={() => handleUpdateAll('reject')}
                        disabled={isFetching || updating || !submissions.length || submissions.every((s: SubmissionListItem) => s.status === 'reject')}
                        className="flex-1 py-2 bg-redRGB text-red text-tinySize font-bold rounded-normal hoverBtn disableState"
                    >
                        Từ chối tất cả
                    </button>
                </div>
            </div>

            {/* Right 70% */}
            <div className="flex-1 h-full flex flex-col bg-lighterGray dark:bg-[#1e1e1e]">
                {/* Header */}
                <div className="px-5 py-3 border-b border-gray/10 bg-white dark:bg-lightDark flex items-center gap-3">
                    {selected ? (
                        <>
                            <div className="flex-1">
                                <p className="font-bold dark:text-white text-smallSize">{selected.user.full_name}</p>
                                <p className="text-tinySize text-gray">{selected.user.email}</p>
                            </div>

                            <button
                                onClick={() => handleUpdateOne('accept')}
                                disabled={isFetching || updating || selected.status === 'accept'}
                                className="px-4 py-1.5 bg-mainColor text-white text-smallSize font-bold rounded-normal hoverBtn disableState"
                            >
                                {updating ? <ScaleLoader height={10} width={3} color="white" /> : "Chấp nhận"}
                            </button>
                            
                            <button
                                onClick={() => handleUpdateOne('reject')}
                                disabled={isFetching || updating || selected.status === 'reject'}
                                className="px-4 py-1.5 bg-redRGB text-red text-smallSize font-bold rounded-normal hoverBtn disableState"
                            >
                                Từ chối
                            </button>
                        </>
                    ) : (
                        <p className="text-smallSize text-gray italic">Chọn một câu trả lời để xem</p>
                    )}
                </div>

                {/* FormViewer */}
                <div className="flex-1 overflow-y-auto flex justify-center-safe">
                    {selected ? (
                        <FormViewer
                            key={selected.id}
                            formId={form.id}
                            classIdProp={classId}
                            isFullScreen={false}
                            readonly
                            onClose={() => setSelected(null)}
                            viewUserId={selected.user.id}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray italic text-smallSize">
                            Chọn một câu trả lời từ danh sách bên trái
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RAFormSubmissions
