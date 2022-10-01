import React, {Component} from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import moment from "moment";

function createSerie(data: InstrumentTileChartPoint[], dataThreshold?: number | null): any {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        name: 'Kurs',
        type: 'area',
        data: data.map(current => {return {y: current.y, x: current.x && current.x.toDate()}}),
        threshold: dataThreshold,
        color: 'rgba(31, 220, 162, 1)',
        fillColor: 'rgba(31, 220, 162, 0.3)',
        negativeColor: 'rgba(255, 77, 125, 1)',
        negativeFillColor: 'rgba(255, 77, 125, 0.3)',
        lineWidth: 1.5,
        trackByArea: true,
        tooltip: {valueDecimals: 2}
    };
}

function createOptions(points: InstrumentTileChartPoint[], thresholds: number, maxY?: number, minY? : number, height?: number | string, enableMouseTracking?: boolean, plotLines?: any): any {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {backgroundColor: null, margin: [0, 0, 25,0 ], height: height},
        rangeSelector: {enabled: false},
        scrollbar: {enabled: false},
        navigator: {enabled: false},
        legend: {enabled: false,},
        xAxis: {
            lineWidth: 0, lineColor: 'white', visible: false, plotLines: null, plotBands: null,
            // labels: {style: {color: 'rgba(255, 255, 255)'}}
            labels: {enabled: false}
        },
        yAxis: {
            type: 'linear',
            startOnTick: false,
            gridLineWidth: 0,
            labels: {enabled: false},
            max: maxY,
            min: minY,
            plotLines: plotLines
        },
        plotOptions: {
            series: {
                cursor: 'default', allowPointSelect: false, enableMouseTracking: enableMouseTracking,
                label: {connectorAllowed: false}
            }
        },
        credits: {enabled: false},
        series: [createSerie(points, thresholds)]
    }
}


export class InstrumentTileChart extends Component<InstrumentTileChartProps, { }> {
    render() {
        return (
            <div className="chart-holder">
                <HighchartsReact
                    containerProps={{
                        style: {
                                height: this.props.height ? (Number.isInteger(this.props.height) ? this.props.height + "px" : this.props.height) : undefined,
                                width: this.props.width ? (Number.isInteger(this.props.width)  ? this.props.width + "px" : this.props.width) : undefined
                            }
                        }
                    }
                    thresholds = {this.props.threshold}
                    highcharts={Highcharts}
                    constructorType={'stockChart'}
                    options={createOptions(this.props.points!, this.props.threshold!, this.props.maxY, this.props.minY, this.props.height, this.props.enableMouseTracking, this.props.plotLines )}
                />
            </div>
        );
    }
}

interface InstrumentTileChartProps {
    points: InstrumentTileChartPoint[];
    threshold?: number;
    height?: number | string;
    width?: number | string;
    minY? : number;
    maxY?: number;
    enableMouseTracking?: boolean;
    plotLines?: any;
}


interface InstrumentTileChartPoint {
    y: number;
    x?: moment.Moment;
}