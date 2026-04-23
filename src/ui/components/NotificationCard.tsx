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
        <div className="group w-full bg-white dark:bg-[#1c1c1e] rounded-[24px] border border-gray-200/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div 
                            className={`size-12 rounded-full flex items-center justify-center font-bold text-normalSize shrink-0 shadow-sm ${color.isLight ? "text-darkGray" : "text-white"}`}
                            style={{ backgroundColor: color.color }}
                        >
                            {getShortName(n.createdBy.full_name)}
                        </div>

                        <div className="flex flex-col">
                            <p className="text-normalSize font-bold dark:text-white leading-none">
                                {n.createdBy.full_name}
                            </p>

                            <p className="text-[13px] text-gray-400 mt-1.5 font-medium">
                                {formatVNTime(n.created_at)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {actions && <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">{actions}</div>}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <h2 className="text-largeSize font-bold dark:text-white leading-tight tracking-tight">
                            {n.title}
                        </h2>

                        {n.milestone && (
                            <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded-md uppercase tracking-wider border border-gray-200/50 dark:border-white/5">
                                {n.milestone.label}
                            </span>
                        )}
                    </div>
                    
                    <div className="text-normalSize dark:text-gray-300 leading-relaxed max-w-none">
                        <TiptapEditor content={n.body} readonly />
                    </div>
                </div>

                {n.forms.length > 0 && (
                    <div className="mt-2 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Biểu mẫu lớp học</span>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-white/5"></div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            {n.forms.map(f => (
                                <button 
                                    key={f.id} 
                                    onClick={() => onFormClick ? onFormClick(f.id) : null}
                                    className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-white/2 rounded-xl border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition-all group/item cursor-pointer disableState"
                                    disabled={isFetching}
                                >
                                    <div className="size-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center group-hover/item:text-mainColor shadow-sm transition-colors shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                    </div>

                                    <div className="flex flex-col min-w-0 text-left">
                                        <span className="text-normalSizeSize font-bold dark:text-white truncate">{f.label}</span>
                                        <span className="text-smallSize text-gray-400 font-medium">Nhấn để xem biểu mẫu</span>
                                    </div>
                                    
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 text-gray-300 ml-auto opacity-0 group-hover/item:opacity-100 transform translate-x-2 group-hover/item:translate-x-0 transition-all">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationCard
