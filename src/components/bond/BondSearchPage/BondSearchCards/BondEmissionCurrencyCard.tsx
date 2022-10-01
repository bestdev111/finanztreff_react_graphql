import {ReactNode, useContext} from "react";
import { SearchBondCriterion } from "graphql/types";
import { BaseBondSearchProps, GlobalBondSearchProps, EnabledProps, CriteriaState, generateBondCard, wrapBondSearchCard } from "../BaseBondSearchCard";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import BondSearchContext, {BondSearchContextProps} from "../BondSearchContext";
import {BondTypeOption, DEFAULT_BOND_OPTION_ID, renderDefaultQuery} from "../../utils";

interface FundVolumeCardProps extends BaseBondSearchProps {
    children?: ReactNode;
}

interface FundVolumeCardState extends GlobalBondSearchProps {
    mode: "greater" | "less",
    value: number;
    valueId: string;
}

function FundVolumeCardContentView(props: CriteriaState<FundVolumeCardState>)  {
    const metadataContext = useContext(BondSearchContext);
    const typeOptions = ((metadataContext && metadataContext.bondTypes) || []);

    const currencyOptions = (metadataContext && metadataContext.bondNominalCurrencies || []).map(current => {
        return {id: "" + current?.currency?.id  || "" , name: current?.currency?.name || "", value: current?.currency?.id || 0};
    });
    if (!props.state.nominalCurrencyId) {
        props.setCriteria({...props.state, nominalCurrencyId: currencyOptions[0].value })
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
            <span className="mx-1" style={{marginTop: "-2px"}}>mit Emissionswährung</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={currencyOptions}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, nominalCurrencyId: value});
                }}
                activeId={"" + props.state.nominalCurrencyId} />
        </>
    )
}

function renderQuery(state: FundVolumeCardState, metadata: BondSearchContextProps | null): SearchBondCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        keyFigures: []
    }
}

export const BondEmissionCurrencyCard = wrapBondSearchCard(
    generateBondCard<FundVolumeCardProps & EnabledProps, FundVolumeCardState>(
        FundVolumeCardContentView,
    ),
    renderQuery,
    {nominalCurrencyId: null, typeId: null, regionId: null, issuerId: null,
            mode: "greater", value: 50, valueId: "50"},
    false,
    "Emission"
);
