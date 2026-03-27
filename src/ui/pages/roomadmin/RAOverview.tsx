import type React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"

const RAOverview: React.FC = () => {
    const classInfo = useSelector((state: RootState) => state.class.currentClass.info)

    return (
        <div className="w-full h-fit flex flex-col gap-10 pt-topPadding">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-5 max-sm:grid-cols-1">
                <div className="flex flex-col gap-2.5 px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex justify-between items-center-safe">
                        <h4 className="text-gray font-medium dark:text-white">Thành viên</h4>
                        <a href="#" className="text-mainColor text-smallSize underline italic">Chi tiết</a>
                    </div>
                    <div className="flex items-center-safe gap-5">
                        <span className="flex items-center-safe gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-6 dark:stroke-gray">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            <p className="text-[32px] font-bold dark:text-white">{Number(classInfo.counts.student) < 10 ? `0${classInfo.counts.student}` : classInfo.counts.student}</p>
                        </span>

                        <span className="flex items-center-safe gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-gray">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                            </svg>
                            <p className="text-[32px] font-bold dark:text-white">{classInfo.counts.lecturer}</p>
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex justify-between items-center-safe">
                        <h4 className="text-gray font-medium dark:text-white">Biểu mẫu</h4>
                        <a href="#" className="text-mainColor text-smallSize underline italic">Chi tiết</a>
                    </div>
                    <div className="flex items-center-safe gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-gray">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        <p className="text-[32px] font-bold dark:text-white">05</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex justify-between items-center-safe">
                        <h4 className="text-gray font-medium dark:text-white">Tiến trình</h4>
                        <a href="#" className="text-mainColor text-smallSize underline italic">Chi tiết</a>
                    </div>
                    <div className="flex items-center-safe gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-gray">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p className="text-[32px] font-bold dark:text-white">05</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex justify-between items-center-safe">
                        <h4 className="text-gray font-medium dark:text-white">Yêu cầu chờ xử lý</h4>
                        <a href="#" className="text-mainColor text-smallSize underline italic">Chi tiết</a>
                    </div>
                    <div className="flex items-center-safe gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-gray">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                        <p className="text-[32px] font-bold dark:text-white">{Number(classInfo.counts.pending) < 10 ? `0${classInfo.counts.pending}` : classInfo.counts.pending}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-5 max-sm:flex-col">
                {/* Progress Section */}
                <div className="flex-1 flex flex-col gap-5 p-7 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex justify-between items-center-safe">
                        <h2 className="text-bigSize font-bold dark:text-white">Tiến trình</h2>
                        <a href="#" className="text-mainColor text-smallSize underline italic">Chi tiết</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="relative border border-gray/20 p-4 rounded-normal flex justify-between items-start-safe">
                            <div className="flex gap-4">
                                <span className="mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 stroke-mainColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </span>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-normalSize dark:text-white">Cung cấp thông tin đề tài</h3>
                                    <p className="text-smallSize text-gray font-light">Đây là mô tả của tiến trình</p>
                                    <p className="text-smallSize font-medium mt-2 text-gray">Bắt đầu: 00/00/0000 &nbsp;&nbsp;&nbsp; Kết thúc: 00/00/0000</p>
                                </div>
                            </div>
                            <span className="h-fit bg-mainColorRGB text-mainColor px-4 py-1 rounded-full text-smallSize font-semibold">Hoàn thành</span>
                        </div>

                        <div className="relative border border-gray/20 p-4 rounded-normal flex justify-between items-start-safe">
                            <div className="flex gap-4">
                                <span className="mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 stroke-red-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                    </svg>
                                </span>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-normalSize dark:text-white">Nộp đề cương KL/TL</h3>
                                    <p className="text-smallSize text-gray font-light">Đây là mô tả của tiến trình</p>
                                    <p className="text-smallSize font-medium mt-2 text-gray">Bắt đầu: 00/00/0000 &nbsp;&nbsp;&nbsp; Kết thúc: 00/00/0000</p>
                                </div>
                            </div>
                            <span className="h-fit bg-red-100 text-red-400 px-4 py-1 rounded-full text-smallSize font-semibold">Đang thực hiện</span>
                        </div>

                        <div className="relative border border-gray/20 p-4 rounded-normal flex justify-between items-start-safe opacity-60">
                            <div className="flex gap-4">
                                <span className="mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 stroke-gray">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </span>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-normalSize dark:text-white">Viết báo cáo</h3>
                                    <p className="text-smallSize text-gray font-light">Đây là mô tả của tiến trình</p>
                                    <p className="text-smallSize font-medium mt-2 text-gray">Bắt đầu: 00/00/0000 &nbsp;&nbsp;&nbsp; Kết thúc: 00/00/0000</p>
                                </div>
                            </div>
                            <span className="h-fit bg-gray-200 text-gray px-4 py-1 rounded-full text-smallSize font-semibold">Chưa bắt đầu</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="flex-1 flex flex-col gap-5 p-7 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex justify-between items-center-safe">
                        <h2 className="text-bigSize font-bold dark:text-white">Hoạt động gần đây</h2>
                        <a href="#" className="text-mainColor text-smallSize underline italic">Chi tiết</a>
                    </div>

                    <div className="flex flex-col gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex justify-between items-center-safe">
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-normalSize dark:text-white">Tên hoạt động {i}</h3>
                                    <p className="text-smallSize text-gray font-light">{i + 1} giờ trước</p>
                                </div>
                                <button className="border border-gray/40 px-5 py-1.5 rounded-normal text-smallSize font-bold hover:bg-lightGray dark:hover:bg-gray transition-colors">
                                    {i === 3 ? "Biểu mẫu" : "Nộp bài"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RAOverview
