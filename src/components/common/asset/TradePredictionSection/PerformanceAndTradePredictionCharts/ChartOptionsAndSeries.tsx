import Highcharts from "highcharts";
import { SeriesOptionsType } from "highcharts";
import moment from "moment";
import { numberFormatShort } from "utils";



export function createOwnPredictionSeries(data: any[]): SeriesOptionsType {
    return {
        name: 'Kurs',
        type: 'area',
        data: data.map((current): any => {
            return ({
                y: current.value,
                x: moment(current.when.slice(0, 10)).toDate(),
                z: null,
                dragDrop: {
                    draggableY: false,
                    draggableX: false
                }
            })
        }).concat({
            name: "No tooltip",
            y: data[data.length - 1].value,
            x: moment().toDate(),
            z: null,
            animation: false,
            dragDrop: {
                draggableY: false,
                draggableX: false
            },
            tooltip: {
                enabled: true,
            }
        }),
        marker: {
            enabled: false,
        },
        color: '#5B9DE1',
        fillColor: 'transparent',
        lineWidth: 2,
    };
}

export function createInstrumentPerformanceOptions(
    data: any, startValue: string, minValue: number, maxValue: number, currency: string, up: string
): Highcharts.Options {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: { type: 'linear', height: 320 },
        rangeSelector: { enabled: false },
        scrollbar: { enabled: false },
        navigator: { enabled: false },
        credits: { enabled: false },
        title: { text: "" },
        plotOptions: {
            series: {
                marker: {
                    symbol: "cicle"
                },
            }
        },
        yAxis: {
            min: minValue,
            max: maxValue,
            gridLineWidth: 0,
            lineColor: "white",
            labels: {
                enabled: false
            }
        },
        tooltip: {
            shared: true,
            split: false,
            formatter: function () {
                return "<b>Kurs: " + numberFormatShort(this.y) + " " + currency + "</b>";
            }
        },
        xAxis: {
            max: moment().add(6, 'M').toDate().getTime(),
            plotBands: [
                { from: moment().subtract(1, 'days').toDate().getTime(), to: moment().add(6, 'M').toDate().getTime(), color: '#f1f1f1' },
            ],
            ordinal: false,
            lineColor: "#787878",
            labels: {
                style: {
                    color: "#383838",
                },
                step: 1,
                formatter: function () {
                    return moment(this.value).format("MMMM YYYY") === moment().format("MMMM YYYY") ?
                        "<b>Heute</b>" : moment(this.value).format("MMMM YYYY")
                }
            },
            lineWidth: 2,
            tickWidth: 0,
            plotLines: [{
                color: '#383838',
                label: {
                    text: '<span style="font-size: 18px; font-weigth: bold ">' + startValue + ' (' + up + '% über)' + '</span><br/>Aktueller Kurs',
                    align: 'right',
                    x: -10,
                    y: 20,
                    rotation: 0,
                    style: {
                        fontFamily: "Roboto",
                        color: "#383838",
                        fontWeight: "bold"
                    }
                },
                zIndex: 5,
                width: 1,
                value: moment().subtract(1, 'days').toDate().getTime()
            }]
        },
        series: data

    }
}

export function createInstrumentPerformanceSeries(data: any[]): SeriesOptionsType {

    return {
        name: 'Kurs',
        type: 'area',
        data: data.map((current): any => {
            return ({
                y: current.value,
                x: moment(current.when.slice(0, 10)).toDate(),
                z: null
            })
        }),
        marker: {
            enabled: false
        },
        color: '#5B9DE1',
        fillColor: 'transparent',
        lineWidth: 2,
    };
}

export function createInstrumentAnalysesSeries(startDate: any, type: any, value: number): SeriesOptionsType {
    let color = type === "positive" ? "var(--green)" :
        type === "negative" ? "var(--pink)" : 'black';
    return {
        type: 'area',
        data: [{
            x: moment(startDate.when.slice(0, 10)).toDate().getTime(),
            y: startDate.value,
            marker: {
                enabled: true,
                fillColor: color,
                lineWidth: 2,
                lineColor: '#FFFFFF'
            }
        }, {
            x: moment(startDate.when).add(6, "months").toDate().getTime(),
            y: value,
            marker: {
                enabled: true,
                fillColor: color,
                lineWidth: 2,
                lineColor: '#FFFFFF'
            }
        }],
        color: color,
        dashStyle: "ShortDash",
        fillColor: 'transparent',
        lineWidth: 2,
    };
}
