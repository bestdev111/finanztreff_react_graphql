import { ReactNode, useContext } from "react";
import { SearchFundCriterion } from "graphql/types";
import FundsSearchContext, {FundsSearchContextProps} from "components/funds/FundSearchPage/FundsSearchContext";
import {
    BaseFundSearchProps, EnabledProps, GlobalFundSearchProps,
    generateFundCard, wrapFundSearchCard, CriteriaState
} from "../BaseFundSearchCard";
import { FilterDropdownItem, OptionItem } from "../../../common/SearchCard/FilterDropdownItem";

import {renderDefaultQuery} from "../../utils";

interface FundMinimalPerformanceSearchCardProps extends BaseFundSearchProps {
    children?: ReactNode;
}

interface FundMinimalPerformanceSearchCardState extends GlobalFundSearchProps {
    mode: "greater" | "less",
    value: number;
}

function FundMinimalPerformanceSearchCardView({state, setCriteria}: CriteriaState<FundMinimalPerformanceSearchCardState>) {
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
            <span className="mx-1" style={{marginTop: "-2px"}}>
                welche Riester fähig sind und eine Performance von mind.
            </span>
            <FilterDropdownItem<OptionItem>
                options={PERCENTAGE}
                onSelect={(value: OptionItem) => {}} 
                activeId={"" + state.value} />
            <span className="mx-1" style={{marginTop: "-2px"}}>
                in den letzten
            </span>
            <FilterDropdownItem<OptionItem>
                options={PERIOD}
                onSelect={(value: OptionItem) => {}}
                activeId={state.mode} 
            />

        </>
    )
}

function renderQuery(state: FundMinimalPerformanceSearchCardState, metadata: FundsSearchContextProps | null): SearchFundCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        keyFigures: [{
            keyFigure: undefined,
            from: state.mode === "greater" ? state.value : undefined,
            to: state.mode === "less" ? state.value : undefined,
        }],
    }
}

const PERCENTAGE: OptionItem[] = [
    {id: "alle", name: 'alle'},
    {id: "100", name: '100%'},
    {id: "75", name: '75%'},
    {id: "50", name: '50%'},
    {id: "25", name: '25%'},
    {id: "10", name: '10%'},
    {id: "5", name: '5%'},
    {id: "2.5", name: '2.5%'}
];

const PERIOD: OptionItem[] = [
    {id: "1", name: '30 Tage'},
    {id: "2", name: '3 Monate'},
    {id: "3", name: '6 Monate'},
    {id: "4", name: '12 Monate'},
    {id: "5", name: '3 Jahre'},
    {id: "6", name: '5 Jahre'},
    {id: "7", name: '10 Jahre'}
];

export const FundMinimalPerformanceSearchCard = wrapFundSearchCard<FundMinimalPerformanceSearchCardState>(
    generateFundCard<FundMinimalPerformanceSearchCardProps & EnabledProps, FundMinimalPerformanceSearchCardState>(
        FundMinimalPerformanceSearchCardView,
    ),
    renderQuery,
    {typeId: null, topicId: null, strategyId: null, regionId: null, currencyId: null, mode: "greater", value: 50},
    true,
    "Performance"
);
