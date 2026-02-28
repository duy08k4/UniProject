import type React from "react"

const Milestones: React.FC = () => {
    return (
        <div className="w-full flex flex-col gap-5 py-mainTwoSidePadding">
            <div className="w-full h-fit">
                <h1 className="text-hugeSize font-semibold dark:text-white">Quản lý cột mốc</h1>
                <p className="text-normalSize text-gray">Quản lý các cột mốc của các quy trình thực hiện đồ án</p>
            </div>

            <div className="w-full flex flex-col gap-5">
                <div className="sticky top-0 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center-safe gap-5 py-5">
                    <span className="relative flex items-center-safe w-1/2 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-6 dark:stroke-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>

                        <input type="text" className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white" placeholder="Tìm kiếm tên cột mốc hoặc tên lớp..." />
                        <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px"></span>
                    </span>

                    <span className="flex items-center-safe gap-1.5">
                        <p className="font-bold dark:text-white">Ngành:</p>

                        <select className="w-48 border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white max-sm:text-mobile-smallSize max-sm:w-full">
                            <option value="">Ngành 1</option>
                            <option value="">Ngành 2</option>
                            <option value="">Ngành 3</option>
                        </select>
                    </span>

                    <span className="flex gap-1.5 items-center-safe">
                        <p className="font-bold dark:text-white">Số lượng:</p>
                        <p className="dark:text-white">10 quy trình</p>
                    </span>

                    <span className="flex-1 flex justify-end-safe items-center-safe gap-1.5">
                        <p className="font-medium mr-3.5 dark:text-white max-sm:text-mobile-smallSize">Trang 1/20</p>

                        <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>

                        </button>

                        <button className="px-2.5 py-1.5 border-[0.5px] border-lightGray rounded-normal">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 dark:stroke-white max-sm:size-3.5 stroke-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </span>
                </div>

                <div>
                    <div className="w-full h-fit border-[0.5px] border-lightGray dark:border-gray p-2.5 rounded-normal">
                        <table className="w-full bg-transparent">
                            <colgroup>
                                <col className="w-[5%]" />
                                <col className="w-[20%]" />
                                <col className="w-[20%]" />
                                <col className="w-[15%]" />
                                <col className="w-[12%]" />
                                <col className="w-[18%]" />
                                <col className="w-[10%]" />
                            </colgroup>

                            <tr className="">
                                <th className="text-left px-3.5 py-2.5"><input type="checkbox"/></th>
                                <th className="text-left dark:text-white">Tên cột mốc</th>
                                <th className="text-left dark:text-white">Lớp</th>
                                <th className="text-left dark:text-white">Ngành</th>
                                <th className="text-center dark:text-white">Thứ tự</th>
                                <th className="text-left dark:text-white">Người tạo</th>
                                <th className="text-left dark:text-white"></th>
                            </tr>

                            {Array(20).fill(0).map((_, index) => {
                                return (
                                    <tr className="hover:bg-lightGray hover:cursor-pointer [&_td]:text-gray border-t-[0.5px] border-lightGray dark:border-gray">
                                        <td className="px-3.5 py-5"><input type="checkbox" /></td>
                                        <td>Cột mốc {index}</td>
                                        <td>Lớp đồ án 22HM</td>
                                        <td>Hệ Thống Thông Tin</td>
                                        <td className="text-center">1</td>
                                        <td>nguyenvana@gmail.com</td>
                                        <td>
                                            <button className="p-2.5 border-[0.5px] border-lightGray dark:border-gray rounded-normal" title="Xem">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-4 dark:stroke-white">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>

                                            </button>

                                            <button className="p-2.5 border-[0.5px] border-lightGray dark:border-gray rounded-normal ml-2.5" title="Đình chỉ">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-4 dark:stroke-white">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3.129-3.129m5.614-5.615 1.757-1.757a4.5 4.5 0 0 0-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 0 1-1.242-.88 4.483 4.483 0 0 1-1.062-1.683m6.587 2.345 5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99 8.898 8.9" />
                                                </svg>
                                            </button>

                                            <button className="p-2.5 bg-redRGB rounded-normal ml-2.5" title="Xóa">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-4 stroke-red">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>

                </div>
            </div>

            {/* {isOpenPopup && <UserDetailPopup togglePopup={() => setIsOpenPopup(false)} />} */}

        </div>
    )
}

export default Milestones