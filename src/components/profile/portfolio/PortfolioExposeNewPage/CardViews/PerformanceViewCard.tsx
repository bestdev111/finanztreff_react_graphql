import classNames from "classnames";
import { InstrumentInfoRowCardView } from "components/profile/common/CommonComponents/InstrumentInfoRowCardView";
import { getCurrencyCode, getNumberColor } from "components/profile/utils";
import { PortfolioEntry, CalculationPeriod, QuoteType } from "graphql/types";
import moment from "moment";
import { Col, Container, Row } from "react-bootstrap";
import { formatPrice, numberFormat, numberFormatWithSign } from "utils";

export function PerformanceViewCard({ portfolioEntry }: PerformanceViewCardProps) {

    const quote = portfolioEntry && portfolioEntry.snapQuote && portfolioEntry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
    const performance = portfolioEntry.instrument?.performance;
    const week1 = performance?.find(current => current.period === CalculationPeriod.Week1);
    const month1 = performance?.find(current => current.period === CalculationPeriod.Month1);
    const month6 = performance?.find(current => current.period === CalculationPeriod.Month6);
    const year1 = performance?.find(current => current.period === CalculationPeriod.Week52);
    const year3 = performance?.find(current => current.period === CalculationPeriod.Year3);
    const year5 = performance?.find(current => current.period === CalculationPeriod.Year5);
    const year10 = performance?.find(current => current.period === CalculationPeriod.Year10);

    const currencyCode = getCurrencyCode(portfolioEntry);
    const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;

    return (
        <div className="mx-2">
            <InstrumentInfoRowCardView entry={portfolioEntry} />
            <Container className="mt-1 fs-13px">
                <Row className="font-weight-bold pb-1" style={{ lineHeight: "0.9" }}>
                    {oldAssetNoTradding ?
                        <Col>
                            <Row className="align-items-center">
                                <img className="align-middle" style={{ marginTop: "-2px" }}
                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                                    width="20"
                                    alt="search news icon" /><span className="font-weight-normal"> Kein Kurs</span>
                            </Row>
                        </Col>
                        :
                        <>
                            <Col xs={3} className="font-weight-bold pl-0">Heute</Col>
                            <Col xs={6} className="text-nowrap text-right">{quote?.delay === 1 ?
                                <span className="bg-orange text-white px-2 fs-11px align-middle mr-1">RT</span> : <span className="bg-gray-dark text-white px-2 fs-11px align-middle mr-1">+15</span>
                            }{formatPrice(quote?.value || 0, null, quote?.value, currencyCode)}</Col>
                            <Col xs={3} className={classNames("text-right pr-0", getNumberColor(quote?.percentChange || 0))}>{numberFormatWithSign(quote?.percentChange)} %</Col>
                        </>
                    }
                </Row>
                <Row>
                    <Col className="pl-0" xs={3}>1 Woche</Col>
                    <Col xs={6} className="text-right text-nowrap">{numberFormat(week1?.averagePrice)} {currencyCode}</Col>
                    <Col xs={3} className={classNames("pr-0 text-right", getNumberColor(week1?.performance || 0))}>{numberFormatWithSign(week1?.performance, ' %')}</Col>
                </Row>
                <Row>
                    <Col className="pl-0" xs={3}>1 Monat</Col>
                    <Col xs={6} className="text-right text-nowrap">{numberFormat(month1?.averagePrice)} {currencyCode}</Col>
                    <Col className={classNames("pr-0 text-right", getNumberColor(month1?.performance || 0))}>{numberFormatWithSign(month1?.performance, ' %')}</Col>
                </Row>
                <Row>
                    <Col className="pl-0" xs={3}>6 Monate</Col>
                    <Col xs={6} className="text-right text-nowrap">{numberFormat(month6?.averagePrice)} {currencyCode}</Col>
                    <Col xs={3} className={classNames("pr-0 text-right", getNumberColor(month6?.performance || 0))}>{numberFormatWithSign(month6?.performance, ' %')}</Col>
                </Row>
                <Row>
                    <Col className="pl-0" xs={3}>1 Jahr</Col>
                    <Col xs={6} className="text-right text-nowrap">{numberFormat(year1?.averagePrice)} {currencyCode}</Col>
                    <Col xs={3} className={classNames("pr-0 text-right", getNumberColor(year1?.performance || 0))}>{numberFormatWithSign(year1?.performance, ' %')}</Col>
                </Row>
                <Row>
                    <Col className="pl-0" xs={3}>3 Jahre</Col>
                    <Col xs={6} className="text-right text-nowrap">{numberFormat(year3?.averagePrice)} {currencyCode}</Col>
                    <Col xs={3} className={classNames("pr-0 text-right", getNumberColor(year3?.performance || 0))}>{numberFormatWithSign(year3?.performance, ' %')}</Col>
                </Row>
                <Row>
                    <Col className="pl-0" xs={3}>5 Jahr</Col>
                    <Col xs={6} className="text-right text-nowrap">{numberFormat(year5?.averagePrice)} {currencyCode}</Col>
                    <Col xs={3} className={classNames("pr-0 text-right", getNumberColor(year5?.performance || 0))}>{numberFormatWithSign(year5?.performance, ' %')}</Col>
                </Row>
                <Row>
                    <Col className="pl-0" xs={3}>10 Jahr</Col>
                    <Col xs={6} className="text-right text-nowrap">{numberFormat(year10?.averagePrice)} {currencyCode}</Col>
                    <Col xs={3} className={classNames("pr-0 text-right", getNumberColor(year10?.performance || 0))}>{numberFormatWithSign(year10?.performance, ' %')}</Col>
                </Row>
            </Container>
        </div>
    );
}

interface PerformanceViewCardProps {
    portfolioEntry: PortfolioEntry;
}
