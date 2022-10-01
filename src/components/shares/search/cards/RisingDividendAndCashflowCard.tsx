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
    ShareKeyFigureTrend,
    ShareRangeCriteria,
    ShareSearchKeyFigure,
    ShareSortField,
    Trend,
    TrendType
} from "../../../../generated/graphql";
import {ShareSearchContextProps,} from "../ShareSearchContext";
import {CardResults} from "../utils";
import {ShareRegionsDropdown} from "../ShareRegionsDropdown";
import {regionDividendCashflowTableHeader} from "../tables/shareTableHeaders";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface RisingDividendAndCashflowCardProps extends BaseShareSearchProps {
  children?: ReactNode;
}

interface RisingDividendAndCashflowCardState extends GlobalShareSearchProps {
    change: string
}

function RisingDividendAndCashflowCardContentView(props: CriteriaState<RisingDividendAndCashflowCardState>) {
  return (
    <>
      <ShareRegionsDropdown
        state={props.state}
        setCriteria={props.setCriteria}
      />
      <ShareSearchCardText text={"Unternehmen mit einer"} />
      <ShareSearchCardText text={"steigenden Dividende"} isTextBold={true} />
      <ShareSearchCardText text={" und einer"} />
      <FilterDropdownItem<OptionItem & {trends: ShareKeyFigureTrend[], ranges: ShareRangeCriteria[]}>
        onSelect={(option: OptionItem & {trends: ShareKeyFigureTrend[], ranges: ShareRangeCriteria[]}) => {
          props.setCriteria({ ...props.state, ranges: option.ranges, trends: option.trends, change: option.id });
        }}
        options={PERCENTAGE_OPTIONS}
        activeId={props.state.change}
      />
      <ShareSearchCardText text={"Cashflow Steigerung"} />
    </>
  );
}

function renderQuery(
  state: RisingDividendAndCashflowCardState,
  metaData: ShareSearchContextProps | null
): SearchShareCriterion {
  return {
    marketCapitalization: state.marketCapitalization,
    period: state.period,
    ranges: state.ranges.length > 0 ? state.ranges : [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, to: 5}],
    regionId: state.regionId,
    trends: state.trends.length > 0 ? state.trends : [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive},
        {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}],
  };
}

const PERCENTAGE_OPTIONS: (OptionItem & {trends: ShareKeyFigureTrend[], ranges: ShareRangeCriteria[]})[] = [
    {id: "l5", name: "<5%", trends: [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive},
            {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}],
        ranges: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, to: 5}]
    },
    {id: "g5", name: ">5%", trends: [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive},
            {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}],
        ranges: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, from: 5}]
    },
    {id: "10", name: ">10%", trends: [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive},
            {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}],
        ranges: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, from: 10}]
    },
    {id: "25", name: ">25%", trends: [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive},
            {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}],
        ranges: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, from: 25}]
    },
    {id: "50", name: ">50%", trends: [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive},
            {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}],
        ranges: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, from: 50}]
    },
    {id: "100", name: ">100%", trends: [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive},
            {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}],
        ranges: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, from: 100}]
    }
]

export const RisingDividendAndCashflowCard = wrapShareSearchCard(generateShareSearchCard<RisingDividendAndCashflowCardProps & EnabledProps, RisingDividendAndCashflowCardState>(RisingDividendAndCashflowCardContentView),
  renderQuery,
  {
    marketCapitalization: null,
    regionId: null,
    ranges: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, to: 5}],
    trends: [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, type: TrendType.Period, value: Trend.Positive},
        {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}
    ],
    period: Period.Last_1Year,
      change: PERCENTAGE_OPTIONS[0].id
  },
  false,
    regionDividendCashflowTableHeader,
    CardResults.risingDivAndCashflow,
    ShareSortField.CashFlowChangePercent,
  ["Dividende", "Cashflow"]
);

export default RisingDividendAndCashflowCard;
