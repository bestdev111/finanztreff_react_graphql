import { Modal } from "react-bootstrap";
import { InstrumentGroup } from "../../../../graphql/types";
import { InstrumentModalHeader } from '..';
import './ExchangeOverview.scss';
import { ExchangeOverviewTable } from "../../misc/ExchangeOverviewTable/ExchangeOverviewTable";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAssetForUrl } from "components/profile/utils";

export function ExchangeOverview(props: InstrumentGroupProperties) {
    const pathParam = useParams<{ section: string, seoTag: string }>();
    const location = useLocation();
    const exchangeCode: string | undefined = props.instrumentGroup.content.find(current => current.id===location.state)?.exchange.code || undefined;
    return (
        <>
            {location.hash === "#boersen" &&
                <Link className="fade modal-backdrop" to={{key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag  + "/", hash: (exchangeCode ? ("boerse-" + exchangeCode ) : "") }}>
                    <Modal onClick={(e: any) => e.stopPropagation()} show={true} onHide={location.hash !== "#boersen"} className="modal modal-dialog-sky-placement" aria-labelledby="timesSalesModal" aria-hidden="true">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="row row-cols-1 ml-n3 pl-2 pl-md-0 ml-md-0">
                                    <div className="col d-flex justify-content-between">
                                        <h5 className="modal-title mb-0" id="">Börsenplätze</h5>
                                        <Link className="mr-n2 text-nowrap" to={{key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag  + "/", hash: (exchangeCode ? ("boerse-" + exchangeCode ) : "") }}>
                                            <span className="text-blue fs-14px" data-dismiss="modal" aria-label="Schliessen">
                                                <span>schließen</span>
                                                <span className="close-modal-butt svg-icon">
                                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} alt="" width="27" />
                                                </span>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <InstrumentModalHeader className={"ml-n3 pl-2 pl-md-0 ml-md-0"} modalsTitle={props.instrumentGroup} instrument={props.instrumentGroup.content.find(current => current.id===location.state)} />
                            </div>
                            <div className="modal-body mobile-modal-body">
                                <section className="main-section">
                                    <div className="container">
                                        <div className="content-row">
                                            <div className="content-wrapper">
                                                <ExchangeOverviewTable
                                                    group={props.instrumentGroup} instruments={props.instrumentGroup.content || []}
                                                    isLink={true}
                                                    onActivate={() => { }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </Modal>
                </Link>
            }
        </>
    );
}

export interface InstrumentGroupProperties {
    className?: string;
    instrumentGroup: InstrumentGroup
}