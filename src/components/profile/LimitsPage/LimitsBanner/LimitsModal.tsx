import SvgImage from "components/common/image/SvgImage";
import { LimitEntry, UserProfile } from "generated/graphql";
import { ReactElement, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import classNames from "classnames";
import { LimitsPageContent } from "../LimitsPageContent";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { LimitsAdd } from "./LimitsAdd";

export function LimitsModal(props: LimitModalProps) {

    const [state, setState] = useState({ isOpen: false });

    const openModal = () => setState({ ...state, isOpen: true });
    const closeModal = () => setState({ ...state, isOpen: false });
    let limits = props.id ? props.limits.filter(current => current.instrumentId === props.id) : props.limits;

    let openLimits = limits.filter(limit => limit.hitStatus === false).length || 0;
    let hitLimits = limits.length - openLimits;

    return (
        <>
            <Button variant="link" className="text-decoration-none" style={{ cursor: props.stopPropagation ? "default" : "pointer" }} onClick={openModal}>
                {props.children}
            </Button>
            <Modal show={state.isOpen} onHide={closeModal} dialogClassName="limits-modal" className="limits-modal modal-background limits-modal modal-dialog-sky-placement">
                <Modal.Header>
                    <Row className="row-cols-1">
                        <div className="col d-flex justify-content-between">
                            <Modal.Title>
                                <div className="d-flex d-sm-none d-lg-flex d-xl-flex">
                                    <SvgImage icon="icon_bell_dark.svg" className="svg-convert cursor-default " imgClass="svg-black" width="40" />
                                    <h4 className="d-flex mt-2">
                                        <span className="">Limits</span>
                                        {props.showSummary && <span className="ml-1 d-block d-sm-none d-xl-block d-lg-block">- {limits.length > 0 ? limits[0].instrument?.name : ""}</span>}
                                    </h4>
                                    {props.showSummary &&
                                        <span className="d-flex d-sm-none d-lg-flex d-xl-flex align-items-center ml-2 mt-1">
                                            {openLimits > 0 &&
                                                <div className="fs-15px">
                                                    <div>
                                                        <span className="green-dot"></span>
                                                    </div>
                                                    <span className="ml-3 font-weight-bold">{openLimits} aktiv</span>
                                                </div>
                                            }
                                            {hitLimits > 0 &&
                                                <>
                                                    <SvgImage icon="icon_alert_red.svg" className="svg-convert cursor-default ml-2" width="20" style={{ paddingBottom: "6px" }} />
                                                    <span className="fs-15px font-weight-bold">{hitLimits} getroffen</span>
                                                </>
                                            }
                                        </span>
                                    }
                                </div>
                                <div className="d-none d-sm-block d-lg-none d-xl-none">
                                    <h5><SvgImage icon="icon_bell_dark.svg" className="svg-convert cursor-default " imgClass="svg-black" width="30" />
                                        Limits</h5>
                                    <h5 className="mt-n2">{props.showSummary && <span className="ml-1">- {limits.length > 0 ? limits[0].instrument?.name : ""}</span>}</h5>
                                </div>
                            </Modal.Title>
                            <Button type="button" variant="link" className="close text-blue" onClick={closeModal}>
                                <span>schließen</span>
                                <SvgImage spanClass="drop-arrow-image close-icon top-move" convert={false} width={"27"} icon="icon_close_blue.svg" />
                            </Button>
                        </div>
                    </Row>
                </Modal.Header>
                <Modal.Body>
                    <section className="main-section p-0">
                        <div className="meine-finanztreff-cards ">
                            <div className="card-wrapper limit-modal-grid mx-n4">
                                <FunctionalityRow
                                    limits={limits} refreshTrigger={props.refetch || (() => { })} />
                                <LimitsPageContent
                                    profile={props.profile}
                                    inModal={true}
                                    showTitle={false}
                                    limits={limits} refetch={props.refetch || (() => { })} />
                            </div>
                        </div>
                    </section>
                </Modal.Body>
            </Modal>
        </>
    )
}

interface LimitModalProps {
    profile: UserProfile;
    limits: LimitEntry[];
    refetch?: () => void;
    children?: ReactElement;
    stopPropagation?: boolean;
    innerModal?: boolean;

    showSummary?: boolean;
    id?: number;
}

interface FunctionalityRowProps {
    limits: LimitEntry[];
    refreshTrigger?: () => void;

}

export function FunctionalityRow(props: FunctionalityRowProps) {
    const instrument = props.limits && props.limits[0] && props.limits[0].instrument;

    return (
        <Container>
            <div className="d-flex justify-content-between py-4 border-bottom-2 border-white">
                <div className="d-flex justify-content-between ml-xl-0 ml-lg-0 ml-md-0 ml-sm-n2">
                    <button className="btn btn-primary link-primary-btn d-lg-block d-xl-block d-md-block d-sm-none mt-md-n1">
                        <AssetLinkComponent instrument={instrument} size={30} title="Zum Porträt" />
                    </button>
                    <button className="d-xl-none d-lg-none d-md-none btn btn-primary link-primary-btn d-sm-block mt-n1 px-2">
                        <AssetLinkComponent instrument={instrument} size={30} title="Porträt" />
                    </button>
                    <ProfileInstrumentAddPopup
                        instrumentId={instrument?.id || 0}
                        instrumentGroupId={instrument?.group.id || 0}
                        name={instrument?.name || ""}
                        className="p-0 ml-2 mt-n1"
                        portfolio={true}>
                        <button className="btn btn-primary bg-white text-blue border-r-3px border-white py-0">
                            <img
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_portfolio_plus_blue.svg"}
                                alt="" className="portfolio-butt-icon" />
                            <span className="d-xl-lg-inline-block d-lg-inline-block d-md-lg-inline-block d-sm-none ml-1"> Portfolio</span>
                        </button>
                    </ProfileInstrumentAddPopup>
                    <ProfileInstrumentAddPopup
                        instrumentId={instrument?.id || 0}
                        instrumentGroupId={instrument?.group.id || 0}
                        name={instrument?.name || ""}
                        className="p-0 ml-2 mt-n1 mr-sm-2"
                        watchlist={true}>

                        <button className="btn btn-primary bg-white text-blue border-r-3px border-white py-0">
                            <img
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_watchlist_plus_blue.svg"}
                                alt="" className="portfolio-butt-icon" />
                            <span className="d-xl-lg-inline-block d-lg-inline-block d-md-lg-inline-block d-sm-none ml-1"> Watchlist</span>
                        </button>
                    </ProfileInstrumentAddPopup>
                </div>

                <div>
                    <LimitsAdd
                        refreshTrigger={props.refreshTrigger}
                        instrumentId={instrument?.id || 0}
                        instrumentGroupId={instrument?.group.id || 0}
                        innerModal={true}
                        variant="primary" className="text-white py-0">
                        <span className="svg-icon action-icons d-flex py-0">
                            <SvgImage icon="icon_add_limit_white.svg" convert={false} width="25" />
                            <span className="d-flex mt-1 text-truncate">Neues Limit <span className="d-none d-md-block pl-1"> anlegen</span></span>
                        </span>
                    </LimitsAdd>
                </div>
            </div>
        </Container>
    )

}