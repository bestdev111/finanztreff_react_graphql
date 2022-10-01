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

interface EtfGreaterPerformanceCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfGreaterPerformanceCardState extends GlobalEtfSearchProps {
    keyFigure: number | undefined;
    keyFigureId: string;
    value: number | undefined;
    valueId: string;
}

function EtfSmallerKeyfigureDistanceCardContentView(props: CriteriaState<EtfGreaterPerformanceCardState>)  {
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
            <span className="mx-1" style={{marginTop: "-2px"}}>Abstand zum </span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={KEY_FIGURE_OPTIONS}
                onSelect={({id: keyFigureId, value: keyFigure}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, keyFigureId, keyFigure});
                }}
                activeId={props.state.keyFigureId} />

            <span className="mx-1" style={{marginTop: "-2px"}}>kleiner als</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={KEY_FIGURE_VALUE_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, value, valueId});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

const KEY_FIGURE_OPTIONS: (OptionItem & { value: number })[] = [
    {id: "0", name: 'Allzeithoch', value: 100},
    {id: "1", name: 'Allzeittief', value: 75},
    {id: "2", name: '52 Wochen Hoch', value: 50},
    {id: "3", name: '52 Wochen Tief', value: 25},
];

const KEY_FIGURE_VALUE_OPTIONS: (OptionItem & { value: number })[] = [
    {id: "0", name: '100%', value: 100},
    {id: "1", name: '75%', value: 75},
    {id: "2", name: '50%', value: 50},
    {id: "3", name: '25%', value: 25},
    {id: "4", name: '10%', value: 10},
    {id: "5", name: '5%', value: 5},
];

function renderQuery(state: EtfGreaterPerformanceCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        keyFigures: []
    }
}

export const EtfSmallerKeyfigureDistanceCard = wrapEtfSearchCard(
    generateEtfCard<EtfGreaterPerformanceCardProps & EnabledProps, EtfGreaterPerformanceCardState>(
        EtfSmallerKeyfigureDistanceCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        keyFigure: KEY_FIGURE_OPTIONS[0].value, keyFigureId: KEY_FIGURE_OPTIONS[0].id,
        value: KEY_FIGURE_VALUE_OPTIONS[0].value, valueId: KEY_FIGURE_VALUE_OPTIONS[0].id,
    },
    true,
    "Performance"
);
