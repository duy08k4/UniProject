import type React from "react"

// Image
import UniLogo from "../../assets/UniLogo.png"

// Component
import ToggleTheme from "../components/ToggleTheme.comp"
import { useRef, type ReactElement } from "react"
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom"

type SidebarTab = { icon: ReactElement, label: string, path: string }

const RoomAdminLayout: React.FC = () => {
    const pathLocation = useLocation()
    const { classId } = useParams()

    const sidebarTab = useRef<SidebarTab[]>([
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 dark:stroke-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            ,
            label: "Tổng quan",
            path: `/main/admin/class/${classId}`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>,
            label: "Thành viên",
            path: `/main/admin/class/${classId}/members`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
            </svg>

            ,
            label: "Tiến trình",
            path: `/main/admin/class/${classId}/milestones`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 dark:stroke-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            ,
            label: "Biểu mẫu",
            path: `/main/admin/class/${classId}/forms`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            ,
            label: "Bảng điểm",
            path: `/main/admin/class/${classId}/scoreboards`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 dark:stroke-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            ,
            label: "Bài nộp",
            path: `/main/admin/class/${classId}/submission`
        }
    ])

    return (
        <div className="w-full h-full flex bg-bgLight dark:bg-bgDark">
            {/* Side bar */}
            <div className="w-1/7 h-full flex flex-col gap-5 border-r-[0.5px] border-lightGray dark:border-gray px-[20px] py-5">
                <span className="flex items-center-safe gap-2.5">
                    <img src={UniLogo} className="h-10" loading="lazy" />
                    <span className="">
                        <h4 className="text-normalSize font-bold dark:text-white">UniProject</h4>
                    </span>
                </span>

                <span className="flex-1 flex flex-col gap-2.5">
                    {sidebarTab.current.map((tab, index) => {
                        return (
                            <NavLink key={index} to={tab.path} className={`flex items-center-safe gap-2.5 px-2.5 py-3.5 hover:cursor-pointer hover:bg-mainColorRGB rounded-small ${pathLocation.pathname === tab.path && "bg-mainColorRGB [&_p]:text-mainColor [&_svg]:stroke-mainColor"}`}>
                                {tab.icon}
                                <p className="text-smallSize font-semibold dark:text-white">{tab.label}</p>
                            </NavLink>
                        )
                    })}
                </span>

                <span className="w-full flex flex-col gap-2.5">
                    <button className="hoverBtn bg-redRGB w-full flex items-center-safe gap-2.5 px-2.5 py-3.5 hover:cursor-pointer rounded-small">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 stroke-red">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>

                        <p className="text-smallSize font-semibold dark:text-red text-red">Rời lớp</p>
                    </button>

                    <button className="hoverBtn bg-red w-full flex items-center-safe gap-2.5 px-2.5 py-3.5 hover:cursor-pointer rounded-small">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 stroke-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                        </svg>

                        <p className="text-smallSize font-semibold dark:text-white text-white">Giải tán lớp</p>
                    </button>

                    <span className="w-full flex items-center-safe justify-between">
                        <p className="font-medium dark:text-white">Giao diện:</p>
                        <ToggleTheme />
                    </span>
                </span>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col">
                <header className="w-full border-b-[0.5px] border-lightGray dark:border-gray flex justify-end-safe gap-10 px-mainTwoSidePadding py-5">
                    <span className="relative w-1/4 flex items-center-safe px-2.5 rounded-small bg-[#e0e0e0] dark:bg-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>

                        <input type="text" className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white" placeholder="Tìm kiếm..." />
                        <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px"></span>
                    </span>

                    <span className="flex items-center-safe gap-2.5">
                        <p className="h-full aspect-square rounded-full bg-mainColor flex justify-center-safe items-center-safe text-white font-medium">QT</p>
                        <span className="">
                            <p className="text-nowrap font-bold dark:text-white">Quản trị lớp học</p>
                            <p className="text-smallSize text-gray text-nowrap font-medium dark:text-white">nguyenvana@gmail.com</p>
                        </span>
                    </span>
                </header>

                <div className="flex-1 px-mainTwoSidePadding overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default RoomAdminLayout