import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import CommitteeService from "../../../services/committee/committee.service"
import { ClassService } from "../../../services/class/class.service"
import ProgressService from "../../../services/progress/progress.service"
import type { Committee } from "../../../services/committee/committee.type"
import { VNCommitteeRole } from "../../../config/enum"
import { ScaleLoader } from "react-spinners"
import { currentClass_SetMembers } from "../../../redux/reducers/classSlice.reducer"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import formatVNTime from "../../../utils/formatVNTime"

const RACommittee = () => {
    const dispatch = useDispatch()
    const classData = useSelector((state: RootState) => state.class.currentClass.info)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const [committee, setCommittee] = useState<Committee | null>(null)


    // Load data on mount
    useEffect(() => {
        (async () => {
            if (!classData.id) return
            dispatch(changeStateFetching(true))

            const committeeData = await CommitteeService.getByClassId(classData.id).finally(() => {
                dispatch(changeStateFetching(false))
            })

            if (committeeData) setCommittee(committeeData)
        })()
    }, [classData.id])

    return (
        <div className="w-full h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">Thông tin Hội đồng</h1>

                {isFetching && (
                    <div className="mb-4 p-3 bg-gray-50 border rounded-lg text-center">
                        <ScaleLoader color="#4F46E5" height={20} />
                        <p className="text-sm text-gray-600 mt-2">Đang tải dữ liệu...</p>
                    </div>
                )}

                {/* Info banners */}
                <div className="mb-5 p-3 bg-orangedRGB rounded-lg  flex items-center-safe gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-oranged">
                        <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                        <path fill-rule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clip-rule="evenodd" />
                    </svg>

                    <p className="text-oranged italic font-medium">Chỉ Quản trị viên hệ thống (Khoa) mới có quyền thành lập và thay đổi hội đồng.</p>
                </div>

                <span className="flex items-center-safe gap-2.5 mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-mainColor">
                        <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                        <path fill-rule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clip-rule="evenodd" />
                    </svg>

                    <p className="text-mainColor italic font-medium">GVHD của sinh viên trong lớp không thể tham gia hội đồng theo quy định</p>
                </span>

                {/* Current committee */}
                {committee ? (
                    <div className="mb-6 p-8 bg-white dark:bg-lightDark rounded-big border border-lightGray dark:border-gray shadow-sm">
                        <div className="flex items-center justify-between mb-6 border-b pb-4 dark:border-gray/30">
                            <span className="">
                                <h3 className="font-bold text-xl dark:text-white">Hội đồng hiện tại</h3>
                                <span className="px-3 py-1 bg-mainColor/10 text-mainColor text-xs font-bold rounded-full uppercase">
                                    Giai đoạn: {committee.milestone.label}
                                </span>
                            </span>

                            <p className="dark:text-white"><b className="dark:text-white">Cập nhật: </b>{formatVNTime(committee.updated_at)}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {committee.members.map(m => (
                                <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl border border-lightGray dark:border-gray/30 bg-gray-50/50 dark:bg-dark/30">
                                    <div className="size-12 rounded-full bg-mainColor flex items-center justify-center text-white font-bold text-lg">
                                        {m.user.full_name.charAt(0)}
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <p className="font-bold text-normalSize dark:text-white">{m.user.full_name}</p>
                                        <p className="text-tinySize text-gray dark:text-gray">{VNCommitteeRole[m.role]}</p>
                                        <p className="text-[10px] text-gray italic">{m.user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-10 border-2 border-dashed border-lightGray dark:border-gray rounded-big text-center">
                        <p className="text-gray italic">Chưa có hội đồng nào được thành lập cho lớp học này.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RACommittee
