import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import type { RootState } from "../../../redux/store"
import { ClassService } from "../../../services/class/class.service"
import formatVNTime from "../../../utils/formatVNTime"
import getShortName from "../../../utils/getShortName"
import { VNCommitteeRole, VNRoleName, VNThesisType, VNTopicStatus } from "../../../config/enum"
import { useDebounce } from "../../../hooks/Debounce"
import { currentClass_SetMembers } from "../../../redux/reducers/classSlice.reducer"
import { memberSizePage } from "../../../config/pageSize"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { confirmDialog } from "primereact/confirmdialog"
import TopicsService from "../../../services/topics/topics.service"
import type { TopicDetail } from "../../../services/topics/topics.type"
import CommitteeService from "../../../services/committee/committee.service"
import type { Committee, CommitteeMember } from "../../../services/committee/committee.type"
import ProgressService from "../../../services/progress/progress.service"
import { CommitteeRole, ThesisType, TopicStatus } from "../../../config/enum"
import { ScaleLoader } from "react-spinners"
import OutlineReviewPanel from "../../components/OutlineReviewPanel"
import { toast } from "sonner"

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

    // Tab
    const [activeTab, setActiveTab] = useState<"members" | "topics" | "committee">("members")

    // Topics & Review
    const [topics, setTopics] = useState<TopicDetail[]>([])
    const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})
    const [reviewableTopic, setReviewableTopic] = useState<TopicDetail | null>(null)
    const [assignTarget, setAssignTarget] = useState<TopicDetail | null>(null)
    const [assignSearch, setAssignSearch] = useState("")
    const [assigning, setAssigning] = useState(false)

    // Committee
    const [committee, setCommittee] = useState<Committee | null>(null)
    const [selectedMilestone, setSelectedMilestone] = useState("")
    const [chairman, setChairman] = useState("")
    const [reviewer, setReviewer] = useState("")
    const [member, setMember] = useState("")
    const [secretary, setSecretary] = useState("")
    const [loadingCommittee, setLoadingCommittee] = useState(false)

    const progress = useSelector((state: RootState) => state.progress.currentProgress)
    const lecturers = members?.data?.lecturer || []
    const milestones = progress?.milestones || []

    // Get class data
    useEffect(() => {
        if (!classId || !userData.id) return
        ClassService.getClass(classId)
    }, [userData.id, classId])
    // Fetch all topics
    const fetchTopics = async () => {
        if (!classId) return
        let loading = toast.loading("Đang tải đề tài...")
        dispatch(changeStateFetching(true))
        const data = await TopicsService.getTopics(classId).finally(() => dispatch(changeStateFetching(false)))
        if (data) setTopics(data)
        toast.dismiss(loading)
    }

    useEffect(() => {
        if (!classId || !userData.id) return
        fetchTopics()
    }, [classId, userData.id])

    // Load committee & progress
    useEffect(() => {
        if (!classId || activeTab !== "committee") return
        loadCommitteeData()
    }, [classId, activeTab])

    const loadCommitteeData = async () => {
        if (!classId) return
        setLoadingCommittee(true)
        if (!progress || progress.class?.id !== classId) {
            dispatch(changeStateFetching(true))
            await ProgressService.getProgressDetail(classId).finally(() => dispatch(changeStateFetching(false)))
        }

        const committeeResult = await CommitteeService.getByClassId(classId)
        if (committeeResult) {
            setCommittee(committeeResult)
            setSelectedMilestone(committeeResult.milestone.id)
            setChairman(committeeResult.members.find(m => m.role === CommitteeRole.CHAIRMAN)?.user.id || "")
            setReviewer(committeeResult.members.find(m => m.role === CommitteeRole.REVIEWER)?.user.id || "")
            setMember(committeeResult.members.find(m => m.role === CommitteeRole.MEMBER)?.user.id || "")
            setSecretary(committeeResult.members.find(m => m.role === CommitteeRole.SECRETARY)?.user.id || "")
        }
        setLoadingCommittee(false)
    }

    const handleSaveCommittee = async () => {
        if (!classId || !selectedMilestone || !chairman || !reviewer || !member) return
        const requiredMembers = [chairman, reviewer, member]
        if (new Set(requiredMembers).size < 3) {
            toast.error("Chủ tịch, Phản biện và Ủy viên phải là 3 người khác nhau")
            return
        }
        if (secretary && requiredMembers.includes(secretary)) {
            toast.error("Thư ký phải khác với các thành viên còn lại")
            return
        }

        const membersData: CommitteeMember[] = [
            { userId: chairman, role: CommitteeRole.CHAIRMAN },
            { userId: reviewer, role: CommitteeRole.REVIEWER },
            { userId: member, role: CommitteeRole.MEMBER },
        ]
        if (secretary) membersData.push({ userId: secretary, role: CommitteeRole.SECRETARY })

        setLoadingCommittee(true)
        dispatch(changeStateFetching(true))
        const result = await CommitteeService.upsert({ classId, milestoneId: selectedMilestone, members: membersData }).finally(() => dispatch(changeStateFetching(false)))

        setLoadingCommittee(false)
        if (result) setCommittee(result)
    }

    const handleReviewTopic = async (topicId: string, approve: boolean) => {
        if (!classId) return
        dispatch(changeStateFetching(true))
        const result = await TopicsService.reviewTopic(topicId, classId, approve, rejectNotes[topicId]).finally(() => dispatch(changeStateFetching(false)))
        if (result) {
            setTopics(prev => prev.map(t => t.id === topicId ? result : t))
            setReviewableTopic(result)
        }
    }

    const handleAssignReviewer = async (reviewerId: string) => {
        if (!classId || !assignTarget) return
        dispatch(changeStateFetching(true))
        setAssigning(true)
        const result = await TopicsService.assignReviewer(assignTarget.id, classId, reviewerId).finally(() => dispatch(changeStateFetching(false)))
        if (result) {
            setTopics(prev => prev.map(t => t.id === assignTarget.id ? result : t))
            setAssignTarget(null)
            setAssignSearch("")
        }
        setAssigning(false)
    }

    const canSaveCommittee = selectedMilestone && chairman && reviewer && member
    const filteredLecturers = lecturers.filter(l =>
        l.user.id !== assignTarget?.supervisor?.id &&
        (l.user.full_name.toLowerCase().includes(assignSearch.toLowerCase()) ||
            l.user.email.toLowerCase().includes(assignSearch.toLowerCase()))
    )

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

            {/* Info and Members */}
            <div className="w-full flex gap-5">
                {/* Left: Info */}
                <div className="w-1/4 flex flex-col gap-5">
                    <div className="p-5 border-[0.5px] border-lightGray dark:border-darkGray rounded-normal flex flex-col gap-4">
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

                        <div className="border-t-[0.5px] border-lightGray dark:border-darkGray pt-4 flex flex-col gap-2">
                            <p className="text-sm text-gray flex justify-between">Ngày tạo: <span className="text-black dark:text-white font-medium">{formatVNTime(info.created_at)}</span></p>
                            <p className="text-sm text-gray flex justify-between">Cập nhật: <span className="text-black dark:text-white font-medium">{formatVNTime(info.updated_at)}</span></p>
                        </div>
                    </div>

                    <div className="p-5 border-[0.5px] border-lightGray dark:border-darkGray rounded-normal">
                        <h3 className="font-bold dark:text-white uppercase text-mobile-smallSize text-gray tracking-widest mb-3">Mô tả lớp học</h3>
                        <p className="text-normalSize text-gray italic">"{info.description || "Chưa có mô tả"}"</p>
                    </div>
                </div>

                {/* Right: Tab content */}
                <div className="flex-1 flex flex-col gap-2.5">
                    <div className="flex gap-5">
                        <span className="flex-1 flex items-center-safe justify-between px-7 py-3.5 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-small dark:bg-black/20">
                            <span className="">
                                <h4 className="text-normalSize text-gray">Sinh viên</h4>
                                <p className="text-largeSize font-semibold dark:text-white">{Number(info.counts.student) < 10 ? `0${Number(info.counts.student)}` : Number(info.counts.student)}</p>
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
                                <p className="text-largeSize font-semibold dark:text-white">{Number(info.counts.lecturer) < 10 ? `0${Number(info.counts.lecturer)}` : Number(info.counts.lecturer)}</p>
                            </span>

                            <span className="h-fit aspect-square bg-lightGray dark:bg-white/10 p-3 rounded-normal">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                                </svg>
                            </span>
                        </span>
                    </div>
                    
                    {/* Tab switcher */}
                    <div className="flex gap-1 border-b border-lightGray dark:border-gray">
                        <button
                            onClick={() => setActiveTab("members")}
                            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === "members" ? "border-mainColor text-mainColor" : "border-transparent text-gray hover:text-black dark:hover:text-white"}`}
                        >
                            Thành viên
                        </button>
                        <button
                            onClick={() => setActiveTab("topics")}
                            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === "topics" ? "border-mainColor text-mainColor" : "border-transparent text-gray hover:text-black dark:hover:text-white"}`}
                        >
                            Đề tài {topics.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-lighterGray dark:bg-white/10 rounded text-xs dark:text-white">{topics.length}</span>}
                        </button>
                        <button
                            onClick={() => setActiveTab("committee")}
                            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === "committee" ? "border-mainColor text-mainColor" : "border-transparent text-gray hover:text-black dark:hover:text-white"}`}
                        >
                            Hội đồng
                        </button>
                    </div>

                    {activeTab === "members" && (
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
                                </div>

                                <div className="flex">
                                    <span className="flex gap-1.5 items-center-safe">
                                        <p className="font-bold dark:text-white">Số lượng: {Object.values(members.data).flat().length}</p>
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

                            <div className="border-[0.5px] border-lightGray dark:border-darkGray rounded-normal overflow-hidden">
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
                                            <tr key={index} className="border-t-[0.5px] border-lightGray dark:border-darkGray hover:bg-lighterGray dark:hover:bg-white/5 hover:cursor-pointer">
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
                    )}

                    {activeTab === "topics" && (
                        <div className="flex-1 flex flex-col gap-5 pt-5">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold dark:text-white uppercase text-sm tracking-wider">Danh sách đề tài</h3>

                                <button onClick={fetchTopics} className="p-2 hover:bg-lightGray dark:hover:bg-white/10 rounded-full transition-colors disableState" disabled={isFetching}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 dark:stroke-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            </div>

                            <div className="border-[0.5px] border-lightGray dark:border-darkGray rounded-normal overflow-hidden">
                                <table className="w-full bg-transparent">
                                    <colgroup>
                                        <col className="w-[18%]" />
                                        <col className="w-[28%]" />
                                        <col className="w-[8%]" />
                                        <col className="w-[15%]" />
                                        <col className="w-[15%]" />
                                        <col className="w-[16%]" />
                                    </colgroup>
                                    <thead className="bg-lightGray/50 dark:bg-white/5">
                                        <tr>
                                            <th className="text-left px-5 py-3 dark:text-white text-sm uppercase tracking-wider">Sinh viên</th>
                                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Tên đề tài</th>
                                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Loại</th>
                                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">GVHD</th>
                                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Phản biện</th>
                                            <th className="text-left dark:text-white text-sm uppercase tracking-wider">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topics.map((topic) => {
                                            const canAssign = topic.thesis_type === ThesisType.CAPSTONE && topic.status === TopicStatus.APPROVED
                                            return (
                                                <tr key={topic.id}
                                                    onClick={() =>  setReviewableTopic(topic)}
                                                    className={`border-t-[0.5px] border-lightGray dark:border-darkGray hover:bg-lighterGray dark:hover:bg-white/5 cursor-pointer`}>
                                                    <td className="px-5 py-3 dark:text-white text-sm">{topic.student.full_name}</td>
                                                    <td className="py-3 dark:text-white text-sm max-w-[200px] truncate" title={topic.title}>{topic.title}</td>
                                                    <td className="py-3 text-gray text-sm">{VNThesisType[topic.thesis_type]?.split(" ")[0]}</td>
                                                    <td className="py-3 text-gray text-sm">{topic.supervisor?.full_name ?? "—"}</td>
                                                    <td className="py-3 text-sm" onClick={e => e.stopPropagation()}>
                                                        {canAssign ? (
                                                            <button onClick={() => setAssignTarget(topic)} className="text-mainColor font-bold hover:underline">
                                                                {topic.reviewer?.full_name ?? "Chỉ định"}
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray">{topic.reviewer?.full_name ?? "—"}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3 text-sm">
                                                        <span className={`font-semibold ${VNTopicStatus[topic.status]?.color}`}>
                                                            {VNTopicStatus[topic.status]?.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        {topics.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center text-gray italic">Chưa có đề tài nào trong lớp này</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "committee" && (
                        <div className="flex-1 flex flex-col gap-8 pt-5 max-w-4xl">
                            <div className="flex flex-col gap-2">
                                <h1 className="font-bold dark:text-white uppercase text-sm">Thành lập Hội đồng bảo vệ khóa luận</h1>
                            </div>

                            {loadingCommittee ? (
                                <div className="py-20 flex justify-center"><ScaleLoader color="#499c40" /></div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Form fields */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 dark:text-white">Cột mốc <b className="text-red">*</b></label>
                                            <select value={selectedMilestone} onChange={e => setSelectedMilestone(e.target.value)}
                                                className="w-full px-3 py-3.5 border border-lightGray dark:border-darkGray rounded-lg dark:bg-black dark:text-white">
                                                <option value="">-- Chọn milestone --</option>
                                                {milestones.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 dark:text-white">Chủ tịch <b className="text-red">*</b></label>
                                                <select value={chairman} onChange={e => setChairman(e.target.value)}
                                                    className="w-full px-3 py-3.5 border border-lightGray dark:border-darkGray rounded-lg dark:bg-black dark:text-white">
                                                    <option value="">-- Chọn --</option>
                                                    {lecturers.map(l => <option key={l.user.id} value={l.user.id}>{l.user.full_name}</option>)}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 dark:text-white">Ủy viên phản biện <b className="text-red">*</b></label>
                                                <select value={reviewer} onChange={e => setReviewer(e.target.value)}
                                                    className="w-full px-3 py-3.5 border border-lightGray dark:border-darkGray rounded-lg dark:bg-black dark:text-white">
                                                    <option value="">-- Chọn --</option>
                                                    {lecturers.map(l => <option key={l.user.id} value={l.user.id}>{l.user.full_name}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 dark:text-white">Ủy viên <b className="text-red">*</b></label>
                                                <select value={member} onChange={e => setMember(e.target.value)}
                                                    className="w-full px-3 py-3.5 border border-lightGray dark:border-darkGray rounded-lg dark:bg-black dark:text-white">
                                                    <option value="">-- Chọn --</option>
                                                    {lecturers.map(l => <option key={l.user.id} value={l.user.id}>{l.user.full_name}</option>)}
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1 dark:text-white">Thư ký</label>
                                                <select value={secretary} onChange={e => setSecretary(e.target.value)}
                                                    className="w-full px-3 py-3.5 border border-lightGray dark:border-darkGray rounded-lg dark:bg-black dark:text-white">
                                                    <option value="">-- Không có --</option>
                                                    {lecturers.map(l => <option key={l.user.id} value={l.user.id}>{l.user.full_name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleSaveCommittee} disabled={!canSaveCommittee || loadingCommittee}
                                        className={`w-full py-2.5 rounded-lg font-bold text-white transition-all ${canSaveCommittee ? "bg-mainColor hover:opacity-90" : "bg-gray cursor-not-allowed"}`}>
                                        {committee ? "Cập nhật Hội đồng" : "Thành lập Hội đồng"}
                                    </button>

                                    {committee && (
                                        <div className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-big border border-lightGray dark:border-gray/30">
                                            <h4 className="font-bold mb-4 dark:text-white">Hội đồng hiện tại</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                {committee.members.map(m => (
                                                    <div key={m.id} className="text-sm">
                                                        <span className="text-gray font-medium">{VNCommitteeRole[m.role]}:</span>
                                                        <span className="ml-2 dark:text-white font-bold">{m.user.full_name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals for Topics */}
            {reviewableTopic && (
                <OutlineReviewPanel
                    topics={[reviewableTopic]}
                    isFetching={isFetching}
                    rejectNotes={rejectNotes}
                    onRejectNoteChange={(id, note) => setRejectNotes(prev => ({ ...prev, [id]: note }))}
                    onReview={handleReviewTopic}
                    onClose={() => setReviewableTopic(null)}
                    refreshTopics={fetchTopics}
                />
            )}

            {assignTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAssignTarget(null)}>
                    <div className="bg-white dark:bg-lightDark shadow-xl w-[460px] rounded-small overflow-hidden flex flex-col max-h-[70vh]" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 bg-lightGray dark:bg-darkGray flex justify-between items-center">
                            <h2 className="font-bold dark:text-white">Chỉ định Giảng viên phản biện</h2>
                            <button onClick={() => setAssignTarget(null)} className="dark:text-white">✕</button>
                        </div>
                        <div className="p-5 border-b dark:border-gray/30">
                            <input value={assignSearch} onChange={e => setAssignSearch(e.target.value)} placeholder="Tìm tên hoặc email..."
                                className="w-full border p-2 rounded dark:bg-black dark:text-white" />
                        </div>
                        <div className="overflow-y-auto flex-1">
                            {filteredLecturers.map(l => (
                                <button key={l.user.id} onClick={() => handleAssignReviewer(l.user.id)} disabled={assigning}
                                    className="w-full p-4 text-left border-b dark:border-gray/10 hover:bg-lightGray dark:hover:bg-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold dark:text-white">{l.user.full_name}</p>
                                        <p className="text-xs text-gray">{l.user.email}</p>
                                    </div>
                                    {l.user.id === assignTarget.reviewer?.id && <span className="text-xs text-mainColor font-bold">✓ Đang chọn</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SAClassDetail
