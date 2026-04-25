import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import CommitteeService from "../../../services/committee/committee.service"
import { ClassService } from "../../../services/class/class.service"
import ProgressService from "../../../services/progress/progress.service"
import type { Committee, CommitteeMember } from "../../../services/committee/committee.type"
import { CommitteeRole, VNCommitteeRole } from "../../../config/enum"
import { ScaleLoader } from "react-spinners"
import { currentClass_SetMembers } from "../../../redux/reducers/classSlice.reducer"
import { toast } from "sonner"

const RACommittee = () => {
    const dispatch = useDispatch()
    const classData = useSelector((state: RootState) => state.class.currentClass.info)
    const progress = useSelector((state: RootState) => state.progress.currentProgress)
    const membersData = useSelector((state: RootState) => state.class.currentClass.members)

    const [loading, setLoading] = useState(false)
    const [committee, setCommittee] = useState<Committee | null>(null)
    const [selectedMilestone, setSelectedMilestone] = useState("")
    const [chairman, setChairman] = useState("")
    const [reviewer, setReviewer] = useState("")
    const [member, setMember] = useState("")
    const [secretary, setSecretary] = useState("")

    // Get lecturers (exclude supervisors - simplified for now)
    const allMembers = membersData?.data ? Object.values(membersData.data).flat() : []
    const lecturers = allMembers.filter(m => m.role === "lecturer")
    const milestones = progress?.milestones || []

    // Load data on mount
    useEffect(() => {
        if (!classData.id) return
        loadData()
    }, [classData.id])

    const loadData = async () => {
        setLoading(true)

        // Load progress (includes milestones)
        await ProgressService.getProgressDetail(classData.id)

        // Load members
        const membersResult = await ClassService.getMembers(1, 100)
        if (membersResult && membersResult.data) {
            dispatch(currentClass_SetMembers(membersResult))
        }

        // Load committee
        const committeeResult = await CommitteeService.getByClassId(classData.id)
        if (committeeResult) {
            setCommittee(committeeResult)
            setSelectedMilestone(committeeResult.milestone.id)

            const chairmanMember = committeeResult.members.find(m => m.role === CommitteeRole.CHAIRMAN)
            const reviewerMember = committeeResult.members.find(m => m.role === CommitteeRole.REVIEWER)
            const memberMember = committeeResult.members.find(m => m.role === CommitteeRole.MEMBER)
            const secretaryMember = committeeResult.members.find(m => m.role === CommitteeRole.SECRETARY)

            if (chairmanMember) setChairman(chairmanMember.user.id)
            if (reviewerMember) setReviewer(reviewerMember.user.id)
            if (memberMember) setMember(memberMember.user.id)
            if (secretaryMember) setSecretary(secretaryMember.user.id)
        }

        setLoading(false)
    }

    const handleSave = async () => {
        if (!selectedMilestone || !chairman || !reviewer || !member) {
            return
        }

        // Validate: must have 3 different required roles
        const requiredMembers = [chairman, reviewer, member]
        const uniqueRequired = new Set(requiredMembers)

        if (uniqueRequired.size < 3) {
            toast.error("Chủ tịch, Ủy viên phản biện và Ủy viên phải là 3 người khác nhau")
            return
        }

        // Validate: secretary (if exists) must be different from required roles
        if (secretary && requiredMembers.includes(secretary)) {
            toast.error("Thư ký phải khác với Chủ tịch, Ủy viên phản biện và Ủy viên")
            return
        }

        const membersData: CommitteeMember[] = [
            { userId: chairman, role: CommitteeRole.CHAIRMAN },
            { userId: reviewer, role: CommitteeRole.REVIEWER },
            { userId: member, role: CommitteeRole.MEMBER },
        ]

        if (secretary) {
            membersData.push({ userId: secretary, role: CommitteeRole.SECRETARY })
        }

        setLoading(true)
        const result = await CommitteeService.upsert({
            classId: classData.id,
            milestoneId: selectedMilestone,
            members: membersData
        })
        setLoading(false)

        if (result) {
            setCommittee(result)
        }
    }

    const canSave = selectedMilestone && chairman && reviewer && member

    return (
        <div className="w-full h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 dark:text-white">Quản lý Hội đồng</h1>

                {loading && (
                    <div className="mb-4 p-3 bg-gray-50 border rounded-lg text-center">
                        <ScaleLoader color="#4F46E5" height={20} />
                        <p className="text-sm text-gray-600 mt-2">Đang tải dữ liệu...</p>
                    </div>
                )}

                {/* Info banners */}
                <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    ⚠️ Chỉ quản trị viên hệ thống mới có thể xóa hội đồng
                </div>

                <span className="flex items-center-safe gap-2.5 mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-mainColor">
                        <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                        <path fill-rule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clip-rule="evenodd" />
                    </svg>

                    <p className="text-mainColor italic font-medium">GVHD của sinh viên trong lớp không thể tham gia hội đồng theo quy định</p>
                </span>

                {/* Current committee */}
                {committee && (
                    <div className="mb-6 p-4 bg-gray-50 border rounded-lg">
                        <h3 className="font-semibold mb-2">Hội đồng hiện tại</h3>
                        <p className="text-sm text-gray-600 mb-3"><b>Cột mốc:</b> {committee.milestone.label}</p>

                        <div className="space-y-2">
                            {committee.members.map(m => (
                                <div key={m.id} className="flex items-center gap-2 text-sm">
                                    <span className="font-medium">{VNCommitteeRole[m.role]}:</span>
                                    <span>{m.user.full_name}</span>
                                    <span className="text-gray-500">({m.user.email})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-4">
                    {/* Milestone */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white">
                            Cột mốc <span className="text-red-500">*</span>
                        </label>

                        <select
                            value={selectedMilestone}
                            onChange={(e) => setSelectedMilestone(e.target.value)}
                            className="w-full px-3 py-2 border border-gray rounded-lg dark:text-white"
                        >
                            <option value="">-- Chọn milestone --</option>
                            {milestones.map(m => (
                                <option key={m.id} value={m.id}>{m.label}</option>
                            ))}
                        </select>

                        <p className="text-xs text-gray-500 mt-1">
                            Chọn milestone mà hội đồng sẽ đánh giá (ví dụ: Bảo vệ KLTN cuối kỳ)
                        </p>
                    </div>

                    {/* Chairman */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white">
                            Chủ tịch <span className="text-red-500">*</span>
                        </label>

                        <select
                            value={chairman}
                            onChange={(e) => setChairman(e.target.value)}
                            className="w-full px-3 py-2 border border-gray rounded-lg dark:text-white"
                        >
                            <option value="">-- Chọn Chủ tịch --</option>
                            {lecturers.map(l => (
                                <option key={l.user.id} value={l.user.id}>
                                    {l.user.full_name} ({l.user.email})
                                </option>
                            ))}
                        </select>

                        <p className="text-xs text-gray-500 mt-1">
                            Chủ trì buổi bảo vệ, có quyền chấm điểm
                        </p>
                    </div>

                    {/* Reviewer */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white">
                            Ủy viên phản biện <span className="text-red-500">*</span>
                        </label>

                        <select
                            value={reviewer}
                            onChange={(e) => setReviewer(e.target.value)}
                            className="w-full px-3 py-2 border border-gray rounded-lg dark:text-white"
                        >
                            <option value="">-- Chọn Ủy viên phản biện --</option>
                            {lecturers.map(l => (
                                <option key={l.user.id} value={l.user.id}>
                                    {l.user.full_name} ({l.user.email})
                                </option>
                            ))}
                        </select>

                        <p className="text-xs text-gray-500 mt-1">
                            Đánh giá và phản biện đề tài, có quyền chấm điểm
                        </p>
                    </div>

                    {/* Member */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white">
                            Ủy viên <span className="text-red-500">*</span>
                        </label>

                        <select
                            value={member}
                            onChange={(e) => setMember(e.target.value)}
                            className="w-full px-3 py-2 border border-gray rounded-lg dark:text-white"
                        >
                            <option value="">-- Chọn Ủy viên --</option>
                            {lecturers.map(l => (
                                <option key={l.user.id} value={l.user.id}>
                                    {l.user.full_name} ({l.user.email})
                                </option>
                            ))}
                        </select>

                        <p className="text-xs text-gray-500 mt-1">
                            Tham gia đánh giá, có quyền chấm điểm
                        </p>
                    </div>

                    {/* Secretary */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-white">
                            Thư ký (tùy chọn)
                        </label>

                        <select
                            value={secretary}
                            onChange={(e) => setSecretary(e.target.value)}
                            className="w-full px-3 py-2 border border-gray rounded-lg dark:text-white"
                        >
                            <option value="">-- Không có --</option>
                            {lecturers.map(l => (
                                <option key={l.user.id} value={l.user.id}>
                                    {l.user.full_name} ({l.user.email})
                                </option>
                            ))}
                        </select>

                        <p className="text-xs text-gray-500 mt-1">
                            Ghi biên bản, chuẩn bị hồ sơ, KHÔNG chấm điểm
                        </p>
                    </div>

                    {/* Save button */}
                    <button
                        onClick={handleSave}
                        disabled={!canSave || loading}
                        className={`w-full py-2 px-4 rounded-lg font-medium ${canSave && !loading
                                ? 'bg-mainColor text-white hoverBtn'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {committee ? 'Cập nhật hội đồng' : 'Thành lập hội đồng'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RACommittee
