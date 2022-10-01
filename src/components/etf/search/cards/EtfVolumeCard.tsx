import {ReactNode, useContext} from "react";
import {EtfKeyFigure, SearchEtfCriterion} from "graphql/types";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import {
    BaseEtfSearchProps,
    CriteriaState, EnabledProps,
    generateEtfCard,
    GlobalEtfSearchProps,
    wrapEtfSearchCard
} from "../BaseEtfSearchCard";
import EtfSearchContext, {EtfSearchContextProps} from "../EtfSearchContext";
import { EtfTypeOption} from "../../utils";

interface EtfVolumeCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfVolumeCardState extends GlobalEtfSearchProps {
    mode: "greater" | "less",
    value: number;
    valueId: string;
}

function EtfVolumeCardContentView(props: CriteriaState<EtfVolumeCardState>)  {
    const metadataContext = useContext(EtfSearchContext);
    const typeOptions: EtfTypeOption[] = [
        ...((metadataContext && metadataContext.etfTypes) || []).map(current => {
                return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || null} as EtfTypeOption;
        })
    ];

    return (
        <>
            <FilterDropdownItem<EtfTypeOption>
                onSelect={(option: EtfTypeOption) => {
                    props.setCriteria({ ...props.state, typeId: option.value});
                }}
                options={typeOptions}
                activeId={"" + props.state.typeId || typeOptions[0].id}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>ETF mit einem</span>
            <span style={{marginTop: "-2px", marginRight: "2px"}}>Fondsvolumen</span>
            <FilterDropdownItem<OptionItem>
                options={MODE_OPTIONS}
                onSelect={({id: valueId}: OptionItem) => {
                    props.setCriteria({ ...props.state, mode: valueId == "greater" ? "greater" : "less"});
                }}
                activeId={props.state.mode} />
            <FilterDropdownItem<OptionItem & {value: number}>
                options={VOLUME_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />

        </>
    )
}

const VOLUME_OPTIONS: (OptionItem & {value: number})[] = [
    {id: "5", name: '5 Mio', value: 5_000_00},
    {id: "10", name: '10 Mio', value: 10_000_00},
    {id: "25", name: '25 Mio', value: 25_000_00},
    {id: "50", name: '50 Mio', value: 50_000_00},
    {id: "100", name: '100 Mio', value: 100_000_00},
    {id: "250", name: '250 Mio', value: 250_000_00},
    {id: "500", name: '500 Mio', value: 500_000_00},
    {id: "1000", name: '1000 Mio', value: 1000_000_00},
    {id: "2500", name: '2500 Mio', value: 2500_000_00},
    {id: "5000", name: '5000 Mio',value: 5000_000_00}
];

const MODE_OPTIONS: OptionItem[] = [
    { id: "greater", name: 'größer als' },
    { id: "less", name: 'kleiner als' }
];

function renderQuery(state: EtfVolumeCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        keyFigures: [
            {keyFigure: EtfKeyFigure.Volume,
                from: (state.mode == "greater" ? state.value : undefined),
                to: (state.mode == "less" ? state.value : undefined)
            }
        ]
    }
}

export const EtfVolumeCard = wrapEtfSearchCard(
    generateEtfCard<EtfVolumeCardProps & EnabledProps, EtfVolumeCardState>(
        EtfVolumeCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        mode: MODE_OPTIONS[0].id == "greater" ? "greater" : "less", value: VOLUME_OPTIONS[7].value, valueId: VOLUME_OPTIONS[7].id},
    false,
    "Strategie"
);
