import {Component} from "react";
import {KeyFigureChart} from "../../../../common/charts";
import {InstrumentPerformance} from "../../../../../generated/graphql";
import {PERIOD_ORDER} from "../../../../../utils";

const PERIOD_NAMES: {[key: string]: string} = {
    'MONTH1': '1M',
    'MONTH3': '3M',
    'MONTH6': '6M',
    'WEEK52': '1J',
    'YEAR3': '3J',
    'YEAR5': '5J'
};

function processPerformance(performance: InstrumentPerformance[]): TechnicalKeyFiguresChartsExt[] {
    return performance
        .map(current => ({...current, order: PERIOD_ORDER.indexOf(current.period), name: PERIOD_NAMES[current.period]} as TechnicalKeyFiguresChartsExt))
        .filter(current => current.order >= 0 && !!current.name)
        .sort((a: TechnicalKeyFiguresChartsExt, b: TechnicalKeyFiguresChartsExt) => a.order - b.order);
}

export class TechnicalKeyFiguresCharts extends Component<TechnicalKeyFiguresChartsProps, any> {
    render() {
        let sharpe = processPerformance(this.props.performance)
            .map(current => ({x: current.name, y: current.sharpe || -1}))
            .filter(current => !!current.x && current.y > 0);
        let volatility = processPerformance(this.props.performance)
            .map(current => ({x: current.name, y: current.vola || -1}))
            .filter(current => !!current.x && current.y > 0);
        if(volatility.length > 0 || sharpe.length > 0)
            return (
                <div className="content wb-m col">
                    <div className="d-flex justify-content-between">
                        <h3 className="content-wrapper-heading font-weight-bold ml-sm-2 ml-md-0">Technische Kennzahlen</h3>
                    </div>
                    <div className="content">
                        <div className="charts-row big-charts">
                            <div className="row row-cols-xl-2 row-cols-lg-2 row-cols-sm-1">
                                {volatility.length > 0 &&
                                    <div className="col">
                                        <div className="top-chart-legend font-weight-bold ml-sm-2 ml-md-0">Volatilität</div>
                                        <div className="chart-wrapper">
                                            <KeyFigureChart height={'200px'}
                                                            series={[{
                                                                name: "Volatilität",
                                                                points: volatility
                                                            }]}
                                                            createZones={true}/>
                                        </div>
                                    </div>
                                }
                                {sharpe.length > 0 &&
                                    <div className="col">
                                        <div className="top-chart-legend font-weight-bold">Sharpe Ratio</div>
                                        <div className="chart-wrapper">
                                            <figure className="highcharts-figure">
                                                <KeyFigureChart height={'200px'}
                                                                series={[{
                                                                    name: "Sharpe Ratio",
                                                                    points: sharpe
                                                                }]}
                                                                createZones={true}/>
                                            </figure>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            );
        return (<></>);
    }
}

interface TechnicalKeyFiguresChartsProps {
    performance: InstrumentPerformance[];
}

interface TechnicalKeyFiguresChartsExt extends InstrumentPerformance {
    name: string;
    order: number;
}
