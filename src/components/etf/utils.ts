import {OptionItem} from "../common/SearchCard/FilterDropdownItem";

export const DEFAULT_ETF_OPTION_ID = "NULL";
export const DEFAULT_ETF_OPTION: EtfTypeOption = {id: DEFAULT_ETF_OPTION_ID, name: "Alle", value: null} as EtfTypeOption

export interface EtfTypeOption extends OptionItem{
    value: string | null;
}

