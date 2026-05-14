import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { confirmDialog } from "primereact/confirmdialog"
import { ScaleLoader } from "react-spinners"
import type { RootState } from "../../../redux/store"
import ScoreFormsService from "../../../services/scoreforms/scoreforms.service"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import formatVNTime from "../../../utils/formatVNTime"
import { VNScoreFormTag, VNScoreFormStatus } from "../../../config/enum"

const SAScoreBoardManagement: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const pagination = useSelector((state: RootState) => state.scoreForm.scoreFormPagination)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const scoreforms = pagination?.data ?? []
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            await ScoreFormsService.scoreFormsPagination(1, 100, undefined, false)
            setLoading(false)
        }
        load()
    }, [])

    const [filterStatus, setFilterStatus] = useState("")
    const [filterType, setFilterType] = useState("")
    const [filterApproval, setFilterApproval] = useState("")

    const filtered = scoreforms.filter(sf => {
        const matchSearch = sf.label.toLowerCase().includes(search.toLowerCase()) ||
            sf.class?.label?.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === "" ? true : filterStatus === "open" ? !sf.is_stopped : sf.is_stopped
        const matchType = filterType === "" || sf.score_form_type === filterType
        const matchApproval = filterApproval === "" ? true : filterApproval === "pending" ? sf.status !== "accept" : sf.status === "accept"
        return matchSearch && matchStatus && matchType && matchApproval
    })

    const handleDelete = (sf: typeof scoreforms[0]) => {
        if (sf.is_stopped) {
            confirmDialog({
                header: "Lưu trữ bảng điểm",
                message: <p>Bảng điểm <b>"{sf.label}"</b> đã được duyệt và sẽ được <b>lưu trữ</b> (xóa mềm). Bạn có chắc chắn?</p>,
                acceptLabel: "Lưu trữ",
                rejectLabel: "Hủy",
                accept: async () => {
                    dispatch(changeStateFetching(true))
                    try { await ScoreFormsService.softDeleteScoreForms([sf.id]) }
                    finally { dispatch(changeStateFetching(false)) }
                }
            })
        } else {
            confirmDialog({
                header: "Xóa bảng điểm",
                message: <p>Bảng điểm <b>"{sf.label}"</b> chưa được duyệt và sẽ bị <b className="text-red-500">xóa vĩnh viễn</b>. Bạn có chắc chắn?</p>,
                acceptLabel: "Xóa vĩnh viễn",
                rejectLabel: "Hủy",
                acceptClassName: "p-button-danger",
                accept: async () => {
                    dispatch(changeStateFetching(true))
                    try { await ScoreFormsService.hardDeleteScoreForms([sf.id]) }
                    finally { dispatch(changeStateFetching(false)) }
                }
            })
        }
    }

    return (
        <div className="w-full h-fit flex flex-col gap-5 pt-topPadding pb-BottomPadding">
            <div>
                <h1 className="text-hugeSize font-semibold dark:text-white">Quản lý bảng điểm</h1>
                <p className="text-normalSize text-gray">Quản lý tất cả bảng điểm của các lớp</p>
            </div>

            <div className="sticky top-0 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center gap-5 py-5">
                <span className="relative flex items-center w-1/2 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="h-10 w-full pl-2.5 focus:[&+#underlineSearch]:w-full dark:text-white outline-none bg-transparent"
                        placeholder="Tìm kiếm tên bảng điểm hoặc tên lớp..."
                    />
                    <span id="underlineSearch" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px transition-all duration-300" />
                </span>

                <span className="flex gap-1.5 items-center">
                    <p className="font-bold dark:text-white">Trạng thái:</p>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white dark:bg-bgDark">
                        <option value="">Tất cả</option>
                        <option value="open">Đang mở</option>
                        <option value="closed">Đã khóa</option>
                    </select>
                </span>

                <span className="flex gap-1.5 items-center">
                    <p className="font-bold dark:text-white">Loại:</p>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white dark:bg-bgDark">
                        <option value="">Tất cả</option>
                        {Object.entries(VNScoreFormTag).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </span>

                <span className="flex gap-1.5 items-center">
                    <p className="font-bold dark:text-white">Duyệt:</p>
                    <select value={filterApproval} onChange={e => setFilterApproval(e.target.value)} className="border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white dark:bg-bgDark">
                        <option value="">Tất cả</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="accept">Đã duyệt</option>
                    </select>
                </span>

                <span className="flex gap-1.5 items-center">
                    <p className="font-bold dark:text-white">Số lượng:</p>
                    <p className="dark:text-white">{filtered.length} bảng điểm</p>
                </span>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <ScaleLoader color="#499c40" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-gray">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 opacity-30">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                    </svg>
                    <p className="font-medium">{search ? "Không tìm thấy bảng điểm phù hợp" : "Chưa có bảng điểm nào"}</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
                    {filtered.map(sf => {
                        const statusInfo = VNScoreFormStatus[sf.status] ?? { label: sf.status, color: "text-gray" }
                        return (
                            <div
                                key={sf.id}
                                onClick={() => navigate(sf.id)}
                                className="flex flex-col bg-white dark:bg-lightDark rounded-big border border-gray/10 hover:border-mainColor/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-mainColor/5 transition-all duration-300 hover:cursor-pointer group overflow-hidden"
                            >
                                {/* Top accent bar */}
                                <div className={`h-1 w-full ${sf.is_stopped ? 'bg-red-400' : 'bg-mainColor'}`} />

                                <div className="flex flex-col gap-4 p-5">
                                    {/* Title row */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                            <h3 className="text-normalSize font-bold dark:text-white group-hover:text-mainColor transition-colors truncate leading-snug">{sf.label}</h3>
                                            {sf.description && (
                                                <p className="text-smallSize text-gray line-clamp-1">{sf.description}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={e => { e.stopPropagation(); handleDelete(sf) }}
                                            disabled={isFetching}
                                            title={sf.is_stopped ? "Lưu trữ" : "Xóa vĩnh viễn"}
                                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray hover:text-red-500 rounded-full transition-colors flex-shrink-0 disableState"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Tags row */}
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-mainColor/8 text-mainColor dark:bg-mainColor/15">
                                            {VNScoreFormTag[sf.score_form_type] ?? sf.score_form_type}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${statusInfo.color} bg-gray/8 dark:bg-gray/15`}>
                                            {statusInfo.label}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${sf.is_stopped ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : 'bg-blue-50 text-blue-500 dark:bg-blue-900/20'}`}>
                                            {sf.is_stopped ? "Đã khóa" : "Đang mở"}
                                        </span>
                                    </div>

                                    {/* Info grid */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3 border-t border-gray/8">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-[10px] text-gray uppercase tracking-wider font-medium">Lớp học</p>
                                            <p className="text-smallSize font-semibold dark:text-white truncate">{sf.class?.label ?? "—"}</p>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-[10px] text-gray uppercase tracking-wider font-medium">Số cột</p>
                                            <p className="text-smallSize font-semibold dark:text-white">{sf.field_count} cột</p>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-[10px] text-gray uppercase tracking-wider font-medium">Người tạo</p>
                                            <p className="text-smallSize dark:text-white truncate">{sf.createdBy?.full_name ?? "—"}</p>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-[10px] text-gray uppercase tracking-wider font-medium">Cập nhật</p>
                                            <p className="text-smallSize dark:text-white">{formatVNTime(sf.update_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default SAScoreBoardManagement
