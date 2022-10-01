import {CalculationPeriod, Instrument, InstrumentPerformance, Maybe} from "../../../../../graphql/types";
import {numberFormat, REALDATE_FORMAT} from "../../../../../utils";

function getPerformance(list: InstrumentPerformance[], period: CalculationPeriod) {
    let found: any = null;
    list && list.map((item) => {
        if (item && (period === item.period)) {
            found = item;
            return item;
        }
    });
    return found;
}

const getPerformanceSharpe = function (list: InstrumentPerformance[], period: CalculationPeriod) {
    let sharpe = getPerformance(list, period);
    return sharpe ? numberFormat(sharpe.sharpe) : '--';
}

const getPerformanceVola = function (list: InstrumentPerformance[], period: CalculationPeriod) {
    let vola = getPerformance(list, period);
    return vola ? numberFormat(vola.vola) + "%" : '--';
}

function TechnicalFiguresSection(props: any) {
    if(!props.data || props.data.length === 0) return null;
    const kenn = props.data[0];

    return (
        <div className="content-wrapper">
            <h3 className="content-wrapper-heading font-weight-bold">Kennzahlen</h3>
            <div className="content">
                <div className="table-like-row legend-row">
                    <div className="row">
                        <div className="col font-weight-bold">Kennzahlen</div>
                    </div>
                </div>
                <div className="table-like-row border-top with-legend">
                    <div className="row">
                        <div className="col-9">Abstand Allzeit-Hoch:</div>
                        <div className="col-3 text-right pl-none">{kenn.deltaHighPrice ? numberFormat(kenn.deltaHighPrice) + "%" : ""}</div>
                    </div>
                </div>
                <div className="table-like-row border-top with-legend">
                    <div className="row">
                        <div className="col-9">Allzeithoch ({ REALDATE_FORMAT(kenn.highPriceDate) }):</div>
                        <div className="col-3 text-right pl-none">{kenn.highPrice ? numberFormat(kenn.highPrice) : ""}</div>
                    </div>
                </div>
                <div className="table-like-row border-top with-legend">
                    <div className="row">
                        <div className="col-9">Abstand Allzeit-Tief:</div>
                        <div className="col-3 text-right pl-none">{kenn.deltaLowPrice ? numberFormat(kenn.deltaLowPrice) + "%" : ""}</div>
                    </div>
                </div>
                <div className="table-like-row border-top with-legend">
                    <div className="row">
                        <div className="col-9">Allzeittief ({ REALDATE_FORMAT(kenn.lowPriceDate) }):</div>
                        <div className="col-3 text-right pl-none">{kenn.lowPrice ? numberFormat(kenn.lowPrice) : ""}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function IndexTechnicalKeyFiguresSection(props: {instrument: Instrument} ) {
    if (props.instrument.performance && props.instrument.performance.length > 0)
    return (
        <section className="main-section py-0">
            <div className="container">
                <div className="content-row">
                    <div className="row">
                        <div className="section-left-part col-xl-9 col-lg-12">
                            <div className="content-wrapper d-none d-xl-block"><h3
                                className="content-wrapper-heading font-weight-bold">Risikokennzahlen</h3>
                                <div className="content">
                                    <table className="table light-table text-center custom-border">
                                        <thead className="thead-light">
                                        <tr>
                                            <th scope="col">&nbsp;</th>
                                            <th scope="col">1 Woche</th>
                                            <th scope="col">1 Monat</th>
                                            <th scope="col">3 Monate</th>
                                            <th scope="col">6 Monate</th>
                                            <th scope="col">1 Jahr</th>
                                            <th scope="col">3 Jahre</th>
                                            <th scope="col">5 Jahre</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <th scope="row">Volatilität</th>
                                            <td>{getPerformanceVola(props.instrument.performance, CalculationPeriod.Week1)}</td>
                                            <td>{getPerformanceVola(props.instrument.performance, CalculationPeriod.Month1)}</td>
                                            <td>{getPerformanceVola(props.instrument.performance, CalculationPeriod.Month3)}</td>
                                            <td>{getPerformanceVola(props.instrument.performance, CalculationPeriod.Month6)}</td>
                                            <td>{getPerformanceVola(props.instrument.performance, CalculationPeriod.Week52)}</td>
                                            <td>{getPerformanceVola(props.instrument.performance, CalculationPeriod.Year3)}</td>
                                            <td>{getPerformanceVola(props.instrument.performance, CalculationPeriod.Year5)}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Sharpe Ratio</th>
                                            <td>{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Week1)}</td>
                                            <td>{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Month1)}</td>
                                            <td>{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Month3)}</td>
                                            <td>{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Month6)}</td>
                                            <td>{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Week52)}</td>
                                            <td>{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Year3)}</td>
                                            <td>{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Year5)}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="section-right-part col-xl col-lg-12">
                            <TechnicalFiguresSection data={props.instrument.stats}/>
                            <div className="content-wrapper d-xl-none">
                                <h3 className="content-wrapper-heading font-weight-bold">Risikokennzahlen</h3>
                                <div className="content">
                                    <div className="table-like-row legend-row">
                                        <div className="row">
                                            <div className="col-4 font-weight-bold">Zeitraum</div>
                                            <div className="col-4 text-right font-weight-bold">Volatilität</div>
                                            <div className="col-4 text-right font-weight-bold pl-0">Sharpe Ratio</div>
                                        </div>
                                    </div>
                                    <div className="table-like-row border-top with-legend">
                                        <div className="row">
                                            <div className="col-4">1 Woche</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceVola(props.instrument.performance, CalculationPeriod.Week1)}</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Week1)}</div>
                                        </div>
                                    </div>
                                    <div className="table-like-row border-top with-legend">
                                        <div className="row">
                                            <div className="col-4">1 Monat</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceVola(props.instrument.performance, CalculationPeriod.Month1)}</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Month1)}</div>
                                        </div>
                                    </div>
                                    <div className="table-like-row border-top with-legend">
                                        <div className="row">
                                            <div className="col-4">3 Monate</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceVola(props.instrument.performance, CalculationPeriod.Month3)}</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Month3)}</div>
                                        </div>
                                    </div>
                                    <div className="table-like-row border-top with-legend">
                                        <div className="row">
                                            <div className="col-4">6 Monate</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceVola(props.instrument.performance, CalculationPeriod.Month6)}</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Month6)}</div>
                                        </div>
                                    </div>
                                    <div className="table-like-row border-top with-legend">
                                        <div className="row">
                                            <div className="col-4">Lfd. Jahr</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceVola(props.instrument.performance, CalculationPeriod.CurrentYear)}</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.CurrentYear)}</div>
                                        </div>
                                    </div>
                                    <div className="table-like-row border-top with-legend">
                                        <div className="row">
                                            <div className="col-4">1 Jahr</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceVola(props.instrument.performance, CalculationPeriod.Week52)}</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Week52)}</div>
                                        </div>
                                    </div>
                                    <div className="table-like-row border-top with-legend">
                                        <div className="row">
                                            <div className="col-4">3 Jahre</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceVola(props.instrument.performance, CalculationPeriod.Month3)}</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Month3)}</div>
                                        </div>
                                    </div>
                                    <div className="table-like-row border-top with-legend">
                                        <div className="row">
                                            <div className="col-4">5 Jahre</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceVola(props.instrument.performance, CalculationPeriod.Year5)}</div>
                                            <div className="col-4 text-right pl-none">{getPerformanceSharpe(props.instrument.performance, CalculationPeriod.Year5)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
    return (<></>)
}
