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
import moment from "moment";

interface EtfAgeCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfAgeCardState extends GlobalEtfSearchProps {
    mode: "greater" | "less",
    value: number;
    valueId: string;
}

function EtfAgeCardContentView(props: CriteriaState<EtfAgeCardState>)  {
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
            <span className="mx-1" style={{marginTop: "-2px"}}>ETF</span>
            <FilterDropdownItem<OptionItem>
                options={MODE_OPTIONS}
                onSelect={({id: valueId}: OptionItem) => {
                    props.setCriteria({ ...props.state, mode: valueId == "greater" ? "greater" : "less"});
                }}
                activeId={props.state.mode} />
            <FilterDropdownItem<OptionItem & {value: number}>
                options={PERIOD_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />

        </>
    )
}

const MODE_OPTIONS: OptionItem[] = [
    { id: "greater", name: 'älter als' },
    { id: "less", name: 'jünger als' }
];

const PERIOD_OPTIONS: (OptionItem & { value: number })[] = [
    {id: "1", name: '1 Jahr', value: 1},
    {id: "2", name: '3 Jahre', value: 2},
    {id: "5", name: '5 Jahre', value: 5},
    {id: "10", name: '10 Jahre', value: 10},
    {id: "20", name: '20 Jahre', value: 20}
];

function renderQuery(state: EtfAgeCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        foundationDateFrom: (state.mode == "greater" ? moment().subtract(state.value, 'y').format("YYYY-MM-DD") : null),
        foundationDateTo: (state.mode == "less" ? moment().subtract(state.value, 'y').format("YYYY-MM-DD") : null),
        // keyFigures: [ ]
    };
}

export const EtfAgeCard = wrapEtfSearchCard(
    generateEtfCard<EtfAgeCardProps & EnabledProps, EtfAgeCardState>(
        EtfAgeCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        mode: MODE_OPTIONS[0].id == "greater" ? "greater" : "less",
        value: PERIOD_OPTIONS[0].value, valueId: PERIOD_OPTIONS[0].id},
    false,
    "Strategie"
);
