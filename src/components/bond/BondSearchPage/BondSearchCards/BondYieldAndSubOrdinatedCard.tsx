import {ReactNode, useContext} from "react";
import {BondKeyFigure, SearchBondCriterion} from "graphql/types";
import { BaseBondSearchProps, GlobalBondSearchProps, EnabledProps, CriteriaState, generateBondCard, wrapBondSearchCard } from "../BaseBondSearchCard";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import BondSearchContext, {BondSearchContextProps} from "../BondSearchContext";
import {BondTypeOption, DEFAULT_BOND_OPTION_ID, renderDefaultQuery} from "../../utils";

interface BondYieldAndSubOrdinatedCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface BondYieldAndSubOrdinatedCardState extends GlobalBondSearchProps {
    from?: number;
    to?: number;
    valueId: string;
    hasSubordinated: boolean | null;
    subOrdinatedId: string;
}

function BondYieldAndSubOrdinatedCardContentView(props: CriteriaState<BondYieldAndSubOrdinatedCardState>)  {
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
                options={YIELD_OPTIONS}
                onSelect={({id: valueId, from, to}: OptionItem & {from?: number, to?: number}) => {
                    props.setCriteria({ ...props.state, valueId, from, to});
                }}
                activeId={props.state.valueId} />
            <span className="mx-1" style={{marginTop: "-2px"}}>und</span>
            <FilterDropdownItem<OptionItem & {value: boolean | null}>
                options={SUBORDINATED_OPTIONS}
                onSelect={({id: subOrdinatedId, value: hasSubordinated}: OptionItem & {value: boolean | null}) => {
                    props.setCriteria({ ...props.state, subOrdinatedId, hasSubordinated});
                }}
                activeId={props.state.subOrdinatedId} />
        </>
    )
}

function renderQuery(state: BondYieldAndSubOrdinatedCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        hasSubordinatedDebt: state.hasSubordinated,
        keyFigures: [
            {keyFigure: BondKeyFigure.IsmaYield, from: state.from, to: state.to}
        ]
    }
}

const YIELD_OPTIONS: (OptionItem & {from?: number, to?: number})[] = [
    {id: "0", name: '< 0', to: 0},
    {id: "1", name: '< 0-1 %', from: 0, to: 1},
    {id: "2", name: '> 1-3 %', from: 1, to: 2},
    {id: "3", name: '< 3-5 %', from: 3, to: 5},
    {id: "4", name: '> 5-8 %', from: 5, to: 8},
    {id: "5", name: '< 8-12 %', from: 8, to: 12},
    {id: "6", name: '> 12 %', from: 12},
];

const SUBORDINATED_OPTIONS: (OptionItem & {value: boolean | null})[] = [
    {id: "1", name: 'ohne Nachrang', value: false},
    {id: "2", name: 'mit Nachrang', value: true},
    {id: "3", name: 'Alle', value: null},
];

const DEFAULT_YIELD_OPTION_ID = 2;
const DEFAULT_SUBORDINATED_OPTION_ID = 0;

export const BondYieldAndSubOrdinatedCard = wrapBondSearchCard(
    generateBondCard<BondYieldAndSubOrdinatedCardProps & EnabledProps, BondYieldAndSubOrdinatedCardState>(
        BondYieldAndSubOrdinatedCardContentView,
    ),
    renderQuery,
    {nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null,
        hasSubordinated: SUBORDINATED_OPTIONS[DEFAULT_SUBORDINATED_OPTION_ID].value, subOrdinatedId: SUBORDINATED_OPTIONS[DEFAULT_SUBORDINATED_OPTION_ID].id,
        from: YIELD_OPTIONS[DEFAULT_YIELD_OPTION_ID].from, to: YIELD_OPTIONS[DEFAULT_YIELD_OPTION_ID].to, valueId: YIELD_OPTIONS[DEFAULT_YIELD_OPTION_ID].id
    },
    false,
    ""
);
