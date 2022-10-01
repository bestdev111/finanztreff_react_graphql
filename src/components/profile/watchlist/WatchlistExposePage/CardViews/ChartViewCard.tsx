import classNames from "classnames";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import { ProfileInstrumentTileChart } from "components/profile/chart/ProfileInstrumentTileChart";
import { InstrumentInfoRowCardView } from "components/profile/common/CommonComponents/InstrumentInfoRowCardView";
import { getNumberColor, calculateDays } from "components/profile/utils";
import { WatchlistEntry, ChartScope, QuoteType } from "graphql/types";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import moment from "moment";
import { useState } from "react";
import { numberFormat, numberFormatShort, numberFormatWithSign } from "utils";
import { CardPeriodsContent } from "./ChartViewCardComponent/CardPeriodsContent";

export function ChartViewCard({ watchlistEntry }: { watchlistEntry: WatchlistEntry }) {
    const currencyCode = watchlistEntry.instrument?.currency.displayCode || "";
    const chartWidth = useBootstrapBreakpoint({
        xl: 355,
        lg: 315,
        md: 317.17,
        default: 317.17
    });

    const days = calculateDays(watchlistEntry);

    return (
        <div className="mx-2" key={watchlistEntry.id}>
            <InstrumentInfoRowCardView entry={watchlistEntry} withTradeQuote={true} />
            <PerformanceChart currencyCode={currencyCode} watchlistEntry={watchlistEntry} chartWidth={chartWidth} />
            <div className="d-flex justify-content-between font-weight-bold fs-13px pb-2">
                {(days > 0) ?
                    <span className="watched-time">
                        <span className="svg-icon top-move">
                            <img src="/static/img/svg/icon_watchlist_dark.svg" width="24" className="" alt="" />
                        </span>
                        <span> {numberFormatShort(days)}</span>
                        <span>&nbsp;</span>
                        <span>{days === 1 ? "Tag" : "Tage"}</span>
                    </span>
                    :
                    <span className="watched-time">
                        <span className="svg-icon top-move">
                            <img src="/static/img/svg/icon_watchlist_dark.svg" width="24" className="" alt="" />
                        </span>
                        <span>&nbsp;</span>
                        <span>Heute</span>
                    </span>
                }
                <span>
                    <span>Kurs bei Aufnahme: {numberFormat(watchlistEntry.price)} {watchlistEntry.instrument?.currency.displayCode}</span>
                </span>
            </div>
        </div>
    );
}

function PerformanceChart(props: PerformanceChartProps) {
    const quote = (props.watchlistEntry.snapQuote &&
                                (props.watchlistEntry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
                                    || props.watchlistEntry.snapQuote.quotes.find(current => current?.type === QuoteType.NetAssetValue))) || undefined;
    let [state, setState] = useState<ChartViewCardState>({ period: { chartScope: ChartScope.Intraday, name: "Heute", performance: { performance: quote?.percentChange || 0, averagePrice: quote?.value || 0 } }, fromPerchase: false });
    return (
        <>
            <div className="d-flex justify-content-end">
                <div className="period-card bg-gray-light mx-1">
                    <PageHeaderFilterComponent
                        variant={"inline-inverse"}
                        toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
                        title={state.period.name}
                        className="d-flex justify-content-end"
                        toggleVariant={"inline-blue-dropdown"}>
                        <CardPeriodsContent watchlistEntry={props.watchlistEntry} currencyCode={props.currencyCode} selected={state}
                            onSelect={(event: ChartViewCardState) =>
                                setState({
                                    period: {
                                        chartScope: event.period.chartScope, name: event.period.name, performance:
                                            { performance: event.period.performance.performance, averagePrice: event.period.performance.averagePrice }
                                    },
                                    fromPerchase: event.period.name === "seit Beobachtung" ? true : false
                                })
                            } />
                    </PageHeaderFilterComponent>
                </div>
            </div>
            <div className="mx-n2">
                {props.watchlistEntry.instrument && props.watchlistEntry.instrument.id &&
                    <ProfileInstrumentTileChart
                        period={state.period.chartScope}
                        instrumentId={props.watchlistEntry.instrument.id}
                        height={90}
                        width={props.chartWidth}
                        customPeriod={state.fromPerchase && props.watchlistEntry.entryTime}
                    />
                }
            </div>
            <PerformanceRow entry={props.watchlistEntry} period={state.period} currencyCode={props.currencyCode} index={props.watchlistEntry.id}/>
        </>
    );
}

interface PerformanceRowProps {
    period: Period;
    currencyCode: string;
    index: number
    entry: WatchlistEntry
}
function PerformanceRow({ period, currencyCode, index, entry }: PerformanceRowProps) {
    const quote = entry && entry.snapQuote && entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
    const oldAssetNoTradding = (moment().subtract(10, "d").isAfter(moment(quote && quote.when)) && period.name === "Heute") || !quote;

    return (
        <div className="fs-15px text-truncate mb-2" key={index}>
            {oldAssetNoTradding ?
                <>
                    <img className="align-middle" style={{ marginTop: "-2px" }}
                        src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                        width="20"
                        alt="search news icon" /> Kein Kurs
                </>
                :
                <>
                <span className="font-weight-bold mr-2">Perf. {period.name}</span>
                    <span className={classNames("mr-2")}>{numberFormat(period.performance.averagePrice)} {currencyCode}</span>
                    <span className={getNumberColor(period.performance.performance || 0)}>{numberFormatWithSign(period.performance.performance, '%')}</span>
                </>
            }
        </div>
    );
}

interface PerformanceChartProps {
    watchlistEntry: WatchlistEntry;
    chartWidth: number;
    currencyCode: string;
}

interface Period {
    chartScope: ChartScope;
    name: string;
    performance: { averagePrice: number, performance: number }
}

interface ChartViewCardState {
    period: Period
    fromPerchase: boolean
}
