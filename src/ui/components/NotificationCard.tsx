import type React from "react"
import type { NotificationDetail } from "../../services/notifications/notifications.type"
import TiptapEditor from "./TiptapEditor"
import formatVNTime from "../../utils/formatVNTime"
import getShortName from "../../utils/getShortName"
import uniqolor from "uniqolor"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"

interface Props {
    notification: NotificationDetail
    actions?: React.ReactNode
    onFormClick?: (formId: string) => void
}

const NotificationCard: React.FC<Props> = ({ notification: n, actions, onFormClick }) => {
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const color = uniqolor(n.createdBy.email)

    return (
        <div className="group w-full bg-white dark:bg-lightDark rounded-normal border border-lightGray/30 dark:border-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-4 border-b border-lightGray/20 dark:border-white/5">
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className={`size-10 rounded-full flex items-center justify-center font-bold text-smallSize shrink-0 ${color.isLight ? "text-darkGray" : "text-white"}`}
                        style={{ backgroundColor: color.color }}
                    >
                        {getShortName(n.createdBy.full_name)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-smallSize font-semibold dark:text-white truncate">{n.createdBy.full_name}</p>
                        <p className="text-tinySize text-gray">{formatVNTime(n.created_at)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {n.milestone && (
                        <span className="px-2.5 py-1 bg-mainColorRGB text-mainColor text-tinySize font-bold rounded-small uppercase tracking-wide">
                            {n.milestone.label}
                        </span>
                    )}
                    {actions && (
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {actions}
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4 flex flex-col gap-2">
                <h2 className="text-normalSize font-bold dark:text-white leading-snug">{n.title}</h2>
                <div className="[&_.ProseMirror]:min-h-0! [&_.ProseMirror]:px-0! [&_.ProseMirror]:py-0! [&>div]:px-0! [&>div]:py-0! [&>div]:min-h-0!">
                    <TiptapEditor content={n.body} readonly />
                </div>
            </div>

            {/* Attached Forms */}
            {n.forms.length > 0 && (
                <div className="px-5 pb-5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-tinySize font-bold text-gray uppercase tracking-widest">Biểu mẫu đính kèm</span>
                        <div className="h-px flex-1 bg-lightGray/30 dark:bg-white/5" />
                    </div>
                    {n.forms.map(f => (
                        <button
                            key={f.id}
                            onClick={() => onFormClick?.(f.id)}
                            disabled={isFetching}
                            className="flex items-center gap-3 p-3 rounded-normal bg-lighterGray dark:bg-bgDark border border-lightGray/30 dark:border-white/5 hover:border-mainColor/40 hover:bg-mainColorRGB/30 transition-colors group/form disableState text-left"
                        >
                            <div className="p-1.5 rounded-small bg-white dark:bg-lightDark shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 stroke-mainColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </div>
                            <span className="flex-1 text-smallSize font-medium dark:text-white truncate">{f.label}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-3.5 stroke-gray opacity-0 group-hover/form:opacity-100 shrink-0 transition-opacity">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default NotificationCard
