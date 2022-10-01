import { FundKeyFigure, SearchFundCriterion } from "graphql/types";
import { ReactNode, useContext } from "react";
import FundsSearchContext, {FundsSearchContextProps} from "../FundsSearchContext";
import {
    BaseFundSearchProps, CriteriaState, EnabledProps, GlobalFundSearchProps,
    generateFundCard, wrapFundSearchCard
} from "../BaseFundSearchCard";
import { FilterDropdownItem, OptionItem } from "../../../common/SearchCard/FilterDropdownItem";
import {renderDefaultQuery} from "../../utils";

interface FundRiskSearchCardProps extends BaseFundSearchProps {
    children?: ReactNode;
}

interface FundRiskSearchCardState extends GlobalFundSearchProps {
    value: number;
    valueId: string;
}

function FundRiskSearchCardView({state, setCriteria}: CriteriaState<FundRiskSearchCardState>) {
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
            <div className="mx-1" style={{ marginTop: "-2px" }}>mit einer Risikokennzahl laut KIID von
            </div>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={RISK_LEVEL}
                onSelect={({id, value}: OptionItem & {value: number}) => {
                    setCriteria({ ...state, valueId: id, value });
                }}
                activeId={"" + state.valueId}
            />
        </>
    )
}

function renderQuery(state: FundRiskSearchCardState, metadata: FundsSearchContextProps | null): SearchFundCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        srriFrom: state.value,
        srriTo: state.value
    }
}


const RISK_LEVEL: (OptionItem & {value: number})[] = [
    {id: "1", name: '1 - geringes Risko', value: 1},
    {id: "2", name: '2', value: 2},
    {id: "3", name: '3', value: 3},
    {id: "4", name: '4', value: 4},
    {id: "5", name: '5', value: 5},
    {id: "6", name: '6', value: 6},
    {id: "7", name: '7 - hohes Risko', value: 7}
];

export const FundRiskSearchCard = wrapFundSearchCard<FundRiskSearchCardState>(
    generateFundCard<FundRiskSearchCardProps & EnabledProps, FundRiskSearchCardState>(FundRiskSearchCardView),
    renderQuery,
    {typeId: null, topicId: null, strategyId: null, regionId: null, currencyId: null, valueId: "1", value: 1},
    false,
    "KIID"
);

