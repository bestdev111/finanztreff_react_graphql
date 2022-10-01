import React, {ReactNode} from "react";
import {
    BaseShareSearchProps,
    CriteriaState, EnabledProps, generateShareSearchCard,
    GlobalShareSearchProps,
    ShareSearchCardText, wrapShareSearchCard
} from "../../BaseShareSearchCard";
import {ShareRegionsDropdown} from "../../ShareRegionsDropdown";
import {FilterDropdownItem, OptionItem} from "../../../../common/SearchCard/FilterDropdownItem";
import {Period, SearchShareCriterion, ShareSortField} from "../../../../../generated/graphql";
import {CardResults} from "../../utils";
import {marketCapCardTableHeader} from "../../tables/shareTableHeaders";

interface NewAllTimeHighPerformanceCardProps extends BaseShareSearchProps {
    children?: ReactNode
}

interface NewAllTimeHighPerformanceCardState extends GlobalShareSearchProps {
    selectedPeriod: string
}

function NewAllTimeHighPerformanceCardContentView(props: CriteriaState<NewAllTimeHighPerformanceCardState>) {
    return (
        <>
            <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria}/>
            <ShareSearchCardText text={"mit einem neuen Allzeit Hoch"}/>
            <ShareSearchCardText text={"Performance in den letzten"}/>
            <FilterDropdownItem<OptionItem & { value: Period }>
                onSelect={(option: OptionItem & { value: Period }) => {
                    props.setCriteria({...props.state, period: option.value, selectedPeriod: option.id});
                }}
                options={PERIOD_OPTIONS}
                activeId={props.state.selectedPeriod}
            />

        </>
    )
}

const PERIOD_OPTIONS: (OptionItem & { value: Period })[] = [
    {id: "1", name: "30 Tage", value: Period.Last_1Year},
    {id: "2", name: "3 Monaten", value: Period.Last_1Year},
    {id: "3", name: "6 Monaten", value: Period.Last_1Year},
    {id: "4", name: "12 Monaten", value: Period.Last_1Year},
    {id: "5", name: "3 Jahren", value: Period.Last_3Years},
    {id: "6", name: "5 Jahren", value: Period.Last_5Years},
    {id: "7", name: "10 Jahren", value: Period.Last_10Years},
];

function renderQuery(state: NewAllTimeHighPerformanceCardState): SearchShareCriterion {
    return {
        marketCapitalization: state.marketCapitalization,
        period: state.period,
        ranges: state.ranges,
        regionId: state.regionId,
        trends: state.trends,
    }
}

export const NewAllTimeHighPerformanceCard = wrapShareSearchCard(
    generateShareSearchCard<NewAllTimeHighPerformanceCardProps & EnabledProps, NewAllTimeHighPerformanceCardState>(
        NewAllTimeHighPerformanceCardContentView
    ),
    renderQuery,
    {
        marketCapitalization: null,
        regionId: null,
        ranges: [], trends: [], period: Period.Last_1Year,
        selectedPeriod: PERIOD_OPTIONS[0].id
    },
    false,
    marketCapCardTableHeader,
    CardResults.marketCap,
    ShareSortField.MarketCapitalization,
    ["Performance"]
);

export default NewAllTimeHighPerformanceCard;
