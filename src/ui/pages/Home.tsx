import type React from "react"

// Assets
import HeroImage from "../../assets/HeroImage.png"
import DbHeroImage from "../../assets/DbHeroImage.svg"
import DarkModeDBHeroImage from "../../assets/DbHeroImage_DarkMode.png"

// Component
import SignUpDirect from "../components/SignUpDirect.comp"
import ProjectDirect from "../components/ProjectDirect.comp"

const objectiveContent: string[] = [
    "Quản lý tập trung đồ án tốt nghiệp",
    "Số hóa quy trình một cách linh hoạt",
    "Theo dỏi tiến độ thực hiện đồ án",
    "Nhập điểm và đánh giá đồ án"
]

const objectiveIcon: React.ReactNode[] = [
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 fill-mainColor max-sm:size-5">
        <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 fill-mainColor max-sm:size-5">
        <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z" clipRule="evenodd" />
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 fill-mainColor max-sm:size-5">
        <path d="M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" />
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 fill-mainColor max-sm:size-5">
        <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
        <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
        <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
    </svg>
]

const Home: React.FC = () => {
    return (
        <div className="h-fit flex flex-col gap-40 max-sm:gap-20">
            <div className="h-fit flex flex-col gap-5">
                {/* Hero image */}
                <div className="h-fit relative flex justify-center-safe items-center-safe">
                    <div className="h-[400px] aspect-square blur-2xl rounded-full bg-mainColorRGB max-sm:h-[300px]"></div>
                    <img src={HeroImage} loading="lazy" className="absolute top-1/2 left-1/2 h-[250px] -translate-1/2 max-sm:h-[200px]" />
                </div>

                {/* Hero section */}
                <div className="flex flex-col gap-10 items-center-safe mt-topPadding max-sm:gap-5">
                    <h1 className="uppercase flex gap-2.5 font-bold text-[48px] dark:text-white max-sm:text-mobile-hugeSize max-sm:block">
                        hệ thống quản lý 
                        <p className="text-black dark:text-white max-sm:dark:text-gray">đồ án tốt nghiệp</p>

                    </h1>
                    <p className="uppercase text-mainColor text-mediumSize font-light max-sm:text-mobile-mediumSize">khoa môi trường và tài nguyên</p>
                    <nav className="flex gap-2.5 max-sm:mt-5">
                        <button className="text-mainColor font-bold bg-mainColorRGB px-10 rounded-normal flex items-center-safe gap-2.5 hover:cursor-pointer max-sm:text-mobile-smallSize max-sm:py-2.5">
                            Truy cập
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-6 stroke-mainColor">
                                <path strokeLinecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                            </svg>

                        </button>
                        <SignUpDirect content="Tạo tài khoản UNI" />
                    </nav>
                </div>
            </div>

            {/* Objective */}
            <div className="h-fit flex flex-col items-center-safe gap-5">
                <div className="">
                    <h1 className="uppercase font-bold text-largeSize dark:text-white max-sm:text-mobile-bigSize">Mục tiêu</h1>
                </div>

                <div className="w-full grid grid-cols-2 gap-y-5 gap-x-5 max-sm:grid-cols-1">
                    {objectiveContent.map((value, index) => {
                        return (
                            <span key={index} className="flex gap-2.5 items-center-safe shadow-[0_0_12px_rgba(0,0,0,0.1)] px-5 py-5 rounded-normal dark:bg-lightDark">
                                <span className="bg-mainColorRGB h-[60px] max-sm:h-[38px] aspect-square flex items-center-safe justify-center-safe rounded-full">{objectiveIcon[index]}</span>
                                <p className="font-semibold text-mediumSize dark:text-white max-sm:text-smallSize">{value}</p>
                            </span>
                        )
                    })}
                </div>
            </div>

            {/* Database */}
            <div className="flex gap-5">
                <div className="w-2/5 flex flex-col gap-10 max-sm:w-full">
                    <div className="flex flex-col gap-2.5">
                        <h1 className="text-hugeSize uppercase font-bold flex items-center-safe gap-2.5 dark:text-white max-sm:text-mobile-bigSize">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-14 fill-mainColor max-sm:size-6">
                                <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
                                <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
                                <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
                                <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z" />
                            </svg>

                            Cơ sở dữ liệu
                        </h1>
                        <p className="text-mediumSize font-light ml-3.5 dark:text-lightGray max-sm:text-mobile-normalSize">Các công trình nghiên cứu của sinh viên được lưu trữ tập trung
                            nhằm mục tiêu viết báo cáo và làm nguồn tham khảo cho các sinh viên
                            chuẩn bị thực hiện đồ án tốt nghiệp
                        </p>
                    </div>

                    <ProjectDirect content="Truy cập dữ liệu đồ án" />
                </div>

                <div className="relative flex-1 flex justify-center-safe items-center-safe max-sm:hidden">
                    <img src={DarkModeDBHeroImage} />
                    <img className="absolute dark:opacity-0" src={DbHeroImage} />
                </div>
            </div>
        </div>
    )
}

export default Home