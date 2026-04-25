import type React from "react"

// Image
import UniLogo from "../../assets/UniLogo.png"

// Component
import ToggleTheme from "../components/ToggleTheme.comp"
import { useState, type ReactElement } from "react"
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import getShortName from "../../utils/getShortName"
import RATransferRights from "../components/RATransferRights"
import RASettingsForm from "../components/RASettingsForm"
import { confirmDialog } from "primereact/confirmdialog"
import { changeStateFetching } from "../../redux/reducers/global.reducer"
import { ClassService } from "../../services/class/class.service"

type SidebarTab = { icon: ReactElement, label: string, path: string }

const RoomAdminLayout: React.FC = () => {
    const pathLocation = useLocation()
    const { classId } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userData = useSelector((state: RootState) => state.auth.user.info)
    const classData = useSelector((state: RootState) => state.class.currentClass)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const [isLeaveClass, setIsLeaveClass] = useState<boolean>(false)
    const [showSettings, setShowSettings] = useState<boolean>(false)

    const sidebarTab: SidebarTab[] = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white max-sm:size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            ,
            label: "Tổng quan",
            path: `/main/roomadmin/class/${classId}`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>,
            label: "Bảng tin",
            path: `/main/roomadmin/class/${classId}/newsfeed`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white max-sm:size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>,
            label: "Thành viên",
            path: `/main/roomadmin/class/${classId}/members`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white max-sm:size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
            </svg>

            ,
            label: "Quy trình",
            path: `/main/roomadmin/class/${classId}/progresses`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white max-sm:size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            ,
            label: "Biểu mẫu",
            path: `/main/roomadmin/class/${classId}/forms`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white max-sm:size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            ,
            label: "Bảng điểm",
            path: `/main/roomadmin/class/${classId}/scoreboards`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white max-sm:size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            ,
            label: "Hội đồng",
            path: `/main/roomadmin/class/${classId}/committee`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white max-sm:size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            ,
            label: "Bài nộp",
            path: `/main/roomadmin/class/${classId}/submission`
        }
    ]

    const toggleLeaveClass = () => {
        setIsLeaveClass(!isLeaveClass)
    }

    const handleDissolve = async () => {
        confirmDialog({
            header: "Thông báo giải tán lớp học",
            message: <p>Hành động giải tán lớp <b className="text-red">{classData.info.label}</b> sẽ không thể khôi phục</p>,

            acceptLabel: "Tiếp tục",
            rejectLabel: "Hủy",

            accept: async () => {
                dispatch(changeStateFetching(true))

                await ClassService.removeClass(classData.info.id, userData.id).finally(() => {
                    dispatch(changeStateFetching(false))
                    navigate('/main')
                })
            }
        })
    }

    if (!userData.id || !classData.info.id) return null

    return (
        <>
            <div className="w-full h-full flex bg-bgLight dark:bg-bgDark overflow-hidden">
                {/* Side bar */}
                <div className="w-1/7 h-full flex flex-col gap-5 border-r-[0.5px] border-lightGray dark:border-gray px-[20px] py-5 max-sm:fixed max-sm:z-10 max-sm:w-2/3 max-sm:bg-bgLight dark:max-sm:bg-bgDark">
                    <button className="absolute hidden top-10 left-full -translate-x-1/2 h-8 aspect-square bg-bgLight dark:max-sm:bg-bgDark border-[0.5px] rounded-full border-lightGray max-sm:flex justify-center-safe items-center-safe">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="dark:stroke-white size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    <NavLink to={isFetching ? pathLocation.pathname : "/main"} className="flex items-center-safe gap-2.5">
                        <img src={UniLogo} className="h-10" loading="lazy" />
                        <span className="">
                            <h4 className="text-normalSize font-bold dark:text-white">UniProject</h4>
                        </span>
                    </NavLink>

                    <span className="flex-1 flex flex-col gap-2.5">
                        {sidebarTab.map((tab, index) => {
                            return (
                                <NavLink key={index} to={isFetching ? pathLocation.pathname : tab.path} className={`disableState relative flex items-center-safe gap-2.5 px-2.5 py-3.5 hover:cursor-pointer hover:bg-mainColorRGB rounded-small ${pathLocation.pathname === tab.path && "bg-mainColorRGB [&_p]:text-mainColor [&_svg]:stroke-mainColor"}`}>
                                    {tab.icon}
                                    <p className="text-smallSize max-sm:text-mobile-smallSize font-semibold dark:text-white">{tab.label}</p>
                                    {tab.path.includes("members") && Number(classData.info.counts.pending) > 0 && <div className="absolute top-0 left-full translate-y-1/2 -translate-x-[calc(100%+20px)] bg-red text-white h-7 aspect-square rounded-full flex items-center-safe justify-center-safe ">{classData.info.counts.pending}</div>}
                                </NavLink>
                            )
                        })}
                    </span>

                    <span className="w-full flex flex-col gap-2.5">
                        <button className="hoverBtn bg-redRGB w-full flex items-center-safe gap-2.5 px-2.5 py-3.5 hover:cursor-pointer rounded-small disableState" disabled={isFetching} onClick={toggleLeaveClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-red">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                            </svg>

                            <p className="text-smallSize max-sm:text-mobile-smallSize font-semibold dark:text-red text-red" onClick={toggleLeaveClass}>Rời lớp</p>
                        </button>

                        <button className="hoverBtn bg-red w-full flex items-center-safe gap-2.5 px-2.5 py-3.5 hover:cursor-pointer rounded-small disableState" disabled={isFetching} onClick={handleDissolve}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 stroke-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                            </svg>

                            <p className="text-smallSize max-sm:text-mobile-smallSize font-semibold dark:text-white text-white">Giải tán lớp</p>
                        </button>

                        <span className="w-full flex items-center-safe justify-between">
                            <p className="font-medium dark:text-white text-nowrap">Giao diện:</p>
                            <ToggleTheme />
                        </span>
                    </span>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col">
                    <header className="w-full border-b-[0.5px] border-lightGray dark:border-gray flex justify-between gap-10 px-mainTwoSidePadding py-5">
                        <span className="relative w-3/5 flex items-center-safe gap-5 px-2.5 rounded-small">
                            {pathLocation.pathname !== `/main/roomadmin/class/${classId}` && <h1 className="text-largeSize font-bold dark:text-white line-clamp-1">{classData.info.label}</h1>}
                        </span>

                        <span className="flex items-center-safe gap-5">
                            <span className="flex items-center-safe gap-2.5">
                                <p className="h-full aspect-square rounded-full bg-mainColor flex justify-center-safe items-center-safe text-white font-medium p-2.5">
                                    {getShortName(userData.full_name)}
                                </p>
                                <span className="">
                                    <p className="text-nowrap font-bold dark:text-white">{userData.full_name}</p>
                                    <p className="text-smallSize text-gray text-nowrap font-medium dark:text-white">{userData.email}</p>
                                </span>
                            </span>

                            <button
                                className="p-2.5 rounded-full hover:bg-gray/10 dark:hover:bg-white/10 transition-all group"
                                title="Cài đặt lớp học"
                                onClick={() => setShowSettings(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white group-hover:text-mainColor transition-colors">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.127c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.127.332-.183.582-.495.644-.869l.214-1.281Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </button>
                        </span>
                    </header>

                    <div className="flex-1 px-mainTwoSidePadding overflow-auto">
                        <Outlet />
                    </div>
                </div>
            </div>

            {isLeaveClass && <RATransferRights togglePopup={toggleLeaveClass} />}
            {showSettings && <RASettingsForm toggleForm={() => setShowSettings(false)} />}
        </>
    )
}

export default RoomAdminLayout