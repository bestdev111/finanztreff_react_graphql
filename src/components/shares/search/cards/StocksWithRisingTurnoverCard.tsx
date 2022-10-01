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
import {regionProSalesTableHeader} from "../tables/shareTableHeaders";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface StocksWithRisingTurnoverCardProps extends BaseShareSearchProps {
  children?: ReactNode;
}

interface StocksWithRisingTurnoverCardState extends GlobalShareSearchProps {
    selectedPeriod: string
    change: string
}

function StocksWithRisingTurnoverCardContentView(props: CriteriaState<StocksWithRisingTurnoverCardState>) {
  return (
    <>
      <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria}/>
      <ShareSearchCardText text={"Aktien mit"} />
      <ShareSearchCardText text={" steigendem Umsatz"} isTextBold={true} />
      <ShareSearchCardText text={"pro Mitarbeiter"} />
      <FilterDropdownItem<OptionItem & {keyFigure: ShareSearchKeyFigure, from: number}>
        onSelect={(option: OptionItem & {keyFigure: ShareSearchKeyFigure, from: number}) => {
          props.setCriteria({ ...props.state, ranges: [{keyFigure: option.keyFigure, from: option.from}],
            change: option.id
          });
        }}
        options={PERCENTAGE_OPTIONS}
        activeId={props.state.change}
      />
      <ShareSearchCardText text={"in den letzten"} />
      <FilterDropdownItem<OptionItem & { value: Period }>
        onSelect={(option: OptionItem & { value: Period }) => {
          props.setCriteria({ ...props.state, period: option.value, selectedPeriod: option.id });
        }}
        activeId={props.state.selectedPeriod}
        options={PERIOD_OPTIONS}
      />
    </>
  );
}

function renderQuery(
    state: StocksWithRisingTurnoverCardState,
    metaData: ShareSearchContextProps | null
): SearchShareCriterion {
    return {
        marketCapitalization: state.marketCapitalization,
        period: state.period,
        ranges: state.ranges.length > 0 ? state.ranges : [{keyFigure: ShareSearchKeyFigure.SalesPerEmployeeChangePercent, from: 25}],
        regionId: state.regionId,
        trends: state.trends.length > 0 ? state.trends : [{keyFigure: ShareSearchKeyFigure.SalesPerEmployeeChangePercent, type: TrendType.Period, value: Trend.Positive}],
    };
}

const PERCENTAGE_OPTIONS: (OptionItem & {keyFigure: ShareSearchKeyFigure, from: number})[] = [
    {id: "25", name: ">25%", keyFigure: ShareSearchKeyFigure.SalesPerEmployeeChangePercent, from: 25},
    {id: "20", name: ">20%", keyFigure: ShareSearchKeyFigure.SalesPerEmployeeChangePercent, from: 20},
    {id: "15", name: ">15%", keyFigure: ShareSearchKeyFigure.SalesPerEmployeeChangePercent, from: 15},
    {id: "10", name: ">10%", keyFigure: ShareSearchKeyFigure.SalesPerEmployeeChangePercent, from: 10},
    {id: "5", name: ">5%", keyFigure: ShareSearchKeyFigure.SalesPerEmployeeChangePercent, from: 5},
];
const PERIOD_OPTIONS: (OptionItem & { value: Period })[] = [
    { id: "1", name: "12 Monaten", value: Period.Last_1Year },
    { id: "2", name: "3 Jahren", value: Period.Last_3Years },
    { id: "3", name: "5 Jahren", value: Period.Last_5Years },
    { id: "4", name: "10 Jahren", value: Period.Last_10Years },
];


export const StocksWithRisingTurnoverCard = wrapShareSearchCard(
  generateShareSearchCard<
    StocksWithRisingTurnoverCardProps & EnabledProps,
    StocksWithRisingTurnoverCardState
  >(StocksWithRisingTurnoverCardContentView),
  renderQuery,
  {
    marketCapitalization: null,
    regionId: null,
    ranges: [],
    trends: [],
    period: Period.Last_1Year,
      change: PERCENTAGE_OPTIONS[0].id,
      selectedPeriod: PERIOD_OPTIONS[0].id
  },
  false,
    regionProSalesTableHeader,
    CardResults.stocksTurnover,
    ShareSortField.SalesPerEmployeeChangePercent,
  ["Umsatz"]
);

export default StocksWithRisingTurnoverCard;
