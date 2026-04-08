import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import { ClassService } from "../../../services/class/class.service"
import { useDebounce } from "../../../hooks/Debounce"
import { currentClass_SetMembers } from "../../../redux/reducers/classSlice.reducer"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { memberSizePage } from "../../../config/pageSize"
import getShortName from "../../../utils/getShortName"
import formatVNTime from "../../../utils/formatVNTime"
import uniqolor from "uniqolor"
import { ScaleLoader } from "react-spinners"

const SDMembers: React.FC = () => {
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const classMembers = useSelector((state: RootState) => state.class.currentClass.members)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const paginationMembers = useSelector((state: RootState) => state.class.currentClass.members.pagination)

    const dispatch = useDispatch()

    const [page, setPage] = useState<number>(1)
    const [search, setSearch] = useState<string>("")
    const [roleSearch, setRoleSearch] = useState<string>("")
    const searchDebounce = useDebounce(search, 1500)

    useEffect(() => {
        if (!userData.id) return

        (async () => {
            dispatch(changeStateFetching(true))

            const data = await ClassService.getMembers(page, memberSizePage, search, roleSearch).finally(() => {
                dispatch(changeStateFetching(false))
            })

            if (data) dispatch(currentClass_SetMembers(data))
        })()
    }, [userData.id, searchDebounce, page, roleSearch])

    // Handler
    const refresh = async () => {
        dispatch(changeStateFetching(true))
        const data = await ClassService.getMembers(1, memberSizePage, search, roleSearch).finally(() => {
            dispatch(changeStateFetching(false))
        })

        if (data) dispatch(currentClass_SetMembers(data))
    }

    const changePage = (pagination: "prev" | "next") => {
        if (Number(paginationMembers.totalPage) > page && pagination === "next") {
            setPage((prev) => prev + 1)
        }

        if (page > 1 && pagination === "prev") {
            setPage((prev) => prev - 1)
        }
    }

    if (!classMembers.data) return null

    const allMembersCount = Object.values(classMembers.data).flatMap(m => m).length

    return (
        <div className="w-full flex flex-col gap-5 py-mainTwoSidePadding">
            <div className="w-full h-fit">
                <h1 className="text-hugeSize font-semibold dark:text-white">Thành viên lớp học</h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-mainColor"></span>
                    <p className="text-normalSize text-gray font-medium">Tổng cộng {paginationMembers.total_members} lớp học trong hệ thống</p>
                </div>
            </div>

            <div className="w-full flex flex-col gap-5">
                <div className="sticky top-0 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center-safe gap-5 py-5 z-10">
                    <button className="h-full aspect-square p-1.5 border-[0.5px] border-lightGray rounded-full hoverBtn disableState" disabled={isFetching} onClick={refresh}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white max-sm:size-3.5 stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>

                    <span className="relative flex items-center-safe w-1/2 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.15)] dark:bg-bgDark transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>

                        <input
                            type="text"
                            className="h-12 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white text-smallSize disableState"
                            placeholder="Tìm kiếm tên hoặc email..."
                            disabled={isFetching}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-[2px] transition-all duration-300"></span>
                    </span>

                    {isFetching && <ScaleLoader height={10} width={4} color="#499c40" />}

                    <span className=" items-center-safe gap-1.5 hidden">
                        <p className="font-bold dark:text-white text-smallSize">Vai trò:</p>
                        <select
                            className="w-40 h-10 border-[0.5px] border-lightGray dark:border-gray px-2.5 rounded-small dark:text-white dark:bg-bgDark text-smallSize outline-none hover:cursor-pointer disableState"
                            disabled={isFetching}
                            onChange={(e) => setRoleSearch(e.target.value)}
                        >
                            <option className="dark:text-white" value="">Tất cả</option>
                            <option className="dark:text-white" value="lecturer">Giảng viên</option>
                            <option className="dark:text-white" value="student">Sinh viên</option>
                        </select>
                    </span>

                    <span className="flex-1 flex justify-end-safe items-center-safe gap-1.5">
                        <p className="font-medium mr-3.5 dark:text-white text-smallSize">Trang {paginationMembers.page}/{paginationMembers.totalPage}</p>

                        <button
                            className="hoverBtn p-1.5 border-[0.5px] border-lightGray rounded-normal dark:border-gray group disableState"
                            disabled={isFetching || page <= 1}
                            onClick={() => changePage("prev")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white group-hover:stroke-mainColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        <button
                            className="hoverBtn p-1.5 border-[0.5px] border-lightGray rounded-normal dark:border-gray group disableState"
                            disabled={isFetching || page >= Number(paginationMembers.totalPage)}
                            onClick={() => changePage("next")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white group-hover:text-mainColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </span>
                </div>

                <div className="w-full flex flex-col gap-10">
                    {/* Quản trị viên lớp học */}
                    {classMembers.data.roomadmin.length > 0 && (
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-3 pb-3 border-b-[0.5px] border-lightGray dark:border-gray">
                                <h2 className="text-mediumSize font-bold dark:text-white">Quản trị viên</h2>
                                <span className="bg-mainColor text-white text-smallSize px-3 py-0.5 rounded-full font-bold">
                                    {classMembers.data.roomadmin.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {classMembers.data.roomadmin.map((member) => {
                                    const uniqolorRandom = uniqolor(member.user.email)
                                    return (
                                        <div key={member.id} className="group relative flex justify-between items-center p-5 bg-bgLight dark:bg-bgDark shadow-[0_0_20px_rgba(128,128,128,0.25)] hover:shadow-[0_0_10px_2px_rgba(128,128,128,0.75)] hoverBtn rounded-normal hover:border-mainColor transition-all duration-300 border-l-4 border-l-mainColor cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className={`size-12 rounded-full flex items-center justify-center font-bold text-mediumSize shrink-0 shadow-sm ${uniqolorRandom.isLight ? "text-darkGray" : "text-white"}`} style={{ backgroundColor: uniqolorRandom.color }}>
                                                    {getShortName(member.user.full_name)}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="dark:text-white text-normalSize font-medium group-hover:text-mainColor transition-colors">{member.user.full_name}</p>
                                                    <p className="text-gray dark:text-lightGray text-smallSize italic">{member.user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-smallSize text-gray dark:text-lightGray font-medium">Tham gia: {formatVNTime(member.joined_at)}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Giảng viên */}
                    {classMembers.data.lecturer.length > 0 && (
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-3 pb-3 border-b-[0.5px] border-lightGray dark:border-gray">
                                <h2 className="text-mediumSize font-bold dark:text-white">Giảng viên</h2>
                                <span className="bg-mainColor text-white text-smallSize px-3 py-0.5 rounded-full font-bold">
                                    {classMembers.data.lecturer.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {classMembers.data.lecturer.map((member) => {
                                    const uniqolorRandom = uniqolor(member.user.email)
                                    return (
                                        <div key={member.id} className="group relative flex justify-between items-center p-5 bg-bgLight dark:bg-bgDark shadow-[0_0_20px_rgba(128,128,128,0.25)] hover:shadow-[0_0_10px_2px_rgba(128,128,128,0.75)] hoverBtn rounded-normal">
                                            <div className="flex items-center gap-4">
                                                <div className={`size-12 rounded-full flex items-center justify-center font-bold text-mediumSize shrink-0 shadow-sm ${uniqolorRandom.isLight ? "text-darkGray" : "text-white"}`} style={{ backgroundColor: uniqolorRandom.color }}>
                                                    {getShortName(member.user.full_name)}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="dark:text-white text-normalSize font-medium group-hover:text-mainColor transition-colors">{member.user.full_name}</p>
                                                    <p className="text-gray dark:text-lightGray text-smallSize italic">{member.user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-smallSize text-gray dark:text-lightGray font-medium">Tham gia: {formatVNTime(member.joined_at)}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Sinh viên */}
                    {classMembers.data.student.length > 0 && (
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-3 pb-3 border-b-[0.5px] border-lightGray dark:border-gray">
                                <h2 className="text-mediumSize font-bold dark:text-white">Sinh viên</h2>
                                <span className="bg-lightGray dark:bg-darkGray text-gray dark:text-white text-smallSize px-3 py-0.5 rounded-full font-bold">
                                    {classMembers.data.student.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {classMembers.data.student.map((member) => {
                                    const uniqolorRandom = uniqolor(member.user.email)
                                    return (
                                        <div key={member.id} className="group flex justify-between items-center px-6 py-4 bg-bgLight dark:bg-bgDark shadow-[0_0_20px_rgba(128,128,128,0.25)] hover:shadow-[0_0_10px_2px_rgba(128,128,128,0.75)] hoverBtn rounded-normal transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className={`size-10 rounded-full flex items-center justify-center font-bold text-normalSize shrink-0 border-[0.5px] border-mainColor/20 ${uniqolorRandom.isLight ? "text-darkGray" : "text-white"}`} style={{ backgroundColor: uniqolorRandom.color }}>
                                                    {getShortName(member.user.full_name)}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="dark:text-white text-normalSize font-medium">{member.user.full_name}</p>
                                                    <p className="text-gray dark:text-lightGray text-smallSize italic">{member.user.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-smallSize text-gray dark:text-lightGray font-medium">
                                                Ngày tham gia: {formatVNTime(member.joined_at)}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SDMembers
