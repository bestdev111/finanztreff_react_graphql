import { Button, Modal, Spinner } from "react-bootstrap";
import { AssetGroup, Instrument, InstrumentGroup, InstrumentTimeAndSales, Query } from "../../../../generated/graphql";
import moment, { Moment } from 'moment';
import { Component, useState } from "react";
import { InstrumentModalHeader } from "../common";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { formatDate, formatPrice, formatTime, numberFormatDecimals, shortNumberFormat } from "../../../../utils";
import SvgImage from "../../image/SvgImage";
import { StockSelectDropdown } from "../../stock-select-dropdown";
import { PeriodSelectDropdown } from "../../period-select-dropdown";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAssetForUrl } from "components/profile/utils";
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";

class TimesAndSalesTable extends Component<TimesAndSalesTableProps & InstrumentTimeAndSales, any> {
    render() {
        return (
            <table className="table light-table text-center custom-border last-with-border hide-mobile" id="modal-time-sales-table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col" style={{ "width": "100" }} className="text-left d-md-table-cell d-none">
                            <div>Datum</div>
                        </th>
                        <th scope="col" style={{ "width": "150" }} className="text-left d-md-table-cell d-none">
                            <div>Uhrzeit</div>
                        </th>
                        <th scope="col" className="text-left d-md-table-cell d-none">
                            <div>Kurs</div>
                        </th>
                        <th scope="col" className="text-center d-md-table-cell d-none">
                            <div>Volumen</div>
                        </th>
                        <th scope={"col"} className={"text-left d-table-cell d-md-none pl-2"}>
                            <span>Datum</span>
                        </th>
                        <th scope={"col"} className={"text-right d-table-cell d-md-none"}>
                            <span>Uhrzeit</span>
                        </th>
                        <th scope={"col"} className={"text-right d-table-cell d-md-none"}>
                            <span><span>Kurs</span><br /><span>Volumen</span></span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.entries.map(current =>
                            <tr className={"font-size-15px"}>
                                <td className="text-left d-md-table-cell d-none">
                                    <span>{formatDate(current.when)}</span>
                                </td>
                                <td className="text-left d-md-table-cell d-none">{formatTime(current.when)}</td>
                                <td className="text-left d-md-table-cell d-none">
                                    <div className="font-weight-bold">
                                        <span className="kurs-info">{formatPrice(current.lastPrice, this.props.assetGroup)}</span>
                                        {current.change ?
                                            <span className="svg-icon move-arrow">
                                                {current.change > 0 ?
                                                    <img className={"px-1"} src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt="" /> :
                                                    <img className={"px-1"} src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt="" />
                                                }
                                            </span> :
                                            <></>
                                        }
                                    </div>
                                </td>
                                <td className="text-center d-md-table-cell d-none">
                                    <span>{shortNumberFormat(current.cumulativeVolume)}</span>
                                </td>
                                {/* Mobile */}
                                <td className={"text-left d-table-cell d-md-none pl-2"}>
                                    <br/><span>{formatDate(current.when)}</span>
                                </td>
                                <td className={"text-right d-table-cell d-md-none"}>
                                    <span>
                                        <br />
                                        {formatTime(current.when)}
                                    </span>
                                </td>
                                <td className={"text-right d-table-cell d-md-none"}>
                                    <span>
                                        <span>{formatPrice(current.lastPrice, this.props.assetGroup)}</span>
                                        <br />
                                        <span>{shortNumberFormat(current.cumulativeVolume)}</span>
                                    </span>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        );
    }
}

interface TimesAndSalesTableProps {
    entries: TimesAndSalesEntry[];
    assetGroup?: AssetGroup;
}

interface TimesAndSalesEntry {
    when: moment.Moment;
    change?: number | null;
    lastPrice: number;
    cumulativeVolume?: number | null;
    cumulativeTurnOver?: number | null;
    cumulativeTrades?: number | null;
}

function mapTimeAndSales(entry?: InstrumentTimeAndSales | null): TimesAndSalesEntry {
    return {
        when: moment(entry?.when),
        change: (entry && entry.lastPrice && entry.lastPrice && (entry.lastPrice - entry.lastPrice)) || null,
        lastPrice: entry?.lastPrice || 0,
        cumulativeVolume: entry?.volume
    };
}

export const TimesAndSales = (props: TimesAndSalesProps) => {
    const pathParam = useParams<{ section: string, seoTag: string }>();
    const location = useLocation();
    let instrument = props.instrumentGroup.content.find(current => current.id === location.state) || props.instrumentGroup.content.filter((item: any) => item.main === true)[0];
    const exchangeCode: string | undefined = props.instrumentGroup.content.find(current => current.id === location.state)?.exchange.code || undefined;
    
    return (
        <>
            {location.hash === "#times" &&
                <Link className="fade modal-backdrop"
                    to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchangeCode ? ("boerse-" + exchangeCode) : "") }}>
                    <ModalContent instrument={instrument} instrumentGroup={props.instrumentGroup}/>
                </Link>
            }
        </>
    );
}

function ModalContent(props: {instrumentGroup: InstrumentGroup, instrument: Instrument}) {
    const pathParam = useParams<{ section: string, seoTag: string }>();
    const exchangeCode: string | undefined = props.instrument.exchange.code || undefined;
    const location = useLocation();
    let [state, setState] = useState<TimesAndSalesState>({
        instrument: props.instrument,
        from: moment().subtract(15, 'minutes').subtract(props.instrument?.snapQuote?.delay ? props.instrument?.snapQuote?.delay : 0, 'seconds'),
        to: moment(),
        openMobileFilter: false,
    });
    const [fromTime,setFromTime] =  useState(moment().subtract(15, 'minutes').subtract(props.instrument?.snapQuote?.delay ? props.instrument?.snapQuote?.delay : 0, 'seconds'))
    let { loading, data , fetchMore } = useQuery<Query>(
        loader('./getTimeAndSales.graphql'),
        { variables: { instrumentId: state?.instrument?.id, from: state.from.format(), to: state.to.format() }, skip: location.hash !== "#times" || !state?.instrument?.id || !state.to || !state.from }
    );
    function loadMoreData() {
        if (data?.instrument?.timeAndSales?.pageInfo?.hasNextPage && data?.instrument?.timeAndSales?.pageInfo?.endCursor) {
            const date = moment(data?.instrument?.timeAndSales?.pageInfo?.endCursor)
            setState({...state,from:date})
            if (fetchMore ) {
                fetchMore({
                    variables: {
                        instrumentId: state?.instrument?.id,
                        from: date.format(),
                        to: state.to.format(),
                    }})
            }
        }
    }
    let entries: TimesAndSalesEntry[] = (data?.instrument?.timeAndSales.edges || [])
        .map(current => mapTimeAndSales(current.node))
        .sort((a: TimesAndSalesEntry, b: TimesAndSalesEntry) => a.when.isBefore(b.when) ? 1 : -1);
    return (
        <Modal onClick={(e: any) => e.stopPropagation()} show={location.hash === "#times"} onHide={location.hash !== "#times"} className="modal modal-dialog-sky-placement" id="timesSalesModal" aria-labelledby="timesSalesModal"
            aria-hidden="true">
            <div className="modal-content text-nowrap">
                <div className="modal-header">
                    <div className="row row-cols-1 mb-n1">
                        <div className="col d-flex justify-content-between ml-n3 pl-2 pl-md-0 ml-md-0">
                            <h5 className="modal-title" id="">Times &amp; Sales</h5>
                            <Link className="mr-n2 text-nowrap" to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchangeCode ? ("boerse-" + exchangeCode) : "") }}
                                onClick={() => setState({ ...state, instrument: props.instrumentGroup.content.filter((item: any) => item.main === true)[0] })}>
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
                <div className="modal-body mobile-modal-body">
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
                                            onChange={(i: Instrument) => {
                                                trigInfonline(guessInfonlineSection(), 'times_sales')
                                                setState({ ...state, instrument: i });
                                            }}
                                            mobileClass={"mobile-modal-filter"}
                                        />

                                        <PeriodSelectDropdown
                                            from={fromTime}
                                            to={state.to}
                                            onChange={
                                                (from: Moment, to: Moment) => {
                                                    trigInfonline(guessInfonlineSection(), 'times_sales')
                                                    setState({ ...state, from: from, to: to });
                                                    setFromTime(from)
                                                }
                                            }
                                            mobileClass={"mobile-modal-filter"}
                                        />

                                    </div>


                                    <div className="filters-holder-mobile ml-1">
                                        <button className="btn btn-primary mr-sm-auto ml-sm-1" type="button"
                                            onClick={() => { setState({ ...state, openMobileFilter: true }) }}>
                                            <span className="svg-icon"><img src="/static/img/svg/icon_filter_dark.svg" alt=""
                                                className="svg-convert svg-white" /></span><span>Filter</span>
                                        </button>
                                    </div>


                                    {loading ?
                                        <div className="text-center py-2"><Spinner animation="border" /></div> :
                                        <>
                                            <TimesAndSalesTable entries={entries} assetGroup={props.instrumentGroup.assetGroup || undefined}/>
                                            <div className="col-md-4 offset-md-4 col-12">
                                                <div className="text-center">
                                                    {!data ||
                                                        data?.instrument?.timeAndSales?.edges.length === 0 ||
                                                        data?.instrument?.timeAndSales?.pageInfo?.hasNextPage === false
                                                        ? <></>
                                                        :
                                                        <Button variant="link" onClick={() => loadMoreData()} >
                                                            Mehr anzeigen
                                                            <SvgImage spanClass="top-move" convert={false}
                                                                icon="icon_direction_down_dark.svg"
                                                                imgClass="svg-primary" />
                                                        </Button>
                                                    }

                                                </div>
                                            </div>
                                        </>
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

export interface TimesAndSalesProps {
    instrumentGroup: InstrumentGroup;
    className?: any;
}

export interface TimesAndSalesState {
    instrument?: Instrument;
    from: moment.Moment;
    to: moment.Moment;
    openMobileFilter: boolean;
}
