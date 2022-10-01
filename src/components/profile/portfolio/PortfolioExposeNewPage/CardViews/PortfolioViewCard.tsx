import classNames from "classnames";
import { InstrumentInfoRowCardView } from "components/profile/common/CommonComponents/InstrumentInfoRowCardView";
import { getCurrencyCode, getRateCurrency, calculatePortfolioEntry, calculatePortfolioEntryErtrage, calculateChange, getNumberColor, getSnapQuote, calculatePortfolioEntryValue, calculateEntrySubTotalInPositionCurrency } from "components/profile/utils";
import { PortfolioEntry, Portfolio } from "graphql/types";
import moment from "moment";
import { Table } from "react-bootstrap";
import {quoteFormat, numberFormatDecimals, numberFormatWithSign, numberFormat, formatPriceWithSign} from "utils";

export function PortfolioViewCard({ portfolio, portfolioEntry }: PortfolioViewCardProps) {

    const currencyCode = getCurrencyCode(portfolioEntry);
    const rateCurrency = getRateCurrency(portfolioEntry);
    const exchangeCode = portfolioEntry.instrument?.exchange.code;

    const [initial, yesterday, last] = calculatePortfolioEntry(portfolioEntry);
    const ertrage: number = calculatePortfolioEntryErtrage(portfolio, portfolioEntry);
    const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;

    const [diff, diffPct] = calculateChange(initial, last);
    const [diffDaily, diffDailyPct] = calculateChange(yesterday, last);

    const total: number = last + ertrage;
    const [totalDiff, totalPct] = calculateChange(initial, total);

    const quote = getSnapQuote(portfolioEntry);
    const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;
    

    return (
        <div className={classNames("mx-2", oldAssetNoTradding && "bg-gray-neutral")}>
            <InstrumentInfoRowCardView entry={portfolioEntry} withTradeQuote={true} />
            <div className="m-0 fs-13px border-bottom-1 pb-1 text-truncate border-gray-light text-container-max-width">
                <b>Kauf </b>
                {quoteFormat(portfolioEntry.entryTime)}, {portfolioEntry.quantity}x
                {portfolioEntry.price < 1 ? numberFormatDecimals(portfolioEntry?.price || 0) : numberFormat(portfolioEntry?.price || 0)} 
                {rateCurrency} 
                <b>({numberFormat(calculateEntrySubTotalInPositionCurrency(portfolioEntry))})</b> {exchangeCode}
            </div>
            <Table variant="portfolio" className="mt-1 fs-13px">
                <tr>
                    <th>Erträge</th>
                    <td className={getNumberColor(ertrage)}>{numberFormatWithSign(ertrage)} EUR</td>
                    <td className={getNumberColor(ertragePct)}>{numberFormatWithSign(ertragePct)} %</td>
                </tr>
                <tr className="border-bottom-2 border-gray-light">
                    <th className="pb-3px">Kursgewinn</th>
                    <td className={classNames(getNumberColor(diff), "text-truncate")}>{numberFormatWithSign(diff)} EUR</td>
                    <td className={getNumberColor(diffPct)}>{numberFormatWithSign(diffPct, ' %')}</td>
                </tr>
                <tr className="total fs-15px">
                    <th className="pt-7px">Gesamt</th>
                    <td className={classNames("pt-7px text-truncate", getNumberColor(totalDiff))}>{numberFormatWithSign(totalDiff)} EUR</td>
                    <td className={classNames("pt-7px", getNumberColor(totalPct))}>{numberFormatWithSign(totalPct, ' %')}</td>
                </tr>
                <tr className="total fs-15px">
                    <th>Gesamtsumme</th>
                    <td className="text-truncate">{numberFormat(last+ertrage)} EUR</td>
                    <td></td>
                </tr>
                <tr className="today fs-13px">
                    {oldAssetNoTradding ?
                        <>
                            <img className="align-middle" style={{ marginTop: "-2px" }}
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                                width="20"
                                alt="search news icon" /> Kein Kurs</>
                        :
                        <>
                            <th>Heute</th>
                            <td className={getNumberColor(diffDaily)}>{formatPriceWithSign(diffDaily, portfolioEntry?.instrument?.group?.assetGroup,quote?.value, "EUR")} </td>
                            <td className={getNumberColor(diffDailyPct)}>{numberFormatWithSign(diffDailyPct, ' %')}</td>
                        </>
                    }
                </tr>
            </Table>
        </div>
    )
}

interface PortfolioViewCardProps {
    portfolio: Portfolio;
    portfolioEntry: PortfolioEntry
}