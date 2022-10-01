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

interface EtfGreaterPerformanceCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfGreaterPerformanceCardState extends GlobalEtfSearchProps {
    value: number | undefined;
    valueId: string;
    period: EtfKeyFigure | undefined;
    periodId: string;
}

function EtfGreaterPerformanceCardContentView(props: CriteriaState<EtfGreaterPerformanceCardState>)  {
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
            <span className="mx-1" style={{marginTop: "-2px"}}>ETF mit einer</span>
            <span style={{marginTop: "-2px"}}>Performance größer als</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={PERFORMANCE_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />

            <span className="mx-1" style={{marginTop: "-2px"}}>in den letzten</span>
            <FilterDropdownItem<OptionItem & {value: EtfKeyFigure}>
                options={PERIOD_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: EtfKeyFigure}) => {
                    props.setCriteria({ ...props.state, period: value, periodId: valueId});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

const PERFORMANCE_OPTIONS: (OptionItem & { value: number })[] = [
    {id: "0", name: '100%', value: 100},
    {id: "1", name: '75%', value: 75},
    {id: "2", name: '50%', value: 50},
    {id: "3", name: '25%', value: 25},
    {id: "4", name: '10%', value: 10},
    {id: "5", name: '5%', value: 5},
];

const PERIOD_OPTIONS: (OptionItem & { value: EtfKeyFigure })[] = [
    // {id: "0", name: '24 Stunden', value: 1},
    {id: "1", name: '30 Tagen/1 Monat', value: EtfKeyFigure.PerformanceMonth_1},
    // {id: "2", name: '3 Monaten', value: 3},
    {id: "3", name: '6 Monaten', value: EtfKeyFigure.PerformanceMonth_6},
    {id: "4", name: '12 Monaten', value: EtfKeyFigure.PerformanceYear_1},
    {id: "5", name: '3 Jahren', value: EtfKeyFigure.PerformanceYear_3},
    {id: "5", name: '5 Jahren', value: EtfKeyFigure.PerformanceYear_5},
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

export const EtfGreaterPerformanceCard = wrapEtfSearchCard(
    generateEtfCard<EtfGreaterPerformanceCardProps & EnabledProps, EtfGreaterPerformanceCardState>(
        EtfGreaterPerformanceCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        value: PERFORMANCE_OPTIONS[0].value, valueId: PERFORMANCE_OPTIONS[0].id,
        period: PERIOD_OPTIONS[0].value, periodId: PERIOD_OPTIONS[0].id,
    },
    true,
    "Performance"
);
