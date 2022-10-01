import React, {ReactNode, useContext} from "react";
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
import ShareSearchContext, {ShareSearchContextProps,} from "../ShareSearchContext";
import {ShareRegionsDropdown} from "../ShareRegionsDropdown";
import {CardResults} from "../utils";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import {regionPayoutTableHeader} from "../tables/shareTableHeaders";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface DividendPayoutRatioCardProps extends BaseShareSearchProps {
    children?: ReactNode;
}

interface DividendPayoutRatioCardState extends GlobalShareSearchProps {
    payout: string
    dividend: string
}

function DividendPayoutRatioCardContentView(props: CriteriaState<DividendPayoutRatioCardState>) {
    const metaDataContext = useContext(ShareSearchContext);

    function updateDropdown(setCriteria: any, state: DividendPayoutRatioCardState, option: OptionItem & {keyFigure: ShareSearchKeyFigure, from?: number, to?: number}){
        let current = renderQuery(state, metaDataContext);
        setCriteria({
          ...props.state, ranges: [{keyFigure: ShareSearchKeyFigure.DividendPayoutRatio, from: option?.from, to: option?.to}, current.ranges[1]],
            payout: option.id
        })
    }

    function updateYieldDropdown(setCriteria: any, state: DividendPayoutRatioCardState, option: OptionItem & {keyFigure: ShareSearchKeyFigure, from: number | null}){
        let current = renderQuery(state, metaDataContext);
        setCriteria({
            ...props.state, ranges: [current.ranges[0], {keyFigure: ShareSearchKeyFigure.DividendYield, from: option?.from}],
            dividend: option.id
        })
    }

    return (
        <>
            <ShareRegionsDropdown state={props.state} setCriteria={props.setCriteria} />
            <ShareSearchCardText text={"Aktien mit einer Ausschüttungsquote"}/>
            <FilterDropdownItem<OptionItem & {keyFigure: ShareSearchKeyFigure, from?: number, to?: number}>
                onSelect={(option: OptionItem & {keyFigure: ShareSearchKeyFigure, from?: number, to?: number}) => {
                    updateDropdown(props.setCriteria, props.state, option)}
                }
                options={PAYOUT_PERCENT_OPTIONS}
                activeId={props.state.payout}
            />
            <ShareSearchCardText text={"und einer Divendenrente von"}/>
            <FilterDropdownItem<OptionItem & {keyFigure: ShareSearchKeyFigure, from: number | null}>
                onSelect={(option: OptionItem & {keyFigure: ShareSearchKeyFigure, from: number | null}) => {
                    updateYieldDropdown(props.setCriteria, props.state, option)
                    trigInfonline(guessInfonlineSection(), "search_result_Drop_Down")}
                }
                options={DIVIDEND_PERCENT_OPTIONS}
                activeId={props.state.dividend}
            />
        </>
    );
}

function renderQuery(state: DividendPayoutRatioCardState, metaData: ShareSearchContextProps | null): SearchShareCriterion {
    return {
        marketCapitalization: state.marketCapitalization,
        period: state.period,
        ranges: state.ranges.length > 0 ? state.ranges : [
            {keyFigure: ShareSearchKeyFigure.DividendPayoutRatio, to: 50},
            {keyFigure: ShareSearchKeyFigure.DividendYield, from: 4}
        ],
        regionId: state.regionId,
        trends: state.trends,
    };
}

const PAYOUT_PERCENT_OPTIONS: (OptionItem & {keyFigure: ShareSearchKeyFigure, from?: number, to?: number})[] = [
    {id: 'f100', name: '>100%', keyFigure: ShareSearchKeyFigure.DividendPayoutRatio, from: 100},
    {id: 't100', name: '<100%', keyFigure: ShareSearchKeyFigure.DividendPayoutRatio, to: 100},
    {id: '75', name: '<75%', keyFigure: ShareSearchKeyFigure.DividendPayoutRatio, to: 75},
    {id: '50', name: '<50%', keyFigure: ShareSearchKeyFigure.DividendPayoutRatio, to: 50},
    {id: '25', name: '<25%', keyFigure: ShareSearchKeyFigure.DividendPayoutRatio, to: 25},
];

const DIVIDEND_PERCENT_OPTIONS: (OptionItem & {keyFigure: ShareSearchKeyFigure, from: number | null})[] = [
    {id: '10', name: '>10%', keyFigure: ShareSearchKeyFigure.DividendYield, from: 10},
    {id: '8', name: '>8%', keyFigure: ShareSearchKeyFigure.DividendYield, from: 8},
    {id: '6', name: '>6%', keyFigure: ShareSearchKeyFigure.DividendYield, from: 6},
    {id: '4', name: '>4%', keyFigure: ShareSearchKeyFigure.DividendYield, from: 4},
    {id: '2', name: '>2%', keyFigure: ShareSearchKeyFigure.DividendYield, from: 2},
    {id: 'egal', name: 'egal', keyFigure: ShareSearchKeyFigure.DividendYield, from: null},
];

export const DividendPayoutRatioCard = wrapShareSearchCard(generateShareSearchCard<DividendPayoutRatioCardProps & EnabledProps, DividendPayoutRatioCardState>(DividendPayoutRatioCardContentView),
    renderQuery,
    {
        marketCapitalization: null,
        regionId: null,
        ranges: [{keyFigure: ShareSearchKeyFigure.DividendPayoutRatio, to: 50},
            {keyFigure: ShareSearchKeyFigure.DividendYield, from: 4}],
        trends: [],
        period: Period.Last_1Year,
        dividend: DIVIDEND_PERCENT_OPTIONS[3].id,
        payout: PAYOUT_PERCENT_OPTIONS[3].id
    },
    false,
    regionPayoutTableHeader,
    CardResults.dividendPayoutRatio,
    ShareSortField.DividendPayoutRatio,
    ["Dividende"]
);

export default DividendPayoutRatioCard;
