import type React from "react"

const SDMilestones: React.FC = () => {
    return (
        <div className="w-full h-fit flex flex-col gap-5 pt-topPadding">
            <div className="flex justify-between items-center-safe">
                <h1 className="text-largeSize font-bold dark:text-white">Tiến trình</h1>
            </div>

            <div className="flex flex-col gap-5">
                {/* Milestone Card 1 - Đã trả lời */}
                <div className="w-full flex justify-between items-center-safe px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex gap-5 items-start-safe">
                        <span className="mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 stroke-mainColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </span>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-normalSize font-bold dark:text-white">Cung cấp thông tin đề tài</h3>
                            <p className="text-smallSize text-gray font-light">Đây là mô tả của tiến trình</p>
                            <div className="flex gap-5 text-smallSize font-semibold mt-1">
                                <p className="dark:text-gray">Biểu mẫu: 10</p>
                            </div>
                            <div className="flex gap-10 text-smallSize font-semibold mt-2">
                                <p className="dark:text-gray">Bắt đầu: 00/00/0000</p>
                                <p className="dark:text-gray">Kết thúc: 00/00/0000</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end-safe gap-4">
                        <span className="bg-mainColorRGB text-mainColor px-10 py-1.5 rounded-full text-smallSize font-bold">Đã trả lời</span>
                        <div className="flex gap-2.5">
                            <button className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-normal hover:cursor-pointer transition-colors dark:bg-gray/20 dark:text-white text-smallSize font-semibold">
                                Xem
                            </button>
                            <button className="bg-mainColor text-white px-4 py-1.5 rounded-normal hover:cursor-pointer transition-colors text-smallSize font-semibold">
                                Chỉnh sửa câu trả lời
                            </button>
                        </div>
                    </div>
                </div>

                {/* Milestone Card 2 - Hết hạn */}
                <div className="w-full flex justify-between items-center-safe px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex gap-5 items-start-safe">
                        <span className="mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 stroke-red-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                        </span>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-normalSize font-bold dark:text-white">Nộp đề cương KL/TL</h3>
                            <p className="text-smallSize text-gray font-light">Đây là mô tả của tiến trình</p>
                            <div className="flex gap-5 text-smallSize font-semibold mt-1">
                                <p className="dark:text-gray">Biểu mẫu: 10</p>
                            </div>
                            <div className="flex gap-10 text-smallSize font-semibold mt-2">
                                <p className="dark:text-gray">Bắt đầu: 00/00/0000</p>
                                <p className="dark:text-gray">Kết thúc: 00/00/0000</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end-safe gap-4">
                        <span className="bg-red-100 text-red-400 px-10 py-1.5 rounded-full text-smallSize font-bold">Hết hạn</span>
                        <div className="flex gap-2.5">
                            <button className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-normal hover:cursor-pointer transition-colors dark:bg-gray/20 dark:text-white text-smallSize font-semibold">
                                Xem
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SDMilestones
