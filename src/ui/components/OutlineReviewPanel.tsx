import type React from "react"
import { useEffect, useState } from "react"
import type { TopicDetail } from "../../services/topics/topics.type"
import { VNThesisType, VNTopicStatus } from "../../config/enum"

type Props = {
    topics: TopicDetail[]
    isFetching: boolean
    rejectNotes: Record<string, string>
    onRejectNoteChange: (id: string, note: string) => void
    onReview: (id: string, approve: boolean) => Promise<void>
    onClose: () => void
}

const OutlineReviewPanel: React.FC<Props> = ({ topics, isFetching, rejectNotes, onRejectNoteChange, onReview, onClose }) => {
    const [selected, setSelected] = useState<TopicDetail>(topics[0])

    useEffect(() => {
        setSelected(prev => topics.find(t => t.id === prev?.id) ?? topics[0])
    }, [topics])

    return (
        <div className="fixed inset-0 z-50 flex bg-black/60">
            {/* Cột trái — danh sách đề cương */}
            <div className="w-80 shrink-0 bg-bgLight dark:bg-bgDark flex flex-col border-r border-gray/10 overflow-y-auto">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray/10">
                    <h3 className="font-bold dark:text-white">Đề cương chờ duyệt ({topics.length})</h3>
                    <button onClick={onClose} className="text-gray hover:text-red transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-1 p-3">
                    {topics.map(topic => (
                        <button key={topic.id} onClick={() => setSelected(topic)}
                            className={`text-left px-4 py-3 rounded-normal transition-colors ${selected?.id === topic.id ? "bg-mainColorRGB text-mainColor" : "hover:bg-gray/5 dark:text-white"}`}>
                            <p className="font-medium text-smallSize line-clamp-1 dark:text-white">{topic.title}</p>
                            <p className="text-tinySize text-gray mt-0.5">{topic.student.full_name} — {VNThesisType[topic.thesis_type]?.split(" ")[0]}</p>
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
                        <div className="px-6 py-4 border-t border-gray/10 flex items-center gap-3">
                            {selected.status !== "outline_rejected" && (
                                <input value={rejectNotes[selected.id] ?? ""} onChange={e => onRejectNoteChange(selected.id, e.target.value)}
                                    className="flex-1 border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-smallSize disableState"
                                    placeholder="Lý do từ chối (nếu có)..." disabled={isFetching} />
                            )}
                            <button onClick={() => onReview(selected.id, true)} disabled={isFetching || selected.status === "approved"}
                                className="px-5 py-2 bg-mainColor text-white rounded-md text-smallSize font-medium hover:opacity-80 transition-opacity disableState shrink-0 disabled:opacity-40 disabled:cursor-not-allowed">
                                Duyệt
                            </button>
                            <button onClick={() => onReview(selected.id, false)} disabled={isFetching || selected.status === "outline_rejected"}
                                className="px-5 py-2 bg-red text-white rounded-md text-smallSize font-medium hover:opacity-80 transition-opacity disableState shrink-0 disabled:opacity-40 disabled:cursor-not-allowed">
                                Từ chối
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default OutlineReviewPanel
