import type React from "react"

const RequireResetPassword: React.FC = () => {
    return (
        <div className="h-full w-full flex justify-center-safe items-center-safe">
            <div className="h-fit w-[450px] flex flex-col gap-2.5 px-10 py-15 rounded-normal shadow-[0_0_50px_20px_rgba(128,128,128,0.25)] max-sm:px-5 max-sm:py-10">
                <div className="flex flex-col items-center-safe gap-3.5">
                    <span className="flex flex-col items-center-safe">
                        <h1 className="font-semibold text-bigSize uppercase dark:text-white">Xác nhận gmail</h1>
                        <p className="text-gray">Vui lòng cung cấp gmail</p>
                    </span>
                </div>

                <div className="w-full flex flex-col gap-3.5">
                    <span className="w-full">
                        <p className="font-medium dark:text-white">Gmail <b className="text-red">*</b></p>
                        <input type="text" className="w-full border-[0.5px] border-lightGray dark:border-gray px-2.5 py-2.5 rounded-small dark:text-white max-sm:py-2 max-sm:text-smallSize" placeholder="VD: nguyenvana@gmail.com" />
                    </span>
                </div>

                <div className="w-full">
                    <button className="w-full bg-mainColor text-white py-2.5 rounded-small max-sm:py-2 max-sm:text-smallSize">Xác nhận</button>
                </div>
            </div>
        </div>
    )
}

export default RequireResetPassword