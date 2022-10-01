import {ReactNode, useContext} from "react";
import {SearchEtfCriterion} from "graphql/types";
import { FilterDropdownItem, OptionItem } from "components/common/SearchCard/FilterDropdownItem";

import {
    BaseEtfSearchProps,
    CriteriaState, EnabledProps,
    generateEtfCard,
    GlobalEtfSearchProps,
    wrapEtfSearchCard
} from "../BaseEtfSearchCard";
import EtfSearchContext, {EtfSearchContextProps} from "../EtfSearchContext";

interface EtfDistributionCardProps extends BaseEtfSearchProps {
    children?: ReactNode;
}

interface EtfDistributionCardState extends GlobalEtfSearchProps {
    distributing: boolean;
    distributingId: string;
}

function EtfDistributionCardContentView(props: CriteriaState<EtfDistributionCardState>)  {
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
            <span className="mx-1" style={{marginTop: "-2px"}}>ETF mit der</span>
            <span style={{marginTop: "-2px", marginRight: "2px"}}>Ausschüttungsart</span>
            <FilterDropdownItem<OptionItem & {value: boolean}>
                options={DISTRIBUTION_OPTIONS}
                onSelect={({id: distributingId, value: distributing}: OptionItem & {value: boolean}) => {
                    props.setCriteria({ ...props.state, distributingId, distributing});
                }}
                activeId={props.state.distributingId} />
        </>
    )
}

const DISTRIBUTION_OPTIONS: (OptionItem & {value: boolean})[] = [
    {id: "1", name: 'thesaurierend', value: false},
    {id: "2", name: 'ausschüttend', value: true},
];

function renderQuery(state: EtfDistributionCardState, metadata: EtfSearchContextProps | null): SearchEtfCriterion {
    const assetTypeGroup = ((metadata?.etfTypes || []).find(current => current.id == state.typeId)?.value as string | null) || null;
    return {
        assetTypeGroup,
        regionId: state.regionId,
        strategyId: state.strategyId,
        sectorId: state.sectorId,
        distributing: state.distributing,
        keyFigures: [ ]
    }
}

export const EtfDistributionCard = wrapEtfSearchCard(
    generateEtfCard<EtfDistributionCardProps & EnabledProps, EtfDistributionCardState>(
        EtfDistributionCardContentView
    ),
    renderQuery,
    {typeId: null, regionId: null, strategyId: null, sectorId: null,
        distributing: DISTRIBUTION_OPTIONS[0].value, distributingId: DISTRIBUTION_OPTIONS[0].id},
    false,
    "Strategie"
);
