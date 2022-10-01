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

interface BondDurationCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface BondDurationCardState extends GlobalBondSearchProps, Range {
    valueId: string;
}

function BondDurationCardContentView(props: CriteriaState<BondDurationCardState>)  {
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
            <span className="mx-1" style={{marginTop: "-2px"}}>mit einer Duration</span>
            <FilterDropdownItem<OptionItem & Range>
                options={DURATION_RANGE_OPTIONS}
                onSelect={({id: valueId, from, to}: OptionItem & Range) => {
                    props.setCriteria({ ...props.state, valueId, from, to});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

function renderQuery({from, to, ...state}: BondDurationCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        nominalCurrencyId: state.nominalCurrencyId,
        issuerId: state.issuerId,
        keyFigures: [
            {keyFigure: BondKeyFigure.Duration, from, to}
        ]
    }
}

const DURATION_RANGE_OPTIONS: (OptionItem & Range)[] = [
    {id: "0", name: '< 0,5', to: 0.5},
    {id: "1", name: '< 1', to: 1},
    {id: "2", name: '1-3', from: 1, to:3},
    {id: "3", name: '3-5', from: 3, to: 5},
    {id: "4", name: '> 5', from: 5},
    {id: "5", name: '> 7', from: 7},
];

export const BondDurationCard = wrapBondSearchCard(
    generateBondCard<BondDurationCardProps & EnabledProps, BondDurationCardState>(
        BondDurationCardContentView,
    ),
    renderQuery,
    {nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null,
        valueId: DURATION_RANGE_OPTIONS[0].id,
        from: DURATION_RANGE_OPTIONS[0].from, to: DURATION_RANGE_OPTIONS[0].to},
    false,
    "Duration"
);

interface Range {
    from?: number;
    to?: number;
}
