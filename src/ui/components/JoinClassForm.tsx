import type React from "react"
import { useState } from "react"

type NewClassFormValues = {
    joinCode: string
}

interface JoinClassForm_Interface {
    toggleForm: () => void
}

const JoinClassForm: React.FC<JoinClassForm_Interface> = ({ toggleForm }) => {
    const [newClassFormValues, setNewClassFormValues] = useState<NewClassFormValues>({
        joinCode: ""
    })

    const handleChange = (field: keyof NewClassFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewClassFormValues(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }

    return (
        <div className="fixed z-20 top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe">
            <div className="w-1/4 h-fit max-h-4/5 bg-white flex flex-col p-5 rounded-normal gap-6 max-sm:w-4/5">
                <span className="w-full">
                    <h1 className="text-center text-largeSize font-semibold uppercase max-sm:text-bigSize">Tham gia</h1>
                </span>

                <span className="flex flex-col gap-1.5">
                    <span className="flex items-center-safe justify-between">
                        <p className="text-normalSize font-semibold max-sm:text-smallSize">Mã lớp học <b className="text-red">*</b></p>
                    </span>

                    <input
                        type="text"
                        value={newClassFormValues.joinCode}
                        placeholder="..."
                        className="w-full shadow-[0_0_10px_rgba(128,128,128,0.25)] text-normalSize font-light py-2.5 px-5 rounded-small max-sm:text-smallSize"
                        maxLength={100}
                        onChange={handleChange("joinCode")}
                    />
                </span>

                <span className="flex items-center-safe gap-5">
                    <button className="flex-1 bg-lightGray hover:cursor-pointer hoverBtn py-2.5 rounded-small max-sm:text-smallSize" onClick={toggleForm}>Hủy</button>
                    <button className="flex-2 bg-mainColor hover:cursor-pointer hoverBtn text-white py-2.5 rounded-small max-sm:text-smallSize">Tham gia</button>
                </span>
            </div>
        </div>
    )
}

export default JoinClassForm