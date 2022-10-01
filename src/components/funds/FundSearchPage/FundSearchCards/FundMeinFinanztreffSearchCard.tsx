import { ReactNode, useContext } from "react";
import { SearchFundCriterion } from "graphql/types";
import FundsSearchContext, {FundsSearchContextProps} from "components/funds/FundSearchPage/FundsSearchContext";
import {
    BaseFundSearchProps, EnabledProps, GlobalFundSearchProps, CriteriaState,
    generateFundCard, wrapFundSearchCard
} from "../BaseFundSearchCard";
import { FilterDropdownItem, OptionItem } from "../../../common/SearchCard/FilterDropdownItem";

import {renderDefaultQuery} from "../../utils";

interface FundMeinFinanztreffSearchCardProps extends BaseFundSearchProps {
    children?: ReactNode;
}

export interface Type {
    id?: number | null;
    name?: string | null;
}

interface FundMeinFinanztreffSearchCardState extends GlobalFundSearchProps {
    mode: "greater" | "less",
    value: number;
}

function FundMeinFinanztreffSearchCardView({state, setCriteria}: CriteriaState<FundMeinFinanztreffSearchCardState>) {
    const metadataContext = useContext(FundsSearchContext);
    const typeOptions = ((metadataContext && metadataContext.fundTypes) || []).map(current => {
        return {id:current?.id  || "" , name: current?.name || ""};
    });

    return (
        <>
            <FilterDropdownItem<OptionItem>
                onSelect={(value: OptionItem) => {
                    setCriteria({ ...state, typeId: value.id});
                }}
                options={typeOptions}
                activeId={"" + state.typeId}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>die</span>
            <FilterDropdownItem<OptionItem>
                options={MF_OPTIONS}
            onSelect={(value: OptionItem) => {}}
                activeId={state.mode} 
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>in</span>
            <FilterDropdownItem<OptionItem>
                options={PERIOD}
                onSelect={(value: OptionItem) => {}}
                activeId={state.mode} 
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>aufgenommen sind</span>
        </>
    )
}

function renderQuery(state: FundMeinFinanztreffSearchCardState, metadata: FundsSearchContextProps | null): SearchFundCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        keyFigures: [{
            keyFigure: undefined,
            from: state.mode === "greater" ? state.value : undefined,
            to: state.mode === "less" ? state.value : undefined,
        }],
    }
}

const MF_OPTIONS: OptionItem[] = [
    {id: "1", name: 'Portfolios'},
    {id: "2", name: 'Watchlisten'}
];

const PERIOD: OptionItem[] = [
    {id: "1", name: 'aktuell'},
    {id: "2", name: 'heute'},
    {id: "3", name: 'letzten 5 Tage'},
    {id: "4", name: 'letzten 30 Tage'}
];

export const FundMeinFinanztreffSearchCard = wrapFundSearchCard<FundMeinFinanztreffSearchCardState>(
    generateFundCard<FundMeinFinanztreffSearchCardProps & EnabledProps, FundMeinFinanztreffSearchCardState>(
        FundMeinFinanztreffSearchCardView,
    ),
    renderQuery,
    {typeId: null, topicId: null, strategyId: null, regionId: null, currencyId: null, mode: "greater", value: 50},
    true,
    "Mein Finanztreff"
);
