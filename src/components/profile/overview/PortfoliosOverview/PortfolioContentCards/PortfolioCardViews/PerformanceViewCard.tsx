import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { InstrumentTileChart } from "components/common/charts/InstrumentTileChart/InstrumentTileChart";
import { GET_PORTFOLIO_PERFORMANCE } from "components/profile/query";
import { calculateChange, calculatePortfolio, calculatePortfolioErtrage, getMinDate, getNumberColor } from "components/profile/utils";
import { loader } from "graphql.macro";
import { Portfolio, Query } from "graphql/types";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import moment from "moment";
import { Col, Row, Spinner } from "react-bootstrap";
import { numberFormat, numberFormatWithSign, quoteFormat } from "utils";

export function PerformanceViewCard({ portfolio, refreshTrigger }: PerformanceViewCardProps) {
    let { loading, data } = useQuery<Query>(
        GET_PORTFOLIO_PERFORMANCE,
        {
            variables: {
                id: portfolio.id
            }
        }
    );

    if (loading) {
        return <Spinner animation={'border'}/>
    }

    // const performanceEntries = portfolio.performanceEntries;
    const performanceEntries = data?.portfolioPerformance;

    const [initial, yesterday, last] = calculatePortfolio(portfolio);
    const ertrage: number = calculatePortfolioErtrage(portfolio);
    const total = last + ertrage;
    const [diff, diffPct] = calculateChange(initial, total);
    const [diffDaily, diffDailyPct] = calculateChange(yesterday, last);
    const startDate = getMinDate(portfolio);

    let maxY = Math.max.apply(Math, (performanceEntries || []).map(function (current) { return current.value; }));
    let minY = Math.min.apply(Math, (performanceEntries || []).map(function (current) { return current.value; }));

    return (
        <>
            <Row className="justify-content-between fs-15px px-2 line-height-1">
                <Col className="">Investiertes Kapital: </Col>
                <Col className="font-weight-bold text-right">{numberFormat(initial)}
                    <span className="fs-13px ml-1">EUR</span>
                </Col>
            </Row>
            <Row className="justify-content-between fs-15px px-2 text-nowrap">
                <Col>Gewinn </Col>
                <Col className={classNames(getNumberColor(diffPct), "text-right font-weight-bold")}>
                    {numberFormatWithSign(diffPct)}
                    <span className="fs-13px pr-3 pl-1">%</span>
                    {numberFormatWithSign(diff)}
                    <span className="fs-13px pl-1">EUR</span>
                </Col>
            </Row>
            <Row className="justify-content-between font-weight-bold fs-18px align-items-end mt-n1 px-2">
                <Col>Gesamtwert </Col>
                <Col className="fs-24px text-right">{numberFormat(total)}
                    <span className="fs-13px ml-1">EUR</span>
                </Col>
            </Row>
            <Row className="">
                <Col className="" xs={12}>
                    <InstrumentTileChart
                        points={
                            (performanceEntries || []).map(current => ({ y: current.value }))
                        }
                        threshold={0}
                        plotLines={[{
                            width: 0,
                            value: 0,
                            label: {
                                text: '<span style="font-size: 13px "> Seit Auflage ' + quoteFormat(startDate) + ' </span>',
                                align: 'left',
                                y: maxY === 0 ? 15 : -5,
                                style: {
                                    fontFamily: "Roboto",
                                    color: "#383838",
                                    zIndex: 100,
                                }
                            }
                        }]}
                        height={100}
                        enableMouseTracking={false}
                        maxY={maxY}
                        minY={minY}
                    /></Col>
            </Row>
            <Row className="justify-content-between fs-15px mt-n3 px-2">
                <Col><span className="font-weight-bold">Heute</span> <span className="fs-11px"> {quoteFormat(moment())} Uhr</span></Col>
                <Col className={classNames(getNumberColor(diffDailyPct), "text-right")}>
                    {numberFormatWithSign(diffDailyPct)}
                    <span className="fs-13px ml-1 mr-3">%</span>
                    {numberFormatWithSign(diffDaily)}
                    <span className="fs-13px ml-1">EUR</span>
                </Col>
            </Row>
        </>
    );
}

interface PerformanceViewCardProps {
    portfolio: Portfolio
    refreshTrigger: () => void;
}