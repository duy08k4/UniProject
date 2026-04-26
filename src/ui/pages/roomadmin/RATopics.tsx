import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import TopicsService from "../../../services/topics/topics.service"
import type { TopicDetail } from "../../../services/topics/topics.type"
import { VNThesisType, VNTopicStatus } from "../../../config/enum"
import OutlineReviewPanel from "../../components/OutlineReviewPanel"

const RATopics: React.FC = () => {
    const { classId } = useParams()
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const userData = useSelector((state: RootState) => state.auth.user.info)

    const [topics, setTopics] = useState<TopicDetail[]>([])
    const [pendingTopics, setPendingTopics] = useState<TopicDetail[]>([])
    const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})
    const [showOutlinePanel, setShowOutlinePanel] = useState(false)

    const fetchTopics = async () => {
        if (!classId) return
        const data = await TopicsService.getTopics(classId)
        if (data) {
            setTopics(data)
            setPendingTopics(data.filter(t => t.status === "outline_pending"))
        }
    }

    useEffect(() => {
        if (!classId || !userData.id) return
        fetchTopics()
    }, [classId, userData.id])

    const handleReviewTopic = async (topicId: string, approve: boolean) => {
        if (!classId) return
        const result = await TopicsService.reviewTopic(topicId, classId, approve, rejectNotes[topicId])
        if (result) {
            const updated = topics.map(t => t.id === topicId ? result : t)
            const updatedPending = updated.filter(t => t.status === "outline_pending")
            setTopics(updated)
            setPendingTopics(updatedPending)
            if (updatedPending.length === 0) setShowOutlinePanel(false)
        }
    }

    return (
        <div className="w-full h-fit flex flex-col gap-5 pt-topPadding pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-hugeSize font-bold dark:text-white">Đề tài</h1>
                    <p className="text-smallSize text-gray">{topics.length} đề tài trong lớp</p>
                </div>

                <div className="flex gap-2.5">
                    <button onClick={fetchTopics} disabled={isFetching}
                        className="h-full flex items-center-safe gap-2.5 px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-small hoverBtn disableState">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <p className="dark:text-white">Làm mới</p>
                    </button>

                    {pendingTopics.length > 0 && (
                        <button onClick={() => setShowOutlinePanel(true)} disabled={isFetching}
                            className="px-5 py-2 bg-mainColorRGB text-mainColor rounded-normal font-semibold disableState animate-bounce hoverBtn flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 stroke-mainColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            Đề cương chờ duyệt ({pendingTopics.length})
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="border-[0.5px] border-lightGray dark:border-gray rounded-normal overflow-hidden">
                <table className="w-full bg-transparent">
                    <colgroup>
                        <col className="w-[20%]" />
                        <col className="w-[30%]" />
                        <col className="w-[10%]" />
                        <col className="w-[20%]" />
                        <col className="w-[20%]" />
                    </colgroup>
                    <thead className="bg-lightGray/50 dark:bg-white/5">
                        <tr>
                            <th className="text-left px-5 py-3 dark:text-white text-sm uppercase tracking-wider">Sinh viên</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Tên đề tài</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Loại</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">GVHD</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map((topic) => (
                            <tr key={topic.id} className="border-t-[0.5px] border-lightGray dark:border-lightGray hover:bg-lighterGray dark:hover:bg-white/5">
                                <td className="px-5 py-3 dark:text-white text-sm">{topic.student.full_name}</td>
                                <td className="px-5 py-3 dark:text-white text-sm max-w-[200px] truncate" title={topic.title}>{topic.title}</td>
                                <td className="px-5 py-3 text-gray text-sm">{VNThesisType[topic.thesis_type]?.split(" ")[0]}</td>
                                <td className="px-5 py-3 text-gray text-sm">{topic.supervisor?.full_name ?? "—"}</td>
                                <td className="px-5 py-3 text-sm">
                                    <span className={`font-semibold ${VNTopicStatus[topic.status]?.color}`}>
                                        {VNTopicStatus[topic.status]?.label}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {topics.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-gray italic">Chưa có đề tài nào trong lớp này</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showOutlinePanel && (
                <OutlineReviewPanel
                    topics={pendingTopics}
                    isFetching={isFetching}
                    rejectNotes={rejectNotes}
                    onRejectNoteChange={(id, note) => setRejectNotes(prev => ({ ...prev, [id]: note }))}
                    onReview={handleReviewTopic}
                    onClose={() => setShowOutlinePanel(false)}
                />
            )}
        </div>
    )
}

export default RATopics
