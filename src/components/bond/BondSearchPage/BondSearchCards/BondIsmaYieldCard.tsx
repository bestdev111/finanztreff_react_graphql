import {ReactNode, useContext} from "react";
import {BondKeyFigure, SearchBondCriterion} from "graphql/types";
import {
    BaseBondSearchProps,
    CriteriaState,
    EnabledProps,
    generateBondCard,
    GlobalBondSearchProps,
    wrapBondSearchCard
} from "../BaseBondSearchCard";
import {
    FilterDropdownItem,
    OptionItem
} from "components/common/SearchCard/FilterDropdownItem";

import BondSearchContext, {BondSearchContextProps} from "../BondSearchContext";
import {BondTypeOption, DEFAULT_BOND_OPTION_ID, renderDefaultQuery} from "../../utils";

interface BondIsmaYieldCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface BondIsmaYieldCardState extends GlobalBondSearchProps {
    ismaYieldFrom?: number;
    ismaYieldTo?: number;
    valueId: string;
}

function BondIsmaYieldCardContentView(props: CriteriaState<BondIsmaYieldCardState>)  {
    const metadataContext = useContext(BondSearchContext);
    const typeOptions = ((metadataContext && metadataContext.bondTypes) || []);

    return (
        <>
            <FilterDropdownItem<BondTypeOption>
                onSelect={(option: BondTypeOption) => {
                    props.setCriteria({ ...props.state, typeId: option.id});
                }}
                options={typeOptions}
                activeId={"" + props.state.typeId || DEFAULT_BOND_OPTION_ID}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>mit einer Rendite</span>
            <FilterDropdownItem<OptionItem & {from?: number, to?: number}>
                options={ISMA_YIELD_OPTIONS}
                onSelect={({id: valueId, from: ismaYieldFrom, to: ismaYieldTo}: OptionItem & {from?: number, to?: number}) => {
                    props.setCriteria({ ...props.state, valueId, ismaYieldFrom, ismaYieldTo});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

function renderQuery(state: BondIsmaYieldCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        keyFigures: [
            {keyFigure: BondKeyFigure.IsmaYield, from: state.ismaYieldFrom, to: state.ismaYieldTo}
        ]
    }
}

const ISMA_YIELD_OPTIONS: (OptionItem & {from?: number, to?: number})[] = [
    {id: "0", name: '< 0', to: 0},
    {id: "1", name: '< 1 %', to: 1},
    {id: "2", name: '> 1 %', from: 1},
    {id: "3", name: '< 3 %', to: 3},
    {id: "4", name: '> 3 %', from: 3},
    {id: "5", name: '< 5 %', to: 5},
    {id: "6", name: '> 5 %', from: 5},
    {id: "7", name: '> 8 %', from: 8},
    {id: "8", name: '> 12 %', from: 12}
];

const DEFAULT_OPTION_ID = 4;

export const BondIsmaYieldCard = wrapBondSearchCard(
    generateBondCard<BondIsmaYieldCardProps & EnabledProps, BondIsmaYieldCardState>(
        BondIsmaYieldCardContentView,
    ),
    renderQuery,
    {
        nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null,
        valueId: ISMA_YIELD_OPTIONS[DEFAULT_OPTION_ID].id,
        ismaYieldFrom: ISMA_YIELD_OPTIONS[DEFAULT_OPTION_ID].from,
        ismaYieldTo: ISMA_YIELD_OPTIONS[DEFAULT_OPTION_ID].to
    },
    false,
    "Rendite"
);
