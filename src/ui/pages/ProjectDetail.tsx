import type React from "react";
import { useNavigate } from "react-router-dom";

const ProjectDetail: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="h-full w-full flex flex-col px-twoSidePadding pt-topPadding gap-5 dark:bg-bgDark max-sm:px-5">
            <div className="">
                <button onClick={() => navigate(-1)} className="w-fit flex items-center-safe gap-2.5 px-5 py-2.5 shadow-[0_0_12px_rgba(0,0,0,0.25)] rounded-normal hover:cursor-pointer dark:bg-white max-sm:text-smallSize">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 max-sm:size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>

                    Quay lại
                </button>
            </div>

            <div className="w-full h-fit flex gap-20 justify-between items-center-safe max-sm:flex-col">
                <span className="w-full flex flex-col gap-2.5 max-sm:hidden">
                    <h1 className="text-bigSize font-medium dark:text-white max-sm:text-bigSize">
                        XÂY DỰNG TRANG WEB HỖ TRỢ
                        KHOA MÔI TRƯỜNG VÀ TÀI NGUYÊN QUẢN LÝ
                        ĐỒ ÁN TỐT NGHIỆP CỦA SINH VIÊN
                    </h1>

                    <span className="flex items-center-safe gap-2.5 max-sm:flex-col max-sm:items-start">
                        <p className="dark:text-white max-sm:text-smallSize"><b className="dark:text-white">Ngày nộp</b>: 00/00/0000</p>

                        <span className="h-2 aspect-square rounded-full bg-mainColor max-sm:hidden"></span>

                        <p className="dark:text-white max-sm:text-smallSize">Nguyễn Văn A</p>

                        <span className="h-2 aspect-square rounded-full bg-mainColor max-sm:hidden"></span>

                        <p className="dark:text-white max-sm:text-smallSize">Khóa luận</p>
                    </span>
                </span>

                <span className="w-fit flex gap-2.5 max-sm:w-full">
                    <span className="max-sm:flex">
                        <button className="py-2.5 bg-mainColor rounded-small text-white px-5 hover:cursor-pointer max-sm:text-smallSize text-nowrap">Xem đề cương</button>
                    </span>

                    <span className="flex items-center-safe gap-2.5 border-[0.5px] border-gray rounded-small px-5 py-2.5 max-sm:flex-1 max-sm:justify-center-safe">
                        <p className="font-medium dark:text-white max-sm:text-smallSize text-nowrap">Đánh giá:</p>
                        <p className="font-bold text-red max-sm:text-smallSize text-nowrap">Đạt yêu cầu</p>
                    </span>
                </span>
            </div>

            <div className="flex-1 flex gap-5">
                <div className="h-full flex-2/3">
                    <embed src={"https://ypvnurccvkbbvopvklkj.supabase.co/storage/v1/object/public/Report%20File/22166013-TranBaTuongDuy-HTTT-DCKLTN.docx.pdf"} type="application/pdf" height="100%" width="100%" />
                </div>


            </div>
        </div>
    )
}

export default ProjectDetail