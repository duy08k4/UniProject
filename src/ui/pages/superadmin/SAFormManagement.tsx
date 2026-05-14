import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useDebounce } from "../../../hooks/Debounce"
import { FormsService } from "../../../services/forms/forms.service"
import type { RootState } from "../../../redux/store"
import formatVNTime from "../../../utils/formatVNTime"
import { changeStateFetching } from "../../../redux/reducers/global.reducer"
import { ScaleLoader } from "react-spinners"
import SAFormSubmissions from "../../components/SAFormSubmissions"
import type { DetailForm } from "../../../services/forms/forms.type"

const FormManagement: React.FC = () => {
    const dispatch = useDispatch()

    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [isStopped, setIsStopped] = useState<string>("")
    const [previewForm, setPreviewForm] = useState<DetailForm | null>(null)

    const searchDebounce = useDebounce(search, 1500)

    const formPagination = useSelector((state: RootState) => state.form.formPagination)
    const currentForm = useSelector((state: RootState) => state.form.currentForm)
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)

    const pageSize = 12

    const fetchForms = async (p: number = page) => {
        dispatch(changeStateFetching(true))
        const stoppedParam = isStopped === "" ? undefined : isStopped === "true"
        await FormsService.formsPagination(p, pageSize, searchDebounce, false, stoppedParam).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    useEffect(() => { fetchForms() }, [searchDebounce, page, isStopped])

    const handleRefresh = () => { fetchForms(1); setPage(1) }

    const currentFormRef = useRef(currentForm)
    useEffect(() => { currentFormRef.current = currentForm }, [currentForm])

    const handlePreview = async (formId: string, classId: string) => {
        const result = await FormsService.getFormDetail(classId, formId)
        if (result) setPreviewForm(currentFormRef.current)
    }

    const changePage = (dir: "prev" | "next") => {
        if (!formPagination) return
        if (dir === "next" && page < formPagination.pagination.totalPages) setPage(p => p + 1)
        if (dir === "prev" && page > 1) setPage(p => p - 1)
    }

    return (
        <div className="w-full flex flex-col gap-5 py-mainTwoSidePadding">
            {previewForm && (
                <SAFormSubmissions
                    form={previewForm}
                    classId={previewForm.class.id}
                    onClose={() => setPreviewForm(null)}
                />
            )}

            {/* Header */}
            <div className="w-full flex justify-between items-center-safe">
                <div className="flex flex-col">
                    <h1 className="text-largeSize font-bold dark:text-white">Quản lý biểu mẫu</h1>
                    <p className="dark:text-gray">Hệ thống có <b className="text-red">{formPagination?.pagination.total} biểu mẫu</b></p>
                </div>
            </div>

            {/* Sticky Controls Bar */}
            <div className="sticky top-0 z-10 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center-safe gap-5 py-5 flex-wrap">
                <button className="h-full aspect-square p-1.5 border-[0.5px] border-lightGray rounded-full hoverBtn disableState"
                    disabled={isFetching} onClick={handleRefresh}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 dark:stroke-white stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>

                <span className="relative flex items-center-safe w-1/4 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input type="text" className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white disableState outline-none"
                        disabled={isFetching} placeholder="Tìm kiếm..." value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                    <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px transition-all duration-300"></span>
                </span>

                <span className="flex items-center-safe gap-1.5">
                    <p className="font-bold dark:text-white max-sm:hidden">Trạng thái</p>
                    <select className="w-40 border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white hover:cursor-pointer disableState outline-none bg-transparent"
                        disabled={isFetching} value={isStopped}
                        onChange={(e) => { setIsStopped(e.target.value); setPage(1) }}>
                        <option value="" className="dark:text-black">Tất cả</option>
                        <option value="false" className="dark:text-black">Hoạt động</option>
                        <option value="true" className="dark:text-black">Đã đóng</option>
                    </select>
                </span>

                {isFetching && <ScaleLoader height={10} width={4} color="#499c40" />}

                <span className="flex-1 flex justify-end-safe items-center-safe gap-1.5">
                    <p className="font-medium mr-3.5 dark:text-white max-sm:text-mobile-smallSize">
                        Trang {page}/{formPagination?.pagination.totalPages || 1}
                    </p>
                    <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn disableState"
                        disabled={isFetching || page <= 1} onClick={() => changePage("prev")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn disableState"
                        disabled={isFetching || page >= (formPagination?.pagination.totalPages || 1)} onClick={() => changePage("next")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white stroke-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </span>
            </div>

            {/* Grid */}
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

                        <div className="mt-3 border-t border-gray/10 pt-3">
                            <button
                                className="w-full bg-mainColorRGB text-mainColor px-2.5 py-1.5 rounded-small hoverBtn disableState font-bold text-smallSize"
                                disabled={isFetching}
                                onClick={() => handlePreview(form.id, form.class.id)}
                            >
                                Xem câu trả lời
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

export default FormManagement
