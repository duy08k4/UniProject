import type React from "react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { AuthService } from "../../services/auth/auth.service"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { changeStateFetching } from "../../redux/reducers/global.reducer"

const RequireResetPassword: React.FC = () => {
    const [email, setEmail] = useState<string>("")
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const dispatch = useDispatch()

    const handleSubmit = async () => {
        if (email) {
            dispatch(changeStateFetching(true))
            
            await AuthService.requireResetPassword(email).finally(() => {
                dispatch(changeStateFetching(false))
                setEmail("")
            })
        }
    }

    return (
        <div className="h-full w-full flex justify-center-safe items-center-safe">
            <div className="h-fit w-[450px] flex flex-col gap-2.5 px-10 py-10 rounded-normal shadow-[0_0_50px_20px_rgba(128,128,128,0.25)] max-sm:px-5 max-sm:py-10">
                <div className="flex flex-col items-center-safe gap-3.5">
                    <span className="flex flex-col items-center-safe">
                        <h1 className="font-semibold text-bigSize uppercase dark:text-white">Xác nhận gmail</h1>
                        <p className="text-gray">Vui lòng cung cấp Gmail</p>
                    </span>
                </div>

                <div className="w-full flex flex-col gap-3.5">
                    <span className="w-full">
                        <p className="font-medium dark:text-white">Gmail <b className="text-red">*</b></p>
                        <input
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="text"
                            className="w-full border-[0.5px] border-lightGray dark:border-gray px-2.5 py-2.5 rounded-small dark:text-white max-sm:py-2 max-sm:text-smallSize disableState"
                            placeholder="VD: nguyenvana@gmail.com" 
                            disabled={isFetching}
                            />
                    </span>
                </div>

                <div className="w-full">
                    <button className="w-full bg-mainColor text-white py-2.5 rounded-small max-sm:py-2 max-sm:text-smallSize hoverBtn disableState" disabled={isFetching} onClick={handleSubmit}>Xác nhận</button>
                </div>

                <div className="flex justify-center-safe items-center-safe mt-5">
                    <NavLink to="/auth/sign-in">
                        <i><u className="text-mainColor">Quay lại trang đăng nhập</u></i>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default RequireResetPassword