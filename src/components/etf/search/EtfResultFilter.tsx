import {useContext, useState} from "react";
import {Option, OptionSelectorComponent} from "../../filters/OptionSelectorComponent/OptionSelectorComponent";
import EtfSearchContext from "./EtfSearchContext";
import {Option as IndexOption, IndexSelectorComponent} from "../../filters/IndexSelectorComponent/IndexSelectorComponent";

interface EtfResultFilter {
    distributing: boolean | null;
    replication: number | null;
    issuer: number | null,
}

interface EtfResultFilterState extends EtfResultFilter {
    distributingId: string | null;
    replicationId: string | null;
    issuerId: string | null;

    originalDistributing: boolean | null;
    originalReplicationId: number | null;
}

interface EtfResultFilterProps {
    distributing: boolean | null;
    replicationId: number | null;
    onChange?: (ev: EtfResultFilter) => void;
}

export function EtfResultFilter({onChange, ...props}: EtfResultFilterProps) {
    const metadataContext = useContext(EtfSearchContext);
    const replicationOptions: Option<string, number | null>[] =
        ((metadataContext && metadataContext.etfReplications) || [])
            .map(current => ({id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || null}));
    const issuerOptions: (IndexOption & {value: number})[] =
        ((metadataContext && metadataContext.etfIssuers) || [])
            .map(current => ({id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || 0}));
    let distributionSelected = DISTRIBUTION_OPTIONS.find(current => current.value == props.distributing);
    let replicationSelected = replicationOptions.find(current => current.value == props.replicationId);
    let [state, setState] = useState<EtfResultFilterState>({
        distributing: (distributionSelected || DISTRIBUTION_OPTIONS[0]).value,
        distributingId: (distributionSelected || DISTRIBUTION_OPTIONS[0]).id,
        originalDistributing: props.distributing,
        originalReplicationId: props.replicationId,
        replication: (replicationSelected || ANY_REPLICATION).value,
        replicationId: (replicationSelected || ANY_REPLICATION).id,
        issuer: ANY_REPLICATION.value, issuerId: ANY_REPLICATION.id
    });

    if (props.replicationId != state.originalReplicationId || props.distributing != state.originalDistributing) {
        let distributionSelected = DISTRIBUTION_OPTIONS.find(current => current.value == props.distributing);
        let replicationSelected = replicationOptions.find(current => current.value == props.replicationId);
        setState({...state,
            distributing: (distributionSelected || DISTRIBUTION_OPTIONS[0]).value,
            distributingId: (distributionSelected || DISTRIBUTION_OPTIONS[0]).id,
            originalDistributing: props.distributing,
            originalReplicationId: props.replicationId,
            replication: (replicationSelected || ANY_REPLICATION).value,
            replicationId: (replicationSelected || ANY_REPLICATION).id,
        });
    }

    return (
        <div className="d-flex flex-column flex-xl-row">
            <OptionSelectorComponent<string, boolean | null>
                title="Ausschüttend"
                subtitle="Ausschüttend?"
                variant={"dropdown-panel range-selector-160 mr-2"}
                toggleVariant={"panel-button"}
                toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
                options={DISTRIBUTION_OPTIONS}
                selected={state.distributingId}
                onSelect={(ev ) => {
                    setState({...state, distributingId: ev.selected?.id || DISTRIBUTION_OPTIONS[0].id, distributing: ev.selected?.value || null});
                    onChange && onChange({distributing: ev.selected?.value === undefined || ev.selected?.value == null ? null : (ev.selected?.value || false), replication: state.replication, issuer: null});
                }}
            />
            <OptionSelectorComponent<string, number | null>
                title="Replizierung"
                subtitle="Replizierung"
                variant={"dropdown-panel range-selector-160 mr-2"}
                toggleVariant={"panel-button"}
                toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
                options={[ANY_REPLICATION, ...replicationOptions]}
                selected={state.replicationId}
                onSelect={(ev ) => {
                    setState({...state, replicationId: ev.selected?.id || ANY_REPLICATION.id, replication: ev.selected?.value || null});
                    onChange && onChange({distributing: state.distributing, replication: ev.selected?.value || ANY_REPLICATION.value, issuer: null});
                }}
            />
            <IndexSelectorComponent<IndexOption & {value: number}>
                title="Emittent"
                // subtitle="Emittent"
                description={"Alle"}
                variant={"dropdown-panel range-selector-160 mr-2"}
                toggleVariant={"panel-button"}
                toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
                options={issuerOptions}
                selected={state.issuerId}
                onSelect={(ev ) => {
                    setState({...state, issuerId: ev.selected?.id || null, issuer: ev.selected?.value || null});
                    onChange && onChange({
                        distributing: state.distributing,
                        replication: state.replication || null,
                        issuer: ev.selected?.value || null
                    });
                }}
            />
        </div>
    );
}


const DISTRIBUTION_OPTIONS: Option<string, boolean | null>[] = [
    {id: "ANY", name: "Egal",  value: null},
    {id: "YES", name: "Ja",  value: true},
    {id: "NO", name: "Nein (Thesaurierend)", value: false},
];

const ANY_REPLICATION: Option<string, number | null> = {id: "ANY", name: "Egal", value: null };
