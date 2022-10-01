import { Modal } from "react-bootstrap";
import { InstrumentModalHeader } from "../modals";
import { Instrument, InstrumentGroup } from "../../../generated/graphql";
import { getAssetForUrl } from 'components/profile/utils';
import { useParams, Link, useLocation } from 'react-router-dom';
import ChartToolsComponentModal from "./ChartToolsComponentModal";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";

interface ChartToolModalProps {
    instrumentGroup: InstrumentGroup,
    instrument?: Instrument,
    instrumentId: number,
    setInstrument: (value: Instrument) => void
    toggleChartOptions: boolean
    setToggleChartOptions: (value: boolean) => void
}

export const ChartToolModal = (props: ChartToolModalProps) => {
    const pathParam = useParams<{ section: string, seoTag: string }>();
    const location: any = useLocation();
    const instrument = props.instrument ? props.instrument : props.instrumentGroup.content.filter((item: any) => item.main === true)[0] || props.instrumentGroup.content[0];
    const exchange = instrument.exchange?.code ? instrument.exchange.code + '' : '';
    const {toggleChartOptions, setToggleChartOptions} = props;

    let insId: number | undefined = props.instrument ? props.instrument?.id : props.instrumentGroup.content.find(current => current.id===location.state?.instrumentId)?.id;
    let currInstrument: Instrument | undefined = props.instrument ? props.instrument : props.instrumentGroup.content.find(current => current.id===location.state?.instrumentId);

    const modalSpecs = useBootstrapBreakpoint({
        xl: {
            height: "800px",
            landscapeMode: false
        },
        md: {
            height: "80vh",
            landscapeMode: true
        },
        lg: {
            height: "100%",
            landscapeMode: true
        },
        sm: {
            height: "890px",
            landscapeMode: false
        }
    })

    return (
        <>
            {pathParam.section === "chart-analyse" &&
                <>
                    <Modal
                        show={true}
                        dialogClassName={"chart-tool-modal-dialog"}
                        className={`fade modal modal-dialog-sky-placement chart-tool-modal ${modalSpecs.landscapeMode ? "landscape-chart-tool-modal" : ""}`}
                    >
                        <div style={{ overflow: 'visible' }} className="modal-header">
                            <div className="row row-cols-1 ml-n3 pl-2 pl-md-0 ml-md-0">
                                <div className="col d-flex justify-content-between">
                                    <h5 className="modal-title mb-0" id="">Chartanalyse</h5>
                                    <Link className="mr-n2 text-nowrap"
                                        to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                                        <span>schließen</span>
                                        <span className="close-modal-butt svg-icon">
                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} width={"27"} alt="" className="svg-blue" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            <InstrumentModalHeader setInstrument={props.setInstrument} isChartBanner={true} className={"ml-n3 pl-2 pl-md-0 ml-md-0"} modalsTitle={props.instrumentGroup} instrument={currInstrument} />
                        </div>
                        <Modal.Body style={{height: modalSpecs.height}}>
                            <div className="modal-body mobile-modal-body" >
                                <section className="main-section bg-white mt-2" style={{height: 780}}>
                                    <div className=" chart-tool-container">
                                        <div className="content-row">
                                            <ChartToolsComponentModal toggleChartOptions={toggleChartOptions} setToggleChartOptions={setToggleChartOptions} instrumentId={insId}/>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>

            }
        </>
    )
}

export default ChartToolModal;
