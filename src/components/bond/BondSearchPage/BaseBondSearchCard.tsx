import { SearchBondCriterion } from "graphql/types";
import React, {ReactNode, useContext, useState} from "react";
import { BaseSearchCard, BaseSearchCardProps, SearchCard } from "components/common/SearchCard/BaseSearchCard";
import { BondSearchResultInfo } from "./BondSearchResultInfo";
import BondSearchContext, {BondSearchContextProps} from "./BondSearchContext";
import moment from "moment";


interface BaseBondCard {
    criteria: SearchBondCriterion;
    enabled: boolean;
    children: ReactNode;
    tags?: string[];
    details: GlobalBondSearchProps | null;
}

export function BaseBondSearchCard(props: BaseBondCard) {
    return (
        <BaseSearchCard<SearchBondCriterion, GlobalBondSearchProps>
            criteria={props.criteria} enabled={props.enabled} tags={props.tags || []}
            assetInfo={<div className={"bg-BOND text-white asset-type-tag"}>ANLEIHEN</div>}
            details={props.details}
            infoComponent={BondSearchResultInfo}>
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

export function generateBondCard<Props extends BaseBondSearchProps & EnabledProps, State extends GlobalBondSearchProps> (
    view: (props: {state: State, setCriteria: (criteria: State) => void}) => JSX.Element,
) {
    return view;
}

export function wrapBondSearchCard<State extends GlobalBondSearchProps>(Component: BondSearchCardBase<State>,
                                                                        render: (state: State, metadata: BondSearchContextProps | null) => SearchBondCriterion,
                                                                        defaultValue: State,
                                                                        comingSoon: boolean,
                                                                        ...tags: string[]): BondSearchCard {
    const Card: BondSearchCard = (props: BaseBondSearchProps) => {
        let defaultState = {...defaultValue, ...props.defaultSearchProps};
        const [state, setState] = useState<State & BaseBondSearchProps>({
            ...defaultState, defaultSearchProps: props.defaultSearchProps,
        } as (State & BaseBondSearchProps));
        const metadataContext = useContext(BondSearchContext);

        const setCriteria = (value: State) => {
            setState({...state, ...value});
        }

        if (props.defaultSearchProps != state.defaultSearchProps) {
            let criteria = {
                ...state,
                nominalCurrencyId: props.defaultSearchProps?.nominalCurrencyId,
                typeId: props.defaultSearchProps?.typeId,
                issuerId: props.defaultSearchProps?.issuerId,
                regionId: props.defaultSearchProps?.regionId,
                defaultSearchProps: props.defaultSearchProps
            }
            setCriteria(criteria);
        }
        return (
            <BaseBondSearchCard details={state || null} enabled={!comingSoon} criteria={render(state, metadataContext)} tags={tags}>
                <Component state={state} setCriteria={setCriteria}/>
            </BaseBondSearchCard>
        )
    }
    Card.tags = tags;
    Card.assetInfo = "ANLEIHEN";
    Card.enabled = !comingSoon;
    return Card;
}

export interface GlobalBondSearchProps {
    // topicId: number | null;
    typeId: string | null;
    regionId: number | null;
    issuerId: number | null;
    nominalCurrencyId: number | null;

    maturityDateFrom?: moment.Moment | null;
    maturityDateTo?: moment.Moment | null;

    ismaYieldFrom?: number | null;
    ismaYieldTo?: number | null;
}

export interface BaseBondSearchProps extends BaseSearchCardProps {
    defaultSearchProps?: GlobalBondSearchProps;
}

export interface CriteriaState<State extends GlobalBondSearchProps> {
    state: State;
    setCriteria: (criteria: State) => void
}

export type BondSearchCardBase<State extends GlobalBondSearchProps> = (props: CriteriaState<State>) => JSX.Element;

export type BondSearchCard = SearchCard<BaseBondSearchProps>;
