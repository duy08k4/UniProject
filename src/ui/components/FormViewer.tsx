import type React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import type { DetailForm } from "../../services/forms/forms.type"
import { Field_Type } from "../../config/enum"
import formatVNTime from "../../utils/formatVNTime"
import { confirmDialog } from "primereact/confirmdialog"

interface Props {
    form: DetailForm
    onClose: () => void
    readonly?: boolean
}

const FormViewer: React.FC<Props> = ({ form: initialForm, onClose, readonly: readonlyProp }) => {
    const [form, setForm] = useState<DetailForm>(initialForm)
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

    const currentForm = useSelector((state: RootState) => state.form.currentForm)
    useEffect(() => {
        if (currentForm && currentForm.id === form.id) setForm(currentForm)
    }, [currentForm])

    const readonly = readonlyProp ?? (form.is_stopped || (!!form.close_at && new Date(form.close_at) < new Date()))

    const isDirty = Object.values(answers).some(v => (Array.isArray(v) ? v.length > 0 : v !== ""))

    const handleClose = () => {
        if (!readonly && isDirty) {
            confirmDialog({
                header: "Bỏ dữ liệu đã nhập?",
                message: "Bạn đã nhập một số thông tin. Đóng sẽ mất toàn bộ dữ liệu chưa nộp.",
                acceptLabel: "Đóng", rejectLabel: "Tiếp tục nhập",
                accept: onClose,
            })
        } else {
            onClose()
        }
    }

    const toggleChoice = (key: string, value: string, multiple: boolean) => {
        const current = (answers[key] as string[] | undefined) ?? []
        setAnswers(prev => ({
            ...prev,
            [key]: multiple
                ? current.includes(value) ? current.filter(v => v !== value) : [...current, value]
                : [value]
        }))
    }

    // Merge and sort all fields by index
    const allFields = [
        ...form.fields.filter(f => !f.is_deleted).map(f => ({ kind: "field" as const, index: Number(f.index), data: f })),
        ...form.checkboxFields.filter(f => !f.is_deleted).map(f => ({ kind: "checkbox" as const, index: Number(f.index), data: f })),
    ].sort((a, b) => a.index - b.index)

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8 px-4">
            <div className="w-full max-w-2xl flex flex-col gap-4 bg-lighterGray dark:bg-[#1e1e1e] rounded-normal p-5 shadow-[0_8px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.6)]">

                {/* Header */}
                <div className="bg-white dark:bg-lightDark rounded-normal overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
                    <div className="h-2.5 bg-mainColor w-full" />
                    <div className="px-6 py-5 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <h1 className="text-bigSize font-bold dark:text-white leading-tight">{form.label}</h1>
                                {form.description && <p className="text-smallSize text-gray leading-relaxed">{form.description}</p>}
                            </div>

                            <button onClick={handleClose} className="p-1.5 rounded-normal hover:bg-gray/10 transition-colors shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-gray">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col justify-center-safe gap-3 flex-wrap pt-2 border-t border-lightGray/20 dark:border-white/5">
                            {form.is_join_form && <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-500 text-tinySize font-bold rounded-small uppercase">Cung cấp câu trả lời trước khi tham gia lớp</span>}
                            {form.milestone && <span className="text-normalSize dark:text-white">📌 {form.milestone.label}</span>}

                            <span className={`w-fit px-2.5 py-0.5 rounded-small text-tinySize font-bold uppercase ${form.is_stopped ? "bg-redRGB text-red" : "bg-mainColorRGB text-mainColor"}`}>
                                {form.is_stopped ? "Đã đóng" : form.open_at && new Date(form.open_at) > new Date() ? "Đang mở (Sớm hơn dự kiến)" : "Đang mở"}
                            </span>

                            <span className="flex flex-col">
                                {form.open_at && <span className="text-smallSize text-gray">⏰ Tự động mở: <span className="text-mainColor font-medium">{formatVNTime(form.open_at)}</span></span>}
                                {form.close_at && <span className="text-smallSize text-gray">⏰ Tự động đóng: <span className="text-red font-medium">{formatVNTime(form.close_at)}</span></span>}
                            </span>
                        </div>
                        {readonly && <p className="text-tinySize text-red mt-1">Bạn chỉ có thể xem biểu mẫu</p>}
                    </div>
                </div>

                {/* Fields */}
                {allFields.length === 0 && (
                    <div className="bg-white dark:bg-lightDark rounded-normal px-6 py-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                        <p className="text-gray italic text-smallSize">Biểu mẫu chưa có câu hỏi.</p>
                    </div>
                )}

                {allFields.map(item => {
                    const key = `${item.kind}-${item.index}`

                    return (
                        <div key={key} className="bg-white dark:bg-lightDark rounded-normal px-6 py-5 flex flex-col gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border-l-4 border-transparent hover:border-mainColor transition-colors">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-normalSize font-medium dark:text-white leading-snug">
                                    {item.data.title}
                                    {item.data.is_required && <span className="text-red ml-1">*</span>}
                                </p>
                                {item.data.description && <p className="text-smallSize text-gray">{item.data.description}</p>}
                            </div>

                            {item.kind === "field" && item.data.input_type !== Field_Type.FILE && (
                                <input
                                    type={item.data.input_type === Field_Type.NUMBER ? "number" : "text"}
                                    placeholder={"Câu trả lời của bạn"}
                                    value={(answers[key] as string) ?? ""}
                                    onChange={e => !readonly && setAnswers(prev => ({ ...prev, [key]: e.target.value }))}
                                    readOnly={readonly}
                                    className={`w-full bg-transparent border-b-2 border-lightGray dark:border-white/20 pb-1.5 text-smallSize dark:text-white outline-none transition-colors placeholder:text-gray/60 ${readonly ? "cursor-not-allowed text-gray" : "focus:border-mainColor"}`}
                                />
                            )}

                            {item.kind === "field" && item.data.input_type === Field_Type.FILE && (
                                <label className={`flex items-center gap-3 px-4 py-3 rounded-normal border-2 border-dashed border-lightGray dark:border-white/10 bg-lighterGray dark:bg-bgDark w-fit transition-colors ${readonly ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-mainColor"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 stroke-gray shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                    </svg>
                                    <span className="text-smallSize text-gray">
                                        {(answers[key] as string) ? (answers[key] as string).split("\\").pop() : "Chọn tệp PDF..."}
                                    </span>
                                    <input type="file" accept=".pdf" disabled={readonly} className="hidden" onChange={e => !readonly && setAnswers(prev => ({ ...prev, [key]: e.target.value }))} />
                                </label>
                            )}

                            {item.kind === "checkbox" && (
                                <div className="flex flex-col gap-2">
                                    {item.data.checkbox_field_choices.map((choice, ci) => {
                                        const selected = ((answers[key] as string[]) ?? []).includes(choice.body)
                                        return (
                                            <label key={ci} className={`flex items-center gap-3 ${readonly ? "cursor-not-allowed" : "cursor-pointer"} group/choice`}>
                                                <div
                                                    onClick={() => !readonly && toggleChoice(key, choice.body, item.data.is_multiple)}
                                                    className={`size-5 shrink-0 border-2 transition-colors flex items-center justify-center ${item.data.is_multiple ? "rounded-small" : "rounded-full"} ${selected ? "border-mainColor bg-mainColor" : "border-gray/40 group-hover/choice:border-mainColor"}`}
                                                >
                                                    {selected && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-3 stroke-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-smallSize dark:text-white">{choice.body}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Submit */}
                {!readonly && (
                    <div className="bg-white dark:bg-lightDark rounded-normal px-6 py-4 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                        <span className="text-tinySize text-gray italic">Chức năng nộp sẽ sớm được hỗ trợ</span>
                        <button disabled className="px-6 py-2 bg-mainColor text-white rounded-normal text-smallSize font-medium opacity-50 cursor-not-allowed">Nộp</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FormViewer
