import type React from "react"
import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { PublicService } from "../../services/public/public.service"
import { VNThesisType } from "../../config/enum"
import formatVNTime from "../../utils/formatVNTime"

const ProjectDetail: React.FC = () => {
    const navigate = useNavigate()
    const { "project-id": projectId } = useParams()
    const thesis = useSelector((state: RootState) => state.thesis.currentThesis)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        if (projectId) PublicService.getOneThesis(projectId)
    }, [projectId])

    useEffect(() => {
        if (thesis && iframeRef.current) {
            iframeRef.current.focus()
        }
    }, [thesis])

    return (
        <div className="h-full w-full flex flex-col px-twoSidePadding pt-topPadding gap-5 dark:bg-bgDark max-sm:px-5">
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="w-fit flex items-center gap-2.5 px-5 py-2.5 shadow-[0_0_12px_rgba(0,0,0,0.25)] rounded-normal hover:cursor-pointer dark:bg-white max-sm:text-smallSize"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 max-sm:size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Quay lại
                </button>
            </div>

            {!thesis ? (
                <p className="text-center text-gray py-20">Đang tải...</p>
            ) : (
                <>
                    <div className="w-full h-fit flex gap-20 justify-between items-center max-sm:flex-col">
                        <span className="w-full flex flex-col gap-2.5">
                            <h1 className="text-bigSize font-medium dark:text-white max-sm:text-bigSize uppercase">
                                {thesis.title}
                            </h1>
                            <span className="flex items-center gap-2.5 max-sm:flex-col max-sm:items-start">
                                <p className="dark:text-white max-sm:text-smallSize">
                                    <b>Ngày nộp</b>: {thesis.submitted_at ? formatVNTime(thesis.submitted_at).split(",")[0] : "N/A"}
                                </p>
                                <span className="h-2 aspect-square rounded-full bg-mainColor max-sm:hidden" />
                                <p className="dark:text-white max-sm:text-smallSize">{thesis.student_name ?? "N/A"}</p>
                                {thesis.supervisor_name && (
                                    <>
                                        <span className="h-2 aspect-square rounded-full bg-mainColor max-sm:hidden" />
                                        <p className="dark:text-white max-sm:text-smallSize">GVHD: {thesis.supervisor_name}</p>
                                    </>
                                )}
                                <span className="h-2 aspect-square rounded-full bg-mainColor max-sm:hidden" />
                                <p className="dark:text-white max-sm:text-smallSize">
                                    {thesis.thesis_type ? VNThesisType[thesis.thesis_type] ?? thesis.thesis_type : "N/A"}
                                </p>
                            </span>
                        </span>

                        <span className="w-fit flex gap-2.5 max-sm:w-full">
                            {thesis.outline_file_url && (
                                <a
                                    href={thesis.outline_file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="py-2.5 bg-mainColor rounded-small text-white px-5 hover:cursor-pointer max-sm:text-smallSize text-nowrap"
                                >
                                    Xem đề cương
                                </a>
                            )}
                        </span>
                    </div>

                    <div className="flex-1 flex gap-5 min-h-[70vh]">
                        <div className="h-full flex-1">
                            <iframe
                                ref={iframeRef}
                                src={thesis.file_url}
                                className="w-full h-full border-0 rounded-normal"
                                title={thesis.title ?? "Project Document"}
                                tabIndex={0}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ProjectDetail
