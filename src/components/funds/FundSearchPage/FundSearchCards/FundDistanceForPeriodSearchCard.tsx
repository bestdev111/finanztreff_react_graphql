import { ReactNode, useContext } from "react";
import { SearchFundCriterion } from "graphql/types";
import FundsSearchContext, {FundsSearchContextProps} from "components/funds/FundSearchPage/FundsSearchContext";
import {
    BaseFundSearchProps, CriteriaState, EnabledProps, generateFundCard,
    GlobalFundSearchProps,
    wrapFundSearchCard
} from "../BaseFundSearchCard";
import { FilterDropdownItem, OptionItem } from "../../../common/SearchCard/FilterDropdownItem";

import {renderDefaultQuery} from "../../utils";

interface FundDistanceForPeriodSearchCardProps extends BaseFundSearchProps {
    children?: ReactNode;
}

interface FundDistanceForPeriodSearchCardState extends GlobalFundSearchProps {
    mode: "greater" | "less";
    value: number;
}

function FundDistanceForPeriodSearchCardView({state, setCriteria}: CriteriaState<FundDistanceForPeriodSearchCardState>) {
    const metadataContext = useContext(FundsSearchContext);
    const typeOptions = ((metadataContext && metadataContext.fundTypes) || []).map(current => {
        return { id: current?.id || "", name: current?.name || "" };
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
            <span className="mx-1" style={{ marginTop: "-2px" }}>mit einem Abstand zum</span>
            <FilterDropdownItem<OptionItem>
                options={PERIOD}
                onSelect={(value: OptionItem) => { }}
                activeId={state.mode}
            />
            <FilterDropdownItem<OptionItem>
                options={MODE_OPTIONS}
                onSelect={(value: OptionItem) => {
                    setCriteria({ ...state, mode: value.id === "greater" ? "greater" : "less" });
                }}
                activeId={state.mode}
            />
            <FilterDropdownItem<OptionItem>
                options={PERCENTAGE}
                onSelect={(value: OptionItem) => { }}
                activeId={"" + state.value} />
        </>
    )
}

function renderQuery(state: FundDistanceForPeriodSearchCardState, metadata: FundsSearchContextProps | null): SearchFundCriterion {
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
    {id: "50", name: '50%'},
    {id: "30", name: '30%'},
    {id: "20", name: '20%'},
    {id: "10", name: '10%'},
    {id: "5", name: '5%'}
];

const PERIOD: OptionItem[] = [
    {id: "1", name: 'Allzeithoch'},
    {id: "2",name: 'Allzeittief'},
    {id: "3", name: 'GD 200'},
    {id: "4", name: '52 Wochen Hoch'},
    {id: "5", name: '52 Wochen Tief'}
];


const MODE_OPTIONS: OptionItem[] = [{ id: "greater", name: 'größer' }, { id: "less", name: 'kleiner' }]

export const FundDistanceForPeriodSearchCard = wrapFundSearchCard<FundDistanceForPeriodSearchCardState>(
    generateFundCard<FundDistanceForPeriodSearchCardProps & EnabledProps, FundDistanceForPeriodSearchCardState>(
        FundDistanceForPeriodSearchCardView
    ),
    renderQuery,
    {typeId: null, topicId: null, strategyId: null, regionId: null, currencyId: null, mode: "greater", value: 50},
    true,
    "Abstand"
);

