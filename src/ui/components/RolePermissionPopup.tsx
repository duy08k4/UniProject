import type React from "react"

interface RolePermissionPopup_Interface {
    togglePopup: () => void
}

import { useState } from "react"

interface RolePermissionPopup_Interface {
    togglePopup: () => void
}

const RolePermissionPopup: React.FC<RolePermissionPopup_Interface> = ({ togglePopup }) => {
    // Danh sách các vai trò mẫu đang được cấu hình quyền
    const [rolesInMatrix, setRolesInMatrix] = useState<string[]>(["Admin", "Lecturer"])
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [selectedRole, setSelectedRole] = useState<string>("")

    const allRoles = ["UniAdmin", "RoomAdmin", "Lecturer", "Student", "User"]

    const handleAddRole = () => {
        if (selectedRole && !rolesInMatrix.includes(selectedRole)) {
            setRolesInMatrix([...rolesInMatrix, selectedRole])
            setIsAdding(false)
            setSelectedRole("")
        }
    }

    const handleRemoveRole = (roleToRemove: string) => {
        setRolesInMatrix(rolesInMatrix.filter(role => role !== roleToRemove))
    }

    return (
        <div className="fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe z-[100]">
            <div className="w-2/3 h-fit max-h-[90%] bg-bgLight dark:bg-bgDark flex flex-col gap-6 py-8 px-10 rounded-normal shadow-2xl">
                <div className="border-b-[0.5px] border-lightGray pb-4 flex justify-between items-center-safe">
                    <div>
                        <h1 className="text-bigSize font-bold dark:text-white">Cấu hình quyền: USR_MGMT</h1>
                        <p className="text-normalSize text-gray">Quản lý người dùng hệ thống</p>
                    </div>
                    
                    {!isAdding ? (
                        <button 
                            className="bg-mainColor text-white px-4 py-2 rounded-small text-smallSize font-medium hoverBtn"
                            onClick={() => setIsAdding(true)}
                        >
                            + Thêm vai trò mới
                        </button>
                    ) : (
                        <div className="flex items-center-safe gap-2">
                            <select 
                                className="border-[0.5px] border-lightGray px-3 py-2 rounded-small dark:bg-black dark:text-white outline-none text-smallSize"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">-- Chọn vai trò --</option>
                                {allRoles.filter(r => !rolesInMatrix.includes(r)).map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <button 
                                className="bg-mainColor text-white px-3 py-2 rounded-small text-smallSize font-medium"
                                onClick={handleAddRole}
                            >
                                Thêm
                            </button>
                            <button 
                                className="text-gray px-3 py-2 text-smallSize"
                                onClick={() => setIsAdding(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </div>

                <div className="w-full overflow-x-auto border-[0.5px] border-lightGray dark:border-gray rounded-normal">
                    <table className="w-full bg-transparent">
                        <thead>
                            <tr className="bg-lightGray dark:bg-black [&_th]:text-center [&_th]:dark:text-white [&_th]:px-3.5 [&_th]:py-3 [&_th]:text-smallSize [&_th]:font-bold">
                                <th className="text-left! w-[20%] px-3.5">Vai trò</th>
                                <th>Xem</th>
                                <th>Tạo</th>
                                <th>Sửa</th>
                                <th>Xóa</th>
                                <th>Duyệt</th>
                                <th className="w-[10%]"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {rolesInMatrix.map((role, index) => (
                                <tr key={index} className="border-t-[0.5px] border-lightGray dark:border-gray [&_td]:text-center [&_td]:py-4">
                                    <td className="text-left! px-3.5 font-medium dark:text-white">{role}</td>
                                    <td><input type="checkbox" defaultChecked className="size-4 accent-mainColor" /></td>
                                    <td><input type="checkbox" className="size-4 accent-mainColor" /></td>
                                    <td><input type="checkbox" className="size-4 accent-mainColor" /></td>
                                    <td><input type="checkbox" className="size-4 accent-mainColor" /></td>
                                    <td><input type="checkbox" className="size-4 accent-mainColor" /></td>
                                    <td>
                                        <button 
                                            className="p-2 bg-redRGB rounded-small group" 
                                            title="Gỡ vai trò này"
                                            onClick={() => handleRemoveRole(role)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 stroke-red">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="w-full flex justify-end-safe gap-3 mt-4">
                    <button 
                        className="px-6 py-2.5 rounded-small font-medium border-[0.5px] border-lightGray dark:text-white hover:bg-lightGray dark:hover:bg-darkGray transition-all" 
                        onClick={togglePopup}
                    >
                        Hủy
                    </button>
                    <button 
                        className="bg-mainColor text-white px-8 py-2.5 rounded-small font-medium hoverBtn shadow-lg shadow-mainColorRGB"
                        onClick={togglePopup}
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RolePermissionPopup