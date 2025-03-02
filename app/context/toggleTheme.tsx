"use client"

import { CookieValueTypes, getCookie, setCookie } from "cookies-next"
import React, { createContext, useContext, useEffect, useState } from "react"

interface ThemeType{
    theme: string,
    toggleTheme: () => void
}

interface Props{
    children: React.ReactNode
}

const ToggleThemeContext = createContext<any | ThemeType>(null)

const ToggleThemeProvider = ({children}: Props) => {
    const [theme, setTheme] = useState<string | null>(null)

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