import React, {ReactNode} from 'react';
import {
    BaseShareSearchProps,
    CriteriaState,
    EnabledProps,
    generateShareSearchCard,
    GlobalShareSearchProps,
    ShareSearchCardText,
    wrapShareSearchCard
} from "../BaseShareSearchCard";
import {FloatRangeValue, Period, SearchShareCriterion, ShareSortField} from "../../../../generated/graphql";
import {ShareSearchContextProps} from "../ShareSearchContext";
import {CardResults} from "../utils";
import {ShareRegionsDropdown} from "../ShareRegionsDropdown";
import {marketCapCardTableHeader} from "../tables/shareTableHeaders";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface MarketCapCardProps extends BaseShareSearchProps {
    children?: ReactNode;
}

interface MarketCapCardState extends GlobalShareSearchProps {
    selectedValue: string
}

function MarketCapContentView(props: CriteriaState<MarketCapCardState>){

    return (
        <>
            <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria}/>
            <ShareSearchCardText text={"Aktien mit einer"}/>
            <FilterDropdownItem<OptionItem & {value: FloatRangeValue}>
                onSelect={(option: OptionItem & {value: FloatRangeValue}) => {
                    props.setCriteria({ ...props.state, marketCapitalization: option.value,
                        selectedValue: option.id
                    });
                }}
                options={MARKET_OPTIONS}
                activeId={props.state.selectedValue}
            />
            <ShareSearchCardText text={"Marktkapitalisierung"} isTextBold={true}/>
        </>
    )
}

const MARKET_OPTIONS: (OptionItem & { value: FloatRangeValue })[] = [
    {id: 'hohen', name: 'hohen', value: {from: 10_000_000_000}},
    {id: 'mittleren', name: 'mittleren', value: {from: 2_000_000_000, to: 10_000_000_000}},
    {id: 'niedriegen', name: 'niedriegen', value: {to: 2_000_000_000}},
];

function renderQuery(state: MarketCapCardState, metaData: ShareSearchContextProps | null): SearchShareCriterion {
    return {
        marketCapitalization: state.marketCapitalization ? state.marketCapitalization : {from: 10_000_000_000},
        period: state.period,
        ranges: state.ranges,
        regionId: state.regionId,
        trends: state.trends,
    }
}

export const MarketCapCard = wrapShareSearchCard(
    generateShareSearchCard<MarketCapCardProps & EnabledProps, MarketCapCardState>(
        MarketCapContentView
    ),
    renderQuery,
    {
        marketCapitalization: {from: MARKET_OPTIONS[0].value.from, to: MARKET_OPTIONS[0].value.to},
        regionId: null,
        ranges: [], trends: [], period: Period.Last_1Year,
        selectedValue: MARKET_OPTIONS[0].id
    },
    false,
    marketCapCardTableHeader,
    CardResults.marketCap,
    ShareSortField.MarketCapitalization,
    ["Marktkapitalisierung"]
);

export default MarketCapCard
