import type React from "react"

// Image
import UniLogo from "../../assets/UniLogo.png"
import { NavLink } from "react-router-dom"
import { useState } from "react"

const SignIn: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    return (
        <div className="h-full w-full flex justify-center-safe items-center-safe">
            <div className="h-fit w-[450px] flex flex-col gap-5 px-10 py-15 rounded-normal shadow-[0_0_50px_20px_rgba(128,128,128,0.25)]">
                <div className="flex flex-col items-center-safe gap-3.5">
                    <img src={UniLogo} className="h-10" loading="lazy" />
                    <span className="flex flex-col items-center-safe">
                        <h1 className="font-semibold text-bigSize uppercase dark:text-white">Đăng nhập</h1>
                        <p className="text-gray">Vui lòng xác thực để truy cập</p>
                    </span>
                </div>

                <div className="w-full flex flex-col gap-3.5">
                    <span className="w-full">
                        <p className="font-medium dark:text-white">Gmail</p>
                        <input type="text" className="w-full border-[0.5px] border-lightGray dark:border-gray px-2.5 py-2.5 rounded-small dark:text-white" placeholder="VD: nguyenvana@gmail.com" />
                    </span>

                    <span className="w-full">
                        <p className="font-medium dark:text-white">Mật khẩu</p>
                        <span className="relative w-full h-fit">
                            <input type={showPassword ? "text" : "password"} className="w-full border-[0.5px] border-lightGray dark:border-gray pl-2.5 py-2.5 pr-10 rounded-small dark:text-white" placeholder="VD: nguyenvana@gmail.com" />
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 -translate-y-1/2 size-5 right-3.5 fill-gray hover:cursor-pointer" onClick={() => { setShowPassword(!showPassword) }}>
                                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                </svg>

                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 -translate-y-1/2 size-5 right-3.5 fill-gray hover:cursor-pointer" onClick={() => { setShowPassword(!showPassword) }}>
                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
                                </svg>

                            )}

                        </span>
                    </span>

                    <span className="flex justify-end-safe">
                        <NavLink to="">
                            <i><u className="text-mainColor">Quên mật khẩu?</u></i>
                        </NavLink>
                    </span>
                </div>

                <div className="w-full">
                    <button className="w-full bg-mainColor text-white py-2.5 rounded-small">Đăng nhập</button>
                </div>

                <div className="flex justify-center-safe items-center-safe">
                    <p className="font-medium dark:text-white">
                        Bạn chưa có tài khoản? {" "}
                        <NavLink to="/auth/sign-up">
                            <i><u className="text-mainColor">Đăng ký tài khoản</u></i>
                        </NavLink>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default SignIn