import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

type SubmissionDetail = {
    id: string
    name: string
    type: "Upload file" | "Trả lời form" | "Chưa nộp"
    time: string
    status: "Đã chấm" | "Đã nộp" | "Chưa nộp"
    score: string
    file?: string
    comment?: string
}

const students: SubmissionDetail[] = [
    {
        id: "001",
        name: "Nguyễn Văn A",
        type: "Upload file",
        time: "2024-03-14 10:30",
        status: "Đã chấm",
        score: "9/10",
        file: "assignment.pdf",
        comment: "Bài làm rất tốt, trình bày sạch sẽ."
    },
    {
        id: "002",
        name: "Trần Thị B",
        type: "Trả lời form",
        time: "2024-03-15 14:20",
        status: "Đã nộp",
        score: "-",
    },
    {
        id: "003",
        name: "Lê Văn C",
        type: "Chưa nộp",
        time: "-",
        status: "Chưa nộp",
        score: "-",
    },
    {
        id: "004",
        name: "Phạm Thị D",
        type: "Upload file",
        time: "2024-03-13 09:15",
        status: "Đã chấm",
        score: "8.5/10",
        file: "project_v1.zip"
    },
    {
        id: "005",
        name: "Hoàng Văn E",
        type: "Trả lời form",
        time: "2024-03-14 16:45",
        status: "Đã nộp",
        score: "-",
    }
]

const RASubmissionDetail: React.FC = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<SubmissionDetail | null>(null)

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.includes(searchTerm)
    )

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Đã chấm":
                return "bg-mainColorRGB text-mainColor"
            case "Đã nộp":
                return "bg-indigo-500/10 text-indigo-500"
            case "Chưa nộp":
                return "bg-redRGB text-red"
            default:
                return "bg-gray/10 text-gray"
        }
    }

    return (
        <div className="w-full h-fit flex flex-col gap-8 pt-topPadding">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <button
                    className="flex items-center-safe gap-2 text-smallSize font-bold text-gray hover:text-mainColor transition-colors cursor-pointer w-fit"
                    onClick={() => navigate(-1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Quay lại
                </button>

                <div className="flex flex-col gap-1">
                    <h1 className="text-largeSize font-bold dark:text-white">Bài 1: Giới thiệu React</h1>
                    <p className="text-smallSize text-gray dark:text-gray-400">Bài tập về các khái niệm cơ bản của React</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2">
                {[
                    { label: "Hạn nộp", value: "2024-03-15", color: "text-gray" },
                    { label: "Tổng sinh viên", value: "25", color: "text-gray" },
                    { label: "Đã nộp", value: "22", color: "text-indigo-500" },
                    { label: "Chưa nộp", value: "3", color: "text-red" }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-gray/5">
                        <p className="text-tinySize text-gray dark:text-gray-400 font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className={`text-bigSize font-bold ${stat.color} dark:text-white`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Area */}
            <div className="flex gap-6 items-start-safe mb-10">
                {/* Table Section */}
                <div className="w-full flex flex-col gap-6">
                    {/* Search */}
                    <div className="relative w-full max-w-md">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm sinh viên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-lightDark border border-gray/10 rounded-normal text-smallSize outline-none focus:border-mainColor/50 transition-all dark:text-white shadow-sm"
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-lightDark rounded-normal border border-gray/10 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-lightGray/20 dark:bg-white/5 border-b border-gray/10">
                                    <th className="px-6 py-4 text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Sinh viên</th>
                                    <th className="px-6 py-4 text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Loại nộp</th>
                                    <th className="px-6 py-4 text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Thời gian</th>
                                    <th className="px-6 py-4 text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-4 text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-wider text-center">Điểm</th>
                                    <th className="px-6 py-4 text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className={`border-b border-gray/5 hover:bg-lightGray/10 dark:hover:bg-white/5 cursor-pointer transition-colors ${selectedStudent?.id === student.id ? 'bg-mainColor/5 dark:bg-mainColor/10' : ''}`}
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center-safe gap-3">
                                                <div className="size-8 rounded-full bg-mainColor/10 flex items-center justify-center text-mainColor font-bold text-tinySize">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="text-smallSize font-bold dark:text-white">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-smallSize text-gray dark:text-gray-400">{student.type}</td>
                                        <td className="px-6 py-4 text-smallSize text-gray dark:text-gray-400">{student.time}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-tinySize font-bold ${getStatusStyle(student.status)}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-mainColor text-smallSize">{student.score}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center-safe gap-2">
                                                <button className="p-1.5 hover:bg-gray/10 rounded-md transition-colors text-gray dark:text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.76 10.373 7.72 6 12 6c4.28 0 8.24 4.373 9.964 6.322a1.012 1.012 0 0 1 0 .644C20.24 13.627 16.28 18 12 18c-4.28 0-8.24-4.373-9.964-6.322Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                </button>
                                                {student.file && (
                                                    <button className="p-1.5 hover:bg-gray/10 rounded-md transition-colors text-gray dark:text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail Panel Section - Improved as Fixed Drawer */}
                {selectedStudent && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] z-100 transition-opacity animate-in fade-in duration-300"
                            onClick={() => setSelectedStudent(null)}
                        />
                        
                        {/* Drawer Container */}
                        <div className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-white dark:bg-lightDark z-101 shadow-[-10px_0_50px_rgba(0,0,0,0.15)] flex flex-col animate-in slide-in-from-right duration-300">
                            {/* Drawer Header - Fixed */}
                            <div className="p-6 border-b border-gray/5 flex justify-between items-center-safe bg-white dark:bg-lightDark">
                                <button
                                    className="p-2 hover:bg-red/10 text-gray hover:text-red rounded-full transition-all cursor-pointer"
                                    onClick={() => setSelectedStudent(null)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                
                                <div className="flex gap-2">
                                    <button className="flex items-center-safe gap-1 px-3 py-1.5 hover:bg-gray/5 rounded-normal text-tinySize font-bold text-gray transition-colors cursor-pointer border border-gray/10">
                                        Trước
                                    </button>
                                    <button className="flex items-center-safe gap-1 px-3 py-1.5 hover:bg-gray/5 rounded-normal text-tinySize font-bold text-gray transition-colors cursor-pointer border border-gray/10">
                                        Tiếp theo
                                    </button>
                                </div>
                            </div>

                            {/* Drawer Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                                {/* User Info */}
                                <div className="flex items-center-safe gap-4">
                                    <div className="size-16 rounded-full bg-mainColor/10 flex items-center justify-center text-mainColor font-bold text-largeSize">
                                        {selectedStudent.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-bigSize font-bold dark:text-white leading-tight">{selectedStudent.name}</h3>
                                        <p className="text-normalSize text-gray dark:text-gray-400 font-medium">{selectedStudent.id}</p>
                                    </div>
                                </div>

                                {/* Details Card */}
                                <div className="flex flex-col gap-4 p-5 bg-gray/5 dark:bg-white/5 rounded-normal">
                                    <p className="text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-widest">Thông tin nộp bài</p>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-center-safe">
                                            <span className="text-smallSize text-gray dark:text-gray-400">Loại nộp</span>
                                            <span className="text-smallSize font-bold dark:text-white">{selectedStudent.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center-safe">
                                            <span className="text-smallSize text-gray dark:text-gray-400">Trạng thái</span>
                                            <span className={`px-3 py-0.5 rounded-full text-tinySize font-bold ${getStatusStyle(selectedStudent.status)}`}>
                                                {selectedStudent.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center-safe">
                                            <span className="text-smallSize text-gray dark:text-gray-400">Thời gian</span>
                                            <span className="text-smallSize font-bold dark:text-white">{selectedStudent.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* File Section */}
                                {selectedStudent.file && (
                                    <div className="flex flex-col gap-3">
                                        <p className="text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-widest">Tệp đính kèm</p>
                                        <button className="flex items-center-safe gap-3 p-4 border border-gray/10 rounded-normal bg-white dark:bg-lightDark hover:border-mainColor/50 transition-all group cursor-pointer shadow-sm">
                                            <div className="p-2 bg-mainColor/10 rounded-lg group-hover:bg-mainColor/20 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-mainColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                </svg>
                                            </div>
                                            <span className="text-smallSize font-bold dark:text-white truncate flex-1 text-left">{selectedStudent.file}</span>
                                        </button>
                                    </div>
                                )}

                                {/* Grading Section */}
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-widest">Điểm số</label>
                                        <div className="flex items-center-safe gap-4">
                                            <input
                                                type="number"
                                                defaultValue={selectedStudent.score !== "-" ? selectedStudent.score.split('/')[0] : ""}
                                                className="w-24 px-4 py-3 bg-white dark:bg-lightDark border border-gray/10 rounded-normal text-bigSize font-bold text-center outline-none focus:border-mainColor focus:ring-4 focus:ring-mainColor/10 dark:text-white shadow-sm"
                                                max={10}
                                                min={0}
                                            />
                                            <span className="text-bigSize font-bold text-gray">/ 10</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-tinySize font-bold text-gray dark:text-gray-400 uppercase tracking-widest">Nhận xét của giảng viên</label>
                                        <textarea
                                            placeholder="Viết nhận xét chi tiết cho sinh viên tại đây..."
                                            defaultValue={selectedStudent.comment}
                                            className="w-full h-40 p-4 bg-white dark:bg-lightDark border border-gray/10 rounded-normal text-smallSize outline-none focus:border-mainColor focus:ring-4 focus:ring-mainColor/10 dark:text-white resize-none shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer - Fixed */}
                            <div className="p-6 border-t border-gray/5 bg-white dark:bg-lightDark">
                                <button className="w-full py-4 bg-mainColor text-white font-bold text-normalSize rounded-normal hoverBtn shadow-[0_4px_20px_rgba(73,156,64,0.4)] flex items-center justify-center gap-2">
                                    Lưu kết quả chấm điểm
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default RASubmissionDetail
