import type React from "react"
import { useEffect, useRef, useState } from "react"
import RolePermissionPopup from "../../components/RolePermissionPopup"
import UseCasePopup from "../../components/UseCasePopup"
import AdminService from "../../../services/admin/admin.service"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import type { Usecase } from "../../../redux/reducers/adminSlice.reducer"
import { useDebounce } from "../../../hooks/Debounce"
import { ScaleLoader } from "react-spinners"
import { confirmDialog } from "primereact/confirmdialog"

const SARolePermission: React.FC = () => {
    const [isOpenUseCasePopup, setIsOpenUseCasePopup] = useState<boolean>(false)
    const [isOpenRolePermissionPopup, setIsOpenRolePermissionPopup] = useState<boolean>(false)
    const [selectedUseCase, setSelectedUseCase] = useState<Usecase>()

    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")
    const searchDebounce = useDebounce(search, 1000)

    // State
    const [isFetching, setIsFetching] = useState<boolean>(false)

    // Redux
    const useCases = useSelector((state: RootState) => state.admin.usecase)

    useEffect(() => {
        getAllUseCase.current(undefined, search)
    }, [searchDebounce])

    const getAllUseCase = useRef(async (usecaseID?: string, search?: string, sort_order?: 'ASC' | 'DESC', sort_by?: 'module' | 'uc_name' | 'description' | 'priority') => {
        if (useCases.length > 0) return
        setIsFetching(true)
        setIsSearching(true)
        await AdminService.getUseCase(usecaseID, search, sort_order, sort_by).finally(() => {
            setIsFetching(false)
            setIsSearching(false)
        })
    })

    // Handler
    const toggleRolePermission = async (usecase: Usecase) => {
        if (!usecase || !usecase.id) return
        setSelectedUseCase(usecase)
        setIsOpenRolePermissionPopup(!isOpenRolePermissionPopup)
    }

    const handleSearch = async (searchText: string) => {
        if (isSearching) return
        setSearch(searchText)
    }

    const handleRemove = async (usecase: Usecase) => {
        confirmDialog({
            header: "Xác nhận xóa",
            message: (<>Bạn có chắc muốn xóa hành động <b><i className="text-red">{usecase.uc_name}</i></b>? Hành động sẽ không thể hoàn tác.</>),

            acceptLabel: "Đồng ý",
            rejectLabel: "Hủy",

            accept: async () => {
                await AdminService.removeUsecase(usecase.id)
            }
        })
    }

    return (
        <div className="w-full flex flex-col gap-5 py-mainTwoSidePadding">
            <div className="w-full h-fit flex justify-between items-end-safe">
                <div className="">
                    <h1 className="text-hugeSize font-semibold dark:text-white">Quản lý quyền hạn</h1>
                    <p className="text-normalSize text-gray">Quản lý các Use Case và phân quyền cho từng vai trò</p>
                </div>
            </div>

            <div className="w-full flex flex-col gap-5">
                <div className="sticky top-0 left-0 w-full bg-bgLight dark:bg-bgDark flex justify-between items-center-safe gap-5 py-5 z-10">
                    <div className="w-1/2 flex items-center-safe gap-2.5">
                        <span className="relative flex items-center-safe w-3/4 px-2.5 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.25)] dark:bg-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 dark:stroke-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>

                            <input
                                onChange={(e) => { handleSearch(e.target.value) }}
                                type="text" className="h-10 w-full pl-2.5 focus:[&+#underlineInput]:w-full dark:text-white" placeholder="Tìm kiếm Use Case hoặc Module..." />
                            <span id="underlineInput" className="absolute bottom-0 left-0 bg-mainColor dark:bg-white w-0 h-px transition-all duration-300"></span>
                        </span>

                        {isSearching && (<ScaleLoader height={10} width={4} color="#499C40" />)}
                    </div>

                    <span className="flex items-center-safe gap-2.5">
                        <span className="">
                            <p className="dark:text-white">{useCases.length} chức năng</p>
                        </span>
                        
                        <button
                            onClick={() => { getAllUseCase.current() }}
                            className={`bg-lightGray dark:bg-transparent border border-bgLight dark:border-gray p-2.5 rounded-small ${!isFetching && "hoverBtn"}`} disabled={isFetching}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 dark:stroke-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>

                        <button
                            className="bg-mainColor text-white px-5 py-2.5 rounded-small font-medium hoverBtn"
                            onClick={() => setIsOpenUseCasePopup(true)}
                        >
                            Thêm Use Case mới
                        </button>
                    </span>
                </div>

                <div className="w-full h-fit border-[0.5px] border-lightGray dark:border-gray p-2.5 rounded-normal">
                    <table className="w-full bg-transparent">
                        <colgroup>
                            <col className="w-[25%]" />
                            <col className="w-[15%]" />
                            <col className="w-[25%]" />
                            <col className="w-[35%]" />
                        </colgroup>

                        <thead>
                            <tr className="[&_th]:text-left [&_th]:dark:text-white [&_th]:px-3.5 [&_th]:py-2.5">
                                <th>Chức năng</th>
                                <th>Module</th>
                                <th>Mã</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Ở đây sẽ là danh sách Use Case thực tế */}
                            {useCases.map((data, index) => (
                                <tr key={index} className="hover:bg-lightGray dark:hover:bg-darkGray hover:cursor-pointer [&_td]:text-gray [&_td]:px-3.5 [&_td]:py-2.5 border-t-[0.5px] border-lightGray dark:border-gray">
                                    <td className="px-3.5 py-5 font-medium">{data.uc_name}</td>
                                    <td>{data.module}</td>
                                    <td>{data.uc_key}</td>
                                    <td className="text-right px-3.5">
                                        <button
                                            className="px-3.5 py-1.5 bg-mainColor text-white rounded-small text-smallSize font-medium hoverBtn"
                                            onClick={() => { toggleRolePermission(data) }}
                                        >
                                            Thêm vai trò
                                        </button>

                                        {/* <button className="p-2.5 border-[0.5px] border-lightGray dark:border-gray rounded-normal ml-2.5" title="Sửa Use Case" onClick={() => setIsOpenUseCasePopup(true)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 dark:stroke-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                            </svg>
                                        </button> */}

                                        <button className="p-2.5 bg-redRGB rounded-normal ml-2.5" title="Xóa Use Case" onClick={() => { handleRemove(data) }}>
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
            </div>

            {isOpenUseCasePopup && <UseCasePopup togglePopup={() => setIsOpenUseCasePopup(false)} />}
            {isOpenRolePermissionPopup && <RolePermissionPopup togglePopup={() => setIsOpenRolePermissionPopup(false)} selectedUseCase={selectedUseCase} />}
        </div>
    )
}

export default SARolePermission