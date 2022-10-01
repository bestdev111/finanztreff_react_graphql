import {InstrumentGroup, InstrumentGroupExchangeTradedFund} from "../../../generated/graphql";
import moment from "moment";
import {Col} from "react-bootstrap";
import {formatDate, gcd, shortNumberFormat} from "../../../utils";

export function EtfFeaturesSection(props: { etf: InstrumentGroupExchangeTradedFund, group: InstrumentGroup }) {
    let years = props.etf.foundationDate && moment().diff(moment(props.etf.foundationDate), 'years') || "--";
    return (
        <>
            <div className="content-wrapper col">
                <div className="content">
                    <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-sm-2 gutter-10 gutter-tablet-8">
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Sektor</div>
                                <div className="font-weight-bold">
                                    { props.etf.sector?.name || "--" }
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Ausschüttungsart</div>
                                <div className="font-weight-bold">
                                    {props.etf.distributing !== null ?
                                        (props.etf.distributing === true ? "Ausschüttend" : "Thesaurierend")
                                            : "--"}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">ETF-Art</div>
                                <div className="font-weight-bold"> {props.group.assetType?.name || "--"} </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Ausschüttungsinterval</div>
                                <div className="font-weight-bold"> -- </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Auflage</div>
                                <div className="font-weight-bold"> { props.etf.foundationDate && formatDate(props.etf.foundationDate) || "--"} </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Fondsvolumen</div>
                                <div className="font-weight-bold">
                                    {
                                        props.etf.investmentVolume && props.etf.investmentVolume.value ?
                                            `${shortNumberFormat(props.etf.investmentVolume.value)} ${props.etf.investmentVolume.currency?.displayCode || ""}` : "--"
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Fondsalter</div>
                                <div className="font-weight-bold">{years} {years === 1 ? "Jahr" : "Jahre"}</div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Indexart</div>
                                <div className="font-weight-bold"> {props.etf.benchmark?.group?.assetType?.name || "--"} </div>
                            </div>
                        </Col>

                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Replikation</div>
                                <div className="font-weight-bold">
                                    {  props.etf.replication?.name || "--" }
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Abbildungsverhältnis</div>
                                <div className="font-weight-bold">
                                    { props.etf.underlyingRatio || "--" }
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Partizipation am Index</div>
                                <div className="font-weight-bold">
                                    { props.etf.participationFactor && formatParticipation(props.etf.participationFactor) || "--" }
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">ETF-Typ</div>
                                <div className="font-weight-bold">
                                    { props.etf.position || "--" }
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Index-Währung</div>
                                <div className="font-weight-bold"> {props.etf.benchmark?.group?.main?.currency.displayCode || "--"}</div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Fremdwährungsrisiko</div>
                                <div className="font-weight-bold">
                                    {
                                        props.etf.quanto !== null ?
                                            (props.etf.quanto === true ? "Ja" : "Nein") : "--"
                                    }
                                </div>
                            </div>
                        </Col>


                    </div>
                </div>
            </div>
        </>
    );
}

function formatParticipation(factor: number) {
    let f = gcd(factor * 100, 100);
    return (factor * 100 / f) + ":" +(100/f)
}

