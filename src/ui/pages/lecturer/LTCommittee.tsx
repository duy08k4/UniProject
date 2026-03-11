import type React from "react"
import { useState } from "react"

interface CommitteeMember {
    id: string
    name: string
    role: "Chủ tịch" | "Thư ký" | "Ủy viên phản biện" | "Ủy viên"
    email: string
    department: string
    avatar?: string
}

interface StudentProgress {
    id: string
    studentName: string
    studentId: string
    topic: string
    instructor: string
    currentMilestone: string
    status: "Hoàn thành" | "Đang thực hiện" | "Trễ hạn"
    percentage: number
}

const LTCommittee: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"members" | "progress">("members")

    // Mock data
    const [members] = useState<CommitteeMember[]>([
        { id: "1", name: "TS. Nguyễn Văn A", role: "Chủ tịch", email: "nva@university.edu.vn", department: "Công nghệ phần mềm" },
        { id: "2", name: "ThS. Trần Thị B", role: "Thư ký", email: "ttb@university.edu.vn", department: "Hệ thống thông tin" },
        { id: "3", name: "TS. Lê Văn C", role: "Ủy viên phản biện", email: "lvc@university.edu.vn", department: "Khoa học máy tính" },
        { id: "4", name: "ThS. Phạm Văn D", role: "Ủy viên", email: "pvd@university.edu.vn", department: "Mạng máy tính" },
    ])

    const [studentProgress] = useState<StudentProgress[]>([
        {
            id: "S1",
            studentName: "Lê Minh Triết",
            studentId: "20110001",
            topic: "Xây dựng hệ thống quản lý đồ án tốt nghiệp",
            instructor: "TS. Nguyễn Văn A",
            currentMilestone: "Nộp báo cáo giữa kỳ",
            status: "Hoàn thành",
            percentage: 60
        },
        {
            id: "S2",
            studentName: "Nguyễn Thị Mai",
            studentId: "20110002",
            topic: "Ứng dụng AI trong chẩn đoán hình ảnh y tế",
            instructor: "TS. Lê Văn C",
            currentMilestone: "Hoàn thiện thuật toán",
            status: "Đang thực hiện",
            percentage: 45
        },
        {
            id: "S3",
            studentName: "Trần Hoàng Nam",
            studentId: "20110003",
            topic: "Phát triển ứng dụng Blockchain cho logistics",
            instructor: "ThS. Trần Thị B",
            currentMilestone: "Nộp đề cương chi tiết",
            status: "Trễ hạn",
            percentage: 15
        }
    ])

    return (
        <div className="w-full h-fit flex flex-col gap-8 py-mainTwoSidePadding">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-hugeSize font-bold dark:text-white leading-tight">Hội đồng khóa luận</h1>
                <p className="text-normalSize text-gray dark:text-gray font-medium">Quản lý thành viên hội đồng và theo dõi tiến độ sinh viên bảo vệ</p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 p-1 bg-lightGray/30 dark:bg-lightDark w-fit rounded-normal border border-lightGray dark:border-gray/20">
                <button
                    onClick={() => setActiveTab("members")}
                    className={`px-6 py-2 rounded-normal text-smallSize font-bold transition-all ${
                        activeTab === "members" 
                        ? "bg-white text-mainColor shadow-sm dark:bg-mainColor dark:text-white" 
                        : "text-gray hover:text-mainColor dark:text-gray dark:hover:text-white"
                    }`}
                >
                    Thành viên hội đồng
                </button>
                <button
                    onClick={() => setActiveTab("progress")}
                    className={`px-6 py-2 rounded-normal text-smallSize font-bold transition-all ${
                        activeTab === "progress" 
                        ? "bg-white text-mainColor shadow-sm dark:bg-mainColor dark:text-white" 
                        : "text-gray hover:text-mainColor dark:text-gray dark:hover:text-white"
                    }`}
                >
                    Tiến độ sinh viên
                </button>
            </div>

            {/* Content Area */}
            <div className="w-full">
                {activeTab === "members" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {members.map((member) => (
                            <div key={member.id} className="p-6 bg-white dark:bg-lightDark rounded-big border border-lightGray dark:border-gray hover:border-mainColor/30 transition-all shadow-sm flex flex-col items-center text-center gap-4">
                                <div className="size-20 rounded-full bg-mainColorRGB flex items-center justify-center text-mainColor text-hugeSize font-bold">
                                    {member.name.charAt(0)}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-normalSize font-bold dark:text-white">{member.name}</h3>
                                    <span className="px-3 py-1 bg-mainColor/10 text-mainColor text-tinySize font-bold rounded-full uppercase tracking-wider">
                                        {member.role}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1 text-smallSize font-light">
                                    <p className="text-gray dark:text-gray">{member.department}</p>
                                    <p className="text-gray dark:text-gray italic">{member.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Filter & Search Bar */}
                        <div className="flex justify-between items-center gap-5 max-md:flex-col max-md:items-stretch">
                            <span className="relative flex items-center-safe flex-1 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.15)] dark:bg-black transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray dark:text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <input type="text" placeholder="Tìm kiếm sinh viên, đề tài..." className="h-12 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white text-smallSize bg-transparent border-none outline-none" />
                                <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-[2px] transition-all duration-300"></span>
                            </span>
                            
                            <div className="flex items-center gap-3">
                                <span className="flex items-center-safe gap-1.5">
                                    <p className="font-bold dark:text-white text-smallSize text-nowrap">Trạng thái:</p>
                                    <select className="w-44 h-12 border-[0.5px] border-lightGray px-2.5 rounded-small dark:text-white dark:bg-black text-smallSize outline-none focus:border-mainColor">
                                        <option value="all">Tất cả</option>
                                        <option value="done">Hoàn thành</option>
                                        <option value="doing">Đang thực hiện</option>
                                        <option value="late">Trễ hạn</option>
                                    </select>
                                </span>
                                
                                <button className="flex items-center gap-2 h-12 px-6 bg-mainColor text-white rounded-small text-smallSize font-bold hover:bg-mainColor/90 transition-all shadow-sm shadow-mainColor/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    Xuất báo cáo
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {studentProgress.map((student) => (
                                <div key={student.id} className="group flex flex-col gap-4 p-5 bg-white dark:bg-lightDark border border-lightGray dark:border-gray rounded-big shadow-sm hover:shadow-md hover:border-mainColor/20 transition-all">
                                    {/* Header: Name & Status */}
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-normalSize font-bold dark:text-white group-hover:text-mainColor transition-colors">{student.studentName}</h3>
                                                <span className="text-tinySize font-bold text-gray dark:text-gray bg-lightGray/50 px-1.5 py-0.5 rounded-sm dark:bg-gray/20">{student.studentId}</span>
                                            </div>
                                            <p className="text-smallSize font-bold text-mainColor line-clamp-1">{student.topic}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${
                                            student.status === "Hoàn thành" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                                            student.status === "Trễ hạn" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                            "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                                        }`}>
                                            {student.status}
                                        </span>
                                    </div>
                                    
                                    {/* Info details */}
                                    <div className="grid grid-cols-2 gap-2 text-mobile-smallSize border-y border-lightGray/50 dark:border-gray/10 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold opacity-60 uppercase text-[9px] text-gray dark:text-gray">Giảng viên HD</span>
                                            <span className="font-medium text-gray dark:text-gray">{student.instructor}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold opacity-60 uppercase text-[9px] text-gray dark:text-gray">Mốc hiện tại</span>
                                            <span className="font-medium truncate text-gray dark:text-gray">{student.currentMilestone}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar & Action */}
                                    <div className="flex flex-col gap-3">
                                        <div className="w-full flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                                                <span className="text-gray/60 dark:text-gray/60">Tiến độ</span>
                                                <span className="text-mainColor">{student.percentage}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-lightGray dark:bg-gray/20 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-mainColor rounded-full transition-all duration-1000" 
                                                    style={{ width: `${student.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button className="text-tinySize font-bold text-mainColor hover:text-mainColor/80 flex items-center gap-1 group/btn">
                                                Chi tiết 
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3 transform group-hover/btn:translate-x-1 transition-transform">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LTCommittee
