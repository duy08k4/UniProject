import type React from "react"
// import { useState } from "react"

interface Member {
    id: number
    name: string
    email: string
    role: "Lecturer" | "Student"
    joinDate: string
}

const SDMembers: React.FC = () => {
    // const [_, setIsOpenPopup] = useState<boolean>(false)

    // Mock data for demonstration
    const members: Member[] = [
        { id: 1, name: "TS. Nguyễn Văn A", email: "vana.nguyen@uni.edu.vn", role: "Lecturer", joinDate: "15-01-2026" },
        { id: 2, name: "ThS. Trần Thị B", email: "thib.tran@uni.edu.vn", role: "Lecturer", joinDate: "20-01-2026" },
        { id: 3, name: "Tran Ba Tuong Duy", email: "duytran.290804@gmail.com", role: "Student", joinDate: "26-02-2026" },
        { id: 4, name: "Le Van C", email: "vanc.le@gmail.com", role: "Student", joinDate: "27-02-2026" },
        { id: 5, name: "Nguyen Thi D", email: "thid.nguyen@gmail.com", role: "Student", joinDate: "01-03-2026" },
        ...Array(15).fill(0).map((__, index) => ({
            id: index + 6,
            name: `Sinh viên mẫu ${index + 1}`,
            email: `student${index + 1}@gmail.com`,
            role: "Student" as const,
            joinDate: "05-03-2026"
        }))
    ]

    return (
        <div className="w-full flex flex-col gap-5 py-mainTwoSidePadding">
            <div className="w-full h-fit">
                <h1 className="text-hugeSize font-semibold dark:text-white">Thành viên lớp học</h1>
                <p className="text-normalSize text-gray">Danh sách tất cả giảng viên và sinh viên tham gia lớp học</p>
            </div>

            <div className="w-full flex flex-col gap-5">
                <div className="sticky top-0 left-0 w-full bg-bgLight dark:bg-bgDark flex items-center-safe gap-5 py-5 z-10">
                    <span className="relative flex items-center-safe w-1/2 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.15)] dark:bg-black transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 text-gray dark:text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>

                        <input type="text" className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white text-smallSize" placeholder="Tìm kiếm tên hoặc email..." />
                        <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-[2px] transition-all duration-300"></span>
                    </span>

                    <span className="flex items-center-safe gap-1.5">
                        <p className="font-bold dark:text-white text-smallSize">Vai trò:</p>
                        <select className="w-40 border-[0.5px] border-lightGray px-2.5 py-1.5 rounded-small dark:text-white dark:bg-black text-smallSize outline-none focus:border-mainColor">
                            <option value="">Tất cả</option>
                            <option value="">Giảng viên</option>
                            <option value="">Sinh viên</option>
                        </select>
                    </span>

                    <span className="flex gap-1.5 items-center-safe">
                        <p className="font-bold dark:text-white text-smallSize text-nowrap">Tổng số:</p>
                        <p className="dark:text-white font-medium bg-mainColorRGB text-mainColor px-2.5 py-0.5 rounded-full text-tinySize">{members.length} thành viên</p>
                    </span>

                    <span className="flex-1 flex justify-end-safe items-center-safe gap-1.5">
                        <p className="font-medium mr-3.5 dark:text-white text-smallSize">Trang 1/1</p>

                        <button className="hoverBtn p-1.5 border-[0.5px] border-lightGray rounded-normal dark:border-gray group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 dark:text-white group-hover:text-mainColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        <button className="hoverBtn p-1.5 border-[0.5px] border-lightGray rounded-normal dark:border-gray group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5 dark:text-white group-hover:text-mainColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </span>
                </div>

                {/* Danh sách thành viên lớp - Cấu trúc phân nhóm mới */}
                <div className="w-full flex flex-col gap-10">
                    
                    {/* Nhóm Giảng viên */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3 pb-3 border-b-[0.5px] border-lightGray dark:border-gray">
                            <h2 className="text-mediumSize font-bold dark:text-white">Giảng viên</h2>
                            <span className="bg-mainColor text-white text-smallSize px-3 py-0.5 rounded-full font-bold">
                                {members.filter(m => m.role === "Lecturer").length}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {members.filter(m => m.role === "Lecturer").map((member, index) => (
                                <div key={member.id} className="group relative flex justify-between items-center p-5 bg-bgLight dark:bg-black border-[0.5px] border-lightGray dark:border-gray rounded-normal hover:border-mainColor hover:shadow-md transition-all duration-300 border-l-4 border-l-mainColor cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-full bg-mainColor flex items-center justify-center text-white font-bold text-mediumSize shrink-0 shadow-sm shadow-mainColor/20">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="dark:text-white text-normalSize font-medium group-hover:text-mainColor transition-colors">{member.name}</p>
                                            <p className="text-gray dark:text-lightGray text-smallSize italic">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-smallSize text-gray dark:text-lightGray font-medium">Tham gia: {member.joinDate}</span>
                                        {index === 0 && (
                                            <span className="bg-mainColorRGB text-mainColor text-tinySize uppercase font-black px-2 py-1 rounded-small border-[0.5px] border-mainColor/30 tracking-tight">
                                                Chủ phòng
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nhóm Sinh viên */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3 pb-3 border-b-[0.5px] border-lightGray dark:border-gray">
                            <h2 className="text-mediumSize font-bold dark:text-white">Sinh viên</h2>
                            <span className="bg-lightGray dark:bg-darkGray text-gray dark:text-white text-smallSize px-3 py-0.5 rounded-full font-bold">
                                {members.filter(m => m.role === "Student").length}
                            </span>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {members.filter(m => m.role === "Student").map((member) => (
                                <div key={member.id} className="group flex justify-between items-center px-6 py-4 bg-bgLight dark:bg-black border-[0.5px] border-lightGray dark:border-gray rounded-normal hover:bg-mainColorRGB/5 hover:border-mainColor/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-mainColorRGB flex items-center justify-center text-mainColor font-bold text-normalSize shrink-0 border-[0.5px] border-mainColor/20">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="dark:text-white text-normalSize font-medium">{member.name}</p>
                                            <p className="text-gray dark:text-lightGray text-smallSize italic">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-smallSize text-gray dark:text-lightGray font-medium">
                                        Ngày tham gia: {member.joinDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* {isOpenPopup && <UserDetailPopup togglePopup={() => setIsOpenPopup(false)} />} */}

        </div>
    )
}

export default SDMembers