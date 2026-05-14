import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import formatVNTime from "../../../utils/formatVNTime"
import getShortName from "../../../utils/getShortName"
import { useDebounce } from "../../../hooks/Debounce"
import { ClassService } from "../../../services/class/class.service"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { ScaleLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"

const SAClassManagement: React.FC = () => {
    const { classList, pagination: classPagination } = useSelector((state: RootState) => state.class)
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [page, setPage] = useState<number>(1)
    const [search, setSearch] = useState<string>("")
    const searchDebounce = useDebounce(search, 1500)

    useEffect(() => {
        if (!userData.id) return
        (async () => {
            dispatch(changeStateFetching(true))

            await ClassService.getAllClasses(page, 40, searchDebounce).finally(() => {
                dispatch(changeStateFetching(false))
            })
        })()
    }, [userData.id, page, searchDebounce])

    // Handler
    const refresh = async () => {
        dispatch(changeStateFetching(true))
        await ClassService.getAllClasses(page, 40, searchDebounce).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    const changePage = (pagination: "prev" | "next") => {
        alert()
        if (Number(classPagination.totalPage) > page && pagination === "next") {
            setPage((prev) => prev + 1)
        }

        if (page > 1 && pagination === "prev") {
            setPage((prev) => prev - 1)
        }
    }

    const fastApprove = async (classId: string) => {
        if (!classId) return

        dispatch(changeStateFetching(true))

        await ClassService.updateClass(classId, {
            created_approval: true
        }).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    const handleClassDetail = (classId: string) => {
        if (!classId) return

        navigate(`/super-admin/class/${classId}`)
    }

    const renderStatus = (is_deleted: boolean, is_banned: boolean, created_approval: boolean) => {
        if (is_deleted) return <span className="w-fit text-[14px] text-red bg font-medium px-2.5 py-1 rounded-small">Đã xóa</span>
        if (is_banned) return <span className="w-fit text-[14px] text-oranged font-medium px-2.5 py-1 rounded-small">Đình chỉ</span>
        if (!created_approval) return <span className="w-fit text-[14px] text-mainColor font-bold animate-pulse px-2.5 py-1 rounded-small">Chờ duyệt</span>
        return <span className="w-fit text-[14px] text-white bg-mainColor font-medium px-2.5 py-1 rounded-small">Hoạt động</span>
    }

    return (
        <div className="w-full h-full flex flex-col gap-6 py-5 px-mainTwoSidePadding bg-white dark:bg-bgDark transition-none">
            {/* Header section */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <h1 className="text-largeSize font-bold dark:text-white leading-tight">Quản lý lớp học</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-mainColor"></span>
                        <p className="text-normalSize text-gray font-medium">Tổng cộng {classPagination.total_classes} lớp học trong hệ thống</p>
                    </div>
                </div>

                {/* <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-mainColor text-white rounded-normal text-smallSize font-bold hoverBtn flex items-center gap-2.5 disableState" disabled={isFetching}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tạo lớp mới
                    </button>
                </div> */}
            </div>

            {/* Filter bar */}
            <div className="w-full flex items-center gap-8 bg-gray-50/50 dark:bg-white/5 p-5 rounded-normal border border-lightGray/30 dark:border-gray/20">
                <div>
                    <button className="h-full aspect-square p-1.5 border-[0.5px] border-lightGray rounded-full hoverBtn disableState" disabled={isFetching} onClick={refresh}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white max-sm:size-3.5 stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>

                <div className="relative flex-1 flex items-center-safe group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="absolute left-0 top-1/2 -translate-y-1/2 size-6 text-gray group-focus-within:text-mainColor transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 text-normalSize bg-transparent focus:outline-none dark:text-white border-b border-lightGray/50 focus:border-mainColor transition-all disableState"
                        disabled={isFetching}
                        onChange={(e) => { setSearch(e.target.value) }}
                        placeholder="Tìm kiếm tên lớp, môn học, email chủ phòng, tên chủ phòng..."
                    />
                    {isFetching && <ScaleLoader height={10} width={4} color="#499c40" />}

                </div>

                <div className="flex items-center gap-6">
                    <div className="h-10 w-px bg-lightGray/30 mx-2"></div>

                    <div className="flex items-center gap-3">
                        <p className="text-normalSize text-gray whitespace-nowrap font-medium">Trang <span className="font-bold text-mainColor">{Number(classPagination.page)}</span> / {classPagination.totalPage}</p>

                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-mainColor/10 rounded-small text-gray hover:text-mainColor transition-all disableState" disabled={isFetching || page <= 1} onClick={() => changePage("prev")}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            <button className="p-2 hover:bg-mainColor/10 rounded-small text-gray hover:text-mainColor transition-all disableState" disabled={isFetching || page >= Number(classPagination.totalPage)} onClick={() => changePage("next")}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Table */}
            <div className="flex-1 overflow-hidden flex flex-col rounded-normal border border-lightGray/30 dark:border-gray/20 shadow-sm">
                <div className="overflow-y-auto flex-1 bg-white dark:bg-black/20">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white dark:bg-bgDark z-10 border-b border-lightGray/30 dark:border-gray/20 shadow-sm">
                            <tr className="[&_th]:px-6 [&_th]:py-5 [&_th]:text-[13px] [&_th]:font-bold [&_th]:text-gray [&_th]:uppercase [&_th]:tracking-widest">
                                <th className="w-[32%]">Thông tin lớp học</th>
                                <th className="w-[20%]">Chủ phòng</th>
                                <th className="w-[15%] text-center">Thành viên</th>
                                <th className="w-[15%]">Trạng thái</th>
                                <th className="w-[12%] text-center">Ngày tạo</th>
                                <th className="w-[6%]"></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-lightGray/10 dark:divide-gray/5">
                            {classList.length > 0 ? classList.map((cls) => (
                                <tr key={cls.id} className={`group hover:bg-mainColor/5 transition-colors hover:cursor-pointer ${!cls.created_approval ? "bg-mainColor/2" : ""}`} onDoubleClick={() => { handleClassDetail(cls.id) }}>
                                    <td className="px-6 py-4 relative">
                                        {!cls.created_approval && <div className="absolute left-0 top-0 w-1.5 h-full bg-mainColor shadow-[2px_0_10px_rgba(73,156,64,0.3)]"></div>}
                                        <div className="flex flex-col cursor-pointer">
                                            <span className="text-[17px] font-bold dark:text-white group-hover:text-mainColor transition-colors line-clamp-1 leading-snug">{cls.label}</span>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[13px] px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-gray rounded font-mono font-bold tracking-tight">{cls.join_code}</span>
                                                <span className="text-[14px] text-gray line-clamp-1 font-medium italic opacity-80">{cls.subject}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-mainColor/10 dark:bg-mainColor/20 flex items-center justify-center text-[13px] font-bold text-mainColor border border-mainColor/20 shadow-sm">
                                                {getShortName(cls.owner?.full_name || "N A")}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[16px] font-bold dark:text-gray-200 leading-tight">{cls.owner?.full_name || "N/A"}</span>
                                                <span className="text-[13px] text-gray mt-0.5 font-medium">{cls.owner?.email || "N/A"}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center gap-5">
                                            <div className="flex flex-col items-center" title="Sinh viên">
                                                <span className="text-[16px] font-bold dark:text-white">{cls.counts.student}</span>
                                                <span className="text-[11px] text-gray uppercase font-bold tracking-tighter mt-0.5">SV</span>
                                            </div>

                                            <div className="flex flex-col items-center opacity-60" title="Giảng viên">
                                                <span className="text-[16px] font-bold dark:text-white">{cls.counts.lecturer}</span>
                                                <span className="text-[11px] text-gray uppercase font-bold tracking-tighter mt-0.5">GV</span>
                                            </div>

                                            <div className="flex flex-col items-center opacity-60" title="Hội đồng">
                                                <span className="text-[16px] font-bold dark:text-white">{cls.counts.committee}</span>
                                                <span className="text-[11px] text-gray uppercase font-bold tracking-tighter mt-0.5">HĐ</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        {renderStatus(cls.is_deleted, cls.is_banned, cls.created_approval)}
                                    </td>

                                    <td className="px-6 py-4 text-[14px] text-gray text-center whitespace-nowrap font-bold">
                                        {formatVNTime(cls.created_at).split(",")[0]}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                                            {!cls.created_approval && (

                                                <button className="p-2 bg-mainColor text-white rounded-small shadow-md hover:scale-110 active:scale-95 transition-all disableState" title="Duyệt nhanh" disabled={isFetching} onClick={() => { fastApprove(cls.id) }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-4 stroke-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                            </svg>

                                            <p className="text-largeSize font-bold tracking-tight">Chưa có dữ liệu lớp học</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                <div className="px-6 py-4 border-t border-lightGray/30 dark:border-gray/20 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                    <p className="text-[13px] text-gray font-bold italic opacity-70">* Di chuyển chuột vào hàng để thực hiện các thao tác nhanh</p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-mainColor shadow-[0_0_5px_rgba(73,156,64,0.5)]"></span>
                            <p className="text-mobile-smallSize font-bold text-gray uppercase tracking-widest">Bấm hai lần vào hàng để xem chi tiết</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SAClassManagement
