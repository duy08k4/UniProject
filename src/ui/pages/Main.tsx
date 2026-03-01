import type React from "react"
import { NavLink } from "react-router-dom"
import uniqolor from "uniqolor"

// Image
import UniLogo from "../../assets/UniLogo.png"

// Component
import ToggleTheme from "../components/ToggleTheme.comp"

const Main: React.FC = () => {
    return (
        <div className="h-full flex-1 flex flex-col gap-2.5 dark:bg-bgDark">
            <header className="w-full border-b-[0.5px] border-lightGray dark:border-gray flex justify-between px-[300px] max-sm:px-mobile-twoSidePadding py-5">
                <NavLink to="/" className="h-10 flex items-end-safe gap-2.5">
                    <img src={UniLogo} loading="lazy" className="h-full max-sm:h-10 max-sm:w-10" />
                    <h1 className="uppercase text-bigSize font-semibold dark:text-white max-sm:hidden">UniProject</h1>
                </NavLink>

                <span className="flex items-center-safe gap-5">
                    <ToggleTheme />

                    <span className="flex items-center-safe gap-2.5">
                        <p className="h-10 aspect-square rounded-full bg-mainColor flex justify-center-safe items-center-safe text-white font-medium">UA</p>
                        <p className="text-nowrap font-bold dark:text-white max-sm:hidden">UniAdmin</p>
                    </span>
                </span>
            </header>

            <div className="h-full flex-1 px-[300px] max-sm:px-mobile-twoSidePadding overflow-auto">
                <div className="sticky top-0 left-0 w-full bg-bgLight dark:bg-bgDark flex max-sm:flex-col items-center-safe gap-5 max-sm:gap-2.5 py-5 z-10">
                    <span className="relative w-full flex items-center-safe px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-6 dark:stroke-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>

                        <input type="text" className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white" placeholder="Tìm kiếm tên hoặc gmail..." />
                        <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px"></span>
                    </span>

                    <span className="flex max-sm:w-full gap-1.5 items-center-safe">
                        <button className="flex-1 border-[0.5px] border-lightGray dark:border-gray dark:text-white px-5 py-2 rounded-small text-nowrap max-sm:text-mobile-normalSize">Tham gia lớp</button>
                        <button className="flex-1 bg-mainColor text-white font-medium px-5 py-2 rounded-small text-nowrap max-sm:text-mobile-normalSize">Tạo lớp</button>
                    </span>
                </div>

                <div className="w-full flex flex-col gap-20 max-sm:gap-10">
                    <div className="w-full flex flex-col gap-5">
                        <span>
                            <h1 className="text-hugeSize max-sm:text-mobile-bigSize font-medium dark:text-white">Lớp học của tôi</h1>
                            <p className="text-normalSize max-sm:text-mobile-normalSize font-medium text-gray">Các lớp học bạn đã tạo và quản lý</p>
                        </span>

                        <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-5 px">
                            {Array(9).fill(0).map(() => {
                                return (
                                    <span className="flex flex-col gap-2.5 shadow-[0_0_20px_rgba(128,128,128,0.25)] px-3.5 py-5 rounded-small">
                                        <span className="flex flex-col gap-1.5">
                                            <h4 className="text-mediumSize max-sm:text-mobile-mediumSizeSize font-bold line-clamp-2 dark:text-white">Web Development Fundamentals</h4>
                                            <span className="w-fit text-smallSize max-sm:text-mobile-smallSize text-white font-semibold bg-mainColor px-2.5 py-1 rounded-small">Chủ lớp</span>
                                        </span>

                                        <span className="">
                                            <p className="line-clamp-3 text-gray max-sm:text-smallSize">Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học </p>
                                        </span>

                                        <span className="">
                                            <span className="flex items-center-safe gap-2.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-4 dark:stroke-gray">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                                </svg>

                                                <p className="dark:text-gray max-sm:text-smallSize">20 sinh viên</p>
                                            </span>
                                        </span>
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-5">
                        <span>
                            <h1 className="text-hugeSize max-sm:text-mobile-bigSize font-medium dark:text-white">Lớp học đã tham gia</h1>
                            <p className="text-normalSize max-sm:text-mobile-normalSize font-medium text-gray">Các lớp học bạn đã tham gia</p>
                        </span>

                        <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-5">
                            {Array(9).fill(0).map(() => {
                                return (
                                    <span className="flex flex-col gap-2.5 shadow-[0_0_20px_rgba(128,128,128,0.25)] px-3.5 py-5 rounded-small">
                                        <span className="flex flex-col gap-1.5">
                                            <h4 className="text-mediumSize max-sm:text-mobile-mediumSize font-bold line-clamp-1 dark:text-white">Web Development Fundamentals</h4>
                                            <span className="w-fit text-smallSize max-sm:text-mobile-smallSize text-mainColor font-bold border-[0.5px] border-mainColor px-2.5 py-1 rounded-small">Thành viên</span>
                                        </span>

                                        <span className="">
                                            <p className="line-clamp-2 text-gray">Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học Đây là mô tả lớp học </p>
                                        </span>

                                        <span className="">
                                            <span className="flex items-center-safe gap-2.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-4 dark:stroke-gray">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                                </svg>

                                                <p className="dark:text-gray">20 sinh viên</p>
                                            </span>
                                        </span>
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="w-full h-fit border-t-2 border-lightGray flex flex-col items-center-safe justify-center-safe py-5 dark:border-gray">
                <p className="dark:text-white max-sm:text-mobile-smallSize">Thiết kế và xây dựng bởi <b><i className="dark:text-mainColor max-sm:text-mobile-smallSize">WallDy</i></b></p>
                <p className="dark:text-white max-sm:text-mobile-smallSize">&copy; 2026 UniProject. Tất cả các quyền được bảo lưu.</p>
            </footer>
        </div>
    )
}

export default Main