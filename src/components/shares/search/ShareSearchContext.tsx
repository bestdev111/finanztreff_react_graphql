import {createContext} from "react";
import {Region} from "../../../generated/graphql";

export type ShareSearchContextProps = {
    shareRegions: Region[];
}

const ShareSearchContext = createContext<ShareSearchContextProps | null>(null);

export default ShareSearchContext;
