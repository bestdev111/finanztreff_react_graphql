import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import moment from 'moment';
import classNames from 'classnames';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Portfolio, PortfolioPerformanceEntry, Query } from 'graphql/types';
import {REALDATE_FORMAT, getTextColorByValue, numberFormatWithSign, numberFormat, formatPrice} from 'utils';
import { getMinDate, calculatePortfolio, calculateChange, calculatePortfolioKonto, calculatePortfolioErtrage, calculatePortfolioErtrageToDate, calculatePct } from 'components/profile/utils';
import { useQuery } from '@apollo/client';
import { GET_PORTFOLIO_PERFORMANCE } from 'components/profile/query';
import { AccountOverviewModal } from 'components/profile/modals';

export function PortfolioDevelopmentItem(props: { portfolio: Portfolio, refreshTrigger: () => void }) {
    let { loading, data } = useQuery<Query>(
        GET_PORTFOLIO_PERFORMANCE,
        {
            variables: {
                id: props.portfolio.id
            }
        }
    );

    if (loading) {
        return <Spinner animation={'border'}/>
    }

    // const performanceEntries = props.portfolio.performanceEntries;
    const performanceEntries = data ? data.portfolioPerformance : [];

    const startDate = getMinDate(props.portfolio);
    const [initial, yesterday, last] = calculatePortfolio(props.portfolio);
    const [diff, diffPct] = calculateChange(initial, last);
    const [diffDaily, diffDailyPct] = calculateChange(yesterday, last);

    let profitPct = diffPct > 100 ? 100 : diffPct;
    let dark = 100 - profitPct;
    let lossPct = 0;

    if (diffPct < 0) {
        profitPct = 0;
        dark = 100 + diffPct;
        lossPct = -diffPct;
    }

    const konto: number = calculatePortfolioKonto(props.portfolio);
    const ertrage: number = calculatePortfolioErtrage(props.portfolio);
    const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;

    const totalDiff: number = diff + ertrage;
    const totalPct: number = initial > 0 ? (totalDiff / initial) * 100 : 0;

    let totalProfitPct = totalPct > 100 ? 100 : totalPct;
    let totalDark = 100 - totalProfitPct;
    let totalLossPct = 0;

    if (totalPct < 0) {
        totalProfitPct = 0;
        totalDark = 100 + totalPct;
        totalLossPct = -totalPct;
    }

    const chartOptions = createOptionsForProfileBanner(props.portfolio, performanceEntries);
    if (chartOptions['series'][0]['data'].length > 0) {
        const length = chartOptions['series'][0]['data'].length;
        chartOptions['series'][0]['data'][length - 1]['y'] = totalPct;
        chartOptions['series'][0]['data'][length - 1]['name'] = numberFormat(totalPct);
    }

    const [ertrageBar, profitBar, totalBar] = calculateBars(ertrage, diff);

    return (
        <Row className="mx-0 mb-5 mt-2 mt-xl-5">
            <Col xl={6} className="">
                <Row>
                    <Col className="px-0">
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                    </Col>
                </Row>
                <Row className="text-white fs-15px mt-2 justify-content-center">
                    Portfolioentwicklung seit Auflage ({REALDATE_FORMAT(startDate)})
                </Row>
            </Col>
            <Col xl={6} className="px-0 pl-xl-5 pl-0">
                <Col xl={12} className="px-2 pb-2 mb-4 border-left-2 border-gray d-xl-block d-none">
                    <Row className="text-white fs-15px mr-n4 mt-2">
                        <Col>
                            Erträge
                        </Col>
                        <Col className={classNames('text-right', getTextColorByValue(ertrage))}>
                            <span className="mr-3">{numberFormatWithSign(ertrage)} EUR</span>
                            <span>{numberFormatWithSign(ertragePct)} %</span>
                        </Col>
                    </Row>
                    <Row className="pl-2 pb-4 pr-2">
                        <ProgressBar bar={ertrageBar} height="8px" />
                    </Row>
                    <Row className="text-white fs-15px mr-n4">
                        <Col>
                            Kursgewinn
                        </Col>
                        <Col className={classNames('text-right', getTextColorByValue(diff))}>
                            <span className="mr-3">{numberFormatWithSign(diff)} EUR</span>
                            <span>{numberFormatWithSign(diffPct)} %</span>
                        </Col>
                    </Row>
                    <Row className="pl-2 pb-4 pr-2">
                        <ProgressBar bar={profitBar} height="8px" />
                    </Row>
                    <Row className="text-white font-weight-bold fs-17px mr-n4 my-2 ">
                        <Col className="">
                            Gesamtgewinn
                        </Col>
                        <Col className={classNames('text-right', getTextColorByValue(totalDiff))}>
                            <span className="mr-3">{numberFormatWithSign(totalDiff)} EUR</span>
                            <span>{numberFormatWithSign(totalPct)} %</span>
                        </Col>
                    </Row>
                    <Row className="pl-2 mt-n1 pr-2">
                        <ProgressBar bar={totalBar} height="20px" />
                    </Row>
                </Col>
                <Row xl={12} className="text-white my-3 d-xl-none d-flex">
                    <Col lg={7} md={12} sm={12} className="fs-13-15-15">
                        <Row className="">
                            <Col lg={4} md={4} sm={4}>
                                Erträge
                            </Col>
                            <Col xl={4} md={5} sm={5} className={classNames('text-right', getTextColorByValue(ertrage))}>
                                <span className="mr-3 mr-sm-0">{numberFormatWithSign(ertrage)} EUR</span>
                            </Col>
                            <Col xl={4} md={3} sm={3} className={classNames('text-right text-nowrap', getTextColorByValue(ertragePct))}>
                                <span>{numberFormatWithSign(ertragePct)} %</span>
                            </Col>
                        </Row>
                        <Row className="text-nowrap mt-lg-1">
                            <Col xl={4} md={4} sm={4}>
                                Kursgewinn
                            </Col>
                            <Col xl={4} md={5} sm={5} className={classNames('text-right', getTextColorByValue(diff))}>
                                <span className="mr-3 mr-sm-0">{numberFormatWithSign(diff)} EUR</span>
                            </Col>
                            <Col xl={4} md={3} sm={3} className={classNames('text-right text-nowrap', getTextColorByValue(diffPct))}>
                                <span>{numberFormatWithSign(diffPct)} %</span>
                            </Col>
                        </Row>
                        <Row className="fs-15-17-17 mt-2 mt-lg-3 text-nowrap">
                            <Col xl={4} md={4} sm={4}>
                                Gesamtgewinn
                            </Col>
                            <Col xl={4} md={5} sm={5} className={classNames('text-right', getTextColorByValue(totalDiff))}>
                                <span className="mr-3 mr-sm-0">{numberFormatWithSign(totalDiff)} EUR</span>
                            </Col>
                            <Col xl={4} md={3} sm={3} className={classNames('text-right text-nowrap', getTextColorByValue(totalPct))}>
                                <span>{numberFormatWithSign(totalPct)} %</span>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={5} md={0} sm={0} className="pl-2 pr-4 pb-2 border-left-2 border-gray g-xl-none d-lg-block d-sm-none">
                        <Row className="pl-2 mt-2 pr-2">
                            <ProgressBar bar={ertrageBar} height="8px" />
                        </Row>
                        <Row className="pl-2 mt-3 pb-4 pr-2">
                            <ProgressBar bar={profitBar} height="8px" />
                        </Row>
                        <Row className="pl-2 pr-2">
                            <ProgressBar bar={totalBar} height="22px" />
                        </Row>
                    </Col>
                </Row>
                <Col xl={12} className="text-white pb-2 mb-4 fs-13-15-15">
                    <Row className="border-top-1 border-gray pt-3 justify-content-between">
                        <Col xl={6} lg={7} md={12} sm={12} className="px-0 pr-lg-2">
                            <Row>
                                <Col xl={3} lg={4} md={4} sm={4}>Heute</Col>
                                <Col xl={5} lg={5} md={5} sm={5} className={classNames("text-nowrap text-right pr-xl-3 pr-sm-0", getTextColorByValue(diffDaily))}><span className="mr-0 pr-0 mr-lg-3 pr-lg-1 pr-3 text-truncate">{numberFormatWithSign(diffDaily, " EUR")}</span></Col>
                                <Col xl={4} lg={3} md={3} sm={3} className={classNames("text-right", getTextColorByValue(diffDailyPct))}><span className="pr-0 pr-lg-1 text-truncate">{numberFormatWithSign(diffDailyPct, " %")}</span></Col>
                            </Row>
                        </Col>
                        <Col xl={4} lg={3} md={12} sm={12} className="pl-0">
                            <Row className='justify-content-between text-nowrap mt-md-0 mt-sm-2'>
                                <span>
                                    <AccountOverviewModal portfolio={props.portfolio} inBanner={true} refreshTrigger={props.refreshTrigger}>
                                        <span className="cursor-pointer text-white bg-dark px-3 py-2 rounded ml-md-0 ml-sm-3" >
                                            Konto
                                        </span>
                                    </AccountOverviewModal>
                                </span>
                                <span className="text-truncate text-right">{numberFormat(konto, " EUR")}</span>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Col>
        </Row>
    );
}

function ProgressBar({ bar, height }: { bar: (string | number)[][], height: string }) {
    return (
        <div className="w-100 d-lg-flex d-sm-none">
            <span className={"progress-bar " + bar[0][0]} style={{ width: bar[0][1] + "%", lineHeight: "0px", height: height }}> </span>
            <span className={"progress-bar " + bar[1][0]} style={{ width: bar[1][1] + "%", lineHeight: "0px", height: height }}> </span>
            <span className={"progress-bar " + bar[2][0]} style={{ width: bar[2][1] + "%", lineHeight: "0px", height: height }}> </span>
        </div>
    );
}

function createOptionsForProfileBanner(portfolio: Portfolio, entries: PortfolioPerformanceEntry[]): any {

    // const entries: PortfolioPerformanceEntry[] = portfolio.performanceEntries!;

    const [initial, yesterday, last] = calculatePortfolio(portfolio);
    const ertrage = calculatePortfolioErtrage(portfolio);
    const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;

    const maxValue = Math.max.apply(Math, entries.map(function (current) { return current.value + ertragePct; })) + 1;
    const minValue = Math.min.apply(Math, entries.map(function (current) { return current.value; })) - 1;

    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: { backgroundColor: null, margin: [0, 0, 25, 0], height: "240px" },
        legend: { enabled: false },
        title: "",
        xAxis: {
            type: 'datetime',
            step: 3,
            gridLineColor: 'rgba(255, 255, 255, 0.1)',
            labels: {
                rotation: 0,
                overflow: "overlay",
                style: {
                    color: "rgba(255, 255, 255, 0.4)"
                },
            },
        },
        yAxis: {
            opposite: true,

            max: maxValue,
            min: minValue,
            title: {
                text: null
            },
            gridLineColor: 'rgba(255, 255, 255, 0.1)',
            labels: {
                align: 'right',
                x: -5,
                style: {
                    color: "rgba(255, 255, 255, 0.4)"
                }
            },
        },
        plotOptions: {
            area: {
                fillOpacity: 0.5,
                marker: {
                    enabled: false,
                    fillColor: 'rgba(31, 220, 162, 0.3)',
                    negativeColor: 'rgba(255, 77, 125, 0.3)',
                }
            },
        },
        tooltip: {
            headerFormat: "",
            pointFormat: '<p>{point.date}</p><br/><p style="color:{point.color}">\u25CF <span style="color:"black""><b>Entwicklung: {point.name}%</b></span></p>'
        },
        credits: { enabled: false },
        series: [createSerie(entries, portfolio, initial)]
    }
}

function createSerie(data: PortfolioPerformanceEntry[], portfolio: Portfolio, initial: number): any {

    return {
        name: "",
        threshold: 0,
        type: 'area',
        data: data.map((current: PortfolioPerformanceEntry) => {
            const ertrage = calculatePortfolioErtrageToDate(portfolio, current.date);
            const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;

            const value = current.value + ertragePct;
            return { y: value, x: moment(current.date).toDate(), date: REALDATE_FORMAT(current.date), name: formatPrice(value) }
        }),
        trackByArea: true,
        color: 'rgba(31, 220, 162, 1)',
        fillColor: 'rgba(31, 220, 162, 0.3)',
        negativeColor: 'rgba(255, 77, 125, 1)',
        negativeFillColor: 'rgba(255, 77, 125, 0.3)'
    };
}

function calculateBars(ertrage: number, kurs: number) {
    const totalDiff = ertrage + kurs;

    let ertrageBar = [["bg-green", 0], ["bg-dark", 0], ["bg-pink", 0]];
    let profitBar = [["bg-green", 0], ["bg-dark", 0], ["bg-pink", 0]];
    let totalBar = [["bg-green", 0], ["bg-dark", 0], ["bg-pink", 0]];
    if (totalDiff != 0) {
        const maxValue = Math.max(Math.abs(ertrage), Math.abs(kurs), Math.abs(totalDiff));

        ertrageBar = [["bg-green", calculatePct(ertrage, maxValue)], ["bg-dark", 100 - calculatePct(ertrage, maxValue)], ["bg-pink", 0]];

        if (kurs >= 0) {
            profitBar = [["bg-green", 0], ["bg-dark", 100 - calculatePct(kurs, maxValue)], ["bg-green", calculatePct(kurs, maxValue)]];
        } else {
            profitBar = [["bg-green", 0], ["bg-dark", 100 - calculatePct(Math.abs(kurs), maxValue)], ["bg-pink", calculatePct(Math.abs(kurs), maxValue)]];
        }

        if (totalDiff > 0) {
            totalBar = [["bg-green", calculatePct(totalDiff, maxValue)], ["bg-dark", 100 - calculatePct(totalDiff, maxValue)], ["bg-pink", 0]];
        } else {
            totalBar = [["bg-green", 0], ["bg-dark", 100 - calculatePct(Math.abs(totalDiff), maxValue)], ["bg-pink", calculatePct(Math.abs(totalDiff), maxValue)]];
        }
    }

    return [ertrageBar, profitBar, totalBar];
}
