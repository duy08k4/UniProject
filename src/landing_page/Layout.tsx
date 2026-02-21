import type React from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

// Component
import ToggleTheme from "./ToggleTheme.comp"

// Assets
import UniLogo from "../assets/UniLogo.png"

const LandingPageLayout: React.FC = () => {
    const navigation = useLocation()
    const [navState, setNavState] = useState<Record<string, boolean>>({
        home: false,
        studentProject: false,
        contact: false
    })

    useEffect(() => {
        console.log(navigation.pathname)

        switch (navigation.pathname) {
            case "/":
                setNavState((prev) => {
                    return {...prev, home: true}
                })
                break;
        
            default:
                break;
        }
    }, [navigation.pathname])

    return (
        <div className="relative h-full w-full bg-bgLight flex flex-col gap-15 px-twoSidePadding overflow-auto dark:bg-black">
            {/* Header */}
            <header className="sticky z-10 top-0 left-0 h-fit flex justify-between items-center-safe bg-bgLight py-topPadding dark:bg-black">
                <NavLink to="/" className="h-10 flex items-end-safe gap-2.5">
                    <img src={UniLogo} loading="lazy" className="h-full" />
                    <h1 className="uppercase text-bigSize font-semibold dark:text-white">UniProject</h1>
                </NavLink>

                <nav className="flex gap-10">
                    <NavLink to="" end className={`text-normalSize px-5 py-1.5 rounded-normal dark:text-white ${navState.home && "bg-mainColorRGB text-mainColor font-bold dark:text-mainColor!"}`}>Trang chủ</NavLink>
                    <NavLink to="" end className={`text-normalSize px-5 py-1.5 rounded-normal dark:text-white ${navState.studentProject && "bg-mainColorRGB text-mainColor font-bold dark:text-mainColor!"}`}>Đồ án sinh viên</NavLink>
                    <NavLink to="" end className={`text-normalSize px-5 py-1.5 rounded-normal dark:text-white ${navState.contact && "bg-mainColorRGB text-mainColor font-bold dark:text-mainColor!"}`}>Liên hệ</NavLink>
                    <ToggleTheme />
                </nav>
            </header>

            {/* Body */}
            <div className="flex-1">
                <Outlet />
            </div>

            {/* Footer */}
            <footer className="w-full h-10! border-t-2 border-lightGray flex flex-col items-center-safe justify-center-safe py-5 dark:border-gray">
                <p className="dark:text-white">Thiết kế và xây dựng bởi <b><i className="dark:text-mainColor">WallDy</i></b></p>
                <p className="dark:text-white">&copy; 2026 Hệ thống Quản lý Đồ án. Tất cả các quyền được bảo lưu.</p>
            </footer>
        </div>
    )
}

export default LandingPageLayout