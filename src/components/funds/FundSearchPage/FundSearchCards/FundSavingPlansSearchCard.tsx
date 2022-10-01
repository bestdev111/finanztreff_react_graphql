import { ReactNode, useContext } from "react";
import { SearchFundCriterion } from "graphql/types";
import FundsSearchContext, {FundsSearchContextProps} from "components/funds/FundSearchPage/FundsSearchContext";
import {
    BaseFundSearchProps, CriteriaState, EnabledProps, GlobalFundSearchProps,
    wrapFundSearchCard, generateFundCard
} from "../BaseFundSearchCard";
import { FilterDropdownItem, OptionItem } from "../../../common/SearchCard/FilterDropdownItem";

import {renderDefaultQuery} from "../../utils";

interface FundSavingPlansSearchCardProps extends BaseFundSearchProps {
    children?: ReactNode;
}

export interface Type {
    id?: number | null;
    name?: string | null;
}

interface FundSavingPlansSearchCardState extends GlobalFundSearchProps {
    value: number;
}

function FundSavingPlansSearchCardView({state, setCriteria}: CriteriaState<FundSavingPlansSearchCardState>) {
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
            <span className="mx-1" style={{ marginTop: "-2px" }}>
                welche Sparplan fähig sind und eine Performance von mind
            </span>
            <FilterDropdownItem<OptionItem>
                options={PERCENTAGE}
                onSelect={(value: OptionItem) => { }}
                activeId={"1"} />
            <span className="mx-1" style={{ marginTop: "-2px" }}>
                in den letzten
            </span>
            <FilterDropdownItem<OptionItem>
                options={PERIOD}
                onSelect={(value: OptionItem) => { }}
                activeId={"1"}
            />
        </>
    )
}

function renderQuery(state: FundSavingPlansSearchCardState, metadata: FundsSearchContextProps | null): SearchFundCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        keyFigures: [{
            keyFigure: undefined,
            // from: state.mode === "greater" ? state.value : undefined,
            // to: state.mode === "less" ? state.value : undefined,
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
    {id: "2.5", name: '2.5%',}
];

const PERIOD: OptionItem[] = [
    {id: "1", name: '30 Tage'},
    {id: "2", name: '3 Monate'},
    {id: "3", name: '6 Monate'},
    {id: "4", name: '12 Monate'},
    {id: "5", name: '3 Jahre'},
    {id: "5", name: '5 Jahre'},
    {id: "5", name: '10 Jahre'}
];
export const FundSavingPlansSearchCard = wrapFundSearchCard<FundSavingPlansSearchCardState>(
    generateFundCard<FundSavingPlansSearchCardProps & EnabledProps, FundSavingPlansSearchCardState>(
        FundSavingPlansSearchCardView,
    ),
    renderQuery,
    {typeId: null, topicId: null, strategyId: null, regionId: null, currencyId: null, value: 50},
    true,
    "Sparplan", "Abstand"
);

