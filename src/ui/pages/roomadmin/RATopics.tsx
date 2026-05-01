import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import TopicsService from "../../../services/topics/topics.service"
import type { TopicDetail } from "../../../services/topics/topics.type"
import { VNThesisType, VNTopicStatus } from "../../../config/enum"
import OutlineReviewPanel from "../../components/OutlineReviewPanel"

const reviewableStatuses = ["outline_pending", "approved", "outline_rejected"]

const RATopics: React.FC = () => {
    const { classId } = useParams()
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const userData = useSelector((state: RootState) => state.auth.user.info)

    const [topics, setTopics] = useState<TopicDetail[]>([])
    const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})
    const [reviewableTopic, setReviewableTopic] = useState<TopicDetail | null>(null)

    const fetchTopics = async () => {
        if (!classId) return
        const data = await TopicsService.getTopics(classId)
        if (data) setTopics(data)
    }

    useEffect(() => {
        if (!classId || !userData.id) return
        fetchTopics()
    }, [classId, userData.id])

    const handleReviewTopic = async (topicId: string, approve: boolean) => {
        if (!classId) return
        const result = await TopicsService.reviewTopic(topicId, classId, approve, rejectNotes[topicId])
        if (result) {
            setTopics(prev => prev.map(t => t.id === topicId ? result : t))
            setReviewableTopic(result)
        }
    }

    const handleRowClick = (topic: TopicDetail) => {
        if (topic.outline_file_url && reviewableStatuses.includes(topic.status)) {
            setReviewableTopic(topic)
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

                <button onClick={fetchTopics} disabled={isFetching}
                    className="h-full flex items-center-safe gap-2.5 px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-small hoverBtn disableState">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <p className="dark:text-white">Làm mới</p>
                </button>
            </div>

            {/* Table */}
            <div className="border-[0.5px] border-lightGray dark:border-gray rounded-normal overflow-hidden">
                <table className="w-full bg-transparent">
                    <colgroup>
                        <col className="w-[18%]" />
                        <col className="w-[26%]" />
                        <col className="w-[8%]" />
                        <col className="w-[18%]" />
                        <col className="w-[16%]" />
                        <col className="w-[14%]" />
                    </colgroup>
                    <thead className="bg-lightGray/50 dark:bg-white/5">
                        <tr>
                            <th className="text-left px-5 py-3 dark:text-white text-sm uppercase tracking-wider">Sinh viên</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Tên đề tài</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Loại</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">GVHD</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Trạng thái</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Đề cương</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map((topic) => {
                            const isClickable = !!topic.outline_file_url && reviewableStatuses.includes(topic.status)
                            return (
                                <tr key={topic.id}
                                    onClick={() => handleRowClick(topic)}
                                    className={`border-t-[0.5px] border-lightGray dark:border-lightGray hover:bg-lighterGray dark:hover:bg-white/5 ${isClickable ? "cursor-pointer" : ""}`}>
                                    <td className="px-5 py-3 dark:text-white text-sm">{topic.student.full_name}</td>
                                    <td className="py-3 dark:text-white text-sm max-w-[200px] truncate" title={topic.title}>{topic.title}</td>
                                    <td className="py-3 text-gray text-sm">{VNThesisType[topic.thesis_type]?.split(" ")[0]}</td>
                                    <td className="py-3 text-gray text-sm">{topic.supervisor?.full_name ?? "—"}</td>
                                    <td className="py-3 text-sm">
                                        <span className={`font-semibold ${VNTopicStatus[topic.status]?.color}`}>
                                            {VNTopicStatus[topic.status]?.label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-sm">
                                        {topic.outline_file_url ? (
                                            <a href={topic.outline_file_url} target="_blank" rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="text-mainColor hover:underline font-medium">
                                                Xem đề cương
                                            </a>
                                        ) : (
                                            <span className="text-gray italic">--</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                        {topics.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-20 text-center text-gray italic">Chưa có đề tài nào trong lớp này</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {reviewableTopic && (
                <OutlineReviewPanel
                    topics={[reviewableTopic]}
                    isFetching={isFetching}
                    rejectNotes={rejectNotes}
                    onRejectNoteChange={(id, note) => setRejectNotes(prev => ({ ...prev, [id]: note }))}
                    onReview={handleReviewTopic}
                    onClose={() => setReviewableTopic(null)}
                />
            )}
        </div>
    )
}

export default RATopics
