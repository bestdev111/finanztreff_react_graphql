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

interface EtfMarketPositionCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfMarketPositionCardState extends GlobalEtfSearchProps {
    value: number;
    valueId: string;
}

function EtfMarketPositionCardContentView(props: CriteriaState<EtfMarketPositionCardState>)  {
    const metadataContext = useContext(EtfSearchContext);
    const typeOptions = ((metadataContext && metadataContext.etfTypes) || []).map(current => {
        return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || ""};
    });
    const positionOptions = ((metadataContext && metadataContext.etfPositions) || []).map(current => {
        return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || 0};
    });

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
            <span style={{marginTop: "-2px", marginRight: "2px"}}>Strategie</span>
            <FilterDropdownItem<OptionItem& {value: number}>
                options={positionOptions}
                onSelect={({id: valueId, value}: OptionItem& {value: number}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

function renderQuery(state: EtfMarketPositionCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        positionId: state.value,
        keyFigures: [ ]
    }
}

export const EtfMarketPositionCard = wrapEtfSearchCard(
    generateEtfCard<EtfMarketPositionCardProps & EnabledProps, EtfMarketPositionCardState>(
        EtfMarketPositionCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        value: 1, valueId: "1"},
    false,
    "Strategie"
);
