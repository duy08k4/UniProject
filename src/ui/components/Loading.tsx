import React from "react";
import { ScaleLoader } from "react-spinners";

const Loading: React.FC = () => {
    return (
        <div className="h-full w-full flex justify-center-safe items-center-safe">
            <span className="flex flex-col items-center-safe gap-2.5">
                <ScaleLoader height={15} width={4} color="#499C40" />
                <h1 className="text-mainColor text-mediumSize">Đợi một lát nhé, dữ liệu đang được tải xuống...</h1>
            </span>
        </div>
    )
}

export default Loading