import { InstrumentGroup, Query, Instrument } from "../../../../../generated/graphql";
import { Modal, Spinner } from "react-bootstrap";
import { InstrumentModalHeader } from "../../../../common";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { CompanyInformationModalBody } from "./CompanyInfoModalBody";
import { getAssetForUrl } from "components/profile/utils";
import { Link, useParams } from "react-router-dom";

export const CompanyProfileModal = (props: CompanyInfoProps) => {
    const pathParam = useParams<{ section: string, seoTag: string }>();

    let { loading, data } = useQuery<Query>(
        loader('./getCompanyInfo.graphql'),
        { variables: { groupId: props.instrumentGroup.id }, skip: pathParam.section !== "unternehmensprofil" || !props.instrumentGroup?.id }
    );

    const instrument = props.instrument ? props.instrument : props.instrumentGroup.content.filter((item: any) => item.main === true)[0] || props.instrumentGroup.content[0];
    const exchange = instrument.exchange?.code ? instrument.exchange.code + '' : '';

    return (
        <>
            {pathParam.section === "unternehmensprofil" &&
                <Link className="fade modal-backdrop"
                    to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                    <Modal onClick={(e: any) => e.stopPropagation()} show={true} className="modal modal-dialog-sky-placement" aria-labelledby="timesSalesModal" aria-hidden="true" style={{ zIndex: '1040' }}>
                        <div className="modal-content">
                            <div className="modal-header pb-0">
                                <div className="row row-cols-1  mb-n1">
                                    <div className="col d-flex justify-content-between ml-n3 pl-2 ml-md-0 pl-md-0">
                                        <h5 className="modal-title">Unternehmensprofil</h5>
                                        <Link className="mr-n2 text-nowrap"
                                            to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                                            <span>schließen</span>
                                            <span className="close-modal-butt svg-icon">
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} width={"27"} alt="" className="svg-blue" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <InstrumentModalHeader className={"ml-n2 pl-0 ml-md-0 pl-md-0"} modalsTitle={props.instrumentGroup} instrument={props.instrument} />
                            </div>
                        </div>
                        <div className="modal-body mobile-modal-body">
                            <section className="main-section">
                                {loading ?
                                    <Spinner animation="border" /> :
                                    (data && data.group?.company && props.instrumentGroup.isin != null ?
                                        <CompanyInformationModalBody instrumentGroup={props.instrumentGroup}
                                            company={data.group?.company} isin={props.instrumentGroup.isin} />
                                        : <></>)}
                            </section>
                        </div>
                    </Modal>
                </Link>
            }
        </>

    );
}


export interface CompanyInfoProps {
    instrumentGroup: InstrumentGroup;
    instrument?: Instrument;
}