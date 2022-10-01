import { ReactNode, useContext } from "react";
import { SearchFundCriterion } from "graphql/types";
import FundsSearchContext, {FundsSearchContextProps} from "components/funds/FundSearchPage/FundsSearchContext";
import {
    BaseFundSearchProps, CriteriaState, EnabledProps, GlobalFundSearchProps,
    generateFundCard, wrapFundSearchCard
} from "../BaseFundSearchCard";
import { FilterDropdownItem, OptionItem } from "../../../common/SearchCard/FilterDropdownItem";

import {renderDefaultQuery} from "../../utils";

interface FundVolatilitySearchCardProps extends BaseFundSearchProps {
    children?: ReactNode;
}

export interface Type {
    id?: number | null;
    name?: string | null;
}

interface FundVolatilitySearchCardState extends GlobalFundSearchProps {
    mode: string;
    from: number;
    to: number;
}

function FundVolatilitySearchCardView({state, setCriteria}: CriteriaState<FundVolatilitySearchCardState>) {
    const metadataContext = useContext(FundsSearchContext);
    const typeOptions = ((metadataContext && metadataContext.fundTypes) || []).map(current => {
        return {id:current?.id  || "" , name: current?.name || ""};
    });

    return (
        <>
            <FilterDropdownItem<OptionItem>
                onSelect={(value: OptionItem) => {
                    setCriteria({ ...state, typeId: value.id });
                }}
                options={typeOptions}
                activeId={"" + state.typeId}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>mit einem</span>
            <FilterDropdownItem<RangeOptionItem>
                options={MODE_OPTIONS}
                onSelect={({id, from ,to}) => {
                    setCriteria({ ...state, mode: id, from, to});
                }}
                activeId={state.mode} 
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>Stresslevel</span>
        </>
    )
}

function renderQuery(state: FundVolatilitySearchCardState, metadata: FundsSearchContextProps | null): SearchFundCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        srriTo: state.to,
        srriFrom: state.from
    }
}

const MODE_OPTIONS: RangeOptionItem[] = [
    { id: "minimal", name: 'geringen', from: 1, to: 3 },
    { id: "normal", name: 'mittleren', from: 4, to: 6 },
    { id: "higher", name: 'hohen', from: 7, to: 10 }
];

export const FundVolatilitySearchCard = wrapFundSearchCard<FundVolatilitySearchCardState>(
    generateFundCard<FundVolatilitySearchCardProps & EnabledProps, FundVolatilitySearchCardState>(
        FundVolatilitySearchCardView,
    ),
    renderQuery,
    {typeId: null, topicId: null, strategyId: null, regionId: null, currencyId: null,
        mode: MODE_OPTIONS[0].id, to: MODE_OPTIONS[0].to, from: MODE_OPTIONS[0].from},
    false,
    "KIID"
);

type RangeOptionItem = OptionItem & {from: number; to: number};
