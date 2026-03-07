import type React from "react"

type FormItem = {
    id: string
    title: string
    description: string
    status: "active" | "draft" | "closed"
    responses: number
    totalMembers: number
    createdAt: string
    deadline?: string
    isExpired?: boolean
}

const RAForms: React.FC = () => {
    const stats = [
        {
            label: "Tổng biểu mẫu", count: 6, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 text-mainColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            )
        },
        {
            label: "Đang hoạt động", count: 3, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            )
        },
        {
            label: "Bản nháp", count: 1, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 text-gray">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            )
        },
        {
            label: "Đã đóng", count: 2, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
            )
        },
    ]

    const forms: FormItem[] = [
        {
            id: "1",
            title: "Điều tra hài lòng học sinh",
            description: "Thu thập phản hồi từ học sinh về chất lượng giảng dạy",
            status: "active",
            responses: 28,
            totalMembers: 35,
            createdAt: "15/02/2024",
            deadline: "15/03/2024",
            isExpired: true
        },
        {
            id: "2",
            title: "Đăng ký dã ngoại lớp",
            description: "Xác nhận danh sách học sinh tham gia hoạt động ngoài trời",
            status: "active",
            responses: 32,
            totalMembers: 35,
            createdAt: "10/02/2024",
            deadline: "28/02/2024",
            isExpired: true
        },
        {
            id: "3",
            title: "Phiếu đánh giá dự án cuối kì",
            description: "Đánh giá kết quả hoàn thành dự án của các nhóm học sinh",
            status: "closed",
            responses: 35,
            totalMembers: 35,
            createdAt: "20/01/2024",
            deadline: "05/02/2024",
            isExpired: true
        },
        {
            id: "4",
            title: "Thăm dò nhu cầu buổi học thêm",
            description: "Tìm hiểu nhu cầu học thêm các môn học của học sinh",
            status: "draft",
            responses: 0,
            totalMembers: 35,
            createdAt: "20/02/2024"
        },
        {
            id: "5",
            title: "Phiếu đánh giá giáo viên",
            description: "Góp ý cải tiến về phương pháp giảng dạy",
            status: "active",
            responses: 12,
            totalMembers: 35,
            createdAt: "18/02/2024",
            deadline: "05/03/2024",
            isExpired: true
        },
        {
            id: "6",
            title: "Khảo sát lịch lớp hè",
            description: "Xác định thời gian phù hợp cho khóa học hè",
            status: "closed",
            responses: 33,
            totalMembers: 35,
            createdAt: "10/01/2024",
            deadline: "31/01/2024",
            isExpired: true
        }
    ]

    const getStatusStyles = (status: FormItem["status"]) => {
        switch (status) {
            case "active":
                return "bg-mainColorRGB text-mainColor"
            case "draft":
                return "bg-gray/10 text-gray"
            case "closed":
                return "bg-redRGB text-red"
            default:
                return "bg-gray/10 text-gray"
        }
    }

    const getStatusText = (status: FormItem["status"]) => {
        switch (status) {
            case "active": return "Đang hoạt động"
            case "draft": return "Bản nháp"
            case "closed": return "Đã đóng"
        }
    }

    return (
        <div className="w-full h-fit flex flex-col gap-8 pt-topPadding pb-BottomPadding">
            {/* Header */}
            <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-4">
                <div className="flex flex-col">
                    <h1 className="text-largeSize font-bold dark:text-white">Quản lý biểu mẫu</h1>
                </div>

                <button className="bg-mainColor text-white px-6 py-2.5 rounded-normal font-bold flex items-center gap-2 hoverBtn shadow-md transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tạo biểu mẫu mới
                </button>
            </div>

            {/* Search */}
            <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Tìm kiếm biểu mẫu..."
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-lightDark shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-transparent focus:border-mainColor/30 rounded-normal dark:text-white transition-all"
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-5 max-sm:grid-cols-2 max-[450px]:grid-cols-1">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-6 py-5 shadow-[0_0_10px_rgba(0,0,0,0.08)] rounded-normal bg-white dark:bg-lightDark">
                        <div className="p-3 bg-gray/5 rounded-normal dark:bg-white/5">
                            {stat.icon}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray text-[13px] font-medium dark:text-gray-400">{stat.label}</p>
                            <p className="text-bigSize font-bold dark:text-white leading-tight">{stat.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form List Grid */}
            <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
                {forms.map((form) => (
                    <div key={form.id} className="flex flex-col gap-5 p-6 shadow-[0_0_15px_rgba(0,0,0,0.08)] rounded-big bg-white dark:bg-lightDark border border-transparent hover:border-mainColor/20 transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-normalSize font-bold dark:text-white line-clamp-1">{form.title}</h3>
                                <p className="text-smallSize text-gray font-light line-clamp-2 h-10">{form.description}</p>
                            </div>
                            <button className="text-gray hover:text-mainColor transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className={`w-fit px-3 py-1 rounded-full text-tinySize font-bold uppercase tracking-wider ${getStatusStyles(form.status)}`}>
                                {getStatusText(form.status)}
                            </span>

                            <div className="flex flex-col gap-1.5 mt-1">
                                <div className="flex justify-between items-center text-smallSize font-medium">
                                    <span className="text-gray dark:text-gray-400">Phản hồi: {form.responses}/{form.totalMembers}</span>
                                    <span className="text-mainColor font-bold">{Math.round((form.responses / form.totalMembers) * 100)}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray/10 rounded-full overflow-hidden dark:bg-white/10">
                                    <div
                                        className="h-full bg-mainColor transition-all duration-500"
                                        style={{ width: `${(form.responses / form.totalMembers) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-gray/5">
                            <div className="flex items-center gap-2 text-smallSize text-gray dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 dark:stroke-gray">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                </svg>
                                <p className="dark:text-gray">Tạo: {form.createdAt}</p>
                            </div>
                            {form.deadline && (
                                <div className={`flex items-center gap-2 text-smallSize font-medium ${form.isExpired ? 'text-red' : 'text-gray dark:text-gray-400'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 dark:stroke-gray">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <p className="dark:text-gray">Hạn: {form.deadline} {form.isExpired && "(Quá hạn)"}</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
                            <button className="flex items-center justify-center gap-2 py-2.5 rounded-normal bg-mainColorRGB text-mainColor font-bold text-smallSize hover:brightness-95 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 stroke-mainColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                Xem
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 rounded-normal bg-gray/5 text-gray dark:text-white dark:bg-white/5 font-bold text-smallSize border border-gray/10 hover:bg-gray/10 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                                Phản hồi
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RAForms
