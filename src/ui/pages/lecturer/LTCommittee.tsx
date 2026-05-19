import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import CommitteeService from "../../../services/committee/committee.service"
import type { Committee } from "../../../services/committee/committee.type"
import { VNCommitteeRole } from "../../../config/enum"
import { ScaleLoader } from "react-spinners"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"

const LTCommittee: React.FC = () => {
    const classData = useSelector((state: RootState) => state.class.currentClass.info)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [committee, setCommittee] = useState<Committee | null>(null)

    useEffect(() => {
        loadCommittee()
    }, [classData.id])

    const loadCommittee = async () => {
        setLoading(true)

        dispatch(changeStateFetching(true))
        const result = await CommitteeService.getByClassId(classData.id).finally(() => {
            dispatch(changeStateFetching(false))
        })
        setLoading(false)

        if (result) {
            setCommittee(result)
        }
    }

    return (
        <div className="w-full h-fit flex flex-col gap-8 py-mainTwoSidePadding">
            {/* Header */}
            <div className="flex justify-between items-center-safe">
                <span className="flex flex-col gap-1">
                    <h1 className="text-hugeSize font-bold dark:text-white leading-tight">Hội đồng khóa luận</h1>
                    <p className="text-normalSize text-gray dark:text-gray font-medium">Thông tin hội đồng đánh giá khóa luận</p>
                </span>

                <span className="flex items-center-safe gap-2.5">
                    {loading && <ScaleLoader height={10} width={4} color="#499C40" />}

                    <button onClick={loadCommittee} disabled={isFetching}
                        className="flex items-center gap-2.5 px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-small hoverBtn disableState">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>

                        <p className="dark:text-white">Làm mới</p>
                    </button>

                </span>
            </div>


            {/* Content */}
            {!committee ? (
                <div className="p-8 bg-gray-50 dark:bg-lightDark rounded-lg text-center">
                    <p className="text-gray dark:text-gray">Chưa có hội đồng cho lớp này</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* Milestone info */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            Cột mốc: {committee.milestone.label}
                        </p>
                    </div>

                    {/* Members */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {committee.members.map((member) => (
                            <div key={member.id} className="p-6 bg-white dark:bg-lightDark rounded-big border border-lightGray dark:border-gray hover:border-mainColor/30 transition-all shadow-sm flex flex-col items-center text-center gap-4">
                                <div className="size-20 rounded-full bg-mainColorRGB flex items-center justify-center text-mainColor text-hugeSize font-bold">
                                    {member.user.full_name.charAt(0)}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-normalSize font-bold dark:text-white">{member.user.full_name}</h3>
                                    <span className="px-3 py-1 bg-mainColor/10 text-mainColor text-tinySize font-bold rounded-full uppercase tracking-wider">
                                        {VNCommitteeRole[member.role]}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1 text-smallSize font-light">
                                    <p className="text-gray dark:text-gray italic">{member.user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LTCommittee
