import React, {ReactNode} from "react";
import {
    BaseShareSearchProps,
    CriteriaState,
    EnabledProps,
    generateShareSearchCard,
    GlobalShareSearchProps,
    ShareSearchCardText,
    wrapShareSearchCard,
} from "../BaseShareSearchCard";
import {
    Period,
    SearchShareCriterion,
    ShareSearchKeyFigure,
    ShareSortField,
    Trend,
    TrendType
} from "../../../../generated/graphql";
import {ShareSearchContextProps,} from "../ShareSearchContext";
import {ShareRegionsDropdown} from "../ShareRegionsDropdown";
import {CardResults} from "../utils";
import {regionShortenedDividendPeriod} from "../tables/shareTableHeaders";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface CompaniesWithChangingDividendCardProps extends BaseShareSearchProps {
    children?: ReactNode;
}

interface CompaniesWithChangingDividendCardState extends GlobalShareSearchProps {
    selectedPeriod: string
    status: string
}

function CompaniesWithChangingDividendCardContentView(props: CriteriaState<CompaniesWithChangingDividendCardState>) {
    return (
        <>
          <ShareRegionsDropdown
            state={props.state}
            setCriteria={props.setCriteria}
          />
          <ShareSearchCardText text={"Unternehmen welche die"} />
            <ShareSearchCardText text={" Dividende"} />
          <FilterDropdownItem<OptionItem & { value: Trend; keyfigure: ShareSearchKeyFigure; type: TrendType; }>
            onSelect={(option: OptionItem & { value: Trend; keyfigure: ShareSearchKeyFigure; type: TrendType; }) => {
              props.setCriteria({ ...props.state, trends: [{
                      keyFigure: ShareSearchKeyFigure.DividendChangePercent, value: option.value, type: TrendType.Period
                  }],
                  status: option.id
              });
            }}
            options={STATUS_OPTIONS}
            activeId={props.state.status}
          />
          <ShareSearchCardText text={"haben in den letzten"} />
            <FilterDropdownItem<OptionItem & { value: Period }>
                onSelect={(option: OptionItem & { value: Period }) => {
                    props.setCriteria({ ...props.state, period: option.value, ranges: [], selectedPeriod: option.id });
                }}
                options={PERIOD_OPTIONS}
                activeId={props.state.selectedPeriod}
            />
        </>
      );
    }

function renderQuery(state: CompaniesWithChangingDividendCardState, metaData: ShareSearchContextProps | null): SearchShareCriterion {
    return {
        marketCapitalization: state.marketCapitalization,
        period: state.period,
        ranges: state.ranges,
        regionId: state.regionId,
        trends: state.trends.length > 0 ? state.trends : [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, value: Trend.Negative, type: TrendType.Period}],
    };
}

const STATUS_OPTIONS: (OptionItem & { value: Trend; keyfigure: ShareSearchKeyFigure; type: TrendType; })[] = [
    {id: "gekürzt", name: "gekürzt", value: Trend.Negative, type: TrendType.Period, keyfigure: ShareSearchKeyFigure.DividendChangePercent,},
    {id: "nicht gekürzt", name: "nicht gekürzt", value: Trend.Positive, type: TrendType.Period, keyfigure: ShareSearchKeyFigure.DividendChangePercent,},
];


const PERIOD_OPTIONS: (OptionItem & { value: Period })[] = [
    { id: "1", name: "12 Monaten", value: Period.Last_1Year },
    { id: "2", name: "3 Jahren", value: Period.Last_3Years },
    { id: "3", name: "5 Jahren", value: Period.Last_5Years },
    { id: "4", name: "10 Jahren", value: Period.Last_10Years },
];

export const CompaniesWithChangingDividendCard = wrapShareSearchCard(
    generateShareSearchCard<CompaniesWithChangingDividendCardProps & EnabledProps,
        CompaniesWithChangingDividendCardState>(CompaniesWithChangingDividendCardContentView),
    renderQuery,
    {
        marketCapitalization: null,
        regionId: null,
        ranges: [],
        trends: [],
        period: Period.Last_1Year,
        selectedPeriod: PERIOD_OPTIONS[0].id,
        status: STATUS_OPTIONS[0].id
    },
    false,
    regionShortenedDividendPeriod,
    CardResults.compChangingDividend,
    ShareSortField.DividendChangePercent,
    ["Dividende"]
);

export default CompaniesWithChangingDividendCard;
