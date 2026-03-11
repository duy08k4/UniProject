import type React from "react"

const RAMilestones: React.FC = () => {
    return (
        <div className="w-full h-fit flex flex-col gap-5 pt-topPadding">
            <div className="flex justify-between items-center-safe">
                <h1 className="text-largeSize font-bold dark:text-white">Tiến trình</h1>
                <button className="flex items-center-safe gap-2 text-normalSize font-medium hover:cursor-pointer dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Cột mốc mới
                </button>
            </div>

            <div className="flex flex-col gap-5">
                {/* Milestone Card 1 */}
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
                                <p>Biểu mẫu: 10</p>
                            </div>
                            <div className="flex gap-10 text-smallSize font-semibold mt-2">
                                <p>Bắt đầu: 00/00/0000</p>
                                <p>Kết thúc: 00/00/0000</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end-safe gap-4">
                        <span className="bg-mainColorRGB text-mainColor px-10 py-1.5 rounded-full text-smallSize font-bold">Hoàn thành</span>
                        <div className="flex gap-2.5">
                            <button className="bg-gray-200 p-2.5 rounded-normal hover:cursor-pointer transition-colors dark:bg-gray/20">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                            <button className="bg-red-100 p-2.5 rounded-normal hover:cursor-pointer transition-colors dark:bg-red-400/20">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-red-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Milestone Card 2 */}
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
                                <p>Biểu mẫu: 10</p>
                            </div>
                            <div className="flex gap-10 text-smallSize font-semibold mt-2">
                                <p>Bắt đầu: 00/00/0000</p>
                                <p>Kết thúc: 00/00/0000</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end-safe gap-4">
                        <span className="bg-red-100 text-red-400 px-10 py-1.5 rounded-full text-smallSize font-bold">Đang thực hiện</span>
                        <div className="flex gap-2.5">
                            <button className="bg-gray-200 p-2.5 rounded-normal hover:cursor-pointer transition-colors dark:bg-gray/20">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                            <button className="bg-red-100 p-2.5 rounded-normal hover:cursor-pointer transition-colors dark:bg-red-400/20">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-red-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RAMilestones
