import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import uniqolor from 'uniqolor'
import { ClassService } from "../../../services/class/class.service"
import type { Members } from "../../../services/class/class.type"
import getShortName from "../../../utils/getShortName"
import formatVNTime from "../../../utils/formatVNTime"
import { useDebounce } from "../../../hooks/Debounce"
import { currentClass_SetMembers, currentClass_UpdateMember } from "../../../redux/reducers/classSlice.reducer"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { confirmDialog } from "primereact/confirmdialog"
import { ScaleLoader } from "react-spinners"
import RAUpdateUserForm from "../../components/RAUpdateUserForm"
import { memberSizePage } from "../../../config/pageSize"

interface MemberCard {
    memberData: Members,
    onDoubleClick?: (e: React.MouseEvent) => void
}

const MemberPendingCard: React.FC<MemberCard> = ({ memberData }) => {
    const uniqolorRandom = uniqolor(memberData.user.email)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const classData = useSelector((state: RootState) => state.class.currentClass.info)
    const dispatch = useDispatch()

    // Handler
    const handleApprove = async () => {
        dispatch(changeStateFetching(true))

        const userUpdate = await ClassService.updateMember(classData.id, memberData.user.id, {
            roomadmin_approved: true,
            role: "student"
        }).finally(() => {
            dispatch(changeStateFetching(false))
        })

        if (userUpdate) dispatch(currentClass_UpdateMember(userUpdate))
    }

    const handleApproveLecturer = async () => {
        confirmDialog({
            header: "Xác nhận giảng viên",
            message: <p><b className="text-red">{memberData.user.email}</b> sẽ trở thành <b className="text-red">Giảng Viên</b></p>,

            acceptLabel: "Tiếp tục",
            rejectLabel: "Hủy",

            accept: async () => {
                dispatch(changeStateFetching(true))

                const userUpdate = await ClassService.updateMember(classData.id, memberData.user.id, {
                    roomadmin_approved: true,
                    role: "lecturer"
                }).finally(() => {
                    dispatch(changeStateFetching(false))
                })

                if (userUpdate) dispatch(currentClass_UpdateMember(userUpdate))
            }
        })
    }

    const handleRemovePending = async () => {
        dispatch(changeStateFetching(true))

        await ClassService.removeMember(memberData.user.id, classData.id).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    return (
        <div className="gap-2.5 flex flex-col justify-between shadow-[0_0_20px_rgba(128,128,128,0.25)] hover:shadow-[0_0_10px_2px_rgba(128,128,128,0.75)] hoverBtn rounded-normal px-3.5 py-5">

            <div className="w-full flex items-center-safe gap-2.5">
                <span className={`h-12 aspect-square rounded-full bg-mainColor flex items-center-safe justify-center-safe text-normalSize ${uniqolorRandom.isLight ? "text-darkGray" : "text-white"}`} style={{ backgroundColor: uniqolorRandom.color }}>
                    {getShortName(memberData.user.full_name)}
                </span>

                <span className="flex-1 flex flex-col">
                    <p className="font-bold dark:text-white">{memberData.user.full_name}</p>
                    <p className="text-gray text-smallSize">{memberData.user.email}</p>
                </span>
            </div>

            <div className="flex flex-col gap-2.5 mt-3.5">
                <p className="text-gray text-smallSize font-medium">Gửi lúc: {formatVNTime(memberData.created_at)}</p>

                <span className="flex items-center-safe gap-2.5">
                    <button className="bg-mainColorRGB text-mainColor px-2.5 py-1 rounded-small hoverBtn disableState" disabled={isFetching} onClick={handleApproveLecturer}>Chỉ định giảng viên</button>
                    <button className="bg-mainColorRGB text-mainColor px-2.5 py-1 rounded-small hoverBtn disableState" disabled={isFetching} onClick={handleApprove}>Duyệt</button>
                    <button className="bg-redRGB text-red px-2.5 py-1 rounded-small hoverBtn disableState" disabled={isFetching} onClick={handleRemovePending}>Xóa</button>
                </span>
            </div>
        </div>
    )
}

const MemberCard: React.FC<MemberCard> = ({ memberData, onDoubleClick }) => {
    const uniqolorRandom = uniqolor(memberData.user.email)
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const classData = useSelector((state: RootState) => state.class.currentClass.info)
    const dispatch = useDispatch()

    // Handler
    const handleSuspend = async (banned: boolean) => {
        confirmDialog({
            header: `Xác nhận ${banned ? "đình chỉ hoạt động" : "khôi phục hoạt động"}`,
            message: <p><b className="text-red">{memberData.user.email}</b> sẽ {banned ? "bị tạm ngưng hoạt động" : "được khôi phục hoạt động"} trong lớp học.</p>,

            acceptLabel: "Tiếp tục",
            rejectLabel: "Hủy",

            accept: async () => {
                dispatch(changeStateFetching(true))

                const userUpdate = await ClassService.updateMember(classData.id, memberData.user.id, {
                    is_banned: banned,
                }).finally(() => {
                    dispatch(changeStateFetching(false))
                })

                if (userUpdate) dispatch(currentClass_UpdateMember(userUpdate))
            }
        })
    }

    const handleRemoveMember = async () => {
        confirmDialog({
            header: `Xác nhận xóa`,
            message: <p>Bạn đang xóa <b className="text-red">{memberData.user.email}</b> khỏi lớp học</p>,

            acceptLabel: "Tiếp tục",
            rejectLabel: "Hủy",

            accept: async () => {
                dispatch(changeStateFetching(true))

                const userUpdate = await ClassService.removeMember(memberData.user.id, classData.id).finally(() => {
                    dispatch(changeStateFetching(false))
                })

                if (userUpdate) dispatch(currentClass_UpdateMember(userUpdate))
            }
        })
    }

    return (
        <div className={`flex flex-col gap-2.5 shadow-[0_0_20px_rgba(128,128,128,0.25)] hover:shadow-[0_0_10px_2px_rgba(128,128,128,0.75)] hoverBtn rounded-normal ${memberData.is_banned && "bg-redRGB"} px-3.5 py-5`} onDoubleClick={onDoubleClick}>
            <div className="flex items-start gap-2.5">
                <span className={`h-12 aspect-square rounded-full bg-mainColor flex items-center-safe justify-center-safe text-normalSize ${uniqolorRandom.isLight ? "text-darkGray" : "text-white"}`} style={{ backgroundColor: uniqolorRandom.color }}>
                    {getShortName(memberData.user.full_name)}
                </span>

                <span className="flex-1 flex flex-col">
                    <span className="flex items-center-safe gap-1.5">
                        <p className="font-bold dark:text-white">{memberData.user.full_name}</p>

                        {memberData.is_banned ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-red">
                                <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                            </svg>

                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-mainColor">
                                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                        )}
                    </span>

                    <p className="text-gray text-smallSize">{memberData.user.email}</p>
                </span>
            </div>

            <div className="flex items-center-safe justify-between mt-3.5">
                <p className="text-gray text-smallSize">Tham gia: {formatVNTime(memberData.joined_at)}</p>

                {userData.id != memberData.user.id && (
                    <span className="flex items-center-safe gap-2.5">
                        {memberData.is_banned ? (
                            <button className="bg-redRGB text-red px-2.5 py-1 rounded-small hoverBtn disableState" disabled={isFetching} onClick={() => { handleSuspend(false) }}>Khôi phục</button>
                        ) : (
                            <>
                                <button className="bg-orangedRGB text-oranged px-2.5 py-1 rounded-small hoverBtn disableState" disabled={isFetching} onClick={() => { handleSuspend(true) }}>Đình chỉ</button>
                                <button className="bg-redRGB text-red px-2.5 py-1 rounded-small hoverBtn disableState" disabled={isFetching} onClick={() => { handleRemoveMember() }}>Xóa</button>
                            </>
                        )}
                    </span>
                )}
            </div>
        </div>
    )
}

const RAMembers: React.FC = () => {
    const userData = useSelector((state: RootState) => state.auth.user.info)
    const classMembers = useSelector((state: RootState) => state.class.currentClass.members)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const paginationMembers = useSelector((state: RootState) => state.class.currentClass.members.pagination)
    const [permissionUpdateMember, setPermissionUpdateMember] = useState<Members>({} as Members)

    const dispatch = useDispatch()

    const [page, setPage] = useState<number>(1)
    const [search, setSearch] = useState<string>("")
    const [roleSearch, setRoleSearch] = useState<string>("")
    const searchDebounce = useDebounce(search, 1500)

    const [isUpdateMember, setIsUpdateMember] = useState<boolean>(false)

    useEffect(() => {
        if (!userData.id) return

        (async () => {
            dispatch(changeStateFetching(true))

            const data = await ClassService.getMembers(page, memberSizePage, search, roleSearch).finally(() => {
                dispatch(changeStateFetching(false))
            })

            if (data) dispatch(currentClass_SetMembers(data))
        })()
    }, [userData.id, searchDebounce, page])

    // Toggle
    const toggleUpdateMember = () => {
        setIsUpdateMember(!isUpdateMember)
    }

    const updateMember = (member: Members) => (e: React.MouseEvent) => {
        e.preventDefault()

        if (member.is_banned) return
        setPermissionUpdateMember(member)
        toggleUpdateMember()
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
        alert()
        if (page < Number(paginationMembers.totalPage) && pagination === "next") {
            setPage((prev) => prev + 1)
        }

        if (page > 1 && pagination === "prev") {
            setPage((prev) => prev - 1)
        }
    }

    if (!classMembers.data) return null
    return (
        <div className="w-full flex flex-col gap-5 py-mainTwoSidePadding">
            {classMembers.data.pending.length > 0 && (
                <div className="w-full h-fit flex flex-col gap-2.5">
                    <h3 className="text-mediumSize font-semibold dark:text-white">Chờ duyệt ({classMembers.data.pending.length})</h3>

                    <div className="w-full h-fit grid grid-cols-3 gap-5 px-2.5">
                        {classMembers.data.pending.map((mp) => {
                            return <MemberPendingCard key={mp.id} memberData={mp} />
                        })}
                    </div>
                </div>
            )}

            <div className="w-full flex flex-col gap-5">
                <div className="sticky top-0 z-10 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center-safe gap-5 py-5">
                    <button className="h-full aspect-square p-1.5 border-[0.5px] border-lightGray rounded-full hoverBtn disableState" disabled={isFetching} onClick={refresh}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>

                    <span className="relative flex items-center-safe w-1/2 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>

                        <input type="text" className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white disableState"
                            disabled={isFetching}
                            placeholder="Tìm kiếm tên hoặc gmail..."
                            onChange={(e) => { setSearch(e.target.value) }}
                        />
                        <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px"></span>
                    </span>

                    {isFetching && <ScaleLoader height={10} width={4} color="#499c40" />}

                    <span className="flex items-center-safe gap-1.5">
                        <p className="font-bold dark:text-white">Vai trò</p>

                        <select
                            className="w-48 border-[0.5px] border-lightGray dark:border-darkGray px-2.5 py-1.5 rounded-small dark:text-white max-sm:text-mobile-smallSize max-sm:w-full hover:cursor-pointer disableState"
                            disabled={isFetching}
                            onChange={(e) => { setRoleSearch(e.target.value) }}
                        >
                            <option value="">Tất cả</option>
                            <option value="roomadmin">Quản trị viên</option>
                            <option value="lecturer">Giảng viên</option>
                            <option value="student">Sinh viên</option>
                        </select>
                    </span>

                    <span className="flex gap-1.5 items-center-safe">
                        <p className="font-bold dark:text-white">Số lượng:</p>
                        <p className="dark:text-white">{Object.values(classMembers.data).flatMap(m => m).length - Object.values(classMembers.data.pending).length} thành viên</p>
                    </span>

                    <span className="flex-1 flex justify-end-safe items-center-safe gap-1.5">
                        <p className="font-medium mr-3.5 dark:text-white max-sm:text-mobile-smallSize">Trang {paginationMembers.page}/{paginationMembers.totalPage}</p>

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

                <div className="px-2.5">
                    <span className="flex items-center-safe gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-mainColor">
                            <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                            <path fill-rule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clip-rule="evenodd" />
                        </svg>

                        <p className="text-mainColor italic font-medium">Bấm hai lần vào thành viên để cập nhật thông tin của họ</p>
                    </span>
                </div>

                <div className="w-full h-fit flex flex-col gap-5 px-2.5">
                    {classMembers.data.roomadmin.length > 0 && (
                        <div className="w-full h-fit flex flex-col gap-2.5">
                            <h3 className="text-mediumSize font-semibold dark:text-white">Quản trị viên ({classMembers.data.roomadmin.length})</h3>

                            <div className="w-full h-fit grid grid-cols-3 gap-5">
                                {classMembers.data.roomadmin.map((roomadmin) => {
                                    return <MemberCard key={roomadmin.id} memberData={roomadmin} />
                                })}
                            </div>
                        </div>
                    )}

                    {classMembers.data.lecturer.length > 0 && (
                        <div className="w-full h-fit flex flex-col gap-2.5">
                            <h3 className="text-mediumSize font-semibold dark:text-white">Giảng viên ({classMembers.data.lecturer.length})</h3>

                            <div className="w-full h-fit grid grid-cols-3 gap-5">
                                {classMembers.data.lecturer.map((lecturer) => {
                                    return <MemberCard key={lecturer.id} memberData={lecturer} onDoubleClick={updateMember(lecturer)} />
                                })}
                            </div>
                        </div>
                    )}

                    {classMembers.data.student.length > 0 && (
                        <div className="w-full h-fit flex flex-col gap-2.5">
                            <h3 className="text-mediumSize font-semibold dark:text-white">Sinh viên ({classMembers.data.student.length})</h3>

                            <div className="w-full h-fit grid grid-cols-3 gap-5">
                                {classMembers.data.student.map((student) => {
                                    return <MemberCard key={student.id} memberData={student} onDoubleClick={updateMember(student)} />
                                })}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {isUpdateMember && <RAUpdateUserForm toggleForm={toggleUpdateMember} memberData={permissionUpdateMember} />}
        </div>
    )
}

export default RAMembers