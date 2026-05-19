import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import ScoreFormsService from "../../../services/scoreforms/scoreforms.service"
import { VNScoreFormTag } from "../../../config/enum"
import formatVNTime from "../../../utils/formatVNTime"
import { ScaleLoader } from "react-spinners"

const SDScoreboards: React.FC = () => {
    const { classId } = useParams<{ classId: string }>()
    const navigate = useNavigate()
    const pagination = useSelector((state: RootState) => state.scoreForm.scoreFormPagination)
    const scoreforms = pagination?.data ?? []
    const [loading, setLoading] = useState(true)

    const loadScoreforms = async () => {
        if (!classId) return
        setLoading(true)
        await ScoreFormsService.scoreFormsPagination(1, 100, classId)
        setLoading(false)
    }

    useEffect(() => {
        loadScoreforms()
    }, [classId])

    return (
        <div className="w-full h-fit flex flex-col gap-8 py-mainTwoSidePadding">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-hugeSize font-bold dark:text-white leading-tight">Điểm số của tôi</h1>
                <p className="text-normalSize text-gray dark:text-gray font-medium">Danh sách các đầu điểm và bảng điểm trong lớp học</p>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <ScaleLoader color="#499c40" />
                </div>
            ) : scoreforms.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-gray">
                    <p className="font-medium">Chưa có bảng điểm nào được công bố</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scoreforms.map(sf => (
                        <div
                            key={sf.id}
                            onClick={() => navigate(sf.id)}
                            className="group p-6 bg-white dark:bg-lightDark border border-lightGray dark:border-darkGray rounded-small hover:border-mainColor/30 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col gap-4"
                        >
                            <div className="flex flex-col gap-1">
                                <h3 className="text-normalSize font-bold dark:text-white group-hover:text-mainColor transition-colors">{sf.label}</h3>
                                <p className="text-[11px] text-mainColor font-bold uppercase tracking-wider">{VNScoreFormTag[sf.score_form_type]}</p>
                                {sf.description && (
                                    <p className="text-smallSize text-gray dark:text-gray font-light line-clamp-2">{sf.description}</p>
                                )}
                            </div>

                            <div className="pt-3 border-t border-gray/5 flex justify-between items-center">
                                <p className="text-[10px] text-gray italic">Cập nhật: {formatVNTime(sf.update_at)}</p>
                                <span className={`px-2.5 py-1 rounded-full text-tinySize font-bold ${sf.is_stopped ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                    {sf.is_stopped ? "Đã chốt" : "Đang cập nhật"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SDScoreboards
