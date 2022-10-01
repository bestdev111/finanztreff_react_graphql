import { Component, ReactNode } from "react";
import {numberFormat, shortNumberFormat, quoteFormat, extractQuotes, formatPrice} from '../../../../utils'
import { SnapQuoteDelayIndicator } from '../../indicators'
import { QuoteValue } from "../index";
import { CalculationPeriod, Instrument, InstrumentGroup } from "../../../../generated/graphql";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";

export interface ExchangeOverviewRowProperties {
    url?: string | null;
    instrument: Instrument;
    group?: InstrumentGroup;
    children?: ReactNode;
    callback?: (id?: number) => void;
    isLink?: boolean;
}

export class ExchangeOverviewRow extends Component<ExchangeOverviewRowProperties, {}>{
    render() {
        let { id, isin, snapQuote, exchange, currency, stats, group } = this.props.instrument;
        let rangeChart = (stats || []).filter(item => item?.period === CalculationPeriod.Week52)[0];
        let { ask, bid, trade, nav, redemptionPrice, issuePrice } = extractQuotes(this.props.instrument?.snapQuote);
        return (
            <>
                <tr className="padding-bottom-td bo font-size-15px">
                    <td className="column-indicator pl-2 pl-md-1" style={{ paddingTop: "11px" }} >
                        <SnapQuoteDelayIndicator delay={trade ? trade.delay : nav ? nav.delay : 600} />
                    </td>
                    <td className="text-left column-exchange px-0 cursor-pointer text-blue" onClick={() => this.props.callback && this.props.callback(id || 0)}>
                        {this.props.isLink ?
                            <AssetLinkComponent instrument={this.props.instrument} title={this.props.instrument.exchange.name || undefined} />
                            :
                            this.props.instrument.exchange.name
                        }
                    </td>
                    <td rowSpan={2} className="text-right text-uppercase align-middle d-none d-xl-table-cell column-currency">{currency.displayCode}</td>
                    <td className="text-right font-weight-bold kurs-info column-trade px-0">
                        {formatPrice((nav || trade)?.value, group?.assetGroup)}
                        {trade && trade.change &&
                            <span className="svg-icon move-arrow">
                                {
                                    trade.change > 0 ?
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt="" style={{ marginTop: "-4px" }} /> :
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt="" style={{ marginTop: "-4px" }} />
                                }
                            </span>
                        }{nav && nav.change &&
                            <span className="svg-icon move-arrow">
                                {
                                    nav.change > 0 ?
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt="" style={{ marginTop: "-4px" }} /> :
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt="" style={{ marginTop: "-4px" }} />
                                }
                            </span>
                        }
                    </td>
                    <td className="text-right d-none d-md-table-cell">
                        {trade && <QuoteValue value={trade.change} change={trade.percentChange} assetGroup={group.assetGroup || undefined}/>}
                        {nav && <QuoteValue value={nav.change} change={nav.percentChange} assetGroup={group.assetGroup || undefined}/>}
                    </td>
                    <td className="text-right">
                        {trade ? quoteFormat((trade || nav).when) : nav ?  quoteFormat(nav.when) : "-"}
                    </td>
                    <td className="text-right d-none d-md-table-cell font-weight-bold">
                        {bid ? formatPrice(bid.value, group?.assetGroup) : issuePrice ? formatPrice(issuePrice.value, group?.assetGroup) : ""}
                    </td>
                    <td className="text-right d-none d-md-table-cell font-weight-bold">
                        {ask ? formatPrice(ask.value, group?.assetGroup) : redemptionPrice ? formatPrice(redemptionPrice.value, group?.assetGroup) : ""}
                    </td>
                    <td className="text-right d-none d-xl-table-cell  d-none d-xl-table-cell">
                        {formatPrice(snapQuote?.yesterdayPrice, group?.assetGroup)}
                    </td>
                    <td className="text-right d-none d-xl-table-cell  d-none d-xl-table-cell">
                        {formatPrice(snapQuote?.highPrice, group?.assetGroup)}
                    </td>
                    <td className="text-right d-none d-xl-table-cell">
                        {formatPrice(rangeChart?.highPrice, group?.assetGroup)}
                    </td>
                    <td className="text-right d-none d-xl-table-cell">
                        {shortNumberFormat(snapQuote?.cumulativeTrades)}
                    </td>
                    <td className="align-middle p-2 d-none d-xl-table-cell" rowSpan={2}>
                        {this.props.children}
                    </td>
                </tr>
                <tr className="border-bottom-1 border-border-gray font-size-15px">
                    <td className="column-indicator py-0">&nbsp;</td>
                    <td className="text-left pl-0 py-0">{isin}</td>
                    <td className="text-right py-0 pl-0">
                        {shortNumberFormat(snapQuote?.cumulativeVolume)}
                    </td>
                    <td className="text-right d-none py-0 d-md-table-cell">
                        <QuoteValue value={trade?.percentChange} change={trade?.percentChange} suffix="%" />
                    </td>
                    <td className="text-right py-0">
                        {trade ? numberFormat(trade.size) : nav ?  numberFormat(nav.size) : "-"}
                    </td>
                    <td className="text-right d-none py-0 d-md-table-cell">
                        {bid ? numberFormat(bid.size) : issuePrice ?  numberFormat(issuePrice.size) : "-"}
                    </td>
                    <td className="text-right d-none py-0 d-md-table-cell">
                        {ask ? numberFormat(ask.size) : redemptionPrice ?  numberFormat(redemptionPrice.size) : "-"}
                    </td>
                    <td className="text-right d-none d-xl-table-cell pt-xl-0">
                        {formatPrice(snapQuote?.firstPrice, group?.assetGroup)}
                    </td>
                    <td className="text-right d-none d-xl-table-cell pt-xl-0">
                        {formatPrice(snapQuote?.lowPrice, group?.assetGroup)}
                    </td>
                    <td className="text-right d-none d-xl-table-cell pt-xl-0">
                        {formatPrice(rangeChart?.lowPrice, group?.assetGroup)}
                    </td>
                    <td className="text-right d-none d-xl-table-cell pt-xl-0" >
                        {shortNumberFormat(snapQuote?.cumulativeTurnover)}
                    </td>
                </tr>
            </>
        );
    }
}
