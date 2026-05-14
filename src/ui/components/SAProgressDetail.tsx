import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import type { RootState } from "../../redux/store"
import { useEffect } from "react"
import ProgressService from "../../services/progress/progress.service"
import { changeStateFetching } from "../../redux/reducers/global.reducer"
import Loading from "./Loading"
import getShortName from "../../utils/getShortName"
import formatVNTime from "../../utils/formatVNTime"
import { confirmDialog } from "primereact/confirmdialog"

const SAProgressDetail: React.FC = () => {
    const { classId, progressId } = useParams() // Use progressId slug to update progress id
    const userData = useSelector((state: RootState) => state.auth.user.info)

    const currentProgress = useSelector((state: RootState) => state.progress.currentProgress)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Get progressId
    useEffect(() => {
        if (!classId || !userData.id) return
        (async () => {
            dispatch(changeStateFetching(true))

            await ProgressService.getProgressDetail(classId).finally(() => {
                dispatch(changeStateFetching(false))
            })
        })()
    }, [userData.id, classId])

    const handleUpdateProgressData = async (data: { is_banned?: boolean, created_approval?: boolean }) => {
        if (!classId || !progressId) return

        dispatch(changeStateFetching(true))

        await ProgressService.updateProgressInfo({ classId, progressId, ...data }).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    const handleRemoveProgress = async () => {
        if (!currentProgress || !classId || !progressId) return

        confirmDialog({
            header: "Xóa quy trình",
            message: <p>Bạn đang xóa quy trình <b className="text-red">{currentProgress.label}</b>. Hành động này không thể khôi phục.</p>,

            acceptLabel: "Tiếp tục",
            rejectLabel: "Hủy",

            accept: async () => {
                dispatch(changeStateFetching(true))

                await ProgressService.removeProgress([progressId]).finally(() => {
                    dispatch(changeStateFetching(false))
                    navigate(`/super-admin/progresses`)
                })

            }
        })
    }

    if (!currentProgress || currentProgress.id !== progressId || currentProgress.class.id !== classId || !userData.id) return <Loading />

    return (
        <div className="relative w-full h-full flex flex-col gap-5 py-mainTwoSidePadding">
            {/* Header Area */}
            <div className="w-full h-fit flex justify-between items-center-safe">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 flex-wrap">
                        <h1 className="text-hugeSize font-semibold dark:text-white line-clamp-1">{currentProgress.label}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <p className="text-normalSize text-mainColor font-medium italic">ID: {currentProgress.id}</p>
                    </div>
                </div>

                <div className="sticky top-0 h-fit flex gap-3">
                    {currentProgress.is_deleted ? (
                        <div className="px-6 py-2.5 bg-redRGB text-red rounded-normal font-semibold hoverBtn transition-all shadow-md">Đã xóa</div>

                    ) : (
                        <>
                            {!currentProgress.created_approval && currentProgress.is_submitted && (
                                <button className="px-6 py-2.5 bg-mainColor text-white rounded-normal font-semibold hoverBtn transition-all shadow-md disableState" disabled={isFetching} onClick={() => { handleUpdateProgressData({ created_approval: true }) }}>Duyệt quy trình</button>
                            )}

                            <button className={`px-6 py-2.5 ${currentProgress.is_banned ? "bg-gray/20 text-gray border-gray" : "bg-orangedRGB text-oranged border-oranged/30"} border rounded-normal font-semibold hoverBtn transition-all disableState`} disabled={isFetching} onClick={() => { handleUpdateProgressData({ is_banned: !currentProgress.is_banned }) }}>
                                {currentProgress.is_banned ? "Gỡ đình chỉ" : "Đình chỉ"}
                            </button>

                            {!currentProgress.is_deleted && (
                                <button className="px-6 py-2.5 bg-redRGB text-red border border-red/30 rounded-normal font-semibold hoverBtn transition-all disableState" disabled={isFetching} onClick={handleRemoveProgress}>Xóa quy trình</button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Layout Content */}
            <div className="w-full flex gap-8 mt-4">
                {/* Side Info Panel */}
                <div className="sticky top-10 h-fit w-[30%] flex flex-col gap-6">
                    {/* Stats or Status info */}
                    <div className="p-6 border-[0.5px] border-lightGray dark:border-gray rounded-normal bg-white dark:bg-black/10 flex flex-col gap-4 shadow-sm">
                        <h3 className="font-bold dark:text-white uppercase text-mobile-smallSize text-gray tracking-widest">Trạng thái quy trình</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-normal bg-lighterGray dark:bg-white/5 flex flex-col items-center border border-lightGray/20">
                                <span className="text-hugeSize font-bold text-mainColor leading-none">{currentProgress.milestones.length}</span>
                                <span className="text-[10px] text-gray uppercase font-bold mt-1">Giai đoạn</span>
                            </div>

                            <div className="p-3 rounded-normal bg-lighterGray dark:bg-white/5 flex flex-col items-center border border-lightGray/20">
                                <span className="text-hugeSize font-bold text-red leading-none">{currentProgress.milestones.filter(m => m.is_deleted).length}</span>
                                <span className="text-[10px] text-gray uppercase font-bold mt-1">Bị xóa</span>
                            </div>
                        </div>

                        <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-mainColor"></div>
                                <p className="text-smallSize text-gray">Duyệt khởi tạo:
                                    {currentProgress.created_approval ? (
                                        <b className="text-mainColor ml-1">Đã duyệt</b>
                                    ) : (
                                        <b className="text-red ml-1"> Chưa duyệt</b>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-mainColor"></div>
                                <p className="text-smallSize text-gray">Trạng thái đình chỉ:
                                    {currentProgress.is_banned ? (
                                        <b className="text-oranged ml-1">Đình chỉ</b>
                                    ) : (
                                        <b className="text-gray ml-1">Không</b>
                                    )}

                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Source info */}
                    <div className="p-6 border-[0.5px] border-lightGray dark:border-gray rounded-normal bg-white dark:bg-black/10 flex flex-col gap-5 shadow-sm">

                        <div className="flex flex-col gap-5">
                            <div className="space-y-2">
                                <p className="text-mobile-smallSize text-gray uppercase tracking-widest font-bold">Người tạo</p>

                                <div className="flex items-center-safe gap-3 p-2.5 rounded-medium bg-lighterGray/50 dark:bg-white/5 border border-lightGray/30 dark:border-gray/30">
                                    <span className="w-12 h-12 rounded-full bg-mainColor text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                                        {getShortName(currentProgress.createdBy.full_name)}
                                    </span>

                                    <div className="overflow-hidden">
                                        <p className="font-bold dark:text-white text-mediumSize leading-tight truncate">{currentProgress.createdBy.full_name}</p>
                                        <p className="text-smallSize text-gray truncate">{currentProgress.createdBy.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-mobile-smallSize text-gray uppercase tracking-widest font-bold">Lớp học</p>

                                <div className="p-4 rounded-medium border border-mainColor/20 bg-mainColor/5">
                                    <p className="font-bold text-mainColor text-normalSize line-clamp-1">{currentProgress.class.label}</p>

                                    <div className="mt-2 space-y-1">
                                        <p className="text-smallSize dark:text-gray font-medium">Mã lớp: <span className="text-black dark:text-white uppercase font-bold tracking-wider">{currentProgress.class.join_code}</span></p>
                                        <p className="text-smallSize dark:text-gray font-medium">Môn học: <span className="text-black dark:text-white italic">{currentProgress.class.subject}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t-[0.5px] border-lightGray dark:border-gray pt-4 flex flex-col gap-3">
                            <div className="flex justify-between items-center text-smallSize">
                                <span className="text-gray italic">Ngày khởi tạo:</span>
                                <span className="text-black dark:text-white font-bold tracking-tight">{formatVNTime(currentProgress.created_at)}</span>
                            </div>

                            <div className="flex justify-between items-center text-smallSize">
                                <span className="text-gray italic">Cập nhật cuối:</span>
                                <span className="text-black dark:text-white font-bold tracking-tight">{formatVNTime(currentProgress.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Details Area */}
                <div className="flex-1 flex flex-col gap-8">
                    {/* Description Section */}
                    {currentProgress.description && (
                        <div className="p-8 border-[0.5px] border-lightGray dark:border-gray rounded-normal bg-white dark:bg-black/20 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-mainColor"></div>
                            <h3 className="font-bold dark:text-white uppercase text-mediumSize text-gray tracking-widest mb-4">Mô tả quy trình</h3>

                            <p className="text-normalSize dark:text-white leading-relaxed whitespace-pre-line italic text-gray/80">
                                {currentProgress.description}
                            </p>
                        </div>
                    )}

                    {/* Milestones Area */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-bold dark:text-white uppercase text-mediumSize text-gray tracking-widest flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 stroke-mainColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-3.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>

                                Các cột mốc ({currentProgress.milestones.length})
                            </h3>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Milestone Item Example */}
                            {currentProgress.milestones.map((milestone) => (
                                <div key={milestone.id} className="group relative p-6 border-[0.5px] border-lightGray dark:border-gray rounded-normal bg-white dark:bg-black/10 flex gap-6 items-start hover:border-mainColor/50 hover:shadow-md transition-all">
                                    <div className="w-14 h-14 rounded-full bg-mainColor/10 text-mainColor flex items-center justify-center font-bold text-bigSize shrink-0 shadow-inner group-hover:bg-mainColor group-hover:text-white transition-colors duration-300">
                                        {milestone.index + 1}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold dark:text-white text-mediumSize group-hover:text-mainColor transition-colors">{milestone.label}</h4>
                                            <div className="flex gap-2">
                                                {milestone.is_stopped ? (
                                                    <span className="px-3 py-0.5 rounded-full bg-redRGB text-red text-[10px] font-bold uppercase tracking-wider border border-red/20">Đã dừng</span>
                                                ) : (
                                                    <span className="px-3 py-0.5 rounded-full bg-mainColor/10 text-mainColor text-[10px] font-bold uppercase tracking-wider border border-mainColor/20">Hoạt động</span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-smallSize text-gray leading-snug">{milestone.description}</p>

                                        <div className="mt-4 flex gap-6 text-[11px]  items-center italic">
                                            <p className="flex items-center gap-1 text-gray">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5 stroke-gray">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                                Cập nhật: {formatVNTime(milestone.updated_at)}
                                            </p>

                                            <span className="flex items-center gap-1 font-bold text-mainColor/70 not-italic">
                                                ID: {milestone.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SAProgressDetail
