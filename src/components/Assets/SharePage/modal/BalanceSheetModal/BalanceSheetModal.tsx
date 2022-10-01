import { Instrument, InstrumentGroup, Query } from "../../../../../generated/graphql";
import { Modal, Spinner } from "react-bootstrap";
import { InstrumentModalHeader } from "../../../../common";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { BalanceSheetTable } from "./BalanceSheetTable";
import moment from 'moment';
import { Link, useParams } from "react-router-dom";
import { getAssetForUrl } from "components/profile/utils";
import { createBalanceMetadata, createStatementRows } from "./utils";

export const BalanceSheetModal = (props: BalanceSheetModalProps) => {
    let toYear = moment().year();
    const pathParam = useParams<{ section: string, seoTag: string }>();

    let { loading: assetsLoading, data: assetData } = useQuery<Query>(
        loader('./getCompanyBalanceSheet.graphql'),
        { variables: { groupId: props.instrumentGroup.id, categories: ['FINANCIALSTATEMENT_ASSETS'], from: toYear - 6, to: toYear } }
    );
    let { loading: liabilitiesLoading, data: liabilitiesData } = useQuery<Query>(
        loader('./getCompanyBalanceSheet.graphql'),
        { variables: { groupId: props.instrumentGroup.id, categories: ['FINANCIALSTATEMENT_LIABILITIES', 'FINANCIALSTATEMENT_EQUITY'], from: toYear - 6, to: toYear } }
    );

    let loading = liabilitiesLoading || assetsLoading;
    const instrument = props.instrument ? props.instrument : props.instrumentGroup.content.filter((item: any) => item.main === true)[0] || props.instrumentGroup.content[0];
    const exchange = instrument.exchange?.code ? instrument.exchange.code + '' : '';

    return (
        <>
            {pathParam.section === "bilanz" &&
                <Link className="fade modal-backdrop"
                    to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                    <Modal onClick={(e: any) => e.stopPropagation()} show={true} className="modal modal-dialog-sky-placement" aria-labelledby="timesSalesModal" aria-hidden="true">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="row row-cols-1 mb-n1">
                                    <div className="col d-flex justify-content-between  ml-n3 pl-2 ml-md-0 pl-md-0">
                                        <h5 className="modal-title">Bilanz</h5>
                                        <Link className="mr-n2 text-nowrap"
                                            to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                                            <span>schließen</span>
                                            <span className="close-modal-butt svg-icon">
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} width={"27"} alt="" className="svg-blue" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <InstrumentModalHeader className={" ml-n3 pl-2 ml-md-0 pl-md-0"} modalsTitle={props.instrumentGroup} instrument={instrument} />
                            </div>
                        </div>
                        <div className="modal-body mobile-modal-body">
                            <section className="main-section">
                                <div className="container">
                                    <div className="content-row">
                                        <div className="content-wrapper">
                                            {loading ?
                                                <Spinner animation="border" /> :
                                                (
                                                    assetData && assetData?.group && assetData?.group?.company ?
                                                        <BalanceSheetTable
                                                            meta={createBalanceMetadata(assetData?.group?.company)}
                                                            assets={createStatementRows(assetData?.group?.company?.statements || [])}
                                                            liabilities={createStatementRows(liabilitiesData?.group?.company?.statements || [])} /> :
                                                        <></>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </Modal>
                </Link>
            }
        </>
    );
}


export interface BalanceSheetModalProps {
    instrumentGroup: InstrumentGroup;
    instrument?: Instrument;
}
