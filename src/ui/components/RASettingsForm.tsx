import type React from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { ScaleLoader } from "react-spinners"
import { confirmDialog } from "primereact/confirmdialog"
import type { RootState } from "../../redux/store"
import { ClassService } from "../../services/class/class.service"

type RASettingsFormValues = {
    className: string
    subject: string
    description: string
    requiredApproval: boolean
    requiredJoinForm: boolean
}

type Validations = {
    wordLength: (value: string) => string
    validate: (value: string) => boolean
}

interface RASettingsForm_Interface {
    toggleForm: () => void
}

const RASettingsForm: React.FC<RASettingsForm_Interface> = ({ toggleForm }) => {
    const classInfo = useSelector((state: RootState) => state.class.currentClass.info)

    const [formValues, setFormValues] = useState<RASettingsFormValues>({
        className: classInfo.label || "",
        subject: classInfo.subject || "",
        description: classInfo.description || "",
        requiredApproval: classInfo.required_approval || false,
        requiredJoinForm: classInfo.required_join_form || false
    })

    const [isUpdating, setIsUpdating] = useState<boolean>(false)

    const validations: Record<"className" | "subject" | "description", Validations> = {
        className: {
            wordLength: (value: string) => value.length.toString(),
            validate: (value: string) => value.trim().length <= 100 && value.trim().length > 0
        },
        subject: {
            wordLength: (value: string) => value.length.toString(),
            validate: (value: string) => value.trim().length <= 100 && value.trim().length > 0
        },
        description: {
            wordLength: (value: string) => value.length.toString(),
            validate: (value: string) => {
                const trimmed = value.trim()
                return !trimmed || trimmed.length <= 300
            }
        }
    }

    const handleChange = (field: keyof RASettingsFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleClose = () => {
        const isChanged =
            formValues.className !== classInfo.label ||
            formValues.subject !== classInfo.subject ||
            formValues.description !== (classInfo.description || "") ||
            formValues.requiredApproval !== classInfo.required_approval ||
            formValues.requiredJoinForm !== classInfo.required_join_form

        if (isChanged) {
            confirmDialog({
                header: "Xác nhận đóng",
                message: "Các thay đổi chưa lưu sẽ bị mất.",
                acceptLabel: "Đồng ý",
                rejectLabel: "Hủy",
                accept: () => toggleForm()
            })
        } else toggleForm()
    }

    const checkFormValid = () => {
        if (!formValues.className.trim() || !formValues.subject.trim()) return false
        return (
            validations.className.validate(formValues.className) &&
            validations.subject.validate(formValues.subject) &&
            validations.description.validate(formValues.description)
        )
    }

    const handleUpdateClass = async () => {
        if (!checkFormValid()) {
            toast.error("Vui lòng điền đầy đủ và chính xác thông tin")
            return
        }

        setIsUpdating(true)
        const result = await ClassService.updateClass(classInfo.id, {
            label: formValues.className,
            subject: formValues.subject,
            description: formValues.description,
            required_approval: formValues.requiredApproval,
            required_join_form: formValues.requiredJoinForm
        }).finally(() => {
            setIsUpdating(false)
        })

        if (result) {
            toast.success("Cập nhật thông tin lớp học thành công")
            toggleForm()
        }
    }

    return (
        <div className="fixed z-50 top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe animate-fade-in">
            <div className="w-1/3 h-fit max-h-[90vh] bg-bgLight dark:bg-bgDark flex flex-col p-8 rounded-normal shadow-2xl overflow-y-auto no-scrollbar gap-6 max-sm:w-11/12">
                <div className="border-b-[0.5px] border-lightGray dark:border-darkGray pb-4">
                    <h1 className="text-largeSize font-bold dark:text-white uppercase">Cài đặt lớp học</h1>
                    <p className="text-smallSize text-gray">Cập nhật thông tin và cấu hình cho lớp học của bạn.</p>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center-safe justify-between">
                            <label className="text-normalSize font-bold dark:text-white">Tên lớp học <b className="text-red">*</b></label>
                            <p className="text-tinySize font-medium text-gray">{validations.className.wordLength(formValues.className)}/100</p>
                        </div>
                        <input
                            type="text"
                            value={formValues.className}
                            onChange={handleChange("className")}
                            placeholder="Nhập tên lớp học"
                            className="w-full border-[0.5px] border-lightGray dark:border-darkGray px-4 py-2.5 rounded-small dark:bg-black dark:text-white outline-none focus:border-mainColor transition-all disableState"
                            disabled={isUpdating}
                            maxLength={100}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center-safe justify-between">
                            <label className="text-normalSize font-bold dark:text-white">Môn học <b className="text-red">*</b></label>
                            <p className="text-tinySize font-medium text-gray">{validations.subject.wordLength(formValues.subject)}/100</p>
                        </div>
                        <input
                            type="text"
                            value={formValues.subject}
                            onChange={handleChange("subject")}
                            placeholder="Nhập tên môn học"
                            className="w-full border-[0.5px] border-lightGray dark:border-darkGray px-4 py-2.5 rounded-small dark:bg-black dark:text-white outline-none focus:border-mainColor transition-all disableState"
                            disabled={isUpdating}
                            maxLength={100}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center-safe justify-between">
                            <label className="text-normalSize font-bold dark:text-white">Mô tả</label>
                            <p className="text-tinySize font-medium text-gray">{validations.description.wordLength(formValues.description)}/300</p>
                        </div>
                        <textarea
                            value={formValues.description}
                            onChange={handleChange("description")}
                            placeholder="Nhập mô tả lớp học"
                            className="h-24 w-full border-[0.5px] border-lightGray dark:border-darkGray px-4 py-2.5 rounded-small dark:bg-black dark:text-white outline-none focus:border-mainColor transition-all resize-none disableState"
                            disabled={isUpdating}
                            maxLength={300}
                        />
                    </div>

                    {/* <div className="flex flex-col gap-4 pt-2">
                        <p className="text-normalSize font-bold dark:text-white">Cấu hình nâng cao</p>

                        <div className="flex flex-col gap-3">
                            <label className="flex items-center-safe justify-between p-3 rounded-small border-[0.5px] border-lightGray dark:border-darkGray hover:border-mainColor transition-all cursor-pointer group">
                                <div className="flex flex-col">
                                    <p className="font-medium dark:text-white group-hover:text-mainColor transition-colors text-smallSize">Yêu cầu phê duyệt</p>
                                    <p className="text-tinySize text-gray font-medium">Phê duyệt thành viên mới khi họ tham gia</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formValues.requiredApproval}
                                    onChange={handleChange("requiredApproval")}
                                    className="size-5 accent-mainColor cursor-pointer"
                                    disabled={isUpdating}
                                />
                            </label>

                            <label className="flex items-center-safe justify-between p-3 rounded-small border-[0.5px] border-lightGray dark:border-darkGray hover:border-mainColor transition-all cursor-pointer group">
                                <div className="flex flex-col">
                                    <p className="font-medium dark:text-white group-hover:text-mainColor transition-colors text-smallSize">Yêu cầu form tham gia</p>
                                    <p className="text-tinySize text-gray font-medium">Yêu cầu sinh viên điền thông tin trước khi vào lớp</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formValues.requiredJoinForm}
                                    onChange={handleChange("requiredJoinForm")}
                                    className="size-5 accent-mainColor cursor-pointer"
                                    disabled={isUpdating}
                                />
                            </label>
                        </div>
                    </div> */}
                </div>

                <div className="flex items-center-safe gap-4 mt-2">
                    <button
                        className="flex-1 hoverBtn bg-redRGB text-red py-2.5 rounded-small font-bold transition-all disableState"
                        onClick={handleClose}
                        disabled={isUpdating}
                    >
                        Hủy
                    </button>
                    <button
                        className="flex-2 hoverBtn bg-mainColor text-white py-2.5 rounded-small font-bold shadow-lg shadow-mainColorRGB transition-all disableState"
                        onClick={handleUpdateClass}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <ScaleLoader height={10} width={4} color="white" /> : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RASettingsForm
