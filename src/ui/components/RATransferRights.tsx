import type React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import uniqolor from "uniqolor";
import getShortName from "../../utils/getShortName";
import { ClassService } from "../../services/class/class.service";
import type { Members } from "../../services/class/class.type";
import { currentClass_SetMembers } from "../../redux/reducers/classSlice.reducer";
import { changeStateFetching } from "../../redux/reducers/global.reducer";
import { useDebounce } from "../../hooks/Debounce";
import { ScaleLoader } from "react-spinners";
import { confirmDialog } from "primereact/confirmdialog";
import { RoomRole } from "../../config/enum";

interface RATransferRights_Interface {
    togglePopup: () => void;
}

const RATransferRights: React.FC<RATransferRights_Interface> = ({ togglePopup }) => {
    const userData = useSelector((state: RootState) => state.auth.user.info);
    const classData = useSelector((state: RootState) => state.class.currentClass.info);
    const [members, setMembers] = useState<Members[]>()
    const [searchTerm, setSearchTerm] = useState("");
    const isFetching = useSelector((state: RootState) => state.stateGlobal.isFetching)
    const debounceSearch = useDebounce(searchTerm, 1500)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!userData.id) return

        (async () => {
            dispatch(changeStateFetching(true))
            await ClassService.getMembers(1, 200, searchTerm).then((data) => {
                if (data) {
                    dispatch(currentClass_SetMembers(data))
                    const membersArray = Object.values(data.data).flat()

                    if (membersArray.length > 0) {
                        setMembers(membersArray.filter(m => m.roomadmin_approved && m.role !== RoomRole.ROOMADMIN))
                    } else setMembers([])
                }

            }).finally(() => {
                dispatch(changeStateFetching(false))
            })
        })()
    }, [userData.id, debounceSearch]);

    const handleLeave = (newAdmin: Members) => {
        if (!userData.id) return 
        
        confirmDialog({
            header: "Xác nhận rời lớp",
            message: <p>Rời đi và chỉ định <b className="text-red">{newAdmin.user.email}</b> trở thành quản trị viên mới</p>,

            acceptLabel: "Rời lớp",
            rejectLabel: "Hủy",

            accept: async () => {
                dispatch(changeStateFetching(true))

                await ClassService.removeMember(userData.id, classData.id, newAdmin.user.id).finally(() => {
                    dispatch(changeStateFetching(false))
                })
            }
        })
    }

    return (
        <div className="fixed z-50 top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.75)] flex justify-center-safe items-center-safe animate-fade-in">
            <div className="w-[500px] h-[600px] max-h-[90vh] bg-bgLight dark:bg-bgDark flex flex-col p-6 rounded-normal shadow-2xl overflow-hidden max-sm:w-11/12 max-sm:h-[80vh]">

                <div className="flex flex-col gap-2 mb-6">
                    <h1 className="text-bigSize font-bold dark:text-white max-sm:text-mediumSize">Bàn giao quyền quản trị</h1>
                    <p className="text-smallSize text-gray">Chọn một thành viên tin cậy để tiếp quản lớp học trước khi bạn rời đi.</p>
                </div>

                <div className="relative flex items-center-safe w-full px-3 mb-6 rounded-small shadow-[0_0_10px_rgba(128,128,128,0.15)] dark:bg-black border-[0.5px] border-lightGray dark:border-darkGray">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 text-gray">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        className="h-10 w-full pl-3 text-normalSize dark:text-white outline-none bg-transparent disableState"
                        placeholder="Tìm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={isFetching}
                    />
                    {isFetching && <ScaleLoader height={10} width={4} color="#499c40" />}
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pr-1">
                    {members && members.length > 0 ? (
                        members.map((member) => {
                            const color = uniqolor(member.user.email);
                            if (member.user.id === userData.id) return null
                            return (
                                <div
                                    key={member.id}
                                    className="group flex items-center-safe justify-between p-3 rounded-normal border-[0.5px] border-lightGray dark:border-darkGray hover:border-mainColor dark:hover:border-mainColor hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex items-center-safe gap-3">
                                        <span className={`h-11 aspect-square rounded-full flex items-center-safe justify-center-safe text-normalSize font-bold shadow-sm ${color.isLight ? "text-darkGray" : "text-white"}`} style={{ backgroundColor: color.color }}>
                                            {getShortName(member.user.full_name)}
                                        </span>

                                        <div className="flex flex-col">
                                            <div className="flex items-center-safe gap-2">
                                                <p className="font-bold dark:text-white text-normalSize group-hover:text-mainColor transition-colors">{member.user.full_name}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${member.role === "roomadmin" ? "bg-orangedRGB text-oranged" :
                                                    member.role === "lecturer" ? "bg-mainColorRGB text-mainColor" :
                                                        "bg-lightGray text-gray dark:bg-darkGray dark:text-lightGray"
                                                    }`}>
                                                    {member.role === "roomadmin" ? "Quản trị viên" :
                                                        member.role === "lecturer" ? "Giảng viên" : "Sinh viên"}
                                                </span>
                                            </div>
                                            <p className="text-gray text-smallSize truncate max-w-[200px]">{member.user.email}</p>
                                        </div>
                                    </div>

                                    <button
                                        className="bg-mainColorRGB text-mainColor px-4 py-1.5 rounded-small font-bold hoverBtn text-smallSize whitespace-nowrap disableState"
                                        disabled={isFetching}
                                        onClick={() => { handleLeave(member) }}
                                    >
                                        Chuyển quyền
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center-safe justify-center py-20 opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 mb-2 dark:stroke-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <p className="italic dark:text-white">Không tìm thấy thành viên phù hợp</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center-safe gap-4 mt-6 pt-4 border-t-[0.5px] border-lightGray dark:border-darkGray">
                    <button
                        className="flex-1 hoverBtn bg-redRGB text-red py-2.5 rounded-small font-bold transition-all disableState"
                        onClick={togglePopup}
                        disabled={isFetching}
                    >
                        Hủy bỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RATransferRights;
