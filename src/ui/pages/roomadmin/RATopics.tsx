import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import TopicsService from "../../../services/topics/topics.service"
import type { TopicDetail } from "../../../services/topics/topics.type"
import { ThesisType, VNThesisType, VNTopicStatus } from "../../../config/enum"
import OutlineReviewPanel from "../../components/OutlineReviewPanel"
import { ClassService } from "../../../services/class/class.service"
import type { Members } from "../../../services/class/class.type"

const reviewableStatuses = ["outline_pending"]

const RATopics: React.FC = () => {
    const { classId } = useParams()
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const userData = useSelector((state: RootState) => state.auth.user.info)

    const [topics, setTopics] = useState<TopicDetail[]>([])
    const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})
    const [reviewableTopic, setReviewableTopic] = useState<TopicDetail | null>(null)

    // Load lecturers 1 lần duy nhất
    const [lecturers, setLecturers] = useState<Members[]>([])
    const lecturersLoaded = useRef(false)

    // Modal state
    const [assignTarget, setAssignTarget] = useState<TopicDetail | null>(null)
    const [search, setSearch] = useState("")
    const [assigning, setAssigning] = useState(false)

    const fetchTopics = async () => {
        if (!classId) return
        const data = await TopicsService.getTopics(classId)
        if (data) setTopics(data)
    }

    const fetchLecturers = async () => {
        if (lecturersLoaded.current || !classId) return
        const result = await ClassService.getMembers(1, 500, "", "lecturer", classId)
        if (result && typeof result !== "boolean") {
            setLecturers(result.data.lecturer)
            lecturersLoaded.current = true
        }
    }

    useEffect(() => {
        if (!classId || !userData.id) return
        fetchTopics()
    }, [classId, userData.id])

    useEffect(() => {
        if (!classId) return
        fetchLecturers()
    }, [classId])

    const handleReviewTopic = async (topicId: string, approve: boolean) => {
        if (!classId) return
        const result = await TopicsService.reviewTopic(topicId, classId, approve, rejectNotes[topicId])
        if (result) {
            setTopics(prev => prev.map(t => t.id === topicId ? result : t))
            setReviewableTopic(result)
        }
    }

    const handleAssignReviewer = async (reviewerId: string) => {
        if (!classId || !assignTarget) return
        setAssigning(true)
        const result = await TopicsService.assignReviewer(assignTarget.id, classId, reviewerId)
        if (result) {
            setTopics(prev => prev.map(t => t.id === assignTarget.id ? result : t))
            setAssignTarget(null)
            setSearch("")
        }
        setAssigning(false)
    }

    const handleRowClick = (topic: TopicDetail) => {
        if (topic.outline_file_url && reviewableStatuses.includes(topic.status)) {
            setReviewableTopic(topic)
        }
    }

    const filteredLecturers = lecturers.filter(l =>
        l.user.id !== assignTarget?.supervisor?.id &&
        (l.user.full_name.toLowerCase().includes(search.toLowerCase()) ||
            l.user.email.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="w-full h-fit flex flex-col gap-5 pt-topPadding pb-20">
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

            <div className="border-[0.5px] border-lightGray dark:border-gray rounded-normal overflow-hidden">
                <table className="w-full bg-transparent">
                    <colgroup>
                        <col className="w-[15%]" />
                        <col className="w-[22%]" />
                        <col className="w-[8%]" />
                        <col className="w-[18%]" />
                        <col className="w-[18%]" />
                        <col className="w-[12%]" />
                        <col className="w-[7%]" />
                    </colgroup>
                    <thead className="bg-lightGray/50 dark:bg-white/5">
                        <tr>
                            <th className="text-left px-5 py-3 dark:text-white text-sm uppercase tracking-wider">Sinh viên</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Tên đề tài</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Loại</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">GVHD</th>
                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Phản biện</th>
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
                                    <td className="py-3 text-sm dark:text-white/70">{topic.supervisor?.full_name ?? "—"}</td>
                                    <td className="py-3 text-sm" onClick={e => e.stopPropagation()}>
                                        <span className="text-sm text-gray dark:text-white/50">
                                            {topic.thesis_type !== ThesisType.CAPSTONE ? "—" : (topic.reviewer?.full_name ?? "Chưa phân công")}
                                        </span>
                                    </td>
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
                                                Xem
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
                                <td colSpan={7} className="py-20 text-center text-gray italic">Chưa có đề tài nào trong lớp này</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal chỉ định GVPB */}
            {assignTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => { setAssignTarget(null); setSearch("") }}>
                    <div className="bg-white dark:bg-lightDark shadow-xl w-[460px] max-w-[calc(100vw-2rem)] rounded-small overflow-hidden flex flex-col max-h-[70vh]"
                        onClick={e => e.stopPropagation()}>

                        <div className="flex items-center justify-between px-5 py-4 bg-lightGray dark:bg-darkGray shrink-0">
                            <h2 className="font-bold dark:text-white">Chỉ định Giảng viên phản biện</h2>
                            <button onClick={() => { setAssignTarget(null); setSearch("") }} className="p-1 hover:opacity-60 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-5 py-3 shrink-0 border-b-[0.5px] border-lightGray dark:border-gray/30">
                            <p className="text-smallSize text-gray dark:text-white/60 mb-2">Đề tài: <span className="font-medium dark:text-white/80">{assignTarget.title}</span></p>
                            
                            <input
                                autoFocus
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Tìm theo tên hoặc email..."
                                className="w-full border-[0.5px] border-lightGray dark:border-gray/50 rounded-small px-3 py-2 dark:bg-dark dark:text-white text-smallSize"
                            />
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {filteredLecturers.length === 0 ? (
                                <p className="py-10 text-center text-smallSize text-gray dark:text-white/50 italic px-5">
                                    Không tìm thấy giảng viên. Nếu không thấy giảng viên cần tìm, hãy làm mới trang.
                                </p>
                            ) : filteredLecturers.map(l => {
                                const isCurrentReviewer = l.user.id === assignTarget.reviewer?.id
                                return (
                                    <button key={l.user.id} disabled={assigning}
                                        onClick={() => handleAssignReviewer(l.user.id)}
                                        className={`w-full flex items-center justify-between px-5 py-3 text-left border-b-[0.5px] border-lightGray dark:border-gray/20 last:border-0 hover:bg-lighterGray dark:hover:bg-white/5 transition-colors disabled:opacity-50 ${isCurrentReviewer ? "bg-mainColor/5 dark:bg-mainColor/10" : ""}`}>
                                        <div>
                                            <p className={`text-smallSize font-semibold ${isCurrentReviewer ? "text-mainColor!" : "dark:text-white"}`}>{l.user.full_name}</p>
                                            <p className="text-tinySize text-gray dark:text-white/50 mt-0.5">{l.user.email}</p>
                                        </div>
                                        {isCurrentReviewer && (
                                            <span className="text-tinySize text-mainColor! font-bold shrink-0 ml-3">✓ Đang phản biện</span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="px-5 py-3 bg-lightGray dark:bg-darkGray shrink-0 border-t-[0.5px] border-lightGray dark:border-gray/30">
                            <p className="text-tinySize text-gray dark:text-white/50 italic">Click vào tên giảng viên để chỉ định</p>
                        </div>
                    </div>
                </div>
            )}

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
