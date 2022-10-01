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
import {Period, SearchShareCriterion, ShareSearchKeyFigure, ShareSortField} from "../../../../generated/graphql";
import {ShareSearchContextProps,} from "../ShareSearchContext";
import {ShareRegionsDropdown} from "../ShareRegionsDropdown";
import {CardResults} from "../utils";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import {regionYieldPeriodTableHeader} from "../tables/shareTableHeaders";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface CompaniesRisingDividendCardProps extends BaseShareSearchProps {
  children?: ReactNode;
}

interface CompaniesRisingDividendCardState extends GlobalShareSearchProps {
    change: string
    selectedPeriod: string
}

function CompaniesRisingDividendCardContentView(props: CriteriaState<CompaniesRisingDividendCardState>) {
  return (
    <>
      <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria}/>
      <ShareSearchCardText text={"Firmen mit einer"} />
      <ShareSearchCardText text={"Div. Rend."} isTextBold={true} />
      <ShareSearchCardText text={"von"} />
      <FilterDropdownItem<OptionItem & {keyfigure: ShareSearchKeyFigure, from: number}>
        onSelect={(option: OptionItem & {keyfigure: ShareSearchKeyFigure, from: number}) => {
          props.setCriteria({ ...props.state, ranges: [{
              keyFigure: ShareSearchKeyFigure.DividendYield, from: option.from
              }], change: option.id
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
        options={PERIOD_OPTIONS}
        activeId={props.state.selectedPeriod}
      />
    </>
  );
}

function renderQuery(
  state: CompaniesRisingDividendCardState,
  metaData: ShareSearchContextProps | null
): SearchShareCriterion {
  return {
    marketCapitalization: state.marketCapitalization,
    period: state.period,
    ranges: state.ranges.length > 0 ? state.ranges : [{keyFigure: ShareSearchKeyFigure.DividendYield, from: 10}],
    regionId: state.regionId,
    trends: state.trends,
  };
}

const PERCENTAGE_OPTIONS: (OptionItem & { keyfigure: ShareSearchKeyFigure, from: number })[] = [
    {id: "1", name: '>10%', keyfigure: ShareSearchKeyFigure.DividendYield, from: 10},
    {id: "2", name: '>8%', keyfigure: ShareSearchKeyFigure.DividendYield, from: 8},
    {id: "3", name: '>6%', keyfigure: ShareSearchKeyFigure.DividendYield, from: 6},
    {id: "4", name: '>4%', keyfigure: ShareSearchKeyFigure.DividendYield, from: 4},
    {id: "5", name: '>2%', keyfigure: ShareSearchKeyFigure.DividendYield, from: 2},
    {id: "5", name: '>0%', keyfigure: ShareSearchKeyFigure.DividendYield, from: 0},
];

const PERIOD_OPTIONS: (OptionItem & { value: Period })[] = [
    { id: "1", name: "12 Monaten", value: Period.Last_1Year },
    { id: "2", name: "3 Jahren", value: Period.Last_3Years },
    { id: "3", name: "5 Jahren", value: Period.Last_5Years },
    { id: "4", name: "10 Jahren", value: Period.Last_10Years },
];


export const CompaniesRisingDividendCard = wrapShareSearchCard(
  generateShareSearchCard<
    CompaniesRisingDividendCardProps & EnabledProps,
    CompaniesRisingDividendCardState
  >(CompaniesRisingDividendCardContentView),
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
    regionYieldPeriodTableHeader,
    CardResults.compRisingDividend,
    ShareSortField.DividendYield,
  ["Dividende"]
);

export default CompaniesRisingDividendCard;
