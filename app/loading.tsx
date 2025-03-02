import React from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

const Loading: React.FC = () => {
    return(
        <div className="w-full h-full flex items-center justify-center absolute bg-[#13131336] z-10">
            <AiOutlineLoading3Quarters className="animate-spin w-20 h-20 fixed top-[50%] left-[50%] z-11" fill="blue"/>
        </div>
    )
}

export default Loading