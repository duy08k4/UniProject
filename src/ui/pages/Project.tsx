import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { PublicService } from "../../services/public/public.service"
import { useDebounce } from "../../hooks/Debounce"
import type { ThesisItem } from "../../services/public/public.type"
import formatVNTime from "../../utils/formatVNTime"
import { VNThesisType } from "../../config/enum"

const ProjectCard: React.FC<{ item: ThesisItem }> = ({ item }) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/projects/${item.id}`)}
            className="flex flex-col gap-5 shadow-[0_0_12px_rgba(0,0,0,0.1)] p-5 border border-lightGray/30 dark:border-white/5 rounded-normal bg-white dark:bg-lightDark hover:cursor-pointer hover:border-mainColor transition-all group"
        >
            <div className="flex flex-col gap-4 h-full">
                {/* Badge and Type */}
                <div className="flex justify-between items-center">
                    <span className="bg-mainColorRGB text-mainColor text-tinySize font-bold px-3 py-1 rounded-small uppercase tracking-wider">
                        {item.thesis_type ? VNThesisType[item.thesis_type] : "N/A"}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 fill-lightGray group-hover:fill-mainColor transition-colors">
                        <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </div>

                {/* Title */}
                <h4 className="text-normalSize font-bold dark:text-white uppercase line-clamp-3 leading-snug h-[4.5rem]">
                    {item.title}
                </h4>

                {/* Info */}
                <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-lightGray/20">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-mainColorRGB flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-mainColor">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-smallSize font-medium dark:text-white truncate">
                            {item.student_name ?? "N/A"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gray/10 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-gray">
                                <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-smallSize dark:text-gray">
                            {item.submitted_at ? formatVNTime(item.submitted_at).split(",")[0] : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            <button className="w-full py-2.5 bg-mainColor text-white font-bold rounded-normal hoverBtn text-smallSize shadow-md shadow-mainColor/20 transition-all active:scale-[0.98]">
                Xem chi tiết đồ án
            </button>
        </div>
    )
}

const Project: React.FC = () => {
    const { thesisList, pagination } = useSelector((state: RootState) => state.thesis)

    const [showFilter, setShowFilter] = useState(true)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [thesisType, setThesisType] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [loading, setLoading] = useState(false)

    const searchDebounce = useDebounce(search, 1000)

    const fetchTheses = async (p = page) => {
        setLoading(true)
        await PublicService.getTheses(p, 12, {
            search: searchDebounce || undefined,
            thesis_type: thesisType || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        })
        setLoading(false)
    }

    useEffect(() => {
        setPage(1)
        fetchTheses(1)
    }, [searchDebounce, thesisType, dateFrom, dateTo])

    useEffect(() => {
        fetchTheses(page)
    }, [page])

    const changePage = (dir: "prev" | "next") => {
        if (dir === "prev" && page > 1) setPage(p => p - 1)
        if (dir === "next" && page < pagination.totalPage) setPage(p => p + 1)
    }

    return (
        <div className="flex flex-col">
            {/* Bar */}
            <div className="sticky top-0 w-full h-fit flex flex-col gap-5 bg-bgLight dark:bg-bgDark max-sm:gap-8">
                <div className="flex justify-center">
                    <h1 className="text-hugeSize font-semibold uppercase dark:text-white max-sm:text-mobile-hugeSize">Đồ án tốt nghiệp</h1>
                </div>

                <div className={`min-h-8 flex items-center gap-10 max-sm:flex-col max-sm:gap-5 ${!showFilter && "max-sm:gap-2.5!"}`}>
                    <span className="flex-1 max-sm:w-full flex items-center gap-2.5">
                        <button
                            disabled={loading}
                            onClick={() => fetchTheses(page)}
                            className="px-2.5 py-2 border-[0.5px] border-lightGray shadow-[0_0_12px_rgba(0,0,0,0.1)] rounded-small hoverBtn disabled:opacity-40 dark:bg-transparent bg-white shrink-0"
                            title="Làm mới"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className={`size-5 dark:stroke-white ${loading && "animate-spin"}`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm kiếm tên đề tài, sinh viên..."
                            className="w-full text-smallSize border-[0.5px] border-lightGray shadow-[0_0_12px_rgba(0,0,0,0.1)] px-5 py-2 rounded-small dark:text-white bg-transparent"
                        />
                    </span>

                    <span className="flex gap-5 max-sm:flex-wrap max-sm:w-full">
                        {/* Mobile filter toggle */}
                        <span className="hidden max-sm:flex w-full items-center justify-between">
                            <span className="flex items-center gap-2.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 fill-lightDark dark:fill-white">
                                    <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clipRule="evenodd" />
                                </svg>
                                <p className="text-lightDark dark:text-white">Bộ lọc</p>
                            </span>
                            <button onClick={() => setShowFilter(!showFilter)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-lightDark dark:fill-white">
                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </span>

                        {/* Thesis type filter */}
                        <span className={`${!showFilter && "max-sm:hidden"} flex items-center gap-1.5`}>
                            <p className="font-medium dark:text-white max-sm:text-mobile-smallSize">Loại đồ án:</p>
                            <span className="flex items-center gap-2.5">
                                <button
                                    onClick={() => setThesisType(thesisType === "thesis" ? "" : "thesis")}
                                    className={`border-[0.5px] px-2.5 py-1.5 rounded-small max-sm:text-mobile-smallSize transition-colors ${thesisType === "thesis" ? "border-mainColor text-mainColor" : "border-lightGray dark:text-white"}`}
                                >Khóa luận</button>
                                <p className="dark:text-white">|</p>
                                <button
                                    onClick={() => setThesisType(thesisType === "capstone" ? "" : "capstone")}
                                    className={`border-[0.5px] px-2.5 py-1.5 rounded-small max-sm:text-mobile-smallSize transition-colors ${thesisType === "capstone" ? "border-mainColor text-mainColor" : "border-lightGray dark:text-white"}`}
                                >Tiểu luận</button>
                            </span>
                        </span>

                        {/* Date range filter */}
                        <span className={`${!showFilter && "max-sm:hidden"} flex items-center gap-1.5`}>
                            <p className="font-medium dark:text-white max-sm:text-mobile-smallSize">Ngày nộp:</p>
                            <span className="flex items-center gap-1.5">
                                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white dark:bg-transparent max-sm:text-mobile-smallSize" />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="5" stroke="currentColor" className="size-6 max-sm:size-2.5 dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                </svg>
                                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white dark:bg-transparent max-sm:text-mobile-smallSize" />
                            </span>
                        </span>
                    </span>
                </div>

                <div className="flex justify-between items-center py-2.5">
                    <p className="dark:text-white max-sm:text-mobile-smallSize">
                        Tìm thấy <b className="text-mainColor">{pagination.total}</b> đồ án
                    </p>
                    <span className="flex items-center gap-1.5">
                        <p className="font-medium mr-3.5 dark:text-white max-sm:text-mobile-smallSize">
                            Trang <b>{pagination.page}</b>/{pagination.totalPage || 1}
                        </p>
                        <button disabled={loading || page <= 1} onClick={() => changePage("prev")} className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn disabled:opacity-40">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button disabled={loading || page >= pagination.totalPage} onClick={() => changePage("next")} className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn disabled:opacity-40">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </span>
                </div>
            </div>

            {/* Cards */}
            <div className="h-fit grid grid-cols-4 gap-5 p-2 max-sm:grid-cols-1">
                {loading ? (
                    <p className="col-span-4 text-center py-20 text-gray">Đang tải...</p>
                ) : thesisList.length === 0 ? (
                    <p className="col-span-4 text-center py-20 text-gray">Không có đồ án nào</p>
                ) : thesisList.map(item => (
                    <ProjectCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}

export default Project
