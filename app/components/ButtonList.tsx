import React from "react"

interface Props{
    children: React.ReactNode
}

const ButtonList: React.FC<Props> = ({children}) => {
    return(
        <div className="bg-[#e3e3e3] dark:bg-[#6e6e6e] p-2 flex items-center rounded-lg w-fit">
            {children}
        </div>
    )
}

export default ButtonList