import React from "react"
import { useThemeContext } from "../context/toggleTheme"
import ButtonList from "./ButtonList"
import Button from "./Button"

const ToggleTheme: React.FC = () => {
    const {toggleTheme} = useThemeContext()
    return(
        <ButtonList>
            <Button title={'dark'} onClick={toggleTheme} chart={null} type={'dark'} interval={null}/>
            <Button title={'light'} onClick={toggleTheme} chart={null} type={'light'} interval={null}/>
        </ButtonList>
    )
}

export default ToggleTheme