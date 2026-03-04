import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

type ScoreboardStatus = "all" | "editing" | "locked"

type ScoreboardItem = {
    id: string
    title: string
    description: string
    progress: number
    studentsGraded: number
    totalStudents: number
    status: "editing" | "locked"
    lastUpdated: string
    daysRemaining?: number
    dueDate: string
}

const RAScoreboards: React.FC = () => {
    const [filter, setFilter] = useState<ScoreboardStatus>("all")
    const navigate = useNavigate()

    const stats = [
        { label: "Tổng bảng điểm", count: 6, color: "text-mainColor", bg: "bg-mainColor/10" },
        { label: "Đang sửa", count: 5, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Đã khóa", count: 1, color: "text-red-500", bg: "bg-red-50" },
    ]

    const scoreboards: ScoreboardItem[] = [
        {
            id: "1",
            title: "Giữa kỳ - Đại cương",
            description: "Bài kiểm tra giữa học kỳ 1 năm 2025",
            progress: 100,
            studentsGraded: 45,
            totalStudents: 45,
            status: "locked",
            lastUpdated: "5 giờ trước",
            daysRemaining: 0,
            dueDate: "15 tháng 3"
        },
        {
            id: "2",
            title: "Bài tập 1 - Cơ bản",
            description: "Bài tập thực hành tuần 3-4",
            progress: 84,
            studentsGraded: 38,
            totalStudents: 45,
            status: "editing",
            lastUpdated: "1 giờ trước",
            daysRemaining: 5,
            dueDate: "20 tháng 3"
        },
        {
            id: "3",
            title: "Bài tập 2 - Nâng cao",
            description: "Bài tập thực hành tuần 5-6",
            progress: 62,
            studentsGraded: 28,
            totalStudents: 45,
            status: "editing",
            lastUpdated: "30 phút trước",
            daysRemaining: 10,
            dueDate: "25 tháng 3"
        },
        {
            id: "4",
            title: "Chuyên cần - Tháng 3",
            description: "Điểm chuyên cần và tham gia lớp",
            progress: 56,
            studentsGraded: 25,
            totalStudents: 45,
            status: "editing",
            lastUpdated: "2 giờ trước",
            daysRemaining: 15,
            dueDate: "31 tháng 3"
        },
        {
            id: "5",
            title: "Cuối kỳ - Tổng hợp",
            description: "Bài thi cuối học kỳ toàn diện",
            progress: 0,
            studentsGraded: 0,
            totalStudents: 45,
            status: "editing",
            lastUpdated: "Chưa cập nhật",
            daysRemaining: 89,
            dueDate: "1 tháng 6"
        },
        {
            id: "6",
            title: "Dự án nhóm - Kỳ này",
            description: "Đánh giá dự án cuối kỳ của các nhóm",
            progress: 13,
            studentsGraded: 6,
            totalStudents: 45,
            status: "editing",
            lastUpdated: "Chưa cập nhật",
            daysRemaining: 58,
            dueDate: "1 tháng 5"
        }
    ]

    const filteredScoreboards = scoreboards.filter(item =>
        filter === "all" ? true : item.status === filter
    )

    return (
        <div className="w-full h-fit flex flex-col gap-8 pt-topPadding pb-BottomPadding">
            {/* Header */}
            <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-4">
                <div className="flex flex-col">
                    <h1 className="text-largeSize font-bold dark:text-white leading-tight">Quản lý bảng điểm</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-mainColor text-white px-5 py-2.5 rounded-normal font-bold flex items-center gap-2 hoverBtn shadow-md transition-all text-smallSize">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tạo mới
                    </button>
                    <button className="p-2.5 border border-gray/20 rounded-normal hover:bg-lightGray dark:hover:bg-white/5 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774a1.125 1.125 0 0 1 .12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.894.15c.542.09.94.56.94 1.109v1.094c0 .55-.398 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738a1.125 1.125 0 0 1-.12 1.45l-.772.773a1.125 1.125 0 0 1-1.45.12l-.737-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 0 1-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="flex gap-8 text-smallSize font-bold">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex gap-2">
                        <span className="text-gray font-medium dark:text-gray-400">{stat.label}:</span>
                        <span className={stat.color}>{stat.count}</span>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4 items-center max-md:flex-col max-md:items-stretch">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm bảng điểm..."
                        className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-lightDark shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-transparent focus:border-mainColor/30 rounded-normal dark:text-white transition-all outline-none"
                    />
                </div>

                <div className="flex bg-white dark:bg-lightDark p-1 rounded-normal shadow-[0_0_10px_rgba(0,0,0,0.05)]">
                    {[
                        { id: "all", label: "Tất cả" },
                        { id: "editing", label: "Đang sửa" },
                        { id: "locked", label: "Đã khóa" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as ScoreboardStatus)}
                            className={`px-6 py-1.5 rounded-normal text-smallSize font-bold transition-all ${filter === tab.id
                                ? "bg-lightGray dark:bg-gray text-black dark:text-white shadow-sm"
                                : "text-gray hover:text-black dark:hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scoreboard Grid */}
            <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
                {filteredScoreboards.map((item) => (
                    <div key={item.id} onClick={() => { navigate(`${item.id}`) }} className="flex flex-col gap-5 p-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-big bg-white dark:bg-lightDark border border-transparent hover:cursor-pointer hover:border-mainColor/20 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-mainColor/5 transition-all duration-300 group relative overflow-hidden">
                        {/* Hover Accent Decor */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-mainColor scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-normalSize font-bold dark:text-white group-hover:text-mainColor transition-colors">{item.title}</h3>
                            <p className="text-smallSize text-gray font-light line-clamp-1">{item.description}</p>
                        </div>

                        {/* Progress */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-tinySize font-bold">
                                <span className="text-gray dark:text-gray-400 uppercase tracking-wider">Tiến độ nhập điểm</span>
                                <span className="text-black dark:text-white">{item.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray/10 rounded-full overflow-hidden dark:bg-white/10">
                                <div
                                    className={`h-full transition-all duration-700 ${item.progress === 100 ? 'bg-mainColor' : 'bg-blue-500'}`}
                                    style={{ width: `${item.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex justify-between items-end pt-2 border-t border-gray/5 mt-1">
                            <div className="flex flex-col gap-1">
                                <p className="text-tinySize text-gray font-medium uppercase tracking-wider">Sinh viên</p>
                                <p className="text-normalSize font-bold dark:text-white">
                                    <span className="text-mainColor">{item.studentsGraded}</span>
                                    <span className="text-gray/40">/{item.totalStudents}</span>
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <p className="text-tinySize text-gray font-medium uppercase tracking-wider">Trạng thái</p>
                                <span className={`flex items-center gap-1.5 text-tinySize font-bold px-2.5 py-1 rounded-full ${item.status === 'locked'
                                    ? 'bg-red-50 text-red-500'
                                    : 'bg-blue-50 text-blue-500'
                                    }`}>
                                    {item.status === 'locked' ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                            </svg>
                                            Đã khóa
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                            Đang sửa
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray/5">
                            <div className="flex flex-col">
                                <p className="text-[11px] text-gray font-medium">Cập nhật: {item.lastUpdated}</p>
                                <p className="text-[11px] text-gray font-medium">Hạn: {item.dueDate}</p>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${item.daysRemaining === 0 ? 'bg-red-50 [&_p]:text-red-500' :
                                item.daysRemaining && item.daysRemaining <= 5 ? 'bg-orange-50 text-orange-500' :
                                    'dark:bg-gray bg-lightGray text-dark'
                                }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`size-3.5 ${item.daysRemaining === 0 && 'stroke-red'}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                </svg>
                                <p className="text-smallSize font-bold">
                                    {item.daysRemaining === 0 ? "Hết hạn" : `${item.daysRemaining} ngày`}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RAScoreboards
