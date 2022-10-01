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

interface EtfTotalExpenseRatioSearchCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfTotalExpenseRatioSearchCardState extends GlobalEtfSearchProps {
    mode: "greater" | "less";
    value: number;
    valueId: string;
}

function EtfTotalExpenseRatioSearchCardContentView({state, setCriteria}: CriteriaState<EtfTotalExpenseRatioSearchCardState>) {
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
            <div className="text-nowrap mx-1" style={{marginTop: "-2px"}}>ETF mit einem TER</div>
            <FilterDropdownItem<OptionItem>
                options={MODE_OPTIONS}
                onSelect={(value: OptionItem) => {
                    setCriteria({ ...state, mode: value.id === "greater" ? "greater" : "less"});
                }}
                activeId={state.mode} 
            />
            <FilterDropdownItem<OptionItem & {value: number}>
                options={TOTAL_EXPENSE_RATION_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    setCriteria({ ...state, valueId, value});
                }} 
                activeId={state.valueId} />
        </>
    )
}

function renderQuery(state: EtfTotalExpenseRatioSearchCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        keyFigures: [{
            keyFigure: EtfKeyFigure.TotalExpenseRatio,
            from: state.mode == "greater" ? state.value: undefined,
            to: state.mode == "less" ? state.value : undefined,
        }],
    }
}

const MODE_OPTIONS: OptionItem[] = [
    { id: "greater", name: 'größer' },
    { id: "less", name: 'kleiner' }
];

const TOTAL_EXPENSE_RATION_OPTIONS: (OptionItem & {value: number})[] = [
    {id: "010", name: "0.1%", value: 0.1},
    {id: "020", name: "0.2%", value: 0.2},
    {id: "030", name: "0.3%", value: 0.3},
    {id: "040", name: "0.4%", value: 0.4},
    {id: "050", name: "0.5%", value: 0.5},
    {id: "075", name: "0.75%", value: 0.75},
    {id: "100", name: "1%", value: 1},
    {id: "150", name: "1.5%", value: 1.5},
    {id: "200", name: "2%", value: 2},
    // {id: "250", name: "2.5%", value: 2.5},
    {id: "300", name: "3%", value: 3},
    // {id: "350", name: "3.5%", value: 3.5},
    {id: "400", name: "4%", value: 4},
    {id: "500", name: "5%", value: 5},
    // {id: "750", name: "7.5%", value: 7.5},
    // {id: "1000", name: "10%", value: 10},
];

export const EtfTotalExpenseRatioSearchCard = wrapEtfSearchCard(
    generateEtfCard<EtfTotalExpenseRatioSearchCardProps & EnabledProps, EtfTotalExpenseRatioSearchCardState>(
        EtfTotalExpenseRatioSearchCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        mode: "less",
        valueId: TOTAL_EXPENSE_RATION_OPTIONS[4].id, value: TOTAL_EXPENSE_RATION_OPTIONS[4].value},
    false,
    "Strategie"
);
