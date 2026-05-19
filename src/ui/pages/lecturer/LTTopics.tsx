import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import TopicsService from "../../../services/topics/topics.service"
import ProgressService from "../../../services/progress/progress.service"
import { setMyTopicsAsLecturer, updateTopicInLecturerList } from "../../../redux/reducers/topicsSlice.reducer"
import { ThesisType, TopicStatus, VNThesisType, VNTopicStatus } from "../../../config/enum"
import Loading from "../../components/Loading"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"

const SUPERVISED_STATUSES = [
    TopicStatus.SUPERVISOR_ACCEPTED,
    TopicStatus.OUTLINE_PENDING,
    TopicStatus.OUTLINE_WAITING_UNIADMIN,
    TopicStatus.OUTLINE_REJECTED,
    TopicStatus.APPROVED,
]

const LTTopics: React.FC = () => {
    const { classId } = useParams()
    const dispatch = useDispatch()
    const progress = useSelector((state: RootState) => state.progress.currentProgress)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const topics = useSelector((state: RootState) => state.topics.myTopicsAsLecturer)

    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<"invitations" | "supervised" | "reviewing">("invitations")
    const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})

    const registrationMilestone = progress?.milestones?.find((m: any) => m.is_registration_milestone)

    const invitations = topics.filter(t => t.status === TopicStatus.INVITED)
    const supervised = topics.filter(t => SUPERVISED_STATUSES.includes(t.status as any))
    const reviewing = topics.filter(t => t.reviewer?.id === userData?.id)

    const fetchTopics = async () => {
        if (!classId || !registrationMilestone?.id) { setLoading(false); return }
        setLoading(true)
        dispatch(changeStateFetching(true))
        const result = await TopicsService.getMyTopicsAsLecturer(classId, registrationMilestone.id)
        if (result) dispatch(setMyTopicsAsLecturer(result))
        dispatch(changeStateFetching(false))
        setLoading(false)
    }

    useEffect(() => {
        if (!classId || !userData?.id) return
        const init = async () => {
            dispatch(changeStateFetching(true))
            if (!progress || progress.class?.id !== classId) await ProgressService.getProgressDetail(classId)
            dispatch(changeStateFetching(false))
        }
        init()
    }, [classId, userData?.id])

    useEffect(() => { fetchTopics() }, [classId, userData?.id, registrationMilestone?.id])

    const handleResponse = async (topicId: string, accept: boolean) => {
        if (!classId) return
        dispatch(changeStateFetching(true))
        const result = await TopicsService.supervisorResponse(topicId, classId, accept, rejectNotes[topicId])
        if (result) dispatch(updateTopicInLecturerList(result))
        dispatch(changeStateFetching(false))
    }

    if (loading) return <Loading />

    return (
        <div className="w-full h-fit flex flex-col gap-5 pt-topPadding pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-hugeSize font-bold dark:text-white uppercase">Đề tài</h2>
                <button onClick={fetchTopics} disabled={isFetching}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-small hoverBtn disableState">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <p className="dark:text-white">Làm mới</p>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray/20">
                <button onClick={() => setActiveTab("invitations")}
                    className={`px-4 py-2 text-normalSize font-medium transition-colors relative ${activeTab === "invitations" ? "text-mainColor after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-mainColor" : "text-gray hover:text-mainColor"}`}>
                    Lời mời
                    {invitations.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 bg-mainColor text-white text-tinySize rounded-full">{invitations.length}</span>
                    )}
                </button>
                <button onClick={() => setActiveTab("supervised")}
                    className={`px-4 py-2 text-normalSize font-medium transition-colors relative ${activeTab === "supervised" ? "text-mainColor after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-mainColor" : "text-gray hover:text-mainColor"}`}>
                    Đang hướng dẫn
                    {supervised.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 bg-gray/20 text-gray text-tinySize rounded-full">{supervised.length}</span>
                    )}
                </button>
                <button onClick={() => setActiveTab("reviewing")}
                    className={`px-4 py-2 text-normalSize font-medium transition-colors relative ${activeTab === "reviewing" ? "text-mainColor after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-mainColor" : "text-gray hover:text-mainColor"}`}>
                    Đang phản biện
                    {reviewing.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 bg-gray/20 text-gray text-tinySize rounded-full">{reviewing.length}</span>
                    )}
                </button>
            </div>

            {/* Tab: Lời mời */}
            {activeTab === "invitations" && (
                <>
                    {invitations.length === 0 && (
                        <p className="text-gray italic">Không có lời mời hướng dẫn nào đang chờ phản hồi.</p>
                    )}
                    {invitations.map(topic => (
                        <div key={topic.id} className="flex flex-col gap-4 p-7 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-bigSize dark:text-white">{topic.title}</h3>
                                {topic.description && <p className="text-gray text-smallSize">{topic.description}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                                <div className="flex flex-col gap-1">
                                    <p className="text-smallSize text-gray italic">Sinh viên</p>
                                    <p className="font-medium dark:text-white">{topic.student.full_name}</p>
                                    <p className="text-smallSize text-gray">{topic.student.email}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-smallSize text-gray italic">Loại đề tài</p>
                                    <p className="font-medium dark:text-white">{VNThesisType[topic.thesis_type]}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 border-t border-gray/10 pt-4">
                                <label className="text-smallSize text-gray italic">Lý do từ chối (nếu có)</label>
                                <input value={rejectNotes[topic.id] ?? ""} onChange={e => setRejectNotes(prev => ({ ...prev, [topic.id]: e.target.value }))}
                                    className="border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-normalSize disableState"
                                    placeholder="Nhập lý do nếu từ chối..." disabled={isFetching} />
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => handleResponse(topic.id, true)} disabled={isFetching}
                                    className="px-5 py-2 bg-mainColor text-white rounded-md text-normalSize font-medium hover:opacity-80 transition-opacity disableState">
                                    Chấp nhận
                                </button>
                                <button onClick={() => handleResponse(topic.id, false)} disabled={isFetching}
                                    className="px-5 py-2 bg-red text-white rounded-md text-normalSize font-medium hover:opacity-80 transition-opacity disableState">
                                    Từ chối
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Tab: Đang hướng dẫn */}
            {activeTab === "supervised" && (
                <>
                    {supervised.length === 0 && (
                        <p className="text-gray italic">Chưa có đề tài nào đang hướng dẫn.</p>
                    )}
                    {supervised.map(topic => (
                        <div key={topic.id} className="flex flex-col gap-4 p-7 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
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
                                    <p className="text-smallSize text-gray italic">Sinh viên</p>
                                    <p className="font-medium dark:text-white">{topic.student.full_name}</p>
                                    <p className="text-smallSize text-gray">{topic.student.email}</p>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <p className="text-smallSize text-gray italic">Loại đề tài</p>
                                    <p className="font-medium dark:text-white">{VNThesisType[topic.thesis_type]}</p>
                                </div>

                                {topic.thesis_type === ThesisType.CAPSTONE && (
                                    <div className="flex flex-col gap-1">
                                        <p className="text-smallSize text-gray italic">Phản biện</p>
                                        <p className="font-medium dark:text-white">{topic.reviewer?.full_name ?? "—"}</p>
                                    </div>
                                )}
                            </div>

                            {topic.outline_file_url && (
                                <div className="border-t border-gray/10 pt-4">
                                    <a href={topic.outline_file_url} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-mainColor text-mainColor rounded-md text-normalSize font-medium hover:bg-mainColor hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        Xem đề cương
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}

            {/* Tab: Đang phản biện */}
            {activeTab === "reviewing" && (
                <>
                    {reviewing.length === 0 && (
                        <p className="text-gray italic">Chưa có đề tài nào được phân công phản biện.</p>
                    )}
                    {reviewing.map(topic => (
                        <div key={topic.id} className="flex flex-col gap-4 p-7 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
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
                                    <p className="text-smallSize text-gray italic">Sinh viên</p>
                                    <p className="font-medium dark:text-white">{topic.student.full_name}</p>
                                    <p className="text-smallSize text-gray">{topic.student.email}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-smallSize text-gray italic">Loại đề tài</p>
                                    <p className="font-medium dark:text-white">{VNThesisType[topic.thesis_type]}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-smallSize text-gray italic">GVHD</p>
                                    <p className="font-medium dark:text-white">{topic.supervisor?.full_name ?? "—"}</p>
                                </div>
                            </div>
                            {topic.outline_file_url && (
                                <div className="border-t border-gray/10 pt-4">
                                    <a href={topic.outline_file_url} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-mainColor text-mainColor rounded-md text-normalSize font-medium hover:bg-mainColor hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        Xem đề cương
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default LTTopics
