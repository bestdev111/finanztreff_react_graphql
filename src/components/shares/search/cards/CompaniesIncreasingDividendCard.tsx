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
import {
    Period,
    SearchShareCriterion,
    ShareSearchKeyFigure,
    ShareSortField,
    Trend,
    TrendType
} from "../../../../generated/graphql";
import {ShareSearchContextProps} from "../ShareSearchContext";
import {CardResults} from "../utils";
import {ShareRegionsDropdown} from "../ShareRegionsDropdown";
import {regionDividendPeriodTableHeader} from "../tables/shareTableHeaders";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface CompaniesIncreasingDividendCardProps extends BaseShareSearchProps {
    children?: ReactNode
}

interface CompaniesIncreasingDividendCardState extends GlobalShareSearchProps {
    selectedPeriod: string
}

function CompaniesIncreasingDividendCardContentView(props: CriteriaState<CompaniesIncreasingDividendCardState>){
    return (
        <>
            <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria}/>
            <ShareSearchCardText text={"Firmen mit einer"}/>
            <ShareSearchCardText text={"steigenden"} isTextBold={true}/>
            <ShareSearchCardText text={" Dividende"} isTextBold={true}/>
            <ShareSearchCardText text={"in den letzten"}/>
            <FilterDropdownItem<OptionItem & { value: Period }>
                onSelect={(option: OptionItem & { value: Period }) => {
                    props.setCriteria({ ...props.state, trends: [{
                            keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive
                        }], period: option.value, selectedPeriod: option.id
                    });
                }}
                options={PERIOD_OPTIONS}
                activeId={props.state.selectedPeriod}
            />
        </>
    )
}

function renderQuery(state: CompaniesIncreasingDividendCardState, metaData: ShareSearchContextProps | null): SearchShareCriterion {
    return {
        marketCapitalization: state.marketCapitalization,
        period: state.period,
        ranges: state.ranges,
        regionId: state.regionId,
        trends: state.trends.length > 0 ? state.trends : [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive}],
    }
}

const PERIOD_OPTIONS: (OptionItem & { value: Period })[] = [
    { id: "1", name: "12 Monaten", value: Period.Last_1Year },
    { id: "2", name: "3 Jahren", value: Period.Last_3Years },
    { id: "3", name: "5 Jahren", value: Period.Last_5Years },
    { id: "4", name: "10 Jahren", value: Period.Last_10Years },
];

export const CompaniesIncreasingDividendCard = wrapShareSearchCard(
    generateShareSearchCard<CompaniesIncreasingDividendCardProps & EnabledProps, CompaniesIncreasingDividendCardState>(
        CompaniesIncreasingDividendCardContentView
    ),
    renderQuery,
    {
        marketCapitalization: null,
        regionId: null,
        selectedPeriod: PERIOD_OPTIONS[0].id,
        ranges: [], trends: [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive}], period: Period.Last_1Year
    },
    false,
    regionDividendPeriodTableHeader,
    CardResults.compIncrDividend,
    ShareSortField.DividendChangePercent,
    ["Dividende"]
);

export default CompaniesIncreasingDividendCard
