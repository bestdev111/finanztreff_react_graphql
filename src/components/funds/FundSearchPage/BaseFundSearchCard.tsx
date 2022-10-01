import { SearchFundCriterion } from "graphql/types";
import React, {ReactNode, useContext, useState} from "react";
import {FundSearchResultInfo} from "./FundSeachResultInfo";
import {BaseSearchCard, BaseSearchCardProps, SearchCard} from "../../common/SearchCard/BaseSearchCard";
import BondSearchContext, {BondSearchContextProps} from "../../bond/BondSearchPage/BondSearchContext";
import FundsSearchContext, {FundsSearchContextProps} from "./FundsSearchContext";


interface BaseFundCard {
    criteria: SearchFundCriterion;
    enabled: boolean;
    children: ReactNode;
    tags?: string[]
}

export function BaseFundSearchCard(props: BaseFundCard) {
    return (
        <BaseSearchCard<SearchFundCriterion>
            criteria={props.criteria} enabled={props.enabled} tags={props.tags || []}
            assetInfo={<div className={"text-white asset-type-tag bg-grass-green"}>FONDS</div>}
            infoComponent={FundSearchResultInfo}>
            {!props.enabled &&
                <div className="coming-soon-component fund-cards">
                        <span className="text-white fs-18px coming-soon-text d-flex justify-content-center">
                            Coming soon...
                        </span>
                </div>
            }
            {props.children}
        </BaseSearchCard>
    );
}

export interface EnabledProps {
    enabled: boolean;
}

export function generateFundCard<Props extends BaseFundSearchProps & EnabledProps, State extends GlobalFundSearchProps> (
    view: (props: {state: State, setCriteria: (criteria: State) => void}) => JSX.Element,
) {
    return view;
}

export function wrapFundSearchCard<State extends GlobalFundSearchProps>(Component: FundSearchCardBase<State>,
                                                                        render: (state: State, metadata: FundsSearchContextProps | null) => SearchFundCriterion,
                                                                        defaultValue: State,
                                                                        comingSoon: boolean,
                                                                        ...tags: string[]): FundSearchCard {
    const Card: FundSearchCard = (props: BaseFundSearchProps) => {
        let defaultState = {...defaultValue, ...props.defaultSearchProps};
        const [state, setState] = useState<State & BaseFundSearchProps>({
            ...defaultState, defaultSearchProps: props.defaultSearchProps,
        } as (State & BaseFundSearchProps));
        const metadataContext = useContext(FundsSearchContext);

        const setCriteria = (value: State) => {
            setState({...state, ...value});
        }

        if (props.defaultSearchProps != state.defaultSearchProps) {
            let criteria = {
                ...state,
                typeId: props.defaultSearchProps?.typeId,
                topicId: props.defaultSearchProps?.topicId,
                regionId: props.defaultSearchProps?.regionId,
                strategyId: props.defaultSearchProps?.strategyId,
                currencyId: props.defaultSearchProps?.currencyId,
                defaultSearchProps: props.defaultSearchProps
            }
            setCriteria(criteria);
        }
        return (
            <BaseFundSearchCard enabled={!comingSoon} criteria={render(state, metadataContext)} tags={tags}>
                <Component state={state} setCriteria={setCriteria}/>
            </BaseFundSearchCard>
        )
    }
    Card.tags = tags;
    Card.assetInfo = "FONDS";
    Card.enabled = !comingSoon;
    return Card;
}

export interface GlobalFundSearchProps {
    topicId: number | null;
    typeId: string | null;
    regionId: number | null;
    strategyId: number | null;
    currencyId: number | null;
}

export interface BaseFundSearchProps extends BaseSearchCardProps {
    defaultSearchProps?: GlobalFundSearchProps;
}

export interface CriteriaState<State extends GlobalFundSearchProps> {
    state: State;
    setCriteria: (criteria: State) => void
}

export type FundSearchCardBase<State extends GlobalFundSearchProps> = (props: CriteriaState<State>) => JSX.Element;

export type FundSearchCard = SearchCard<BaseFundSearchProps>;
