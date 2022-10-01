import classNames from "classnames";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import { ProfileInstrumentTileChart } from "components/profile/chart/ProfileInstrumentTileChart";
import { InstrumentInfoRowCardView } from "components/profile/common/CommonComponents/InstrumentInfoRowCardView";
import { calculatePortfolioEntry, getCurrencyCode, getNumberColor } from "components/profile/utils";
import { PortfolioEntry, ChartScope, QuoteType } from "graphql/types";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import moment from "moment";
import { useEffect, useState } from "react";
import { numberFormatWithSign } from "utils";
import { CardPeriodsContent } from "./ChartViewCardComponent/CardPeriodsContent";

export function ChartViewCard({ portfolioEntry }: { portfolioEntry: PortfolioEntry }) {
    const [initial, yesterday, last] = calculatePortfolioEntry(portfolioEntry);

    const period = ({ period: { chartScope: ChartScope.Intraday, name: "Heute", performance: yesterday }, fromPerchase: false });
    return (
        <div className="mx-2">
            <InstrumentInfoRowCardView entry={portfolioEntry} withTradeQuote={true} />
            <PerformanceChart portfolioEntry={portfolioEntry} period={period} />
        </div>
    );
}

interface Period {
    chartScope: ChartScope;
    name: string;
    performance: number
    showButton?: boolean
}

interface ChartViewCardState {
    period: Period
    fromPerchase: boolean
}

function PerformanceChart({ portfolioEntry, period }: { portfolioEntry: PortfolioEntry, period: ChartViewCardState }) {
    const currencyCode = getCurrencyCode(portfolioEntry);
    const chartWidth = useBootstrapBreakpoint({
        xl: 365,
        lg: 319,
        md: 317.17,
        default: 317.17
    });

    let [state, setState] = useState<ChartViewCardState>(period);
    useEffect(() => {
        setState(period)
    }, [portfolioEntry]);
    const quote = portfolioEntry && portfolioEntry.snapQuote && portfolioEntry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
    const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;

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
                        <CardPeriodsContent portfolioEntry={portfolioEntry} currencyCode={currencyCode} selected={state}
                            onSelect={(event: ChartViewCardState) =>
                                setState({ period: { chartScope: event.period.chartScope, name: event.period.name, performance: event.period.performance }, fromPerchase: event.period.name === "seit Kauf" ? true : false })
                            } />
                    </PageHeaderFilterComponent>
                </div>
            </div>
            <div className="mx-n2">
                {portfolioEntry.instrument && portfolioEntry.instrument.id &&
                    <ProfileInstrumentTileChart
                        period={state.period.chartScope}
                        instrumentId={portfolioEntry.instrument.id}
                        height={100}
                        width={chartWidth}
                        customPeriod={state.fromPerchase && portfolioEntry.entryTime}
                    />
                }
            </div>
            {oldAssetNoTradding ?
                <>
                    <img className="align-middle" style={{ marginTop: "-3px" }}
                        src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                        width="20"
                        alt="search news icon" /> Kein Kurs</>
                :
                <PerformanceRow period={state.period} currencyCode={currencyCode} portfolioEntry={portfolioEntry} />
            }
        </>
    );
}


interface PerformanceRowProps {
    period: Period;
    currencyCode: string;
    portfolioEntry: PortfolioEntry;
}
function PerformanceRow({ portfolioEntry, period, currencyCode }: PerformanceRowProps) {
    const [initial, yesterday, last] = calculatePortfolioEntry(portfolioEntry);
    const quote = (portfolioEntry.snapQuote &&
        (portfolioEntry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
            || portfolioEntry.snapQuote.quotes.find(current => current?.type === "NET_ASSET_VALUE"))) || undefined;
    const oldAssetNoTradding = (moment().subtract(10, "d").isAfter(moment(quote && quote.when)) && period.name === "Heute") || !quote;
    const calculateChange = (from: number) => {
        const diff: number = last - from;
        const diffPct: number = from === 0 ? 0 : diff / from * 100;
        return { absolute: diff, percentage: diffPct };
    }
    return (
        <div className="fs-15px text-truncate">
            <span className="font-weight-bold mr-2">Gewinn {period.name}</span>
            {oldAssetNoTradding ?
                <span className="">-</span>
                :
                <>
                    <span className={classNames("mr-2", getNumberColor(calculateChange(period.performance).absolute))}>{numberFormatWithSign(calculateChange(period.performance).absolute)} {currencyCode}</span>
                    <span className={getNumberColor(calculateChange(period.performance).percentage)}>{numberFormatWithSign(calculateChange(period.performance).percentage, '%')}</span>
                </>
            }
        </div>
    );
}

interface ChartViewCardState {
    period: Period
    fromPerchase: boolean
}
