import type React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import formatVNTime from "../../../utils/formatVNTime"
import { NavLink, useParams } from "react-router-dom"
import { ClassService } from "../../../services/class/class.service"

const RAOverview: React.FC = () => {
    const classInfo = useSelector((state: RootState) => state.class.currentClass.info)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const { classId } = useParams()

    return (
        <div className="w-full h-fit flex flex-col gap-10 pt-topPadding">
            {/* Class info card */}
            <div className="flex flex-col gap-5 p-7 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-hugeSize font-bold dark:text-white uppercase">{classInfo.label}</h2>
                        <p className="text-gray font-medium dark:text-gray/80">{classInfo.subject}</p>
                    </div>

                    <button onClick={() => classId && ClassService.getClass(classId)} disabled={isFetching}
                        className="flex items-center gap-2 px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-small hoverBtn disableState shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>

                        <p className="dark:text-white text-smallSize">Làm mới</p>
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1 border-t border-gray/10 pt-5">
                    <div className="flex flex-col gap-1">
                        <p className="text-smallSize text-gray dark:text-gray/60 italic font-medium">Mã tham gia:</p>
                        <p className="text-bigSize font-bold text-mainColor tracking-wider">{classInfo.join_code}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-smallSize text-gray dark:text-gray/60 italic font-medium">Người phụ trách:</p>
                        <p className="text-normalSize font-semibold dark:text-white">{classInfo.owner?.full_name || classInfo.createdBy.full_name}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-smallSize text-gray dark:text-gray/60 italic font-medium">Ngày khởi tạo:</p>
                        <p className="text-normalSize font-semibold dark:text-white">{classInfo.created_at ? formatVNTime(classInfo.created_at).split(',')[0] : "N/A"}</p>
                    </div>
                </div>

                {classInfo.description && (
                    <div className="flex flex-col gap-1 border-t border-gray/10 pt-5">
                        <p className="text-smallSize text-gray dark:text-gray/60 italic font-medium">Mô tả lớp học:</p>
                        <p className="text-normalSize dark:text-white leading-relaxed">{classInfo.description}</p>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-5 max-sm:grid-cols-1">
                <div className="flex flex-col gap-2.5 px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex justify-between items-center-safe">
                        <h4 className="text-gray font-medium dark:text-white">Thành viên</h4>
                        <NavLink to={`/main/roomadmin/class/${classId}/members`} className="text-mainColor text-smallSize underline italic">Chi tiết</NavLink>
                    </div>

                    <div className="flex items-center-safe gap-5">
                        <span className="flex items-center-safe gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-gray">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            <p className="text-[32px] font-bold dark:text-white">{Number(classInfo.counts.student) < 10 ? `0${classInfo.counts.student}` : classInfo.counts.student}</p>
                        </span>

                        <span className="flex items-center-safe gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-gray">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                            </svg>
                            <p className="text-[32px] font-bold dark:text-white">{Number(classInfo.counts.lecturer) < 10 ? `0${classInfo.counts.lecturer}` : classInfo.counts.lecturer}</p>
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex justify-between items-center-safe">
                        <h4 className="text-gray font-medium dark:text-white">Biểu mẫu</h4>
                        <NavLink to={`/main/roomadmin/class/${classId}/forms`} className="text-mainColor text-smallSize underline italic">Chi tiết</NavLink>
                    </div>

                    <div className="flex items-center-safe gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-gray">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        <p className="text-[32px] font-bold dark:text-white">{Number(classInfo.counts.forms) < 10 ? `0${classInfo.counts.forms}` : classInfo.counts.forms}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex justify-between items-center-safe">
                        <h4 className="text-gray font-medium dark:text-white">Cột mốc</h4>
                        <NavLink to={`/main/roomadmin/class/${classId}/progresses`} className="text-mainColor text-smallSize underline italic">Chi tiết</NavLink>
                    </div>

                    <div className="flex items-center-safe gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-gray">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p className="text-[32px] font-bold dark:text-white">{Number(classInfo.counts.milestones) < 10 ? `0${classInfo.counts.milestones}` : classInfo.counts.milestones}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2.5 px-7 py-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-normal dark:bg-lightDark">
                    <div className="flex justify-between items-center-safe">
                        <h4 className="text-gray font-medium dark:text-white">Yêu cầu chờ xử lý</h4>
                        <NavLink to={`/main/roomadmin/class/${classId}/members`} className="text-mainColor text-smallSize underline italic">Chi tiết</NavLink>
                    </div>

                    <div className="flex items-center-safe gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-gray">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                        
                        <p className="text-[32px] font-bold dark:text-white">{Number(classInfo.counts.pending) < 10 ? `0${classInfo.counts.pending}` : classInfo.counts.pending}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default RAOverview
