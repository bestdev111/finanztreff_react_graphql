import { FundKeyFigure, SearchFundCriterion } from "graphql/types";
import { ReactNode, useContext } from "react";
import FundsSearchContext, {FundsSearchContextProps} from "../FundsSearchContext";
import {
    BaseFundSearchProps,
    CriteriaState, EnabledProps, generateFundCard,
    GlobalFundSearchProps,
    wrapFundSearchCard
} from "../BaseFundSearchCard";
import { FilterDropdownItem, OptionItem } from "../../../common/SearchCard/FilterDropdownItem";
import {renderDefaultQuery} from "../../utils";

interface FundSharpRatioSearchCardProps extends BaseFundSearchProps {
    children?: ReactNode;
}

interface FundSharpRatioSearchCardState extends GlobalFundSearchProps {
    mode: "greater" | "less";
    value: number;
}

function FundSharpRatioSearchCardView({state, setCriteria}: CriteriaState<FundSharpRatioSearchCardState>) {
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
            <div className="text-nowrap mx-1" style={{ marginTop: "-2px" }}>mit einem Sharpratio von</div>
            <FilterDropdownItem<OptionItem>
                options={PERIOD}
                onSelect={(value: OptionItem) => { }}
                activeId={"1"}
            />
            <FilterDropdownItem<OptionItem>
                options={SHARPE_RATIO_LEVEL}
                onSelect={(value: OptionItem) => {
                    setCriteria({ ...state, value: Number.parseFloat(value.id) });
                }}
                activeId={"1"} />
        </>
    )
}

function renderQuery(state: FundSharpRatioSearchCardState, metadata: FundsSearchContextProps | null): SearchFundCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        keyFigures: [{
            keyFigure: FundKeyFigure.TotalExpenseRatio,
            from: state.mode == "greater" ? state.value : undefined,
            to: state.mode == "less" ? state.value : undefined,
        }],
    }
}

const PERIOD: OptionItem[] = [
    { id: "1", name: '1 Jahr' },
    { id: "2", name: '2 Jahre' }
];

const SHARPE_RATIO_LEVEL: OptionItem[] = [
    {id: "1", name: 'negativ'},
    {id: "2", name: '< 1'},
    {id: "3", name: '< 2'},
    {id: "4", name: '< 3'},
    {id: "5", name: '< 4'},
    {id: "6", name: '< 5'},
    {id: "7", name: '< 6'},
    {id: "8", name: '< 8'},
    {id: "9", name: '< 10'},
    {id: "10", name: '> 10'}
];

export const FundSharpRatioSearchCard = wrapFundSearchCard<FundSharpRatioSearchCardState>(
    generateFundCard<FundSharpRatioSearchCardProps & EnabledProps, FundSharpRatioSearchCardState>(
        FundSharpRatioSearchCardView,
    ),
    renderQuery,
    {typeId: null, topicId: null, strategyId: null, regionId: null, currencyId: null, mode: "greater", value: 50},
    true,
    "Performance"
);

