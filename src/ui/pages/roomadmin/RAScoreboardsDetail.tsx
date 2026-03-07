import type React from "react"
import { useNavigate } from "react-router-dom"

const RAScoreboardsDetail: React.FC = () => {
    const navigate = useNavigate()
    // Mock data for the table
    const students = [
        { id: "SV001", name: "Nguyễn Văn A", score: "8.5", status: "Đã nhập" },
        { id: "SV002", name: "Trần Thị B", score: "9", status: "Đã nhập" },
        { id: "SV003", name: "Lê Văn C", score: "7.5", status: "Đã nhập" },
        { id: "SV004", name: "Phạm Thị D", score: "-", status: "Chưa nhập" },
        { id: "SV005", name: "Hoàng Văn E", score: "8", status: "Đã nhập" },
        { id: "SV006", name: "Đỗ Thị F", score: "-", status: "Chưa nhập" },
        { id: "SV007", name: "Võ Văn G", score: "9.5", status: "Đã nhập" },
    ]

    return (
        <div className="w-full h-fit flex flex-col gap-8 pt-topPadding">
            {/* Header Section */}
            <div className="flex justify-between items-start-safe">
                <div className="flex items-center-safe gap-4">
                    <button className="p-2.5 hover:bg-lightGray dark:hover:bg-gray rounded-full transition-colors cursor-pointer" onClick={() => { navigate(-1) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    
                    <div className="flex flex-col">
                        <h1 className="text-largeSize font-bold dark:text-white leading-tight">Điểm của giảng viên hướng dẫn</h1>
                        <p className="text-smallSize text-gray font-medium dark:text-gray-400">Điểm do giảng viên hướng dẫn chấm cho sinh viên</p>
                    </div>
                </div>

                <div className="flex items-center-safe gap-3">
                    <button className="flex items-center-safe gap-2 px-4 py-2 border border-gray/20 rounded-normal font-bold text-smallSize hover:bg-lightGray dark:text-white dark:hover:bg-gray transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        Đang sửa
                    </button>
                    <button className="flex items-center-safe gap-2 px-4 py-2 border border-gray/20 rounded-normal font-bold text-smallSize hover:bg-lightGray dark:text-white dark:hover:bg-gray transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Xuất
                    </button>
                    <button className="p-2 hover:bg-lightGray dark:hover:bg-gray rounded-full transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Progress and Stats Section */}
            <div className="flex justify-between items-end-safe">
                <div className="flex flex-col gap-2 w-1/4">
                    <p className="text-smallSize font-bold text-gray dark:text-gray-400 uppercase tracking-wider">Tiến độ</p>
                    <div className="flex items-center-safe gap-3">
                        <div className="flex-1 h-2 bg-gray/10 rounded-full overflow-hidden">
                            <div className="h-full bg-mainColor w-[71%] rounded-full shadow-[0_0_8px_rgba(73,156,64,0.4)]"></div>
                        </div>
                        <span className="text-normalSize font-bold dark:text-white">71%</span>
                    </div>
                </div>

                <div className="flex gap-10">
                    <div className="flex flex-col items-center-safe gap-1">
                        <p className="text-smallSize font-medium text-gray dark:text-gray-400 uppercase tracking-wider">Sinh viên</p>
                        <p className="text-normalSize font-bold dark:text-white">5/7</p>
                    </div>
                    <div className="flex flex-col items-center-safe gap-1">
                        <p className="text-smallSize font-medium text-gray dark:text-gray-400 uppercase tracking-wider">Thang điểm</p>
                        <p className="text-normalSize font-bold dark:text-white">10</p>
                    </div>
                    <div className="flex flex-col items-center-safe gap-1">
                        <p className="text-smallSize font-medium text-gray dark:text-gray-400 uppercase tracking-wider">Hạn chót</p>
                        <p className="text-normalSize font-bold dark:text-white">15 tháng 3, 2025</p>
                    </div>
                </div>
            </div>

            {/* Search and Action Buttons */}
            <div className="flex justify-between items-center-safe mt-2">
                <div className="relative w-1/2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Tìm sinh viên theo tên hoặc mã số..." 
                        className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-lightDark border border-gray/10 rounded-normal text-smallSize outline-none focus:border-mainColor/50 transition-all dark:text-white shadow-sm"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center-safe gap-2 px-5 py-2.5 border border-gray/10 rounded-normal font-bold text-smallSize hover:bg-lightGray dark:text-white dark:hover:bg-gray transition-colors shadow-sm bg-white dark:bg-lightDark">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        Mẫu nhập
                    </button>
                    <button className="flex items-center-safe gap-2 px-5 py-2.5 border border-gray/10 rounded-normal font-bold text-smallSize hover:bg-lightGray dark:text-white dark:hover:bg-gray transition-colors shadow-sm bg-white dark:bg-lightDark">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0-10.628a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5m0 10.628a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5" />
                        </svg>
                        Chia sẻ
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full border border-gray/10 rounded-normal overflow-hidden shadow-sm bg-white dark:bg-lightDark mb-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray/10 bg-lightGray/30 dark:bg-gray/10">
                            <th className="px-6 py-5 text-gray dark:text-gray-400 font-bold text-smallSize uppercase tracking-wider">Mã SV</th>
                            <th className="px-6 py-5 text-gray dark:text-gray-400 font-bold text-smallSize uppercase tracking-wider">Tên sinh viên</th>
                            <th className="px-6 py-5 text-gray dark:text-gray-400 font-bold text-smallSize uppercase tracking-wider">Điểm</th>
                            <th className="px-6 py-5 text-gray dark:text-gray-400 font-bold text-smallSize uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-5"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id} className={`border-b border-gray/5 hover:bg-lightGray/10 dark:hover:bg-gray/5 transition-colors ${index === students.length - 1 ? "border-b-0" : ""}`}>
                                <td className="px-6 py-3.5 text-gray dark:text-gray-400 font-medium text-smallSize">{student.id}</td>
                                <td className="px-6 py-3.5 font-bold dark:text-white text-smallSize">{student.name}</td>
                                <td className="px-6 py-3.5 font-bold text-mainColor text-smallSize">{student.score}</td>
                                <td className="px-6 py-3.5">
                                    <span className={`px-4 py-1 rounded-full font-bold text-smallSize ${
                                        student.status === "Đã nhập" 
                                        ? "bg-mainColorRGB text-mainColor" 
                                        : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500"
                                    }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                    <button className="p-2 hover:bg-lightGray dark:hover:bg-gray rounded-full transition-colors cursor-pointer text-gray dark:text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RAScoreboardsDetail
