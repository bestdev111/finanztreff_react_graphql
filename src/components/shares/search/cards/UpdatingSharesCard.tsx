import React, {ReactNode, useEffect} from 'react';
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
import {ShareRegionsDropdown} from "../ShareRegionsDropdown";
import {cashflowProfitSalesCardTableHeader, tableHeaderType} from "../tables/shareTableHeaders";
import {CardResults} from "../utils";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface UpdatingSharesCardProps extends BaseShareSearchProps {
    children?: ReactNode
    tableHeaders: tableHeaderType[]
    cardResult: any
}

interface UpdatingSharesCardState extends GlobalShareSearchProps {
    status: string
    keyFigure: string
    tag: string
}

function UpdatingSharesCardContentView(props: CriteriaState<UpdatingSharesCardState>){

    useEffect(() => {
        const { trends, tag } = props.state;
        if (props.state && props.state?.tag === "Gewinn"){
            props.setCriteria({...props.state,
                trends: trends.length > 0 ? [{keyFigure: ShareSearchKeyFigure.NetIncomeChangePercent, type: trends[0].type, value: trends[0].value}] :
                    [{keyFigure: ShareSearchKeyFigure.NetIncomeChangePercent, type: TrendType.Period, value: Trend.Positive}],
                keyFigure: tag.toLowerCase()
            })
        }
        if (props.state && props.state?.tag === "Cashflow"){
            props.setCriteria({...props.state,
                trends: trends.length > 0 ? [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: trends[0].type, value: trends[0].value}] :
                    [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}],
                keyFigure: tag.toLowerCase()
            })
        }
        if (props.state && props.state?.tag === "Umsatz"){
            props.setCriteria({...props.state,
                trends: trends.length > 0 ? [{keyFigure: ShareSearchKeyFigure.SalesChangePercent, type: trends[0].type, value: trends[0].value}] :
                    [{keyFigure: ShareSearchKeyFigure.SalesChangePercent, type: TrendType.Period, value: Trend.Positive}],
                keyFigure: tag.toLowerCase()
            })
        }
    }, [props.state.tag])

    return (
        <>
            <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria}/>
            <ShareSearchCardText text={"Aktien mit"}/>
            <FilterDropdownItem<OptionItem & {value: Trend}>
                onSelect={(option: OptionItem & {value: Trend}) => {
                    if (props.state.trends.length === 0){
                        props.setCriteria({
                            ...props.state, trends: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: option.value}],
                            status: option.id
                        })
                    }
                    else {
                        props.setCriteria({
                            ...props.state, trends: [{...props.state.trends[0], value: option.value}],
                            status: option.id
                        });
                    }
                }}
                options={STATUS_OPTIONS}
                activeId={props.state.status}
            />
            <FilterDropdownItem<OptionItem & {trend: ShareSearchKeyFigure, type: TrendType, value: Trend}>
                onSelect={(option: OptionItem & {trend: ShareSearchKeyFigure, type: TrendType, value: Trend}) => {
                    props.setCriteria({ ...props.state, trends: [{
                        keyFigure: option.trend, type: option.type, value: props.state.trends[0] ? props.state.trends[0].value: Trend.Positive
                        }],
                        keyFigure: option.id
                    });
                }}
                options={KEYFIGURE_OPTIONS}
                activeId={props.state.keyFigure}
            />
        </>
    )
}

const STATUS_OPTIONS: (OptionItem & {value: Trend})[] = [
    {id: 'steigendem', name: 'steigendem', value: Trend.Positive},
    {id: 'fallendem', name: 'fallendem', value: Trend.Negative},
    {id: 'gleichbleibendem', name: 'gleichbleibendem', value: Trend.Neutral},
]

const KEYFIGURE_OPTIONS: (OptionItem & {trend: ShareSearchKeyFigure, type: TrendType, value: Trend})[] = [
    {id: 'cashflow', name: 'Cashflow', value: Trend.Positive, type: TrendType.Period, trend: ShareSearchKeyFigure.CashFlowChangePercent},
    {id: 'umsatz', name: 'Umsatz', value: Trend.Positive, type: TrendType.Period, trend: ShareSearchKeyFigure.SalesChangePercent},
    {id: 'gewinn', name: 'Gewinn', value: Trend.Positive, type: TrendType.Period, trend: ShareSearchKeyFigure.NetIncomeChangePercent},
]

function renderQuery(state: UpdatingSharesCardState, metaData: ShareSearchContextProps | null): SearchShareCriterion {
    return {
        marketCapitalization: state.marketCapitalization,
        period: state.period,
        ranges: state.ranges,
        regionId: state.regionId,
        trends: state.trends.length > 0 ? state.trends : [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}]
    }
}

export const UpdatingSharesCard = wrapShareSearchCard(
    generateShareSearchCard<UpdatingSharesCardProps & EnabledProps, UpdatingSharesCardState>(UpdatingSharesCardContentView,),
    renderQuery,
    {
        marketCapitalization: null,
        regionId: null,
        ranges: [], trends: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Period, value: Trend.Positive}],
        period: Period.Last_1Year,
        status: STATUS_OPTIONS[0].id,
        keyFigure: KEYFIGURE_OPTIONS[0].id,
        tag: ''
    },
    false,
    cashflowProfitSalesCardTableHeader,
    CardResults.updatingShares,
    ShareSortField.CashFlowChangePercent,
    ["Cashflow", "Umsatz", "Gewinn"],
);

export default UpdatingSharesCard
