import type React from "react"
import { useState } from "react"

interface StudentGrade {
    id: string
    studentName: string
    studentId: string
    topic: string
    score: number | null
    status: "Chờ chấm" | "Đã chấm" | "Đã khóa"
}

const LTScoreboards: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"instructor" | "committee">("instructor")

    // Mock data for supervision
    const [guidedStudents] = useState<StudentGrade[]>([
        { id: "G1", studentName: "Lê Minh Triết", studentId: "20110001", topic: "Xây dựng hệ thống quản lý đồ án tốt nghiệp", score: 8.5, status: "Đã chấm" },
        { id: "G2", studentName: "Nguyễn Thị Mai", studentId: "20110002", topic: "Ứng dụng AI trong chẩn đoán hình ảnh y tế", score: null, status: "Chờ chấm" }
    ])

    // Mock data for committee
    const [committeeStudents] = useState<StudentGrade[]>([
        { id: "C1", studentName: "Trần Hoàng Nam", studentId: "20110003", topic: "Phát triển ứng dụng Blockchain cho logistics", score: null, status: "Chờ chấm" },
        { id: "C2", studentName: "Phạm Đức Anh", studentId: "20110004", topic: "Hệ thống quản lý chuỗi cung ứng thông minh", score: 8.5, status: "Đã chấm" }
    ])

    const totalToGrade = guidedStudents.filter(s => s.status === "Chờ chấm").length + committeeStudents.filter(s => s.status === "Chờ chấm").length
    const currentList = activeTab === "instructor" ? guidedStudents : committeeStudents

    return (
        <div className="w-full h-fit flex flex-col gap-8 py-mainTwoSidePadding">
            {/* Header & Overview Cards */}
            <div className="flex justify-between items-start gap-5 max-md:flex-col">
                <div className="flex flex-col gap-1">
                    <h1 className="text-hugeSize font-bold dark:text-white leading-tight">Quản lý chấm điểm</h1>
                    <p className="text-normalSize text-gray dark:text-gray font-medium">Nhập điểm thành phần hướng dẫn và điểm hội đồng bảo vệ</p>
                </div>

                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-white dark:bg-lightDark rounded-normal border border-lightGray dark:border-gray/20 shadow-sm flex flex-col items-center min-w-[100px]">
                        <p className="text-[9px] font-black uppercase text-gray dark:text-gray opacity-60">Cần chấm</p>
                        <p className="text-mediumSize font-black text-orange-500">{totalToGrade}</p>
                    </div>
                    <div className="px-4 py-2 bg-mainColor text-white rounded-normal shadow-md shadow-mainColor/20 flex flex-col items-center min-w-[100px]">
                        <p className="text-[9px] font-black uppercase text-white">Tổng SV</p>
                        <p className="text-mediumSize font-black text-white">{guidedStudents.length + committeeStudents.length}</p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 p-1 bg-lightGray/30 dark:bg-lightDark w-fit rounded-normal border border-lightGray dark:border-gray/20">
                <button
                    onClick={() => setActiveTab("instructor")}
                    className={`px-6 py-2 rounded-normal text-smallSize font-bold transition-all ${
                        activeTab === "instructor" 
                        ? "bg-white text-mainColor shadow-sm dark:bg-mainColor dark:text-white" 
                        : "text-gray hover:text-mainColor dark:text-gray dark:hover:text-white"
                    }`}
                >
                    Chấm điểm hướng dẫn
                </button>
                <button
                    onClick={() => setActiveTab("committee")}
                    className={`px-6 py-2 rounded-normal text-smallSize font-bold transition-all ${
                        activeTab === "committee" 
                        ? "bg-white text-mainColor shadow-sm dark:bg-mainColor dark:text-white" 
                        : "text-gray hover:text-mainColor dark:text-gray dark:hover:text-white"
                    }`}
                >
                    Chấm điểm hội đồng
                </button>
            </div>

            {/* Toolbar: Global Actions */}
            <div className="flex justify-between items-center gap-5 max-md:flex-col max-md:items-stretch bg-white dark:bg-lightDark p-4 rounded-normal border border-lightGray dark:border-gray/20 shadow-sm">
                <span className="relative flex items-center-safe flex-1 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.15)] dark:bg-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray dark:text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input type="text" placeholder="Tìm kiếm sinh viên..." className="h-12 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white text-smallSize bg-transparent border-none outline-none" />
                    <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-[2px] transition-all duration-300"></span>
                </span>
                
                <button className="h-12 px-8 bg-mainColor text-white rounded-small text-smallSize font-bold hover:bg-mainColor/90 transition-all shadow-sm">
                    Lưu tất cả thay đổi
                </button>
            </div>

            {/* Table Area */}
            <div className="w-full overflow-hidden border border-lightGray dark:border-gray/30 rounded-big bg-white dark:bg-lightDark shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-lightGray/10 dark:bg-black/20 border-b border-lightGray dark:border-gray/30">
                            <th className="px-6 py-4 text-tinySize font-black uppercase tracking-widest text-gray dark:text-gray">Sinh viên</th>
                            <th className="px-6 py-4 text-tinySize font-black uppercase tracking-widest text-gray dark:text-gray">Đề tài</th>
                            <th className="px-6 py-4 text-tinySize font-black uppercase tracking-widest text-gray dark:text-gray w-40 text-center">Điểm số</th>
                            <th className="px-6 py-4 text-tinySize font-black uppercase tracking-widest text-gray dark:text-gray w-32 text-center">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-lightGray dark:divide-gray/10">
                        {currentList.map((student) => (
                            <tr key={student.id} className="hover:bg-mainColorRGB/5 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="font-bold dark:text-white text-normalSize group-hover:text-mainColor transition-colors">{student.studentName}</p>
                                        <p className="text-tinySize text-gray dark:text-gray font-medium uppercase">{student.studentId}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-smallSize font-medium text-gray dark:text-gray line-clamp-1 max-w-xs">{student.topic}</p>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-center">
                                        <input 
                                            type="number" step="0.1" min="0" max="10" placeholder="-"
                                            defaultValue={student.score || ""}
                                            className="w-20 h-10 text-center bg-bgLight dark:bg-black border border-lightGray dark:border-gray rounded-normal focus:border-mainColor outline-none font-bold text-mainColor"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        student.status === "Đã chấm" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                                    }`}>
                                        {student.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {currentList.length === 0 && (
                    <div className="w-full py-20 flex flex-col items-center justify-center gap-3 text-gray">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-16 opacity-20"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                        <p className="text-normalSize font-medium">Không có dữ liệu sinh viên</p>
                    </div>
                )}
            </div>

            {/* Note section */}
            <div className="p-6 bg-mainColor/5 rounded-big border border-mainColor/10">
                <div className="flex items-center gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-mainColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <h4 className="text-normalSize font-bold text-mainColor">Lưu ý nhập điểm</h4>
                </div>
                <ul className="flex flex-col gap-2 text-smallSize text-gray dark:text-gray list-disc pl-5">
                    <li>Hệ thống chấp nhận điểm số từ 0 đến 10, tối đa 1 chữ số thập phân.</li>
                    <li>Sau khi nhập điểm, vui lòng nhấn "Lưu tất cả thay đổi" để hệ thống cập nhật.</li>
                </ul>
            </div>
        </div>
    )
}

export default LTScoreboards
