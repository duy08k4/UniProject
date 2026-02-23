import type React from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

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

    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        switch (navigation.pathname) {
            case "/":
                setNavState({
                    home: true,
                    studentProject: false,
                    contact: false
                })
                break;

            case "/projects":
                setNavState({
                    home: false,
                    studentProject: true,
                    contact: false
                })
                break;

            default:
                setNavState({
                    home: false,
                    studentProject: false,
                    contact: true
                })
                break;
        }

    }, [navigation.pathname])

    return (
        <div className="relative h-full w-full bg-bgLight flex flex-col gap-15 px-twoSidePadding overflow-auto dark:bg-bgDark max-sm:px-mobile-twoSidePadding">
            {/* Header */}
            <header className="sticky z-10 top-0 left-0 h-fit flex justify-between items-center-safe bg-bgLight py-topPadding dark:bg-bgDark">
                <NavLink to="/" className="h-10 flex items-end-safe gap-2.5">
                    <img src={UniLogo} loading="lazy" className="h-full max-sm:h-10 max-sm:w-10" />
                    <h1 className="uppercase text-bigSize font-semibold dark:text-white max-sm:hidden">UniProject</h1>
                </NavLink>


                <span ref={menuRef} className="relative flex gap-5">
                    <nav className={`flex gap-10 ${open ? "max-sm:flex" : "max-sm:hidden"} max-sm:absolute max-sm:top-[calc(100%+10px)] max-sm:right-0 max-sm:h-fit max-sm:flex-col max-sm:bg-white max-sm:dark:bg-lightDark max-sm:gap-0 max-sm:rounded-normal`}>
                        <NavLink to="/" end
                            className={`text-normalSize px-5 py-1.5 rounded-normal dark:text-white ${navState.home && "bg-mainColorRGB text-mainColor font-bold dark:text-mainColor!"} max-sm:text-mobile-normalSize max-sm:py-3.5 max-sm:rounded-none`}>
                            Trang chủ
                        </NavLink>

                        <NavLink to="/projects" end
                            className={`text-normalSize px-5 py-1.5 rounded-normal dark:text-white ${navState.studentProject && "bg-mainColorRGB text-mainColor font-bold dark:text-mainColor!"} max-sm:text-mobile-normalSize max-sm:py-3.5 max-sm:rounded-none`}>
                            Đồ án sinh viên
                        </NavLink>

                        <NavLink to="" end
                            className={`text-normalSize px-5 py-1.5 rounded-normal dark:text-white ${navState.contact && "bg-mainColorRGB text-mainColor font-bold dark:text-mainColor!"} max-sm:text-mobile-normalSize max-sm:py-3.5 max-sm:rounded-none`}>
                            Liên hệ
                        </NavLink>
                    </nav>

                    <ToggleTheme />

                    <button className={`hidden max-sm:block h-full aspect-square rounded-full p-2 hover:cursor-pointer hover:bg-lightGray ${open && "bg-lightGray"}`} onClick={() => { setOpen(!open) }}>
                        {open ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 max-sm:dark:stroke-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}


                    </button>
                </span>

            </header>

            {/* Body */}
            <div className="flex-1">
                <Outlet />
            </div>

            {/* Footer */}
            <footer className="w-full h-10! border-t-2 border-lightGray flex flex-col items-center-safe justify-center-safe py-5 dark:border-gray">
                <p className="dark:text-white max-sm:text-mobile-smallSize">Thiết kế và xây dựng bởi <b><i className="dark:text-mainColor max-sm:text-mobile-smallSize">WallDy</i></b></p>
                <p className="dark:text-white max-sm:text-mobile-smallSize">&copy; 2026 UniProject. Tất cả các quyền được bảo lưu.</p>
            </footer>
        </div>
    )
}

export default LandingPageLayout