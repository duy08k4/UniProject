import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import TopicsService from "../../../services/topics/topics.service"
import ProgressService from "../../../services/progress/progress.service"
import type { TopicDetail } from "../../../services/topics/topics.type"
import { TopicStatus, VNThesisType } from "../../../config/enum"
import Loading from "../../components/Loading"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"

const LTTopics: React.FC = () => {
    const { classId } = useParams()
    const dispatch = useDispatch()
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const progress = useSelector((state: RootState) => state.progress.currentProgress)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const [topics, setTopics] = useState<TopicDetail[]>([])
    const [loading, setLoading] = useState(true)
    const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})

    const registrationMilestone = progress?.milestones?.find((m: any) => m.is_registration_milestone)

    const fetchTopics = async () => {
        if (!classId || !registrationMilestone?.id) { setLoading(false); return }
        setLoading(true)
        const result = await TopicsService.getTopics(classId, registrationMilestone.id)
        if (result) setTopics(result.filter(t => t.supervisor?.id === userData?.id && t.status === TopicStatus.INVITED))
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
        if (result) setTopics(prev => prev.filter(t => t.id !== topicId))
        dispatch(changeStateFetching(false))
    }

    if (loading) return <Loading />

    return (
        <div className="w-full h-fit flex flex-col gap-5 pt-topPadding pb-20">
            <h2 className="text-hugeSize font-bold dark:text-white uppercase">Lời mời hướng dẫn</h2>

            {topics.length === 0 && (
                <p className="text-gray italic">Không có lời mời hướng dẫn nào đang chờ phản hồi.</p>
            )}

            {topics.map(topic => (
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
        </div>
    )
}

export default LTTopics
