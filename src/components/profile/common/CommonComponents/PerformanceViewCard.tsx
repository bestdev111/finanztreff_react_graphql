import { InstrumentInfoRowCardView } from "components/profile/common/CommonComponents/InstrumentInfoRowCardView";
import { getCurrencyCode, getNumberColor } from "components/profile/utils";
import { PortfolioEntry, CalculationPeriod, QuoteType } from "graphql/types";
import moment from "moment";
import { Table } from "react-bootstrap";
import {formatPrice, numberFormat, numberFormatWithSign} from "utils";

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
            <Table variant="portfolio" className="mt-1 fs-13px">
                <tr className="font-weight-bold" style={{ lineHeight: "0.9" }}>
                    <th className="font-weight-bold">Heute</th>
                    {oldAssetNoTradding ?
                        <>
                            <td>- EUR</td>
                            <td>- %</td>
                        </>
                        :
                        <>
                            <td className="text-truncate">{quote?.delay === 1 ?
                                <span className="bg-orange text-white px-2 fs-11px align-middle mr-1">RT</span> : <span className="bg-gray-dark text-white px-2 fs-11px align-middle mr-1">+15</span>
                            }{formatPrice(quote?.value, portfolioEntry?.instrument?.group?.assetGroup, quote?.value, currencyCode)} </td>
                            <td className={getNumberColor(quote?.percentChange || 0)}>{numberFormatWithSign(quote?.percentChange)} %</td>
                        </>
                    }
                </tr>
                <tr>
                    <th>1 Woche</th>
                    <td>{numberFormat(week1?.averagePrice)} {currencyCode}</td>
                    <td className={getNumberColor(week1?.performance || 0)}>{numberFormatWithSign(week1?.performance, ' %')}</td>
                </tr>
                <tr>
                    <th>1 Monat</th>
                    <td>{numberFormat(month1?.averagePrice)} {currencyCode}</td>
                    <td className={getNumberColor(month1?.performance || 0)}>{numberFormatWithSign(month1?.performance, ' %')}</td>
                </tr>
                <tr>
                    <th>6 Monate</th>
                    <td>{numberFormat(month6?.averagePrice)} {currencyCode}</td>
                    <td className={getNumberColor(month6?.performance || 0)}>{numberFormatWithSign(month6?.performance, ' %')}</td>
                </tr>
                <tr>
                    <th>1 Jahr</th>
                    <td>{numberFormat(year1?.averagePrice)} {currencyCode}</td>
                    <td className={getNumberColor(year1?.performance || 0)}>{numberFormatWithSign(year1?.performance, ' %')}</td>
                </tr>
                <tr>
                    <th>3 Jahre</th>
                    <td>{numberFormat(year3?.averagePrice)} {currencyCode}</td>
                    <td className={getNumberColor(year3?.performance || 0)}>{numberFormatWithSign(year3?.performance, ' %')}</td>
                </tr>
                <tr>
                    <th>5 Jahr</th>
                    <td>{numberFormat(year5?.averagePrice)} {currencyCode}</td>
                    <td className={getNumberColor(year5?.performance || 0)}>{numberFormatWithSign(year5?.performance, ' %')}</td>
                </tr>
                <tr>
                    <th>10 Jahr</th>
                    <td>{numberFormat(year10?.averagePrice)} {currencyCode}</td>
                    <td className={getNumberColor(year10?.performance || 0)}>{numberFormatWithSign(year10?.performance, ' %')}</td>
                </tr>
            </Table>
        </div>
    );
}

interface PerformanceViewCardProps {
    portfolioEntry: PortfolioEntry;
}