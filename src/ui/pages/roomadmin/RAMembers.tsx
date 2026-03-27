import type React from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import uniqolor from 'uniqolor'

const RAMembers: React.FC = () => {
    // const [_, setIsOpenPopup] = useState<boolean>(false)
    const classMembers = useSelector((state: RootState) => state.class.currentClass.members)

    useEffect(() => {
        if (classMembers.length > 0) {

        }
    }, [])

    return (
        <div className="w-full flex flex-col gap-5 py-mainTwoSidePadding">
            <div className="w-full h-fit">
                <h1 className="text-largeSize font-semibold dark:text-white">Quản lý thành viên</h1>
                <p className="text-normalSize text-gray">Quản lý tất cả thành viên của lớp học</p>
            </div>

            <div className="w-full flex flex-col gap-5">
                <div className="sticky top-0 z-10 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center-safe gap-5 py-5">
                    <button className="h-full aspect-square p-1.5 border-[0.5px] border-lightGray rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4 dark:stroke-white max-sm:size-3.5 stroke-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>

                    <span className="relative flex items-center-safe w-1/2 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>

                        <input type="text" className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white" placeholder="Tìm kiếm tên hoặc gmail..." />
                        <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px"></span>
                    </span>

                    <span className="flex items-center-safe gap-1.5">
                        <p className="font-bold dark:text-white">Trạng thái:</p>

                        <select className="w-48 border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white max-sm:text-mobile-smallSize max-sm:w-full">
                            <option value="">Hoạt động</option>
                            <option value="">Đình chỉ</option>
                            <option value="">Đã xóa</option>
                        </select>
                    </span>

                    <span className="flex gap-1.5 items-center-safe">
                        <p className="font-bold dark:text-white">Số lượng:</p>
                        <p className="dark:text-white">10 user</p>
                    </span>

                    <span className="flex-1 flex justify-end-safe items-center-safe gap-1.5">
                        <p className="font-medium mr-3.5 dark:text-white max-sm:text-mobile-smallSize">Trang 1/20</p>

                        <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>

                        </button>

                        <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </span>
                </div>

                <div>
                    <div className="w-full h-fit p-2.5 rounded-normal">
                        <div className="w-full h-fit grid grid-cols-3 gap-5">
                            {Array(18).fill(0).map(() => {
                                const uniqolorRandom = uniqolor("asd756ad@asdjh2!@sdadasd")
                                return (
                                    <div className="flex flex-col gap-2.5 shadow-[0_0_20px_rgba(128,128,128,0.25)] hover:shadow-[0_0_10px_2px_rgba(128,128,128,0.75)] hoverBtn rounded-normal px-3.5 py-5">
                                        <div className="flex items-start gap-2.5">
                                            <span className={`h-12 aspect-square rounded-full bg-mainColor flex items-center-safe justify-center-safe text-normalSize ${uniqolorRandom.isLight ? "text-darkGray" : "text-white"}`} style={{ backgroundColor: uniqolorRandom.color }}>
                                                NA
                                            </span>

                                            <span className="flex-1 flex flex-col">
                                                <span className="flex items-center-safe gap-1.5">
                                                    <p className="font-bold dark:text-white">Nguyễn Văn A</p>

                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 fill-mainColor">
                                                        <path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                                                    </svg>
                                                </span>

                                                <p className="text-gray text-smallSize">nguyenvana@gmail.com</p>
                                            </span>

                                            <span className="flex flex-col gap-1.5">
                                                <p className="bg-mainColor text-white capitalize px-2.5 py-0.5 text-smallSize rounded-small">giảng viên</p>
                                                <p className="bg-redRGB text-red capitalize px-2.5 py-0.5 text-smallSize rounded-small">chờ chuyệt</p>
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <p className="font-semibold dark:text-white">Quyền hạn</p>

                                            <span className="flex flex-wrap gap-1.5">
                                                <p className="text-smallSize bg-lightGray dark:bg-gray dark:text-bgDark px-1.5 py-0.5 rounded-small">Tạo thông báo</p>
                                                <p className="text-smallSize bg-lightGray dark:bg-gray dark:text-bgDark px-1.5 py-0.5 rounded-small">Tạo biểu mẫu</p>
                                            </span>
                                        </div>

                                        <div className="flex items-center-safe justify-between mt-3.5">
                                            <p className="text-gray text-smallSize">Tham gia 00:00:0000</p>

                                            <span className="flex items-center-safe gap-2.5">
                                                <button className="bg-orangedRGB text-oranged px-2.5 py-1 rounded-small">Đình chỉ</button>
                                                <button className="bg-redRGB text-red px-2.5 py-1 rounded-small">Xóa</button>
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* {isOpenPopup && <UserDetailPopup togglePopup={() => setIsOpenPopup(false)} />} */}

        </div>
    )
}

export default RAMembers