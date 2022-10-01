import {PagerComponent, InstrumentCard} from "../../../common";
import React, {useState} from "react";
import {compareTwoValues, getAssetLink} from "../../../../utils";
import {CalculationPeriod, Instrument, InstrumentGroupComposition, Maybe} from "../../../../graphql/types";
import {Spinner} from "react-bootstrap";

export interface ChartTabProperties {
    composition: InstrumentGroupComposition,
    period: CalculationPeriod | undefined,
    currentSort: string[] | undefined,
}

export function CompositionChartTabComponent(props: ChartTabProperties) {
    const [currentPage, setCurrentPage] = useState<number>(0);

    if (!props.composition) {
        return (
            <div className={"p-1"} style={{height: "70px"}}><Spinner animation="border"/></div>
        )
    }

    const pageSize = 50;
    const entries = props.composition.entries;
    const pageCount: number = Math.ceil(entries.length / pageSize);

    const pageChangeHandler = function (newPage: number) {
        setCurrentPage(newPage);
    }

    function InstrumentCardsContainerComponent(props: any) {
        const entries = props.entries;
        const sort = props.sort;
        const dir = props.dir;
        const page = props.page;
        const size = props.size;
        const period = props.period;

        interface InstrumentData {
            performance: number, volume: number, turnover: number, trades: number
        }
        const getInstrumentData = function(i: Instrument, period: CalculationPeriod): InstrumentData {
            const data: InstrumentData = {
                performance: 0, volume: 0, turnover: 0, trades: 0
            }
            if (period !== CalculationPeriod.Intraday) {
                i.performance.forEach(
                    (p: any) => {
                        if (p.period === period) {
                            data.turnover = p.averagePrice;
                            data.performance = p.performance;
                            data.volume = p.volume;
                            data.trades = p.volume;
                        }
                    }
                );
            } else {
                data.trades = i.snapQuote?.cumulativeTrades || 0;
                data.turnover = i.snapQuote?.cumulativeTurnover || 0;
                data.volume = i.snapQuote?.cumulativeVolume || 0;
                data.performance = i.snapQuote?.quote?.percentChange || 0;
            }

            return data;
        }

        const sortData = entries.slice();
        sortData.sort(
            (i1: Instrument, i2: Instrument) => {
                let res = 0;
                switch ((sort || '').substr(0, 7)) {
                    case 'Alle': res = compareTwoValues(i1.name || "", i2.name || "", dir); break;
                    case 'Tops': res = compareTwoValues(getInstrumentData(i1, period).performance || "", getInstrumentData(i2, period).performance || "", dir); break;
                    case 'Trades': res = compareTwoValues(getInstrumentData(i1, period).trades || "", getInstrumentData(i2, period).trades || "", dir); break;
                    case 'Umsatz': res = compareTwoValues(getInstrumentData(i1, period).volume || "", getInstrumentData(i2, period).volume || "", dir); break;
                    case 'Volumen': res = compareTwoValues(getInstrumentData(i1, period).turnover || "", getInstrumentData(i2, period).turnover || "", dir); break;
                }
                return res;
            }
        )
        const pageData = sortData.slice(page * size, (page + 1) * size)
        return pageData.map(
            (current: Instrument, idx: number) => {
                let price = null;
                let performance = null;

                if (period !== CalculationPeriod.Intraday) {
                    let found = false;
                    current.performance.forEach(
                        (p: any) => {
                            if (p.period === props.period) {
                                price = p.averagePrice;
                                performance = p.performance;
                                found = true;
                            }
                        }
                    );

                    if (!found) { return null }
                } else {
                    price = current.snapQuote?.quote?.value || 0;
                    performance = current.snapQuote?.quote?.percentChange;
                }
                return (
                    <div className="col-2 mb-sm-0 mb-md-0 mb-xl-2">
                        <InstrumentCard
                                        scope={period}
                                        key={idx.toString()}
                                        name={current.group.name}
                                        id={current.id}
                                        delay={current.snapQuote?.quote?.delay || 0}
                                        price={price}
                                        performance={performance}
                                        groupId={current.group.id || 0}
                                        decimals={current.group.assetGroup === "CROSS" ? 4 : 2}
                                        currency={current.currency.displayCode}
                                        lowPrice={current.snapQuote?.lowPrice || 0}
                                        highPrice={current.snapQuote?.highPrice || 0}
                                        isChartColorfull={true}
                                        url={getAssetLink(current.group, current.exchange)}
                                        chart={current.chart || undefined}
                        />
                    </div>
                )
            }
        )
    }

    return (
        <div className="tab-pane fade show active grid-tab">
            <div className="grid-wrapper">
                <div
                    className="row gutter-8 gutter-tablet-8 gutter-mobile-8 row-cols-xl-6 row-cols-lg-3 row-cols-sm-2 stock-graph-box-wrapper home-page-type row row-cols-xl-6 row-cols-lg-3 row-cols-sm-2">
                        <InstrumentCardsContainerComponent
                            entries={entries}
                            sort={(props.currentSort && props.currentSort[0]) || 'Alle'}
                            dir={(((props.currentSort && props.currentSort[1]) || 'Aufsteigend') === 'Aufsteigend' ? 0 : 1)}
                            page={currentPage}
                            size={pageSize}
                            period={props.period}
                        />
                </div>

            </div>

            <nav className="margin-top-20">
                <PagerComponent pageCount={pageCount} currentPage={currentPage} onPageChange={pageChangeHandler}/>
            </nav>
        </div>
    )
}

function mapChartScope(period: string): 'INTRADAY' | 'WEEK'| 'MONTH' | 'THREE_MONTH'
    | 'SIX_MONTH' | 'YEAR' | 'THREE_YEAR' | 'FIVE_YEAR' | 'TEN_YEAR' {
    switch (period) {
        case 'WEEK1':
            return 'WEEK';
        case 'MONTH1':
            return 'MONTH';
        case 'MONTH6':
            return 'SIX_MONTH';
        case 'WEEK52':
            return 'YEAR';
        case 'YEAR3':
            return 'THREE_YEAR';
        default:
            return 'INTRADAY';
    }
}
