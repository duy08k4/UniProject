import type React from "react";
import { useState } from "react";
import type { Members } from "../../services/class/class.type";
import getShortName from "../../utils/getShortName";
import uniqolor from "uniqolor";
import { toast } from "sonner";
import { ClassService } from "../../services/class/class.service";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { changeStateFetching } from "../../redux/reducers/global.reducer";
import { currentClass_UpdateMember } from "../../redux/reducers/classSlice.reducer";
import { RoomRole } from "../../config/enum";

interface RAUpdateUserForm_Interface {
    toggleForm: () => void;
    memberData: Members;
}

const RAUpdateUserForm: React.FC<RAUpdateUserForm_Interface> = ({ toggleForm, memberData }) => {
    const [formData, setFormData] = useState<Partial<Members>>({
        role: memberData.role,
    });

    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const classData = useSelector((state: RootState) => state.class.currentClass.info)
    const dispatch = useDispatch()

    const color = uniqolor(memberData.user.email);

    // Handler
    const handleSubmitUpdateUser = async () => {
        const listCheck = (Object.keys(formData) as Array<keyof Members>).map(key => memberData[key] !== formData[key])

        if (listCheck.some((c) => c)) {
            dispatch(changeStateFetching(true))

            const data = await ClassService.updateMember(classData.id, memberData.user.id, { role: formData.role })
                .finally(() => {
                    dispatch(changeStateFetching(false))
                })

            if (data) {
                if (classData.user.role === RoomRole.ROOMADMIN && formData.role === RoomRole.ROOMADMIN) {
                    window.location.reload()
                    return
                }

                dispatch(currentClass_UpdateMember(data))
            }

            toggleForm()
        } else {
            toast.error("Không có thông tin để cập nhật")
        }
    }

    return (
        <div className="fixed z-50 top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe animate-fade-in">
            <div className="min-w-[450px] w-1/3 h-fit max-h-[90vh] bg-bgLight dark:bg-bgDark flex flex-col p-8 rounded-normal shadow-2xl overflow-hidden max-sm:w-11/12">

                <div className="flex flex-col gap-2 mb-8 border-b-[0.5px] border-lightGray dark:border-darkGray pb-4">
                    <h1 className="text-bigSize font-bold dark:text-white max-sm:text-mediumSize">Cập nhật thành viên</h1>
                    <p className="text-smallSize text-gray">Thay đổi vai trò và quyền hạn của thành viên trong lớp học.</p>
                </div>

                <div className="flex items-center-safe gap-4 mb-8 p-4 bg-lightGray/20 dark:bg-black/20 rounded-normal border-[0.5px] border-lightGray dark:border-darkGray">
                    <span
                        className={`h-14 aspect-square rounded-full flex items-center-safe justify-center-safe text-mediumSize font-bold shadow-sm ${color.isLight ? "text-darkGray" : "text-white"}`}
                        style={{ backgroundColor: color.color }}
                    >
                        {getShortName(memberData.user.full_name)}
                    </span>
                    <div className="flex flex-col">
                        <p className="font-bold dark:text-white text-normalSize">{memberData.user.full_name}</p>
                        <p className="text-gray text-smallSize truncate max-w-[200px]">{memberData.user.email}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <p className="text-normalSize font-bold dark:text-white">Vai trò thành viên</p>
                        <select
                            className="w-full border-[0.5px] border-lightGray dark:border-darkGray px-4 py-2.5 rounded-small dark:bg-black dark:text-white outline-none hover:border-mainColor transition-all cursor-pointer disableState"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as Members["role"] })}
                            disabled={isFetching}
                        >
                            <option value="student">Sinh viên</option>
                            <option value="lecturer">Giảng viên</option>
                            <option value="roomadmin">Quản trị viên</option>
                        </select>
                    </div>

                </div>

                <div className="flex items-center-safe gap-4 mt-2">
                    <button
                        className="flex-1 hoverBtn bg-redRGB text-red py-2.5 rounded-small font-bold transition-all disableState"
                        onClick={toggleForm}
                        disabled={isFetching}
                    >
                        Hủy
                    </button>
                    <button
                        className="flex-2 hoverBtn bg-mainColor text-white py-2.5 rounded-small font-bold shadow-lg shadow-mainColorRGB transition-all disableState"
                        onClick={handleSubmitUpdateUser}
                        disabled={isFetching}
                    >

                        {isFetching ? <ScaleLoader height={10} width={4} color="white" /> : "Cập nhật"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RAUpdateUserForm;
