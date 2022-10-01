import {OptionItem} from "../common/SearchCard/FilterDropdownItem";
import { SearchFundCriterion } from "../../generated/graphql";
import {FundsSearchContextProps} from "./FundSearchPage/FundsSearchContext";
import {GlobalFundSearchProps} from "./FundSearchPage/BaseFundSearchCard";

export const DEFAULT_FUND_OPTION_ID = "NULL";
export const DEFAULT_FUND_OPTION: FundTypeOption = {id: DEFAULT_FUND_OPTION_ID, name: "Alle", value: null} as FundTypeOption

export interface FundTypeOption extends OptionItem {
    value: number | null;
}

export function renderDefaultQuery({topicId, typeId: fundTypeId, regionId, strategyId, currencyId}: GlobalFundSearchProps,
                                   metadata: FundsSearchContextProps | null): SearchFundCriterion {
    const typeId = ((metadata?.fundTypes || []).find(current => current.id == fundTypeId)?.value as number | null) || null;
    return {
        fundTopicId: topicId,
        fundCurrencyId: currencyId,
        fundRegionId: regionId,
        fundTypeId: typeId,
        fundStrategyId: strategyId,
    }
}

export interface FundTypeOption extends OptionItem {
    value: number | null;
}
