import React from "react";
import { BounceLoader } from "react-spinners";

const Loading: React.FC = () => {
    return (
        <div className="h-full w-full flex justify-center-safe items-center-safe">
            <span className="flex items-center-safe gap-2.5">
                <BounceLoader color="#499C40" size={50} />
                <h1 className="text-mainColor text-mediumSize">Vui lòng chờ trong giây lát ...</h1>
            </span>
        </div>
    )
}

export default Loading