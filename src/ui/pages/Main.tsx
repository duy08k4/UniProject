import type React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

// Image
import UniLogo from "../../assets/UniLogo.png"

// Component
import ToggleTheme from "../components/ToggleTheme.comp"
import NewClassForm from "../components/NewClassForm"
import JoinClassForm from "../components/JoinClassForm"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { AuthService } from "../../services/auth/auth.service"
import { ClassService, sizePage } from "../../services/class/class.service"
import formatVNTime from "../../utils/formatVNTime"
import { useDebounce } from "../../hooks/Debounce"
import { ScaleLoader } from "react-spinners"
import type { CreateNewClass } from "../../services/class/class.type"
import { currentClass_ResetInfo } from "../../redux/reducers/classSlice.reducer"

const Main: React.FC = () => {
    const [isNewClassForm, setIsNewClassForm] = useState<boolean>(false)
    const [isJoinClassForm, setIsJoinClassForm] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")
    const searchDebounce = useDebounce(search, 1000)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // State
    const [isSearching, setIsSearching] = useState<boolean>(false)

    // Redux
    const userData = useSelector((state: RootState) => state.auth.user)
    const classList = useSelector((state: RootState) => state.class.classList)
    const classListPagination = useSelector((state: RootState) => state.class.pagination)
    const [page, setPage] = useState<number>(1)


    useEffect(() => {
        if (!userData.info.id) return
        (async () => {
            setIsSearching(true)
            await ClassService.getAllClasses(page, sizePage, searchDebounce || undefined).finally(() => {
                setIsSearching(false)
                dispatch(currentClass_ResetInfo())
            })
        })()
    }, [userData.info.id, searchDebounce, page])


    // Handler
    const handleSignout = async () => {
        await AuthService.signOut()
    }

    const handleChangePage = (pagination: "prev" | "next") => {
        if (pagination === "next") {
            if (page >= Number.parseInt(String(classListPagination.totalPage))) return
            console.log("oke")
            setPage((prev) => prev + 1)
        } else {
            if (page <= 0) return
            setPage((prev) => prev - 1)
        }
    }

    const accessClass = (classData: CreateNewClass) => {
        navigate(`/main/${classData.roleClass}/class/${classData.id}`)
    }

    return (
        <div className="h-full flex-1 flex flex-col dark:bg-bgDark">
            <header className="w-full border-b-[0.5px] border-lightGray dark:border-gray flex justify-between px-[300px] max-sm:px-mobile-twoSidePadding py-5">
                <NavLink to="/" className="h-10 flex items-end-safe gap-2.5">
                    <img src={UniLogo} loading="lazy" className="h-full max-sm:h-10 max-sm:w-10" />
                    <h1 className="uppercase text-bigSize font-semibold dark:text-white max-sm:hidden">UniProject</h1>
                </NavLink>

                <span className="flex items-center-safe gap-5">
                    <ToggleTheme />

                    <span className="flex items-center-safe gap-2.5">
                        <p className="h-10 aspect-square rounded-full bg-mainColor flex justify-center-safe items-center-safe text-white font-medium">
                            {userData.info.full_name ? userData.info.full_name.split("")[0].split("")[0] : "U"}
                        </p>
                        <p className="text-nowrap font-bold dark:text-white max-sm:hidden">{userData.info.full_name}</p>
                    </span>

                    <button className="hoverBtn bg-redRGB p-2.5 rounded-small" onClick={handleSignout}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 stroke-red">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                    </button>
                </span>
            </header>

            <div className="h-full flex-1 flex flex-col gap-2.5 px-[300px] max-sm:px-mobile-twoSidePadding overflow-auto pb-5">
                <div className="sticky top-0 left-0 w-full bg-bgLight dark:bg-bgDark py-5 z-10">
                    <span className="w-full flex max-sm:flex-col items-center-safe gap-5 max-sm:gap-2.5">
                        <span className="relative w-full flex items-center-safe px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>

                            <input
                                type="text"
                                className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white disableState"
                                placeholder="Tìm kiếm tên lớp hoặc gmail chủ phòng..."
                                onChange={(e) => { setSearch(e.target.value) }}
                                disabled={isSearching}
                            />
                            <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px"></span>
                        </span>

                        {isSearching && (<ScaleLoader height={10} width={4} color="#499c40" />)}

                        <span className="flex max-sm:w-full gap-1.5 items-center-safe">
                            <button className="flex-1 border-[0.5px] border-lightGray dark:border-gray dark:text-white px-5 py-2 rounded-small text-nowrap max-sm:text-mobile-normalSize hoverBtn disableState" disabled={isSearching} onClick={() => { setIsJoinClassForm(!isJoinClassForm) }}>Tham gia lớp</button>
                            <button className="flex-1 bg-mainColor text-white font-medium px-5 py-2 rounded-small text-nowrap max-sm:text-mobile-normalSize hoverBtn disableState" disabled={isSearching} onClick={() => { setIsNewClassForm(!isNewClassForm) }}>Tạo lớp</button>
                        </span>
                    </span>

                    <span className="w-full flex justify-between items-center-safe py-2.5">
                        <p className="dark:text-white max-sm:text-mobile-smallSize flex items-center-safe gap-2">Lớp học: <b className="text-red">{classList.length < 10 ? `0${classList.length}` : classList.length}</b></p>

                        <span className="flex items-center-safe gap-1.5">
                            {Number.parseInt(String(classListPagination.total_classes)) > 0 && (
                                <p className="font-medium mr-3.5 dark:text-white max-sm:text-mobile-smallSize">Trang {classListPagination.page}/{classListPagination.totalPage}</p>
                            )}

                            <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn disableState" disabled={isSearching || page <= 0} onClick={() => handleChangePage("prev")}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn disableState" disabled={isSearching || Number.parseInt(String(classListPagination.totalPage)) < page} onClick={() => handleChangePage("next")}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </span>
                    </span>
                </div>

                <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-5 px-2.5">
                    {classList.map((classData) => {
                        return (
                            <span
                                key={classData.id}
                                className={`flex flex-col h-full gap-3.5 shadow-[0_0_20px_rgba(128,128,128,0.25)] px-5 py-5 rounded-small border-t-4 border-mainColor hoverBtn hover:shadow-[0_0_10px_2px_rgba(128,128,128,0.75)]`}
                                onClick={() => { accessClass(classData) }}
                            >
                                <span className="flex flex-col gap-1.5">
                                    <h4 className="text-mediumSize max-sm:text-mobile-mediumSize font-bold line-clamp-1 dark:text-white">{classData.label}</h4>
                                    <p className="text flex items-center-safe gap-2 dark:text-mainColor font-black">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 dark:fill-mainColor">
                                            <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" />
                                        </svg>
                                        {classData.owner && userData.info.email === classData.owner.email ? "Chủ phòng" : "Thành viên"}
                                    </p>
                                </span>

                                <span className="flex-1">
                                    <p className="min-h-[3em] line-clamp-3 text-gray">{classData.description}</p>
                                </span>

                                <span className="flex items-center-safe gap-3.5">
                                    <span className="flex items-center-safe gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 dark:stroke-gray">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>

                                        <p className="dark:text-gray">{classData.counts.student} sinh viên</p>
                                    </span>

                                    <span className="flex items-center-safe gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 dark:stroke-gray">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                                        </svg>

                                        <p className="dark:text-gray">{classData.counts.lecturer} giảng viên</p>
                                    </span>
                                </span>

                                <span className="border-t border-lightGray flex justify-between pt-2.5">
                                    <span>
                                        <span className="flex items-center-safe gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-4 stroke-mainColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                            </svg>

                                            <p className="font-medium text-smallSize text-mainColor line-clamp-1">{classData.owner && classData.owner.email}</p>
                                        </span>

                                        <span className="flex items-center-safe gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-mainColor">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                                            </svg>

                                            <p className="font-medium text-smallSize text-mainColor">{formatVNTime(classData.created_at)}</p>
                                        </span>
                                    </span>

                                    <span className="h-full flex items-center-safe">
                                        <button className="h-fit w-fit bg-mainColor text-white px-3.5 py-1.5 rounded-small hoverBtn disableState" disabled={isSearching}>Vào lớp</button>
                                    </span>
                                </span>
                            </span>
                        )
                    })}
                </div>
            </div>

            <footer className="w-full h-fit border-t-2 border-lightGray flex flex-col items-center-safe justify-center-safe py-5 dark:border-gray">
                <p className="dark:text-white max-sm:text-mobile-smallSize">Thiết kế và xây dựng bởi <b><i className="dark:text-mainColor max-sm:text-mobile-smallSize">WallDy</i></b></p>
                <p className="dark:text-white max-sm:text-mobile-smallSize">&copy; 2026 UniProject. Tất cả các quyền được bảo lưu.</p>
            </footer>
            {isNewClassForm && (
                <NewClassForm toggleForm={() => { setIsNewClassForm(!isNewClassForm) }} />
            )}

            {isJoinClassForm && (
                <JoinClassForm toggleForm={() => { setIsJoinClassForm(!isJoinClassForm) }} />
            )}
        </div>
    )
}

export default Main