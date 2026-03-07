import type React from "react"
import { NavLink, Outlet } from "react-router-dom"

const AuthLayout: React.FC = () => {
    return (
        <div className="h-full w-full bg-bgLight flex flex-col gap-15 px-twoSidePadding overflow-auto dark:bg-bgDark max-sm:px-mobile-twoSidePadding pt-10">
            <header>
                <NavLink to="/" className="w-fit flex items-center-safe gap-2.5 px-5 py-2.5 shadow-[0_0_12px_rgba(0,0,0,0.25)] rounded-normal hover:cursor-pointer dark:bg-white max-sm:text-smallSize">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 max-sm:size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>

                    Quay lại trang chủ
                </NavLink>
            </header>

            <div className="flex-1">
                <Outlet />
            </div>

            <footer className="w-full h-fit border-t-2 border-lightGray flex flex-col items-center-safe justify-center-safe py-5 dark:border-gray">
                <p className="dark:text-white max-sm:text-mobile-smallSize">Thiết kế và xây dựng bởi <b><i className="dark:text-mainColor max-sm:text-mobile-smallSize">WallDy</i></b></p>
                <p className="dark:text-white max-sm:text-mobile-smallSize">&copy; 2026 UniProject. Tất cả các quyền được bảo lưu.</p>
            </footer>
        </div>
    )
}

export default AuthLayout