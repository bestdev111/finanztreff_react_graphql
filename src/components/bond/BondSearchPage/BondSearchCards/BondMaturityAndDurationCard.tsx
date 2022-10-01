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
import moment from "moment";
import {BondTypeOption, DEFAULT_BOND_OPTION_ID, renderDefaultQuery} from "../../utils";

interface BondMaturityAndDurationCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface BondMaturityAndDurationCardState extends GlobalBondSearchProps {
    durationId: string;
    durationFrom?: number;
    durationTo?: number;

    maturityId: string;

    maturityDateFrom?: moment.Moment;
    maturityDateTo?: moment.Moment;
}

function BondMaturityAndDurationCardContentView(props: CriteriaState<BondMaturityAndDurationCardState>)  {
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
            <FilterDropdownItem<OptionItem & {from?: number; to?: number}>
                options={MATURITY_PERIODS}
                onSelect={({id: maturityId, from: maturityFrom, to: maturityTo}: OptionItem & {from?: number; to?: number}) => {
                    props.setCriteria({
                        ...props.state,
                        maturityId,
                        maturityDateFrom: (maturityFrom && moment().add(maturityFrom, 'month')) || undefined,
                        maturityDateTo: (maturityTo && moment().add(maturityTo, 'month')) || undefined,
                    });
                }}
                activeId={props.state.maturityId} />
            <span className="mx-1" style={{marginTop: "-2px"}}>und Duration</span>
            <FilterDropdownItem<OptionItem & {from?: number; to?: number}>
                options={DURATION_OPTIONS}
                onSelect={({id: durationId, from: durationFrom, to: durationTo}: OptionItem & {from?: number; to?: number}) => {
                    props.setCriteria({ ...props.state, durationId, durationFrom, durationTo});
                }}
                activeId={props.state.durationId} />
        </>
    )
}

function renderQuery(state: BondMaturityAndDurationCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        maturityDateFrom: (state.maturityDateFrom && state.maturityDateFrom.format("YYYY-MM-DD"))|| undefined,
        maturityDateTo: (state.maturityDateTo && state.maturityDateTo.format("YYYY-MM-DD")) || undefined,
        keyFigures: [
            {
                keyFigure: BondKeyFigure.Duration,
                from: state.durationFrom,
                to: state.durationTo
            }
        ]
    }
}

const MATURITY_PERIODS: (OptionItem & {from?: number; to?: number})[] = [
    {id: "0", name: '< 3 Monaten', to: 3},
    {id: "1", name: '< 6 Monaten', to: 6},
    {id: "2", name: '< 1 Jahr', to: 12},
    {id: "3", name: '1-3 Jahre', from: 12, to: 3 * 12},
    {id: "4", name: '3-5 Jahre', from: 3 * 12, to: 5 * 12},
    {id: "5", name: '5-8 Jahre', from: 5 * 12, to: 8 * 12},
    {id: "6", name: '8-12 Jahre', from: 8 * 12, to: 12 * 12},
    {id: "7", name: '>12 Jahre', from: 12 * 12},
];

const DURATION_OPTIONS: (OptionItem & {from?: number; to?: number})[] = [
    {id: "0", name: '< 0,5', to: 0.5},
    {id: "1", name: '< 1', to: 1},
    {id: "2", name: '1-3', from: 1, to: 3},
    {id: "3", name: '3-5', from: 3, to: 5},
    {id: "4", name: '> 5', from: 5},
    {id: "5", name: '> 7', from: 7},
];

export const BondMaturityAndDurationCard = wrapBondSearchCard(
    generateBondCard<BondMaturityAndDurationCardProps & EnabledProps, BondMaturityAndDurationCardState>(
        BondMaturityAndDurationCardContentView,
    ),
    renderQuery,
    {nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null,
        durationId: DURATION_OPTIONS[0].id, durationFrom: DURATION_OPTIONS[0].from, durationTo: DURATION_OPTIONS[0].to,
        maturityId: MATURITY_PERIODS[0].id,
        maturityDateFrom: (MATURITY_PERIODS[0].from && moment().add(MATURITY_PERIODS[0].from, 'month')) || undefined,
        maturityDateTo: (MATURITY_PERIODS[0].to && moment().add(MATURITY_PERIODS[0].to, 'month')) || undefined
    },
    false,
    ""
);
