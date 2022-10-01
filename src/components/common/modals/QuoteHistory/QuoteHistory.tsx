import { Modal, Spinner } from "react-bootstrap";
import { useState } from 'react';
import { Instrument, InstrumentGroup, Query } from "../../../../generated/graphql";
import { InstrumentModalHeader } from "../common";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import moment from "moment";
import { QuoteHistoryTable } from "./QuoteHistoryTable";
import { StockSelectDropdown } from "../../stock-select-dropdown";
import { mapQuoteHistory, QuoteInformation } from "../PriceComparison/utils";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAssetForUrl } from "components/profile/utils";
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";

export const QuoteHistory = (props: QuoteHistoryProps) => {
    const pathParam = useParams<{ section: string, seoTag: string }>();
    const location = useLocation();
    let instrument = props.instrumentGroup.content.find(current => current.id === location.state) || props.instrumentGroup.content.filter((item: any) => item.main === true)[0];
    const exchangeCode: string | undefined = props.instrumentGroup.content.find(current => current.id === location.state)?.exchange.code || undefined;

    return (
        <>
            {location.hash === "#historie" &&
                <Link className="fade modal-backdrop"
                    to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchangeCode ? ("boerse-" + exchangeCode) : "") }}>
                    <ModalContent instrument={instrument} instrumentGroup={props.instrumentGroup}/>
                </Link>
            }
        </>
    );
}

function ModalContent(props: {instrument: Instrument, instrumentGroup: InstrumentGroup}){
    const pathParam = useParams<{ section: string, seoTag: string }>();
    const exchangeCode: string | undefined = props.instrument.exchange.code || undefined;
    const location = useLocation();
    let [state, setState] = useState<QuoteHistoryState>({ openMobileFilter: false, instrument: props.instrument });
    let { loading, data } = useQuery<Query>(
        loader('./getInstrumentQuoteHistoryInfo.graphql'),
        {
            variables: {
                instrumentId: state.instrument?.id,
                from: moment().subtract(31, 'days').format('YYYY-MM-DD'),
                to: moment().subtract(1, 'days').format('YYYY-MM-DD')
            },
            skip: location.hash !== "#historie" || !state.instrument
        }
    );
    let quoteInformation = (data?.instrument?.quoteHistory?.edges || [])
    .map(current => mapQuoteHistory(current.node))
    .sort((a: QuoteInformation, b: QuoteInformation) => a.when.isBefore(b.when) ? 1 : -1);
    return(
        <Modal onClick={(e: any) => e.stopPropagation()} show={true} className="modal modal-dialog-sky-placement" aria-labelledby="historyModal" aria-hidden="true">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="row row-cols-1 mb-n1">
                                    <div className="col d-flex justify-content-between ml-n3 pl-2 ml-md-0 pl-md-0">
                                        <h5 className="modal-title" id="">Historische Kurse</h5>
                                        <Link className="mr-n2 text-nowrap"
                                            onClick={() => setState({ ...state, instrument: props.instrumentGroup.content.filter((item: any) => item.main === true)[0] })}
                                            to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchangeCode ? ("boerse-" + exchangeCode) : "") }}>
                                            <span className="text-blue fs-14px" data-dismiss="modal" aria-label="Schliessen">
                                                <span>schließen</span>
                                                <span className="close-modal-butt svg-icon">
                                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} alt="" width="27" />
                                                </span>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <InstrumentModalHeader className={"ml-n3 pl-2 ml-md-0 pl-md-0"} modalsTitle={props.instrumentGroup} instrument={state.instrument} />
                            </div>
                            <div className="modal-body modal-body-sm mobile-modal-body">
                                <section className="main-section">
                                    <div className="container">
                                        <div className="content-row">
                                            <div className="content-wrapper">
                                                {
                                                    state.openMobileFilter &&
                                                    <div className={"mobile-modal-filter overlay"}
                                                        onClick={() => { setState({ ...state, openMobileFilter: false }) }} />
                                                }

                                                <div className={"filters-holder mobile-modal-filter" + (state.openMobileFilter ? " show" : "")}>
                                                    <div className="index-mobile-filter-title"
                                                        onClick={() => setState({ ...state, openMobileFilter: false })}>
                                                        <h2>Filter</h2>
                                                        <span className="drop-arrow-image close-icon svg-icon top-move"><svg
                                                            xmlns="http://www.w3.org/2000/svg" id="Ebene_1" data-name="Ebene 1" width="28" height="28" viewBox="0 0 28 28"
                                                            className="svg-convert svg-black"><path id="Pfad_846" data-name="Pfad 846"
                                                                d="M15.11,14l4.66-4.65a.79.79,0,0,0-1.12-1.12L14,12.88,9.34,8.22a.79.79,0,0,0-1.12,0,.8.8,0,0,0,0,1.08L12.88,14,8.22,18.65a.79.79,0,0,0,1.12,1.12L14,15.11l4.65,4.66a.79.79,0,1,0,1.12-1.12Z"
                                                                fill="#383838"></path></svg></span></div>

                                                    <StockSelectDropdown
                                                        instrumentGroup={props.instrumentGroup}
                                                        selectedInstrument={state.instrument || props.instrumentGroup.content.filter((item: any) => item.main === true)[0]}
                                                        mobileClass={"mobile-modal-filter"}
                                                        onChange={
                                                            (i: Instrument) => {
                                                                trigInfonline(guessInfonlineSection(), 'historische_kurse')
                                                                setState({
                                                                    ...state,
                                                                    instrument: i,
                                                                    openMobileFilter: false
                                                                })
                                                            }
                                                        }
                                                    />

                                                </div>

                                                <div className="filters-holder-mobile ml-1">
                                                    <button className="btn btn-primary mr-sm-auto ml-sm-1" type="button"
                                                        onClick={() => { setState({ ...state, openMobileFilter: true }) }}>
                                                        <span className="svg-icon">
                                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_filter_dark.svg"} alt="" className="svg-convert svg-white" />
                                                        </span>
                                                        <span>Filter</span>
                                                    </button>

                                                    <div className="modal bottom fade" aria-hidden="true" data-backdrop="static" inner-modal>
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h5 className="modal-title" id="">Ergebnisse filtern</h5>
                                                                    <button type="button" className="close text-blue" data-dismiss-modal="innerModal" aria-label="Close">
                                                                        <span>schließen</span>
                                                                        <span className="close-modal-butt svg-icon">
                                                                            <img src="/static/img/svg/icon_plus_borderless_dark.svg" alt="" className="svg-blue" />
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <div className="accordion" id="modalHistorischeKurseFilterAccordion">
                                                                        <div className="filter-row">
                                                                            <button className="btn btn-primary w-100" type="button" data-toggle="collapse"
                                                                                data-target="#modalMobileFilterDropBorsenplatz" aria-expanded="false"
                                                                                aria-controls="modalMobileFilterDropBorsenplatz">
                                                                                <div className="drop-legend">Börsenplatz</div>
                                                                                <div className="drop-selection">Xetra</div>
                                                                                <span className="drop-arrow-image open-icon svg-icon top-move">
                                                                                    <img src="/static/img/svg/icon_direction_down_dark.svg" className="svg-white"
                                                                                        alt="" />
                                                                                </span>
                                                                            </button>
                                                                            <div className="collapse" id="modalMobileFilterDropBorsenplatz"
                                                                                data-parent="#modalHistorischeKurseFilterAccordion">
                                                                                <div className="filter-selector">
                                                                                    <div className="drop-body with-scroll">
                                                                                        <div className="body-row d-flex justify-content-between">
                                                                                            <div className="selection-name text-blue">
                                                                                                <span>&amp;nbsp;</span>
                                                                                                Lang &amp; Schwarz
                                                                                            </div>
                                                                                            <div className="bors-value">1.2Mio</div>
                                                                                        </div>
                                                                                        <div className="body-row d-flex justify-content-between">
                                                                                            <div className="selection-name text-blue">
                                                                                                <span>&amp;nbsp;</span>
                                                                                                Xetra
                                                                                            </div>
                                                                                            <div className="bors-value">1.2Mio</div>
                                                                                        </div>
                                                                                        <div className="body-row d-flex justify-content-between">
                                                                                            <div className="selection-name text-blue">
                                                                                                <span>&amp;nbsp;</span>
                                                                                                Quotrix
                                                                                            </div>
                                                                                            <div className="bors-value">1.2Mio</div>
                                                                                        </div>
                                                                                        <div className="body-row d-flex justify-content-between">
                                                                                            <div className="selection-name text-blue">
                                                                                                <span>&amp;nbsp;</span>
                                                                                                Tradegate
                                                                                            </div>
                                                                                            <div className="bors-value">1.2Mio</div>
                                                                                        </div>
                                                                                        <div className="body-row d-flex justify-content-between">
                                                                                            <div className="selection-name text-blue">
                                                                                                <span>&amp;nbsp;</span>
                                                                                                Stuttgart
                                                                                            </div>
                                                                                            <div className="bors-value">1.2Mio</div>
                                                                                        </div>
                                                                                        <div className="body-row d-flex justify-content-between">
                                                                                            <div className="selection-name text-blue">
                                                                                                <span>&amp;nbsp;</span>
                                                                                                Frankfurt
                                                                                            </div>
                                                                                            <div className="bors-value">1.2Mio</div>
                                                                                        </div>
                                                                                        <div className="body-row d-flex justify-content-between">
                                                                                            <div className="selection-name text-blue">
                                                                                                <span>&amp;nbsp;</span>
                                                                                                Gettex
                                                                                            </div>
                                                                                            <div className="bors-value">1.2Mio</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {loading ? <div className="text-center py-2"><Spinner animation="border" /></div> :
                                                    data?.instrument?.quoteHistory ? <QuoteHistoryTable quotes={quoteInformation} currencyCode={data?.instrument?.currency?.displayCode || ""} assetGroup={props.instrumentGroup.assetGroup || undefined}/> : <></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </Modal>
    )
}

export interface QuoteHistoryProps {
    instrumentGroup: InstrumentGroup;
    className?: any;
}

export interface QuoteHistoryState {
    openMobileFilter: boolean;
    instrument?: Instrument;
}
