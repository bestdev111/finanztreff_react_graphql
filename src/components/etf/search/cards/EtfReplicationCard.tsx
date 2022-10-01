import { ReactNode, useContext } from "react";
import { SearchEtfCriterion } from "graphql/types";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import {
    BaseEtfSearchProps,
    CriteriaState, EnabledProps,
    generateEtfCard,
    GlobalEtfSearchProps,
    wrapEtfSearchCard
} from "../BaseEtfSearchCard";
import EtfSearchContext, {EtfSearchContextProps} from "../EtfSearchContext";

interface EtfReplicationCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfReplicationCardState extends GlobalEtfSearchProps {
    replicationId: number | null;
}

function EtfReplicationCardContentView(props: CriteriaState<EtfReplicationCardState>)  {
    const metadataContext = useContext(EtfSearchContext);
    const typeOptions = ((metadataContext && metadataContext.etfTypes) || []).map(current => {
        return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || ""};
    });
    const replicationOptions = ((metadataContext && metadataContext.etfReplications) || []).map(current => {
        return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || 0};
    });

    if (!props.state.replicationId) {
        props.setCriteria({...props.state, replicationId: replicationOptions[0].value});
    }

    return (
        <>
            <FilterDropdownItem<OptionItem & {value: string}>
                onSelect={(option: OptionItem & {value: string}) => {
                    props.setCriteria({ ...props.state, typeId: option.value});
                }}
                options={typeOptions}
                activeId={"" + props.state.typeId}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>ETF mit der</span>
            <span style={{marginTop: "-2px", marginRight: "2px"}}>Replikationsmethode</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={replicationOptions}
                onSelect={({value: replicationId}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, replicationId});
                }}
                activeId={"" + props.state.replicationId} />
        </>
    )
}

function renderQuery(state: EtfReplicationCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        replicationId: state.replicationId,
        keyFigures: [ ]
    }
}

export const EtfReplicationCard = wrapEtfSearchCard(
    generateEtfCard<EtfReplicationCardProps & EnabledProps, EtfReplicationCardState>(
        EtfReplicationCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null, replicationId: null},
    false,
    "Strategie"
);
