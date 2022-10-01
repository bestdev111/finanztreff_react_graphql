import React, {ReactNode, useEffect, useState} from "react";
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
import {cashflowProfitSalesCardTableHeader} from "../tables/shareTableHeaders";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface SharesWithRisingDividendCardProps extends BaseShareSearchProps {
  children?: ReactNode;
}

interface SharesWithRisingDividendCardState extends GlobalShareSearchProps {
    change: string
    keyfigure: string
    tag: string
}

function SharesWithRisingDividendCardContentView(props: CriteriaState<SharesWithRisingDividendCardState>) {
  const [selectedKeyfigure, setSelectedKeyfigure] = useState<ShareSearchKeyFigure>(ShareSearchKeyFigure.CashFlowChangePercent);
  const [selectedRange, setSelectedRange] = useState<number>(25);

    const PERCENT_OPTIONS: (OptionItem & { from: number, keyFigure: ShareSearchKeyFigure })[] = [
        {id: "25", name: ">25%", from: 25, keyFigure: selectedKeyfigure},
        {id: "20", name: ">20%", from: 20, keyFigure: selectedKeyfigure},
        {id: "15", name: ">15%", from: 15, keyFigure: selectedKeyfigure},
        {id: "10", name: ">10%", from: 10, keyFigure: selectedKeyfigure},
        {id: "5", name: ">5%", from: 5, keyFigure: selectedKeyfigure},
    ];

    useEffect(() => {
        const { trends, tag, ranges } = props.state;
        if (props.state && props.state?.tag === "Gewinn"){
            setSelectedKeyfigure(ShareSearchKeyFigure.NetIncomeChangePercent);
            props.setCriteria({...props.state,
                trends: trends.length > 0 ? [
                        {keyFigure: ShareSearchKeyFigure.DividendChangePercent, value: Trend.Positive, type: TrendType.Period},
                        {keyFigure: ShareSearchKeyFigure.NetIncomeChangePercent, type: trends[0].type, value: trends[0].value}
                    ] :
                    [
                        {keyFigure: ShareSearchKeyFigure.DividendChangePercent, value: Trend.Positive, type: TrendType.Period},
                        {keyFigure: ShareSearchKeyFigure.NetIncomeChangePercent, type: TrendType.Period, value: Trend.Positive}
                    ],
                ranges: ranges.length > 0 ? [{keyFigure: ranges[0].keyFigure, from: selectedRange}] : [{keyFigure: ShareSearchKeyFigure.NetIncomeChangePercent, from: 25}],
                keyfigure: tag.toLowerCase()
            })
        }
        if (props.state && props.state?.tag === "Cashflow"){
            setSelectedKeyfigure(ShareSearchKeyFigure.CashFlowChangePercent);
            props.setCriteria({...props.state,
                trends: trends.length > 0 ? [
                        {keyFigure: ShareSearchKeyFigure.DividendChangePercent, value: Trend.Positive, type: TrendType.Period},
                        {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: trends[0].type, value: trends[0].value}
                    ] :
                    [
                        {keyFigure: ShareSearchKeyFigure.DividendChangePercent, value: Trend.Positive, type: TrendType.Period},
                        {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}
                    ],
                ranges: ranges.length > 0 ? [{keyFigure: ranges[0].keyFigure, from: selectedRange}] : [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, from: 25}],
                keyfigure: tag.toLowerCase()
            })
        }
        if (props.state && props.state?.tag === "Umsatz"){
            setSelectedKeyfigure(ShareSearchKeyFigure.SalesChangePercent);
            props.setCriteria({...props.state,
                trends: trends.length > 0 ? [
                        {keyFigure: ShareSearchKeyFigure.DividendChangePercent, value: Trend.Positive, type: TrendType.Period},
                        {keyFigure: ShareSearchKeyFigure.SalesChangePercent, type: trends[0].type, value: trends[0].value}
                    ] :
                    [
                        {keyFigure: ShareSearchKeyFigure.DividendChangePercent, value: Trend.Positive, type: TrendType.Period},
                        {keyFigure: ShareSearchKeyFigure.SalesChangePercent, type: TrendType.Period, value: Trend.Positive}
                    ],
                ranges: ranges.length > 0 ? [{keyFigure: ranges[0].keyFigure, from: selectedRange}] : [{keyFigure: ShareSearchKeyFigure.SalesChangePercent, from: 25}],
                keyfigure: tag.toLowerCase()
            })
        }
    }, [props.state.tag])

  return (
    <>
      <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria} />
      <ShareSearchCardText text={"Aktien mit einer"} />
      <ShareSearchCardText text={"steigenden Dividende"} isTextBold={true} />
      <ShareSearchCardText text={"und einer"} />
      <FilterDropdownItem<OptionItem & { from: number, keyFigure: ShareSearchKeyFigure }>
        onSelect={(option: OptionItem & { from: number, keyFigure: ShareSearchKeyFigure }) => {
          props.setCriteria({ ...props.state, ranges: [
                  {keyFigure: selectedKeyfigure, from: option.from}
              ],
              change: option.id
          });
          setSelectedRange(option.from);
        }}
        options={PERCENT_OPTIONS}
        activeId={props.state.change}
      />
      <FilterDropdownItem<OptionItem & {keyFigure: ShareSearchKeyFigure, value: Trend, type: TrendType}>
        onSelect={(option: OptionItem & {keyFigure: ShareSearchKeyFigure, value: Trend, type: TrendType}) => {
            setSelectedKeyfigure(option.keyFigure);
          props.setCriteria({ ...props.state, trends: [{keyFigure: ShareSearchKeyFigure.DividendChangePercent, value: Trend.Positive, type: TrendType.Period},
                  {keyFigure: option.keyFigure, value: Trend.Positive, type: TrendType.Period}],
              ranges: [{keyFigure: option.keyFigure, from: selectedRange}],
              keyfigure: option.id,
          });
          setSelectedKeyfigure(option?.keyFigure);
        }}
        options={KEYFIGURE_OPTIONS}
        activeId={props.state.keyfigure}
      />
      <ShareSearchCardText text={"Steigerung"} />
    </>
  );
}

function renderQuery(state: SharesWithRisingDividendCardState, metaData: ShareSearchContextProps | null): SearchShareCriterion {
  return {
    marketCapitalization: state.marketCapitalization,
    period: state.period,
    ranges: state.ranges.length > 0 ? state.ranges :  [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, from: 25}],
    regionId: state.regionId,
    trends: state.trends.length > 0 ? state.trends : [
        {keyFigure: ShareSearchKeyFigure.DividendChangePercent , value: Trend.Positive, type: TrendType.Period},
        {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent , value: Trend.Positive, type: TrendType.Period}
    ],
  };
}

const KEYFIGURE_OPTIONS: (OptionItem & {keyFigure: ShareSearchKeyFigure, value: Trend, type: TrendType})[] = [
    {id: 'cashflow', name: 'Cashflow', keyFigure: ShareSearchKeyFigure.CashFlowChangePercent , value: Trend.Positive, type: TrendType.Period},
    {id: 'umsatz', name: 'Umsatz', keyFigure: ShareSearchKeyFigure.SalesChangePercent , value: Trend.Positive, type: TrendType.Period},
    {id: 'gewinn', name: 'Gewinn', keyFigure: ShareSearchKeyFigure.NetIncomeChangePercent , value: Trend.Positive, type: TrendType.Period},
];

export const SharesWithRisingDividendCard = wrapShareSearchCard(generateShareSearchCard<SharesWithRisingDividendCardProps & EnabledProps, SharesWithRisingDividendCardState>(SharesWithRisingDividendCardContentView,),
    renderQuery,
  {
    marketCapitalization: null,
    regionId: null,
    ranges: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, from: 25}],
    trends: [{keyFigure: ShareSearchKeyFigure.DividendChangePercent , value: Trend.Positive, type: TrendType.Period},
        {keyFigure: ShareSearchKeyFigure.CashFlowChangePercent , value: Trend.Positive, type: TrendType.Period}
    ],
      period: Period.Last_1Year,
      change: '',
      keyfigure: KEYFIGURE_OPTIONS[0].id,
      tag: ''
  },
    false,
    cashflowProfitSalesCardTableHeader,
    CardResults.sharesRisingDividend,
    ShareSortField.CashFlowChangePercent,
    ["Cashflow", "Umsatz", "Gewinn"],
);

export default SharesWithRisingDividendCard;
