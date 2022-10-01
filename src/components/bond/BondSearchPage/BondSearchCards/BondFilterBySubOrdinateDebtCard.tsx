import {ReactNode, useContext} from "react";
import { SearchBondCriterion } from "graphql/types";
import { BaseBondSearchProps, GlobalBondSearchProps, EnabledProps, CriteriaState, generateBondCard, wrapBondSearchCard } from "../BaseBondSearchCard";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import BondSearchContext, {BondSearchContextProps} from "../BondSearchContext";
import {BondTypeOption, DEFAULT_BOND_OPTION_ID, renderDefaultQuery} from "../../utils";

interface BondFilterBySubOrdinateDebtCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface BondFilterBySubOrdinateDebtCardState extends GlobalBondSearchProps {
    value: boolean;
    valueId: string;
}

function BondFilterBySubOrdinateDebtCardContentView(props: CriteriaState<BondFilterBySubOrdinateDebtCardState>)  {
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
            <FilterDropdownItem<OptionItem & {value: boolean}>
                options={SUBORDINATE_DEBT_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: boolean}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

function renderQuery(state: BondFilterBySubOrdinateDebtCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        hasSubordinatedDebt: state.value,
        keyFigures: []
    }
}


const SUBORDINATE_DEBT_OPTIONS: (OptionItem & {value: boolean})[] = [
    {id: "0", name: 'mit Nachrang', value: true},
    {id: "1", name: 'ohne Nachrang', value: false}
];

export const BondFilterBySubOrdinateDebtCard = wrapBondSearchCard(
    generateBondCard<BondFilterBySubOrdinateDebtCardProps & EnabledProps, BondFilterBySubOrdinateDebtCardState>(
        BondFilterBySubOrdinateDebtCardContentView,
    ),
    renderQuery,
    {nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null,
            value: SUBORDINATE_DEBT_OPTIONS[0].value, valueId: SUBORDINATE_DEBT_OPTIONS[0].id},
    false,
    "Nachrang"
);
