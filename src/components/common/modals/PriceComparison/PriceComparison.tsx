import { Modal, ModalBody, Spinner } from "react-bootstrap";
import { InstrumentGroup, Query } from "../../../../generated/graphql";
import { InstrumentModalHeader } from "../common";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import moment from "moment";
import { PriceComparisonModalBody } from "./PriceComparisonModalBody";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAssetForUrl } from "components/profile/utils";

export const PriceComparison = (props: PriceComparisonProps) => {
    const pathParam = useParams<{ section: string, seoTag: string }>();
    const location = useLocation();
    const exchangeCode: string | undefined = props.instrumentGroup.content.find(current => current.id===location.state)?.exchange.code || undefined;
    let instrument = props.instrumentGroup.content.find(current => current.id === location.state) || props.instrumentGroup.content.filter((item: any) => item.main === true)[0];

    let { loading, data } = useQuery<Query>(
        loader('./getPriceComparison.graphql'),
        { variables: { instrumentId: instrument && instrument.id, from: moment().subtract(9, 'days').format('YYYY-MM-DD'), to: moment().format('YYYY-MM-DD') }, skip: location.hash !== "#chart" || !instrument.id }
    );
    return (
        <>
            {location.hash === "#chart" &&
            <Link className="fade modal-backdrop" to={{key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag  + "/", hash: (exchangeCode ? ("boerse-" + exchangeCode ) : "") }}>
                <Modal onClick={(e: any) => e.stopPropagation()} show={location.hash === "#chart"} onHide={location.hash !== "#chart"} className="modal modal-dialog-sky-placement" aria-labelledby="timesSalesModal" aria-hidden="true">
                        <div className="modal-header">
                            <div className="row row-cols-1 mb-n1">
                                <div className="col d-flex justify-content-between ml-n3 pl-2 pl-md-0 ml-md-0">
                                    <h5 className="modal-title">Kursvergleich der letzten Handelstage</h5>
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
                            <InstrumentModalHeader className={"ml-n3 pl-2 pl-md-0 ml-md-0"} modalsTitle={props.instrumentGroup} instrument={instrument} />
                        </div>
                        <ModalBody>
                            <section className="main-section">
                                {loading ?
                                    <div className="text-center py-2">
                                        <Spinner animation="border" />
                                    </div>
                                    : (data && data.instrument ? <PriceComparisonModalBody instrument={data.instrument} /> : <></>)}
                            </section>
                        </ModalBody>
                    </Modal>
                </Link>
            }
        </>
    );
}

export interface PriceComparisonProps {
    className?: string;
    instrumentGroup: InstrumentGroup;
}
