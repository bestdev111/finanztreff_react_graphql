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

interface EtfVolumeDecreaseCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfVolumeDecreaseCardState extends GlobalEtfSearchProps {
    value: number;
    valueId: string;
}

function EtfVolumeDecreaseCardContentView(props: CriteriaState<EtfVolumeDecreaseCardState>)  {
    const metadataContext = useContext(EtfSearchContext);
    const typeOptions = ((metadataContext && metadataContext.etfTypes) || []).map(current => {
        return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || ""};
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
            <span className="mx-1" style={{marginTop: "-2px"}}>ETF mit einem</span>
            <span className="mx-1" style={{marginTop: "-2px"}}>fallenden Fondsvolumen innerhalb</span>
            <FilterDropdownItem<OptionItem& {value: number}>
                options={PERIOD_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem& {value: number}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

const PERIOD_OPTIONS: (OptionItem & { value: number })[] = [
    {id: "1", name: '1 Monat', value: 1},
    {id: "2", name: '3 Monaten', value: 3},
    {id: "3", name: '6 Monaten', value: 6}
];

function renderQuery(state: EtfVolumeDecreaseCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
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

export const EtfVolumeDecreaseCard = wrapEtfSearchCard(
    generateEtfCard<EtfVolumeDecreaseCardProps & EnabledProps, EtfVolumeDecreaseCardState>(
        EtfVolumeDecreaseCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        value: 1, valueId: "1"},
    true,
    "Strategie"
);
