"use client"

import { getCookie, setCookie } from "cookies-next"
import React, { createContext, useContext, useEffect, useState } from "react"

interface ThemeType{
    theme: string | undefined,
    toggleTheme: () => void
}

interface Props{
    children: React.ReactNode
}

const dfTheme: ThemeType = {theme: 'light', toggleTheme: () => []}
const ToggleThemeContext = createContext<ThemeType>(dfTheme)

const ToggleThemeProvider = ({children}: Props) => {
    const [theme, setTheme] = useState<string>()

    useEffect(() => {
        const cookieTheme = getCookie("theme");
        if (cookieTheme && typeof cookieTheme === "string") {
            setTheme(cookieTheme);
        } else {
            setTheme("light")
        }
    }, [])

    useEffect(() => {
        if(theme === 'dark'){
            document.documentElement.classList.add("dark")
        }else{
            document.documentElement.classList.remove("dark")
        }
        
        setCookie('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return(
        <ToggleThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ToggleThemeContext.Provider>
    )
}

const useThemeContext = () => {
    const context = useContext(ToggleThemeContext)
    return context
}

export {ToggleThemeContext, ToggleThemeProvider, useThemeContext}