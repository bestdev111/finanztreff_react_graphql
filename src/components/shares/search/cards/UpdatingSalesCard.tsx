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
    TrendType,
} from "../../../../generated/graphql";
import {ShareSearchContextProps,} from "../ShareSearchContext";
import {ShareRegionsDropdown} from "../ShareRegionsDropdown";
import {CardResults} from "../utils";
import {regionSalesPeriodTableHeader} from "../tables/shareTableHeaders";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface UpdatingSalesCardProps extends BaseShareSearchProps {
    children?: ReactNode;
}

interface UpdatingSalesCardState extends GlobalShareSearchProps {
    selectedPeriod: string
    status: string
}

function UpdatingSalesCardContentView(props: CriteriaState<UpdatingSalesCardState>) {
  return (
    <>
      <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria} />
      <ShareSearchCardText text={"Aktien mit"} />
      <FilterDropdownItem<OptionItem & { value: Trend; keyfigure: ShareSearchKeyFigure; type: TrendType}
      >
        onSelect={(option: OptionItem & { value: Trend; keyfigure: ShareSearchKeyFigure; type: TrendType; }) => {
          props.setCriteria({ ...props.state, trends: [{
              keyFigure: ShareSearchKeyFigure.SalesChangePercent, value: option.value, type: TrendType.Period
              }],
              status: option.id
          });
        }}
        options={STATUS_OPTIONS}
        activeId={props.state.status}
      />
      <ShareSearchCardText text={"Umsatz in den letzten"} />
      <FilterDropdownItem<OptionItem & { value: Period }>
        onSelect={(option: OptionItem & { value: Period }) => {
          props.setCriteria({ ...props.state, period: option.value, selectedPeriod: option.id });
        }}
        options={PERIOD_OPTIONS}
        activeId={props.state.selectedPeriod}
      />
    </>
  );
}

function renderQuery(state: UpdatingSalesCardState, metaData: ShareSearchContextProps | null): SearchShareCriterion {
  return {
    marketCapitalization: state.marketCapitalization,
    period: state.period,
    ranges: state.ranges,
    regionId: state.regionId,
    trends: state.trends.length > 0 ? state.trends : [{
        keyFigure: ShareSearchKeyFigure.SalesChangePercent, type: TrendType.Period, value: Trend.Positive
    }],
  };
}

const PERIOD_OPTIONS: (OptionItem & { value: Period })[] = [
  { id: "1", name: "12 Monaten", value: Period.Last_1Year },
  { id: "2", name: "3 Jahren", value: Period.Last_3Years },
  { id: "3", name: "5 Jahren", value: Period.Last_5Years },
  { id: "4", name: "10 Jahren", value: Period.Last_10Years },
];

const STATUS_OPTIONS: (OptionItem & { value: Trend; keyfigure: ShareSearchKeyFigure; type: TrendType; })[] = [
  {id: "steigendem", name: "steigendem", value: Trend.Positive, type: TrendType.Period, keyfigure: ShareSearchKeyFigure.SalesChangePercent,},
  {id: "fallendem", name: "fallendem", value: Trend.Negative, type: TrendType.Period, keyfigure: ShareSearchKeyFigure.SalesChangePercent,},
];

export const UpdatingSalesCard = wrapShareSearchCard(generateShareSearchCard<UpdatingSalesCardProps & EnabledProps, UpdatingSalesCardState>(UpdatingSalesCardContentView),
  renderQuery,
  {
    marketCapitalization: null,
    regionId: null,
    ranges: [],
    trends: [{keyFigure: ShareSearchKeyFigure.SalesChangePercent, type: TrendType.Period, value: Trend.Positive}],
    period: Period.Last_1Year,
      selectedPeriod: PERIOD_OPTIONS[0].id,
      status: STATUS_OPTIONS[0].id
  },
  false,
    regionSalesPeriodTableHeader,
    CardResults.updatingSales,
    ShareSortField.SalesChangePercent,
  ["Umsatz"]
);

export default UpdatingSalesCard;
