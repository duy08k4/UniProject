import type React from "react"

// Image
import UniLogo from "../../assets/UniLogo.png"

// Component
import ToggleTheme from "../components/ToggleTheme.comp"
import { useRef, type ReactElement } from "react"
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { confirmDialog } from "primereact/confirmdialog"
import { changeStateFetching } from "../../redux/reducers/global.reducer"
import { ClassService } from "../../services/class/class.service"
import { currentClass_RemoveMember } from "../../redux/reducers/classSlice.reducer"
import getShortName from "../../utils/getShortName"

type SidebarTab = { icon: ReactElement, label: string, path: string }

const RoomLecturerLayout: React.FC = () => {
    const pathLocation = useLocation()
    const { classId } = useParams()
    const dispatch = useDispatch()


    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const classData = useSelector((state: RootState) => state.class.currentClass)

    const sidebarTab = useRef<SidebarTab[]>([
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>,
            label: "Bảng tin",
            path: `/main/lecturer/class/${classId}`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>,
            label: "Thành viên",
            path: `/main/lecturer/class/${classId}/members`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>,
            label: "Đề tài",
            path: `/main/lecturer/class/${classId}/topics`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
            ,
            label: "Quy trình",
            path: `/main/lecturer/class/${classId}/milestones`
        },
    ])

    const sidebarTabCommittee = useRef<SidebarTab[]>([
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
            ,
            label: "Hội đồng",
            path: `/main/lecturer/class/${classId}/committee`
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            ,
            label: "Bảng điểm",
            path: `/main/lecturer/class/${classId}/committee-scoreboards`
        }
    ])

    // Handler
    const handleLeaveClass = async () => {
        confirmDialog({
            header: "Thông báo",
            message: <p>Xác nhận rời lớp <b className="text-red">{classData.info.label}</b></p>,

            acceptLabel: "Rời lớp",
            rejectLabel: "Hủy",

            accept: async () => {
                dispatch(changeStateFetching(true))

                const userUpodate = await ClassService.removeMember(userData.id, classData.info.id)
                    .finally(() => {
                        dispatch(changeStateFetching(false))
                    })

                if (userUpodate) dispatch(currentClass_RemoveMember(userUpodate))
            }
        })
    }

    if (!userData.id || !classData.info.id) return null

    return (
        <div className="w-full h-full flex bg-bgLight dark:bg-bgDark">
            {/* Side bar */}
            <div className="w-1/7 h-full flex flex-col gap-5 border-r-[0.5px] border-lightGray dark:border-gray px-[20px] py-5">
                <NavLink to={isFetching ? pathLocation.pathname : "/main"} className="flex items-center-safe gap-2.5">
                    <img src={UniLogo} className="h-10" loading="lazy" />
                    <span className="">
                        <h4 className="text-normalSize font-bold dark:text-white">UniProject</h4>
                    </span>
                </NavLink>

                <span className="flex-1 flex flex-col gap-2.5">
                    {sidebarTab.current.map((tab, index) => {
                        return (
                            <NavLink key={index} to={isFetching ? pathLocation.pathname : tab.path} className={`disableState flex items-center-safe gap-2.5 px-2.5 py-3.5 hover:cursor-pointer hover:bg-mainColorRGB rounded-small ${pathLocation.pathname === tab.path && "bg-mainColorRGB [&_p]:text-mainColor [&_svg]:stroke-mainColor"}`}>
                                {tab.icon}
                                <p className="text-smallSize font-semibold dark:text-white">{tab.label}</p>
                            </NavLink>
                        )
                    })}

                    {sidebarTabCommittee.current.map((tab, index) => {
                        return (
                            <NavLink key={index} to={isFetching ? pathLocation.pathname : tab.path} className={`disableState flex items-center-safe gap-2.5 px-2.5 py-3.5 hover:cursor-pointer hover:bg-mainColorRGB rounded-small ${pathLocation.pathname === tab.path && "bg-mainColorRGB [&_p]:text-mainColor [&_svg]:stroke-mainColor"}`}>
                                {tab.icon}
                                <p className="text-smallSize font-semibold dark:text-white">{tab.label}</p>
                            </NavLink>
                        )
                    })}
                </span>

                <span className="w-full flex flex-col gap-2.5">
                    <button className="hoverBtn bg-redRGB w-full flex items-center-safe gap-2.5 px-2.5 py-3.5 hover:cursor-pointer rounded-small disableState" disabled={isFetching} onClick={handleLeaveClass}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-red">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>

                        <p className="text-smallSize font-semibold dark:text-red text-red">Rời lớp</p>
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
                    <span className="flex items-center-safe gap-2.5">
                        <p className="h-full aspect-square rounded-full bg-mainColor flex justify-center-safe items-center-safe text-white font-medium">{getShortName(userData.full_name)}</p>
                        <span className="">
                            <p className="text-nowrap font-bold dark:text-white">{userData.full_name}</p>
                            <p className="text-smallSize text-gray text-nowrap font-medium dark:text-white">{userData.email}</p>
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

export default RoomLecturerLayout