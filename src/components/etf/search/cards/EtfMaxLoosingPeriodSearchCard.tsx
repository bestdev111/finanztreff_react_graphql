import {EtfKeyFigure, SearchEtfCriterion} from "graphql/types";
import { ReactNode, useContext } from "react";
import {
    BaseEtfSearchProps,
    CriteriaState, EnabledProps,
    generateEtfCard,
    GlobalEtfSearchProps,
    wrapEtfSearchCard
} from "../BaseEtfSearchCard";
import {FilterDropdownItem, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import EtfSearchContext, {EtfSearchContextProps} from "../EtfSearchContext";

interface EtfMaxLoosingPeriodSearchCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfMaxLoosingPeriodSearchCardState extends GlobalEtfSearchProps {
    value: number;
    valueId: string;
}

function EtfMaxLoosingPeriodSearchCardContentView({state, setCriteria}: CriteriaState<EtfMaxLoosingPeriodSearchCardState>) {
    const metadataContext = useContext(EtfSearchContext);
    const typeOptions = ((metadataContext && metadataContext.etfTypes) || []).map(current => {
        return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || ""};
    });
    return (
        <>
            <FilterDropdownItem<OptionItem & {value: string}>
                onSelect={(option: OptionItem & {value: string}) => {
                    setCriteria({ ...state, typeId: option.value});
                }}
                options={typeOptions}
                activeId={"" + state.typeId}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>ETF mit einer max.</span>
            <span className="mx-1"  style={{marginTop: "-2px"}}>Verlustperiode kleiner als</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={PERIOD_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    setCriteria({ ...state, valueId, value});
                }} 
                activeId={state.valueId} />
        </>
    )
}

function renderQuery(state: EtfMaxLoosingPeriodSearchCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        keyFigures: [{
            keyFigure: EtfKeyFigure.LongestLoosingPeriod,
            to: state.value
        }],
    }
}

const PERIOD_OPTIONS: (OptionItem & {value: number})[] = [
    {id: "1", name: "12 Monate", value: 12},
    {id: "2", name: "9 Monate", value: 9},
    {id: "3", name: "6 Monate", value: 6},
    {id: "4", name: "3 Monate", value: 3},
    {id: "5", name: "2 Monate", value: 2}
];

export const EtfMaxLoosingPeriodSearchCard = wrapEtfSearchCard(
    generateEtfCard<EtfMaxLoosingPeriodSearchCardProps & EnabledProps, EtfMaxLoosingPeriodSearchCardState>(
        EtfMaxLoosingPeriodSearchCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        valueId: PERIOD_OPTIONS[0].id, value: PERIOD_OPTIONS[0].value},
    false,
    "Performance"
);
