import {ReactNode, useContext} from "react";
import { SearchBondCriterion } from "graphql/types";
import { BaseBondSearchProps, GlobalBondSearchProps, EnabledProps, CriteriaState, generateBondCard, wrapBondSearchCard } from "../BaseBondSearchCard";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import BondSearchContext, {BondSearchContextProps} from "../BondSearchContext";
import moment from "moment";
import {BondTypeOption, DEFAULT_BOND_OPTION_ID, renderDefaultQuery} from "../../utils";

interface BondRemainingLifeCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface BondRemainingLifeCardState extends GlobalBondSearchProps {
    range: Range;
    rangeId: string;
}

function BondRemainingLifeCardContentView(props: CriteriaState<BondRemainingLifeCardState>)  {
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
            <span className="mx-1" style={{marginTop: "-2px"}}>mit einer Restlaufzeit</span>
            <FilterDropdownItem<OptionItem & {value: Range}>
                options={TIMEFRAME_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: Range}) => {
                    props.setCriteria({
                        ...props.state, rangeId: valueId,
                        maturityDateFrom: (value.from && moment().add(value.from, 'month')) || undefined,
                        maturityDateTo: (value.to && moment().add(value.to, 'month')) || undefined,
                    });
                }}
                activeId={props.state.rangeId} />
        </>
    )
}

function renderQuery(state: BondRemainingLifeCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        maturityDateFrom: (state.maturityDateFrom && state.maturityDateFrom.format("YYYY-MM-DD"))|| null,
        maturityDateTo: (state.maturityDateTo && state.maturityDateTo.format("YYYY-MM-DD")) || null,
        keyFigures: []
    }
}

const TIMEFRAME_OPTIONS: (OptionItem & {value: Range})[] = [
    {id: "0", name: '< 3 Monaten', value: { to: 3 }},
    {id: "1", name: '< 6 Monaten', value: { to: 6 }},
    {id: "2", name: '< 1 Jahr', value: { to: 12 }},
    {id: "3", name: '1-3 Jahre', value: { from: 12, to: 3 * 12 }},
    {id: "4", name: '3-5 Jahre', value: { from: 3 * 12, to: 5 * 12 }},
    {id: "5", name: '5-8 Jahre', value: { from: 5 * 12, to: 8 * 12 }},
    {id: "6", name: '8-12 Jahre', value: {from: 8 *12, to: 12 * 12 }},
    {id: "7", name: '>12 Jahre', value: { from: 12 * 12 }}
];

export const BondRemainingLifeCard = wrapBondSearchCard(
    generateBondCard<BondRemainingLifeCardProps & EnabledProps, BondRemainingLifeCardState>(
        BondRemainingLifeCardContentView,
    ),
    renderQuery,
    {nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null,
        range: TIMEFRAME_OPTIONS[0].value, rangeId: TIMEFRAME_OPTIONS[0].id,
        maturityDateFrom: (TIMEFRAME_OPTIONS[0].value.from && moment().add(TIMEFRAME_OPTIONS[0].value.from, 'm')) || undefined,
        maturityDateTo: (TIMEFRAME_OPTIONS[0].value.to && moment().add(TIMEFRAME_OPTIONS[0].value.to, 'm')) || undefined,
    },
    false,
    "Restlaufzeit"
);

interface Range {
    from?: number;
    to?: number;
}
