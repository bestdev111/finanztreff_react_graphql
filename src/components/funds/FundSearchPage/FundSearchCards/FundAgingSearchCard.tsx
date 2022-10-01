import { FundKeyFigure, SearchFundCriterion } from "graphql/types";
import { ReactNode, useContext } from "react";
import FundsSearchContext, {FundsSearchContextProps} from "../FundsSearchContext";
import {
    BaseFundSearchProps, EnabledProps, GlobalFundSearchProps, CriteriaState,
    generateFundCard, wrapFundSearchCard
} from "../BaseFundSearchCard";
import {FilterDropdownItem, Option, OptionItem} from "../../../common/SearchCard/FilterDropdownItem";
import moment from "moment";
import {renderDefaultQuery} from "../../utils";

interface FundAgingSearchCardProps extends BaseFundSearchProps {
    children?: ReactNode;
}

interface FundAgingSearchCardState extends GlobalFundSearchProps {
    mode: "greater" | "less";
    years: number;
    yearsId: string;
}

function FundAgingSearchCardView({state, setCriteria}: CriteriaState<FundAgingSearchCardState>) {
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
            <div className="text-nowrap mx-1" style={{ marginTop: "-2px" }}>mit einem Alter</div>
            <FilterDropdownItem<ModeOption>
                options={MODE_OPTIONS}
                onSelect={(value: ModeOption) => {
                    setCriteria({ ...state, mode: value.id });
                }}
                activeId={state.mode}
            />
            <FilterDropdownItem<PeriodOptionItem>
                options={PERIOD_OPTIONS}
                onSelect={({id, years}: PeriodOptionItem) => {
                    setCriteria({ ...state, yearsId: id, years });
                }}
                activeId={state.yearsId} />
        </>
    )
}

function renderQuery(state: FundAgingSearchCardState, metadata: FundsSearchContextProps | null): SearchFundCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        foundationDateTo:
            (state.mode == "greater" && moment().subtract(state.years, 'years').format("YYYY-MM-DD")) || null,
        foundationDateFrom:
            (state.mode == "less" && moment().subtract(state.years, 'years').format("YYYY-MM-DD")) || null
    };
}


type ModeOption = Option<"greater" | "less">;

const MODE_OPTIONS: ModeOption[] = [
    { id: "greater", name: 'größer'},
    { id: "less", name: 'kleiner' }
];


interface PeriodOptionItem extends OptionItem {
    years: number;
}

const PERIOD_OPTIONS: PeriodOptionItem[] = [
    {id: "1", name: '1 Jahr', years: 1},
    {id: "2", name: '3 Jahre', years: 3},
    {id: "3", name: '5 Jahre', years: 5},
    {id: "4", name: '10 Jahre', years: 10},
    {id: "5", name: '15 Jahre', years: 15},
    {id: "6", name: '20 Jahre', years: 20},
    {id: "7", name: '25 Jahre', years: 25},
];

export const FundAgingSearchCard = wrapFundSearchCard<FundAgingSearchCardState>(
    generateFundCard<FundAgingSearchCardProps & EnabledProps, FundAgingSearchCardState>(
        FundAgingSearchCardView,
    ),
    renderQuery,
        {typeId: null, topicId: null, strategyId: null, regionId: null, currencyId: null,
            mode: MODE_OPTIONS[0].id, years: PERIOD_OPTIONS[0].years, yearsId: PERIOD_OPTIONS[0].id},
    false,
    "Alter"
);
