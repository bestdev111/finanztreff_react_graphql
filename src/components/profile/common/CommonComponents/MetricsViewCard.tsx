import { RangeChartComponent } from "components/common/banner/RangeChartComponent";
import { PortfolioEntry, QuoteType, WatchlistEntry } from "graphql/types";
import moment from "moment";
import {formatPrice, numberFormat, shortNumberFormat} from "utils";
import { InstrumentInfoRowCardView } from "./InstrumentInfoRowCardView";

export const MetricsViewCard = ({ entry }: MetricsViewCardProps) => {

    const snapQuote = entry.snapQuote;
    const performance = entry.instrument?.performance;
    const ask = entry.snapQuote?.quotes.find(current => current?.type === QuoteType.Ask);
    const bid = entry.snapQuote?.quotes.find(current => current?.type === QuoteType.Bid);
    const redemptionPrice = entry.snapQuote?.quotes.find(current => current?.type === QuoteType.RedemptionPrice);
    const issuePrice = entry.snapQuote?.quotes.find(current => current?.type === QuoteType.IssuePrice);
    const vola = (performance || []).find(current => current.period === 'MONTH1')?.vola;
    const currencyCode = entry.instrument?.currency.displayCode;
    const quote = entry && entry.snapQuote && entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
    const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;

    return (
        <div className="mx-2">
            <InstrumentInfoRowCardView entry={entry} withTradeQuote={true} />
            <div className="fs-15px text-truncate mt-2">
                <span>Trades: <b>{snapQuote ? snapQuote.cumulativeTrades : "-"}</b>, </span>
                <span>Umsatz: <b>{shortNumberFormat(snapQuote?.cumulativeVolume)}</b>, </span>
                <span>Vola: <b>{numberFormat(vola, "%")}</b> </span>
            </div>
            {oldAssetNoTradding &&
                        <>
                            <img className="align-middle" style={{ marginTop: "-2px" }}
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                                width="20"
                                alt="search news icon" /> Kein Kurs</>
            }
            <div className="fs-15px text-truncate">
                {redemptionPrice && issuePrice ?
                    <span className="mr-2">Rück./Aus.:
                        {issuePrice ?
                            <>
                                {issuePrice.delay === 1 ?
                                    <span className="bg-orange text-white px-2 fs-11px align-middle ml-2">RT</span> :
                                    <span className="bg-gray-dark text-white px-2 fs-11px align-middle ml-2">+15</span>
                                }
                                <span className="font-weight-bold fs-15px mr-1"> {formatPrice(issuePrice.value, entry?.instrument?.group?.assetGroup,quote?.value, currencyCode)}</span>

                            </>
                            : "-"
                        }
                        {redemptionPrice ?
                            <>
                                {redemptionPrice.delay === 1 ?
                                    <span className="bg-orange text-white px-2 fs-11px align-middle">RT</span> :
                                    <span className="bg-gray-dark text-white px-2 fs-11px align-middle">+15</span>
                                }
                                <span className="font-weight-bold fs-15px"> {formatPrice(redemptionPrice.value, entry?.instrument?.group?.assetGroup,quote?.value, currencyCode)}  </span>

                            </>
                            : "-"
                        }
                    </span>
                    :
                    bid && ask &&
                    <span className="mr-2 text-truncate">Bid/Ask:
                        {bid ?
                            <>
                                {bid.delay === 1 ?
                                    <span className="bg-orange text-white px-2 fs-11px align-middle ml-2">RT</span> :
                                    <span className="bg-gray-dark text-white px-2 fs-11px align-middle ml-2">+15</span>
                                }
                                <span className="font-weight-bold fs-15px mr-1"> {formatPrice(bid.value, entry?.instrument?.group?.assetGroup,quote?.value, currencyCode)}  </span>

                            </>
                            : "-"
                        }
                        {ask ?
                            <>
                                {ask.delay === 1 ?
                                    <span className="bg-orange text-white px-2 fs-11px align-middle ">RT</span> :
                                    <span className="bg-gray-dark text-white px-2 fs-11px align-middle ">+15</span>
                                }
                                <span className="font-weight-bold fs-15px"> {formatPrice(ask.value, entry?.instrument?.group?.assetGroup,quote?.value, currencyCode)} </span>

                            </>
                            : "-"
                        }
                    </span>
                }
            </div>
            <div className="range-charts-watchlist">
                <div className="mt-4 mb-4">
                    {
                        entry.instrument && entry.instrument.rangeCharts &&
                        <>
                            <div>
                                {entry.instrument.rangeCharts.intraday &&
                                    <RangeChartComponent data={entry.instrument.rangeCharts.intraday} period={'1T'}
                                        title={'Eröffnung ' + numberFormat(entry.instrument.rangeCharts.intraday.threshold)} />
                                }
                            </div>

                        </>
                    }
                </div>
                <div className="pt-2">
                    {
                        entry.instrument && entry.instrument.rangeCharts &&
                        <>
                            <div>
                                {entry.instrument.rangeCharts.year &&
                                    <RangeChartComponent data={entry.instrument.rangeCharts.year} period={'52W'}
                                        title={'ø 52W'} />
                                }
                            </div>

                        </>
                    }
                </div>
            </div>

        </div>
    );
}

interface MetricsViewCardProps {
    entry: PortfolioEntry | WatchlistEntry
}