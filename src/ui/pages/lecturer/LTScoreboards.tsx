import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import ScoreFormsService from "../../../services/scoreforms/scoreforms.service"
import { VNScoreFormTag } from "../../../config/enum"
import formatVNTime from "../../../utils/formatVNTime"
import { ScaleLoader } from "react-spinners"

const LTScoreboards: React.FC = () => {
    const { classId } = useParams<{ classId: string }>()
    const navigate = useNavigate()
    const pagination = useSelector((state: RootState) => state.scoreForm.scoreFormPagination)
    const scoreforms = pagination?.data ?? []
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const loadScoreforms = async () => {
        if (!classId) return
        setLoading(true)
        await ScoreFormsService.scoreFormsPagination(1, 100, undefined, false, undefined, classId)
        setLoading(false)
    }

    useEffect(() => {
        loadScoreforms()
    }, [classId])

    const filtered = scoreforms.filter(sf =>
        sf.label.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="w-full h-fit flex flex-col gap-8 py-mainTwoSidePadding">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <h1 className="text-hugeSize font-bold dark:text-white leading-tight">Quản lý chấm điểm</h1>
                    <p className="text-normalSize text-gray dark:text-gray font-medium">Chọn bảng điểm để thực hiện nhập điểm</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </span>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm kiếm bảng điểm..."
                    className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-lightDark shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-transparent focus:border-mainColor/30 rounded-normal dark:text-white transition-all outline-none"
                />
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
                    <p className="font-medium">Không tìm thấy bảng điểm nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
                    {filtered.map(sf => (
                        <div
                            key={sf.id}
                            onClick={() => navigate(sf.id)}
                            className="flex flex-col gap-4 p-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-big bg-white dark:bg-lightDark border border-transparent hover:cursor-pointer hover:border-mainColor/20 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-mainColor/5 transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-mainColor scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                            <div className="flex justify-between items-start gap-2">
                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <h3 className="text-normalSize font-bold dark:text-white group-hover:text-mainColor transition-colors truncate">{sf.label}</h3>
                                    <p className="text-[11px] text-mainColor font-bold uppercase tracking-wider">{VNScoreFormTag[sf.score_form_type]}</p>
                                    {sf.description && (
                                        <p className="text-smallSize text-gray font-light line-clamp-1">{sf.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-gray/5">
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[11px] text-gray font-medium">Cập nhật: {formatVNTime(sf.update_at)}</p>
                                </div>
                                <span className={`flex items-center gap-1.5 text-tinySize font-bold px-2.5 py-1 rounded-full ${sf.is_stopped ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                    {sf.is_stopped ? "Đã khóa" : "Hoạt động"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LTScoreboards
