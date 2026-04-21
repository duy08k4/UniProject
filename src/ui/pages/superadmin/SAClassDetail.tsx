import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import type { RootState } from "../../../redux/store"
import { ClassService } from "../../../services/class/class.service"
import formatVNTime from "../../../utils/formatVNTime"
import getShortName from "../../../utils/getShortName"
import { RoomRole, VNRoleName, type RoomRoleType } from "../../../config/enum"
import { useDebounce } from "../../../hooks/Debounce"
import { currentClass_SetMembers } from "../../../redux/reducers/classSlice.reducer"
import { memberSizePage } from "../../../config/pageSize"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { confirmDialog } from "primereact/confirmdialog"

const SAClassDetail: React.FC = () => {
    const { classId } = useParams()
    const dispatch = useDispatch()

    const { info, members } = useSelector((state: RootState) => state.class.currentClass)
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const paginationMembers = useSelector((state: RootState) => state.class.currentClass.members.pagination)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    // Memberpagination
    const [page, setPage] = useState<number>(1)
    const [search, setSearch] = useState<string>("")
    const searchDebounce = useDebounce(search, 1500)
    const [roleSearch, setRoleSearch] = useState<string>("")
    const roleSearchDebounce = useDebounce(roleSearch, 1500)

    // Get class data
    useEffect(() => {
        if (!classId || !userData.id) return
        ClassService.getClass(classId)
    }, [userData.id, classId])

    // Get members
    useEffect(() => {
        if (!info.id || !userData.id) return
        (async () => {
            dispatch(changeStateFetching(true))
            const data = await ClassService.getMembers(1, memberSizePage, search, roleSearch).finally(() => {
                dispatch(changeStateFetching(false))
            })

            if (data) dispatch(currentClass_SetMembers(data))
        })()


    }, [info.id, page, searchDebounce, roleSearchDebounce])

    const handleApprove = async () => {
        if (!classId) return

        dispatch(changeStateFetching(true))

        await ClassService.updateClass(classId, {
            created_approval: true
        }).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    const toggleSuspend = async () => {
        if (!classId) return

        dispatch(changeStateFetching(true))

        await ClassService.updateClass(classId, {
            is_banned: !info.is_banned
        }).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    // Handler
    const refresh = async () => {
        dispatch(changeStateFetching(true))
        const data = await ClassService.getMembers(1, memberSizePage, search, roleSearch).finally(() => {
            dispatch(changeStateFetching(false))
        })

        if (data) dispatch(currentClass_SetMembers(data))

    }

    const changePage = (pagination: "prev" | "next") => {
        if (page < Number(paginationMembers.totalPage) && pagination === "next") {
            setPage((prev) => prev + 1)
        }

        if (page > 1 && pagination === "prev") {
            setPage((prev) => prev - 1)
        }
    }

    const handleDeleClass = () => {
        if (!classId) return

        confirmDialog({
            header: "Xác nhận xóa lớp học",
            message: <div className="">
                <p>Bạn đang thực hiện hành động xóa lớp học. Các rủi ro <i><b><u>chắc chắn</u></b></i> sẽ xảy ra:</p>
                <ul className="ml-3.5 [&_li]:text-red [&_li]:font-semibold [&_li]:italic [&_li]:mt-1.5">
                    <li>- Dữ liệu lớp học không thể khôi phục.</li>
                    <li>- Các thông báo trong lớp sẽ xóa vĩnh viễn</li>
                    <li>- Các biểu mẫu và câu trả lời sẽ bị xóa vĩnh viễn</li>
                    <li>- Dữ liệu lớp học không thể khôi phục.</li>
                </ul>
                <p className="mt-3.5 italic font-bold">Bạn vẫn muốn tiếp tục xóa lớp học?</p>
            </div>,
            acceptLabel: "Tiếp tục xóa",
            rejectLabel: "Hủy",
            accept: async () => {
                dispatch(changeStateFetching(true))

                await ClassService.removeClass(classId, userData.id).finally(() => {
                    dispatch(changeStateFetching(false))
                })
            }

        })

    }

    return (
        <div className="w-full h-full flex flex-col gap-5 py-mainTwoSidePadding">
            {/* Header */}
            <div className="w-full h-fit flex justify-between items-center-safe">
                <div className="flex gap-3.5">
                    <span className="">
                        <h1 className="text-hugeSize font-semibold dark:text-white line-clamp-1">{info.label || "Chi tiết lớp học"}</h1>
                        <span className="flex items-center-safe gap-3.5">
                            <p className="text-normalSize text-mainColor"><b className="text-gray">Mã lớp:</b> {info.join_code}</p>
                            <div className="w-4 aspect-square rounded-full bg-mainColor"></div>
                            <p className="text-normalSize text-mainColor"><b className="text-gray">Môn học:</b> {info.subject}</p>
                        </span>
                    </span>

                    {info.is_banned && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 fill-red">
                            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                        </svg>
                    )}

                </div>

                <div className="flex gap-2.5">
                    {!info.created_approval && (
                        <button className="px-5 py-2 bg-mainColor text-white rounded-normal font-semibold disableState hoverBtn" disabled={isFetching} onClick={handleApprove}>Duyệt lớp</button>
                    )}

                    {info.is_banned ? (
                        <button className="px-5 py-2 border-[0.5px] border-lightGray dark:border-gray rounded-normal dark:text-white disableState hoverBtn" disabled={isFetching} onClick={toggleSuspend}>Khôi phục hoạt động</button>
                    ) : (
                        <button className="px-5 py-2 bg-orangedRGB text-oranged rounded-normal disableState hoverBtn" disabled={isFetching} onClick={toggleSuspend}>Đình chỉ hoạt động</button>
                    )}

                    <button className="px-5 py-2 bg-redRGB text-red rounded-normal disableState hoverBtn" disabled={isFetching} onClick={handleDeleClass}>Xóa lớp</button>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-5">
                <span className="flex-1 flex items-center-safe justify-between px-7 py-3.5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-small dark:bg-black/20">
                    <span className="">
                        <h4 className="text-normalSize text-gray">Sinh viên</h4>
                        <p className="text-largeSize font-semibold dark:text-white">{info.counts.student}</p>
                    </span>

                    <span className="h-fit aspect-square bg-lightGray dark:bg-white/10 p-3 rounded-normal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A57.43 57.43 0 0 1 12 15.75a57.43 57.43 0 0 1 5.25-4.425V15" />
                        </svg>
                    </span>
                </span>

                <span className="flex-1 flex items-center-safe justify-between px-7 py-3.5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-small dark:bg-black/20">
                    <span className="">
                        <h4 className="text-normalSize text-gray">Giảng viên</h4>
                        <p className="text-largeSize font-semibold dark:text-white">{info.counts.lecturer}</p>
                    </span>

                    <span className="h-fit aspect-square bg-lightGray dark:bg-white/10 p-3 rounded-normal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                        </svg>
                    </span>
                </span>

                <span className="flex-1 flex items-center-safe justify-between px-7 py-3.5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-small dark:bg-black/20">
                    <span className="">
                        <h4 className="text-normalSize text-gray">Hội đồng</h4>
                        <p className="text-largeSize font-semibold dark:text-white">{info.counts.committee}</p>
                    </span>

                    <span className="h-fit aspect-square bg-lightGray dark:bg-white/10 p-3 rounded-normal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                    </span>
                </span>

                <span className="flex-1 flex items-center-safe justify-between px-7 py-3.5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-small dark:bg-black/20">
                    <span className="">
                        <h4 className="text-normalSize text-gray">Chờ duyệt</h4>
                        <p className="text-largeSize font-semibold dark:text-white">{info.counts.pending}</p>
                    </span>
                    <span className="h-fit aspect-square bg-lightGray dark:bg-white/10 p-3 rounded-normal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </span>
                </span>
            </div>

            {/* Info and Members */}
            <div className="w-full flex gap-5">
                {/* Left: Info */}
                <div className="w-1/4 flex flex-col gap-5">
                    <div className="p-5 border-[0.5px] border-lightGray dark:border-gray rounded-normal flex flex-col gap-4">
                        <h3 className="font-bold dark:text-white uppercase text-mobile-smallSize text-gray tracking-widest">Thông tin quản lý</h3>

                        <div className="flex flex-col gap-3">
                            <div className="">
                                <p className="text-mobile-smallSize text-gray uppercase tracking-widest">Người tạo</p>
                                <div className="flex items-center-safe gap-3 mt-2">
                                    <span className="w-10 h-10 rounded-full bg-lightGray dark:bg-white/10 flex items-center justify-center font-bold dark:text-white">
                                        {getShortName(info.createdBy?.full_name || "")}
                                    </span>
                                    <div className="">
                                        <p className="font-semibold dark:text-white leading-tight">{info.createdBy?.full_name}</p>
                                        <p className="text-sm text-gray">{info.createdBy?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <p className="text-mobile-smallSize text-gray uppercase tracking-widest">Chủ phòng</p>
                                <div className="flex items-center-safe gap-3 mt-2">
                                    <span className="w-10 h-10 rounded-full bg-mainColor text-white flex items-center justify-center font-bold">
                                        {getShortName(info.owner?.full_name || "")}
                                    </span>
                                    <div className="">
                                        <p className="font-semibold dark:text-white leading-tight">{info.owner?.full_name}</p>
                                        <p className="text-sm text-gray">{info.owner?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t-[0.5px] border-lightGray dark:border-gray pt-4 flex flex-col gap-2">
                            <p className="text-sm text-gray flex justify-between">Ngày tạo: <span className="text-black dark:text-white font-medium">{formatVNTime(info.created_at)}</span></p>
                            <p className="text-sm text-gray flex justify-between">Cập nhật: <span className="text-black dark:text-white font-medium">{formatVNTime(info.updated_at)}</span></p>
                        </div>
                    </div>

                    <div className="p-5 border-[0.5px] border-lightGray dark:border-gray rounded-normal">
                        <h3 className="font-bold dark:text-white uppercase text-mobile-smallSize text-gray tracking-widest mb-3">Mô tả lớp học</h3>
                        <p className="text-normalSize text-gray italic">"{info.description || "Chưa có mô tả"}"</p>
                    </div>
                </div>

                {/* Right: Members List */}
                <div className="flex-1 flex flex-col gap-2.5">

                    <div className="flex-1 flex flex-col gap-2.5">
                        <div className="sticky top-0 z-10 left-0 w-full bg-bgLight dark:bg-bgDark flex flex-col gap-5 py-5">
                            <div className="flex items-center-safe gap-5">
                                <button className="h-fit aspect-square p-2.5 flex justify-center-safe items-center-safe border-[0.5px] border-lightGray rounded-full hoverBtn disableState" disabled={isFetching} onClick={refresh}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3.5 dark:stroke-white max-sm:size-3.5 stroke-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>

                                <span className="relative flex-1 flex items-center-safe w-1/2 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>

                                    <input type="text" className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white disableState"
                                        placeholder="Tìm kiếm tên hoặc gmail..."
                                        disabled={isFetching}
                                        onChange={(e) => { setSearch(e.target.value) }}
                                    />
                                    <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px"></span>
                                </span>

                                {/* {isFetching && <ScaleLoader height={10} width={4} color="#499c40" />} */}

                                <span className="flex items-center-safe gap-1.5">
                                    <p className="font-bold dark:text-white">Vai trò</p>

                                    <select
                                        className="w-48 border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white max-sm:text-mobile-smallSize max-sm:w-full hover:cursor-pointer disableState"
                                        disabled={isFetching}
                                        onChange={(e) => { setRoleSearch(e.target.value) }}
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="roomadmin">Quản trị viên</option>
                                        <option value="lecturer">Giảng viên</option>
                                        <option value="student">Sinh viên</option>
                                    </select>
                                </span>
                            </div>

                            <div className="flex">
                                <span className="flex gap-1.5 items-center-safe">
                                    <p className="font-bold dark:text-white">Số lượng:</p>
                                    <p className="dark:text-white">thành viên</p>
                                </span>

                                <span className="flex-1 flex justify-end-safe items-center-safe gap-1.5">
                                    <p className="font-medium mr-3.5 dark:text-white max-sm:text-mobile-smallSize">Trang {page}</p>

                                    <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn disableState" disabled={isFetching || page <= 1} onClick={() => { changePage("prev") }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>

                                    <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn disableState" disabled={isFetching || page >= Number(paginationMembers.totalPage)} onClick={() => { changePage("next") }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </span>

                            </div>
                        </div>

                        <div className="border-[0.5px] border-lightGray dark:border-gray rounded-normal overflow-hidden">
                            <table className="w-full bg-transparent">
                                <colgroup>
                                    <col className="w-[40%]" />
                                    <col className="w-[15%]" />
                                    <col className="w-[20%]" />
                                    <col className="w-[25%]" />
                                </colgroup>

                                <thead className="bg-lightGray/50 dark:bg-white/5">
                                    <tr className="">
                                        <th className="text-left px-5 py-3 dark:text-white text-sm uppercase tracking-wider">Họ tên</th>
                                        <th className="text-left dark:text-white text-sm uppercase tracking-wider">Trạng thái</th>
                                        <th className="text-left dark:text-white text-sm uppercase tracking-wider">Vai trò</th>
                                        <th className="text-left dark:text-white text-sm uppercase tracking-wider">Ngày tham gia</th>
                                    </tr>
                                </thead>

                                <tbody className="">
                                    {Object.values(members.data).flat().map((member, index) => (
                                        <tr key={index} className="border-t-[0.5px] border-lightGray dark:border-lightGray hover:bg-lighterGray dark:hover:bg-white/5 hover:cursor-pointer">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center-safe gap-3">
                                                    <span className="w-9 h-9 rounded-full bg-lightGray dark:bg-white/10 flex items-center justify-center font-bold text-mobile-smallSize dark:text-white">
                                                        {getShortName(member.user.full_name)}
                                                    </span>

                                                    <div className="">
                                                        <p className="font-semibold dark:text-white text-[15px]">{member.user.full_name}</p>
                                                        <p className="text-mobile-smallSize text-gray">{member.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5">
                                                {member.roomadmin_approved ?
                                                    member.is_banned ? <p className="text-red font-bold text-mobile-smallSize">Đình chỉ</p> : <p className="text-mainColor font-bold text-mobile-smallSize">Hoạt động</p>
                                                    :
                                                    <p className="text-oranged font-bold text-mobile-smallSize">Chờ duyệt</p>
                                                }
                                            </td>

                                            <td className="dark:text-white text-[14px]">
                                                <span className={`px-2.5 py-0.5 rounded-small text-mobile-smallSize font-bold`}>
                                                    {VNRoleName[member.role]}
                                                </span>
                                            </td>

                                            <td className="text-gray text-[14px]">{formatVNTime(member.joined_at).split(",")[0]}</td>
                                        </tr>
                                    ))}
                                    {Object.values(members.data).flat().length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center text-gray italic">Không có thành viên nào trong mục này</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SAClassDetail
