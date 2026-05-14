import type React from "react"
import { useEffect, useState } from "react"

type Props = {
    visible: boolean
    label: string
    onConfirm: () => void
    onHide: () => void
    loading?: boolean
}

const ApproveDialog: React.FC<Props> = ({ visible, label, onConfirm, onHide, loading }) => {
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        if (!visible) { setCountdown(5); return }
        const interval = setInterval(() => {
            setCountdown(prev => prev <= 1 ? (clearInterval(interval), 0) : prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [visible])

    if (!visible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onHide}>
            <div className="bg-white dark:bg-lightDark shadow-xl w-[400px] max-w-[calc(100vw-2rem)] rounded-small overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 bg-lightGray dark:bg-darkGray">
                    <h2 className="font-bold dark:text-white">Xác nhận duyệt bảng điểm</h2>
                    <button onClick={onHide} className="p-1 hover:opacity-60 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-5 py-5 flex flex-col gap-2">
                    <p className="text-smallSize text-gray dark:text-gray-400">Bạn đang duyệt bảng điểm:</p>
                    <p className="text-normalSize font-bold dark:text-white">"{label}"</p>
                    <p className="text-smallSize text-gray dark:text-gray-400 mt-1">Sau khi duyệt, bảng điểm sẽ được chốt và không thể mở lại.</p>
                </div>

                <div className="flex justify-end gap-2 px-5 py-4 bg-lightGray dark:bg-darkGray">
                    <button onClick={onHide} disabled={loading} className="px-4 py-2 text-smallSize font-bold dark:text-white hover:opacity-60 transition-opacity disabled:opacity-40 rounded-small">
                        Hủy
                    </button>
                    <button onClick={onConfirm} disabled={countdown > 0 || loading} className="px-5 py-2 bg-mainColor text-white text-smallSize font-bold rounded-small hoverBtn disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? "Đang duyệt..." : countdown > 0 ? `Duyệt (${countdown}s)` : "Duyệt"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ApproveDialog
