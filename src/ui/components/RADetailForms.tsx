import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Field_Type, Unit } from "../../config/enum";
import { FormsService } from "../../services/forms/forms.service";
import { changeStateFetching } from "../../redux/reducers/global.reducer";
import { ScaleLoader } from "react-spinners";
import { toast } from "sonner";

const RADetailForms: React.FC = () => {
    const { classId, formId } = useParams<{ classId: string; formId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching);
    const currentForm = useSelector((state: RootState) => state.form.currentForm);

    const [isEdit, setIsEdit] = useState<boolean>(!formId);

    const [formInfo, setFormInfo] = useState<any>({
        label: "",
        description: "",
        is_auto_open: true,
        is_auto_close: true,
        open_at: null,
        close_at: null,
    });

    const [allFields, setAllFields] = useState<any[]>([]);
    const [submissionSearch, setSubmissionSearch] = useState<string>("");

    // Mock submissions data
    const mockSubmissions = [
        { id: "1", studentName: "Nguyễn Văn A", submittedAt: "20-03-2024 10:30", status: "graded" },
        { id: "2", studentName: "Trần Thị B", submittedAt: "21-03-2024 14:15", status: "submitted" },
        { id: "3", studentName: "Lê Văn C", submittedAt: "22-03-2024 09:00", status: "pending" },
        { id: "4", studentName: "Phạm Minh D", submittedAt: "22-03-2024 11:20", status: "submitted" },
        { id: "5", studentName: "Hoàng Anh E", submittedAt: "23-03-2024 16:45", status: "graded" },
    ];

    const formatToInputDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        const pad = (n: number) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const formatDisplayDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return "Chưa thiết lập";
        return new Date(dateStr).toLocaleString('vi-VN', { hour12: false });
    };

    const toISOWithTimezone = (value: string) => {
        if (!value) return null;
        const date = new Date(value);
        const tzo = -date.getTimezoneOffset();
        const dif = tzo >= 0 ? '+' : '-';
        const pad = (num: number) => String(Math.floor(Math.abs(num))).padStart(2, '0');
        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + dif + pad(tzo / 60) + ':' + pad(tzo % 60);
    };

    const InfoSection = (
        <div className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-sm border-[0.5px] border-lightGray/20 flex flex-col gap-5 transition-all">
            <p className="font-bold text-normalSize dark:text-white border-b border-lightGray/10 pb-2 uppercase tracking-tighter">Thông tin chung</p>
            <div className="flex flex-col gap-4">
                <span className="flex flex-col gap-1.5">
                    <p className="font-bold text-smallSize dark:text-white opacity-60 uppercase">Tiêu đề</p>
                    {isEdit ? (
                        <input type="text" className="w-full border-b border-lightGray px-1 py-1.5 dark:text-white outline-none focus:border-mainColor bg-transparent text-normalSize font-bold" value={formInfo.label} onChange={(e) => setFormInfo({ ...formInfo, label: e.target.value })} />
                    ) : (
                        <p className="text-normalSize font-bold dark:text-white py-1">{formInfo.label}</p>
                    )}
                </span>
                <span className="flex flex-col gap-1.5">
                    <p className="font-bold text-smallSize dark:text-white opacity-60 uppercase">Mô tả</p>
                    {isEdit ? (
                        <textarea rows={4} className="w-full border border-lightGray rounded-small px-3 py-2 dark:text-white outline-none focus:border-mainColor bg-transparent resize-none text-smallSize" value={formInfo.description} onChange={(e) => setFormInfo({ ...formInfo, description: e.target.value })} />
                    ) : (
                        <p className="text-smallSize dark:text-white leading-relaxed">{formInfo.description || "Không có mô tả"}</p>
                    )}
                </span>
            </div>
        </div>
    );

    const DeadlineSection = (
        <div className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-sm border-[0.5px] border-lightGray/20 flex flex-col gap-4 transition-all">
            <p className="font-bold text-normalSize dark:text-white border-b border-lightGray/10 pb-2 uppercase tracking-tighter">Thời hạn</p>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between"><p className="text-smallSize dark:text-white font-bold uppercase">Mở tự động</p>{isEdit ? <input type="checkbox" checked={formInfo.is_auto_open} onChange={(e) => setFormInfo({ ...formInfo, is_auto_open: e.target.checked })} className="size-5 accent-mainColor" /> : <p className="text-[11px] font-bold text-mainColor">{formInfo.is_auto_open ? "BẬT" : "TẮT"}</p>}</div>
                {formInfo.is_auto_open && (isEdit ? <input type="datetime-local" className="border border-lightGray rounded-small px-3 py-2 dark:text-white outline-none text-smallSize focus:border-mainColor" value={formatToInputDate(formInfo.open_at)} onChange={(e) => setFormInfo({ ...formInfo, open_at: toISOWithTimezone(e.target.value) })} /> : <p className="text-smallSize dark:text-white opacity-70 italic">{formatDisplayDate(formInfo.open_at)}</p>)}
                <div className="flex items-center justify-between mt-1"><p className="text-smallSize dark:text-white font-bold uppercase">Đóng tự động</p>{isEdit ? <input type="checkbox" checked={formInfo.is_auto_close} onChange={(e) => setFormInfo({ ...formInfo, is_auto_close: e.target.checked })} className="size-5 accent-mainColor" /> : <p className="text-[11px] font-bold text-red">{formInfo.is_auto_close ? "BẬT" : "TẮT"}</p>}</div>
                {formInfo.is_auto_close && (isEdit ? <input type="datetime-local" className="border border-lightGray rounded-small px-3 py-2 dark:text-white outline-none text-smallSize focus:border-mainColor" value={formatToInputDate(formInfo.close_at)} onChange={(e) => setFormInfo({ ...formInfo, close_at: toISOWithTimezone(e.target.value) })} /> : <p className="text-smallSize dark:text-white opacity-70 italic">{formatDisplayDate(formInfo.close_at)}</p>)}
            </div>
        </div>
    );

    useEffect(() => {
        if (formId && classId) {
            fetchDetail();
        }
    }, [formId, classId]);

    const fetchDetail = async () => {
        if (!classId || !formId) return;
        dispatch(changeStateFetching(true));
        await FormsService.getFormDetail(classId, formId).finally(() => {
            dispatch(changeStateFetching(false));
        });
    };

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

            const mergedFields = [
                ...currentForm.fields.map(f => ({ ...f, uiType: 'regular', fieldId: f.id, tempId: Math.random() })),
                ...currentForm.checkboxFields.map(cf => ({ ...cf, uiType: 'checkbox', checkboxFieldId: cf.id, tempId: Math.random() }))
            ].sort((a, b) => parseInt(a.index) - parseInt(b.index));

            setAllFields(mergedFields);
        }
    }, [currentForm, formId]);

    const addRegularField = () => {
        setAllFields([...allFields, {
            uiType: 'regular', tempId: Math.random(), index: (allFields.length + 1).toString(),
            label: "", title: "", description: "", input_type: Field_Type.STRING,
            is_deleted: false, is_required: true, unit: Unit.CHARACTER, max_attempts: "255", min_attempts: "1"
        }]);
    };

    const addCheckboxField = () => {
        setAllFields([...allFields, {
            uiType: 'checkbox', tempId: Math.random(), index: (allFields.length + 1).toString(),
            label: "", description: "", input_type: Field_Type.CHECKBOX,
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

    const handleSave = () => {
        if (!formInfo.label.trim()) return toast.error("Vui lòng nhập tiêu đề");
        const payload: any = {
            classId, label: formInfo.label, description: formInfo.description,
            field_count: allFields.length.toString(), is_auto_open: formInfo.is_auto_open,
            is_auto_close: formInfo.is_auto_close, open_at: formInfo.open_at, close_at: formInfo.close_at,
            fields: [], checkboxFields: []
        };
        if (formId) payload.formId = formId;
        allFields.forEach((f, i) => {
            const common = { index: (i + 1).toString(), label: f.label, description: f.description || "", is_deleted: f.is_deleted, is_required: f.is_required, input_type: f.input_type };
            if (f.uiType === 'regular') {
                const item: any = { ...common, title: f.title || f.label, unit: f.unit, max_attempts: f.max_attempts.toString(), min_attempts: f.min_attempts.toString() };
                if (formId && f.fieldId) item.fieldId = f.fieldId;
                payload.fields.push(item);
            } else {
                const item: any = {
                    ...common, is_multiple: f.is_multiple, choice_count: f.checkbox_field_choices.length.toString(), checkbox_field_choices: f.checkbox_field_choices.map((c: any, ci: number) => {
                        const choice: any = { index: (ci + 1).toString(), body: c.body };
                        if (formId && (c.choiceId || c.id)) choice.choiceId = c.choiceId || c.id;
                        return choice;
                    })
                };
                if (formId && f.checkboxFieldId) item.checkboxFieldId = f.checkboxFieldId;
                payload.checkboxFields.push(item);
            }
        });
        console.log("Payload:", payload);
        toast.success("Đã xuất dữ liệu!");
    };

    return (
        <div className="w-full flex flex-col gap-6 py-mainTwoSidePadding min-h-screen">
            {/* Header */}
            <div className="w-full flex justify-between items-center bg-white dark:bg-lightDark p-4 rounded-normal shadow-[0_0_20px_rgba(128,128,128,0.1)] sticky top-0 z-30 border-[0.5px] border-lightGray/20">
                <div className="flex flex-col">
                    <h1 className="text-largeSize font-bold dark:text-white">{formId ? (isEdit ? "Chỉnh sửa biểu mẫu" : "Chi tiết biểu mẫu") : "Tạo biểu mẫu mới"}</h1>
                    <p className="text-[11px] text-gray uppercase font-bold tracking-widest">{formId ? `ID: ${formId}` : "Khởi tạo"}</p>
                </div>
                <div className="flex items-center gap-3">
                    {isFetching && <ScaleLoader height={10} width={4} color="#499c40" />}
                    <div className="flex gap-2">
                        {formId && !isEdit ? (
                            <button onClick={() => setIsEdit(true)} className="bg-mainColor text-white px-6 py-2 rounded-normal font-bold hoverBtn shadow-md flex items-center gap-2 transition-all">Chỉnh sửa</button>
                        ) : (
                            <>
                                {formId && <button onClick={() => { setIsEdit(false); fetchDetail(); }} className="px-5 py-2 border-[0.5px] border-lightGray rounded-normal font-bold dark:text-white hoverBtn">Hủy</button>}
                                <button onClick={handleSave} className="bg-mainColor text-white px-6 py-2 rounded-normal font-bold hoverBtn shadow-md">Lưu dữ liệu</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {formId && !isEdit ? (
                        <div className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-sm border-[0.5px] border-lightGray/20 flex flex-col gap-5 h-fit max-h-[calc(100vh-200px)] sticky top-28 transition-all">
                            <div className="flex flex-col border-b border-lightGray/10 pb-3">
                                <p className="font-bold text-normalSize dark:text-white uppercase tracking-tighter">Danh sách bài nộp</p>
                                <p className="text-[10px] text-gray font-bold">TỔNG CỘNG: {mockSubmissions.length}</p>
                            </div>

                            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar max-h-[750px]">
                                {mockSubmissions
                                    .filter(s => s.studentName.toLowerCase().includes(submissionSearch.toLowerCase()))
                                    .map((sub) => (
                                        <div key={sub.id} className="p-4 rounded-normal border border-lightGray/10 bg-gray/5 dark:bg-white/5 hover:bg-mainColor/5 hover:border-mainColor/30 transition-all cursor-pointer group">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <p className="font-bold text-smallSize dark:text-white group-hover:text-mainColor transition-colors">{sub.studentName}</p>
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded text-white tracking-tighter ${sub.status === 'graded' ? 'bg-mainColor' : sub.status === 'submitted' ? 'bg-blue-500' : 'bg-gray'}`}>
                                                    {sub.status === 'graded' ? 'ĐÃ CHẤM' : sub.status === 'submitted' ? 'ĐÃ NỘP' : 'CHỜ'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-60">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-3 dark:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                                                <p className="text-[10px] dark:text-white font-medium">{sub.submittedAt}</p>
                                            </div>
                                        </div>
                                    ))}
                                {mockSubmissions.filter(s => s.studentName.toLowerCase().includes(submissionSearch.toLowerCase())).length === 0 && (
                                    <p className="text-center text-tinySize text-gray py-10 italic">Không tìm thấy kết quả</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 sticky top-28">
                            {InfoSection}
                            {DeadlineSection}
                        </div>
                    )}
                </div>

                {/* Field Builder / Preview */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {formId && !isEdit && (
                        <div className="grid grid-cols-1 gap-6">
                            {InfoSection}
                            {DeadlineSection}
                        </div>
                    )}
                    {/* Field Builder / Preview */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white dark:bg-lightDark p-6 rounded-normal shadow-[0_0_20px_rgba(128,128,128,0.25)] flex flex-col gap-5 min-h-[600px] border-[0.5px] border-lightGray/20">
                            <div className="flex justify-between items-center border-b border-lightGray/10 pb-3">
                                <h3 className="font-bold dark:text-white text-normalSize uppercase tracking-wide">{isEdit ? `Thiết kế biểu mẫu (${allFields.length})` : "Xem trước biểu mẫu"}</h3>
                                {isEdit && (
                                    <div className="flex gap-2">
                                        <button onClick={addRegularField} className="text-smallSize font-bold text-mainColor border-[0.5px] border-mainColor px-3 py-1.5 rounded-small hover:bg-mainColor hover:text-white transition-all">+ TRƯỜNG NHẬP</button>
                                        <button onClick={addCheckboxField} className="text-smallSize font-bold text-blue-500 border-[0.5px] border-blue-500 px-3 py-1.5 rounded-small hover:bg-blue-500 hover:text-white transition-all">+ TRẮC NGHIỆM</button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-6">
                                {allFields.map((field, idx) => (
                                    <div key={field.tempId} className={`p-6 rounded-normal transition-all relative ${isEdit ? 'border-[0.5px] border-lightGray bg-gray/5' : 'bg-white dark:bg-black/10 border-l-4 ' + (field.uiType === 'checkbox' ? 'border-blue-500 shadow-md' : 'border-mainColor shadow-md')}`}>
                                        {/* Action Header (Edit Mode only) */}
                                        {isEdit && (
                                            <div className="flex justify-between items-center mb-4">
                                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black text-white ${field.uiType === 'checkbox' ? 'bg-blue-500' : 'bg-mainColor'}`}>#{field.index} - {field.uiType === 'checkbox' ? 'TRẮC NGHIỆM' : field.input_type}</span>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => moveField(idx, 'up')} disabled={idx === 0} className="p-1.5 hover:bg-gray/20 rounded dark:text-white disabled:opacity-10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg></button>
                                                    <button onClick={() => moveField(idx, 'down')} disabled={idx === allFields.length - 1} className="p-1.5 hover:bg-gray/20 rounded dark:text-white disabled:opacity-10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></button>
                                                    <button onClick={() => setAllFields(allFields.filter((_, i) => i !== idx))} className="p-1.5 hover:bg-red/10 rounded text-red ml-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79" /></svg></button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-4">
                                            {/* Row 1: Label & Meta */}
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-normalSize font-bold dark:text-white">{field.label || "Chưa đặt tiêu đề"}</p>
                                                    {field.is_required && <span className="text-red font-bold">*</span>}
                                                </div>
                                                {isEdit ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                                                        <input type="text" className="w-full border-b border-lightGray/50 px-1 py-1 dark:text-white outline-none focus:border-mainColor bg-transparent text-smallSize" value={field.label} onChange={(e) => { const n = [...allFields]; n[idx].label = e.target.value; setAllFields(n); }} placeholder="Chỉnh sửa tiêu đề..." />
                                                        <div className="flex items-center gap-4">
                                                            {field.uiType === 'regular' ? (
                                                                <select className="flex-1 bg-transparent text-smallSize dark:text-white outline-none border-b border-lightGray/50 py-1 font-bold cursor-pointer" value={field.input_type} onChange={(e) => handleTypeChange(idx, e.target.value)}>
                                                                    <option value={Field_Type.STRING}>Văn bản</option><option value={Field_Type.NUMBER}>Số</option><option value={Field_Type.FILE}>Tập tin</option>
                                                                </select>
                                                            ) : (
                                                                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={field.is_multiple} onChange={(e) => { const n = [...allFields]; n[idx].is_multiple = e.target.checked; setAllFields(n); }} className="size-4 accent-blue-500" /><span className="text-[11px] font-bold text-blue-500 uppercase">Chọn nhiều</span></label>
                                                            )}
                                                            <label className="flex items-center gap-2 cursor-pointer border-l border-lightGray/20 pl-3"><input type="checkbox" checked={field.is_required} onChange={(e) => { const n = [...allFields]; n[idx].is_required = e.target.checked; setAllFields(n); }} className="size-4 accent-mainColor" /><span className="text-[11px] font-bold dark:text-white uppercase">Bắt buộc</span></label>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-smallSize dark:text-white opacity-60 italic">{field.description}</p>
                                                )}
                                            </div>

                                            {/* Preview Area or Edit Config Area */}
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
                                                                <span className="flex items-center gap-1.5"><p className="font-bold opacity-40 uppercase">Min:</p><input type="number" className="bg-transparent dark:text-white outline-none w-10 font-bold border-b border-lightGray/30" value={field.min_attempts} onChange={(e) => { const n = [...allFields]; n[idx].min_attempts = e.target.value; setAllFields(n); }} /></span>
                                                                <span className="flex items-center gap-1.5"><p className="font-bold opacity-40 uppercase">Max:</p><input type="number" className="bg-transparent dark:text-white outline-none w-12 font-bold border-b border-lightGray/30" value={field.max_attempts} onChange={(e) => { const n = [...allFields]; n[idx].max_attempts = e.target.value; setAllFields(n); }} /></span>
                                                                <p className="font-black text-mainColor opacity-50 uppercase tracking-widest ml-auto">{field.unit}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Choice List (Edit Mode only) */}
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
                                                        <button onClick={() => { const n = [...allFields]; const ni = (n[idx].checkbox_field_choices.length + 1).toString(); n[idx].checkbox_field_choices.push({ index: ni, body: `Lựa chọn ${ni}`, tempId: Math.random() }); setAllFields(n); }} className="w-fit text-smallSize font-bold text-blue-500 hover:text-blue-700 transition-all border-b border-dashed border-blue-500/40 mt-1">+ THÊM LỰA CHỌN</button>
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
