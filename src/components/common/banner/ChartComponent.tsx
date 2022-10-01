import { useQuery } from "@apollo/client";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import React from "react";
import {
    Chart,
    ChartPoint,
    ChartScope,
    ChartSeries,
    QuoteType
} from "../../../graphql/types";
import { numberFormat } from "../../../utils";
import moment from 'moment';
import { Spinner } from "react-bootstrap";
import { loader } from "graphql.macro";

function createSeries(data: Chart, underlyingData: Chart, mappedData: any[][], chartThreshold: number) {
    let seriesPrefix = 0;
    let current = data.series.map((serie: ChartSeries, i: number) => {
        seriesPrefix++;
        return {
            yAxis: 0,
            id: 'dataseries' + serie.type + seriesPrefix,
            name: serie.type === QuoteType.Trade ? 'Kurs' : serie.type,
            type: serie.type === QuoteType.Trade ? 'area' : 'line',
            data: mappedData[i],
            threshold: chartThreshold,
            color: serie.type === QuoteType.Trade ? (!!chartThreshold ? 'rgba(31, 220, 162, 1)' : 'white') :
               ( serie.type === QuoteType.Bid ? 'rgba(255, 77, 125, 1)' : 'rgba(31, 220, 162, 1)'),
            fillColor: serie.type === QuoteType.Trade ? (!!chartThreshold ? 'rgba(31, 220, 162, 0.3)' : 'rgba(255, 255, 255, 0)') :
                (serie.type === QuoteType.Bid ? 'rgba(31, 220, 162, 0.3)' : undefined),
            //
            negativeColor: serie.type === QuoteType.Trade ? 'rgba(255, 77, 125, 1)' : undefined,
            negativeFillColor: serie.type === QuoteType.Trade ? 'rgba(255, 77, 125, 0.3)' : undefined,
            lineWidth: 1.5,
            trackByArea: false,
            tooltip: {
                distance: 30,
                valueDecimals: 3,
            }
        }
    });
    let underlying;
    if (underlyingData) {
        underlying = underlyingData.series.map((serie: ChartSeries, i: number) => {
            seriesPrefix++;
            return {
                yAxis: 1,
                id: 'dataseries' + serie.type + seriesPrefix,
                name: serie.type === QuoteType.Trade ? 'Basiswert' : serie.type,
                type: 'line',
                data: mappedData[current.length + i],
                threshold: underlyingData.threshold?.value || 0,
                color: serie.type === QuoteType.Bid ? 'rgba(255, 77, 125, 1)' : 'rgba(0, 0, 220, 1)',
                fillColor: serie.type === QuoteType.Trade ? 'rgba(0, 0, 220, 1)' : undefined,
                negativeColor: serie.type === QuoteType.Trade ? 'rgba(0, 0, 220, 1)' : undefined,
                negativeFillColor: serie.type === QuoteType.Trade ? 'rgba(0, 0, 220, 0.6)' : undefined,
                lineWidth: 1.5,
                trackByArea: false,
                tooltip: {
                    distance: 30,
                    valueDecimals: 2,
                }
            }
        });
    }
    if (underlying) {
        return current.concat(underlying);
    }
    return current;
}

function createYAxis(minPointData: number, maxPointData: number, chartThreshold: number, props: ChartComponentProps, underlyingData: Chart | undefined, minPointData1: number | undefined, maxPointData1: number | undefined) {
    let arr: any[] = [];
    arr.push({
        type: 'linear',
        title: { text: '' },
        lineColor: 'rgba(255, 255, 255, 0.3)',
        gridLineColor: 'rgba(255, 255, 255, 0.14)',
        min: minPointData,
        max: maxPointData,
        plotLines: createPlotLines(chartThreshold),
        opposite: true,
        labels: {
            style: {
                color: '#9c9c9c',
                fontFamily: "Roboto"
            }
        }
    })
    if (underlyingData) {
        arr.push({
            type: 'linear',
            offset: -10,
            title: { text: '' },
            lineColor: 'rgba(255, 255, 255, 0.3)',
            gridLineColor: 'rgba(255, 255, 255, 0.14)',
            min: minPointData1,
            max: maxPointData1,
            plotLines: createPlotLines(null, props.strike, props.stoploss),
            opposite: false,
            labels: {
                style: {
                    color: '#9c9c9c',
                    fontFamily: "Roboto"
                }
            }
        });
    }
    return arr;
}

function popuplateSeriesData(serie: ChartSeries, maxPointData: number, foundMax: boolean, data: Chart, minPointData: number, foundMin: boolean) {
    let array: any[] = [];
    serie.data.forEach((entry: ChartPoint) => {
        let dataObj = {
            x: moment(entry.when).valueOf(),
            y: entry.value,
        };
        if (entry.value === maxPointData && !foundMax && data.series.length === 1) {
            dataObj = Object.assign(dataObj, {
                marker: {
                    enabled: true,
                    lineWidth: 2,
                    radius: 5,
                    symbol: 'circle',
                    lineColor: 'white',
                    fillColor: 'transparent',
                    fillOpacity: 0,
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        color: 'var(--green)',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textOutline: 0,
                    },
                    formatter: function () {
                        return '<span class="chart-marker-label">hoch</span>';
                    },
                    y: -3,
                    verticalAlign: 'bottom',
                    useHTML: true,
                },
            });
            foundMax = true;
        }
        if (entry.value === minPointData && !foundMin && data.series.length === 1) {
            dataObj = Object.assign(dataObj, {
                marker: {
                    enabled: true,
                    lineWidth: 2,
                    radius: 5,
                    symbol: 'circle',
                    lineColor: 'white',
                    fillColor: 'transparent',
                    fillOpacity: 0,
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        color: 'var(--pink)',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textOutline: 0,
                    },
                    formatter: function () {
                        return '<span class="chart-marker-label">tief</span>';
                    },
                    y: 3,
                    verticalAlign: 'top',
                    useHTML: true,
                },
            });
            foundMin = true;
        }
        array.push(dataObj);
    });
    return array;
}

function createPoints(data: Chart, underlyingData: Chart) {
    let points: any[] = [];
    if (data.series.length === 1) {
        points.push(createPoint());
    }
    if (underlyingData?.series.length === 1) {
        points.push(createPoint());
    }
    return points;
}

function createPoint() {
    return {
        marker: {
            enabled: true,
            lineWidth: 2,
            radius: 5,
            symbol: 'circle',
            lineColor: 'white',
            fillColor: 'transparent',
            fillOpacity: 0,
        },
        dataLabels: {
            enabled: true,
            style: {
                color: 'var(--green)',
                fontSize: '10px',
                fontWeight: 'bold',
                textOutline: 0,
            },
            formatter: function () {
                return '<span class="chart-marker-label">hoch</span>';
            },
            y: -3,
            verticalAlign: 'bottom',
            useHTML: true,
        },
    }
}

const createOptions = (data: Chart, underlyingData: Chart, props: ChartComponentProps) => {
    let chartThreshold = data.threshold;
    const mappedData: any[][] = [];
    let minPointData = chartThreshold?.value || 99999999;
    let maxPointData = chartThreshold?.value || 0;
    let minPointData1 = underlyingData?.threshold?.value || 99999999;
    let maxPointData1 = underlyingData?.threshold?.value || 0;
    let foundMin = false;
    let foundMax = false;
    let foundMin1 = false;
    let foundMax1 = false;
    const timezone = new Date().getTimezoneOffset()
    data.series.forEach((serie: ChartSeries, i: number) => {
        minPointData = findMinPoint(minPointData, data);
        maxPointData = findMaxPoint(maxPointData, data);
        mappedData.push(popuplateSeriesData(serie, maxPointData, foundMax, data, minPointData, foundMin));
    });
    if (underlyingData && underlyingData.series) {
        let currentStart = mappedData[0].sort((a, b) => a - b)[0];
        underlyingData.series.forEach((serie: ChartSeries, i: number) => {
            minPointData1 = findMinPoint(minPointData1, underlyingData);
            maxPointData1 = findMaxPoint(maxPointData1, underlyingData);
            if (props.strike) {
                maxPointData1 = Math.max(props.strike, maxPointData1);
                minPointData1 = Math.min(props.strike, minPointData1);
            }
            if (props.stoploss) {
                maxPointData1 = Math.max(props.stoploss, maxPointData1);
                minPointData1 = Math.min(props.stoploss, minPointData1);
            }
            let underlyingArr = popuplateSeriesData(serie, maxPointData1, foundMax1, underlyingData, minPointData1, foundMin1);
            let filtered = underlyingArr.sort((a, b) => a - b).filter(value => value?.x > currentStart?.x || value.x === currentStart.x);
            mappedData.push(filtered);
        });
    }
    return {
        chart: {
            backgroundColor: null,
            margin: underlyingData ? [0, 0, 30, 30] : [0, 0, 30, 0],
            points: createPoints(data, underlyingData)
        },
        rangeSelector: {
            enabled: false,
        },
        scrollbar: {
            enabled: false,
        },

        navigator: {
            enabled: false,
        },
        time: {
            timezoneOffset: timezone
        },

        legend: {
            enabled: false,
        },

        tooltip: {
            shared: true,
            split: false,
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%d.%m.%Y %H:%M:%S',
                minute: '%d.%m.%Y %H:%M:%S',
                hour: '%d.%m.%Y %H:%M:%S',
                day: '%d.%m.%Y',
                week: '%d.%m.%Y',
                month: '%d.%m.%Y',
                year: '%Y'
            }
        },

        xAxis: {
            lineColor: 'rgba(255, 255, 255, 0.3)',
            type: "datetime",
            //    tickInterval: Infinity,
            offset: 8,
            tickLength: 0,
            labels: {
                style: {
                    color: '#9c9c9c',
                    fontFamily: "Roboto"
                }
            }
        },
        yAxis: createYAxis(minPointData, maxPointData, chartThreshold?.value || 0, props, underlyingData, minPointData1, maxPointData1),

        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                },
                label: {
                    connectorAllowed: false,
                },
            },
        },

        credits: {
            enabled: false,
        },
        stockTools: {
          gui: {
              enabled: false
          }
        },
        series:
            createSeries(data, underlyingData, mappedData, chartThreshold?.value || 0)
    };

}

interface ChartComponentProps {
    instrumentId: number,
    underlyingInstrumentId?: number | null,
    strike?: number | null,
    stoploss?: number | null,
    chartType: ChartScope
}

export const ChartComponent = (props: ChartComponentProps) => {
    let { loading, data } = useQuery(
        loader('./getInstrumentChartBanner.graphql'),
        { variables: { instrumentId: props.instrumentId, chartScope: props.chartType } }
    );
    let { data: underlyingData } = useQuery(
        loader('./getInstrumentChartBanner.graphql'),
        {
            variables: { instrumentId: props.underlyingInstrumentId, chartScope: props.chartType },
            skip: !props.underlyingInstrumentId
        }
    );
    
    return (
        <>
            <div className="main-chart-movement stock-chart" style={{ height: '200px' }}>
                {loading ?
                    <div className={"p-1 d-flex mx-auto"} style={{ height: "70px", color: "white"}}>
                        <Spinner animation="border" />
                    </div> :
                    (
                        data.instrument.chart.series.length > 0 &&
                        <HighchartsReact
                            containerProps={{ style: { height: "200px", width: '100%' } }}
                            highcharts={Highcharts}
                            constructorType={'stockChart'}
                            options={createOptions(data.instrument.chart, underlyingData?.instrument?.chart, props)}
                        />
                    )
                }
            </div>
        </>
    )
}

const createPlotLines = (chartThreshold?: number | null, strike?: number | null, stoploss?: number | null) => {
    let plotLines: any[] = [];
    if (chartThreshold) {
        plotLines.push({
            value: chartThreshold,
            color: 'rgba(255, 255, 255, 0.7)',
            width: 2,
            label: {
                text: 'Schlusskurs ' + numberFormat(chartThreshold || 0),
                style: {
                    color: 'rgba(255, 255, 255, 0.7)',
                }
            }
        })
    }
    if (stoploss) {
        plotLines.push({
            value: stoploss,
            color: 'rgba(255, 255, 255, 0.7)',
            width: 2,
            label: {
                text: 'Stoploss ' + numberFormat(stoploss || 0),
                style: {
                    color: 'rgba(255, 255, 255, 0.7)',
                }
            }
        })
    }
    if (strike) {
        plotLines.push({
            value: strike,
            color: 'rgba(255, 255, 255, 0.7)',
            width: 2,
            label: {
                text: 'Strike ' + numberFormat(strike || 0),
                style: {
                    color: 'rgba(255, 255, 255, 0.7)',
                }
            }
        })
    }
    return plotLines;
}

export const findMinPoint = (minPointData: number, data: Chart) => {
    let minValue = Math.min(minPointData, 99999999);
    if (data) {
        data.series.flatMap(serie => serie.data.map(value => value.value)).forEach(value => {
            minValue = Math.min(value, minValue)
        })
    }
    return minValue;
}

export const findMaxPoint = (maxPointData: number, data: Chart) => {
    let maxValue = Math.max(maxPointData, 0);
    if (data) {
        data.series.flatMap(serie => serie.data.map(value => value.value)).forEach(value => {
            maxValue = Math.max(value, maxValue)
        })
    }
    return maxValue;
}
