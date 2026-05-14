import type React from "react"
import { useState } from "react"
import type { formValidationConfig_type } from "./SignUp"

type FormValues = {
    password: string,
    confirmPassword: string
}

const ResetPassword: React.FC = () => {
    const [formValues, setFormValues] = useState<FormValues>({
        password: "",
        confirmPassword: ""
    })

    const formValidationConfig: formValidationConfig_type = {
        password: {
            label: "Mật khẩu",
            rules: [
                {
                    message: "Độ dài từ 8 đến 20 ký tự",
                    validate: (value: string) => value.length >= 8 && value.length <= 20
                },
                {
                    message: "Có chữ hoa",
                    validate: (value: string) => /[A-Z]/.test(value)
                },
                {
                    message: "Có chữ thường",
                    validate: (value: string) => /[a-z]/.test(value)
                },
                {
                    message: "Có số",
                    validate: (value: string) => /\d/.test(value)
                },
                {
                    message: "Có ký tự đặc biệt",
                    validate: (value: string) =>
                        /[^A-Za-z0-9]/.test(value)
                }
            ]
        },
        confirmPassword: {
            label: "Nhập lại mật khẩu",
            rules: [
                {
                    message: "Mật khẩu trùng khớp",
                    validate: (value: string) => value === formValues.password && value.length > 0
                }
            ]
        }
    }

    const isFormValid = (Object.keys(formValidationConfig) as (keyof FormValues)[]).every((fieldKey) => {
        const value = formValues[fieldKey]

        return formValidationConfig[fieldKey].rules.every((rule) =>
            rule.validate(value)
        )
    })

    const handleChange = (field: keyof FormValues) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormValues(prev => ({
                ...prev,
                [field]: e.target.value
            }))
        }

    return (
        <div className="h-full w-full flex justify-center-safe items-center-safe gap-10 max-sm:flex max-sm:flex-col">
            <div className="h-fit w-[450px] flex flex-col gap-5 px-10 py-15 rounded-normal shadow-[0_0_50px_20px_rgba(128,128,128,0.25)] max-sm:w-full max-sm:px-5 max-sm:py-10">
                <div className="flex flex-col items-center-safe gap-3.5">
                    <span className="flex flex-col items-center-safe">
                        <h1 className="font-semibold text-bigSize uppercase dark:text-white">Đặt lại mật khẩu</h1>
                        <p className="text-gray">Vui lòng điền đầy đủ thông tin </p>
                    </span>
                </div>

                <div className="w-full flex flex-col gap-3.5">
                    <span className="w-full">
                        <p className="font-medium dark:text-white">Mập khẩu <b className="text-red">*</b></p>
                        <input type="password" className="w-full border-[0.5px] border-lightGray dark:border-gray px-2.5 py-2.5 rounded-small dark:text-white max-sm:text-smallSize" onChange={handleChange("password")} placeholder="..." />
                    </span>

                    <span className="w-full">
                        <p className="font-medium dark:text-white">Nhập lại mật khẩu <b className="text-red">*</b></p>
                        <input type="password" className="w-full border-[0.5px] border-lightGray dark:border-gray px-2.5 py-2.5 rounded-small dark:text-white max-sm:text-smallSize" onChange={handleChange("confirmPassword")} placeholder="..." />
                    </span>
                </div>

                <div className="w-full">
                    <button className="hoverBtn w-full bg-mainColor text-white py-2.5 rounded-small hover:cursor-pointer max-sm:text-smallSize">Cập nhật</button>
                </div>
            </div>

            <div className="h-fit w-[400px] flex flex-col gap-5 shadow-[0_0_50px_20px_rgba(128,128,128,0.25)] px-10 py-10 rounded-normal max-sm:w-full">
                <h1 className="text-center text-bigSize font-medium dark:text-white">Kiểm tra thông tin</h1>

                <div className="">
                    {Object.entries(formValidationConfig).map(([fieldKey, fieldValue]) => (
                        <div className="flex flex-col">
                            <h1 className="font-medium text-normalSize dark:text-white">{fieldValue.label}</h1>
                            <span className="w-full ml-5">
                                {fieldValue.rules.map((validation) => {
                                    const value = formValues[fieldKey as keyof FormValues]
                                    const isValid = validation.validate(value)

                                    return (
                                        <span className="flex items-center-safe gap-2.5">
                                            {isValid ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-5 stroke-mainColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-5 stroke-red">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            )}

                                            <p className="text-smallSize dark:text-gray">{validation.message}</p>
                                        </span>
                                    )
                                })}
                            </span>
                        </div>
                    ))}
                </div>

                <div className={`w-full flex items-center-safe justify-center-safe ${isFormValid ? "bg-mainColorRGB" : "bg-redRGB"} py-2.5 rounded-small`}>
                    <p className={isFormValid ? "text-mainColor" : "text-red"}>{isFormValid ? "Dữ liệu hợp lệ" : "Dữ liệu chưa hợp lệ"}</p>
                </div>
            </div>
        </div >
    )

}

export default ResetPassword