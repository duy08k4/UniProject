import type React from "react"
import { useEffect, useState } from "react"
import { confirmDialog } from "primereact/confirmdialog"
import { useDebounce } from "../../../hooks/Debounce"
import { AdminService } from "../../../services/admin/admin.service"
import type { AdminUser, AdminUserPagination } from "../../../services/admin/admin.type"
import formatVNTime from "../../../utils/formatVNTime"
import getShortName from "../../../utils/getShortName"

type StatusFilter = "" | "active" | "banned" | "deleted"

const statusFilterMap: Record<StatusFilter, { is_banned?: boolean; is_deleted?: boolean }> = {
    "": {},
    active: { is_banned: false, is_deleted: false },
    banned: { is_banned: true },
    deleted: { is_deleted: true },
}

const StatusBadge: React.FC<{ user: AdminUser }> = ({ user }) => {
    if (user.is_deleted) return <span className="text-[13px] text-red font-semibold px-2.5 py-1 bg-red/10 rounded-small">Đã xóa</span>
    if (user.is_banned) return <span className="text-[13px] text-oranged font-semibold px-2.5 py-1 bg-oranged/10 rounded-small">Đình chỉ</span>
    return <span className="text-[13px] text-mainColor font-semibold px-2.5 py-1 bg-mainColor/10 rounded-small">Hoạt động</span>
}

const UserManagement: React.FC = () => {
    const [result, setResult] = useState<AdminUserPagination | null>(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("")
    const [loading, setLoading] = useState(false)
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
    const [popupLoading, setPopupLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    const searchDebounce = useDebounce(search, 1000)

    const fetchUsers = async (p = page) => {
        setLoading(true)
        const filters = statusFilterMap[statusFilter]
        const data = await AdminService.getUsers(p, 100, searchDebounce || undefined, filters.is_banned, filters.is_deleted)
        if (data) setResult(data)
        setLoading(false)
    }

    useEffect(() => {
        setPage(1)
        fetchUsers(1)
    }, [searchDebounce, statusFilter])

    useEffect(() => {
        fetchUsers(page)
    }, [page])

    const openPopup = async (userId: string) => {
        setSelectedUser(null)
        setPopupLoading(true)
        const user = await AdminService.getOneUser(userId)
        if (user) setSelectedUser(user)
        setPopupLoading(false)
    }

    const handleBan = async () => {
        if (!selectedUser || actionLoading) return
        setActionLoading(true)
        const updated = await AdminService.updateUser(selectedUser.id, { is_banned: !selectedUser.is_banned })
        if (updated) { setSelectedUser(updated); fetchUsers() }
        setActionLoading(false)
    }

    const handleDelete = () => {
        if (!selectedUser) return
        confirmDialog({
            header: "Xác nhận xóa tài khoản",
            message: `Tài khoản "${selectedUser.full_name}" sẽ bị xóa. Bạn có thể khôi phục lại sau.`,
            acceptLabel: "Xóa tài khoản",
            rejectLabel: "Hủy",
            acceptClassName: "p-button-danger",
            accept: async () => {
                setActionLoading(true)
                const updated = await AdminService.updateUser(selectedUser.id, { is_deleted: true })
                if (updated) { setSelectedUser(updated); fetchUsers() }
                setActionLoading(false)
            }
        })
    }

    const handleRestore = async () => {
        if (!selectedUser || actionLoading) return
        setActionLoading(true)
        const updated = await AdminService.updateUser(selectedUser.id, { is_deleted: false })
        if (updated) { setSelectedUser(updated); fetchUsers() }
        setActionLoading(false)
    }

    const pagination = result?.pagination

    return (
        <div className="w-full flex flex-col gap-6 py-mainTwoSidePadding px-mainTwoSidePadding">
            {/* Header */}
            <div>
                <h1 className="text-largeSize font-bold dark:text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-mainColor rounded-full" />
                    Quản lý người dùng
                </h1>
                <p className="text-normalSize text-gray mt-1">Tổng cộng {pagination?.total_users ?? "—"} người dùng trong hệ thống</p>
            </div>

            {/* Filter bar */}
            <div className="sticky top-0 z-10 w-full bg-bgLight dark:bg-bgDark flex items-center gap-5 py-4 border-b border-lighterGray dark:border-gray/20">
                <span className="relative flex items-center w-1/2 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 shrink-0 dark:stroke-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-10 w-full pl-2.5 bg-transparent focus:[&+span]:w-full dark:text-white"
                        placeholder="Tìm kiếm tên hoặc email..."
                    />
                    <span className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px transition-all duration-300" />
                </span>

                <span className="flex items-center gap-2">
                    <p className="font-bold dark:text-white whitespace-nowrap">Trạng thái:</p>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                        className="w-52 border-[0.5px] border-lightGray dark:border-darkGray px-3.5 py-1.5 rounded-small dark:text-white dark:bg-transparent"
                    >
                        <option value="">Tất cả</option>
                        <option value="active">Hoạt động</option>
                        <option value="banned">Đình chỉ</option>
                        <option value="deleted">Đã xóa</option>
                    </select>
                </span>

                <span className="flex-1 flex justify-end items-center gap-2">
                    <p className="font-medium dark:text-white text-smallSize">
                        Trang <span className="font-bold text-mainColor">{pagination?.page ?? 1}</span>/{pagination?.totalPage ?? 1}
                    </p>
                    <button disabled={loading || page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 border-[0.5px] border-lightGray rounded-normal disabled:opacity-40 hover:bg-mainColor/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button disabled={loading || page >= (pagination?.totalPage ?? 1)} onClick={() => setPage(p => p + 1)} className="p-2 border-[0.5px] border-lightGray rounded-normal disabled:opacity-40 hover:bg-mainColor/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </span>
            </div>

            {/* Table */}
            <div className="rounded-normal border border-lighterGray dark:border-gray/20 shadow-sm overflow-hidden">
                <table className="w-full bg-white dark:bg-black/20">
                    <colgroup>
                        <col className="w-[28%]" />
                        <col className="w-[30%]" />
                        <col className="w-[12%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                    </colgroup>
                    <thead className="border-b border-lighterGray dark:border-gray/20 bg-lighterGray/30 dark:bg-white/5">
                        <tr className="[&_th]:px-5 [&_th]:py-4 [&_th]:text-mobile-smallSize [&_th]:font-bold [&_th]:text-gray [&_th]:uppercase [&_th]:tracking-widest [&_th]:text-left">
                            <th>Người dùng</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Tham gia</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-lighterGray dark:divide-gray/10">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-16 text-gray">Đang tải...</td></tr>
                        ) : !result?.data.length ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-30">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-16"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                                        <p className="font-bold text-normalSize">Không có người dùng</p>
                                    </div>
                                </td>
                            </tr>
                        ) : result.data.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => openPopup(user.id)}
                                className="group hover:bg-mainColor/5 transition-colors cursor-pointer [&_td]:px-5 [&_td]:py-4"
                            >
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-mainColor/10 flex items-center justify-center text-mobile-smallSize font-bold text-mainColor border border-mainColor/20 shrink-0">
                                            {getShortName(user.full_name)}
                                        </div>
                                        <span className="font-semibold dark:text-white group-hover:text-mainColor transition-colors">{user.full_name}</span>
                                    </div>
                                </td>
                                <td className="text-gray text-smallSize">{user.email}</td>
                                <td className="text-gray text-smallSize capitalize">{user.role}</td>
                                <td><StatusBadge user={user} /></td>
                                <td className="text-gray text-smallSize">{formatVNTime(user.created_at).split(",")[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Popup */}
            {(selectedUser || popupLoading) && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={(e) => { if (e.target === e.currentTarget && !actionLoading) setSelectedUser(null) }}
                >
                    <div className="bg-white dark:bg-lightDark shadow-xl w-[460px] max-w-[calc(100vw-2rem)] rounded-small overflow-hidden">
                        {/* Popup header */}
                        <div className="flex items-center justify-between px-5 py-4 bg-lightGray dark:bg-darkGray">
                            <h2 className="font-bold dark:text-white">
                                {popupLoading ? "Đang tải..." : "Thông tin người dùng"}
                            </h2>
                            <button onClick={() => setSelectedUser(null)} disabled={actionLoading} className="p-1 hover:opacity-60 transition-opacity disabled:opacity-30">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 dark:stroke-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {popupLoading || !selectedUser ? (
                            <div className="py-16 text-center text-gray">Đang tải thông tin...</div>
                        ) : (
                            <>
                                {/* Avatar + name */}
                                <div className="px-5 pt-5 pb-4 flex items-center gap-4 border-b border-lightGray dark:border-gray/20">
                                    <div className="w-14 h-14 rounded-full bg-mainColor/10 flex items-center justify-center text-normalSize font-bold text-mainColor border border-mainColor/20 shrink-0">
                                        {getShortName(selectedUser.full_name)}
                                    </div>
                                    <div>
                                        <p className="text-normalSize font-bold dark:text-white">{selectedUser.full_name}</p>
                                        <p className="text-smallSize text-gray mt-0.5">{selectedUser.email}</p>
                                        <div className="mt-1.5"><StatusBadge user={selectedUser} /></div>
                                    </div>
                                </div>

                                {/* Info rows */}
                                <div className="px-5 py-4 flex flex-col gap-3">
                                    {([
                                        ["Vai trò", selectedUser.role],
                                        ["Số điện thoại", selectedUser.phone_number ?? "Chưa cập nhật"],
                                        ["Ngày tham gia", formatVNTime(selectedUser.created_at)],
                                        ["Email xác thực", selectedUser.email_confirm ? "✓ Đã xác thực" : "✗ Chưa xác thực"],
                                    ] as [string, string][]).map(([label, value]) => (
                                        <div key={label} className="flex items-center gap-2">
                                            <span className="text-smallSize text-gray w-36 shrink-0">{label}</span>
                                            <span className="text-smallSize font-semibold dark:text-white">{value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                {!selectedUser.is_deleted ? (
                                    <div className="flex gap-2.5 px-5 py-4 bg-lightGray dark:bg-darkGray">
                                        <button
                                            disabled={actionLoading}
                                            onClick={handleBan}
                                            className="flex-1 py-2 border-[0.5px] border-lightGray dark:border-gray rounded-small text-smallSize font-bold dark:text-white hover:bg-white dark:hover:bg-black/20 transition-colors disabled:opacity-40"
                                        >
                                            {actionLoading ? "Đang xử lý..." : selectedUser.is_banned ? "Bỏ đình chỉ" : "Đình chỉ"}
                                        </button>
                                        <button
                                            disabled={actionLoading}
                                            onClick={handleDelete}
                                            className="flex-1 py-2 bg-redRGB rounded-small text-smallSize font-bold text-red hover:opacity-80 transition-opacity disabled:opacity-40"
                                        >
                                            Xóa tài khoản
                                        </button>
                                    </div>
                                ) : (
                                    <div className="px-5 py-4 bg-lightGray dark:bg-darkGray">
                                        <button
                                            disabled={actionLoading}
                                            onClick={handleRestore}
                                            className="w-full py-2 bg-mainColor text-white rounded-small text-smallSize font-bold hoverBtn disabled:opacity-40"
                                        >
                                            {actionLoading ? "Đang xử lý..." : "Khôi phục tài khoản"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserManagement
