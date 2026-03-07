import type React from "react"

// Chart
import PieChartComponent from "../../components/PieChart.comp"

const Overview: React.FC = () => {
    return (
        <div className="w-full h-full">
            <div className="flex gap-5">
                <span className="flex-1 flex items-center-safe justify-between px-7 py-3.5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-small">
                    <span className="">
                        <h4 className="text-normalSize text-gray">Người dùng</h4>
                        <p className="text-largeSize font-semibold">20</p>
                    </span>

                    <span className="h-fit aspect-square bg-lightGray p-3.5 rounded-normal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                    </span>
                </span>

                <span className="flex-1 flex items-center-safe justify-between px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-small">
                    <span className="">
                        <h4 className="text-normalSize text-gray">Lớp học</h4>
                        <p className="text-largeSize font-semibold">20</p>
                    </span>

                    <span className="h-fit aspect-square bg-lightGray p-3.5 rounded-normal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                    </span>
                </span>

                <span className="flex-1 flex items-center-safe justify-between px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-small">
                    <span className="">
                        <h4 className="text-normalSize text-gray">Cột mốc</h4>
                        <p className="text-largeSize font-semibold">20</p>
                    </span>

                    <span className="h-fit aspect-square bg-lightGray p-3.5 rounded-normal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>
                    </span>
                </span>

                <span className="flex-1 flex items-center-safe justify-between px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-small">
                    <span className="">
                        <h4 className="text-normalSize text-gray">Biểu mẫu</h4>
                        <p className="text-largeSize font-semibold">20</p>
                    </span>

                    <span className="h-fit aspect-square bg-lightGray p-3.5 rounded-normal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </span>
                </span>
            </div>

            <div className="">
                {Array(2).fill(0).map(() => {
                    return (
                        <div className="">
                            <PieChartComponent />
                        </div>
                    )
                })}
            </div>

            <div className=""></div>

            <div className=""></div>
        </div>
    )
}

export default Overview