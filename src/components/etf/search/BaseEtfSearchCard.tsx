import {SearchEtfCriterion} from "graphql/types";
import React, {ReactNode, useContext, useState} from "react";
import { BaseSearchCard, BaseSearchCardProps, SearchCard } from "components/common/SearchCard/BaseSearchCard";
import {EtfSearchResultInfo} from "./EtfSearchResultInfo";
import EtfSearchContext, {EtfSearchContextProps} from "./EtfSearchContext";

interface BaseFundCard {
    criteria: SearchEtfCriterion;
    enabled: boolean;
    children: ReactNode;
    tags?: string[]
    details: EtfCardDetails;
}

export interface EtfCardDetails extends GlobalEtfSearchProps{
    distributing?: boolean | null;
    issuerId?: number | null;
    replicationId?: number | null;
}

export function BaseEtfSearchCard(props: BaseFundCard) {
    return (
        <BaseSearchCard<SearchEtfCriterion, EtfCardDetails>
            criteria={props.criteria} enabled={props.enabled} tags={props.tags || []}
            assetInfo={<div className={"bg-ETF text-white asset-type-tag"}>ETF</div>}
            details={props.details}
            infoComponent={EtfSearchResultInfo}>
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

export function generateEtfCard<Props extends BaseSearchCardProps & EnabledProps, State extends GlobalEtfSearchProps> (
    view: (props: {state: State, setCriteria: (criteria: State) => void}) => JSX.Element,
) {
    return view;
}

export function wrapEtfSearchCard<State extends GlobalEtfSearchProps>(Component: EtfSearchCardBase<State>,
                                                                      render: (state: State, metadata: EtfSearchContextProps | null) => SearchEtfCriterion,
                                                                      defaultValue: State,
                                                                      comingSoon: boolean,
                                                                      ...tags: string[]): EtfSearchCard {
    const Card: EtfSearchCard = (props: BaseEtfSearchProps) => {
        let defaultState = {...defaultValue, ...props.defaultSearchProps};
        const [state, setState] = useState<State & BaseEtfSearchProps>({
            ...defaultState, defaultSearchProps: props.defaultSearchProps,
        } as (State & BaseEtfSearchProps));
        const metadataContext = useContext(EtfSearchContext);

        const setCriteria = (value: State) => {
            setState({...state, ...value});
        }
        if (props.defaultSearchProps != state.defaultSearchProps) {
            let criteria = {
                ...state,
                typeId: props.defaultSearchProps?.typeId,
                regionId: props.defaultSearchProps?.regionId,
                strategyId: props.defaultSearchProps?.strategyId,
                sectorId: props.defaultSearchProps?.sectorId,
                defaultSearchProps: props.defaultSearchProps
            }
            setCriteria(criteria);
        }
        return (
            <BaseEtfSearchCard enabled={!comingSoon} criteria={render(state, metadataContext)} tags={tags} details={{...state}}>
                <Component state={state} setCriteria={setCriteria}/>
            </BaseEtfSearchCard>
        )
    }
    Card.tags = tags;
    Card.assetInfo = "ETF";
    Card.enabled = !comingSoon;
    return Card;
}

export interface GlobalEtfSearchProps {
    typeId: string | null;
    regionId: number | null;
    strategyId: number | null;
    sectorId: number | null;
}

export interface BaseEtfSearchProps extends BaseSearchCardProps {
    defaultSearchProps?: GlobalEtfSearchProps;
}

export interface CriteriaState<State extends GlobalEtfSearchProps> {
    state: State;
    setCriteria: (criteria: State) => void
}

export type EtfSearchCardBase<State extends GlobalEtfSearchProps> = (props: CriteriaState<State>) => JSX.Element;

export type EtfSearchCard = SearchCard<BaseEtfSearchProps>;
