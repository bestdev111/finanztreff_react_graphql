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

interface PerformanceWithANewYearCardProps extends BaseShareSearchProps {
    children?: ReactNode
}

interface PerformanceWithANewYearCardState extends GlobalShareSearchProps {
    selectedStatus: string
    selectedPeriod: string
}

function PerformanceWithANewYearCardContentView(props: CriteriaState<PerformanceWithANewYearCardState>) {
    return (
        <>
            <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria}/>
            <ShareSearchCardText text={"Aktien"}/>
            <ShareSearchCardText text={"mit einem neuen Jahres"}/>
            <FilterDropdownItem<OptionItem & { value: number }>
                onSelect={(option: OptionItem & { value: number }) => {
                    props.setCriteria({
                        ...props.state, ranges: [],
                        selectedStatus: option.id
                    });
                }}
                options={STATUS_OPTIONS}
                activeId={props.state.selectedStatus}
            />
            <ShareSearchCardText text={"in den letzten"}/>
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

const STATUS_OPTIONS: (OptionItem & { value: number })[] = [
    {id: 'Hoch', name: 'Hoch', value: 0},
    {id: 'Tief', name: 'Tief', value: 0},
]

const PERIOD_OPTIONS: (OptionItem & { value: Period })[] = [
    {id: "1", name: "5 Tage", value: Period.Last_1Year},
    {id: "2", name: "10 Tage", value: Period.Last_1Year},
    {id: "3", name: "15 Tage", value: Period.Last_1Year},
    {id: "4", name: "30 Tage", value: Period.Last_1Year},
];

function renderQuery(state: PerformanceWithANewYearCardState): SearchShareCriterion {
    return {
        marketCapitalization: state.marketCapitalization,
        period: state.period,
        ranges: state.ranges,
        regionId: state.regionId,
        trends: state.trends,
    }
}

export const PerformanceWithANewYearCard = wrapShareSearchCard(
    generateShareSearchCard<PerformanceWithANewYearCardProps & EnabledProps, PerformanceWithANewYearCardState>(
        PerformanceWithANewYearCardContentView
    ),
    renderQuery,
    {
        marketCapitalization: {from: STATUS_OPTIONS[0].value},
        regionId: null,
        ranges: [], trends: [], period: Period.Last_1Year,
        selectedStatus: STATUS_OPTIONS[0].id,
        selectedPeriod: PERIOD_OPTIONS[0].id
    },
    false,
    marketCapCardTableHeader,
    CardResults.marketCap,
    ShareSortField.MarketCapitalization,
    ["Performance"]
);

export default PerformanceWithANewYearCard;

