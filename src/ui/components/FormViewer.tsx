import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { Field_Type } from "../../config/enum"
import formatVNTime from "../../utils/formatVNTime"
import { confirmDialog } from "primereact/confirmdialog"
import { FormsService } from "../../services/forms/forms.service"
import { useParams } from "react-router-dom"
import type { UpdateSubmission, UpdateSubmissionAnswer, UpdateSubmissionAnswerCheckbox } from "../../services/submission/submission.type"
import { changeStateFetching } from "../../redux/reducers/global.reducer"
import { toast } from "sonner"
import SubmissionService from "../../services/submission/submission.service"
import { setCurrentForm } from "../../redux/reducers/formSlice.reducer"

interface Props {
    formId: string
    onClose: () => void
    readonly?: boolean
}

const FormViewer: React.FC<Props> = ({ formId, onClose, readonly: readonlyProp }) => {
    const { classId } = useParams()
    const [originalSubmission, setOriginalSubmission] = useState<{
        answer: UpdateSubmissionAnswer[],
        answer_checkbox: UpdateSubmissionAnswerCheckbox[]
    }>()

    const [submission, setSubmission] = useState<{
        answer: UpdateSubmissionAnswer[],
        answer_checkbox: UpdateSubmissionAnswerCheckbox[]
    }>()

    const dispatch = useDispatch()

    const userData = useSelector((state: RootState) => state.auth.user.info)
    const currentForm = useSelector((state: RootState) => state.form.currentForm)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const currentSubmission = useSelector((state: RootState) => state.submission.currentSubmission)

    useEffect(() => {
        if (!classId || !userData.id) return
        (async () => {
            dispatch(changeStateFetching(true))

            Promise.all([
                FormsService.getFormDetail(classId, formId),
                SubmissionService.getOneSubmission(classId, formId, userData.id)
            ]).finally(() => {
                dispatch(changeStateFetching(false))
            })

        })()
    }, [formId, userData.id])

    // Imbed if there is a submission's existance
    useEffect(() => {
        if (!currentForm) return

        const imbedSubmission = (): { answer: UpdateSubmissionAnswer[], answer_checkbox: UpdateSubmissionAnswerCheckbox[] } => ({
            answer: currentForm.fields.map((f) => {
                if (currentSubmission) {
                    const currentSubmissionAnswer = currentSubmission.answers

                    const getAnswer = currentSubmissionAnswer.find((sub) => sub.field.id === f.id)
                    if (getAnswer) {
                        return {
                            id: getAnswer ? getAnswer.id : undefined,
                            fieldId: getAnswer ? getAnswer.field.id : f.id,
                            body: getAnswer ? getAnswer.body : "",
                            file_name: getAnswer && getAnswer.file_name ? getAnswer.file_name : "",
                            input_type: f.input_type
                        }
                    }
                }

                return {
                    fieldId: f.id,
                    body: "",
                    file_name: "",
                    input_type: f.input_type
                }
            }),
            answer_checkbox: currentForm.checkboxFields.map((f) => {
                if (currentSubmission) {
                    const currentSubmissionAnswerCheckbox = currentSubmission.checkboxes

                    const getAnswer = currentSubmissionAnswerCheckbox.find((sub) => sub.checkboxField.id === f.id)
                    if (getAnswer) {
                        return {
                            id: getAnswer ? getAnswer.id : undefined,
                            fieldChoicesId: getAnswer ? getAnswer.fieldChoices.id : "",
                            checkboxFieldId: f.id
                        }
                    }
                }

                return {
                    fieldChoicesId: "",
                    checkboxFieldId: f.id
                }
            })
        })

        setSubmission(imbedSubmission());
        setOriginalSubmission(imbedSubmission());

    }, [currentForm, currentSubmission])

    if (!currentForm) return

    const readonly = readonlyProp ?? (currentForm.is_stopped || (!!currentForm.close_at && new Date(currentForm.close_at) < new Date()))

    const isDataChanged = JSON.stringify(originalSubmission) !== JSON.stringify(submission);

    const handleClose = () => {
        if (!readonly && isDataChanged) {
            confirmDialog({
                header: "Bỏ dữ liệu đã nhập?",
                message: "Dữ liệu bạn đã nhập sẽ mất nếu đóng biểu mẫu",
                acceptLabel: "Đóng biểu mẫu", rejectLabel: "Tiếp tục nhập",
                accept: () => {
                    onClose()
                    removeFile()
                    dispatch(setCurrentForm(null))
                },
            })
        } else {
            onClose()
            dispatch(setCurrentForm(null))
        }
    }

    const handleChange = (fieldId: string, fieldType: "checkbox" | "normal", value: string, fileName?: string) => {
        if (!submission) return;

        setSubmission((prev) => {
            if (!prev) return prev;

            if (fieldType === "checkbox") {
                // Cập nhật mảng answer_checkbox
                const newAnswerCheckbox = prev.answer_checkbox.map((item) =>
                    item.checkboxFieldId === fieldId
                        ? { ...item, fieldChoicesId: value } // Tạo bản sao mới cho item thay đổi
                        : item // Giữ nguyên các item khác
                );

                return { ...prev, answer_checkbox: newAnswerCheckbox };
            } else {
                // Cập nhật mảng answer
                const newAnswer = prev.answer.map((item) =>
                    item.fieldId === fieldId
                        ? { ...item, body: value, file_name: fileName ? fileName : "" } // Tạo bản sao mới cho item thay đổi
                        : item
                );

                return { ...prev, answer: newAnswer };
            }
        });
    };

    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>, fieldId: string, fieldType: "checkbox" | "normal", value: string) => {
        const file = event.target.files?.[0]

        if (file) {
            const fileSizeInBytes = file.size;
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

            if (fileSizeInMB > 50) {
                toast.error("File không được vượt quá 50MB!");
                return
            }

            // Gọi uploadfile => Lưu URL (truyền vào value cho handleChange)
            const oldFile = submission?.answer.find(a => a.input_type === Field_Type.FILE && a.fieldId === fieldId)

            dispatch(changeStateFetching(true))

            const urlFile = await SubmissionService.uploadFile(file, oldFile && oldFile.body !== null ? oldFile.body : undefined).finally(() => {
                dispatch(changeStateFetching(false))
            })

            if (urlFile) {
                handleChange(fieldId, fieldType, urlFile, file.name)
            }


        }
    }

    const removeFile = async (urls?: string[]) => { // There is not parameter => Remove all file
        if (!urls || urls.length === 0) {
            // Remove all
            const removeUrls: string[] = []

            submission?.answer.forEach(a => {
                if (a.input_type === Field_Type.FILE && a.body) {
                    removeUrls.push(a.body)
                }
            })

            if (removeUrls.length > 0) {
                dispatch(changeStateFetching(true))

                await SubmissionService.removeFiles(removeUrls).finally(() => {
                    dispatch(changeStateFetching(false))
                })
            }


        } else {
            dispatch(changeStateFetching(true))

            await SubmissionService.removeFiles(urls).finally(() => {
                dispatch(changeStateFetching(false))
            })
        }
    }

    const handleSave = async () => {
        if (!submission || !isDataChanged) return
        const dataForUpdate: UpdateSubmission = {
            answer: submission.answer,
            answer_checkbox: submission.answer_checkbox,
            formId: currentForm.id
        }

        if (currentSubmission) {
            dataForUpdate.id = currentSubmission.id
        }

        await SubmissionService.updateSubmission(dataForUpdate)
    }

    // Merge and sort all fields by index
    const allFields = [
        ...currentForm.fields.filter(f => !f.is_deleted).map(f => ({ kind: "normal" as const, index: Number(f.index), data: f })),
        ...currentForm.checkboxFields.filter(f => !f.is_deleted).map(f => ({ kind: "checkbox" as const, index: Number(f.index), data: f })),
    ].sort((a, b) => a.index - b.index)

    if (!submission) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8 px-4">
            <div className="w-full max-w-2xl flex flex-col gap-4 bg-lighterGray dark:bg-[#1e1e1e] rounded-normal p-5 shadow-[0_8px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.6)]">

                {/* Header */}
                <div className="bg-white dark:bg-lightDark rounded-normal overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
                    <div className="h-2.5 bg-mainColor w-full" />

                    <div className="px-6 py-5 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <h1 className="text-bigSize font-bold dark:text-white leading-tight">{currentForm.label}</h1>

                                {currentForm.description && <p className="text-smallSize text-gray leading-relaxed">{currentForm.description}</p>}
                            </div>

                            <button onClick={handleClose} className="p-1.5 rounded-normal hover:bg-gray/10 transition-colors shrink-0 mt-0.5 disableState" disabled={isFetching}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-gray">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col justify-center-safe gap-3 flex-wrap pt-2 border-t border-lightGray/20 dark:border-white/5">
                            {currentForm.is_join_form && <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-500 text-tinySize font-bold rounded-small uppercase">Cung cấp câu trả lời trước khi tham gia lớp</span>}
                            {currentForm.milestone && <span className="text-normalSize dark:text-white">📌 {currentForm.milestone.label}</span>}

                            <span className={`w-fit px-2.5 py-0.5 rounded-small text-tinySize font-bold uppercase ${currentForm.is_stopped ? "bg-redRGB text-red" : "bg-mainColorRGB text-mainColor"}`}>
                                {currentForm.is_stopped ? "Đã đóng" : currentForm.open_at && new Date(currentForm.open_at) > new Date() ? "Đang mở (Sớm hơn dự kiến)" : "Đang mở"}
                            </span>

                            <span className="flex flex-col">
                                {currentForm.open_at && <span className="text-smallSize text-gray">⏰ Tự động mở: <span className="text-mainColor font-medium">{formatVNTime(currentForm.open_at)}</span></span>}
                                {currentForm.close_at && <span className="text-smallSize text-gray">⏰ Tự động đóng: <span className="text-red font-medium">{formatVNTime(currentForm.close_at)}</span></span>}
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

                            {item.kind === "normal" && item.data.input_type !== Field_Type.FILE && (
                                <input
                                    type={item.data.input_type === Field_Type.NUMBER ? "number" : "text"}
                                    placeholder={"Câu trả lời của bạn"}
                                    value={submission.answer.find(a => a.fieldId === item.data.id)?.body ?? ""}
                                    onChange={e => !readonly && handleChange(item.data.id, item.kind, e.target.value)}
                                    readOnly={readonly}
                                    disabled={isFetching}
                                    className={`w-full bg-transparent border-b-2 border-lightGray dark:border-white/20 pb-1.5 text-smallSize dark:text-white outline-none transition-colors placeholder:text-gray/60 ${readonly ? "cursor-not-allowed text-gray" : "focus:border-mainColor"} disableState`}
                                />
                            )}

                            {item.kind === "normal" && item.data.input_type === Field_Type.FILE && (
                                <div className="flex flex-col gap-1.5">

                                    <label className={`flex items-center gap-3 px-4 py-3 rounded-normal border-2 border-dashed border-lightGray dark:border-white/10 bg-lighterGray dark:bg-bgDark w-fit transition-colors ${readonly ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-mainColor"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 stroke-gray shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                        </svg>

                                        <span className="text-smallSize text-gray">
                                            {submission && submission.answer.find(a => a.fieldId === item.data.id && a.input_type === Field_Type.FILE)?.file_name || "Chọn tệp PDF..."}
                                        </span>

                                        <input type="file" accept=".pdf" disabled={readonly} className="hidden" onChange={e => !readonly && uploadFile(e, item.data.id, item.kind, e.target.files?.[0]?.name || "")} />

                                    </label>

                                    {(() => {
                                        const answer = submission.answer.find(a => a.fieldId === item.data.id)

                                        if (answer && answer.body) {
                                            return <a href={answer.body} target="_blank" rel="noopener noreferrer" className="dark:text-mainColor underline italic">Xem file</a>
                                        } else {
                                            return <p className="text-red italic text-smallSize animate-pulse">Dung lượng file tối đa 50MB</p>
                                        }
                                    })()}

                                </div>
                            )}

                            {item.kind === "checkbox" && (
                                <div className="flex flex-col gap-2">
                                    {item.data.checkbox_field_choices.map((choice, ci) => {
                                        const isSelected = submission.answer_checkbox.some(a => a.checkboxFieldId === item.data.id && a.fieldChoicesId === choice.id)

                                        return (
                                            <label key={ci} className={`flex items-center gap-3 ${readonly ? "cursor-not-allowed" : "cursor-pointer"} group/choice`}>
                                                <div
                                                    onClick={() => !readonly && !isFetching && !currentForm.is_stopped && handleChange(item.data.id, item.kind, choice.id)}
                                                    className={`size-5 shrink-0 border-2 transition-colors flex items-center justify-center ${item.data.is_multiple ? "rounded-small" : "rounded-full"} ${isSelected ? "border-mainColor bg-mainColor" : "border-gray/40 group-hover/choice:border-mainColor"} disableState`}
                                                >
                                                    {isSelected && (
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
                {!readonly && !currentForm.is_stopped && (
                    <div className="bg-white dark:bg-lightDark rounded-normal px-6 py-4 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                        <button
                            className="px-6 py-2 bg-mainColor text-white rounded-normal text-smallSize font-medium hoverBtn disableState"
                            disabled={isFetching || readonly || currentForm.is_stopped || !isDataChanged}
                            onClick={handleSave}
                        >
                            Nộp
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FormViewer
