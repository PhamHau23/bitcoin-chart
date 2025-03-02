"use client"

import React from "react"
import { useThemeContext } from "../context/toggleTheme"

interface Props{
    title: React.ReactElement | string,
    onClick: () => void,
    chart: string | null,
    type: string | null,
    interval: string | null
}

const Button: React.FC<Props> = ({title, onClick, chart, type, interval}) => {
    const {theme} = useThemeContext()
    return(
        <button 
        className={`text-[#67748B] px-2 py-1 rounded-lg font-[550] svgStyle dark:text-cyan-50
            ${chart && chart === type ? 'bg-white dark:bg-[#979797]' : ''}
            ${interval && interval === type ? 'bg-white dark:bg-[#979797]' : ''}
            ${type && type === theme ? 'bg-white dark:bg-[#979797]' : ''}
        `} 
        onClick={onClick}>
            {title}
        </button>
    )
}

export default Button