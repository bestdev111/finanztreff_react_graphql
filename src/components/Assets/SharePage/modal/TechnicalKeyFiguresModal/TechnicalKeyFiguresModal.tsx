import { Col, Container, Modal, Row } from "react-bootstrap";
import { Instrument, InstrumentGroup } from "../../../../../generated/graphql";
import { TechnicalKeyFiguresCharts } from "./TechnicalKeyFiguresCharts";
import { TechnicalKeyFiguresSignals } from "./TechnicalKeyFiguresSignals";
import { TechnicalKeyFiguresContent } from "./TechnicalKeyFiguresContent";
import { guessInfonlineSection, trigInfonline } from "../../../../common/InfonlineService";
import { Link, useParams } from "react-router-dom";
import {
    extractQuotes,
    formatAssetGroup,
    formatPrice,
    getTextColorByValue,
    numberFormat,
    numberFormatWithSign,
    quoteFormat
} from "utils";
import classNames from "classnames";
import { getAssetForUrl } from "components/profile/utils";

export const TechnicalKeyFiguresModal = (props: TechnicalKeyFiguresModalProps) => {

    const instrument = props.instrument ? props.instrument : props.instrumentGroup.content.filter((item: any) => item.main === true)[0] || props.instrumentGroup.content[0];
    const { stats, indicators, performance } = instrument;
    const currencyCode = instrument.currency.displayCode || "";
    const exchange = instrument.exchange?.code ? instrument.exchange.code + '' : '';

    const pathParam = useParams<{ section: string, seoTag: string }>();

    let { trade, nav } = extractQuotes(instrument.snapQuote);
    return (
        <>
            <Link className="text-blue mr-4"
                to={"/" + getAssetForUrl(instrument.group.assetGroup || "") + "/technische-kennzahlen/" + pathParam.seoTag + "/"}
                onClick={() => trigInfonline(guessInfonlineSection(), 'technischeKennzahlen')}>
                Weitere technische Kennzahlen...
            </Link>
            {pathParam.section === "technische-kennzahlen" &&
                <Link className="fade modal-backdrop"
                    to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                    <Modal onClick={(e: any) => e.stopPropagation()} show={true} className="modal modal-dialog-sky-placement" aria-labelledby="timesSalesModal" aria-hidden="false">
                        <Container className="bg-white px-md-2 px-sm-1" style={{ boxShadow: " 0 0 3px 0 rgb(0 0 0 / 16%)" }}>
                            <Row className="justify-content-between align-items-center mt-md-2 mt-sm-0 text-nowrap">
                                <Col>
                                    <h5 className="roboto-heading d-lg-inline d-sm-none">Technische Kennzahlen {exchange ? "(" + exchange+ ")" : ""}</h5>
                                    <h5 className="roboto-heading d-lg-none d-sm-inline fs-14px">Technische Kennzahlen {exchange ? "(" + exchange+ ")" : ""}</h5>
                                </Col>
                                <Col className="text-right">
                                    <Link className="mr-n2 text-nowrap"
                                        to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                                        <span className="text-blue fs-14px" data-dismiss="modal" aria-label="Schliessen">
                                            <span>schließen</span>
                                            <span className="close-modal-butt svg-icon">
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} alt="" width="27" />
                                            </span>
                                        </span>
                                    </Link>
                                </Col>
                            </Row>
                            <Row className="mb-2 justify-content-between ">
                                <Col lg={6} xs={12}>
                                    {/* <InstrumentModalHeader className={""} modalsTitle={props.instrumentGroup} instrument={instrument} /> */}
                                    <span className={classNames("asset-type px-1 line-height-1 mr-2", formatAssetGroup(instrument.group.assetGroup).toLowerCase())}>{formatAssetGroup(instrument.group.assetGroup)}</span>
                                    <span className={classNames("asset-name font-weight-bold mr-2", formatAssetGroup(instrument.group.assetGroup).toLowerCase())}>{instrument.group.name}</span>
                                </Col>
                                <Col className="text-right">
                                    {trade && trade.value ?
                                        <span className="mr-2">{formatPrice(trade.value, instrument?.group?.assetGroup, instrument?.snapQuote?.quote?.value, instrument.currency.displayCode)}</span>
                                        :
                                        nav && nav.value &&
                                        <span className="mr-2">{formatPrice(nav.value, instrument?.group?.assetGroup, instrument?.snapQuote?.quote?.value, instrument.currency.displayCode)} </span>
                                    }
                                    {trade && trade.percentChange ?
                                        <span className={classNames("font-weight-bold mr-2", getTextColorByValue(trade.percentChange))}>
                                            {numberFormatWithSign(trade.percentChange, " %")}
                                        </span> :
                                        nav && nav.percentChange &&
                                        <span className={classNames("font-weight-bold mr-2", getTextColorByValue(nav.percentChange))}>
                                            {numberFormatWithSign(nav.percentChange, " %")}
                                        </span>
                                    }
                                    {instrument.exchange.name &&
                                        <span className="mr-2">{instrument.exchange.name}</span>
                                    }
                                    {trade && trade.when ?
                                        <span>{quoteFormat(trade.when, ' Uhr')}</span>
                                        :
                                        nav && nav.when &&
                                        <span>{quoteFormat(nav.when, ' Uhr')}</span>
                                    }
                                </Col>
                            </Row>
                        </Container>
                        <div className="modal-body mobile-modal-body">
                            <section className="main-section">
                                <Container>
                                    <div className="content-row">
                                        <div className="content-wrapper content-margin-sm">
                                            <div className="row">
                                                <div className="section-left-part col-xl-9 col-lg-12">
                                                    <TechnicalKeyFiguresContent
                                                        indicators={indicators || undefined}
                                                        yearStats={stats.find(current => current.period === 'WEEK52')}
                                                        allTime={stats.find(current => current.period === 'ALL_TIME')}
                                                        vola30={performance.find(current => current.period === 'MONTH1')?.vola || undefined}
                                                        currencyCode={currencyCode}
                                                    />
                                                    <TechnicalKeyFiguresCharts
                                                        performance={performance}
                                                    />
                                                </div>
                                                <div className="section-right-part col-xl col-lg-12">
                                                    <TechnicalKeyFiguresSignals instrumentGroup={props.instrumentGroup} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Container>
                            </section>
                        </div>
                    </Modal>
                </Link>
            }
        </>
    );

}

export interface TechnicalKeyFiguresModalProps {
    instrumentGroup: InstrumentGroup;
    instrument?: Instrument;
}
