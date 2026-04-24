import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import { store } from "../../../redux/store"
import type { MilestoneShortDetail } from "../../../services/progress/progress.type"
import RANewProgress from "../../components/RANewProgress"
import Loading from "../../components/Loading"
import ProgressService from "../../../services/progress/progress.service"
import { useNavigate, useParams } from "react-router-dom"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import formatVNTime from "../../../utils/formatVNTime"
import { confirmDialog } from "primereact/confirmdialog"
import { toast } from "sonner"
import TopicsService from "../../../services/topics/topics.service"
import type { TopicDetail } from "../../../services/topics/topics.type"
import { VNThesisType, VNTopicStatus } from "../../../config/enum"

const RAMilestones: React.FC = () => {
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const progress = useSelector((state: RootState) => state.progress.currentProgress)

    const { classId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [milestones, setMilestones] = useState<(MilestoneShortDetail & { isNew?: boolean, markedDeleted?: boolean, tempId?: string })[]>([])
    const [isAdding, setIsAdding] = useState(false)
    const [backup, setBackup] = useState<(MilestoneShortDetail & { isNew?: boolean, markedDeleted?: boolean, tempId?: string })[]>([])

    const [milestoneErrorTempID, setMilestoneErrorTempID] = useState<string[]>([])

    // Topics for registration milestone
    const [registrationTopics, setRegistrationTopics] = useState<TopicDetail[]>([])

    // States for editing process info (label & description)
    const [isEditingInfo, setIsEditingInfo] = useState(false)
    const [editInfo, setEditInfo] = useState({ label: "", description: "" })

    useEffect(() => {
        if (!classId || !userData.id) return

        (async () => {
            dispatch(changeStateFetching(true))

            await ProgressService.getProgressDetail(classId).finally(() => {
                dispatch(changeStateFetching(false))
            })
        })()
    }, [userData.id, classId])

    // Đồng bộ dữ liệu từ Redux Store khi không ở chế độ chỉnh sửa
    useEffect(() => {
        if (!isAdding && progress) {
            setMilestones(progress.milestones)
        }
    }, [progress, isAdding])

    // Fetch topics cho registration milestone
    useEffect(() => {
        if (!classId || !progress) return
        const regMilestone = progress.milestones?.find((m: any) => m.is_registration_milestone)
        if (!regMilestone) return
        TopicsService.getTopics(classId, regMilestone.id).then(data => {
            if (data) setRegistrationTopics(data)
        })
    }, [classId, progress])

    const refreshProgress = async () => {
        if (!classId || !userData.id) return

        dispatch(changeStateFetching(true))

        await ProgressService.getProgressDetail(classId).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    const toggleRequireApproval = async () => {
        if (!classId || !userData.id || !progress) return
        dispatch(changeStateFetching(true))

        await ProgressService.updateProgressInfo({
            classId,
            progressId: progress.id,
            is_submitted: !progress.is_submitted
        }).finally(() => {
            dispatch(changeStateFetching(false))
        })

    }

    const startEditingInfo = () => {
        if (!progress) return
        setEditInfo({ label: progress.label, description: progress.description || "" })
        setIsEditingInfo(true)
    }

    const handleSaveInfo = async () => {
        if (!progress || !classId) return
        if (!editInfo.label.trim()) {
            toast.info("Tên quy trình không được để trống")
            return
        }

        dispatch(changeStateFetching(true))
        const success = await ProgressService.updateProgressInfo({
            classId,
            progressId: progress.id,
            label: editInfo.label,
            description: editInfo.description
        })

        if (success) {
            setIsEditingInfo(false)
            toast.success("Cập nhật thông tin quy trình thành công")
        }
        dispatch(changeStateFetching(false))
    }

    const isInfoChanged = () => {
        if (!progress) return false
        return editInfo.label !== progress.label || editInfo.description !== (progress.description || "")
    }

    const handleCancelInfo = () => {
        if (isInfoChanged()) {
            confirmDialog({
                header: "Thoát chỉnh sửa thông tin",
                message: "Những thay đổi của bạn sẽ bị mất. Bạn có chắc chắn muốn dừng chỉnh sửa không?",

                acceptLabel: "Tiếp tục",
                rejectLabel: "Hủy",

                accept: () => {
                    setIsEditingInfo(false)
                }
            })
        } else {
            setIsEditingInfo(false)
        }
    }

    const reIndex = (list: any[]) => {
        let count = 0
        return list.map((m) => {
            if (m.markedDeleted) return { ...m, index: 0 }
            count++
            return { ...m, index: count }
        })
    }

    const startAdding = () => {
        setBackup(JSON.parse(JSON.stringify(milestones)))
        setIsAdding(true)

        if (milestones.length === 0) {
            addForm(0)
        }
    }

    const addForm = (atIndex: number) => {
        const newForm = {
            tempId: Math.random().toString(36).substring(2, 11),
            id: "",
            index: 0,
            label: "",
            description: "",
            is_deleted: false,
            is_stopped: false,
            is_registration_milestone: false,
            updated_at: "-",
            created_at: new Date().toLocaleDateString("vi-VN"),
            isNew: true
        }
        const newList = [...milestones]
        newList.splice(atIndex, 0, newForm)
        setMilestones(reIndex(newList))
    }

    const updateMilestone = (index: number, data: Partial<MilestoneShortDetail>) => {
        const newList = [...milestones]
        newList[index] = { ...newList[index], ...data }
        setMilestones(newList)
    }

    const toggleDeleteMilestone = (index: number) => {
        const newList = [...milestones]
        const item = newList[index]

        if (item.isNew) {
            // Nếu là mốc mới tạo thì xóa hẳn khỏi mảng
            newList.splice(index, 1)
        } else {
            // Nếu là mốc cũ thì đảo trạng thái đánh dấu xóa bằng cách tạo object mới
            newList[index] = { ...item, markedDeleted: !item.markedDeleted }
        }
        setMilestones(reIndex(newList))
    }


    const isMilestoneDataChanged = () => {
        const hadMilestoneData = milestones.filter(m => m.label || m.description) // Filter all of the milestons have data
        return JSON.stringify(hadMilestoneData) !== JSON.stringify(backup)
    }

    const handleSave = async () => {
        if (!isMilestoneDataChanged() || !classId || !progress) return

        const invalidMilestone = milestones.map(m => {
            if (!m.label || !m.description) {
                return m.tempId
            }
        }).filter(tempId => tempId !== undefined)

        if (invalidMilestone.length > 0) {
            toast.info("Bạn cần điền đầy đủ tên và mô tả cho các cột mốc")
            setMilestoneErrorTempID(invalidMilestone);
            return
        }


        const deletedList = milestones
            .filter(m => m.markedDeleted && !m.isNew)
            .map(({ isNew, markedDeleted, tempId, updated_at, created_at, is_deleted, ...rest }) => rest.id)

        const keepList = milestones
            .filter(m => !m.markedDeleted && (!m.isNew || m.label.trim() !== ""))
            .map(({ isNew, markedDeleted, tempId, updated_at, created_at, is_deleted, ...rest }) => ({
                ...rest,
            }))

        let removeResult: boolean | undefined
        // Remove
        if (deletedList.length > 0) {
            dispatch(changeStateFetching(true))
            removeResult = await ProgressService.removeMilestone([...deletedList]).finally(() => {
                dispatch(changeStateFetching(false))
                removeResult = true
            })
        } else removeResult = true


        // Create and Update
        if (keepList.length > 0 && removeResult) {
            dispatch(changeStateFetching(true))
            await ProgressService.updateMilestone(classId, progress.id, [...keepList]).finally(() => {
                dispatch(changeStateFetching(false))
            })
        }

        setMilestones(keepList as any)
        setIsAdding(false)
    }

    const handleCreateRegistrationMilestone = async () => {
        if (!classId) return
        dispatch(changeStateFetching(true))
        await ProgressService.createRegistrationMilestone(classId)
        await ProgressService.getProgressDetail(classId)
        const updatedProgress = store.getState().progress.currentProgress
        if (updatedProgress) setMilestones(updatedProgress.milestones)
        dispatch(changeStateFetching(false))
    }

    const handleCancel = () => {
        if (isMilestoneDataChanged()) {
            confirmDialog({
                header: "Thoát chỉnh sửa cột mốc",
                message: "Những thay đổi của bạn sẽ bị mất. Bạn có chắc chắn muốn dừng chỉnh sửa không?",

                acceptLabel: "Tiếp tục",
                rejectLabel: "Hủy",

                accept: () => {
                    setMilestones(backup)
                    setIsAdding(false)
                }
            })
        } else {
            setMilestones(backup)
            setIsAdding(false)
        }
    }

    const moveMilestone = (index: number, direction: "up" | "down") => {
        const newItems = [...milestones]
        const target = direction === "up" ? index - 1 : index + 1
        if (target < 0 || target >= newItems.length) return

        const temp = newItems[index]
        newItems[index] = newItems[target]
        newItems[target] = temp

        setMilestones(reIndex(newItems))
    }

    const viewDetailMilestone = (id: string) => {
        if (!id) return
        navigate(`/main/roomadmin/class/${classId}/progresses/${id}`)
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

                <p className="text-mainColor italic">Quy trình của bạn chỉ có thể hoạt động khi đã được duyệt bởi quản trị viên hệ thống. Hãy bấm '<b><i><u className="text-mainColor">Yêu cầu duyệt</u></i></b>' để gửi yêu cầu.</p>
            </span>

            {/* Quy trình Header Card */}
            <div className="flex flex-col gap-5 p-7 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                <div className="flex items-center-safe gap-1">
                    {!isEditingInfo ? (
                        <h2 className="flex-1 text-hugeSize font-bold dark:text-white uppercase line-clamp-1">{progress.label}</h2>
                    ) : (
                        <input
                            type="text"
                            value={editInfo.label}
                            onChange={(e) => setEditInfo({ ...editInfo, label: e.target.value })}
                            className="flex-1 text-hugeSize font-bold dark:text-white uppercase bg-transparent border-b border-lightGray/20 focus:border-mainColor outline-none pb-1"
                            placeholder="Tên quy trình..."
                            autoFocus
                        />
                    )}

                    <span className="flex items-center-safe gap-2.5">
                        {!isEditingInfo ? (
                            <>
                                <button onClick={startEditingInfo} className="dark:text-white border border-lightGray dark:border-gray px-2.5 py-2.5 rounded-normal hoverBtn disableState" disabled={isFetching || isAdding}>Chỉnh sửa thông tin</button>

                                {!progress.created_approval && (
                                    <button className={`${progress.is_submitted ? "bg-redRGB text-red" : "bg-mainColor text-white"} px-2.5 py-2.5 rounded-normal hoverBtn disableState`} disabled={isFetching || isAdding} onClick={toggleRequireApproval}>
                                        {progress.is_submitted ? "Thu hồi yêu cầu duyệt" : "Yêu cầu duyệt"}
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <button onClick={handleSaveInfo} className="bg-mainColor text-white px-6 py-2.5 rounded-normal hoverBtn disableState" disabled={isFetching || !isInfoChanged()}>Lưu</button>
                                <button onClick={handleCancelInfo} className="bg-gray/10 text-gray px-6 py-2.5 rounded-normal hoverBtn disableState" disabled={isFetching}>Hủy</button>
                            </>
                        )}
                    </span>
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

                {!isEditingInfo ? (
                    progress.description && (
                        <div className="flex flex-col gap-1 border-t border-gray/10 pt-5">
                            <p className="text-smallSize text-gray dark:text-gray italic font-medium">Mô tả quy trình:</p>
                            <p className="text-normalSize dark:text-white leading-relaxed line-clamp-4">{progress.description}</p>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col gap-1 border-t border-gray/10 pt-5">
                        <p className="text-smallSize text-gray dark:text-gray italic font-medium">Mô tả quy trình:</p>
                        <textarea
                            value={editInfo.description}
                            onChange={(e) => setEditInfo({ ...editInfo, description: e.target.value })}
                            className="text-normalSize dark:text-white leading-relaxed bg-transparent border border-lightGray/20 focus:border-mainColor outline-none p-3 rounded-normal resize-none h-24"
                            placeholder="Mô tả quy trình..."
                        />
                    </div>
                )}
            </div>

            <span className="flex items-center-safe gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-oranged">
                    <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                    <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clipRule="evenodd" />
                </svg>

                <p className="text-oranged italic">Mỗi khi chỉnh sửa thông tin quy trình hoặc các cột mốc thì cần '<b><i><u className="text-oranged">phải được cầu duyệt lại.</u></i></b>'</p>
            </span>

            {/* Tool Bar */}
            <div className="sticky top-0 z-20 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center-safe justify-between gap-5 py-5 border-b border-lightGray/10 dark:border-white/5">
                <button className="h-full flex items-center-safe gap-2.5 px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-small hoverBtn disableState" disabled={isFetching} onClick={refreshProgress}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white max-sm:size-3.5 stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>

                    <p className="dark:text-white">Làm mới</p>
                </button>

                {!isAdding ? (
                    <span>
                        <button onClick={startAdding} className="bg-mainColorRGB text-mainColor font-medium px-3.5 py-2.5 rounded-normal hover:bg-mainColor hover:text-white hover:cursor-pointer transition-all disableState" disabled={isFetching}>Chỉnh sửa cột mốc</button>
                    </span>
                ) : (
                    <div className="flex-1 flex justify-end items-center gap-2">
                        {!milestones.some((m: any) => m.is_registration_milestone) && (
                            <button onClick={handleCreateRegistrationMilestone} disabled={isFetching}
                                className="bg-blue-500/10 text-blue-500 font-medium px-3.5 py-2 rounded-normal hoverBtn disableState text-smallSize">
                                + Tạo lại cột đăng ký đề tài
                            </button>
                        )}
                        <button onClick={handleSave} className="bg-mainColor text-white font-medium px-6 py-2 rounded-normal hoverBtn disableState" disabled={isFetching || !isMilestoneDataChanged()}>Lưu</button>
                        <button onClick={handleCancel} className="bg-gray/10 text-gray font-medium px-6 py-2 rounded-normal hoverBtn disableState" disabled={isFetching}>Hủy</button>
                    </div>
                )}
            </div>

            {/* Timeline View */}
            <div className="flex flex-col relative ml-12 mt-5">
                {/* Đường kẻ dọc nối các cột mốc */}
                <div className="absolute left-[-26px] top-0 bottom-0 w-0.5 bg-mainColor/20 dark:bg-white/10 rounded-full"></div>

                {milestones.map((milestone, index) => (
                    <div key={milestone.tempId} className="relative mb-12 last:mb-0 group">
                        <div className={`absolute left-[-42px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md z-10 transition-all ${milestone.markedDeleted ? "bg-gray/40 scale-75" : "bg-mainColor"}`}>
                            {milestone.index > 0 ? milestone.index : "X"}
                        </div>

                        {isAdding ? (
                            // UNIFIED FORM CARD
                            <div className={`rounded-normal p-6 shadow-[0_2px_15px_rgba(0,0,0,0.1)] border-2 flex flex-col gap-4 animate-fadeIn transition-all ${milestoneErrorTempID.includes(milestone.tempId as string) && "border-red!"} ${milestone.markedDeleted ? "bg-redRGB border-red pointer-events-none select-none" : "bg-white dark:bg-lightDark border-dashed border-mainColor/30"}`}>
                                <div className="flex justify-between items-center-safe gap-4">
                                    <input
                                        type="text"
                                        autoFocus={milestone.isNew}
                                        value={milestone.label}
                                        onChange={(e) => updateMilestone(index, { label: e.target.value })}
                                        placeholder="Tên cột mốc..."
                                        className="flex-1 text-largeSize font-bold dark:text-white tracking-tight bg-transparent border-b border-lightGray/20 focus:border-mainColor outline-none pb-1 disableState"
                                        disabled={isFetching}
                                    />
                                    <div className="flex items-center gap-2 pointer-events-auto">
                                        <div className="flex gap-1 bg-gray/5 dark:bg-white/5 p-1 rounded-normal">
                                            <button onClick={() => moveMilestone(index, "up")} disabled={index === 0 || milestone.markedDeleted || isFetching} className="p-1.5 hover:bg-mainColorRGB hover:text-mainColor rounded-full transition-colors disabled:opacity-20 disableState" title="Di chuyển lên">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 dark:stroke-white"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                                            </button>

                                            <button onClick={() => moveMilestone(index, "down")} disabled={index === milestones.length - 1 || milestone.markedDeleted || isFetching} className="p-1.5 hover:bg-mainColorRGB hover:text-mainColor rounded-full transition-colors disabled:opacity-20 disableState" title="Di chuyển xuống">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 dark:stroke-white"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1.5 bg-gray/5 dark:bg-white/5 p-1 rounded-normal">
                                            <button onClick={() => addForm(index)} disabled={milestone.markedDeleted || isFetching} className="flex items-center gap-1 px-2.5 py-1.5 bg-mainColorRGB text-mainColor text-smallSize font-bold rounded-small hover:bg-mainColor hover:text-white transition-all disabled:opacity-20 disableState">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3.5 stroke-mainColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                                Thêm trên
                                            </button>

                                            <button onClick={() => addForm(index + 1)} disabled={milestone.markedDeleted || isFetching} className="flex items-center gap-1 px-2.5 py-1.5 bg-mainColorRGB text-mainColor text-smallSize font-bold rounded-small hover:bg-mainColor hover:text-white transition-all disabled:opacity-20 disableState">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3.5 stroke-mainColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                                Thêm dưới
                                            </button>
                                        </div>

                                        <button onClick={() => toggleDeleteMilestone(index)} className={`p-2 rounded-full transition-colors ${milestone.markedDeleted ? "text-white bg-red" : "text-red hover:bg-redRGB"} disableState`} title={milestone.markedDeleted ? "Hoàn tác xóa" : "Xóa cột mốc này"} disabled={isFetching}>
                                            {milestone.markedDeleted ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-white">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                                                </svg>
                                            ) : milestones.length === 1 && milestones[0].isNew ? null : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-red">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <textarea
                                    value={milestone.description}
                                    onChange={(e) => updateMilestone(index, { description: e.target.value })}
                                    placeholder="Mô tả cột mốc..."
                                    className="text-normalSize text-gray dark:text-white/60 leading-relaxed italic bg-transparent border border-lightGray/20 focus:border-mainColor outline-none p-3 rounded-normal resize-none h-24 disableState"
                                    disabled={isFetching}
                                />

                                <div className="flex justify-between items-center pt-4 border-t border-lightGray/10">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={milestone.isNew ? true : milestone.is_stopped}
                                            onChange={(e) => updateMilestone(index, { is_stopped: e.target.checked })}
                                            disabled={isFetching}
                                            className="size-4 accent-mainColor disableState"
                                        />
                                        <span className="text-smallSize font-medium dark:text-white">Không kích hoạt khi vừa tạo</span>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            // INFO CARD
                            <div className="bg-white dark:bg-lightDark rounded-normal p-6 shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-lightGray/20 dark:border-white/5 flex flex-col gap-4" onClick={() => viewDetailMilestone(milestone.id)}>
                                <div className="flex justify-between items-center-safe gap-4">
                                    <h3 className="text-largeSize font-bold dark:text-white tracking-tight capitalize">
                                        {milestone.label}
                                    </h3>

                                    <span className={`flex items-center px-4 py-1.5 rounded-normal text-smallSize font-bold uppercase ${(milestone as any).is_registration_milestone ? "bg-blue-500/10 text-blue-500" : milestone.is_stopped ? "bg-redRGB text-red" : "bg-mainColorRGB text-mainColor"}`}>
                                        {(milestone as any).is_registration_milestone ? "Đăng ký đề tài" : milestone.is_stopped ? "Đã dừng" : "Hoạt động"}
                                    </span>
                                </div>

                                <p className="text-normalSize text-gray dark:text-white/60 leading-relaxed italic max-w-4xl">
                                    "{milestone.description}"
                                </p>

                                {/* Registration milestone: hiển thị bảng đề tài */}
                                {(milestone as any).is_registration_milestone ? (
                                    <div className="flex flex-col gap-3">
                                        <p className="text-smallSize text-gray italic">{registrationTopics.length} đề tài đã đăng ký</p>
                                        {registrationTopics.length === 0 ? (
                                            <p className="text-gray italic text-smallSize">Chưa có sinh viên nào đăng ký đề tài.</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-smallSize">
                                                    <thead>
                                                        <tr className="border-b border-gray/10 text-gray">
                                                            <th className="text-left py-2 pr-4 font-medium">Sinh viên</th>
                                                            <th className="text-left py-2 pr-4 font-medium">Tên đề tài</th>
                                                            <th className="text-left py-2 pr-4 font-medium">Loại</th>
                                                            <th className="text-left py-2 pr-4 font-medium">GVHD</th>
                                                            <th className="text-left py-2 font-medium">Trạng thái</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {registrationTopics.slice(0, 5).map(topic => (
                                                            <tr key={topic.id} className="border-b border-gray/5 hover:bg-gray/5 transition-colors">
                                                                <td className="py-2.5 pr-4 dark:text-white font-medium">{topic.student.full_name}</td>
                                                                <td className="py-2.5 pr-4 dark:text-white max-w-[200px] truncate">{topic.title}</td>
                                                                <td className="py-2.5 pr-4 text-gray">{VNThesisType[topic.thesis_type]?.split(" ")[0]}</td>
                                                                <td className="py-2.5 pr-4 text-gray">{topic.supervisor?.full_name ?? "—"}</td>
                                                                <td className="py-2.5">
                                                                    <span className={`font-semibold ${VNTopicStatus[topic.status]?.color}`}>
                                                                        {VNTopicStatus[topic.status]?.label}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RAMilestones
