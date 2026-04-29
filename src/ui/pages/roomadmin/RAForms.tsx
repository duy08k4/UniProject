import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { useDebounce } from "../../../hooks/Debounce"
import { FormsService } from "../../../services/forms/forms.service"
import { confirmDialog } from "primereact/confirmdialog"
import type { RootState } from "../../../redux/store"
import formatVNTime from "../../../utils/formatVNTime"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { removeFormFromPagination } from "../../../redux/reducers/formSlice.reducer"
import { ScaleLoader } from "react-spinners"
import FormViewer from "../../components/FormViewer"
import type { DetailForm } from "../../../services/forms/forms.type"

const RAForms: React.FC = () => {
    const { classId } = useParams<{ classId: string }>()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [isStopped, setIsStopped] = useState<string>("") // "" (Tất cả), "false" (Hoạt động), "true" (Đã đóng)
    const [isDeleted, setIsDeleted] = useState<boolean>(false)
    const [previewForm, setPreviewForm] = useState<DetailForm | null>(null)
    
    const searchDebounce = useDebounce(search, 1500)

    const formPagination = useSelector((state: RootState) => state.form.formPagination)
    const currentForm = useSelector((state: RootState) => state.form.currentForm)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const pageSize = 12

    const fetchForms = async (p: number = page) => {
        if (!classId) return
        dispatch(changeStateFetching(true))
        
        // Convert string state to boolean or undefined for API
        const stoppedParam = isStopped === "" ? undefined : isStopped === "true"
        
        await FormsService.formsPagination(p, pageSize, searchDebounce, isDeleted, stoppedParam, classId).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    useEffect(() => {
        fetchForms()
    }, [classId, searchDebounce, page, isStopped, isDeleted])

    const handleRefresh = () => {
        fetchForms(1)
        setPage(1)
    }

    const handleDelete = (formId: string) => {
        confirmDialog({
            header: "Xóa biểu mẫu",
            message: "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?",
            acceptLabel: "Xóa",
            rejectLabel: "Hủy",
            accept: async () => {
                dispatch(changeStateFetching(true));
                const result = await FormsService.removeForms([formId]).finally(() => dispatch(changeStateFetching(false)));
                if (result) dispatch(removeFormFromPagination(formId));
            }
        });
    };

    const currentFormRef = useRef(currentForm)
    useEffect(() => { currentFormRef.current = currentForm }, [currentForm])

    const handlePreview = async (formId: string) => {
        if (!classId) return
        const result = await FormsService.getFormDetail(classId, formId)
        if (result) setPreviewForm(currentFormRef.current)
    }

    const changePage = (pagination: "prev" | "next") => {
        if (!formPagination) return
        if (page < formPagination.pagination.totalPages && pagination === "next") {
            setPage((prev) => prev + 1)
        }
        if (page > 1 && pagination === "prev") {
            setPage((prev) => prev - 1)
        }
    }

    return (
        <div className="w-full flex flex-col gap-5 py-mainTwoSidePadding">
            {previewForm && <FormViewer formId={previewForm.id} onClose={() => setPreviewForm(null)} readonly />}
            {/* Header */}
            <div className="w-full flex justify-between items-center-safe">
                <h1 className="text-largeSize font-bold dark:text-white">Quản lý biểu mẫu</h1>
                
                <button
                    disabled={isFetching}
                    onClick={() => navigate("new")}
                    className="bg-mainColor text-white px-4 py-2 rounded-normal font-bold flex items-center gap-2 hoverBtn shadow-md transition-all disableState"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tạo biểu mẫu
                </button>
            </div>

            {/* Sticky Controls Bar */}
            <div className="sticky top-0 z-10 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center-safe gap-5 py-5 flex-wrap">
                <button 
                    className="h-full aspect-square p-1.5 border-[0.5px] border-lightGray rounded-full hoverBtn disableState" 
                    disabled={isFetching} 
                    onClick={handleRefresh}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white max-sm:size-3.5 stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>

                {/* Search */}
                <span className="relative flex items-center-safe w-1/4 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                    <input type="text" className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white disableState outline-none"
                        disabled={isFetching}
                        placeholder="Tìm kiếm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px transition-all duration-300"></span>
                </span>

                {/* Filter Status */}
                <span className="flex items-center-safe gap-1.5">
                    <p className="font-bold dark:text-white max-sm:hidden">Trạng thái</p>
                    <select
                        className="w-40 border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white hover:cursor-pointer disableState outline-none bg-transparent"
                        disabled={isFetching}
                        value={isStopped}
                        onChange={(e) => { setIsStopped(e.target.value); setPage(1); }}
                    >
                        <option value="" className="dark:text-black">Tất cả</option>
                        <option value="false" className="dark:text-black">Hoạt động</option>
                        <option value="true" className="dark:text-black">Đã đóng</option>
                    </select>
                </span>

                {/* Filter Deleted */}
                <span className="flex items-center-safe gap-1.5">
                    <p className="font-bold dark:text-white max-sm:hidden">Lưu trữ</p>
                    <select
                        className="w-40 border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white hover:cursor-pointer disableState outline-none bg-transparent"
                        disabled={isFetching}
                        value={isDeleted.toString()}
                        onChange={(e) => { setIsDeleted(e.target.value === "true"); setPage(1); }}
                    >
                        <option value="false" className="dark:text-black">Hiện tại</option>
                        <option value="true" className="dark:text-black">Đã xóa</option>
                    </select>
                </span>

                {isFetching && <ScaleLoader height={10} width={4} color="#499c40" />}

                {/* Pagination Controls */}
                <span className="flex-1 flex justify-end-safe items-center-safe gap-1.5">
                    <p className="font-medium mr-3.5 dark:text-white max-sm:text-mobile-smallSize">
                        Trang {page}/{formPagination?.pagination.totalPages || 1}
                    </p>

                    <button 
                        className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn disableState" 
                        disabled={isFetching || page <= 1} 
                        onClick={() => changePage("prev")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    <button 
                        className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn disableState" 
                        disabled={isFetching || page >= (formPagination?.pagination.totalPages || 1)} 
                        onClick={() => changePage("next")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </span>
            </div>

            {/* Grid Content */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {formPagination?.data.map((form) => (
                    <div key={form.id} className="flex flex-col justify-between gap-3 shadow-[0_0_20px_rgba(128,128,128,0.25)] hover:shadow-[0_0_10px_2px_rgba(128,128,128,0.75)] hoverBtn rounded-normal px-4 py-5 bg-white dark:bg-lightDark">
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex flex-col gap-1 flex-1">
                                <h3 className="font-bold dark:text-white line-clamp-1 text-normalSize">{form.label}</h3>
                                <p className="text-gray text-smallSize line-clamp-2 italic">{form.description || "Không có mô tả"}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-small text-[10px] font-bold uppercase ${form.is_stopped ? "bg-redRGB text-red" : "bg-mainColorRGB text-mainColor"}`}>
                                {form.is_stopped ? "Đã đóng" : "Hoạt động"}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center justify-between text-smallSize">
                                <p className="text-gray font-medium">Số trường: <span className="text-darkGray dark:text-white">{form.field_count}</span></p>
                                <p className="text-gray text-[11px]">{formatVNTime(form.created_at)}</p>
                            </div>

                            {form.close_at && (
                                <p className="text-[11px] text-red font-medium italic">Hạn: {formatVNTime(form.close_at)}</p>
                            )}
                        </div>

                        <div className="flex items-center-safe gap-2.5 mt-3 border-t border-gray/10 pt-3">
                            <button 
                                className="flex-1 bg-mainColorRGB text-mainColor px-2.5 py-1.5 rounded-small hoverBtn disableState font-bold text-smallSize"
                                disabled={isFetching}
                                onClick={() => navigate(`/main/roomadmin/class/${classId}/forms/${form.id}`)}
                            >
                                Xem chi tiết
                            </button>
                            <button
                                className="bg-gray/5 text-gray px-3 py-1.5 rounded-small hoverBtn disableState dark:bg-white/5 dark:text-white"
                                disabled={isFetching}
                                onClick={() => handlePreview(form.id)}
                                title="Xem trước"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-gray dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.964-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </button>
                            <button
                                className="bg-red/5 text-red px-3 py-1.5 rounded-small hoverBtn disableState dark:bg-red/10"
                                disabled={isFetching}
                                onClick={() => handleDelete(form.id)}
                                title="Xóa"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 stroke-red">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {formPagination?.data.length === 0 && !isFetching && (
                <div className="w-full py-20 flex flex-col items-center justify-center-safe text-gray opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <p className="text-mediumSize font-bold mt-4">Không tìm thấy biểu mẫu nào</p>
                </div>
            )}
        </div>
    )
}

export default RAForms
