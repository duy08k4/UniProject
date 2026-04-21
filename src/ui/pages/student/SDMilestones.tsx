import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import ProgressService from "../../../services/progress/progress.service"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import RANewProgress from "../../components/RANewProgress"
import Loading from "../../components/Loading"
import formatVNTime from "../../../utils/formatVNTime"

const SDMilestones: React.FC = () => {
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const progress = useSelector((state: RootState) => state.progress.currentProgress)
    const dispatch = useDispatch()


    const { classId } = useParams()

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

        return <RANewProgress />
    }

    return (
        <div className="w-full h-fit flex flex-col gap-5 pt-topPadding pb-20">
            <span className="flex items-center-safe gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-mainColor">
                    <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                    <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clipRule="evenodd" />
                </svg>

                <p className="text-mainColor italic">Bạn chỉ có thể truy cập khi quy trình có trạng thái '<b><i><u className="text-mainColor"> Đã duyệt</u></i></b>'</p>
            </span>

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
                    <div key={milestone.id} className="relative mb-12 last:mb-0 group" onClick={() => { alert("Nhớ thêm chức năng xem chi tiết cột mốc. Chưa duyệt là không cho mở chi tiết") }} >
                        <div className={`absolute left-[-42px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md z-10 transition-all bg-mainColor`}>
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
}

export default SDMilestones
