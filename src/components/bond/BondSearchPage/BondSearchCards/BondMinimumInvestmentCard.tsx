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

interface BondMinimumInvestmentCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface BondMinimumInvestmentCardState extends GlobalBondSearchProps {
    value: Range;
    valueId: string;
}

function BondMinimumInvestmentCardContentView(props: CriteriaState<BondMinimumInvestmentCardState>)  {
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
            <span className="mx-1" style={{marginTop: "-2px"}}>mit Mindestanlage</span>
            <FilterDropdownItem<OptionItem & {value: Range}>
                options={INVESTMENT_VOLUME_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: Range}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

function renderQuery(state: BondMinimumInvestmentCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        keyFigures: [{
            keyFigure: BondKeyFigure.MinAmountTradableLot,
            from: state.value.from,
            to: state.value.to
        }]
    }
}


const INVESTMENT_VOLUME_OPTIONS: (OptionItem & {value: Range})[] = [
    {id: "0", name: '<= 1.000', value: {to: 1_000}},
    {id: "1", name: '<= 5.000', value: {to: 5_000}},
    {id: "2", name: '<= 10.000', value: {to: 10_000}},
    {id: "3", name: '> 10.000', value: {from: 10_000}}
];

export const BondMinimumInvestmentCard = wrapBondSearchCard(
    generateBondCard<BondMinimumInvestmentCardProps & EnabledProps, BondMinimumInvestmentCardState>(
        BondMinimumInvestmentCardContentView,
    ),
    renderQuery,
    {nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null,
        value: INVESTMENT_VOLUME_OPTIONS[0].value, valueId: INVESTMENT_VOLUME_OPTIONS[0].id},
    false,
    "Mindestanlage"
);

interface Range {
    from?: number;
    to?: number;
}
