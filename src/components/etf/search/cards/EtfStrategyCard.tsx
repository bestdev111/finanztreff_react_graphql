import {ReactNode, useContext} from "react";
import {SearchEtfCriterion} from "graphql/types";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import {
    BaseEtfSearchProps,
    CriteriaState, EnabledProps,
    generateEtfCard,
    GlobalEtfSearchProps,
    wrapEtfSearchCard
} from "../BaseEtfSearchCard";
import EtfSearchContext, {EtfSearchContextProps} from "../EtfSearchContext";

interface EtfStrategyCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfStrategyCardState extends GlobalEtfSearchProps {
}

function EtfStrategyCardContentView(props: CriteriaState<EtfStrategyCardState>)  {
    const metadataContext = useContext(EtfSearchContext);
    const typeOptions = ((metadataContext && metadataContext.etfTypes) || []).map(current => {
        return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || ""};
    });

    const strategyOptions = ((metadataContext && metadataContext.etfStrategies) || []).map(current => {
        return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || 0};
    });

    if (!props.state.strategyId) {
        props.setCriteria({...props.state, strategyId: strategyOptions[1].value})
    }

    return (
        <>
            <FilterDropdownItem<OptionItem & {value: string}>
                onSelect={(option: OptionItem & {value: string}) => {
                    props.setCriteria({ ...props.state, typeId: option.value});
                }}
                options={typeOptions}
                style={{}}
                activeId={"" + props.state.typeId}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>ETF mit einer</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={strategyOptions}
                onSelect={({value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, strategyId: value});
                }}
                style={{overflowY: 'scroll', height: '500px', marginBottom: '4px'}}
                activeId={"" + props.state.strategyId} />
        </>
    )
}

function renderQuery(state: EtfStrategyCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        keyFigures: [ ]
    }
}

export const EtfStrategyCard = wrapEtfSearchCard(
    generateEtfCard<EtfStrategyCardProps & EnabledProps, EtfStrategyCardState>(
        EtfStrategyCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null},
    false,
    "Strategie"
);
