import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import type { RootState } from "../../../redux/store"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import NotificationsService from "../../../services/notifications/notifications.service"
import type { NotificationDetail } from "../../../services/notifications/notifications.type"
import { FormsService } from "../../../services/forms/forms.service"
import ProgressService from "../../../services/progress/progress.service"
import NotificationCard from "../../components/NotificationCard"
import TiptapEditor from "../../components/TiptapEditor"
import { confirmDialog } from "primereact/confirmdialog"

const EMPTY_FORM = { title: "", body: "", milestoneId: "", formIds: [] as string[] }

const RANewsfeed: React.FC = () => {
    const { classId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const notification = useSelector((state: RootState) => state.notification.notificationPagination)
    const progress = useSelector((state: RootState) => state.progress.currentProgress)
    const forms = useSelector((state: RootState) => state.form.formPagination)

    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<NotificationDetail | null>(null)
    const [formData, setFormData] = useState(EMPTY_FORM)

    useEffect(() => {
        if (!classId || !userData.id) return
        ;(async () => {
            dispatch(changeStateFetching(true))
            try {
                await ProgressService.getProgressDetail(classId)
                await FormsService.formsPagination(1, 100, undefined, false, undefined, classId)
                await NotificationsService.notificationPagination(classId, 1, 20)
            } catch { } finally {
                dispatch(changeStateFetching(false))
            }
        })()
    }, [classId, userData.id])

    const openCreate = () => { setEditing(null); setFormData(EMPTY_FORM); setShowForm(true) }
    const openEdit = (n: NotificationDetail) => {
        setEditing(n)
        setFormData({ title: n.title, body: n.body, milestoneId: n.milestone?.id ?? "", formIds: n.forms.map(f => f.id) })
        setShowForm(true)
    }

    const handleSubmit = async () => {
        if (!classId || !formData.title.trim()) return
        dispatch(changeStateFetching(true))
        await NotificationsService.upsertNotification({
            id: editing?.id,
            classId,
            title: formData.title,
            body: formData.body || JSON.stringify({ type: 'doc', content: [] }),
            milestoneId: formData.milestoneId || undefined,
            formIds: formData.formIds.length ? formData.formIds : undefined,
        }).then(() => { setShowForm(false) })
        .finally(() => { dispatch(changeStateFetching(false)) })
    }

    const handleDelete = (id: string) => {
        confirmDialog({
            header: "Xóa thông báo",
            message: "Bạn có chắc muốn xóa thông báo này?",
            acceptLabel: "Xóa", rejectLabel: "Hủy",
            accept: async () => {
                dispatch(changeStateFetching(true))
                await NotificationsService.removeNotification(id).finally(() => {
                    dispatch(changeStateFetching(false))
                })
            }
        })
    }

    const canEdit = (createdAt: string) => Date.now() - new Date(createdAt).getTime() < 86400000

    return (
        <div className="w-full h-fit flex flex-col gap-6 pt-topPadding pb-20">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-bigSize font-bold dark:text-white">Bảng tin</h2>
                    <p className="text-smallSize text-gray">
                        {notification?.data.length ?? 0} thông báo
                    </p>
                </div>
                {!showForm && (
                    <button onClick={openCreate} disabled={isFetching}
                        className="flex items-center gap-2 px-5 py-2.5 bg-mainColor text-white rounded-normal font-medium hoverBtn disableState text-smallSize">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tạo thông báo
                    </button>
                )}
            </div>

            {/* Create / Edit Form */}
            {showForm && (
                <div className="flex flex-col gap-5 p-6 rounded-normal bg-white dark:bg-lightDark border border-mainColor/30 shadow-[0_4px_20px_rgba(73,156,64,0.08)]">
                    <div className="flex items-center justify-between">
                        <h3 className="text-normalSize font-bold dark:text-white">
                            {editing ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
                        </h3>
                        <button onClick={() => setShowForm(false)} className="p-1.5 rounded-normal hover:bg-gray/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 stroke-gray">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-smallSize font-medium dark:text-white">Tiêu đề <span className="text-red">*</span></label>
                        <input
                            value={formData.title}
                            onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                            className="border border-gray/30 rounded-normal px-4 py-2.5 dark:bg-bgDark dark:text-white text-smallSize disableState focus:border-mainColor/50 transition-colors"
                            placeholder="Nhập tiêu đề thông báo..."
                            disabled={isFetching}
                        />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-smallSize font-medium dark:text-white">Nội dung <span className="text-red">*</span></label>
                        <TiptapEditor content={formData.body} onChange={body => setFormData(p => ({ ...p, body }))} />
                    </div>

                    {/* Milestone + Forms */}
                    <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-smallSize font-medium dark:text-white">Cột mốc <span className="text-gray font-normal">(tùy chọn)</span></label>
                            <select
                                value={formData.milestoneId}
                                onChange={e => setFormData(p => ({ ...p, milestoneId: e.target.value }))}
                                className="border border-gray/30 rounded-normal px-4 py-2.5 dark:bg-bgDark dark:text-white text-smallSize disableState focus:border-mainColor/50 transition-colors"
                                disabled={isFetching}
                            >
                                <option value="">Không chọn</option>
                                {progress?.milestones.map((m: any) => <option key={m.id} value={m.id}>{m.label}</option>)}
                            </select>
                            <p className="text-tinySize text-mainColor font-semibold flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3 fill-mainColor shrink-0">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                </svg>
                                Chỉ chọn được 1 cột mốc
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-smallSize font-medium dark:text-white">Form đính kèm <span className="text-gray font-normal">(tùy chọn)</span></label>
                            <select
                                multiple
                                value={formData.formIds}
                                onChange={e => setFormData(p => ({ ...p, formIds: Array.from(e.target.selectedOptions, o => o.value) }))}
                                className="border border-gray/30 rounded-normal px-4 py-2 dark:bg-bgDark dark:text-white text-smallSize disableState h-[88px] focus:border-mainColor/50 transition-colors"
                                disabled={isFetching}
                            >
                                {forms?.data.map(f => (
                                    <option key={f.id} value={f.id} className="dark:text-white py-1">{f.label}</option>
                                ))}
                            </select>
                            <p className="text-tinySize text-mainColor font-semibold flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3 fill-mainColor shrink-0">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                </svg>
                                Giữ <kbd className="px-1 py-0.5 bg-lighterGray dark:bg-bgDark dark:text-mainColor rounded text-tinySize font-bold">Ctrl</kbd> để chọn nhiều
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1 border-t border-lightGray/20 dark:border-white/5">
                        <button
                            onClick={handleSubmit}
                            disabled={isFetching || !formData.title.trim() || !formData.body}
                            className="px-5 py-2 bg-mainColor text-white rounded-normal text-smallSize font-medium hoverBtn disableState"
                        >
                            {editing ? "Cập nhật" : "Đăng thông báo"}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            disabled={isFetching}
                            className="px-5 py-2 bg-lighterGray dark:bg-bgDark text-gray dark:text-white rounded-normal text-smallSize font-medium hoverBtn disableState"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            {/* Feed */}
            <div className="flex flex-col gap-5 items-center w-full">
                {notification?.data.length === 0 && !showForm && (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <div className="p-4 rounded-full bg-lighterGray dark:bg-lightDark">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 stroke-gray">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                        </div>
                        <p className="text-gray italic text-smallSize">Chưa có thông báo nào.</p>
                    </div>
                )}

                {notification?.data.map(n => (
                    <div key={n.id} className="w-3/5 max-2xl:w-3/4 max-lg:w-full">
                        <NotificationCard
                            notification={n}
                            onFormClick={(formId) => navigate(`/main/roomadmin/class/${classId}/forms/${formId}`)}
                            actions={
                                <>
                                    {canEdit(n.created_at) && (
                                        <button onClick={() => openEdit(n)} disabled={isFetching}
                                            className="p-2 border border-gray/30 rounded-normal text-gray dark:text-white hover:bg-mainColor/5 hover:border-mainColor/30 transition-all disableState">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 stroke-gray dark:stroke-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(n.id)} disabled={isFetching}
                                        className="p-2 bg-redRGB rounded-normal hover:bg-red hover:text-white transition-all disableState group/del">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 stroke-red group-hover/del:stroke-white transition-colors">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </>
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RANewsfeed
