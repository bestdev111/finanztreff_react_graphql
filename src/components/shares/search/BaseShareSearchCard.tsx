import React, {ReactNode, useContext, useState} from "react";
import {BaseSearchCard, BaseSearchCardProps, SearchCard} from "../../common/SearchCard/BaseSearchCard";
import {
    FloatRangeValue,
    Period,
    SearchShareCriterion,
    ShareKeyFigureTrend,
    ShareRangeCriteria, ShareSortField
} from "../../../generated/graphql";
import ShareSearchResultInfo from "./ShareSearchResultInfo";
import ShareSearchContext, {ShareSearchContextProps} from "./ShareSearchContext";
import classNames from "classnames";
import {tableHeaderType} from "./tables/shareTableHeaders";

interface BaseShareSearchCard {
    criteria: SearchShareCriterion
    enabled: boolean
    children: ReactNode
    tags?: string[]
    details: ShareSearchCardDetails
    tableHeaders?: tableHeaderType[]
    cardResult?: any
    shareSort?: ShareSortField
    setTags?: (val: string) => void;
}

export interface ShareSearchCardDetails extends GlobalShareSearchProps {
}

export const BaseShareSearchCard = (props: BaseShareSearchCard) => {
    return (
        <BaseSearchCard<SearchShareCriterion, ShareSearchCardDetails>
            enabled={props.enabled} criteria={props.criteria} details={props.details}
            shareTableHeaders={props.tableHeaders}
            cardResult={props.cardResult}
            shareSort={props.shareSort}
            tags={props.tags}
            setTags={props.setTags}
            assetInfo={<div className={"bg-SHARE text-white asset-type-tag"}>AKTIEN</div>}
            infoComponent={ShareSearchResultInfo}>
            {!props.enabled &&
                <div className="coming-soon-component fund-cards">
                    <span className="text-white fs-18px coming-soon-text d-flex justify-content-center">
                        Coming soon...
                    </span>
                </div>
            }
            {props.children}
        </BaseSearchCard>
    )
}

export default BaseShareSearchCard

export interface EnabledProps {
    enabled: boolean;
}

export function generateShareSearchCard<Props extends BaseSearchCardProps & EnabledProps, State extends GlobalShareSearchProps> (view: (props: {state: State, setCriteria: (criteria: State) => void}) => JSX.Element) {
    return view;
}

export function wrapShareSearchCard<State extends GlobalShareSearchProps>(Component: ShareSearchCardBase<State>,
                                                                          render: (state: State, metaData: ShareSearchContextProps | null) => SearchShareCriterion,
                                                                          defaultValue: State,
                                                                          comingSoon: boolean, tableHeaders: tableHeaderType[], cardResult: any, shareSort: ShareSortField,
                                                                          tags: string[]): ShareSearchCard {
    const Card: ShareSearchCard = (props: BaseShareSearchProps) => {
        let defaultState = {...defaultValue, ...props.defaultSearchProps};
        const [state, setState] = useState<State & BaseShareSearchProps>({
            ...defaultState, defaultSearchProps: props.defaultSearchProps,
        } as (State & BaseShareSearchProps & {tag: string}));
        const metaDataContext = useContext(ShareSearchContext);
        const handleTag = (val: string) => {
            setState({...state, tag: val})
        }
        const setCriteria = (value: State) => {
            setState({...state, ...value});
        }
        if (props.defaultSearchProps != state.defaultSearchProps) {
            let criteria = {
                ...state,
                defaultSearchProps: props.defaultSearchProps,
                period: props.defaultSearchProps?.period,
                trends: props.defaultSearchProps?.trends,
                ranges: props.defaultSearchProps?.ranges,
                marketCapitalization: props.defaultSearchProps?.marketCapitalization,
                regionId: props.defaultSearchProps?.regionId
            }
            setCriteria(criteria);
        }
        return (
            <BaseShareSearchCard setTags={handleTag} shareSort={shareSort} cardResult={cardResult} tableHeaders={tableHeaders} criteria={render(state, metaDataContext)} enabled={!comingSoon} details={{...state}} tags={tags}>
                <Component state={state} setCriteria={setCriteria}/>
            </BaseShareSearchCard>
        )
    }
    Card.tags = tags;
    Card.assetInfo = "AKTIEN";
    Card.enabled = !comingSoon;
    return Card;
}

export interface GlobalShareSearchProps {
    regionId: number | null
    marketCapitalization: FloatRangeValue | null
    ranges: ShareRangeCriteria[],
    trends: ShareKeyFigureTrend[],
    period: Period | null
}

export interface BaseShareSearchProps extends BaseSearchCardProps {
    defaultSearchProps?: GlobalShareSearchProps
    tableHeaders: tableHeaderType[]
    setState: () => void
    cardResult: any
}

export interface CriteriaState<State extends GlobalShareSearchProps> {
    state: State;
    setCriteria: (criteria: State) => void;
}

export type ShareSearchCardBase<State extends GlobalShareSearchProps> = (props: CriteriaState<State>) => JSX.Element

export type ShareSearchCard = SearchCard<BaseShareSearchProps>;

export interface ShareSearchCardTextProps {
    text: string
    isTextBold?: boolean
}

export function ShareSearchCardText({text, isTextBold}: ShareSearchCardTextProps){
    return <span className={classNames("mr-1", isTextBold && "font-weight-bold")} style={{marginTop: "-2px"}}>{text}</span>
}
