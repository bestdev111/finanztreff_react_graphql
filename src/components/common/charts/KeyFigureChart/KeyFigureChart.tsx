import React, {Component} from "react";
import {EstimateChartSeries} from "../";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import {numberFormat} from "../../../../utils";


function calculateZones(values: number[], changeZones: boolean, estimateFrom?: number) {
    let zones = [];
    for (let i = 0; i<values.length; ++i) {
        if (values[i-1] === values[i]) {
            zones.push({value: i, color: changeZones ? '#0000004D' : undefined, dashStyle: (estimateFrom && estimateFrom <= i ? 'ShortDash' : 'Solid' )});
        } else if (values[i-1] > values[i]) {
            zones.push({value: i, color: changeZones ? '#f5335b' : undefined, dashStyle: (estimateFrom && estimateFrom <= i ? 'ShortDash' : 'Solid' )});
        } else {
            zones.push({value: i, color: changeZones ? '#1FDCA2' : undefined, dashStyle: (estimateFrom && estimateFrom <= i ? 'ShortDash' : 'Solid' )});
        }
    }
    return zones;
}


function createChartOptions(series: EstimateChartSeries[], createZones: boolean, estimateStart?: number, height?: string, width?: string): any {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            type: 'line',
            height: height,
            width: width
        },
        title: {
            text: null,
        },
        credits: {
            enabled: false,
        },
        legend: {
            enabled: false,
        },
        xAxis: {
            type: 'category',
            categories: series[0].points.map(current => current.x),
            lineColor: 'rgba(0, 0, 0, 0.3)',
            plotBands: estimateStart ? [{
                color: '#00000008',
                from: estimateStart - 1,
                to: series[0].points.length
            }] : [],
            plotLines: estimateStart ? [{
                color: '#00000045',
                dashStyle: 'ShortDash',
                value: estimateStart - 1,
                width: 2
            }] : []
        },
        plotOptions: {
            series: {
                dataLabels: { enabled: false }
            },
            columns: {
                zones: [
                    { value: 3, dashStyle: 'ShortDash'}
                ]
            }

        },
        yAxis: {
            gridLineWidth: 1,
            min: Math.min(0, Math.min(...series.map(current => Math.min(...current.points.map(current => current.y))))),
            labels: { enabled: true },
            title: { enabled: false },
        },
        tooltip: {
            outside: false,
            shadow: false,
            useHTML: true,
            formatter: function(): string {
                // @ts-ignore
                return numberFormat(this.point.y);
            }
        },
        series:
            series.filter(value => value.points.length != 0).map(current => {
                return  {
                    type: 'line',
                    name: current.name,
                    data: current.points.map(current => ({y: current.y})),
                    color: current.color || 'rgba(31, 220, 162, 1)',
                    zoneAxis: 'x',
                    zones: calculateZones(current.points.map(current => current.y), createZones, estimateStart),
                    marker: {
                        fillColor: '#fff',
                        lineColor: '#000',
                        lineWidth: 2,
                        radius: 4
                    }
                }
            })
    };
}

export class KeyFigureChart extends Component<EstimateChartProps, {}> {
    render() {
        let series: EstimateChartSeries[] = this.props.series || [];
        if (this.props.estimate) {
            let historyMap: { [key: string]: EstimateChartSeries } =
                this.props.history?.reduce((prev, current) => {
                    prev[current.name] = current;
                    return prev
                }, {} as { [key: string]: EstimateChartSeries }) || {};
            let estimateMap: { [key: string]: EstimateChartSeries } =
                this.props.estimate?.reduce((prev, current) => {
                    prev[current.name] = current;
                    return prev
                }, {} as { [key: string]: EstimateChartSeries }) || {};
            for (let index in historyMap) {
                series.push({...historyMap[index], points: historyMap[index].points.concat(estimateMap[index].points)});
            }
        }
        return (
            <figure className="highcharts-figure">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={
                        createChartOptions(
                            series,
                            this.props.createZones || false,
                            (this.props.estimate && this.props.estimate[0].points.length > 0 && this.props.history && this.props.history[0].points?.length) || undefined,
                            this.props.height,
                            this.props.width
                        )
                    }
                />
            </figure>
        );
    }
}

interface EstimateChartProps {
    series?: EstimateChartSeries[];
    history?: EstimateChartSeries[];
    estimate?: EstimateChartSeries[];
    createZones?: boolean;
    height?: string;
    width?: string;
}
