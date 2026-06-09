import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import ProgressService from "../../../services/progress/progress.service"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { setCurrentMilestone } from "../../../redux/reducers/progressSlice.reducer"
import Loading from "../../components/Loading"
import formatVNTime from "../../../utils/formatVNTime"
import { VNScoreFormTag, VNScoreFormStatus, VNRoleName } from "../../../config/enum"
import TiptapEditor from "../../components/TiptapEditor"
import FormViewer from "../../components/FormViewer"
import { FormsService } from "../../../services/forms/forms.service"
import type { DetailForm } from "../../../services/forms/forms.type"

const RAMilestoneDetail: React.FC = () => {
    const { classId, milestoneId } = useParams<{ classId: string; milestoneId: string }>()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const currentClass = useSelector((state: RootState) => state.class.currentClass)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const currentForm = useSelector((state: RootState) => state.form.currentForm)
    const progress = useSelector((state: RootState) => state.progress.currentProgress)
    const milestone = useSelector((state: RootState) => state.progress.currentMilestone)
    const currentFormRef = useRef(currentForm)
    useEffect(() => { currentFormRef.current = currentForm }, [currentForm])
    useEffect(() => {
        if (currentForm && viewingForm && currentForm.id === viewingForm.id) {
            setViewingForm(currentForm)
        }
    }, [currentForm])

    const [viewingForm, setViewingForm] = useState<DetailForm | null>(null)

    const openForm = async (formId: string) => {
        if (!classId) return
        const result = await FormsService.getFormDetail(classId, formId)
        if (result) setViewingForm(currentFormRef.current)
    }

    useEffect(() => {
        if (!classId || !milestoneId) return
            ; (async () => {
                dispatch(changeStateFetching(true))
                const data = await ProgressService.getOneMilestone(milestoneId, classId).finally(() => {
                    dispatch(changeStateFetching(false))
                })
                if (data && typeof data !== "boolean") {
                    dispatch(setCurrentMilestone(data))
                }
            })()

        return () => { dispatch(setCurrentMilestone(null)) }
    }, [classId, milestoneId])

    if (isFetching && !milestone) return <Loading />
    if (!milestone) return null
    if (progress && progress.is_banned) {
        navigate(`/main/${currentClass.info.user.role}/class/${classId}/milestones/`, { replace: true })
    }

    return (
        <div className="w-full h-fit flex flex-col gap-6 pt-topPadding pb-20">
            {viewingForm && <FormViewer formId={viewingForm.id} onClose={() => setViewingForm(null)} />}

            {/* Header + Info Card */}
            <div className="flex flex-col gap-4 p-6 rounded-normal bg-white dark:bg-lightDark shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-lightGray/20 dark:border-white/5">
                {/* Back + status */}
                <div className="flex items-center justify-between gap-3">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-normal bg-lighterGray dark:bg-bgDark hover:bg-gray/20 dark:hover:bg-white/10 transition-colors text-smallSize font-medium dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Quay lại
                    </button>

                    <span className={`px-3 py-1 rounded-small text-tinySize font-bold uppercase tracking-wide ${milestone.is_stopped ? "bg-redRGB text-red" : "bg-mainColorRGB text-mainColor"}`}>
                        {milestone.is_stopped ? "Đã dừng" : "Đang hoạt động"}
                    </span>
                </div>

                {/* Index + Title */}
                <div className="flex flex-col gap-1">
                    <span className="text-tinySize text-mainColor font-semibold uppercase">Cột mốc {milestone.index + 1}</span>
                    <h1 className="text-bigSize font-bold dark:text-white leading-tight">{milestone.label}</h1>

                    {milestone.description && (
                        <p className="text-smallSize text-gray leading-relaxed mt-1">{milestone.description}</p>
                    )}
                </div>

                {/* Divider + Meta */}
                <div className="flex justify-between pt-4 border-t border-lightGray/20 dark:border-white/5 flex-wrap">

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 stroke-gray shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>

                            <span className="text-tinySize text-gray">Khởi tạo:</span>
                            <span className="text-tinySize font-semibold dark:text-white">{formatVNTime(milestone.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 stroke-gray shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>

                            <span className="text-tinySize text-gray">Cập nhật:</span>
                            <span className="text-tinySize font-semibold dark:text-white">{formatVNTime(milestone.updated_at)}</span>
                        </div>
                    </div>

                    {milestone.is_registration_milestone && (
                        <div className="">
                            <NavLink to={`/main/${currentClass.info.user.role}/class/${classId}/topics`} className="text-smallSize text-white bg-mainColor px-3.5 py-1.5 rounded-small">Xem đề tài</NavLink>
                        </div>
                    )}
                </div>
            </div>

            {/* Notifications */}
            <Section
                title="Thông báo"
                count={milestone.notifications.length}
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                }
            >
                {milestone.notifications.map((notif) => (
                    <div key={notif.id} className="flex flex-col rounded-normal bg-white dark:bg-lightDark border border-lightGray/30 dark:border-white/5 hover:border-mainColor/30 transition-colors overflow-hidden">
                        <div className="flex items-center justify-between gap-4 px-4 pt-4 pb-3 border-b border-lightGray/20 dark:border-white/5">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="size-7 rounded-full bg-mainColorRGB flex items-center justify-center shrink-0">
                                    <span className="text-tinySize font-bold text-mainColor">{notif.createdBy.full_name.charAt(0).toUpperCase()}</span>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-smallSize font-semibold dark:text-white truncate">{notif.createdBy.full_name}</p>
                                    <p className="text-tinySize text-gray">{VNRoleName[notif.createdBy.classMember[0]?.role] ?? notif.createdBy.classMember[0]?.role}</p>
                                </div>
                            </div>
                            <span className="text-tinySize text-gray shrink-0">{formatVNTime(notif.created_at)}</span>
                        </div>

                        <div className="px-4 py-3 flex flex-col gap-1">
                            <p className="font-semibold dark:text-white">{notif.title}</p>
                            <div className="[&_.ProseMirror]:min-h-0! [&_.ProseMirror]:px-0! [&_.ProseMirror]:py-0! [&>div]:px-0! [&>div]:py-0! [&>div]:min-h-0!">
                                <TiptapEditor content={notif.body} readonly />
                            </div>
                        </div>
                    </div>
                ))}
            </Section>

            {/* Forms */}
            <Section
                title="Biểu mẫu"
                count={milestone.forms.length}
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                    </svg>
                }
            >
                {milestone.forms.map((form) => (
                    <div key={form.id} onClick={() => openForm(form.id)} className="flex items-center gap-4 p-4 rounded-normal bg-white dark:bg-lightDark border border-lightGray/30 dark:border-white/5 hover:border-mainColor/30 transition-colors cursor-pointer">
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold dark:text-white truncate">{form.label}</p>
                                {form.is_join_form && (
                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-tinySize font-bold rounded-small uppercase shrink-0">Đăng ký</span>
                                )}
                                {form.email_notification_enabled && (
                                    <span className="px-2 py-0.5 bg-orangedRGB text-oranged text-tinySize font-bold rounded-small uppercase shrink-0">Email</span>
                                )}
                            </div>
                            {form.description && <p className="text-tinySize text-gray italic truncate">{form.description}</p>}
                            {(form.open_at || form.close_at) && (
                                <div className="flex items-center gap-3 flex-wrap">
                                    {form.open_at && <p className="text-tinySize text-gray">Mở: <span className="text-mainColor font-medium">{formatVNTime(form.open_at)}{form.is_auto_open ? " (tự động)" : ""}</span></p>}
                                    {form.close_at && <p className="text-tinySize text-gray">Đóng: <span className="text-red font-medium">{formatVNTime(form.close_at)}{form.is_auto_close ? " (tự động)" : ""}</span></p>}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-tinySize text-gray bg-lighterGray dark:bg-bgDark px-2 py-1 rounded-small">{form.field_count} trường</span>
                            <span className={`text-smallSize font-bold ${form.is_stopped ? "text-red" : "text-mainColor"}`}>
                                {form.is_stopped ? "Dừng" : "Hoạt động"}
                            </span>
                        </div>
                    </div>
                ))}
            </Section>

            {/* Score Forms */}
            <Section
                title="Bảng điểm"
                count={milestone.scoreForms.length}
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                }
            >
                {milestone.scoreForms.map((sf) => (
                    <div key={sf.id} className="flex items-center gap-4 p-4 rounded-normal bg-white dark:bg-lightDark border border-lightGray/30 dark:border-white/5 hover:border-mainColor/30 transition-colors">
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold dark:text-white truncate">{sf.label}</p>
                                <span className="px-2 py-0.5 bg-mainColorRGB text-mainColor text-tinySize font-bold rounded-small uppercase shrink-0">
                                    {VNScoreFormTag[sf.score_form_type] ?? sf.score_form_type}
                                </span>
                                {sf.email_notification_enabled && (
                                    <span className="px-2 py-0.5 bg-orangedRGB text-oranged text-tinySize font-bold rounded-small uppercase shrink-0">Email</span>
                                )}
                            </div>
                            {sf.description && <p className="text-tinySize text-gray italic truncate">{sf.description}</p>}
                            {(sf.open_at || sf.close_at) && (
                                <div className="flex items-center gap-3 flex-wrap">
                                    {sf.open_at && <p className="text-tinySize text-gray">Mở: <span className="text-mainColor font-medium">{formatVNTime(sf.open_at)}{sf.is_auto_open ? " (tự động)" : ""}</span></p>}
                                    {sf.close_at && <p className="text-tinySize text-gray">Đóng: <span className="text-red font-medium">{formatVNTime(sf.close_at)}{sf.is_auto_close ? " (tự động)" : ""}</span></p>}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-tinySize text-gray bg-lighterGray dark:bg-bgDark px-2 py-1 rounded-small">{sf.field_count} trường</span>
                            <span className={`text-smallSize font-bold ${VNScoreFormStatus[sf.status]?.color ?? "text-gray"}`}>
                                {VNScoreFormStatus[sf.status]?.label ?? sf.status}
                            </span>
                        </div>
                    </div>
                ))}
            </Section>
        </div>
    )
}

const Section: React.FC<{
    title: string
    count: number
    icon: React.ReactNode
    children?: React.ReactNode
}> = ({ title, count, icon, children }) => {
    if (count === 0) return null
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <span className="stroke-mainColor [&_svg]:stroke-mainColor">{icon}</span>
                <h2 className="text-normalSize font-bold dark:text-white">{title}</h2>
                <span className="ml-1 px-2 py-0.5 bg-lighterGray dark:bg-lightDark text-gray text-tinySize font-bold rounded-small">{count}</span>
            </div>
            <div className="flex flex-col gap-2">{children}</div>
        </div>
    )
}

export default RAMilestoneDetail
