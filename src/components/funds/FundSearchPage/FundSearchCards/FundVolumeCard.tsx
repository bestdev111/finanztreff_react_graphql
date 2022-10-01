import {ReactNode, useContext} from "react";
import { FundKeyFigure, SearchFundCriterion } from "graphql/types";
import FundsSearchContext, {FundsSearchContextProps} from "components/funds/FundSearchPage/FundsSearchContext";
import {
    BaseFundSearchProps, GlobalFundSearchProps, EnabledProps, CriteriaState,
    generateFundCard, wrapFundSearchCard
} from "../BaseFundSearchCard";
import { FilterDropdownItem, OptionItem } from "../../../common/SearchCard/FilterDropdownItem";

import {renderDefaultQuery} from "../../utils";

interface FundVolumeCardProps extends BaseFundSearchProps {
    children?: ReactNode;
}

interface FundVolumeCardState extends GlobalFundSearchProps {
    mode: "greater" | "less",
    value: number;
    valueId: string;
}

function FundVolumeCardContentView(props: CriteriaState<FundVolumeCardState>)  {
    const metadataContext = useContext(FundsSearchContext);
    const typeOptions = ((metadataContext && metadataContext.fundTypes) || []).map(current => {
        return {id:current?.id  || "" , name: current?.name || ""};
    });

    return (
        <>
            <FilterDropdownItem<OptionItem>
                onSelect={(value: OptionItem) => {
                    props.setCriteria({ ...props.state, typeId: value.id});
                }}
                options={typeOptions}
                activeId={"" + props.state.typeId}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>mit einem Fondsvolumen</span>
            <FilterDropdownItem<OptionItem>
                options={MODE_OPTIONS}
                onSelect={(value: OptionItem) => {
                    props.setCriteria({ ...props.state, mode: value.id === "greater" ? "greater" : "less"});
                }}
                activeId={props.state.mode}
            />
            <FilterDropdownItem<OptionItem & {value: number}>
                options={FUND_VOLUME_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />
        </>
    )
}

function renderQuery(state: FundVolumeCardState, metadata: FundsSearchContextProps | null): SearchFundCriterion {
    return {
        ...renderDefaultQuery(state, metadata),
        keyFigures: [{
            keyFigure: FundKeyFigure.FundTrancheVolume,
            from: state.mode == "greater" ? state.value  * 1_000_000 : undefined,
            to: state.mode == "less" ? state.value * 1_000_000 : undefined,
        }],
    }
}

const FUND_VOLUME_OPTIONS: (OptionItem & {value: number})[] = [
    {id: "5", name: '5 Mio', value: 5},
    {id: "10", name: '10 Mio', value: 10},
    {id: "25", name: '25 Mio', value: 25},
    {id: "50", name: '50 Mio', value: 50},
    {id: "100", name: '100 Mio', value: 100},
    {id: "250", name: '250 Mio', value: 250},
    {id: "500", name: '500 Mio', value: 500},
    {id: "1000", name: '1000 Mio', value: 1000},
    {id: "2500", name: '2500 Mio', value: 2500},
    {id: "5000", name: '5000 Mio',value: 5000}
];

const MODE_OPTIONS: OptionItem[] = [
    { id: "greater", name: 'größer' },
    { id: "less", name: 'kleiner' }
];

export const FundVolumeCard = wrapFundSearchCard(
    generateFundCard<FundVolumeCardProps & EnabledProps, FundVolumeCardState>(
        FundVolumeCardContentView,
    ),
    renderQuery,
    {typeId: null, topicId: null, strategyId: null, regionId: null, currencyId: null, mode: "greater", value: 1000, valueId: "1000"},
    false,
    "Fondsvolumen"
);
