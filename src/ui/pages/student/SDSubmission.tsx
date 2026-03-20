import type React from "react"

const SDSubmission: React.FC = () => {
    return (
        <div className="w-full flex flex-col gap-5 py-mainTwoSidePadding">
            <div className="w-full h-fit">
                <h1 className="text-hugeSize font-semibold dark:text-white">Lịch sử nộp bài</h1>
                <p className="text-normalSize text-gray text-nowrap font-medium dark:text-white">Xem lại các câu trả lời bạn đã điền trong các biểu mẫu</p>
            </div>

            <div className="w-full flex flex-col gap-5">
                <div className="sticky top-0 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center-safe gap-5 py-5">
                    <span className="relative flex items-center-safe w-1/2 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>

                        <input type="text" className="h-12 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white bg-transparent outline-none" placeholder="Tìm kiếm tên biểu mẫu hoặc cột mốc..." />
                        <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px transition-all duration-300"></span>
                    </span>

                    <span className="flex gap-1.5 items-center-safe ml-auto">
                        <p className="font-bold dark:text-white">Tổng cộng:</p>
                        <p className="dark:text-white">5 bản ghi</p>
                    </span>
                </div>

                <div className="w-full overflow-x-auto">
                    <div className="w-full h-fit border-[0.5px] border-lightGray dark:border-gray p-2.5 rounded-normal">
                        <table className="w-full bg-transparent">
                            <colgroup>
                                <col className="w-[20%]" />
                                <col className="w-[30%]" />
                                <col className="w-[20%]" />
                                <col className="w-[20%]" />
                                <col className="w-[10%]" />
                            </colgroup>

                            <thead>
                                <tr className="border-b-[0.5px] border-lightGray dark:border-gray">
                                    <th className="text-left px-3.5 py-3 dark:text-white font-semibold">Cột mốc</th>
                                    <th className="text-left px-3.5 py-3 dark:text-white font-semibold">Tên biểu mẫu</th>
                                    <th className="text-left px-3.5 py-3 dark:text-white font-semibold">Người tạo</th>
                                    <th className="text-left px-3.5 py-3 dark:text-white font-semibold">Thời gian nộp</th>
                                    <th className="text-center px-3.5 py-3 dark:text-white font-semibold">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    { form: "Báo cáo tiến độ tuần 1", milestone: "Giai đoạn 1", creator: "Nguyễn Văn A (Giảng viên)", time: "10:30 01-03-2026" },
                                    { form: "Khảo sát đề tài", milestone: "Khởi động", creator: "Trần Thị B (Admin)", time: "15:45 25-02-2026" },
                                    { form: "Báo cáo giữa kỳ", milestone: "Giai đoạn 2", creator: "Nguyễn Văn A (Giảng viên)", time: "09:00 20-02-2026" },
                                    { form: "Đánh giá thành viên", milestone: "Giai đoạn 1", creator: "Hệ thống", time: "22:15 15-02-2026" },
                                    { form: "Đăng ký nhóm", milestone: "Khởi động", creator: "Admin", time: "08:20 10-02-2026" },
                                ].map((item, index) => (
                                    <tr key={index} className="hover:bg-lightGray dark:hover:bg-darkGray hover:cursor-pointer [&_td]:text-gray border-t-[0.5px] border-lightGray dark:border-gray">
                                        <td className="px-3.5 py-4">{item.milestone}</td>
                                        <td className="px-3.5 py-4 font-medium dark:text-gray">{item.form}</td>
                                        <td className="px-3.5 py-4">{item.creator}</td>
                                        <td className="px-3.5 py-4">{item.time}</td>
                                        <td className="px-3.5 py-4 text-center">
                                            <button className="p-2 border-[0.5px] border-lightGray dark:border-gray rounded-normal hover:bg-mainColorRGB group transition-all" title="Xem chi tiết">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white group-hover:stroke-mainColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SDSubmission
