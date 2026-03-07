import type React from "react"

interface UserDetailPopup_Interface {
    togglePopup: () => void
}

const UserDetailPopup: React.FC<UserDetailPopup_Interface> = ({ togglePopup }) => {
    return (
        <div className="fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe">
            <div className="w-1/2 h-fit max-h-4/5 bg-bgLight dark:bg-bgDark flex flex-col gap-5 py-5 px-10 rounded-normal">
                <div className="">
                    <h1 className="text-bigSize font-bold dark:text-white">Tran Ba Tuong Duy</h1>
                    <p className="text-normalSize text-gray">duytran.290804@gmail.com</p>
                </div>

                <div className="flex justify-between">
                    <span className="flex flex-col gap-1.5 items-center-safe">
                        <h4 className="bg-bgDark dark:bg-mainColorRGB dark:text-mainColor text-white font-medium px-5 py-1 rounded-small">Vai trò</h4>
                        <p className="dark:text-white">Sinh viên</p>
                    </span>

                    <span className="flex flex-col gap-1.5 items-center-safe">
                        <h4 className="bg-bgDark dark:bg-mainColorRGB dark:text-mainColor text-white font-medium px-5 py-1 rounded-small">Trạng thái</h4>
                        <p className="dark:text-white">Hoạt động</p>
                    </span>

                    <span className="flex flex-col gap-1.5 items-center-safe">
                        <h4 className="bg-bgDark dark:bg-mainColorRGB dark:text-mainColor text-white font-medium px-5 py-1 rounded-small">Ngày tham gia</h4>
                        <p className="dark:text-white">26-02-2026</p>
                    </span>
                </div>

                <div className="flex flex-col gap-1.5">
                    <h2 className="text-normalSize font-bold dark:text-white">Lớp học</h2>

                    <div className="w-full h-fit border-[0.5px] border-lightGray dark:border-gray p-2.5 rounded-small">
                        <table className="w-full bg-transparent">
                            <colgroup>
                                <col className="w-[40%]" />
                                <col className="w-[20%]" />
                                <col className="w-[30%]" />
                                <col className="w-[10%]" />
                            </colgroup>

                            <tr className="">
                                <th className="text-left dark:text-white px-3.5 py-2.5">Tên lớp</th>
                                <th className="text-left dark:text-white">Chủ phòng</th>
                                <th className="text-left dark:text-white">Email</th>
                                <th className="text-center"></th>
                            </tr>

                            {Array(2).fill(0).map(() => {
                                return (
                                    <tr className="hover:bg-lightGray hover:cursor-pointer [&_td]:text-gray text-smallSize border-t-[0.5px] border-lightGray dark:border-gray">
                                        <td className="px-3.5 py-5">Lớp đồ án</td>
                                        <td>Nguyen Van A</td>
                                        <td>duytran.290804@gmail.com</td>
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

export default UserDetailPopup