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

        (async () => {
            dispatch(changeStateFetching(true))

            try {
                await ProgressService.getProgressDetail(classId)
                await FormsService.formsPagination(1, 100, undefined, false, undefined, classId)
                await NotificationsService.notificationPagination(classId, 1, 20)
            } catch { }
            finally {
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
        }).then(() => {
            setShowForm(false)
        })
        .finally(() => {
            dispatch(changeStateFetching(false))
        })
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
        <div className="w-full h-fit flex flex-col gap-5 pt-topPadding pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-largeSize font-bold dark:text-white uppercase">Bảng tin</h2>

                {!showForm && (
                    <button onClick={openCreate} disabled={isFetching}
                        className="px-5 py-2 bg-mainColor text-white rounded-normal font-medium hoverBtn disableState">
                        + Tạo thông báo
                    </button>
                )}
            </div>

            {showForm && (
                <div className="flex flex-col gap-4 p-6 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark border border-mainColor/30">
                    <div className="flex flex-col gap-1">
                        <label className="text-smallSize dark:text-white italic">Tiêu đề <b className="text-red">*</b></label>
                        <input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                            className="border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-normalSize disableState"
                            placeholder="Tiêu đề thông báo..." disabled={isFetching} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-smallSize dark:text-white italic">Nội dung <b className="text-red">*</b></label>
                        <TiptapEditor content={formData.body} onChange={body => setFormData(p => ({ ...p, body }))} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                        <div className="flex flex-col gap-1">
                            <label className="text-smallSize dark:text-white italic">Cột mốc (tùy chọn)</label>
                            <select
                                value={formData.milestoneId} onChange={e => setFormData(p => ({ ...p, milestoneId: e.target.value }))}
                                className="border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-normalSize disableState"
                                disabled={isFetching}
                            >
                                <option value="">Chọn cột mốc</option>
                                {progress?.milestones.map((m: any) => <option key={m.id} value={m.id}>{m.label}</option>)}
                            </select>

                            <span className="flex items-center-safe gap-2.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3 fill-mainColor">
                                    <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                                    <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clipRule="evenodd" />
                                </svg>

                                <p className="text-mainColor text-smallSize italic">Bạn chỉ có thể chọn '<b><i><u className="text-mainColor">1</u></i></b>'cột mốc</p>
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-smallSize dark:text-white italic">Form đính kèm (tùy chọn)</label>

                            <select
                                multiple
                                value={formData.formIds}
                                onChange={e => setFormData(p => ({ ...p, formIds: Array.from(e.target.selectedOptions, o => o.value) }))}
                                className="w-full border border-gray/30 rounded-md px-3 py-2 dark:bg-dark dark:text-white text-normalSize disableState h-24"
                                disabled={isFetching}
                            >
                                {forms?.data.map(f => (
                                    <option className="dark:text-white flex items-center-safe gap-1.5 py-1 px-1.5 hover:cursor-pointer hover:bg-mainColorRGB/50" key={f.id} value={f.id}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4 dark:stroke-white">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                        </svg>

                                        <p className="max-w-4/5 truncate dark:text-white font-light">{f.label} sdf sdf sdf sdf sdf sdf sdf sdf sd sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf </p>
                                    </option>
                                ))}
                            </select>

                            <span className="flex items-center-safe gap-2.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3 fill-mainColor">
                                    <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                                    <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clipRule="evenodd" />
                                </svg>

                                <p className="text-mainColor text-smallSize italic">Giữ '<b><i><u className="text-mainColor">Ctrl</u></i></b>'để chọn nhiều hoặc bỏ chọn</p>
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={handleSubmit} disabled={isFetching || !formData.title.trim() || !formData.body}
                            className="px-5 py-2 bg-mainColor text-white rounded-md font-medium hoverBtn disableState">
                            {editing ? "Cập nhật" : "Tạo thông báo"}
                        </button>

                        <button onClick={() => setShowForm(false)} disabled={isFetching}
                            className="px-5 py-2 bg-gray/10 text-gray rounded-md font-medium hoverBtn disableState">
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-8 items-center-safe w-full">
                {notification && notification.data.length === 0 && !showForm && (
                    <p className="text-gray italic">Chưa có thông báo nào.</p>
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
                                            className="p-2 border border-gray/30 rounded-normal text-gray dark:text-white hover:bg-mainColor/5 hover:text-mainColor transition-all disableState shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(n.id)} disabled={isFetching}
                                        className="p-2 bg-redRGB  rounded-normal hover:bg-red hover:text-white transition-all disableState shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 stroke-red">
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
