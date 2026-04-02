import type React from "react";
import { useState } from "react";
import type { Members } from "../../services/class/class.type";
import getShortName from "../../utils/getShortName";
import uniqolor from "uniqolor";

interface RAUpdateUserForm_Interface {
    toggleForm: () => void;
    memberData: Members;
}

const RAUpdateUserForm: React.FC<RAUpdateUserForm_Interface> = ({ toggleForm, memberData }) => {
    const [formData, setFormData] = useState({
        role: memberData.role,
        can_create_forms: memberData.can_create_forms,
        can_create_notifications: memberData.can_create_notifications,
        can_create_score_forms: memberData.can_create_score_forms,
    });

    const color = uniqolor(memberData.user.email);

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
                            className="w-full border-[0.5px] border-lightGray dark:border-darkGray px-4 py-2.5 rounded-small dark:bg-black dark:text-white outline-none hover:border-mainColor transition-all cursor-pointer"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as Members["role"] })}
                        >
                            <option value="student">Sinh viên</option>
                            <option value="lecturer">Giảng viên</option>
                            <option value="roomadmin">Quản trị viên</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="text-normalSize font-bold dark:text-white">Quyền hạn</p>
                        
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center-safe justify-between p-3 rounded-small border-[0.5px] border-lightGray dark:border-darkGray hover:border-mainColor transition-all cursor-pointer group">
                                <div className="flex flex-col">
                                    <p className="font-medium dark:text-white group-hover:text-mainColor transition-colors text-smallSize">Tạo biểu mẫu</p>
                                    <p className="text-tinySize text-gray font-medium uppercase">can_create_forms</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="size-5 accent-mainColor cursor-pointer"
                                    checked={formData.can_create_forms}
                                    onChange={(e) => setFormData({ ...formData, can_create_forms: e.target.checked })}
                                />
                            </label>

                            <label className="flex items-center-safe justify-between p-3 rounded-small border-[0.5px] border-lightGray dark:border-darkGray hover:border-mainColor transition-all cursor-pointer group">
                                <div className="flex flex-col">
                                    <p className="font-medium dark:text-white group-hover:text-mainColor transition-colors text-smallSize">Tạo thông báo</p>
                                    <p className="text-tinySize text-gray font-medium uppercase">can_create_notifications</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="size-5 accent-mainColor cursor-pointer"
                                    checked={formData.can_create_notifications}
                                    onChange={(e) => setFormData({ ...formData, can_create_notifications: e.target.checked })}
                                />
                            </label>

                            <label className="flex items-center-safe justify-between p-3 rounded-small border-[0.5px] border-lightGray dark:border-darkGray hover:border-mainColor transition-all cursor-pointer group">
                                <div className="flex flex-col">
                                    <p className="font-medium dark:text-white group-hover:text-mainColor transition-colors text-smallSize">Tạo biểu mẫu điểm</p>
                                    <p className="text-tinySize text-gray font-medium uppercase">can_create_score_forms</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="size-5 accent-mainColor cursor-pointer"
                                    checked={formData.can_create_score_forms}
                                    onChange={(e) => setFormData({ ...formData, can_create_score_forms: e.target.checked })}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center-safe gap-4 mt-2">
                    <button 
                        className="flex-1 hoverBtn bg-redRGB text-red py-2.5 rounded-small font-bold transition-all"
                        onClick={toggleForm}
                    >
                        Hủy
                    </button>
                    <button 
                        className="flex-2 hoverBtn bg-mainColor text-white py-2.5 rounded-small font-bold shadow-lg shadow-mainColorRGB transition-all"
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RAUpdateUserForm;
