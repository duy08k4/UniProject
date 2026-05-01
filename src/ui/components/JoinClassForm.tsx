import type React from "react"
import { useState } from "react"
import { ClassService } from "../../services/class/class.service"
import { ScaleLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import SubmissionService from "../../services/submission/submission.service"
import FormViewer from "./FormViewer"

type NewClassFormValues = {
    joinCode: string
}

interface JoinClassForm_Interface {
    toggleForm: () => void
}

const JoinClassForm: React.FC<JoinClassForm_Interface> = ({ toggleForm }) => {
    const navigate = useNavigate()
    const userData = useSelector((state: RootState) => state.auth.user.info)

    const [newClassFormValues, setNewClassFormValues] = useState<NewClassFormValues>({ joinCode: "" })
    const [isJoin, setIsJoin] = useState<boolean>(false)
    const [joinFormData, setJoinFormData] = useState<{ classId: string; formId: string; joinCode: string } | null>(null)

    const handleChange = (field: keyof NewClassFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewClassFormValues(prev => ({ ...prev, [field]: e.target.value }))
    }

    const handleJoin = async () => {
        setIsJoin(true)
        const result = await ClassService.getJoinForm(newClassFormValues.joinCode).finally(() => setIsJoin(false))

        if (!result) return

        if (result.formId) {
            // Cần điền form trước
            setJoinFormData({ classId: result.classId, formId: result.formId, joinCode: newClassFormValues.joinCode })
        } else {
            // Không cần form, join thẳng
            await doJoin(newClassFormValues.joinCode)
        }
    }

    const doJoin = async (joinCode: string) => {
        setIsJoin(true)
        const data = await ClassService.joinClass(joinCode).finally(() => {
            setIsJoin(false)
            setNewClassFormValues({ joinCode: "" })
        })

        if (data && data.user.roomadmin_approved) {
            navigate(`/main/${data.user.role}/class/${data.id}`)
        } else {
            toggleForm()
        }
    }

    const handleFormViewerClose = async () => {
        if (!joinFormData) return

        // Kiểm tra submission sau khi đóng form
        const submission = await SubmissionService.getOneSubmission(joinFormData.classId, joinFormData.formId, userData.id)

        if (!submission) {
            toast.error("Bạn chưa điền form tham gia. Không thể tham gia lớp học.")
            setJoinFormData(null)
            return
        }

        setJoinFormData(null)
        await doJoin(joinFormData.joinCode)
    }

    if (joinFormData) {
        return (
            <FormViewer
                formId={joinFormData.formId}
                classIdProp={joinFormData.classId}
                onClose={handleFormViewerClose}
            />
        )
    }

    return (
        <div className="fixed z-20 top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe">
            <div className="w-1/4 h-fit bg-white flex flex-col px-5 py-10 rounded-normal gap-5 max-sm:w-4/5">
                <span className="w-full">
                    <h1 className="text-center text-bigSize font-semibold uppercase max-sm:text-bigSize leading-0">Tham gia</h1>
                </span>

                <span className="flex flex-col gap-1.5">
                    <span className="flex items-center-safe justify-between">
                        <p className="text-normalSize font-semibold max-sm:text-smallSize">Mã tham gia <b className="text-red">*</b></p>
                    </span>

                    <input
                        type="text"
                        value={newClassFormValues.joinCode}
                        placeholder="Mã tham gia"
                        className="w-full shadow-[0_0_10px_rgba(128,128,128,0.25)] text-center text-normalSize font-light py-2.5 px-5 rounded-small max-sm:text-smallSize disableState"
                        maxLength={100}
                        onChange={handleChange("joinCode")}
                        disabled={isJoin}
                        autoFocus
                    />
                </span>

                <span className="flex items-center-safe gap-5">
                    <button className="flex-1 bg-lightGray hoverBtn py-2.5 rounded-small max-sm:text-smallSize disableState" onClick={toggleForm} disabled={isJoin}>Hủy</button>
                    <button className="flex-2 bg-mainColor hoverBtn text-white py-2.5 rounded-small max-sm:text-smallSize disableState" onClick={handleJoin} disabled={isJoin}>
                        {isJoin ? <ScaleLoader height={10} width={4} color="white" /> : <>Tham gia</>}
                    </button>
                </span>
            </div>
        </div>
    )
}

export default JoinClassForm