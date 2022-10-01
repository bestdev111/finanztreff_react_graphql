// PerformanceWithNewYearAndMarketCapCard

import React, {ReactNode} from "react";
import {
    BaseShareSearchProps,
    CriteriaState, EnabledProps, generateShareSearchCard,
    GlobalShareSearchProps,
    ShareSearchCardText, wrapShareSearchCard
} from "../../BaseShareSearchCard";
import {ShareRegionsDropdown} from "../../ShareRegionsDropdown";
import {FilterDropdownItem, OptionItem} from "../../../../common/SearchCard/FilterDropdownItem";
import {FloatRangeValue, Period, SearchShareCriterion, ShareSortField} from "../../../../../generated/graphql";
import {CardResults} from "../../utils";
import {marketCapCardTableHeader} from "../../tables/shareTableHeaders";

interface PerformanceWithNewYearAndMarketCapCardProps extends BaseShareSearchProps {
    children?: ReactNode
}

interface PerformanceWithNewYearAndMarketCapCardState extends GlobalShareSearchProps {
    selectedStatus: string
    selectedPeriod: string
    selectedMarketCap: string
}

function PerformanceWithNewYearAndMarketCapCardContentView(props: CriteriaState<PerformanceWithNewYearAndMarketCapCardState>) {
    return (
        <>
            <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria}/>
            <ShareSearchCardText text={"Aktien mit einem neuen"}/>
            <ShareSearchCardText text={" Jahres"}/>
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
            <ShareSearchCardText text={"und einer"}/>
            <ShareSearchCardText text={"Marktkapitalisierung von"}/>
            <FilterDropdownItem<OptionItem & {value: FloatRangeValue}>
                onSelect={(option: OptionItem & {value: FloatRangeValue}) => {
                    props.setCriteria({ ...props.state, marketCapitalization: option.value,
                        selectedMarketCap: option.id
                    });
                }}
                options={MARKET_OPTIONS}
                activeId={props.state.selectedMarketCap}
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

const MARKET_OPTIONS: (OptionItem & { value: FloatRangeValue })[] = [
    {id: '500g', name: '> 500 Mrd.', value: {from: 500_000_000_000}},
    {id: '500l', name: '< 500 Mrd.', value: {to: 500_000_000_000}},
    {id: '100', name: '< 100 Mrd.', value: {to: 100_000_000_000}},
    {id: '50', name: '< 50 Mrd.', value: {to: 50_000_000_000}},
    {id: '25', name: '< 25 Mrd.', value: {to: 25_000_000_000}},
    {id: '10', name: '< 10 Mrd.', value: {to: 10_000_000_000}},
    {id: '5', name: '< 5 Mrd.', value: {to: 5_000_000_000}},
    {id: '1', name: '< 1 Mrd.', value: {to: 1_000_000_000}},
    {id: '500mi', name: '< 500 Mio.', value: {to: 500_000_000}},
]

function renderQuery(state: PerformanceWithNewYearAndMarketCapCardState): SearchShareCriterion {
    return {
        marketCapitalization: state.marketCapitalization ? state.marketCapitalization : {from: 500_000_000_000},
        period: state.period,
        ranges: state.ranges,
        regionId: state.regionId,
        trends: state.trends,
    }
}

export const PerformanceWithNewYearAndMarketCapCard = wrapShareSearchCard(
    generateShareSearchCard<PerformanceWithNewYearAndMarketCapCardProps & EnabledProps, PerformanceWithNewYearAndMarketCapCardState>(
        PerformanceWithNewYearAndMarketCapCardContentView
    ),
    renderQuery,
    {
        marketCapitalization: {from: STATUS_OPTIONS[0].value},
        regionId: null,
        ranges: [], trends: [], period: Period.Last_1Year,
        selectedStatus: STATUS_OPTIONS[0].id,
        selectedPeriod: PERIOD_OPTIONS[0].id,
        selectedMarketCap: MARKET_OPTIONS[0].id
    },
    false,
    marketCapCardTableHeader,
    CardResults.marketCap,
    ShareSortField.MarketCapitalization,
    ["Performance"]
);

export default PerformanceWithNewYearAndMarketCapCard;

