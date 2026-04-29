import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import ProgressService from "../../../services/progress/progress.service"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import RANewProgress from "../../components/RANewProgress"
import Loading from "../../components/Loading"
import formatVNTime from "../../../utils/formatVNTime"

const NonProgress: React.FC = () => {
    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-6 p-10 bg-white dark:bg-lightDark rounded-normal shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-lightGray/10 mt-5">
            {/* Icon Lock với hiệu ứng Ping nhẹ để tạo sự chú ý */}
            <div className="relative">
                <div className="absolute inset-0 bg-red/10 rounded-full animate-ping"></div>
                <div className="relative bg-redRGB/10 p-6 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-16 stroke-red">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </div>
            </div>

            {/* Nội dung thông báo */}
            <div className="flex flex-col items-center text-center gap-2">
                <h2 className="text-hugeSize font-bold text-gray dark:text-white uppercase tracking-wider">Quy trình đang đợi duyệt</h2>
                <p className="text-normalSize text-gray dark:text-gray/70 italic max-w-md">
                    Hiện tại quy trình thực hiện đồ án của lớp học chưa được phê duyệt. Bạn sẽ có thể xem chi tiết các cột mốc ngay sau khi trạng thái chuyển thành 'Đã duyệt'.
                </p>
            </div>
        </div>
    )
}

const SDMilestones: React.FC = () => {
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const progress = useSelector((state: RootState) => state.progress.currentProgress)
    const dispatch = useDispatch()


    const { classId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (!classId || !userData.id) return

        (async () => {
            dispatch(changeStateFetching(true))

            await ProgressService.getProgressDetail(classId).finally(() => {
                dispatch(changeStateFetching(false))
            })
        })()
    }, [userData.id, classId])

    const refreshProgress = async () => {
        if (!classId || !userData.id) return

        dispatch(changeStateFetching(true))

        await ProgressService.getProgressDetail(classId).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    if (!classId || !progress || !progress.id) {
        if (isFetching) return <Loading />

        return <NonProgress />
    }

    if (progress.created_approval) {
        return (
            <div className="w-full h-fit flex flex-col gap-5 pt-topPadding pb-20">
                {/* Quy trình Header Card */}
                <div className="flex flex-col gap-5 p-7 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex items-center-safe gap-1">
                        <h2 className="flex-1 text-hugeSize font-bold dark:text-white uppercase line-clamp-1">{progress.label}</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1 border-t border-gray/10 pt-5">
                        <div className="flex flex-col gap-1">
                            <p className="text-smallSize text-gray dark:text-gray italic font-medium">Trạng thái gửi yêu cầu duyệt:</p>
                            <p className={`text-normalSize font-semibold ${progress.is_submitted ? "text-mainColor" : "text-red"}`}>{progress.is_submitted ? "Đã gửi" : "Chưa gửi"}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-smallSize text-gray dark:text-gray italic font-medium">Trạng thái duyệt:</p>
                            <p className={`text-normalSize font-semibold ${progress.created_approval ? "text-mainColor" : "text-red"}`}>{progress.created_approval ? "Đã duyệt" : "Chưa duyệt"}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-smallSize text-gray dark:text-gray italic font-medium">Thời gian khởi tạo:</p>
                            <p className="text-normalSize font-semibold dark:text-white">{formatVNTime(progress.created_at)}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 border-t border-gray/10 pt-5">
                        <p className="text-smallSize text-gray dark:text-gray italic font-medium">Mô tả quy trình:</p>
                        <p className="text-normalSize dark:text-white leading-relaxed line-clamp-4">{progress.description}</p>
                    </div>
                </div>

                {/* Tool Bar */}
                <div className="sticky top-0 z-20 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center-safe justify-between gap-5 py-5 border-b border-lightGray/10 dark:border-white/5">
                    <button className="h-full flex items-center-safe gap-2.5 px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-small hoverBtn disableState" disabled={isFetching} onClick={refreshProgress}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white max-sm:size-3.5 stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>

                        <p className="dark:text-white">Làm mới</p>
                    </button>
                </div>

                {/* Timeline View */}
                <div className="flex flex-col relative ml-12 mt-5">
                    {/* Đường kẻ dọc nối các cột mốc */}
                    <div className="absolute left-[-26px] top-0 bottom-0 w-0.5 bg-mainColor/20 dark:bg-white/10 rounded-full"></div>

                    {progress.milestones.map((milestone) => (
                        <div key={milestone.id} className="relative mb-12 last:mb-0 group" onClick={() => navigate(milestone.id)}>                            <div className={`absolute left-[-42px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md z-10 transition-all bg-mainColor`}>
                            {milestone.index > 0 ? milestone.index : "X"}
                        </div>

                            <div className="bg-white dark:bg-lightDark rounded-normal p-6 shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-lightGray/20 dark:border-white/5 flex flex-col gap-4">
                                <div className="flex justify-between items-center-safe gap-4">
                                    <h3 className="text-largeSize font-bold dark:text-white tracking-tight capitalize">
                                        {milestone.label}
                                    </h3>

                                    <span className={`flex items-center px-4 py-1.5 rounded-normal text-smallSize font-bold uppercase ${milestone.is_stopped ? "bg-redRGB text-red" : "bg-mainColorRGB text-mainColor"}`}>
                                        {milestone.is_stopped ? "Đã dừng" : "Hoạt động"}
                                    </span>
                                </div>

                                <p className="text-normalSize text-gray dark:text-white/60 leading-relaxed italic max-w-4xl">
                                    "{milestone.description}"
                                </p>

                                <div className="flex flex-wrap gap-x-10 gap-y-3 pt-5 mt-2 border-t border-lightGray/10 dark:border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-tinySize text-gray dark:text-gray uppercase font-bold tracking-tighter">Ngày khởi tạo</span>
                                        <span className="text-smallSize font-semibold dark:text-white">{milestone.created_at}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-tinySize text-gray dark:text-gray uppercase font-bold tracking-tighter">Cập nhật cuối</span>
                                        <span className="text-smallSize font-semibold dark:text-white">{milestone.updated_at}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    } else {
        return <NonProgress />
    }
}

export default SDMilestones
