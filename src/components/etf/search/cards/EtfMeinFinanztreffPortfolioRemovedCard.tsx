import {ReactNode, useContext} from "react";
import { SearchEtfCriterion } from "graphql/types";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import {
    BaseEtfSearchProps,
    CriteriaState, EnabledProps,
    generateEtfCard,
    GlobalEtfSearchProps,
    wrapEtfSearchCard
} from "../BaseEtfSearchCard";
import EtfSearchContext, {EtfSearchContextProps} from "../EtfSearchContext";

interface EtfMeinFinanztreffPortfolioRemovedCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfMeinFinanztreffPortfolioRemovedCardState extends GlobalEtfSearchProps {
    value: number | undefined;
    valueId: string;
}

function EtfMeinFinanztreffPortfolioRemovedCardContentView(props: CriteriaState<EtfMeinFinanztreffPortfolioRemovedCardState>)  {
    const metadataContext = useContext(EtfSearchContext);
    const typeOptions = ((metadataContext && metadataContext.etfTypes) || []).map(current => {
        return {id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || ""};
    });

    return (
        <>
            <FilterDropdownItem<OptionItem & {value: string}>
                onSelect={(option: OptionItem & {value: string}) => {
                    props.setCriteria({ ...props.state, typeId: option.value});
                }}
                options={typeOptions}
                activeId={"" + props.state.typeId}
            />
            <span className="mx-1" style={{marginTop: "-2px"}}>ETF die</span>
            <FilterDropdownItem<OptionItem & {value: number}>
                options={PERIOD_OPTIONS}
                onSelect={({id: valueId, value}: OptionItem & {value: number}) => {
                    props.setCriteria({ ...props.state, valueId, value});
                }}
                activeId={props.state.valueId} />

            <span className="mx-1" style={{marginTop: "-2px"}}>in Portfolios</span>
            <span className="mx-1" style={{marginTop: "-2px"}}>entfernt wurden</span>
        </>
    )
}

const PERIOD_OPTIONS: (OptionItem & { value: number })[] = [
    {id: "1", name: 'heute', value: 1},
    {id: "2", name: 'die letzten 5 Tage', value: 5},
    {id: "3", name: 'die letzten 30 Tage', value: 30},
    {id: "4", name: 'die letzten 90 Tagen', value: 90}
];

function renderQuery(state: EtfMeinFinanztreffPortfolioRemovedCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        keyFigures: []
    }
}

export const EtfMeinFinanztreffPortfolioRemovedCard = wrapEtfSearchCard(
    generateEtfCard<EtfMeinFinanztreffPortfolioRemovedCardProps & EnabledProps, EtfMeinFinanztreffPortfolioRemovedCardState>(
        EtfMeinFinanztreffPortfolioRemovedCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        value: PERIOD_OPTIONS[0].value, valueId: PERIOD_OPTIONS[0].id
    },
    true,
    "Strategie"
);
