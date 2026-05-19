import type React from "react"
import { useEffect, useState } from "react"
import type { TopicDetail } from "../../services/topics/topics.type"
import { MainRole, Role, TopicStatus, VNThesisType, VNTopicStatus } from "../../config/enum"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"

type Props = {
    topics: TopicDetail[]
    isFetching: boolean
    rejectNotes: Record<string, string>
    onRejectNoteChange: (id: string, note: string) => void
    onReview: (id: string, approve: boolean) => Promise<void>
    refreshTopics: () => Promise<void>
    onClose: () => void
}

const OutlineReviewPanel: React.FC<Props> = ({ topics, isFetching, rejectNotes, onRejectNoteChange, onReview, refreshTopics, onClose }) => {
    const [selected, setSelected] = useState<TopicDetail>(topics[0])
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const currentClass = useSelector((state: RootState) => state.class.currentClass.info)

    useEffect(() => {
        setSelected(prev => topics.find(t => t.id === prev?.id) ?? topics[0])
    }, [topics])

    return (
        <div className="fixed inset-0 z-50 flex bg-black/60">
            {/* Cột trái — danh sách đề cương */}
            <div className="w-96 shrink-0 bg-bgLight dark:bg-bgDark flex flex-col border-r border-gray/10 overflow-y-auto">
                <div className="flex flex-col px-5 py-4 border-b border-gray/10 gap-3.5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold dark:text-white">Đề cương chờ duyệt ({topics.length})</h3>

                        <button onClick={onClose} className="hover:cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-5 stroke-red">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <button onClick={refreshTopics} className="w-fit hover:cursor-pointer flex items-center border border-lightGray px-2.5 py-1.5 rounded-small">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>

                        <p className="text-smallSize text-black dark:text-white ml-2">Làm mới</p>
                    </button>
                </div>

                <div className="flex flex-col gap-1 p-3">
                    {topics.map(topic => (
                        <button key={topic.id} onClick={() => setSelected(topic)}
                            className={`text-left px-4 py-3 rounded-small transition-colors ${selected?.id === topic.id ? "bg-mainColorRGB text-mainColor" : "hover:bg-gray/5 dark:text-white"}`}>
                            <p className="font-medium text-smallSize line-clamp-1 dark:text-white">{topic.title}</p>
                            <p className="text-tinySize text-gray mt-0.5">{topic.student.full_name} — {VNThesisType[topic.thesis_type]?.split("(")[0]}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cột phải — xem file + duyệt */}
            <div className="flex-1 flex flex-col bg-white dark:bg-lightDark overflow-hidden">
                {selected && (
                    <>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray/10 flex items-center justify-between gap-50">
                            <div className="flex flex-col gap-0.5">
                                <h2 className="font-bold text-bigSize dark:text-white">{selected.title}</h2>

                                <p className="text-smallSize text-mainColor font-bold">
                                    {selected.student.full_name} · {VNThesisType[selected.thesis_type]} · GVHD: {selected.supervisor?.full_name ?? "—"}
                                </p>
                            </div>

                            <span className={`text-smallSize font-semibold shrink-0 ${VNTopicStatus[selected.status]?.color}`}>
                                {VNTopicStatus[selected.status]?.label}
                            </span>
                        </div>

                        {/* PDF viewer */}
                        <div className="flex-1 overflow-hidden">
                            {selected.outline_file_url ? (
                                <iframe src={selected.outline_file_url} className="w-full h-full border-0" title="Đề cương" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray italic">Chưa có file đề cương</div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="px-6 py-4 border-t border-gray/10 flex flex-col gap-2.5">
                            {currentClass && currentClass.user.role === Role.ROOMADMIN && (
                                <p className="text-smallSize text-oranged font-semibold">Quyết định sẽ không thể thay đổi sau khi đã thực hiện</p>
                            )}

                            <div className="flex items-center gap-3">
                                <button onClick={async () => { await onReview(selected.id, true); onClose() }} disabled={isFetching || selected.status === TopicStatus.APPROVED || (userData.role === MainRole.USER && currentClass?.user?.role === Role.ROOMADMIN && selected.status === TopicStatus.OUTLINE_REJECTED) || (userData.role === MainRole.USER && currentClass?.user?.role === Role.ROOMADMIN && selected.status !== TopicStatus.OUTLINE_PENDING)}
                                    className="px-5 py-2 bg-mainColor text-white rounded-md text-smallSize font-bold hover:opacity-80 transition-opacity disableState shrink-0 disabled:opacity-40 disabled:cursor-not-allowed">
                                    {selected.status === TopicStatus.OUTLINE_PENDING ? "Duyệt và gửi Khoa" : "Phê duyệt chính thức"}
                                </button>

                                <button onClick={async () => { await onReview(selected.id, false); onClose() }} disabled={isFetching || selected.status === TopicStatus.OUTLINE_REJECTED || (userData.role === MainRole.USER && currentClass?.user?.role === Role.ROOMADMIN && selected.status === TopicStatus.APPROVED) || (userData.role === MainRole.USER && currentClass?.user?.role === Role.ROOMADMIN && selected.status !== TopicStatus.OUTLINE_PENDING)}
                                    className="px-5 py-2 bg-red text-white rounded-md text-smallSize font-bold hover:opacity-80 transition-opacity disableState shrink-0 disabled:opacity-40 disabled:cursor-not-allowed">
                                    Từ chối
                                </button>

                                {selected.status !== TopicStatus.OUTLINE_REJECTED && (
                                    <input value={rejectNotes[selected.id] ?? ""} onChange={e => onRejectNoteChange(selected.id, e.target.value)}
                                        className="flex-1 border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-smallSize disableState"
                                        placeholder="Lý do từ chối (nếu có)..." disabled={isFetching || (userData.role === MainRole.USER && currentClass?.user?.role === Role.ROOMADMIN && selected.status !== TopicStatus.OUTLINE_PENDING)} />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default OutlineReviewPanel
