import type React from "react"
import { useState } from "react"

type ScoreboardItem = {
    id: string
    title: string
    description: string
    coefficient: number // percentage
    score: number | null // null if not yet graded
    status: "graded" | "pending" | "locked"
    lastUpdated: string
}

const SDScoreboards: React.FC = () => {
    // Mock data for student's scores
    const [scores] = useState<ScoreboardItem[]>([
        {
            id: "1",
            title: "Điểm Giảng viên hướng dẫn",
            description: "Đánh giá quá trình thực hiện và thái độ làm việc",
            coefficient: 40,
            score: 9.0,
            status: "locked",
            lastUpdated: "05-03-2026"
        },
        {
            id: "2",
            title: "Điểm Hội đồng bảo vệ",
            description: "Đánh giá chất lượng đồ án và kỹ năng thuyết trình",
            coefficient: 60,
            score: null,
            status: "pending",
            lastUpdated: "Đang cập nhật"
        }
    ])

    // Calculate average score (weighted)
    const calculateGPA = () => {
        const gradedScores = scores.filter(s => s.score !== null)
        if (gradedScores.length === 0) return 0
        
        const totalWeight = gradedScores.reduce((acc, curr) => acc + curr.coefficient, 0)
        const weightedSum = gradedScores.reduce((acc, curr) => acc + (curr.score! * curr.coefficient), 0)
        
        return (weightedSum / totalWeight).toFixed(2)
    }

    const gpa = calculateGPA()

    return (
        <div className="w-full h-fit flex flex-col gap-8 py-mainTwoSidePadding">
            {/* Header & Overview */}
            <div className="w-full flex justify-between items-end-safe max-md:flex-col max-md:items-start max-md:gap-5">
                <div className="flex flex-col gap-1">
                    <h1 className="text-hugeSize font-bold dark:text-white leading-tight">Điểm của tôi</h1>
                    <p className="text-normalSize text-gray dark:text-lightGray font-medium">Theo dõi điểm số và tiến độ hoàn thành các cột điểm</p>
                </div>

                <div className="flex items-center gap-6 bg-white dark:bg-lightDark p-5 rounded-big shadow-sm border border-gray/5">
                    <div className="flex flex-col items-center px-4">
                        <p className="text-tinySize text-gray font-bold uppercase tracking-wider mb-1">Điểm đồ án</p>
                        <p className="text-largeSize font-black text-mainColor">{gpa}</p>
                    </div>
                </div>
            </div>

            {/* Scoreboards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {scores.map((item) => (
                    <div key={item.id} className="group relative flex justify-between items-center p-6 bg-white dark:bg-lightDark border-[0.5px] border-lightGray dark:border-gray rounded-big hover:border-mainColor/30 hover:shadow-xl hover:shadow-mainColor/5 transition-all duration-300 overflow-hidden">
                        {/* Status Ribbon/Bar */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${
                            item.status === 'locked' ? 'bg-red-400' : 
                            item.status === 'graded' ? 'bg-mainColor' : 'bg-gray/30'
                        }`}></div>

                        <div className="flex flex-col gap-3 flex-1 pr-6">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-mediumSize font-bold dark:text-white group-hover:text-mainColor transition-colors">
                                        {item.title}
                                    </h3>
                                    {item.status === 'locked' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3.5 text-red-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                    )}
                                </div>
                                <p className="text-smallSize text-gray dark:text-lightGray font-light line-clamp-1">{item.description}</p>
                            </div>

                            <div className="flex items-center gap-5">
                                <span className="flex items-center gap-1.5 py-1 px-3 bg-lightGray dark:bg-gray/20 rounded-full">
                                    <p className="text-tinySize text-gray font-bold uppercase tracking-tight">Hệ số:</p>
                                    <p className="text-smallSize font-black dark:text-white">{item.coefficient}%</p>
                                </span>
                                <p className="text-tinySize text-gray italic">Cập nhật: {item.lastUpdated}</p>
                            </div>
                        </div>

                        {/* Prominent Score Display */}
                        <div className="flex flex-col items-center justify-center min-w-[100px] h-[100px] rounded-normal bg-bgLight dark:bg-black/40 border border-gray/5 shadow-inner">
                            {item.score !== null ? (
                                <>
                                    <p className={`text-[42px] font-black leading-none ${
                                        item.score >= 8 ? 'text-mainColor' : 
                                        item.score >= 5 ? 'text-orange-400' : 'text-red-400'
                                    }`}>
                                        {item.score}
                                    </p>
                                    <p className="text-tinySize text-gray font-bold uppercase tracking-widest mt-1">Điểm số</p>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-1">
                                        <span className="size-2 bg-gray/30 rounded-full animate-bounce"></span>
                                        <span className="size-2 bg-gray/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="size-2 bg-gray/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    </div>
                                    <p className="text-tinySize text-gray font-bold uppercase tracking-widest mt-2">Đang chấm</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Note section */}
            <div className="mt-5 p-6 bg-mainColor/5 rounded-big border border-mainColor/10">
                <div className="flex items-center gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-mainColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <h4 className="text-normalSize font-bold text-mainColor">Thông tin lưu ý</h4>
                </div>
                <ul className="flex flex-col gap-2 text-smallSize text-gray list-disc pl-5">
                    <li className="dark:text-gray">Điểm trung bình được tính dựa trên trọng số (hệ số) của từng cột điểm đã có.</li>
                    <li className="dark:text-gray">Các cột điểm có biểu tượng ổ khóa <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3 inline text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg> là điểm đã được giảng viên chốt và không thể thay đổi.</li>
                </ul>
            </div>
        </div>
    )
}

export default SDScoreboards
