import {RangeChartDonutPalette} from "../common/charts/RangeChartDonut/RangeChartDonut";
import {OptionItem} from "../common/SearchCard/FilterDropdownItem";
import {SearchBondCriterion} from "../../generated/graphql";
import {BondSearchContextProps} from "./BondSearchPage/BondSearchContext";
import {GlobalBondSearchProps} from "./BondSearchPage/BaseBondSearchCard";

export const BOND_INVERSE_PALETTE: RangeChartDonutPalette = {
    positive: "#FF8D38",
    negative: "gray",
    neutral: "gray",
    title: {
        positive: "black",
        neutral: "black",
        negative: "black"
    }
};

export const DEFAULT_BOND_OPTION_ID = "NULL";
export const DEFAULT_BOND_OPTION: BondTypeOption = {id: DEFAULT_BOND_OPTION_ID, name: "Alle", value: null} as BondTypeOption

export interface BondTypeOption extends OptionItem {
    value: number | null;
}

export function renderDefaultQuery({typeId: bondTypeId, regionId, issuerId, nominalCurrencyId}: GlobalBondSearchProps,
                                   metadata: BondSearchContextProps | null): SearchBondCriterion {
    const typeId = ((metadata?.bondTypes || []).find(current => current.id == bondTypeId)?.value as number | null) || null;
    return {
        typeId,
        nominalCurrencyId,
        issuerId
    }
}
