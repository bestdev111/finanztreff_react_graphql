import { Col, Container, Row, Spinner } from "react-bootstrap";
import classNames from "classnames";
import { InstrumentGroup, Query } from "graphql/types";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import './PortfolioOverviewInPortraitComponent.scss';
import { numberFormat, numberFormatDecimals } from "utils";
import { useKeycloak } from "@react-keycloak/web";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { ContactSupportAndScrollSection } from "components/layout/FeedbackAndScrollToTop/ContactSupportAndScrollSection";

interface PortfolioOverviewInPortraitComponentProps {
    instrumentGroup: InstrumentGroup;
    className?: string;
}
export const PortfolioOverviewInPortraitComponent = (props: PortfolioOverviewInPortraitComponentProps) => {

    let { initialized, keycloak } = useKeycloak();
    const loggedIn: boolean = (keycloak && !!keycloak.authenticated);

    let { loading, data } = useQuery<Query>(
        loader('./getInstrumentGroupIncluded.graphql'),
        { variables: { instrumentGroupId: props.instrumentGroup.id, days: 7 }, skip: !loggedIn },
    )

    if (loading) {
        return <div className="text-center py-2"><Spinner animation="border" /></div>
    }

    if (data || !loggedIn) {

        const purchases = data ? [0, ...data.instrumentGroupTrades.map(current => current && current.buy && current.quantity || 0)].reduce((a, b) => a + b) : 0;
        const sales = data ? [0, ...data.instrumentGroupTrades.map(current => current && !current.buy && current.quantity || 0)].reduce((a, b) => a + b) : 0;
        const buyTrades = data ? data.instrumentGroupTrades.map(current => current && current.buy && current.price ? current.price : 0).filter(current => current > 0) : [];
        const sellTrades = data ? data.instrumentGroupTrades.map(current => current && !current.buy && current.price ? current.price : 0).filter(current => current > 0) : [];
        const avaragePurchasePrice = buyTrades.length > 0 ? buyTrades.reduce((a, b) => a + b) / buyTrades.length : 0;
        const avarageSalesPrice = sellTrades.length > 0 ? sellTrades.reduce((a, b) => a + b) / sellTrades.length : 0;
        const portfolioPercent = (data && data.instrumentGroupIncluded.totalPortfolios > 0) ? data.instrumentGroupIncluded.portfolios * 100 / data.instrumentGroupIncluded.totalPortfolios : 0.001;//65.3;
        const watchlistPercent = (data && data.instrumentGroupIncluded.totalWatchlists > 0) ? data.instrumentGroupIncluded.watchlists * 100 / data.instrumentGroupIncluded.totalWatchlists : 0.001;//15.24;
        const upperLimits = data?.instrumentGroupIncluded.limitsUpper || 0;
        const downLimits = data?.instrumentGroupIncluded.limitsLower || 0;

        return (
            <Container className={classNames(props.className, "bg-dark-blue px-xl-3 px-lg-2 px-md-2 px-sm-2 py-2 mt-3")} >
                <div className="fs-18px roboto-heading text-white">
                    So handeln finanztreff.de Nutzer {props.instrumentGroup.name}
                </div>
                <Row className="">
                    <Col className="col-xl-5 col-lg-5 d-xl-block d-lg-block d-md-flex d-sm-flex">
                        <Row className="justify-content-center mt-xl-4 mt-lg-4 py-2 px-sm-3">
                            {loggedIn ?
                                purchases > 0 ?
                                    <div className="fs-18px text-white bg-green text-center button-purchase-width padding-top-6px">
                                        {purchases <= 1000000000 ? numberFormatDecimals(purchases, 0) : "> 1 Mrd."} Zukäufe
                                    </div>
                                    :
                                    <span className="text-white bg-green fs-16px pt-2 text-center align-center button-purchase-width">Keine Zukäufe</span>
                                :
                                <div className="fs-18px text-white bg-green text-center button-purchase-width padding-top-6px">
                                    <span className="blur-text-6px">{numberFormatDecimals(35, 0)}</span> Zukäufe
                                </div>
                            }
                        </Row>
                        <Row className="justify-content-center mb-xl-4 mb-lg-4 py-2 pl-xl-0 pl-lg-0 pl-md-0 pl-sm-4 ml-xl-n3 ml-lg-n3 ml-sm-n3">
                            {loggedIn ?
                                sales > 0 ?
                                    <div className="fs-18px text-white bg-pink text-center button-purchase-width padding-top-6px">
                                        {sales < 1000000000 ? numberFormatDecimals(sales, 0) : "> 1 Mrd."} Verkäufe
                                    </div>
                                    :
                                    <span className="text-white bg-pink fs-16px pt-2 text-center button-purchase-width">Keine Verkäufe</span>
                                :
                                <div className="fs-18px text-white bg-pink text-center button-purchase-width padding-top-6px">
                                    <span className="blur-text-6px">{numberFormatDecimals(25, 0)}</span> Verkäufe
                                </div>
                            }
                        </Row>
                        <Row className="justify-content-center text-white mb-3 d-xl-flex d-lg-flex d-md-none d-sm-none">
                            <span>in Portfolios in den letzten 7 Tagen.</span>
                            {(purchases > 0) && loggedIn &&
                                <span className="mt-n1">Durchschnittlicher Zukaufskurs: {numberFormat(avaragePurchasePrice)} EUR</span>
                            }
                            {(sales > 0) && loggedIn &&
                                <span className="mt-n1">Durchschnittlicher Verkaufskurs: {numberFormat(avarageSalesPrice)} EUR</span>
                            }
                        </Row>
                    </Col>
                    <Col className="col-sm-12 d-xl-none d-lg-none d-md-none d-sm-block text-center text-white">
                        <span>in Portfolios in den letzten 7 Tagen.</span>
                        {(purchases > 0) && loggedIn &&
                            <span className="mt-n1">Durchschnittlicher Zukaufskurs: {numberFormat(avaragePurchasePrice)} EUR</span>
                        }
                        {(sales > 0) && loggedIn &&
                            <span className="mt-n1">Durchschnittlicher Verkaufskurs: {numberFormat(avarageSalesPrice)} EUR</span>
                        }
                    </Col>
                    <Col className="col-xl-7 col-lg-7" >
                        <Row className="mb-n5 text-white">
                            <Col className={classNames("col-xl-3 col-lg-3 col-md-3 col-sm-4",
                                portfolioPercent > 0 ? "mr-xl-n5 mr-lg-0 mr-md-0 mr-sm-2 ml-xl-0 ml-lg-0 ml-sm-n3" : "mr-xl-n4 mr-lg-n2 mr-md-n2 mr-sm-n4 ml-xl-0 ml-lg-0 ml-sm-n3")}>
                                <div className="range-chart-donut">
                                    <RangeChartDonut value={portfolioPercent} />
                                </div>
                                <img style={{ position: "relative", bottom: "64px", left: "32px", }} width="27"
                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_portfolio_filled_white.svg"}
                                    alt="" className="portfolio-butt-icon" />
                            </Col>
                            <Col className="mt-4 col-xl-9 col-lg-9 col-md-9 col-sm-8">
                                {loggedIn ?
                                    portfolioPercent > 0 ?
                                        <Row className="align-items-center mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 ml-xl-n4 ml-lg-n5 ml-md-n5 ml-sm-n5 pl-lg-2">
                                            <Col className={classNames("font-weight-bold col-xl-3 col-sm-12 pr-0 text-center-xl text-left-lg pl-xl-3 pl-lg-3 pl-md-3 pl-sm-0")} style={{ fontSize: '27px' }} >{numberFormat(portfolioPercent, "%")}</Col>
                                            <Col className="fs-14px col-xl-9 col-sm-12 mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 pl-xl-3 pl-lg-3 pl-md-3 pl-sm-0">haben diesen Wert in Ihrem <b>Portfolio</b></Col>
                                        </Row>
                                        :
                                        <Row className="fs-14px pt-1 mt-md-2 mt-sm-0 ml-xl-n4" style={{ lineHeight: "1.2" }}><span className="pr-1">Noch niemand hat diesen Wert im </span><b> Portfolio</b></Row>
                                    :
                                    <Row className="align-items-center mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 ml-xl-n4 ml-lg-n5 ml-md-n5 ml-sm-n5 pl-lg-2">
                                        <Col className={classNames("font-weight-bold col-xl-3 col-sm-12 pr-0 text-center-xl text-left-lg pl-xl-3 pl-lg-3 pl-md-3 pl-sm-0 blur-text-6px")} style={{ fontSize: '27px' }} >{numberFormat(25.25, "%")}</Col>
                                        <Col className="fs-14px col-xl-9 col-sm-12 mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 pl-xl-3 pl-lg-3 pl-md-3 pl-sm-0">haben diesen Wert in Ihrem <b>Portfolio</b></Col>
                                    </Row>
                                }
                            </Col>
                        </Row>
                        <Row className="mb-n5 text-white">
                            <Col className={classNames("col-xl-3 col-lg-3 col-md-3 col-sm-4",
                                watchlistPercent > 0 ? "mr-xl-n5 mr-lg-0 mr-md-0 mr-sm-2 ml-xl-0 ml-lg-0 ml-sm-n3" : "mr-xl-n4 mr-lg-n2 mr-md-n2 mr-sm-n4 ml-xl-0 ml-lg-0 ml-sm-n3")}>
                                <div className="range-chart-donut">
                                    <RangeChartDonut value={watchlistPercent} />
                                </div>
                                <img style={{ position: "relative", bottom: "64px", left: "33px", }} width="27"
                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_watchlist_filled_white.svg"}
                                    alt="" className="portfolio-butt-icon" />
                            </Col>
                            <Col className="mt-4 col-xl-9 col-lg-9 col-md-9 col-sm-8">
                                {loggedIn ?
                                    watchlistPercent > 0 ?
                                        <Row className="align-items-center mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 ml-xl-n4 ml-lg-n5 ml-md-n5 ml-sm-n5 pl-lg-2">
                                            <Col className={classNames("font-weight-bold col-xl-3 col-sm-12 pr-0 text-center-xl text-left-lg pl-xl-3 pl-lg-3 pl-md-3 pl-sm-0")} style={{ fontSize: '27px' }} >
                                                {numberFormat(watchlistPercent, "%")}
                                            </Col>
                                            <Col className="fs-14px col-xl-9 col-sm-12 mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 pl-xl-3 pl-lg-3 pl-md-3 pl-sm-0">haben diesen Wert in Ihrer <b>Watchlist</b></Col>
                                        </Row>
                                        :
                                        <Row className="fs-14px pt-1 mt-md-2 mt-sm-0 ml-xl-n4" style={{ lineHeight: "1.2" }}><span className="pr-1">Noch niemand hat diesen Wert in der</span><b>Watchlist</b></Row>
                                    :
                                    <Row className="align-items-center mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 ml-xl-n4 ml-lg-n5 ml-md-n5 ml-sm-n5 pl-lg-2">
                                        <Col className={classNames("font-weight-bold col-xl-3 col-sm-12 pr-0 text-center-xl text-left-lg pl-xl-3 pl-lg-3 pl-md-3 pl-sm-0 blur-text-6px")} style={{ fontSize: '27px' }} >
                                            {numberFormat(65.75, "%")}
                                        </Col>
                                        <Col className="fs-14px col-xl-9 col-sm-12 mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 pl-xl-3 pl-lg-3 pl-md-3 pl-sm-0">haben diesen Wert in Ihrer <b>Watchlist</b></Col>
                                    </Row>
                                }
                            </Col>
                        </Row>
                        <Row className="mb-n5 text-white">
                            <Col className={classNames("col-xl-3 col-lg-3 col-md-3 col-sm-4",
                                upperLimits + downLimits > 0 ? "mr-xl-n5 mr-lg-0 mr-md-0 mr-sm-2 ml-xl-0 ml-lg-0 ml-sm-n3" : "mr-xl-n4 mr-lg-n2 mr-md-n2 mr-sm-n4 ml-xl-0 ml-lg-0 ml-sm-n3")}>
                                {loggedIn ?
                                    <div className="range-chart-donut">
                                        <RangeChartDonut upperLimits={upperLimits} downLimits={downLimits} />
                                    </div>
                                    :
                                    <div className="range-chart-donut">
                                        <RangeChartDonut value={0.001} />
                                    </div>
                                }
                                <img style={{ position: "relative", bottom: "64px", left: "35px", }} width="26"
                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_bell_filled_white.svg"}
                                    alt="" className="portfolio-butt-icon" />
                            </Col>
                            <Col className="mt-4 col-xl-9 col-lg-9 col-md-9 col-sm-8">
                                {loggedIn ?
                                    upperLimits + downLimits > 0 ?
                                        <Row className="align-items-center mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 ml-xl-n4 ml-lg-n5 ml-md-n5 ml-sm-n5 pl-lg-2">
                                            <Col className={classNames("font-weight-bold col-xl-3 col-sm-12 pr-0 text-center-xl text-left-lg pl-xl-3 pl-lg-3 pl-md-3 pl-sm-0")} style={{ fontSize: '27px' }} >{upperLimits + downLimits}</Col>
                                            <Col className="fs-14px col-xl-9 col-sm-12 mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 pl-xl-3 pl-lg-3 pl-md-3 pl-sm-0"><b>Aktive Limits</b> auf diesen Wert</Col>
                                        </Row>
                                        :
                                        <Row className="fs-14px pt-1 mt-md-2 mt-sm-0 ml-xl-n4" style={{ lineHeight: "1.2" }}><span className="pr-1">Noch niemand hat</span> <span className="font-weight-bold pr-1">aktive Limits</span> auf diesen Wert</Row>
                                    :
                                    <Row className="align-items-center mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 ml-xl-n4 ml-lg-n5 ml-md-n5 ml-sm-n5 pl-md-3 pl-sm-2">
                                        <Col className={classNames("font-weight-bold col-xl-3 col-sm-12 pr-0 text-center-xl text-left-lg pl-md-3 pl-sm-4 blur-text-6px")} style={{ fontSize: '27px' }} >25</Col>
                                        <Col className="fs-14px col-xl-9 col-sm-12 mt-xl-0 mt-lg-n2 mt-md-n2 mt-sm-n2 pl-xl-3 pl-lg-3 pl-md-3 pl-sm-4"><b>Aktive Limits</b> auf diesen Wert</Col>
                                    </Row>
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {(portfolioPercent + watchlistPercent + downLimits + upperLimits) === 0 && loggedIn &&
                    <Row className="px-3 pb-2 pt-4">
                        <Col className="roboto-heading fs-18-21-21 bg-white text-dark-blue col-sm-12 px-3 py-1 align-center text-nowrap d-flex">
                            <ProfileInstrumentAddPopup
                                instrumentId={props.instrumentGroup.main?.id || 0}
                                instrumentGroupId={props.instrumentGroup.id || 0}
                                name={props.instrumentGroup.name}
                                className="p-0 mr-n1"
                                watchlist={true} portfolio={true}>
                                <img width="24" className="ml-n2 mr-2 mt-n1"
                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_plus_blue.svg"}
                                    alt="" />
                            </ProfileInstrumentAddPopup>
                            Seien Sie der erste der diesen Wert aufnimmt!
                        </Col>
                    </Row>
                }
                {!loggedIn &&
                    <Row className="px-3 pb-xl-2 pb-lg-0 pt-4">
                        <Col className="bg-white text-dark-blue col-sm-12 px-3 py-xl-1 py-lg-1 py-md-1 py-sm-2 align-center">
                            <Row className="px-xl-3 px-lg-2 px-md-2 px-sm-2 align-items-center cursor-pointer" onClick={() => keycloak.login()}>
                                <Col className="col-xl-8 col-lg-8 col-md-7 col-sm-12 pr-0">
                                    <Row className="roboto-heading fs-20-21-22">Angemeldete Nutzer sehen mehr!</Row>
                                    <Row className="roboto-heading fs-14px pr-2 pb-2" style={{ lineHeight: "1.2" }}>Wie handeln andere Nutzer von finanztreff.de diesen und andere Werte? Als registrierter Nutzer sehen Sie die wichtigsten Trends vor allen anderen!</Row>
                                </Col>
                                <Col className="col-xl-3 col-lg-3 col-md-4 col-sm-9 text-right-xl text-left-sm pr-3 pl-xl-5 pl-lg-5 pl-md-5 pl-sm-3 text-nowrap-sm cursor-pointer">
                                    <Row className="roboto-heading fs-18px line-height-1">Jetzt kostenlos registrieren!</Row>
                                </Col>
                                <Col className="col-sm-1 text-right pr-lg-0">
                                    <img width="66" className="ml-xl-n2 ml-lg-0 ml-md-n2 ml-sm-2 pr-xl-0 pr-lg-3 pr-md-3 mt-n1 img-width-66-40"
                                        src={process.env.PUBLIC_URL + "/static/img/svg/icon_user_blue_filled.svg"}
                                        alt="" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                }
            </Container>
        );
    }

    return (<></>);
}

export function RangeChartDonut({ value, upperLimits, downLimits }: { value?: number, upperLimits?: number, downLimits?: number }) {
    let width: number = 95;
    let height: number = 95;
    let options = {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        colors: ["#64A6EB", "black"],
        chart: {
            backgroundColor: "transparent",
            animation: false,
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            width, height,
        },
        title: "",
        credits: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,
                }
            },
            series: {
                states: {
                    inactive: {
                        opacity: 1
                    },
                    hover: {
                        enabled: false
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            innerSize: '80%',
            size: "85%",
            borderWidth: 0,
            data: [{
                name: "", y: value ? value : upperLimits, color: value ? "white" : "#18C48F",
                innerSize: '85%',
            },
            {
                name: "", y: value ? (100 - value) : downLimits, color: value ? "#64A6EB" : "#ff4d7d",
                innerSize: '85%',
            }]
        }, {
            type: 'pie',
            innerSize: '80%',
            size: '100%',
            borderWidth: 0,
            data: [{
                name: "", y: value ? value : upperLimits, color: value ? "white" : "#18C48F",
                innerSize: '85%',
            },
            {
                name: "", y: value ? (100 - value) : downLimits, color: value ? "transparent" : "#ff4d7d",
                innerSize: '85%',
            }]
        }, {
            type: 'pie',
            innerSize: '0%',
            size: '60%',
            borderWidth: 0,
            data: [{
                name: "", y: 100, color: "#383838",
                innerSize: '85%',
            }]
        }]
    }

    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            >
            </HighchartsReact>
        </>
    );
}
