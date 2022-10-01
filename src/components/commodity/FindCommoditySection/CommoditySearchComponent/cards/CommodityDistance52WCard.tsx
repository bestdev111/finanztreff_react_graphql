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
// import EtfSearchContext, {EtfSearchContextProps} from "../EtfSearchContext";
import CommoditySearchContext, {CommoditySearchContextProps} from "../CommoditySearchContext";

interface EtfGreaterPerformanceCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfGreaterPerformanceCardState extends GlobalEtfSearchProps {
    value: number | undefined;
    valueId: string;
    period: EtfKeyFigure | undefined;
    periodId: string;
    mode: "greater" | "less";
}

function EtfGreaterPerformanceCardContentView(props: CriteriaState<EtfGreaterPerformanceCardState>)  {
    const metadataContext = useContext(CommoditySearchContext);

    return (
        <>
            <span className="mx-1" style={{marginTop: "-2px"}}>Rohstoffe mit einem</span>
            <FilterDropdownItem<OptionItem>
                options={MODE_OPTIONS}
                onSelect={(value: OptionItem) => {
                    props.setCriteria({ ...props.state, mode: value.id === "greater" ? "greater" : "less"});
                }}
                activeId={props.state.mode} 
            />
            <span className="mx-1 font-weight-bold" style={{marginTop: "-2px"}}>Abstand zum 52 Wochen Hoch</span>
        </>
    )
}

const MODE_OPTIONS: OptionItem[] = [
    { id: "greater", name: 'gerigen' },
    { id: "less", name: 'hohen' }
];

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


function renderQuery(state: EtfGreaterPerformanceCardState, metadata: CommoditySearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup =  null;
    //const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;

    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        keyFigures: []
    }
}

export const CommodityDistance52WCard = wrapEtfSearchCard(
    generateEtfCard<EtfGreaterPerformanceCardProps & EnabledProps, EtfGreaterPerformanceCardState>(
        EtfGreaterPerformanceCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        mode: "less",
        value: PERFORMANCE_OPTIONS[0].value, valueId: PERFORMANCE_OPTIONS[0].id,
        period: PERIOD_OPTIONS[0].value, periodId: PERIOD_OPTIONS[0].id,
    },
    true,
    "Performance"
);
