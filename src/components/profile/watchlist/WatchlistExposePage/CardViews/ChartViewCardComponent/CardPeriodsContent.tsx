import classNames from "classnames";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { getPercentOfChange } from "components/profile/LimitsPage/LimitChartComponent";
import { WatchlistEntry, CalculationPeriod, ChartScope, QuoteType } from "graphql/types";
import { useContext, useCallback } from "react";
import { Card, Button } from "react-bootstrap";

export function CardPeriodsContent(props: CardPeriodsContentProps) {

    const PERIODS = getPeriods(props.watchlistEntry);
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={classNames("mr-auto ml-auto borderless shadow-none align-items-center mb-lg-0 mb-sm-2")} style={{ zIndex: 3 }}>
            <Card.Body className="d-flex justify-content-center p-0" style={{ width: "252px" }}>
                <div className="button-container align-self-center">
                    {PERIODS.map((current, index) => {
                        return (
                            <Button key={index} variant={'inline-inverse'} onClick={() => {
                                props.onSelect({ period: { chartScope: current.chartScope, name: current.name, performance: { performance: current.performance.performance, averagePrice: current.performance.averagePrice } }, fromPerchase: current.name === "seit Kauf" ? true : false })
                                closeAction();
                            }} className={props.selected.period.name === current.name ? "btn active m-1 p-1 px-2" : "btn m-1 p-1 px-2"}>
                                {current.name}
                            </Button>);
                    })
                    }
                </div>
            </Card.Body>
        </Card>
    );
}

function getPeriods(watchlistEntry: WatchlistEntry) {
    const performance = watchlistEntry.instrument?.performance;
    const quote = (watchlistEntry.snapQuote &&
        (watchlistEntry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
            || watchlistEntry.snapQuote.quotes.find(current => current?.type === QuoteType.NetAssetValue))) || undefined;
    const week1 = performance?.find(current => current.period === CalculationPeriod.Week1);
    const month1 = performance?.find(current => current.period === CalculationPeriod.Month1);
    const month6 = performance?.find(current => current.period === CalculationPeriod.Month6);
    const year1 = performance?.find(current => current.period === CalculationPeriod.Week52);
    const year3 = performance?.find(current => current.period === CalculationPeriod.Year3);
    const year5 = performance?.find(current => current.period === CalculationPeriod.Year5);
    const year10 = performance?.find(current => current.period === CalculationPeriod.Year10);
    
    const PERIODS: Period[] = [{
        chartScope: ChartScope.TenYear,
        name: "seit Beobachtung",
        performance: { averagePrice: watchlistEntry.price, performance: getPercentOfChange( quote?.value || 1,watchlistEntry.price) },
    }, {
        chartScope: ChartScope.Intraday,
        name: "Heute",
        performance: { averagePrice: quote?.value || 0, performance: quote?.percentChange || 0 },
    }, {
        chartScope: ChartScope.Week,
        name: "1 Woche",
        performance: { averagePrice: week1?.averagePrice || 0, performance: week1?.performance || 0 },
    }, {
        chartScope: ChartScope.Month,
        name: "1 Monat",
        performance: { averagePrice: month1?.averagePrice || 0, performance: month1?.performance || 0 },
    }, {
        chartScope: ChartScope.SixMonth,
        name: "6 Monate",
        performance: { averagePrice: month6?.averagePrice || 0, performance: month6?.performance || 0 },
    }, {
        chartScope: ChartScope.Year,
        name: "1 Jahr",
        performance: { averagePrice: year1?.averagePrice || 0, performance: year1?.performance || 0 },
    }, {
        chartScope: ChartScope.ThreeYear,
        name: "3 Jahr",
        performance: { averagePrice: year3?.averagePrice || 0, performance: year3?.performance || 0 },
    }, {
        chartScope: ChartScope.FiveYear,
        name: "5 Jahr",
        performance: { averagePrice: year5?.averagePrice || 0, performance: year5?.performance || 0 },
    }, {
        chartScope: ChartScope.TenYear,
        name: "10 Jahr",
        performance: { averagePrice: year10?.averagePrice || 0, performance: year10?.performance || 0 },
    }];

    return PERIODS
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

interface CardPeriodsContentProps {
    watchlistEntry: WatchlistEntry,
    currencyCode: string,
    selected: ChartViewCardState,
    onSelect: (event: ChartViewCardState) => void
}