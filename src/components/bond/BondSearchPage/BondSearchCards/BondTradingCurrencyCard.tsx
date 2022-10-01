import {ReactNode, useContext} from "react";
import { SearchBondCriterion } from "graphql/types";
import { BaseBondSearchProps, GlobalBondSearchProps, EnabledProps, CriteriaState, generateBondCard, wrapBondSearchCard } from "../BaseBondSearchCard";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import BondSearchContext, {BondSearchContextProps} from "../BondSearchContext";
import {BondTypeOption, DEFAULT_BOND_OPTION_ID, renderDefaultQuery} from "../../utils";

interface BondTradingCurrencyCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface BondTradingCurrencyCardState extends GlobalBondSearchProps {
    value: number | undefined;
    valueId: string;
}

function BondTradingCurrencyCardContentView(props: CriteriaState<BondTradingCurrencyCardState>)  {
    const metadataContext = useContext(BondSearchContext);
    const typeOptions = ((metadataContext && metadataContext.bondTypes) || []);

    const currencyOptions = (metadataContext && metadataContext.bondTradingCurrencies || []).map(current => {
        return {id: "" + current?.currency?.id  || "" , name: current?.currency?.name || "", value: current?.currency?.id || 0};
    });

    if (!props.state.value) {
        props.setCriteria({...props.state, value: currencyOptions[0].value, valueId: currencyOptions[0].id});
    }

    return (
        <>
            <FilterDropdownItem<BondTypeOption>
                onSelect={(option: BondTypeOption) => {
                    props.setCriteria({ ...props.state, typeId: option.id});
                }}
                options={typeOptions}
                activeId={"" + props.state.typeId || DEFAULT_BOND_OPTION_ID}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>im Zeichnung mit Handelswährung</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={currencyOptions}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

function renderQuery(state: BondTradingCurrencyCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        tradingCurrencyId: state.value,
        keyFigures: []
    }
}

export const BondTradingCurrencyCard = wrapBondSearchCard(
    generateBondCard<BondTradingCurrencyCardProps & EnabledProps, BondTradingCurrencyCardState>(
        BondTradingCurrencyCardContentView,
    ),
    renderQuery,
    {nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null, value: undefined, valueId: "-"},
    true,
    ""
);
