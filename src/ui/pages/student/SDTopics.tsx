import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import TopicsService from "../../../services/topics/topics.service"
import { ClassService } from "../../../services/class/class.service"
import ProgressService from "../../../services/progress/progress.service"
import type { TopicDetail } from "../../../services/topics/topics.type"
import type { Members } from "../../../services/class/class.type"
import { ThesisType, TopicStatus, VNThesisType, VNTopicStatus } from "../../../config/enum"
import Loading from "../../components/Loading"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { toast } from "sonner"

const SDTopics: React.FC = () => {
    const { classId } = useParams()
    const dispatch = useDispatch()
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const progress = useSelector((state: RootState) => state.progress.currentProgress)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const [topic, setTopic] = useState<TopicDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [lecturers, setLecturers] = useState<Members[]>([])

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [thesisType, setThesisType] = useState(ThesisType.THESIS)
    const [selectedSupervisor, setSelectedSupervisor] = useState("")
    const [outlineUrl, setOutlineUrl] = useState("")
    const pendingOutlineRef = useRef<string>("")  // track URL chưa submit để cleanup khi unmount

    const registrationMilestone = progress?.milestones?.find((m: any) => m.is_registration_milestone)

    const fetchTopic = async () => {
        if (!classId || !registrationMilestone?.id || !userData?.id) { setLoading(false); return }
        setLoading(true)
        const result = await TopicsService.getMyTopic(classId, registrationMilestone.id, userData.id)
        setTopic(result)
        setLoading(false)
    }

    useEffect(() => {
        if (!classId || !userData?.id) return
        const init = async () => {
            dispatch(changeStateFetching(true))
            if (!progress || progress.class?.id !== classId) await ProgressService.getProgressDetail(classId)
            const data = await ClassService.getMembers(1, 100)
            if (data && typeof data !== "boolean") setLecturers(data.data.lecturer)
            dispatch(changeStateFetching(false))
        }
        init()
    }, [classId, userData?.id])

    useEffect(() => { fetchTopic() }, [classId, userData?.id, registrationMilestone?.id])

    // Xóa file đã upload nếu rời trang mà chưa submit
    useEffect(() => {
        return () => {
            if (pendingOutlineRef.current) TopicsService.deleteOutlineFile(pendingOutlineRef.current)
        }
    }, []) // chỉ chạy cleanup khi unmount

    const handleCreate = async () => {
        if (!classId || !registrationMilestone?.id || !title.trim()) return
        dispatch(changeStateFetching(true))
        const result = await TopicsService.createTopic(classId, registrationMilestone.id, title, thesisType, description || undefined)
        if (result) setTopic(result)
        dispatch(changeStateFetching(false))
    }

    const handleInvite = async () => {
        if (!topic || !classId || !selectedSupervisor) return
        dispatch(changeStateFetching(true))
        const result = await TopicsService.inviteSupervisor(topic.id, classId, selectedSupervisor)
        if (result) setTopic(result)
        dispatch(changeStateFetching(false))
    }

    const handleSubmitOutline = async () => {
        if (!topic || !classId || !outlineUrl.trim()) return
        dispatch(changeStateFetching(true))
        const result = await TopicsService.submitOutline(topic.id, classId, outlineUrl)
        if (result) { setTopic(result); setOutlineUrl(""); pendingOutlineRef.current = "" }
        dispatch(changeStateFetching(false))
    }

    if (loading) return <Loading />

    if (progress && progress.created_approval) {
        if (!registrationMilestone) {
            return (
                <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-6 p-10 bg-white dark:bg-lightDark rounded-normal shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-lightGray/10 mt-5">
                    <div className="bg-mainColor/10 p-6 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-16 stroke-mainColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <h2 className="text-hugeSize font-bold text-gray dark:text-white uppercase tracking-wider">Chưa mở đăng ký đề tài</h2>
                        <p className="text-normalSize text-gray dark:text-gray/70 italic max-w-md">
                            Lớp học này hiện tại chưa có cột mốc đăng ký đề tài. Vui lòng quay lại sau khi giảng viên đã thiết lập lịch đăng ký.
                        </p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="w-full h-fit flex flex-col gap-5 pt-topPadding pb-20">
                    <h2 className="text-hugeSize font-bold dark:text-white uppercase">Đề tài của tôi</h2>

                    {!topic && (
                        <div className="flex flex-col gap-4 p-7 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                            <h3 className="font-semibold dark:text-white">Đăng ký đề tài</h3>

                            <div className="flex flex-col gap-1">
                                <label className="text-smallSize text-gray italic">Tên đề tài *</label>
                                <input value={title} onChange={e => setTitle(e.target.value)}
                                    className="border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-normalSize disableState"
                                    placeholder="Nhập tên đề tài..." disabled={isFetching} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-smallSize text-gray italic">Mô tả</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                                    className="border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-normalSize resize-none disableState"
                                    placeholder="Mô tả ngắn về đề tài..." disabled={isFetching} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-smallSize text-gray italic">Loại đề tài *</label>
                                <select value={thesisType} onChange={e => setThesisType(e.target.value as any)}
                                    className="border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-normalSize disableState"
                                    disabled={isFetching}>
                                    {Object.entries(VNThesisType).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>

                            <button onClick={handleCreate} disabled={isFetching || !title.trim()}
                                className="self-start px-5 py-2 bg-mainColor text-white rounded-md text-normalSize font-medium hover:opacity-80 transition-opacity disableState">
                                Tạo đề tài
                            </button>
                        </div>
                    )}

                    {topic && (
                        <div className="flex flex-col gap-5 p-7 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold text-bigSize dark:text-white">{topic.title}</h3>
                                    {topic.description && <p className="text-gray text-smallSize">{topic.description}</p>}
                                </div>
                                <span className={`text-smallSize font-semibold shrink-0 ${VNTopicStatus[topic.status]?.color}`}>
                                    {VNTopicStatus[topic.status]?.label}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 border-t border-gray/10 pt-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-smallSize text-gray italic">Loại đề tài</p>
                                    <p className="font-medium dark:text-white">{VNThesisType[topic.thesis_type]}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-smallSize text-gray italic">GVHD</p>
                                    <p className="font-medium dark:text-white">{topic.supervisor?.full_name ?? "Chưa có"}</p>
                                </div>
                            </div>

                            {topic.rejection_note && (
                                <div className="bg-red/10 border border-red/30 rounded-md p-3">
                                    <p className="text-smallSize text-red font-medium">Lý do từ chối: {topic.rejection_note}</p>
                                </div>
                            )}

                            {[TopicStatus.DRAFT, TopicStatus.SUPERVISOR_REJECTED].includes(topic.status as any) && (
                                <div className="flex flex-col gap-3 border-t border-gray/10 pt-4">
                                    <p className="text-smallSize text-gray italic font-medium">Mời Giảng viên hướng dẫn</p>
                                    <select value={selectedSupervisor} onChange={e => setSelectedSupervisor(e.target.value)}
                                        className="border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-normalSize disableState"
                                        disabled={isFetching}>
                                        <option value="">-- Chọn GVHD --</option>
                                        {lecturers.map(l => <option key={l.user.id} value={l.user.id}>{l.user.full_name} ({l.user.email})</option>)}
                                    </select>
                                    <button onClick={handleInvite} disabled={isFetching || !selectedSupervisor}
                                        className="self-start px-5 py-2 bg-mainColor text-white rounded-md text-normalSize font-medium hover:opacity-80 transition-opacity disableState">
                                        Gửi lời mời
                                    </button>
                                </div>
                            )}

                            {topic.status === TopicStatus.INVITED && (
                                <p className="text-yellow-500 text-smallSize italic border-t border-gray/10 pt-4">
                                    Đang chờ GVHD <b>{topic.supervisor?.full_name}</b> phản hồi...
                                </p>
                            )}

                            {[TopicStatus.SUPERVISOR_ACCEPTED, TopicStatus.OUTLINE_REJECTED].includes(topic.status as any) && (
                                <div className="flex flex-col gap-3 border-t border-gray/10 pt-4">
                                    <p className="text-smallSize text-gray italic font-medium">
                                        {topic.status === TopicStatus.OUTLINE_REJECTED ? "Nộp lại file đề cương (PDF)" : "Nộp file đề cương (PDF)"}
                                    </p>
                                    <input type="file" accept=".pdf" disabled={isFetching}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return
                                            if (file.size > 50 * 1024 * 1024) { toast.error("File không được vượt quá 50MB"); return }
                                            dispatch(changeStateFetching(true))
                                            const url = await TopicsService.uploadOutlineFile(file)
                                            if (url) {
                                                // Xóa file cũ nếu đổi file
                                                if (pendingOutlineRef.current && pendingOutlineRef.current !== url) {
                                                    TopicsService.deleteOutlineFile(pendingOutlineRef.current)
                                                }
                                                setOutlineUrl(url)
                                                pendingOutlineRef.current = url
                                            }
                                            dispatch(changeStateFetching(false))
                                        }}
                                        className="border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-normalSize disableState" />
                                    <p className="text-tinySize text-gray italic">Chỉ chấp nhận file PDF, tối đa 50MB</p>
                                    {outlineUrl && <p className="text-smallSize text-mainColor">✓ File đã tải lên</p>}
                                    <button onClick={handleSubmitOutline} disabled={isFetching || !outlineUrl}
                                        className="self-start px-5 py-2 bg-mainColor text-white rounded-md text-normalSize font-medium hover:opacity-80 transition-opacity disableState">
                                        Nộp đề cương
                                    </button>
                                </div>
                            )}

                            {topic.status === TopicStatus.OUTLINE_PENDING && (
                                <p className="text-yellow-500 text-smallSize italic border-t border-gray/10 pt-4">
                                    Đề cương đang chờ xét duyệt...
                                </p>
                            )}

                            {topic.status === TopicStatus.APPROVED && (
                                <div className="flex items-center gap-2 border-t border-gray/10 pt-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 fill-mainColor">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-mainColor font-semibold">Đề tài đã được duyệt. Bạn có thể tham gia các cột mốc tiếp theo.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
        }
    } else {
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
                        Bạn chưa thể cung cấp thông tin đề tài. Hiện tại quy trình thực hiện đồ án của lớp học chưa được phê duyệt.
                    </p>
                </div>
            </div>
        )
    }
}

export default SDTopics
