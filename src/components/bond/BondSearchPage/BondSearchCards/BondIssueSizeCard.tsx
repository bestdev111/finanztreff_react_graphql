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

interface FundVolumeCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface BondIssueSizeCardState extends GlobalBondSearchProps {
    from: number;
    fromId: string;
    to: number | undefined;
    toId: string;
}

function BondIssueSizeCardContentView(props: CriteriaState<BondIssueSizeCardState>)  {
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
            <span className="mx-1" style={{marginTop: "-2px"}}>mit einem Ausgabevolumen von</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={FROM_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, fromId: valueId, from: value});
                }}
                activeId={props.state.fromId} />
            <span className="mx-1" style={{marginTop: "-2px"}}>bis</span>
            <FilterDropdownItem<OptionItem & {value: number | undefined}>
                options={TO_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number | undefined}) => {
                    props.setCriteria({ ...props.state, toId: valueId, to: value});
                }}
                activeId={props.state.toId} />
        </>
    )
}

function renderQuery(state: BondIssueSizeCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        keyFigures: [{
            keyFigure: BondKeyFigure.IssueSize,
            from: state.from,
            to: state.to
        }]
    }
}

const FROM_OPTIONS: (OptionItem & {value: number})[] = [
    {id: "0", name: '0', value: 0},
    {id: "10", name: '10 Mio', value: 10_000_000},
    {id: "25", name: '25 Mio', value: 25_000_000},
    {id: "50", name: '50 Mio', value: 50_000_000},
    {id: "100", name: '100 Mio', value: 100_000_000},
    {id: "250", name: '250 Mio', value: 250_000_000},
    {id: "500", name: '500 Mio', value: 500_000_000},
    {id: "1000", name: '1 Mrd', value: 1_000_000_00},
    {id: "2500", name: '2.5 Mrd', value: 2_500_000_00},
    {id: "5000", name: '5 Mrd', value: 5_000_000_00},
    {id: "10000", name: '10 Mrd', value: 10_000_000_00},
];

const TO_OPTIONS: (OptionItem & {value: number | undefined})[] = [
    {id: "10", name: '10 Mio', value: 10_000_000},
    {id: "25", name: '25 Mio', value: 25_000_000},
    {id: "50", name: '50 Mio', value: 50_000_000},
    {id: "100", name: '100 Mio', value: 100_000_000},
    {id: "250", name: '250 Mio', value: 250_000_000},
    {id: "500", name: '500 Mio', value: 500_000_000},
    {id: "1000", name: '1 Mrd', value: 1_000_000_00},
    {id: "2500", name: '2.5 Mrd', value: 2_500_000_00},
    {id: "5000", name: '5 Mrd', value: 5_000_000_00},
    {id: "10000", name: '10 Mrd', value: 10_000_000_00},
    {id: "9999", name: '>1 Mrd(Jumbo)', value: undefined},
];

export const BondIssueSizeCard = wrapBondSearchCard(
    generateBondCard<FundVolumeCardProps & EnabledProps, BondIssueSizeCardState>(
        BondIssueSizeCardContentView,
    ),
    renderQuery,
    {nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null,
        from: FROM_OPTIONS[3].value, fromId: FROM_OPTIONS[3].id,
        to: TO_OPTIONS[5].value, toId: TO_OPTIONS[5].id
    },
    false,
    "Ausgabevolumen"
);
