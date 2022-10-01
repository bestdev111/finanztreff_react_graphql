import {createContext, Dispatch} from "react";

export type HeaderContextContentProps = {
    expanded: boolean,
    setExpanded: Dispatch<React.SetStateAction<boolean>>,
    activeId: number,
    setActiveId: Dispatch<React.SetStateAction<number>>,
    keycloakInitialized: boolean,
    keycloak: Keycloak.KeycloakInstance
}

const HeaderContextContent = createContext<HeaderContextContentProps | null>(null)
export {HeaderContextContent}
