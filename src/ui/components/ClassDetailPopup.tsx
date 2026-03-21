import type React from "react"

interface ClassDetailPopup_Interface {
    togglePopup: () => void
}

const ClassDetailPopup: React.FC<ClassDetailPopup_Interface> = ({ togglePopup }) => {
    return (
        <div className="fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe">
            <div className="w-1/2 h-fit max-h-4/5 bg-bgLight dark:bg-bgDark flex flex-col gap-5 py-5 px-10 rounded-normal">
                <div className="">
                    <h1 className="text-bigSize font-bold dark:text-white">Lớp đồ án 22HM</h1>
                    <span className="flex items-center-safe gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 dark:fill-white">
                            <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clipRule="evenodd" />
                        </svg>

                        <p className="text-normalSize font-medium text-gray">nguyenvana@gmail.com</p>
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="flex flex-col gap-1.5 items-center-safe">
                        <h4 className="bg-bgDark dark:bg-mainColorRGB dark:text-mainColor text-white font-medium px-5 py-1 rounded-small">Chuyên ngành</h4>
                        <p className="dark:text-white">Hệ Thống Thông Tin</p>
                    </span>

                    <span className="flex flex-col gap-1.5 items-center-safe">
                        <h4 className="bg-bgDark dark:bg-mainColorRGB dark:text-mainColor text-white font-medium px-5 py-1 rounded-small">Mã tham gia</h4>
                        <p className="dark:text-white">abcxyz</p>
                    </span>

                    <span className="flex flex-col gap-1.5 items-center-safe">
                        <h4 className="bg-bgDark dark:bg-mainColorRGB dark:text-mainColor text-white font-medium px-5 py-1 rounded-small">Trạng thái</h4>
                        <p className="dark:text-white">Hoạt động</p>
                    </span>

                    <span className="flex flex-col gap-1.5 items-center-safe">
                        <h4 className="bg-bgDark dark:bg-mainColorRGB dark:text-mainColor text-white font-medium px-5 py-1 rounded-small">Ngày tạo</h4>
                        <p className="dark:text-white">26-02-2026</p>
                    </span>
                </div>

                <div className="flex flex-col gap-1.5">
                    <h2 className="text-normalSize font-bold dark:text-white">Thành viên (20):</h2>

                    <div className="w-full h-fit border-[0.5px] border-lightGray dark:border-gray p-2.5 rounded-small">
                        <table className="w-full bg-transparent">
                            <colgroup>
                                <col className="w-[40%]" />
                                <col className="w-[30%]" />
                                <col className="w-[20%]" />
                                <col className="w-[10%]" />
                            </colgroup>

                            <tr className="">
                                <th className="text-left dark:text-white px-3.5 py-2.5">Tên</th>
                                <th className="text-left dark:text-white">Email</th>
                                <th className="text-left dark:text-white">Trạng thái</th>
                                <th className="text-center"></th>
                            </tr>

                            {Array(2).fill(0).map(() => {
                                return (
                                    <tr className="hover:bg-lightGray hover:cursor-pointer [&_td]:text-gray text-smallSize border-t-[0.5px] border-lightGray dark:border-gray">
                                        <td className="px-3.5 py-5">Tran Ba Tuong Duy</td>
                                        <td>duytran.290804@gmail.com</td>
                                        <td>Hoạt động</td>
                                        <td><button className="px-2.5 py-1.5 text-white font-medium bg-mainColor rounded-small" title="Đình chỉ">Xem lớp</button></td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                </div>

                <div className="w-full flex justify-center-safe">
                    <button className="hoverBtn bg-redRGB text-red px-10 py-2.5 rounded-small" onClick={togglePopup}>Đóng</button>
                </div>
            </div>
        </div>
    )
}

export default ClassDetailPopup