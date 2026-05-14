import type React from "react"
import { NavLink } from "react-router-dom"
import HeroImage from "../../assets/HeroImage.png"

const painPoints = [
    {
        before: "Sử dụng một biểu mẫu duy nhất cho nhiều giai đoạn khác nhau sẽ làm sinh viên dễ nhầm lẫn trong việc nộp bài",
        after: "Mỗi cột mốc trong quy trình sẽ có một hoặc nhiều biểu mẫu riêng biệt và có thể quản lý thời gian nhận câu trả lời.",
    },
    {
        before: "Điểm tổng kết gồm nhiều thành phần từ nhiều giảng viên khác nhau, phải tổng hợp và nhập liệu tính toán.",
        after: "Quản lý lớp tự thiết kế cột điểm và công thức tính toán tự động. Phân quyền nhập điểm cho từng cột",
    },
    {
        before: "Tìm kiếm đề tài tốt nghiệp của các sinh viên khóa trước thông qua thư viện số của nhà trường với phạm vi tìm kiếm toàn trường.",
        after: "Tìm kiếm đề tài tốt nghiệp của các sinh viên khóa trước với phạm vi trong Khoa Môi Trường và Tài Nguyên.",
    },
]

const features = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 stroke-mainColor group-hover:stroke-white transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
        ),
        title: "Quy trình tùy chỉnh",
        desc: "Thiết kế các mốc phù hợp với từng học kỳ và có thể tùy chỉnh. Mỗi mốc có thể gắn nhiều biểu mẫu và bảng điểm. Quản lý thời gian đóng mở cho từng cột mốc.",
        highlight: "Linh hoạt theo từng yêu cầu",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 stroke-mainColor group-hover:stroke-white transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-5.25A2.25 2.25 0 0 1 4.5 11.25h15A2.25 2.25 0 0 1 21.75 13.5v5.25m-18.375.125A1.125 1.125 0 0 0 2.25 19.5m0 0v-5.25A2.25 2.25 0 0 1 4.5 12h15a2.25 2.25 0 0 1 2.25 2.25v5.25m0 0a1.125 1.125 0 0 1-1.125 1.125m0 0h-1.5c-.621 0-1.125-.504-1.125-1.125M6 18.375v-5.25A2.25 2.25 0 0 1 8.25 11.25h7.5A2.25 2.25 0 0 1 18 13.5v5.25" />
            </svg>
        ),
        title: "Bảng điểm tùy chỉnh",
        desc: "Thiết kế bảng điểm với các cột điểm và công thức tính toán tự động có thể tùy chỉnh. Phân quyền nhập điểm cho từng cột.",
        highlight: "Phân quyền nhập + tính điểm tự động",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 stroke-mainColor group-hover:stroke-white transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        ),
        title: "Kho đồ án trực tuyến",
        desc: "Toàn bộ đồ án sau khi hoàn thành được lưu trữ và công khai trên hệ thống. Sinh viên khóa sau có thể tìm kiếm và sử dụng làm tài liệu tham khảo.",
        highlight: "Tra cứu tiện lợi",
    },
]

const Home: React.FC = () => {
    return (
        <div className="min-h-screen pb-20">

            {/* 1. HERO */}
            <section className="relative py-20 border-b border-gray/10 dark:border-white/5 overflow-hidden">
                {/* subtle gradient blob */}
                <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-mainColor/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-mainColor/5 blur-3xl" />

                <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <span className="inline-block text-mainColor font-bold tracking-widest uppercase text-tinySize mb-4 px-3 py-1 bg-mainColor/10 rounded-small">
                            Khoa Môi trường và Tài nguyên · HCMUAF
                        </span>
                        <h1 className="text-hugeSize font-extrabold text-lightDark dark:text-white mb-5 uppercase tracking-tight leading-tight max-sm:text-mobile-hugeSize">
                            Quản lý<br />
                            <span className="text-mainColor">Đồ án Tốt nghiệp</span>
                        </h1>
                        <p className="text-normalSize text-gray mb-8 leading-relaxed max-w-lg max-sm:text-mobile-normalSize">
                            Thiết kế quy trình linh hoạt theo yêu cầu với các biểu mẫu và bảng điểm được tùy chỉnh giúp thu thập câu trả lời và điểm số một cách linh hoạt trên cùng một nền tảng. 
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <NavLink
                                to="/auth/sign-in"
                                className="px-8 py-3.5 bg-mainColor text-white font-bold rounded-small shadow-lg shadow-mainColor/25 hover:brightness-110 transition-all"
                            >
                                Truy cập hệ thống
                            </NavLink>
                            <NavLink
                                to="/projects"
                                className="px-8 py-3.5 border border-gray/20 dark:border-white/10 text-lightDark dark:text-white font-bold rounded-small hover:bg-gray/5 dark:hover:bg-white/5 transition-all"
                            >
                                Tra cứu đồ án
                            </NavLink>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <img src={HeroImage} alt="Hero" className="w-1/2 h-auto drop-shadow-2xl" />
                    </div>
                </div>
            </section>

            {/* 2. PAIN vs GAIN */}
            <section className="py-20 border-b border-gray/10 dark:border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <h2 className="text-bigSize font-bold text-lightDark dark:text-white uppercase border-l-4 border-mainColor pl-4 max-sm:text-mobile-bigSize">
                            Tại sao cần hệ thống này?
                        </h2>
                        <p className="mt-3 text-smallSize text-gray pl-5">
                            Những vấn đề thực tế trong quy trình quản lý đồ án hiện tại của khoa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Header row */}
                        <div className="px-5 py-3 rounded-normal bg-red/5 border border-red/15">
                            <p className="text-smallSize font-bold text-red uppercase tracking-wider">❌ Cách làm hiện tại</p>
                        </div>
                        <div className="px-5 py-3 rounded-normal bg-mainColor/5 border border-mainColor/15">
                            <p className="text-smallSize font-bold text-mainColor uppercase tracking-wider">✅ Với UniProject</p>
                        </div>

                        {/* Pain/Gain rows */}
                        {painPoints.map((p, i) => (
                            <>
                                <div key={`before-${i}`} className="px-5 py-4 rounded-normal bg-lighterGray/60 dark:bg-white/3 border border-gray/10 flex items-start gap-3">
                                    <span className="mt-0.5 shrink-0 size-5 rounded-full bg-red/10 flex items-center justify-center">
                                        <span className="text-red text-tinySize font-bold">✕</span>
                                    </span>
                                    <p className="text-smallSize text-gray dark:text-white/70 leading-relaxed">{p.before}</p>
                                </div>
                                <div key={`after-${i}`} className="px-5 py-4 rounded-normal bg-mainColor/3 dark:bg-mainColor/5 border border-mainColor/10 flex items-start gap-3">
                                    <span className="mt-0.5 shrink-0 size-5 rounded-full bg-mainColor/15 flex items-center justify-center">
                                        <span className="text-mainColor text-tinySize font-bold">✓</span>
                                    </span>
                                    <p className="text-smallSize text-lightDark dark:text-white leading-relaxed">{p.after}</p>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FEATURES */}
            <section className="py-20 border-b border-gray/10 dark:border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <h2 className="text-bigSize font-bold text-lightDark dark:text-white uppercase border-l-4 border-mainColor pl-4 max-sm:text-mobile-bigSize">
                            Tính năng nổi bật
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="flex flex-col gap-5 p-6 rounded-normal border border-gray/10 dark:border-white/5 bg-white dark:bg-lightDark hover:border-mainColor/40 hover:shadow-lg hover:shadow-mainColor/5 transition-all group">
                                <div className="size-12 rounded-normal bg-mainColor/10 flex items-center justify-center group-hover:bg-mainColor transition-all">
                                    {f.icon}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-bold text-normalSize text-lightDark dark:text-white max-sm:text-mobile-normalSize">{f.title}</h3>
                                    <p className="text-smallSize text-gray leading-relaxed">{f.desc}</p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray/10 dark:border-white/5">
                                    <span className="text-tinySize font-bold text-mainColor uppercase tracking-wider">{f.highlight}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. THESIS ACCESS */}
            <section className="py-20 border-b border-gray/10 dark:border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="relative overflow-hidden rounded-normal border border-mainColor/20 bg-mainColor/5 dark:bg-mainColor/8 p-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="pointer-events-none absolute -right-20 -top-20 w-64 h-64 rounded-full bg-mainColor/10 blur-3xl" />
                        <div className="flex-1">
                            <span className="text-tinySize font-bold text-mainColor uppercase tracking-widest">Dành cho sinh viên</span>
                            <h3 className="mt-2 text-mediumSize font-bold text-lightDark dark:text-white max-sm:text-mobile-mediumSize">
                                Đọc đồ án khóa trước
                            </h3>
                            <p className="mt-3 text-smallSize text-gray leading-relaxed max-w-lg">
                                Toàn bộ đồ án tốt nghiệp của các khóa được lưu trữ và công khai trên hệ thống. Tìm kiếm theo tên đề tài, sinh viên, loại đồ án. Mọi lúc, mọi nơi.
                            </p>
                        </div>
                        <NavLink
                            to="/projects"
                            className="shrink-0 px-8 py-3.5 bg-mainColor text-white font-bold rounded-small shadow-lg shadow-mainColor/25 hover:brightness-110 transition-all whitespace-nowrap"
                        >
                            Xem kho đồ án →
                        </NavLink>
                    </div>
                </div>
            </section>

            {/* 5. CONTACT */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white dark:bg-lightDark border border-gray/10 rounded-normal">
                        <h3 className="font-bold text-normalSize dark:text-white mb-6 uppercase">Truy cập nhanh</h3>
                        <div className="flex flex-col gap-3">
                            <NavLink to="/auth/sign-in" className="flex items-center gap-3 p-4 rounded-normal bg-mainColor/5 hover:bg-mainColor/10 transition-all group">
                                <span className="font-bold text-mainColor">▸</span>
                                <p className="text-smallSize font-bold dark:text-white group-hover:text-mainColor">Đăng nhập (Sinh viên / Giảng viên)</p>
                            </NavLink>
                            <NavLink to="/auth/sign-up" className="flex items-center gap-3 p-4 rounded-normal bg-gray/5 hover:bg-gray/10 transition-all group">
                                <span className="font-bold text-gray">▸</span>
                                <p className="text-smallSize font-bold dark:text-white group-hover:text-mainColor">Đăng ký tài khoản</p>
                            </NavLink>
                            <NavLink to="/projects" className="flex items-center gap-3 p-4 rounded-normal bg-gray/5 hover:bg-gray/10 transition-all group">
                                <span className="font-bold text-gray">▸</span>
                                <p className="text-smallSize font-bold dark:text-white group-hover:text-mainColor">Tra cứu đồ án tốt nghiệp</p>
                            </NavLink>
                        </div>
                    </div>

                    <div className="p-8 bg-white dark:bg-lightDark border border-gray/10 rounded-normal">
                        <h3 className="font-bold text-normalSize dark:text-white mb-6 uppercase">Liên hệ Khoa</h3>
                        <div className="text-smallSize text-gray dark:text-white/70 space-y-3">
                            <p><b className="dark:text-white">Địa chỉ:</b><span className="dark:text-white"> ...</span></p>
                            <p><b className="dark:text-white">Email:</b><span className="dark:text-white"> ...</span></p>
                            <p><b className="dark:text-white">Điện thoại:</b><span className="dark:text-white"> (028) xxxx xxxx</span></p>
                            <p className="pt-4 border-t border-gray/10 text-tinySize italic dark:text-white/50">
                                Vui lòng liên hệ trong giờ hành chính để được hỗ trợ tốt nhất.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
