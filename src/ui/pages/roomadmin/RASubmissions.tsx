import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

type Submission = {
    id: number
    title: string
    deadline: string
    totalStudents: number
    notSubmitted: number
    graded: number
    totalSubmitted: number
}

const submissions: Submission[] = [
    {
        id: 1,
        title: "Bài 1: Giới thiệu React",
        deadline: "2024-03-15",
        totalStudents: 5,
        notSubmitted: 2,
        graded: 2,
        totalSubmitted: 3
    },
    {
        id: 2,
        title: "Báo cáo Lý thuyết",
        deadline: "2024-03-20",
        totalStudents: 5,
        notSubmitted: 2,
        graded: 1,
        totalSubmitted: 3
    },
    {
        id: 3,
        title: "Quiz: Cơ bản HTML & CSS",
        deadline: "2024-03-10",
        totalStudents: 5,
        notSubmitted: 1,
        graded: 4,
        totalSubmitted: 4
    },
    {
        id: 4,
        title: "Khảo sát về chất lượng giảng dạy",
        deadline: "2024-03-25",
        totalStudents: 5,
        notSubmitted: 2,
        graded: 0,
        totalSubmitted: 3
    }
]

const RASubmissions: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    const filteredSubmissions = submissions.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="w-full h-fit flex flex-col gap-10 pt-topPadding">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-largeSize font-bold dark:text-white">Quản lý bài nộp</h1>
            </div>

            {/* Search Bar */}
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center-safe pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray dark:text-white/40">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Tìm kiếm form..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-lightDark shadow-[0_0_10px_rgba(0,0,0,0.05)] rounded-normal dark:text-white border border-transparent focus:border-mainColor/30 transition-all outline-none"
                />
            </div>

            {/* Submission Grid */}
            <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                {filteredSubmissions.map((submission) => (
                    <div
                        key={submission.id}
                        onClick={() => { navigate("123") }}
                        className="flex flex-col gap-4 p-6 bg-white dark:bg-lightDark shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal hover:translate-y-[-4px] transition-all cursor-pointer group"
                    >
                        {/* Card Header */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-normalSize font-bold dark:text-white group-hover:text-mainColor transition-colors">
                                {submission.title}
                            </h3>
                        </div>

                        {/* Card Info */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center-safe gap-2 text-smallSize text-gray dark:text-white/60">
                                <span className="font-medium">Hạn nộp:</span>
                                <span>{submission.deadline}</span>
                            </div>
                            <div className="flex items-center-safe gap-2 text-smallSize text-gray dark:text-white/60">
                                <span className="font-medium">Tổng sinh viên:</span>
                                <span className="font-bold">{submission.totalStudents}</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] w-full bg-gray/10 dark:bg-white/5 my-1" />

                        {/* Stats Section */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <p className="text-tinySize text-gray dark:text-white/40 uppercase font-bold">Chưa nộp</p>
                                <p className="text-bigSize font-bold text-red dark:text-red-400">{submission.notSubmitted}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-tinySize text-gray dark:text-white/40 uppercase font-bold">Đã chấm</p>
                                <p className="text-bigSize font-bold text-mainColor">{submission.graded}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-tinySize text-gray dark:text-white/40 uppercase font-bold">Tổng nộp</p>
                                <p className="text-bigSize font-bold text-indigo-500 dark:text-indigo-400">{submission.totalSubmitted}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Empty State */}
            {filteredSubmissions.length === 0 && (
                <div className="w-full py-20 flex flex-col items-center-safe justify-center text-gray dark:text-white/40 italic">
                    <p>Không tìm thấy bài nộp nào phù hợp.</p>
                </div>
            )}
        </div>
    )
}

export default RASubmissions
