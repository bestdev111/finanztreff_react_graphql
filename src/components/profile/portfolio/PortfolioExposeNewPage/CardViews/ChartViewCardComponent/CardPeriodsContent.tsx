import classNames from "classnames";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { calculatePortfolioEntry, calculatePortfolioEntryTotal } from "components/profile/utils";
import { PortfolioEntry, CalculationPeriod, ChartScope } from "graphql/types";
import moment from "moment";
import { useContext, useCallback } from "react";
import { Card, Button } from "react-bootstrap";

export function CardPeriodsContent(props: CardPeriodsContentProps) {

    const PERIODS = getPeriods(props.portfolioEntry, props.currencyCode);
    const [initial, yesterday, last] = calculatePortfolioEntry(props.portfolioEntry);
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
                            current.showButton &&
                            <Button key={index} variant={'inline-inverse'} onClick={() => {
                                props.onSelect({ period: { chartScope: current.chartScope, name: current.name, performance: current.performance }, fromPerchase: current.name === "seit Kauf" ? true : false })
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

function getPeriods(portfolioEntry: PortfolioEntry, currencyCode: string) {
    const [initial, yesterday, last] = calculatePortfolioEntry(portfolioEntry);
    const performance = portfolioEntry.instrument?.performance;
    const week1 = performance?.find(current => current.period === CalculationPeriod.Week1)?.averagePrice || 0;
    const month1 = performance?.find(current => current.period === CalculationPeriod.Month1)?.averagePrice || 0;
    const month6 = performance?.find(current => current.period === CalculationPeriod.Month6)?.averagePrice || 0;
    const year1 = performance?.find(current => current.period === CalculationPeriod.Week52)?.averagePrice || 0;
    const year3 = performance?.find(current => current.period === CalculationPeriod.Year3)?.averagePrice || 0;
    const year5 = performance?.find(current => current.period === CalculationPeriod.Year5)?.averagePrice || 0;
    const year10 = performance?.find(current => current.period === CalculationPeriod.Year10)?.averagePrice || 0;
    const PERIODS: Period[] = [{
        chartScope: ChartScope.TenYear,
        name: "seit Kauf",
        performance: calculatePortfolioEntryTotal(portfolioEntry.price, portfolioEntry),
        showButton: true
    }, {
        chartScope: ChartScope.Intraday,
        name: "Heute",
        performance: yesterday,
        showButton: true
    }, {
        chartScope: ChartScope.Week,
        name: "1 Woche",
        performance: calculatePortfolioEntryTotal(week1, portfolioEntry),
        showButton: moment(portfolioEntry.entryTime) < moment().subtract(7, "days")
    }, {
        chartScope: ChartScope.Month,
        name: "1 Monat",
        performance: calculatePortfolioEntryTotal(month1, portfolioEntry),
        showButton: moment(portfolioEntry.entryTime) < moment().subtract(1, "months")
    }, {
        chartScope: ChartScope.SixMonth,
        name: "6 Monate",
        performance: calculatePortfolioEntryTotal(month6, portfolioEntry),
        showButton: moment(portfolioEntry.entryTime) < moment().subtract(6, "months")
    }, {
        chartScope: ChartScope.Year,
        name: "1 Jahr",
        performance: calculatePortfolioEntryTotal(year1, portfolioEntry),
        showButton: moment(portfolioEntry.entryTime) < moment().subtract(1, "years")
    }, {
        chartScope: ChartScope.ThreeYear,
        name: "3 Jahr",
        performance: calculatePortfolioEntryTotal(year3, portfolioEntry),
        showButton: moment(portfolioEntry.entryTime) < moment().subtract(3, "years")
    }, {
        chartScope: ChartScope.FiveYear,
        name: "5 Jahr",
        performance: calculatePortfolioEntryTotal(year5, portfolioEntry),
        showButton: moment(portfolioEntry.entryTime) < moment().subtract(5, "years")
    }, {
        chartScope: ChartScope.TenYear,
        name: "10 Jahr",
        performance: calculatePortfolioEntryTotal(year10, portfolioEntry),
        showButton: moment(portfolioEntry.entryTime) < moment().subtract(10, "years")
    }];

    return PERIODS
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

interface CardPeriodsContentProps {
    portfolioEntry: PortfolioEntry,
    currencyCode: string,
    selected: ChartViewCardState,
    onSelect: (event: ChartViewCardState) => void
}
