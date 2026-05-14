import type React from "react"
import { useState } from "react"
import { ScaleLoader } from "react-spinners"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import ProgressService from "../../services/progress/progress.service"
import { useParams } from "react-router-dom"
import { changeStateFetching } from "../../redux/reducers/global.reducer"

type RANewProgressValues = {
    processName: string
    description: string
}

type Validations = {
    wordLength: (value: string) => string
    validate: (value: string) => boolean
}

const RANewProgress: React.FC = () => {
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const userData = useSelector((state: RootState) => state.auth.user.info)

    const { classId } = useParams()
    const dispatch = useDispatch()

    const [progressValues, setProgressValues] = useState<RANewProgressValues>({
        processName: "",
        description: ""
    })

    const validations: Record<keyof RANewProgressValues, Validations> = {
        processName: {
            wordLength: (value: string) => value.length.toString(),
            validate: (value: string) => value.trim().length <= 100 && value.trim().length > 0
        },
        description: {
            wordLength: (value: string) => value.length.toString(),
            validate: (value: string) => {
                const trimmed = value.trim()
                return !trimmed || trimmed.length <= 300
            }
        }
    }

    const handleChange = (field: keyof RANewProgressValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProgressValues(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }



    const handleCreate = async () => {
        if (!userData.id) return
        dispatch(changeStateFetching(true))

        await ProgressService.createNewProgress(classId as string, progressValues.processName, progressValues.description).finally(() => {
            dispatch(changeStateFetching(false))
        })
    }

    return (
        <div className=" w-full h-full flex justify-center-safe items-center-safe">
            <div className="w-1/3 h-fit max-h-4/5 bg-bgLight flex flex-col p-5 rounded-normal shadow-[0_0_50px_20px_rgba(128,128,128,0.25)] gap-6 max-sm:w-4/5">
                <span className="w-full">
                    <h1 className="text-center text-largeSize font-semibold uppercase max-sm:text-bigSize">Khởi tạo quy trình</h1>
                </span>

                <span className="flex flex-col gap-3.5">
                    <span className="flex flex-col gap-1.5">
                        <span className="flex items-center-safe justify-between">
                            <p className="text-normalSize font-semibold max-sm:text-smallSize">Tên quy trình <b className="text-red">*</b></p>
                            <p className="text-smallSize font-medium text-gray">{validations["processName"].wordLength(progressValues.processName)}/100 ký tự</p>
                        </span>

                        <input
                            type="text"
                            value={progressValues.processName}
                            placeholder="Nhập tên quy trình"
                            className="w-full shadow-[0_0_10px_rgba(128,128,128,0.25)] text-normalSize font-light py-2.5 px-5 rounded-small max-sm:text-smallSize disableState"
                            maxLength={100}
                            onChange={handleChange("processName")}
                            disabled={isFetching}
                            autoFocus
                        />
                    </span>

                    <span className="flex flex-col gap-1.5">
                        <span className="flex items-center-safe justify-between">
                            <p className="text-normalSize font-semibold max-sm:text-smallSize">Mô tả quy trình <b className="text-red">*</b></p>
                            <p className="text-smallSize font-medium text-gray">{validations["description"].wordLength(progressValues.description)}/300 ký tự</p>
                        </span>

                        <textarea
                            placeholder="Nhập mô tả quy trình"
                            value={progressValues.description}
                            className="h-20 w-full shadow-[0_0_10px_rgba(128,128,128,0.25)] text-normalSize font-light py-2.5 px-5 rounded-small max-sm:text-smallSize resize-none disableState"
                            onChange={handleChange("description")}
                            maxLength={300}
                            disabled={isFetching}
                        ></textarea>
                    </span>
                </span>

                <span className="flex items-center-safe gap-5">
                    <button
                        className="flex-2 bg-mainColor hover:cursor-pointer hoverBtn text-white py-2.5 rounded-small max-sm:text-smallSize disableState"
                        disabled={isFetching}
                        onClick={handleCreate}
                    >
                        {isFetching ? <ScaleLoader height={10} width={4} color="white" /> : "Tạo quy trình"}
                    </button>
                </span>
            </div>
        </div>
    )
}

export default RANewProgress
