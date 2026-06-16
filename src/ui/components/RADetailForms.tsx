import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Field_Label, Field_Type, Unit, VNFieldLabel, VNUnit } from "../../config/enum";
import { FormsService } from "../../services/forms/forms.service";
import { changeStateFetching } from "../../redux/reducers/global.reducer";
import { ScaleLoader } from "react-spinners";
import { toast } from "sonner";
import { confirmDialog } from "primereact/confirmdialog";
import ProgressService from "../../services/progress/progress.service";
import type { MilestoneShortDetail } from "../../services/progress/progress.type";
import FormViewer from "./FormViewer";
import formatVNTime from "../../utils/formatVNTime";

const RADetailForms: React.FC = () => {
    const { classId, formId } = useParams<{ classId: string; formId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching);
    const currentForm = useSelector((state: RootState) => state.form.currentForm);
    const currentProgress = useSelector((state: RootState) => state.progress.currentProgress);

    const [isEdit, setIsEdit] = useState<boolean>(!formId);
    const [formType, setFormType] = useState<'join' | 'milestone' | null>(!formId ? null : undefined as any);
    const [milestoneId, setMilestoneId] = useState<string | null>(null);
    const [milestoneList, setMilestoneList] = useState<MilestoneShortDetail[]>([]);

    const [formInfo, setFormInfo] = useState<any>({
        label: "",
        description: "",
        is_auto_open: false,
        is_auto_close: false,
        open_at: null,
        close_at: null,
    });

    const [allFields, setAllFields] = useState<any[]>([]);
    const [submissionSearch] = useState<string>("");
    const [showPreview, setShowPreview] = useState(false);
    const [formOriginalState, setFormOriginalState] = useState<boolean>() // Open and close the current form automaticaly when original state is true

    useEffect(() => {
        if (formId && classId) {
            fetchDetail();
        }
    }, [formId, classId]);

    useEffect(() => {
        if (currentForm && formId) {
            setFormInfo({
                label: currentForm.label,
                description: currentForm.description || "",
                is_auto_open: currentForm.is_auto_open,
                is_auto_close: currentForm.is_auto_close,
                open_at: currentForm.open_at,
                close_at: currentForm.close_at,
            });

            if (!isEdit) setFormType(currentForm.is_join_form ? 'join' : 'milestone');

            if (currentForm.milestone) setMilestoneId(currentForm.milestone.id);

            const mergedFields = [
                ...currentForm.fields.map(f => ({ ...f, uiType: 'regular', fieldId: f.id, field_label: f.label ?? Field_Label.NULL, tempId: Math.random() })),
                ...currentForm.checkboxFields.map(cf => ({ ...cf, uiType: 'checkbox', checkboxFieldId: cf.id, tempId: Math.random(), checkbox_field_choices: [...cf.checkbox_field_choices].sort((a, b) => parseInt(a.index) - parseInt(b.index)) }))
            ].sort((a, b) => parseInt(a.index) - parseInt(b.index));

            setAllFields(mergedFields);
        }
    }, [currentForm, formId, isEdit]);

    useEffect(() => {
        if (formType !== 'milestone' || !classId) return;
        const fetchMilestones = async () => {
            let progressId = currentProgress?.id;

            if (!progressId) {
                const result = await ProgressService.getProgressDetail(classId);
                if (!result || typeof result === 'boolean') return;
                progressId = result.id;
            }

            const result = await ProgressService.getMilestones(classId, progressId, '1', '100');
            if (result && typeof result !== 'boolean') setMilestoneList(result.data);
        };
        fetchMilestones();
    }, [formType, classId]);

    const formatToInputDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        const pad = (n: number) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    const formatToInputTime = (dateStr: string | null | undefined) => {
        if (!dateStr) return "";

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";

        const pad = (n: number) => n < 10 ? '0' + n : n;
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const mergeDateTimeToISO = (dateVal: string, timeVal: string) => {
        if (!dateVal) return null;

        const offset = -new Date().getTimezoneOffset();
        const sign = offset >= 0 ? '+' : '-';
        const pad = (n: number) => String(Math.abs(Math.floor(n))).padStart(2, '0');

        return `${dateVal}T${timeVal || '00:00'}:00${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
    };


    const fetchDetail = async () => {
        if (!classId || !formId) return;

        dispatch(changeStateFetching(true));

        await FormsService.getFormDetail(classId, formId).finally(() => {
            dispatch(changeStateFetching(false));
        });
    };

    const addRegularField = () => {
        setAllFields([...allFields, {
            uiType: 'regular', tempId: Math.random(), index: (allFields.length + 1).toString(),
            label: "", title: "", description: "", input_type: Field_Type.STRING,
            field_label: Field_Label.NULL,
            is_deleted: false, is_required: true, unit: Unit.CHARACTER, max_attempts: "255", min_attempts: "1"
        }]);
    };

    const addCheckboxField = () => {
        setAllFields([...allFields, {
            uiType: 'checkbox', tempId: Math.random(), index: (allFields.length + 1).toString(),
            title: "", description: "", input_type: Field_Type.CHECKBOX,
            choice_count: "1", is_deleted: false, is_required: true, is_multiple: false,
            checkbox_field_choices: [{ index: "1", body: "Lựa chọn 1", tempId: Math.random() }]
        }]);
    };

    const handleTypeChange = (idx: number, type: string) => {
        const n = [...allFields];
        let unit = Unit.CHARACTER;

        if (type === Field_Type.NUMBER) unit = Unit.UNIT;
        if (type === Field_Type.FILE) unit = Unit.FILE;

        n[idx] = { ...n[idx], input_type: type, unit: unit };

        if (type === Field_Type.FILE) {
            n[idx].max_attempts = '1';
            n[idx].min_attempts = '1';
        }
        setAllFields(n);
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
        const newFields = [...allFields];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= newFields.length) return;

        const [movedItem] = newFields.splice(index, 1);

        newFields.splice(newIndex, 0, movedItem);
        setAllFields(newFields.map((f, i) => ({ ...f, index: (i + 1).toString() })));
    };

    const moveChoice = (fIdx: number, cIdx: number, direction: 'up' | 'down') => {
        const newFields = [...allFields];
        const choices = [...newFields[fIdx].checkbox_field_choices];
        const newCIdx = direction === 'up' ? cIdx - 1 : cIdx + 1;

        if (newCIdx < 0 || newCIdx >= choices.length) return;

        const [movedChoice] = choices.splice(cIdx, 1);
        choices.splice(newCIdx, 0, movedChoice);

        newFields[fIdx] = { ...newFields[fIdx], checkbox_field_choices: choices.map((c, i) => ({ ...c, index: (i + 1).toString() })) };
        setAllFields(newFields);
    };

    const handleDelete = () => {
        confirmDialog({
            header: "Xóa biểu mẫu",
            message: "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: async () => {
                if (!formId || !classId) return;
                dispatch(changeStateFetching(true));
                const result = await FormsService.removeForms([formId]).finally(() => dispatch(changeStateFetching(false)));
                if (result) navigate(`/main/roomadmin/class/${classId}/forms`);
            }
        });
    };

    const toggleStop = async () => {
        if (!classId || !formId) return

        dispatch(changeStateFetching(true))

        await FormsService.toggleStop(formId, classId).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    const toggleEditMode = async (isEditMode: boolean) => {

        if (isEditMode) {
            setFormType(null)
        } else {
            setFormType(currentForm?.is_join_form ? 'join' : 'milestone')
        }

        setIsEdit(isEditMode)

        if (!currentForm?.is_stopped) {
            setFormOriginalState(true)
            await toggleStop()
        } else if (formOriginalState) {
            setFormOriginalState(false)
            await toggleStop()
        }
    }

    const handleSave = async () => {
        if (!formInfo.label.trim()) return toast.error("Vui lòng nhập tiêu đề");
        if (formType === 'milestone' && !milestoneId) return toast.error("Vui lòng chọn cột mốc");
        if (allFields.length === 0) return toast.error("Biểu mẫu cần có ít nhất 1 trường");

        const usedLabels = allFields
            .filter(f => f.uiType === 'regular' && f.input_type === Field_Type.FILE && f.field_label && f.field_label !== Field_Label.NULL)
            .map(f => f.field_label);
        if (usedLabels.length !== new Set(usedLabels).size) return toast.error("Mỗi nhãn file chỉ được dùng một lần");

        const payload: any = {
            classId, label: formInfo.label, description: formInfo.description,
            field_count: allFields.length.toString(),
            is_auto_open: Boolean(formInfo.is_auto_open),
            is_auto_close: Boolean(formInfo.is_auto_close),
            is_join_form: formType === 'join',
            open_at: formInfo.open_at, close_at: formInfo.close_at,
            fields: [], checkboxFields: []
        };

        if (formType === 'milestone' && milestoneId) payload.milestoneId = milestoneId;

        if (formId) payload.formId = formId;

        allFields.forEach((f, i) => {
            const common = { index: (i + 1).toString(), description: f.description || "", is_required: f.is_required, input_type: f.input_type };
            if (f.uiType === 'regular') {
                const item: any = { ...common, title: f.title, unit: f.unit, max_attempts: f.max_attempts.toString(), min_attempts: f.min_attempts.toString(), label: f.input_type === Field_Type.FILE ? (f.field_label ?? Field_Label.NULL) : Field_Label.NULL };

                if (formId && f.fieldId) item.fieldId = f.fieldId;
                payload.fields.push(item);
            } else {
                const item: any = {
                    ...common, title: f.title, is_multiple: f.is_multiple, choice_count: f.checkbox_field_choices.length.toString(), checkbox_field_choices: f.checkbox_field_choices.map((c: any, ci: number) => {
                        const choice: any = { index: (ci + 1).toString(), body: c.body };
                        if (formId && (c.choiceId || c.id)) choice.choiceId = c.choiceId || c.id;
                        return choice;
                    })
                };

                if (formId && f.checkboxFieldId) item.checkboxFieldId = f.checkboxFieldId;
                payload.checkboxFields.push(item);
            }
        });


        dispatch(changeStateFetching(true))
        console.log(payload)

        await FormsService.updateForm(payload)
            .then((result) => {
                if (result) {
                    if (!formId) navigate(`/main/roomadmin/class/${classId}/forms`);
                    else setIsEdit(false);
                }
            })
            .finally(() => {
                dispatch(changeStateFetching(false))
            })
    };

    return (
        <div className="w-full flex flex-col gap-6 py-mainTwoSidePadding min-h-screen">
            {showPreview && currentForm && <FormViewer formId={currentForm.id} onClose={() => setShowPreview(false)} readonly />}

            <div className="w-full flex justify-between items-center bg-white dark:bg-lightDark p-4 rounded-normal shadow-[0_0_20px_rgba(128,128,128,0.1)] sticky top-0 z-30 border-[0.5px] border-lightGray/20">
                <div className="flex flex-col">
                    <h1 className="text-largeSize font-bold dark:text-white">{formId ? (isEdit ? "Chỉnh sửa biểu mẫu" : "Chi tiết biểu mẫu") : "Tạo biểu mẫu mới"}</h1>
                    <p className="text-[11px] text-gray uppercase font-bold tracking-widest">{formId ? `ID: ${formId}` : "Khởi tạo"}</p>
                </div>
                <div className="flex items-center gap-3">
                    {isFetching && <ScaleLoader height={10} width={4} color="#499c40" />}
                    <div className="flex gap-2">
                        {formId && !isEdit ? (
                            <>
                                <button onClick={() => setShowPreview(true)} disabled={isFetching} className="px-4 py-2 border-[0.5px] border-lightGray dark:text-white rounded-normal font-bold hoverBtn text-smallSize disableState">
                                    Xem trước
                                </button>

                                <button className={`px-4 py-2 border-[0.5px] rounded-normal font-bold hoverBtn text-smallSize disableState ${currentForm?.is_stopped ? 'border-mainColor text-mainColor' : 'border-red/50 text-red'}`} onClick={toggleStop} disabled={isFetching}>
                                    {currentForm?.is_stopped ? 'Mở biểu mẫu' : 'Đóng biểu mẫu'}
                                </button>
                                <button onClick={() => handleDelete()} disabled={isFetching} className="px-4 py-2 border-[0.5px] border-red/50 text-red rounded-normal font-bold hoverBtn text-smallSize disableState">Xóa</button>
                                <button onClick={() => { toggleEditMode(true) }} disabled={isFetching} className="bg-mainColor text-white px-6 py-2 rounded-normal font-bold hoverBtn shadow-md flex items-center gap-2 transition-all disableState">Chỉnh sửa</button>
                            </>
                        ) : (
                            <>
                                {formId && <button onClick={() => { toggleEditMode(false) }} disabled={isFetching} className="px-5 py-2 border-[0.5px] border-lightGray rounded-normal font-bold dark:text-white hoverBtn disableState">Hủy</button>}
                                {!formId && formType !== null && <button onClick={() => setFormType(null)} disabled={isFetching} className="px-5 py-2 border-[0.5px] border-lightGray rounded-normal font-bold dark:text-white hoverBtn disableState">Đổi loại biểu mẫu</button>}
                                {formType !== null && <button onClick={handleSave} disabled={isFetching} className="bg-mainColor text-white px-6 py-2 rounded-normal font-bold hoverBtn shadow-md disableState">Lưu dữ liệu</button>}
                            </>
                        )}
                    </div>
                </div>
            </div>


            {isEdit && formType === null && (
                <div className="flex flex-col items-center justify-center gap-6 py-16">
                    <div className="flex flex-col items-center gap-1">
                        <p className="font-bold text-largeSize dark:text-white">{formId ? "Loại biểu mẫu" : "Chọn loại biểu mẫu"}</p>
                        {formId && <p className="text-smallSize text-gray">Biểu mẫu: <span className={`font-bold text-normalSize ${currentForm?.is_join_form ? 'text-mainColor' : 'text-blue-500'}`}>{currentForm?.label}</span></p>}
                        <p className="text-smallSize text-gray">{formId ? "Xác nhận loại biểu mẫu để tiếp tục" : "Chọn loại phù hợp với mục đích sử dụng"}</p>
                    </div>

                    <div className="flex gap-6">
                        {(() => {
                            const currentType = currentForm?.is_join_form ? 'join' : 'milestone';

                            return <>
                                <button onClick={() => setFormType('join')} className={`flex flex-col items-center gap-3 p-8 rounded-normal border-2 transition-all w-56 group ${formId && currentType === 'join' ? 'border-mainColor bg-mainColor/5' : 'border-lightGray/30 hover:border-mainColor hover:bg-mainColor/5'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`size-10 transition-colors ${formId && currentType === 'join' ? 'stroke-mainColor' : 'stroke-gray group-hover:stroke-mainColor dark:stroke-white'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                                    <div className="flex flex-col items-center gap-1">
                                        <p className={`font-bold dark:text-white transition-colors ${formId && currentType === 'join' ? 'text-mainColor' : 'group-hover:text-mainColor'}`}>Form tham gia lớp</p>
                                        <p className="text-[11px] text-gray text-center">Học sinh điền khi tham gia lớp học</p>
                                        {formId && currentType === 'join' && <span className="text-[10px] font-black text-mainColor uppercase tracking-widest mt-1">Hiện tại</span>}
                                    </div>
                                </button>

                                <button onClick={() => setFormType('milestone')} className={`flex flex-col items-center gap-3 p-8 rounded-normal border-2 transition-all w-56 group ${formId && currentType === 'milestone' ? 'border-blue-500 bg-blue-500/5' : 'border-lightGray/30 hover:border-blue-500 hover:bg-blue-500/5'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`size-10 transition-colors ${formId && currentType === 'milestone' ? 'stroke-blue-500' : 'stroke-gray group-hover:stroke-blue-500 dark:stroke-white'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" /></svg>
                                    <div className="flex flex-col items-center gap-1">
                                        <p className={`font-bold dark:text-white transition-colors ${formId && currentType === 'milestone' ? 'text-blue-500' : 'group-hover:text-blue-500'}`}>Form theo cột mốc</p>
                                        <p className="text-[11px] text-gray text-center">Gắn với một cột mốc trong quy trình</p>
                                        {formId && currentType === 'milestone' && <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Hiện tại</span>}
                                    </div>
                                </button>
                            </>
                        })()}
                    </div>
                </div>
            )}

            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isEdit && formType === null ? 'hidden' : ''}`}>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="flex flex-col gap-6 sticky top-28">
                        <div className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-sm border-[0.5px] border-lightGray/20 flex flex-col gap-5 transition-all">
                            <p className="font-bold text-normalSize dark:text-white border-b border-lightGray/10 pb-2 uppercase tracking-tighter">Thông tin chung</p>

                            <div className="flex flex-col gap-4">
                                <span className="flex flex-col gap-1.5">
                                    <p className="font-bold text-smallSize dark:text-white opacity-60 uppercase">Tiêu đề</p>
                                    {isEdit ? <input type="text" disabled={isFetching} placeholder="Nhập tiêu đề biểu mẫu..." className="w-full border-b border-lightGray px-1 py-1.5 dark:text-white outline-none focus:border-mainColor bg-transparent text-normalSize font-bold disableState" value={formInfo.label} onChange={(e) => setFormInfo({ ...formInfo, label: e.target.value })} /> : <p className="text-normalSize font-bold dark:text-white py-1">{formInfo.label}</p>}
                                </span>

                                <span className="flex flex-col gap-1.5">
                                    <p className="font-bold text-smallSize dark:text-white opacity-60 uppercase">Mô tả</p>
                                    {isEdit ? <textarea rows={4} disabled={isFetching} placeholder="Nhập mô tả biểu mẫu..." className="w-full border border-lightGray rounded-small px-3 py-2 dark:text-white outline-none focus:border-mainColor bg-transparent resize-none text-smallSize disableState" value={formInfo.description} onChange={(e) => setFormInfo({ ...formInfo, description: e.target.value })} /> : <p className="text-smallSize dark:text-white leading-relaxed">{formInfo.description || "Không có mô tả"}</p>}
                                </span>
                            </div>
                        </div>
                        {formType === 'milestone' && (
                            <div className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-sm border-[0.5px] border-lightGray/20 flex flex-col gap-4 transition-all">
                                <p className="font-bold text-normalSize dark:text-white border-b border-lightGray/10 pb-2 uppercase tracking-tighter">Cột mốc</p>
                                {isEdit ? (
                                    <select
                                        disabled={isFetching}
                                        className="w-full border border-lightGray rounded-small px-3 py-2 dark:text-white outline-none focus:border-mainColor bg-transparent text-smallSize font-bold cursor-pointer disableState"
                                        value={milestoneId || ""}
                                        onChange={(e) => setMilestoneId(e.target.value || null)}
                                    >
                                        <option value="">-- Chọn cột mốc --</option>
                                        {milestoneList.map(m => (
                                            <option key={m.id} value={m.id} disabled={m.is_stopped}>
                                                {m.index}. {m.label}{m.is_stopped ? ' (Đã dừng)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-smallSize dark:text-white font-bold">
                                        {currentForm?.milestone?.label || "Chưa gắn cột mốc"}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-sm border-[0.5px] border-lightGray/20 flex flex-col gap-4 transition-all">
                            <p className="font-bold text-normalSize dark:text-white border-b border-lightGray/10 pb-2 uppercase tracking-tighter">Thời hạn</p>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between"><p className="text-smallSize dark:text-white font-bold uppercase">Mở tự động</p>{isEdit ? <input type="checkbox" checked={formInfo.is_auto_open} onChange={(e) => setFormInfo({ ...formInfo, is_auto_open: e.target.checked })} className="size-5 accent-mainColor" /> : <p className="text-[11px] font-bold text-mainColor">{formInfo.is_auto_open ? "BẬT" : "TẮT"}</p>}</div>

                                {formInfo.is_auto_open && (
                                    isEdit ? (
                                        <div className="flex gap-2">
                                            <input type="date" className="flex-1 border border-lightGray rounded-small px-3 py-2 dark:text-white outline-none text-smallSize focus:border-mainColor bg-transparent" value={formatToInputDate(formInfo.open_at)} onChange={(e) => setFormInfo({ ...formInfo, open_at: mergeDateTimeToISO(e.target.value, formatToInputTime(formInfo.open_at)) })} />
                                            <input type="time" disabled={!formatToInputDate(formInfo.open_at)} className="border border-lightGray rounded-small px-3 py-2 dark:text-white outline-none text-smallSize focus:border-mainColor bg-transparent disabled:opacity-30" value={formatToInputTime(formInfo.open_at)} onChange={(e) => setFormInfo({ ...formInfo, open_at: mergeDateTimeToISO(formatToInputDate(formInfo.open_at), e.target.value) })} /></div>
                                    ) :
                                        <p className="text-smallSize dark:text-white opacity-70 italic">{formInfo.open_at ? formatVNTime(formInfo.open_at) : "Chưa thiết lập"}</p>
                                )}

                                <div className="flex items-center justify-between mt-1"><p className="text-smallSize dark:text-white font-bold uppercase">Đóng tự động</p>{isEdit ? <input type="checkbox" checked={formInfo.is_auto_close} onChange={(e) => setFormInfo({ ...formInfo, is_auto_close: e.target.checked })} className="size-5 accent-mainColor" /> : <p className="text-[11px] font-bold text-red">{formInfo.is_auto_close ? "BẬT" : "TẮT"}</p>}</div>

                                {formInfo.is_auto_close && (
                                    isEdit ? (
                                        <div className="flex gap-2"><input type="date" className="flex-1 border border-lightGray rounded-small px-3 py-2 dark:text-white outline-none text-smallSize focus:border-mainColor bg-transparent" value={formatToInputDate(formInfo.close_at)} onChange={(e) => setFormInfo({ ...formInfo, close_at: mergeDateTimeToISO(e.target.value, formatToInputTime(formInfo.close_at)) })} />
                                            <input type="time" disabled={!formatToInputDate(formInfo.close_at)} className="border border-lightGray rounded-small px-3 py-2 dark:text-white outline-none text-smallSize focus:border-mainColor bg-transparent disabled:opacity-30" value={formatToInputTime(formInfo.close_at)} onChange={(e) => setFormInfo({ ...formInfo, close_at: mergeDateTimeToISO(formatToInputDate(formInfo.close_at), e.target.value) })} /></div>
                                    ) :
                                        <p className="text-smallSize dark:text-white opacity-70 italic">{formInfo.close_at ? formatVNTime(formInfo.close_at) : "Chưa thiết lập"}</p>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-6">
                    {formId && !isEdit && (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-sm border-[0.5px] border-lightGray/20 flex flex-col gap-5 transition-all">
                                <p className="font-bold text-normalSize dark:text-white border-b border-lightGray/10 pb-2 uppercase tracking-tighter">Thông tin chung</p>

                                <div className="flex flex-col gap-4">
                                    <span className="flex flex-col gap-1.5">
                                        <p className="font-bold text-smallSize dark:text-white opacity-60 uppercase">Tiêu đề</p>
                                        <p className="text-normalSize font-bold dark:text-white py-1">{formInfo.label}</p>
                                    </span>

                                    <span className="flex flex-col gap-1.5">
                                        <p className="font-bold text-smallSize dark:text-white opacity-60 uppercase">Mô tả</p>
                                        <p className="text-smallSize dark:text-white leading-relaxed">{formInfo.description || "Không có mô tả"}</p>
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-sm border-[0.5px] border-lightGray/20 flex flex-col gap-4 transition-all">
                                <p className="font-bold text-normalSize dark:text-white border-b border-lightGray/10 pb-2 uppercase tracking-tighter">Thời hạn</p>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between"><p className="text-smallSize dark:text-white font-bold uppercase">Mở tự động</p><p className="text-[11px] font-bold text-mainColor">{formInfo.is_auto_open ? "BẬT" : "TẮT"}</p></div>
                                    {formInfo.is_auto_open && <p className="text-smallSize dark:text-white opacity-70 italic">{formInfo.open_at ? formatVNTime(formInfo.open_at) : "Chưa thiết lập"}</p>}

                                    <div className="flex items-center justify-between mt-1"><p className="text-smallSize dark:text-white font-bold uppercase">Đóng tự động</p><p className="text-[11px] font-bold text-red">{formInfo.is_auto_close ? "BẬT" : "TẮT"}</p></div>
                                    {formInfo.is_auto_close && <p className="text-smallSize dark:text-white opacity-70 italic">{formInfo.close_at ? formatVNTime(formInfo.close_at) : "Chưa thiết lập"}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-[0_0_20px_rgba(128,128,128,0.25)] flex flex-col gap-5 min-h-[600px] border-[0.5px] border-lightGray/20">
                            <div className="flex justify-between items-center border-b border-lightGray/10 pb-3">
                                <h3 className="font-bold dark:text-white text-normalSize uppercase tracking-wide">{isEdit ? `Thiết kế biểu mẫu (${allFields.length})` : "Danh sách trường"}</h3>
                                {isEdit && (
                                    <div className="flex gap-2">
                                        <button onClick={addRegularField} disabled={isFetching} className="text-smallSize font-bold text-mainColor border-[0.5px] border-mainColor px-3 py-1.5 rounded-small hover:bg-mainColor hover:text-white transition-all disableState">+ TRƯỜNG NHẬP</button>
                                        <button onClick={addCheckboxField} disabled={isFetching} className="text-smallSize font-bold text-blue-500 border-[0.5px] border-blue-500 px-3 py-1.5 rounded-small hover:bg-blue-500 hover:text-white transition-all disableState">+ TRẮC NGHIỆM</button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-6">
                                {allFields.map((field, idx) => (
                                    <div key={field.tempId} className={`p-6 rounded-normal transition-all relative ${isEdit ? 'border-[0.5px] border-lightGray bg-gray/5' : 'bg-white dark:bg-black/10 border-l-4 ' + (field.uiType === 'checkbox' ? 'border-blue-500 shadow-md' : 'border-mainColor shadow-md')}`}>

                                        {isEdit && (
                                            <div className="flex justify-between items-center mb-4">
                                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black text-white ${field.uiType === 'checkbox' ? 'bg-blue-500' : 'bg-mainColor'}`}>#{field.index} - {field.uiType === 'checkbox' ? 'TRẮC NGHIỆM' : field.input_type}</span>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => moveField(idx, 'up')} disabled={idx === 0 || isFetching} className="p-1.5 hover:bg-gray/20 rounded disabled:opacity-10 disableState"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 stroke-lightDark dark:stroke-white"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg></button>
                                                    <button onClick={() => moveField(idx, 'down')} disabled={idx === allFields.length - 1 || isFetching} className="p-1.5 hover:bg-gray/20 rounded disabled:opacity-10 disableState"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 stroke-lightDark dark:stroke-white"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></button>
                                                    <button onClick={() => setAllFields(allFields.filter((_, i) => i !== idx))} disabled={isFetching} className="p-1.5 hover:bg-red/10 rounded ml-1 group/del disableState"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 stroke-lightDark dark:stroke-white group-hover/del:stroke-red"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79" /></svg></button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-4">

                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-normalSize font-bold dark:text-white">{field.title || "Chưa đặt tiêu đề"}</p>
                                                    {field.is_required && <span className="text-red font-bold">*</span>}
                                                </div>
                                                {isEdit ? (
                                                    <div className="flex flex-col gap-3 mt-1">

                                                        <div className="flex items-center gap-3">
                                                            <input type="text" className="flex-1 border-b border-lightGray/50 px-1 py-1 dark:text-white outline-none focus:border-mainColor bg-transparent text-smallSize disableState" value={field.title ?? ""} onChange={(e) => { const n = [...allFields]; n[idx].title = e.target.value; setAllFields(n); }} placeholder="Nhập tiêu đề trường..." />
                                                            <label className="flex items-center gap-2 cursor-pointer shrink-0"><input type="checkbox" checked={field.is_required} onChange={(e) => { const n = [...allFields]; n[idx].is_required = e.target.checked; setAllFields(n); }} className="size-4 accent-mainColor" /><span className="text-[11px] font-bold dark:text-white uppercase">Bắt buộc</span></label>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            {field.uiType === 'regular' ? (
                                                                <select className="flex-1 bg-transparent text-smallSize dark:text-white outline-none border-b border-lightGray/50 py-1 font-bold cursor-pointer" value={field.input_type} onChange={(e) => handleTypeChange(idx, e.target.value)}>
                                                                    <option value={Field_Type.STRING}>Văn bản</option><option value={Field_Type.NUMBER}>Số</option><option value={Field_Type.FILE}>Tập tin</option>
                                                                </select>
                                                            ) : (
                                                                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={field.is_multiple} onChange={(e) => { const n = [...allFields]; n[idx].is_multiple = e.target.checked; setAllFields(n); }} className="size-4 accent-blue-500" /><span className="text-[11px] font-bold text-blue-500 uppercase">Chọn nhiều</span></label>
                                                            )}
                                                            {field.uiType === 'regular' && field.input_type === Field_Type.FILE && (
                                                                <select
                                                                    className="flex-1 bg-transparent text-smallSize dark:text-white outline-none border-b border-lightGray/50 py-1 font-bold cursor-pointer"
                                                                    value={field.field_label ?? Field_Label.NULL}
                                                                    onChange={(e) => { const n = [...allFields]; n[idx].field_label = e.target.value; setAllFields(n); }}
                                                                >
                                                                    {Object.entries(VNFieldLabel).map(([val, name]) => {
                                                                        const usedByOther = allFields.some((f, i) => i !== idx && f.uiType === 'regular' && f.input_type === Field_Type.FILE && f.field_label === val && val !== Field_Label.NULL);
                                                                        return <option key={val} value={val} disabled={usedByOther}>{name}{usedByOther ? ' (đã dùng)' : ''}</option>;
                                                                    })}
                                                                </select>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-smallSize dark:text-white opacity-60 italic">{field.description}</p>
                                                )}
                                            </div>


                                            <div className={`transition-all ${isEdit ? 'bg-white dark:bg-black/20 p-3 rounded border border-lightGray/10' : ''}`}>
                                                {!isEdit ? (
                                                    <div className="mt-2">
                                                        {field.uiType === 'regular' ? (
                                                            <div className="w-full border-b border-lightGray/30 py-2 text-gray italic text-smallSize">Vùng nhập câu trả lời ({field.input_type === Field_Type.FILE ? 'Tập tin' : field.unit})</div>
                                                        ) : (
                                                            <div className="flex flex-col gap-3">
                                                                {field.checkbox_field_choices.map((choice: any, ci: number) => (
                                                                    <div key={ci} className="flex items-center gap-3">
                                                                        <div className={`size-5 rounded-full border-2 border-lightGray flex items-center justify-center shrink-0 ${field.is_multiple ? 'rounded-sm' : ''}`}></div>
                                                                        <p className="text-smallSize dark:text-white">{choice.body}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-3">
                                                        <input type="text" className="w-full bg-transparent text-smallSize dark:text-white outline-none italic opacity-60" value={field.description} onChange={(e) => { const n = [...allFields]; n[idx].description = e.target.value; setAllFields(n); }} placeholder="Hướng dẫn nhập liệu..." />
                                                        {field.uiType === 'regular' && (
                                                            <div className="flex items-center gap-4 text-[11px] pt-2 border-t border-lightGray/10">
                                                                <span className="flex items-center gap-1.5"><p className="font-bold dark:text-white opacity-40 uppercase">Tối thiểu:</p>{field.input_type === Field_Type.FILE ? <p className="font-bold dark:text-white w-10">1</p> : <input type="number" className="bg-transparent dark:text-white outline-none w-10 font-bold border-b border-lightGray/30" value={field.min_attempts} onChange={(e) => { const n = [...allFields]; n[idx].min_attempts = e.target.value; setAllFields(n); }} />}</span>
                                                                <span className="flex items-center gap-1.5"><p className="font-bold dark:text-white opacity-40 uppercase">Tối đa:</p>{field.input_type === Field_Type.FILE ? <p className="font-bold dark:text-white w-12">1</p> : <input type="number" className="bg-transparent dark:text-white outline-none w-12 font-bold border-b border-lightGray/30" value={field.max_attempts} onChange={(e) => { const n = [...allFields]; n[idx].max_attempts = e.target.value; setAllFields(n); }} />}</span>
                                                                <p className="font-black text-mainColor uppercase tracking-widest ml-auto">{VNUnit[field.unit] ?? field.unit}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>


                                            {field.uiType === 'checkbox' && isEdit && (
                                                <div className="flex flex-col gap-2 mt-2 border-t border-blue-500/10 pt-3">
                                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Danh sách lựa chọn</p>
                                                    <div className="flex flex-col gap-2">
                                                        {field.checkbox_field_choices.map((choice: any, cIdx: number) => (
                                                            <div key={choice.tempId || cIdx} className="flex items-center gap-3 bg-white dark:bg-black/40 px-3 py-2 rounded border border-lightGray/30 group/choice shadow-sm hover:border-blue-500 transition-all">
                                                                <span className="text-[10px] font-bold text-gray opacity-40 shrink-0">#{cIdx + 1}</span>
                                                                <input type="text" className="flex-1 text-smallSize outline-none bg-transparent dark:text-white font-medium" value={choice.body} onChange={(e) => { const n = [...allFields]; const nc = [...n[idx].checkbox_field_choices]; nc[cIdx].body = e.target.value; n[idx].checkbox_field_choices = nc; setAllFields(n); }} />
                                                                <div className="flex items-center gap-1 opacity-0 group-hover/choice:opacity-100 transition-opacity">
                                                                    <button onClick={() => moveChoice(idx, cIdx, 'up')} disabled={cIdx === 0} className="p-1 hover:text-blue-500 disabled:opacity-0">&uarr;</button>
                                                                    <button onClick={() => moveChoice(idx, cIdx, 'down')} disabled={cIdx === field.checkbox_field_choices.length - 1} className="p-1 hover:text-blue-500 disabled:opacity-0">&darr;</button>
                                                                    {field.checkbox_field_choices.length > 1 && <button onClick={() => { const n = [...allFields]; n[idx].checkbox_field_choices = n[idx].checkbox_field_choices.filter((_: any, i: number) => i !== cIdx); setAllFields(n); }} className="p-1 text-red font-bold text-lg hover:bg-red/5">&times;</button>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => { const n = [...allFields]; const ni = (n[idx].checkbox_field_choices.length + 1).toString(); n[idx] = { ...n[idx], checkbox_field_choices: [...n[idx].checkbox_field_choices, { index: ni, body: `Lựa chọn ${ni}`, tempId: Math.random() }] }; setAllFields(n); }} className="w-fit text-smallSize font-bold text-blue-500 hover:text-blue-700 transition-all border-b border-dashed border-blue-500/40 mt-1">+ THÊM LỰA CHỌN</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {allFields.length === 0 && <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-24"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-20 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="font-bold text-normalSize uppercase tracking-[0.2em]">Biểu mẫu trống</p></div>}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RADetailForms;