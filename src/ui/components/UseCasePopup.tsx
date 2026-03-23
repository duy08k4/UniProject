import type React from "react"
import { useState } from "react"
import AdminService from "../../services/admin/admin.service"
import { ScaleLoader } from "react-spinners"

interface UseCasePopup_Interface {
    togglePopup: () => void
}

type UsecaseData = {
    uc_name: string,
    uc_key: string,
    module: string,
    priority: string
}

const UseCasePopup: React.FC<UseCasePopup_Interface> = ({ togglePopup }) => {
    const [usecaseData, setUsecaseData] = useState<UsecaseData>({
        uc_name: "",
        uc_key: "",
        module: "",
        priority: ""
    })

    // State
    const [isCreating, setIsCreating] = useState<boolean>(false)


    // Handler
    const handleChange = (fieldKey: keyof UsecaseData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUsecaseData(prev => ({
            ...prev,
            [fieldKey]: e.target.value
        }))
    }

    const handleCreate = async () => {
        setIsCreating(true)
        const { uc_key, uc_name, module, priority } = usecaseData
        await AdminService.addUsecase(uc_name, uc_key, module, priority).finally(() => {
            setIsCreating(false)
            setUsecaseData({ uc_name: "", uc_key: "", module: "", priority: "" })
        })
    }


    return (
        <div className="fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe z-100">
            <div className="w-1/3 h-fit max-h-4/5 bg-bgLight dark:bg-bgDark flex flex-col gap-6 py-8 px-10 rounded-normal shadow-2xl">
                <div className="border-b-[0.5px] border-lightGray pb-4">
                    <h1 className="text-bigSize font-bold dark:text-white">Thêm Use Case mới</h1>
                    <p className="text-normalSize text-gray">Tạo Use Case để định nghĩa các chức năng của hệ thống</p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold dark:text-white">Tên chức năng <b className="text-red font-bold">*</b></label>
                        <input
                            type="text"
                            onChange={handleChange("uc_name")}
                            value={usecaseData.uc_name}
                            className="w-full border-[0.5px] border-lightGray px-3 py-2 rounded-small dark:bg-black dark:text-white outline-none focus:border-mainColor focus:ring-1 focus:ring-mainColor"
                            placeholder="Ví dụ: Duyệt lớp học mới"
                            disabled={isCreating}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold dark:text-white">Mã chức năng <b className="text-red font-bold">*</b></label>
                        <input
                            type="text"
                            onChange={handleChange("uc_key")}
                            value={usecaseData.uc_key}
                            className="w-full border-[0.5px] border-lightGray px-3 py-2 rounded-small dark:bg-black dark:text-white outline-none focus:border-mainColor focus:ring-1 focus:ring-mainColor"
                            placeholder="Ví dụ: CLS_APV"
                            disabled={isCreating}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold dark:text-white">Module <b className="text-red font-bold">*</b></label>
                        <input
                            type="text"
                            onChange={handleChange("module")}
                            value={usecaseData.module}
                            className="w-full border-[0.5px] border-lightGray px-3 py-2 rounded-small dark:bg-black dark:text-white outline-none focus:border-mainColor focus:ring-1 focus:ring-mainColor"
                            placeholder="Ví dụ: Auth, Class, Scoreboard"
                            disabled={isCreating}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold dark:text-white">Độ ưu tiên <b className="text-red font-bold">*</b></label>
                        <select
                            disabled={isCreating}
                            onChange={handleChange("priority")}
                            value={usecaseData.priority}
                            className="w-full border-[0.5px] border-lightGray px-3 py-2 rounded-small dark:bg-black dark:text-white outline-none focus:border-mainColor"
                        >
                            <option value="must_have">Bắt buộc (Must have)</option>
                            <option value="should_have">Nên có (Should have)</option>
                            <option value="could_have">Có thể có (Could have)</option>
                            <option value="won't_have">Không có (Won't have)</option>
                        </select>
                    </div>
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
                        onClick={handleCreate}
                        disabled={isCreating}
                    >
                        {isCreating ? <><ScaleLoader height={10} width={4} color="white" /></> : <>Tạo Use Case</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UseCasePopup