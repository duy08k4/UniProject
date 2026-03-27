import type React from "react"

// Image
// import ProjectDemo from "../../assets/ProjectDemo.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface ProjectCard_interface {
    key: any
}

const ProjectCard: React.FC<ProjectCard_interface> = ({ key }) => {
    const navigate = useNavigate()

    return (
        <div key={key} onClick={() => { navigate("/projects/123") }} className="h-fit flex flex-col gap-5 shadow-[0_0_12px_rgba(0,0,0,0.1)] p-3.5 border-[0.5px] border-lightGray rounded-medium hover:cursor-pointer hover:border-mainColor hover:shadow-[0_0_12px_2px_rgba(73,156,64,0.75)] dark:border-none dark:bg-lightDark dark:hover:shadow-[0_0_12px_2px_rgba(255,255,255,0.75)]">
            {/* <span className="h-56 overflow-hidden w-full bg-lightGray rounded-normal">
                <img src={ProjectDemo} className="object-cover object-center" alt="" loading="lazy" />
            </span> */}

            <span className="flex flex-col gap-5">
                <h4 className="text-mediumSize font-semibold dark:text-white max-sm:text-mobile-bigSize uppercase">XÂY DỰNG TRANG WEB HỖ TRỢ
                    KHOA MÔI TRƯỜNG VÀ TÀI NGUYÊN QUẢN LÝ
                    ĐỒ ÁN TỐT NGHIỆP CỦA SINH VIÊN
                    </h4>
                <span>
                    <span className="flex gap-3.5 items-center-safe">
                        <p className="font-light dark:text-white max-sm:text-mobile-normalSize">Tác giả: Nguyễn Văn A</p>
                        <span className="h-2.5 aspect-square bg-mainColor rounded-full"></span>
                        <p className="font-light dark:text-white max-sm:text-mobile-normalSize">Khóa luận</p>
                    </span>
                    
                    <p className="font-light dark:text-white max-sm:text-mobile-normalSize">Ngày nộp: 00/00/0000</p>
                </span>
            </span>

            <span className="flex items-center-safe gap-2.5">
                <button className="hoverBtn font-medium text-mainColor flex-1 bg-mainColorRGB py-2.5 rounded-normal max-sm:text-mobile-smallSize">Xem đồ án</button>

                {/* <button className="hoverBtn font-medium flex-1 text-white flex items-center-safe justify-center-safe gap-2.5 bg-mainColor py-2.5 rounded-normal max-sm:text-mobile-smallSize">
                    Tải xuống
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </button> */}
            </span>
        </div>
    )
}

const Project: React.FC = () => {
    const [showFilter, setShowFilter] = useState<boolean>(true)

    return (
        <div className="flex flex-col">
            {/* Bar */}
            <div className="sticky top-0 w-full h-fit flex flex-col gap-5 bg-bgLight dark:bg-bgDark max-sm:gap-8">
                <div className="flex justify-center-safe">
                    <h1 className="text-hugeSize font-semibold uppercase dark:text-white max-sm:text-mobile-hugeSize">Đồ án tốt nghiệp</h1>
                </div>

                <div className={`min-h-8 flex items-center-safe gap-10 max-sm:flex-col max-sm:gap-5 ${!showFilter && "max-sm:gap-2.5!"}`}>
                    <span className="flex-1 max-sm:w-full">
                        <input type="text" placeholder="Tìm kiếm..." className="w-full text-smallSize border-[0.5px] border-lightGray shadow-[0_0_12px_rgba(0,0,0,0.1)] px-5 py-2 rounded-small dark:text-white" />
                    </span>

                    <span className="flex gap-5 max-sm:flex-wrap max-sm:w-full">
                        <span className=" hidden max-sm:flex w-full items-center-safe justify-between">
                            <span className="flex items-center-safe gap-2.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 fill-lightDark dark:fill-white">
                                    <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clipRule="evenodd" />
                                </svg>

                                <p className="text-lightDark max-sm:dark:text-white">Bộ lọc</p>
                            </span>

                            <button className="" onClick={() => { setShowFilter(!showFilter) }}>
                                {showFilter ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-lightDark max-sm:dark:fill-white">
                                        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-lightDark max-sm:dark:fill-white">
                                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                    </svg>

                                )}

                            </button>
                        </span>

                        <span className={`${!showFilter && "max-sm:hidden"} flex items-center-safe gap-1.5`}>
                            <p className="font-medium dark:text-white max-sm:text-mobile-smallSize">Loại đồ án:</p>
                            <span className="flex items-center-safe gap-2.5">
                                <button className="border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white max-sm:text-mobile-smallSize">Khóa luận</button>
                                <p>|</p>
                                <button className="border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white max-sm:text-mobile-smallSize">Tiểu luận</button>
                            </span>
                        </span>

                        <span className={`${!showFilter && "max-sm:hidden"} flex items-center-safe gap-1.5`}>
                            <p className="font-medium dark:text-white max-sm:text-mobile-smallSize">Ngày nộp:</p>
                            <span className="flex items-center-safe gap-1.5">
                                <input type="date" className="border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white max-sm:text-mobile-smallSize" />

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="5" stroke="currentColor" className="size-6 max-sm:size-2.5 dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                </svg>

                                <input type="date" className="border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white max-sm:text-mobile-smallSize" />
                            </span>
                        </span>

                        <span className=""></span>

                        <select className={`${!showFilter && "max-sm:hidden"} w-48 border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white max-sm:text-mobile-smallSize max-sm:w-full`}>
                            <option value="">Ngành 1</option>
                            <option value="">Ngành 2</option>
                            <option value="">Ngành 3</option>
                            <option value="">Ngành 4</option>
                        </select>
                    </span>

                    <div className="max-sm:w-full">
                        <button className="w-full bg-mainColor text-white font-medium px-5 py-1.5 rounded-small hover:cursor-pointer max-sm:text-mobile-normalSize">Tìm kiếm</button>
                    </div>

                </div>

                <div className="flex justify-between items-center-safe py-2.5">
                    <p className="dark:text-white max-sm:text-mobile-smallSize">Tìm thấy <b className="text-red">50</b> đồ án</p>

                    <span className="flex items-center-safe gap-1.5">
                        <p className="font-medium mr-3.5 dark:text-white max-sm:text-mobile-smallSize">Trang 1/20</p>

                        <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>

                        </button>

                        <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal hoverBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </span>
                </div>
            </div>

            {/* Project cards */}
            <div className="h-fit grid grid-cols-4 gap-5 p-2 max-sm:grid-cols-1">
                {Array(20).fill(0).map((_, index) => {
                    return <ProjectCard key={index} />
                })}
            </div>
        </div>
    )
}

export default Project