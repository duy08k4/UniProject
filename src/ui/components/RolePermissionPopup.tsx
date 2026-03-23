import type React from "react"

interface RolePermissionPopup_Interface {
    togglePopup: () => void
}

import { useEffect, useState } from "react"
import AdminService from "../../services/admin/admin.service"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import type { Permission, Usecase } from "../../redux/reducers/adminSlice.reducer"
import { ScaleLoader } from "react-spinners"

interface RolePermissionPopup_Interface {
    togglePopup: () => void,
    selectedUseCase: Usecase | undefined
}

const RolePermissionPopup: React.FC<RolePermissionPopup_Interface> = ({ togglePopup, selectedUseCase }) => {
    if (!selectedUseCase || !selectedUseCase.id) return

    // Danh sách các vai trò mẫu đang được cấu hình quyền
    const [rolesInMatrix, setRolesInMatrix] = useState<string[]>([])
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [selectedRole, setSelectedRole] = useState<string>("")
    const [usecasePermissions, setUsecasePermissions] = useState<Permission[]>([])
    const selectedUsecasePermission = useSelector((state: RootState) => state.admin.selectedUsecasePermission)

    const allRoles = ["uniadmin", "user", "roomadmin", "lecturer", "student"] as const


    // State
    const [isSaving, setIsSaving] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            await AdminService.getOnePermission(selectedUseCase.id)
        })()
    }, [selectedUseCase.id])

    const handleAddRole = () => {
        if (selectedRole && !rolesInMatrix.includes(selectedRole)) {
            setRolesInMatrix([...rolesInMatrix, selectedRole])
            setIsAdding(false)
            setUsecasePermissions([...usecasePermissions, {
                id: "",
                role: selectedRole,
                can_view: true,
                can_create: false,
                can_edit: false,
                can_delete: false,
                can_approve: false,
                usecase: { ...selectedUseCase }
            }])

            setSelectedRole("")
        }
    }

    useEffect(() => {
        setRolesInMatrix(usecasePermissions.map(permission => permission.role))
    }, [usecasePermissions])

    useEffect(() => {
        setUsecasePermissions(selectedUsecasePermission)
    }, [selectedUsecasePermission])

    const handleChange = (index: number, permission: "can_view" | "can_create" | "can_edit" | "can_delete" | "can_approve", checked: boolean) => {
        setUsecasePermissions(prev => {
            const newPermissions = [...prev];
            newPermissions[index] = { ...newPermissions[index], [permission]: checked };
            return newPermissions;
        });
    }

    const hasChanges = (): boolean => {
        if (usecasePermissions.length !== selectedUsecasePermission.length) return true;

        return usecasePermissions.some((perm, index) => {
            const original = selectedUsecasePermission[index];
            return (
                perm.can_view !== original.can_view ||
                perm.can_create !== original.can_create ||
                perm.can_edit !== original.can_edit ||
                perm.can_delete !== original.can_delete ||
                perm.can_approve !== original.can_approve
            );
        });
    };

    const handleSave = async () => {
        setIsSaving(true)
        await AdminService.updatePermission(selectedUseCase.id, usecasePermissions).finally(() => { setIsSaving(false) })
    }

    return (
        <div className="fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe z-[100]">
            <div className="w-2/3 h-fit max-h-[90%] bg-bgLight dark:bg-bgDark flex flex-col gap-6 py-8 px-10 rounded-normal shadow-2xl">
                <div className="border-b-[0.5px] border-lightGray pb-4 flex justify-between items-center-safe">
                    <div>
                        <h1 className="text-bigSize font-bold dark:text-white">Cấu hình quyền: {selectedUseCase.uc_name}</h1>
                        <p className="text-normalSize text-gray">Quản lý người dùng hệ thống</p>
                    </div>

                    {!isAdding ? (
                        <button
                            className={`bg-mainColor text-white px-4 py-2 rounded-small text-smallSize font-medium ${isSaving ? "grayscale-75!" : "hoverBtn"}`}
                            onClick={() => setIsAdding(true)}
                            disabled={isSaving}
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
                            {usecasePermissions.map((role, index) => (
                                <tr key={role.id + index} className="border-t-[0.5px] border-lightGray dark:border-gray [&_td]:text-center [&_td]:py-4">
                                    <td className="text-left! px-3.5 font-medium dark:text-white">{role.role}</td>
                                    <td><input type="checkbox" className="size-4 accent-mainColor" checked={usecasePermissions[index].can_view} onChange={(e) => handleChange(index, "can_view", e.target.checked)} /></td>
                                    <td><input type="checkbox" className="size-4 accent-mainColor" checked={usecasePermissions[index].can_create} onChange={(e) => handleChange(index, "can_create", e.target.checked)} /></td>
                                    <td><input type="checkbox" className="size-4 accent-mainColor" checked={usecasePermissions[index].can_edit} onChange={(e) => handleChange(index, "can_edit", e.target.checked)} /></td>
                                    <td><input type="checkbox" className="size-4 accent-mainColor" checked={usecasePermissions[index].can_delete} onChange={(e) => handleChange(index, "can_delete", e.target.checked)} /></td>
                                    <td><input type="checkbox" className="size-4 accent-mainColor" checked={usecasePermissions[index].can_approve} onChange={(e) => handleChange(index, "can_approve", e.target.checked)} /></td>
                                    <td></td>
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
                        className={`bg-mainColor text-white px-8 py-2.5 rounded-small font-medium shadow-lg shadow-mainColorRGB ${!hasChanges() ? "grayscale-75" : "hoverBtn"}`}
                        onClick={handleSave}
                        disabled={!hasChanges() || isSaving}
                    >
                        {isSaving ? <><ScaleLoader height={10} width={4} color="white" /></> : <>Lưu thay đổi</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RolePermissionPopup