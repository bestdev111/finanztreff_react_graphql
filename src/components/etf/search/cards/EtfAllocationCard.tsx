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
import EtfSearchContext from "../EtfSearchContext";

interface EtfAllocationCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfAllocationCardState extends GlobalEtfSearchProps {
    value: number | null;
    quantoId: string;
    quanto: boolean
}

function EtfAllocationCardContentView(props: CriteriaState<EtfAllocationCardState>)  {
    const metadataContext = useContext(EtfSearchContext);
    const allocationTypes = ((metadataContext && metadataContext.etfAllocations) || []).map(current => {
        return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || 0};
    });

    if (!props.state.value) {
        props.setCriteria({...props.state,
            value: (allocationTypes.find(current => /Global/.test(current.name)) || allocationTypes[0]).value})
    }

    return (
        <>
            <span style={{marginTop: "-2px"}} className="mx-1">Alle ETF mit</span>
            <FilterDropdownItem<OptionItem & {quanto: boolean}>
                options={MODE_OPTIONS}
                onSelect={({id: quantoId, quanto}: OptionItem & {quanto: boolean}) => {
                    props.setCriteria({ ...props.state, quanto, quantoId});
                }}
                activeId={props.state.quantoId}
                style={{}}
            />
            <span style={{marginTop: "-2px", marginRight: "2px"}}>Fremdwährungsrisiko</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={allocationTypes}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, value});
                }}
                style={{overflowY: 'scroll', height: '500px', marginBottom: '4px'}}
                activeId={"" + props.state.value} />
        </>
    )
}

function renderQuery(state: EtfAllocationCardState): SearchEtfCriterion {
    return {
        // assetTypeGroup: state.typeId,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        allocationId: state.value,
        quanto: state.quanto,
        keyFigures: [ ]
    }
}

const MODE_OPTIONS: (OptionItem & {quanto: boolean})[] = [
    { id: "1", name: 'einem', quanto: true },
    { id: "2", name: 'keinem', quanto: false }
];

export const EtfAllocationCard = wrapEtfSearchCard(
    generateEtfCard<EtfAllocationCardProps & EnabledProps, EtfAllocationCardState>(
        EtfAllocationCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null, value: null, quantoId: MODE_OPTIONS[1].id, quanto: MODE_OPTIONS[1].quanto },
    false,
    "Risiko"
);
