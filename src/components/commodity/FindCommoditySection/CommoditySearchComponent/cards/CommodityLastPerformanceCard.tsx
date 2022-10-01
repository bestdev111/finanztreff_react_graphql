import {ReactNode, useContext} from "react";
import {EtfKeyFigure, SearchEtfCriterion} from "graphql/types";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import {
    BaseEtfSearchProps,
    CriteriaState, EnabledProps,
    generateEtfCard,
    GlobalEtfSearchProps,
    wrapEtfSearchCard
} from "../BaseCommoditySearchCard";
import CommoditySearchContext, {CommoditySearchContextProps} from "../CommoditySearchContext";

interface EtfSmallerPerformanceCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfSmallerPerformanceCardState extends GlobalEtfSearchProps {
    value: number | undefined;
    valueId: string;
    period: EtfKeyFigure | undefined;
    periodId: string;
}

function EtfSmallerPerformanceCardContentView(props: CriteriaState<EtfSmallerPerformanceCardState>)  {
    const metadataContext = useContext(CommoditySearchContext);

    return (
        <>
            <span className="mx-1 font-weight-bold" style={{marginTop: "-2px"}}>Rohstoff-Performance der letzten</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={PERFORMANCE_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

const PERFORMANCE_OPTIONS: (OptionItem & { value: number })[] = [
    {id: "1", name: '1 Jahre', value: 1},
    {id: "3", name: '3 Jahre', value: 3},
    {id: "5", name: '5 Jahre', value: 5},
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

function renderQuery(state: EtfSmallerPerformanceCardState, metadata: CommoditySearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = null;
    //((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        keyFigures: []
    }
}

export const CommodityLastPerformanceCard = wrapEtfSearchCard(
    generateEtfCard<EtfSmallerPerformanceCardProps & EnabledProps, EtfSmallerPerformanceCardState>(
        EtfSmallerPerformanceCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        value: PERFORMANCE_OPTIONS[0].value, valueId: PERFORMANCE_OPTIONS[0].id,
        period: PERIOD_OPTIONS[0].value, periodId: PERIOD_OPTIONS[0].id,
    },
    true,
    "Performance"
);
