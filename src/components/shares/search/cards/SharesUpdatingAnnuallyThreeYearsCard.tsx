import React, {ReactNode, useEffect} from "react";
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

interface SharesUpdatingAnnuallyThreeYearsCardProps
  extends BaseShareSearchProps {
  children?: ReactNode;
}

interface SharesUpdatingAnnuallyThreeYearsCardState extends GlobalShareSearchProps {
    status: string
    keyfigure: string
    tag: string
}

function SharesUpdatingAnnuallyThreeYearsCardContentView(props: CriteriaState<SharesUpdatingAnnuallyThreeYearsCardState>) {
    useEffect(() => {
        const { trends, tag } = props.state;
        if (props.state && props.state?.tag === "Gewinn"){
            props.setCriteria({...props.state,
                trends: trends.length > 0 ? [{keyFigure: ShareSearchKeyFigure.NetIncomeChangePercent, type: trends[0].type, value: trends[0].value}] :
                    [{keyFigure: ShareSearchKeyFigure.NetIncomeChangePercent, type: TrendType.Annual, value: Trend.Positive}],
                keyfigure: tag.toLowerCase()
            })
        }
        if (props.state && props.state?.tag === "Cashflow"){
            props.setCriteria({...props.state,
                trends: trends.length > 0 ? [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: trends[0].type, value: trends[0].value}] :
                    [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Annual, value: Trend.Positive}],
                keyfigure: tag.toLowerCase()
            })
        }
        if (props.state && props.state?.tag === "Umsatz"){
            props.setCriteria({...props.state,
                trends: trends.length > 0 ? [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: trends[0].type, value: trends[0].value}] :
                    [{keyFigure: ShareSearchKeyFigure.SalesChangePercent, type: TrendType.Annual, value: Trend.Positive}],
                keyfigure: tag.toLowerCase()
            })
        }
    }, [props.state.tag])
    return (
        <>
            <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria} />
            <ShareSearchCardText text={"Aktien mit jährlich"}/>
            <FilterDropdownItem<OptionItem & {value: Trend}>
                onSelect={(option: OptionItem & {value: Trend}) => {
                    props.setCriteria({...props.state,
                        trends: props.state.trends.length === 0 ? [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Annual, value: option.value}] :
                            [{keyFigure: props.state.trends[0]?.keyFigure, type: props.state.trends[0]?.type, value: option.value}],
                        status: option.id
                    });
                }}
                options={STATUS_OPTIONS}
                activeId={props.state.status}
            />
            <FilterDropdownItem<OptionItem & {keyFigure: ShareSearchKeyFigure, type: TrendType}>
                onSelect={(option: OptionItem & {keyFigure: ShareSearchKeyFigure, type: TrendType}) => {
                    props.setCriteria({...props.state,
                        trends: props.state.trends.length === 0 ? [{keyFigure: option.keyFigure, type: TrendType.Annual, value: Trend.Positive}] :
                            [{keyFigure: option.keyFigure, type: TrendType.Annual, value: props.state.trends[0].value}],
                    keyfigure: option.id
                    });
                }}
                options={KEYFIGURE_OPTIONS}
                activeId={props.state.keyfigure}
            />
            <ShareSearchCardText text={"letzte 3 Jahre"}/>
        </>
    );
}

function renderQuery(state: SharesUpdatingAnnuallyThreeYearsCardState, metaData: ShareSearchContextProps | null): SearchShareCriterion {
    return {
        marketCapitalization: state.marketCapitalization,
        period: Period.Last_3Years,
        ranges: state.ranges,
        regionId: state.regionId,
        trends: state.trends.length > 0 ? state.trends : [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Annual, value: Trend.Positive}],
    };
}

const STATUS_OPTIONS: (OptionItem & {value: Trend})[] = [
    {id: "steigendem", name: "steigendem", value: Trend.Positive},
    {id: "fallendem", name: "fallendem", value: Trend.Negative},
    {id: "gleichbleibendem", name: "gleichbleibendem", value: Trend.Neutral},
];
const KEYFIGURE_OPTIONS: (OptionItem & {keyFigure: ShareSearchKeyFigure, type: TrendType})[] = [
    {id: "cashflow", name: 'Cashflow',  keyFigure: ShareSearchKeyFigure.CashFlowChangePercent , type: TrendType.Annual},
    {id: "umsatz", name: 'Umsatz',  keyFigure: ShareSearchKeyFigure.SalesChangePercent , type: TrendType.Annual},
    {id: "gewinn", name: 'Gewinn',  keyFigure: ShareSearchKeyFigure.NetIncomeChangePercent , type: TrendType.Annual},
];

export const SharesUpdatingAnnuallyThreeYearsCard = wrapShareSearchCard(generateShareSearchCard<SharesUpdatingAnnuallyThreeYearsCardProps & EnabledProps, SharesUpdatingAnnuallyThreeYearsCardState>(SharesUpdatingAnnuallyThreeYearsCardContentView),
    renderQuery,
    {
        marketCapitalization: null,
        regionId: null,
        ranges: [],
        trends: [{keyFigure: ShareSearchKeyFigure.CashFlowChangePercent, type: TrendType.Annual, value: Trend.Positive}],
        period: Period.Last_3Years,
        status: STATUS_OPTIONS[0].id,
        keyfigure: KEYFIGURE_OPTIONS[0].id,
        tag: ''
    },
    false,
    cashflowProfitSalesCardTableHeader,
    CardResults.sharesUpdatingAnnually3Years,
    ShareSortField.CashFlowChangePercent,
    ["Cashflow", "Umsatz", "Gewinn"]
);

export default SharesUpdatingAnnuallyThreeYearsCard;
