import moment from "moment";
import { Instrument, InstrumentGroup } from "../../../../../generated/graphql";
import { Modal } from "react-bootstrap";
import { InstrumentModalHeader } from "../../../../common";
import { WinLossTable } from "./WinLossTable";
import { CashFlowTable } from "./CashFlowTable";
import { SnapShotTable } from "./SnapshotTable";
import { guessInfonlineSection, trigInfonline } from "../../../../common/InfonlineService";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { getAssetForUrl } from "../../../../profile/utils";

export const WinLossCashFlowModal = (props: BalanceSheetModalProps) => {
    let toYear = moment().year();
    let fromYear = toYear - 6;
    
    const pathParam = useParams<{ section: string, seoTag: string }>();
    const instrument = props.instrument ? props.instrument : props.instrumentGroup.content.filter((item: any) => item.main === true)[0] || props.instrumentGroup.content[0];
    const exchange = instrument.exchange?.code ? instrument.exchange.code + '' : '';
    return (
        <>
            {pathParam.section === "guv" &&
                <Link onClick={() => trigInfonline(guessInfonlineSection(), "guvCashflow")} className="fade modal-backdrop"
                    to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                    <Modal onClick={(e: any) => e.stopPropagation()} show={true} className="modal modal-dialog-sky-placement" aria-labelledby="timesSalesModal" aria-hidden="true">
                        <div className="modal-content">
                            <div className="modal-header pb-0">
                                <div className="row row-cols-1 mb-n1">
                                    <div className="col d-flex justify-content-between ml-n3 pl-2 ml-md-0 pl-md-0">
                                        <h5 className="modal-title">GuV &amp; Cashflow</h5>
                                        <Link className="mr-n2 text-nowrap"
                                            to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                                            <span>schließen</span>
                                            <span className="close-modal-butt svg-icon">
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} width={"27"} alt="" className="svg-blue" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <InstrumentModalHeader className={" ml-n3 pl-2 ml-md-0 pl-md-0"} modalsTitle={props.instrumentGroup} instrument={props.instrument} />
                            </div>
                        </div>
                        <div className="modal-body mobile-modal-body">
                            {props.instrumentGroup.id &&
                                <>
                                    <WinLossTable instrumentGroupId={props.instrumentGroup.id} fromYear={fromYear}
                                        toYear={toYear} />
                                    <CashFlowTable instrumentGroupId={props.instrumentGroup.id} fromYear={fromYear}
                                        toYear={toYear} />
                                    <SnapShotTable instrumentGroupId={props.instrumentGroup.id} fromYear={fromYear}
                                        toYear={toYear} />
                                </>
                            }
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