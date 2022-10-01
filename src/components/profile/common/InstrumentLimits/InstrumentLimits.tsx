import { useQuery } from "@apollo/client";
import SvgImage from "components/common/image/SvgImage";
import { ProfileInstrumentAddPopupHeader } from "components/common/modals/ProfileInstrumentAddPopup/ProfileInstrumentAddPopupHeader";
import { ProfileInstrumentAddPopupNotAuthenticated } from "components/common/modals/ProfileInstrumentAddPopup/ProfileInstrumentAddPopupNotAuthenticated";
import { LimitsAdd } from "components/profile/LimitsPage/LimitsBanner/LimitsAdd";
import { LimitsModal } from "components/profile/LimitsPage/LimitsBanner/LimitsModal";
import { LimitEntry, Query, UserProfile } from "generated/graphql";
import { loader } from "graphql.macro";
import keycloak from "keycloak";
import { Dropdown } from "react-bootstrap";

export function InstrumentLimits(props: InstrumentLimitsProps) {

    let { loading, data, refetch } = useQuery<Query>(loader('./getLimits.graphql'), { skip: props.instrumentGroupId == undefined || !!props.limits });
    let limits = props.limits?.filter(current => current.instrumentId === props.instrumentId) || [];
    if (!loading && data?.user?.profile?.limits?.filter(current => current.instrumentId === props.instrumentId)) {
        limits = data?.user?.profile?.limits?.filter(current => current.instrumentId === props.instrumentId);
    }
    if(limits){
        const profile = props.profile ? props.profile : data?.user?.profile;
        if (!loading && profile && (limits.length > 0) && [props.instrumentGroupId]) {
            return (
                <LimitsModal profile={profile} limits={limits} refetch={() => refetch()} showSummary={true}>
                    <span>
                        <SvgImage icon={"icon_bell_filled_" + props.svgColor + ".svg"} convert={false} width="27" />
                    </span>
                </LimitsModal>
            )
        }
        return (
            <LimitsAdd
                variant="link" className="text-white" innerModal={props.innerModal}
                instrumentGroupId={props.instrumentGroupId || undefined}
                instrumentId={props.instrumentId || undefined}
                refreshTrigger={props.refreshTrigger}
            >
                <span>
                    <SvgImage icon={"icon_add_limit_" + props.svgColor + ".svg"} convert={false} width="27" />
                </span>
            </LimitsAdd>
        )
    }

    return (
        <div className="d-inline-grid position-static my-2 mr-4 ml-1">
            <Dropdown className="dropdown-select no-after-pointer main-dropdown with-min-width-340 dropdown-keep-ope show profile-instrument-dropdown">
                <Dropdown.Toggle variant="link">
                    <span>
                        <SvgImage icon={"icon_bell_" + props.svgColor + ".svg"} convert={false} width="27" />
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: '340px' }}>
                    <ProfileInstrumentAddPopupHeader title={"Limits"} />
                    <div className="content">
                        <ProfileInstrumentAddPopupNotAuthenticated onLogin={() => keycloak.login()}
                            onRegister={() => keycloak.register()} text="Limit" />
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

interface InstrumentLimitsProps {
    profile?: UserProfile;
    instrumentId: number;
    instrumentGroupId?: number;
    svgColor?: string
    innerModal?: boolean;
    limits?: LimitEntry[];
    refreshTrigger?: () => void;
}