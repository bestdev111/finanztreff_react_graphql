import {ReactNode} from "react";
import { SearchEtfCriterion} from "graphql/types";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import {
    BaseEtfSearchProps,
    CriteriaState, EnabledProps,
    generateEtfCard,
    GlobalEtfSearchProps,
    wrapEtfSearchCard
} from "../BaseEtfSearchCard";

interface EtfQuantoCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfQuantoCardState extends GlobalEtfSearchProps {
    value: boolean;
    valueId: string;
    mode: "1" | "2";
}

function EtfQuantoCardContentView(props: CriteriaState<EtfQuantoCardState>)  {
    // const metadataContext = useContext(EtfSearchContext);
    // const typeOptions = ((metadataContext && metadataContext.etfTypes) || []).map(current => {
    //     return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || ""};
    // });

    return (
        <>
            {/*<FilterDropdownItem<OptionItem & {value: string}>*/}
            {/*    onSelect={(option: OptionItem & {value: string}) => {*/}
            {/*        props.setCriteria({ ...props.state, typeId: option.value});*/}
            {/*    }}*/}
            {/*    options={typeOptions}*/}
            {/*    activeId={"" + props.state.typeId}*/}
            {/*/>*/}
            <span style={{marginTop: "-2px"}} className="mx-1">Alle ETF mit </span>
            <FilterDropdownItem<OptionItem & {value: boolean}>
                options={MODE_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: boolean}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} 
            />
            <span style={{marginTop: "-2px", marginRight: "2px"}}>Fremdwährungsrisiko</span>
            {/* <FilterDropdownItem<OptionItem & {value: boolean}>
                options={DISTRIBUTION_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: boolean}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} /> */}
        </>
    )
}

// const DISTRIBUTION_OPTIONS: (OptionItem & {value: boolean})[] = [
//     {id: "1", name: 'Ja', value: true},
//     {id: "2", name: 'Nein', value: false},
// ];

const MODE_OPTIONS: (OptionItem & {value: boolean})[] = [
    { id: "1", name: 'einem', value: true },
    { id: "2", name: 'keinem', value: false }
];

function renderQuery(state: EtfQuantoCardState): SearchEtfCriterion {
    return {
        // assetTypeGroup: state.typeId,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        quanto: state.value,
        keyFigures: [ ]
    }
}

export const EtfQuantoCard = wrapEtfSearchCard(
    generateEtfCard<EtfQuantoCardProps & EnabledProps, EtfQuantoCardState>(
        EtfQuantoCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        mode: '2',
        value: MODE_OPTIONS[1].value, valueId: MODE_OPTIONS[1].id},
    false,
    "Risiko"
);

