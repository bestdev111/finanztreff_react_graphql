import { DerivativeOptionType, Instrument, InstrumentGroup, Query, QuoteType } from "generated/graphql";
import { ShareAnalysesAdvertisementComponent } from "./ShareAnalysesAdvertisementComponent";
import { ShareAnalysesReportView } from "./ShareAnalysesReportView";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { Col, Row, Spinner } from "react-bootstrap";
import { GET_BEST_WARRANT } from "graphql/query";
import Product from "components/Assets/Derivatives/components/Product";
import moment from "moment";

function getExpectedChangePct(group: InstrumentGroup, data: Query | undefined): number {
    if (!data) {
        return 0;
    }

    const price: number = group.content.filter(item => item.main === true)[0].snapQuote?.lastPrice || 0;
    const analysisPrice: number = data?.group?.analysisReport?.price || 0;
    const expectedChangePct = price > 0 ? (analysisPrice - price) * 100 / price : 0;

    return expectedChangePct;
}

function getIsin(group: InstrumentGroup) {
    return group.content.filter(item => item.main === true)[0].isin
}

export const ShareAnalysesReportComponent = (props: ShareAnalyseComponentProps) => {

    const { data, loading } = useQuery<Query>(loader('./getShareAnalysesReport.graphql'), { variables: { groupId: props.instrumentGroup.id } });

    let { loading: loadingOS, data: dataOS } = useQuery<Query>(
        GET_BEST_WARRANT,
        { variables: { underlyingIsin: getIsin(props.instrumentGroup), pctChange: getExpectedChangePct(props.instrumentGroup, data), months: 12 }, skip: loading || !data }
    );

    if (!data || data?.group?.analysisReport?.targets?.length === 0) {
        return <></>
    } else {
        if (loading) return (<div className="text-center py-2"><Spinner animation="border" /></div>);
        else {
            return (
                <section className="main-section">
                    <div className="container">
                        <Row>
                            <Col xl={9} sm={12} className="pr-xl-28px">
                                <ShareAnalysesReportView group={props.instrumentGroup} data={data} />
                            </Col>
                            <Col xl={3} sm={12} className="pl-xl-0 pl-xl-1 ml-xl-n3 pr-xl-0">
                                {/*
                                <div className="coming-soon-component mt-3 share-analyses-report-section">
                                    <span className="text-white fs-18px coming-soon-text w-100 d-flex justify-content-center ">Coming soon...</span>
                                </div>
                                */}
                                <div className="content-wrapper">
                                    <h3 className="content-wrapper-heading font-weight-medium">An {props.instrumentGroup.name} partizipieren</h3>
                                    <div className="content">
                                        {loadingOS ? <Spinner animation="border"></Spinner> :
                                            dataOS && dataOS.bestWarrantRnd && dataOS.bestWarrantRnd.instrument && <BestWarrantCard issuerName={dataOS?.bestWarrantRnd?.issuerName || ""} instrument={dataOS?.bestWarrantRnd?.instrument} />
                                        }
                                        { /* !loadingOS && dataOS && <ShareAnalysesAdvertisementComponent data={dataOS}/> */}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>
            );
        }
    }
}

interface ShareAnalyseComponentProps {
    instrumentGroup: InstrumentGroup;
}

function BestWarrantCard(props: { issuerName: string, instrument?: Instrument }) {

    let derivativeType = props.instrument && props.instrument.group && props.instrument.group.derivative && props.instrument.group.derivative.optionType === DerivativeOptionType.Call ? "Call" : "Put";
    let askQuote = props.instrument && props.instrument.snapQuote && props.instrument.snapQuote.quotes.filter(quote => quote?.type === QuoteType.Ask)[0];
    let bidQuote = props.instrument && props.instrument.snapQuote && props.instrument.snapQuote.quotes.filter(quote => quote?.type === QuoteType.Bid)[0];
    let underlying = props.instrument?.group.underlyings && props.instrument?.group.underlyings[0];
    let maturityDate = moment(props.instrument?.group?.derivative?.maturityDate);
    let dueTo = maturityDate.diff(moment(), 'd') + 1;
    let startDate = props.instrument?.group?.derivative?.issueDate;
    let start = Math.abs(moment(startDate).diff(moment(), 'd') + 1);
    let pieChartValue = dueTo / (start + dueTo) * 100;

    return (
        <Product tage={dueTo + (dueTo === 1 ? " Tag" : " Tage")}
            issuer={props.instrument?.group.issuer}
            title={derivativeType} headingColor={derivativeType === "Call" ? "bg-green" : "bg-pink"}
            gearing={props.instrument?.keyFigures?.gearing || 0}
            bidQuote={bidQuote || undefined}
            askQuote={askQuote || undefined}
            strike={underlying && underlying.strike || 0} strikeCurrency={underlying && underlying.currency?.displayCode || ""}
            wknValue={props.instrument?.wkn || ""} pieChartValue={pieChartValue} pieChartColor={derivativeType === "Call" ? "#18C48F" : "#ff4d7d"}
            instrument={props.instrument}
        />
    );
}