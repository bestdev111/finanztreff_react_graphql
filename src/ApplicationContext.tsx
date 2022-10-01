import {createContext, Dispatch} from "react";

export type ApplicationContextProps = {
    pushActive: boolean,
    setPushActive: Dispatch<React.SetStateAction<boolean>>
}

const ApplicationContextContext = createContext<ApplicationContextProps | null>(null)
export {ApplicationContextContext}
