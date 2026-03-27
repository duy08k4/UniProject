import type React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ClassService } from "../../services/class/class.service"
import { ScaleLoader } from "react-spinners"
import { confirmDialog } from "primereact/confirmdialog"

type NewClassFormValues = {
    className: string
    subject: string
    description: string
}

type AdvanceSetting = {
    approval: boolean,
    startForm: boolean
}

type Validations = {
    wordLength: (value: string) => string
    validate: (value: string) => boolean
}

interface NewClassForm_Interface {
    toggleForm: () => void
}

const NewClassForm: React.FC<NewClassForm_Interface> = ({ toggleForm }) => {
    const [newClassFormValues, setNewClassFormValues] = useState<NewClassFormValues>({
        className: "",
        subject: "",
        description: ""
    })

    const validations: Record<keyof NewClassFormValues, Validations> = {
        className: {
            wordLength: (value: string) => value.length.toString(),
            validate: (value: string) => value.trim().length <= 100 && value.trim().length >= 0
        },
        subject: {
            wordLength: (value: string) => value.length.toString(),
            validate: (value: string) => value.trim().length <= 100 && value.trim().length >= 0
        },
        description: {
            wordLength: (value: string) => value.length.toString(),
            validate: (value: string) => {
                const trimmed = value.trim()
                return !trimmed || trimmed.length <= 300
            }
        }
    }

    // State
    const [isCreating, setIsCreating] = useState<boolean>(false)

    const handleChange = (field: keyof NewClassFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewClassFormValues(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }

    const handleClose = () => {
        const isData = Object.values(newClassFormValues).some((field: string) => field)

        if (isData) {
            confirmDialog({
                header: "Xác nhận đóng form",
                message: "Dữ liệu trong form sẽ mất khi bạn đóng form.",

                acceptLabel: "Đồng ý",
                rejectLabel: "Hủy",

                accept: () => {
                    toggleForm()
                }
            })
        } else toggleForm()
    }

    const checkFormValid = () => {
        return (Object.keys(validations) as (keyof NewClassFormValues)[])
            .every((fieldKey) => {
                const value = newClassFormValues[fieldKey]

                if (typeof value === "string" && !value.trim() && fieldKey != "description") return false
                return validations[fieldKey].validate(value)
            })
    }

    const handleCreateClass = async () => {
        if (!checkFormValid()) {
            toast.error("Vui lòng điền đầy đủ thông tin")
            return false
        }

        setIsCreating(true)
        await ClassService.createNewClass(
            newClassFormValues.className,
            newClassFormValues.subject,
            newClassFormValues.description
        ).finally(() => {
            setIsCreating(false)
            setNewClassFormValues({
                className: "",
                description: "",
                subject: ""
            })

            confirmDialog({
                header: "Lớp học mới",
                message: "Bạn có muốn truy cập vào lớp học không?",

                acceptLabel: "Truy cập",
                rejectLabel: "Hủy",

                accept: () => {
                    toast.info("Truy cập lớp học")
                },

                reject: () => {
                    toggleForm()
                }
            })

        })
    }

    return (
        <div className="fixed z-20 top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe">
            <div className="w-1/3 h-fit max-h-4/5 bg-white flex flex-col p-5 rounded-normal gap-6 max-sm:w-4/5">
                <span className="w-full">
                    <h1 className="text-center text-largeSize font-semibold uppercase max-sm:text-bigSize">Tạo lớp học</h1>
                </span>

                <span className="flex flex-col gap-3.5">
                    <span className="flex flex-col gap-1.5">
                        <span className="flex items-center-safe justify-between">
                            <p className="text-normalSize font-semibold max-sm:text-smallSize">Tên lớp học <b className="text-red">*</b></p>
                            <p className="text-smallSize font-medium text-gray">{validations["className"].wordLength(newClassFormValues.className)}/100 ký tự</p>
                        </span>

                        <input
                            type="text"
                            value={newClassFormValues.className}
                            placeholder="Nhập tên lớp học"
                            className="w-full shadow-[0_0_10px_rgba(128,128,128,0.25)] text-normalSize font-light py-2.5 px-5 rounded-small max-sm:text-smallSize disableState"
                            maxLength={100}
                            onChange={handleChange("className")}
                            disabled={isCreating}
                        />
                    </span>

                    <span className="flex flex-col gap-1.5">
                        <span className="flex items-center-safe justify-between">
                            <p className="text-normalSize font-semibold max-sm:text-smallSize">Môn học <b className="text-red">*</b></p>
                            <p className="text-smallSize font-medium text-gray">{validations["subject"].wordLength(newClassFormValues.subject)}/100 ký tự</p>
                        </span>

                        <input
                            type="text"
                            value={newClassFormValues.subject}
                            placeholder="Nhập tên môn học"
                            className="w-full shadow-[0_0_10px_rgba(128,128,128,0.25)] text-normalSize font-light py-2.5 px-5 rounded-small max-sm:text-smallSize disableState"
                            maxLength={100}
                            onChange={handleChange("subject")}
                            disabled={isCreating}
                        />
                    </span>

                    <span className="flex flex-col gap-1.5">
                        <span className="flex items-center-safe justify-between">
                            <p className="text-normalSize font-semibold max-sm:text-smallSize">Mô tả lớp học</p>
                            <p className="text-smallSize font-medium text-gray">{validations["description"].wordLength(newClassFormValues.description)}/300 ký tự</p>
                        </span>

                        <textarea
                            placeholder="Nhập mô tả lớp học"
                            value={newClassFormValues.description}
                            className="h-30 w-full shadow-[0_0_10px_rgba(128,128,128,0.25)] text-normalSize font-light py-2.5 px-5 rounded-small max-sm:text-smallSize resize-none disableState"
                            onChange={handleChange("description")}
                            maxLength={300}
                            disabled={isCreating}
                        ></textarea>

                    </span>
                </span>

                <span className="flex items-center-safe gap-5">
                    <button className="flex-1 bg-lightGray hover:cursor-pointer hoverBtn py-2.5 rounded-small max-sm:text-smallSize disableState" disabled={isCreating} onClick={handleClose}>Hủy</button>
                    <button className="flex-2 bg-mainColor hover:cursor-pointer hoverBtn text-white py-2.5 rounded-small max-sm:text-smallSize disableState" disabled={isCreating} onClick={handleCreateClass}>
                        {isCreating ? <><ScaleLoader height={10} width={4} color="white" /></> : <>Tạo lớp</>}
                    </button>
                </span>
            </div>
        </div>
    )
}

export default NewClassForm