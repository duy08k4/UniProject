import type React from "react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import CommitteeService from "../../../services/committee/committee.service"
import type { Committee } from "../../../services/committee/committee.type"
import { VNCommitteeRole } from "../../../config/enum"
import { ScaleLoader } from "react-spinners"

const LTCommittee: React.FC = () => {
    const classData = useSelector((state: RootState) => state.class.currentClass.info)
    const [loading, setLoading] = useState(false)
    const [committee, setCommittee] = useState<Committee | null>(null)

    useEffect(() => {
        loadCommittee()
    }, [classData.id])

    const loadCommittee = async () => {
        setLoading(true)
        const result = await CommitteeService.getByClassId(classData.id)
        setLoading(false)

        if (result) {
            setCommittee(result)
        }
    }

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <ScaleLoader color="#4F46E5" />
            </div>
        )
    }

    return (
        <div className="w-full h-fit flex flex-col gap-8 py-mainTwoSidePadding">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-hugeSize font-bold dark:text-white leading-tight">Hội đồng khóa luận</h1>
                <p className="text-normalSize text-gray dark:text-gray font-medium">Thông tin hội đồng đánh giá khóa luận</p>
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
