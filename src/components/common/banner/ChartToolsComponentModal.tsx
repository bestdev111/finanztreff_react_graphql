import {useQuery} from "@apollo/client";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import HighchartsMore from 'highcharts/highcharts-more';
import React, {memo, SyntheticEvent, useState} from "react";
import {
    Chart,
    ChartPoint,
    ChartScope,
    ChartSeries,
    HistoryQuote,
    HistoryQuoteAggregation,
    HistoryQuoteConnection,
    HistoryQuoteEdge,
    QuoteType
} from "../../../graphql/types";
import {
    CHART_TOOLS_RANGESELECTOR_BUTTONS,
    indicators,
    numberFormat,
    oscillators, rangeSelectorBtn,
    shortNumberFormat,
    technicalIndicatorType
} from "../../../utils";
import moment from 'moment';
import {Button, Dropdown, Spinner} from "react-bootstrap";
import {loader} from "graphql.macro";
import './ChartComponent.css'
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import StockTools from "highcharts/modules/stock-tools.js";
import * as Data from 'highcharts/modules/data'
import Annotations from "highcharts/modules/annotations";
import AccelerationBands from "highcharts/indicators/acceleration-bands.js";
import AccumulationBands from 'highcharts/indicators/accumulation-distribution'
import AccumulationDistribution from 'highcharts/indicators/accumulation-distribution'
import Aroon from 'highcharts/indicators/aroon-oscillator';
import AroonOscillator from 'highcharts/indicators/aroon-oscillator';
import Trix from 'highcharts/indicators/trix'
import Stochastic from 'highcharts/indicators/stochastic'
import Macd from 'highcharts/indicators/macd'
import {useLocation} from "react-router-dom";
import Chaikin from 'highcharts/indicators/chaikin'
import VBP from 'highcharts/indicators/volume-by-price';
import PSAR from 'highcharts/indicators/psar';
import Tema from 'highcharts/indicators/tema';
import {findMaxPoint, findMinPoint} from "./ChartComponent";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";

export type ChartOptionsType = {
    data: any,
    props: ChartComponentProps,
    state: ChartToolModalState
    setState: (value: ChartToolModalState) => void;
    setToggleChartOptions: (value: boolean) => void
    toggleChartOptions: boolean
    volumeData: HistoryQuoteConnection
}

export type ChartSeriesType = {
    data: Chart,
    mappedData: any[][]
    chartThreshold: number
    volumeData: HistoryQuoteConnection
    state: ChartToolModalState
}

function createSeries(seriesOptions: ChartSeriesType) {
    Highcharts.setOptions({
        lang: {
            resetZoom: 'Zoom zurücksetzen',
            rangeSelectorZoom: ''
        }
    });
    const {data, mappedData, volumeData, state, chartThreshold} = seriesOptions;
    const {currentOscillator, currentIndicator} = state;
    let seriesPrefix = 0;
    let indicatorArray: any[];
    let volumeSeriesArray: any[];
    let currentOscillatorArray: any[];
    indicatorArray = data?.series?.map((serie: ChartSeries) => {
        return {
            lineWidth: 1.5,
            name: currentIndicator.name,
            threshold: chartThreshold,
            yAxis: 0,
            id: currentIndicator.value,
            type: currentIndicator.value,
            linkedTo: 'dataseries' + serie.type + 1,
            params: {
                period: 1,
            }
        }
    })
    let volumeSeriesData: { x: number; y: number | null; }[] = [];
    for (let i = 0; i < volumeData?.edges?.length; i++) {
        let curr: HistoryQuoteEdge = volumeData?.edges[i];
        volumeSeriesData.push({x: new Date(new Date(curr?.node?.start).valueOf()).getTime() , y: curr?.node?.cumulativeVolume})
    }
    volumeSeriesArray = [
         {
            colorByPoint: true,
            colors: ['red', 'green'],
            data: volumeSeriesData,
            name: "Volume",
            yAxis: 1,
            id: 'volume-series',
            type: "column",
            linkedTo: 'dataseries' + QuoteType.Trade + 1,
            tooltip: {
                xDateFormat: '%Y-%m-%d',
                pointFormatter: function (): any {
                     // @ts-ignore
                     return `<br><strong>Volume</strong>: ${shortNumberFormat(this.y)}<br>`
                 },
            }
        }
    ]
    let current = data?.series.map((serie: ChartSeries, i: number) => {
        seriesPrefix++;
        return {
            yAxis: 0,
            id: 'dataseries' + serie.type + 1,
            name: serie.type === QuoteType.Trade ? 'Kurs' : 'NAV',
            type: serie.type === QuoteType.Trade ? 'area' : 'line',
            data: mappedData[i],
            threshold: chartThreshold,
            color: serie.type === QuoteType.Trade ? (!!chartThreshold ? 'rgba(31, 220, 162, 1)' : "#4888C7" ) :
                (serie.type === QuoteType.Bid ? 'rgba(255, 77, 125, 1)' : 'rgba(31, 220, 162, 1)'),
            fillColor: serie.type === QuoteType.Trade ? (!!chartThreshold ? 'rgba(31, 220, 162, 0.3)' : 'rgba(255, 255, 255, 0)') :
                (serie.type === QuoteType.Bid ? 'rgba(31, 220, 162, 0.3)' : undefined),
            //
            negativeColor: serie.type === QuoteType.Trade ? 'rgba(255, 77, 125, 1)' : undefined,
            negativeFillColor: serie.type === QuoteType.Trade ? 'rgba(255, 77, 125, 0.3)' : undefined,
            lineWidth: 1.5,
            trackByArea: false,
            linkedTo: 'dataseries' + serie.type + 1,
        }
    });
    currentOscillatorArray = data?.series.map((serie: ChartSeries) => {
        return {
            lineWidth: 1.5,
            name: currentOscillator.name,
            threshold: chartThreshold,
            yAxis: 2,
            id: "oscillator",
            type: currentOscillator.value,
            linkedTo: 'dataseries' + serie.type + 1,
            params: {
                volumeSeriesID: 'dataseries' + serie.type + 1
            }
        }
    })
    current = current && [...current, ...volumeSeriesArray, ...indicatorArray, ...currentOscillatorArray];
    return current;
}

function createYAxis(minPointData: number, maxPointData: number, chartThreshold: number, props: ChartComponentProps, OSC:technicalIndicatorType) {
    let arr: any[] = [];
    arr.push({
            type: 'linear',
            title: {text: ''},
            lineColor: 'rgba(255, 255, 255, 0.3)',
            gridLineColor: 'rgba(255, 255, 255, 0.14)',
            min: minPointData,
            max: maxPointData,
            plotLines: createPlotLines(chartThreshold),
            opposite: true,
            height: '70%'
        },
        {
            type: 'column',
            opposite: true,
            height: '15%',
            top: '70%'
        }
    )
    if (OSC) {
        arr.push({
            type: OSC.value,
            opposite: true,
            height: '20%',
            top: '85%'
        });
    }
    return arr;
}

function populateSeriesData(serie: ChartSeries, maxPointData: number, foundMax: boolean, data: Chart, minPointData: number, foundMin: boolean) {
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
                    lineColor: '#383838',
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
                    lineColor: '#383838',
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

function createPoints(data: Chart) {
    let points: any[] = [];
    if (data?.series.length === 1) {
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
            lineColor: '#383838',
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

const createOptions = (options: ChartOptionsType) => {
    const {data, props, state, setState, volumeData, setToggleChartOptions, toggleChartOptions} = options;
    let chartThreshold = data?.threshold;
    const mappedData: any[][] = [];
    let minPointData = chartThreshold?.value || 99999999;
    let maxPointData = chartThreshold?.value || 0;
    let foundMin = false;
    let foundMax = false;
    const timezone = new Date().getTimezoneOffset()
    data?.series.forEach((serie: ChartSeries) => {
        minPointData = findMinPoint(minPointData, data);
        maxPointData = findMaxPoint(maxPointData, data);
        mappedData.push(populateSeriesData(serie, maxPointData, foundMax, data, minPointData, foundMin));
    });
    async function periodSelectHandler(e: SyntheticEvent, chartScope: ChartScope) {
        e.stopPropagation();
        if (chartScope) {
            await setToggleChartOptions(toggleChartOptions);
            setState({...state, chartScope, currentIndicator: state.currentIndicator, currentOscillator: state.currentOscillator});
        } else return;
    }

    const seriesOptions: ChartSeriesType = {
        data,
        mappedData,
        chartThreshold: chartThreshold?.value || 0,
        state,
        volumeData,
    }

    return {
        chart: {
            animation: false,
            backgroundColor: null,
            margin: [0, 0, 30, 0],
            points: createPoints(data),
            zoomType: 'xy',
            resetZoomButton: {
                position: {
                    align: 'right', // by default
                    verticalAlign: 'top', // by default
                    x: -40,
                    y: 0
                }
            }
        },
        rangeSelector: {
            inputEnabled: false,
            allButtonsEnabled: true,
            zoomType: 'x',
            verticalAlign: 'top',
            buttonPosition: {
                align: 'left'
            },
            enabled: false,
            buttons: [
                {
                    type: 'day',
                    count: 1,
                    text: '1T',
                    title: 'View 1 Day',
                    events: {
                        click: function (e: SyntheticEvent) {
                            periodSelectHandler(e, ChartScope.Intraday)
                        }
                    }
                },
                {
                    type: 'week',
                    count: 1,
                    text: '1W',
                    title: 'View 1 week',
                    events: {
                        click: function (e: SyntheticEvent) {
                             periodSelectHandler(e, ChartScope.Week)
                        }
                    }
                },
                {
                    type: 'month',
                    count: 1,
                    text: '1M',
                    title: 'View 1 month',
                    events: {
                        click: function (e: SyntheticEvent) {
                             periodSelectHandler(e, ChartScope.Month)
                        }
                    }
                }, {
                    type: 'month',
                    count: 3,
                    text: '3M',
                    title: 'View 3 months',
                    events: {
                        click: function (e: SyntheticEvent) {
                             periodSelectHandler(e, ChartScope.ThreeMonth)
                        }
                    }
                },
                {
                    type: 'month',
                    count: 6,
                    text: '6M',
                    title: 'View 6 months',
                    events: {
                        click: function (e: SyntheticEvent) {
                             periodSelectHandler(e, ChartScope.SixMonth)
                        }
                    }
                },
                {
                    type: 'year',
                    count: 1,
                    text: '1J',
                    title: 'View 1 year',
                    events: {
                        click: function (e: SyntheticEvent) {
                             periodSelectHandler(e, ChartScope.Year)
                        }
                    }
                },
                {
                    type: 'year',
                    count: 3,
                    text: '3J',
                    title: 'View 3 year',
                    events: {
                        click: function (e: SyntheticEvent) {
                             periodSelectHandler(e, ChartScope.ThreeYear)
                        }
                    }
                },
                {
                    type: 'year',
                    count: 5,
                    text: '5J',
                    title: 'View 5 year',
                    events: {
                        click: function (e: SyntheticEvent) {
                             periodSelectHandler(e, ChartScope.FiveYear)
                        }
                    }
                },
                {
                    type: 'year',
                    count: 10,
                    text: '10J',
                    title: 'View 10 year',
                    events: {
                        click: function (e: SyntheticEvent) {
                             periodSelectHandler(e, ChartScope.TenYear)
                        }
                    }
                },
            ],
        },
        scrollbar: {
            enabled: true,
        },
        navigator: {
            enabled: true,
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
            month: "%m",
            //    tickInterval: Infinity,
            offset: 8,
        },
        yAxis: createYAxis(minPointData, maxPointData, chartThreshold?.value || 0, props, state.currentOscillator),

        plotOptions: {
            series: {
                marker: {
                  //  enabled: false,
                },
                label: {
                    connectorAllowed: true,
                    enabled: true
                },
            },
        },

        credits: {
            enabled: false,
        },
        stockTools: {
            gui: {
              //  enabled: true,
                buttons: ['simpleShapes', 'lines', 'crookedLines', 'measure', 'advanced', 'toggleAnnotations', 'verticalLabels', 'flags', 'currentPriceIndicator'],
            },
        },
        series:
            createSeries(seriesOptions)
    };
}

interface ChartComponentProps {
    instrumentId: number,
    showStockTools: boolean
    setToggleChartOptions: (val: boolean) => void;
    toggleChartOptions: boolean
    setShowStockTools: (val: boolean) => void;
}

interface ChartToolsComponentModalProps {
    instrumentId: number | undefined
    setToggleChartOptions: (value: boolean) => void;
    toggleChartOptions: boolean
}

export enum ChartTypes {
    Area = "area",
    Line = "line",
    CandleStick = "candlestick",
    OHLC = "ohlc"
}

interface ChartToolModalState {
    currentIndicator: technicalIndicatorType
    currentOscillator: technicalIndicatorType
    chartScope: ChartScope
    chartType: ChartTypes
    showIndicator: boolean
    showOscillator: boolean
    activeRangeSelectorButtonId: number
}

export const ChartToolsComponentModal = (property: ChartToolsComponentModalProps) => {
    Data.default(Highcharts)
    // @ts-ignore
    Indicators(Highcharts);
    DragPanes(Highcharts);
    HighchartsMore(Highcharts);
    AnnotationsAdvanced(Highcharts);
    PriceIndicator(Highcharts);
    Annotations(Highcharts);
    AccelerationBands(Highcharts);
    AccumulationBands(Highcharts);
    Aroon(Highcharts);
    Trix(Highcharts);
    Stochastic(Highcharts);
    Macd(Highcharts);
    AccumulationDistribution(Highcharts);
    AroonOscillator(Highcharts)
    Chaikin(Highcharts);
    VBP(Highcharts);
    PSAR(Highcharts);
    Tema(Highcharts);
    StockTools(Highcharts);

    const location = useLocation();
    const props: any = location.state;
    const [state, setState] = useState<ChartToolModalState>({
        chartScope: ChartScope.Intraday,
        currentIndicator: indicators[0],
        currentOscillator: oscillators[0],
        chartType: ChartTypes.Line,
        showIndicator: false,
        showOscillator: false,
        activeRangeSelectorButtonId: CHART_TOOLS_RANGESELECTOR_BUTTONS[0].id
    });
    let { loading, data } = useQuery(
        loader('./getInstrumentChartToolModal.graphql'),
        {
            variables: {
                instrumentId: property.instrumentId,
                chartScope: state.chartScope,
                criteria: {
                    from: moment(calculatePeriodFromChartScope(state.chartScope)),
                    to: moment(moment().local(true).endOf('day')),
                    aggregation: aggregationFromChartScope(state.chartScope)
                }
            },
            skip: !property.instrumentId || !state.chartScope
        }
    );
    const {toggleChartOptions, setToggleChartOptions} = property;

    function calculatePeriodFromChartScope(scope: ChartScope): moment.Moment {
        switch (scope) {
            case ChartScope.Intraday: return moment().local(true).startOf('date')
            case ChartScope.Week: return moment().local(true).subtract(7, 'days').startOf('day')
            case ChartScope.Month: return moment().local(true).subtract(1, 'months').startOf('day')
            case ChartScope.ThreeMonth: return moment().local(true).subtract(3, 'months').startOf('day')
            case ChartScope.SixMonth: return moment().local(true).subtract(6, 'months').startOf('day')
            case ChartScope.Year: return moment().local(true).subtract(1, 'year').startOf('day')
            case ChartScope.ThreeYear: return moment().local(true).subtract(3, 'years').startOf('day')
            case ChartScope.FiveYear: return moment().local(true).subtract(5, 'years').startOf('day')
            case ChartScope.TenYear: return moment().local(true).subtract(10, 'years').startOf('day')
            default: return moment().local(true).subtract(1, 'days').startOf('day')
        }
    }

    function aggregationFromChartScope(scope: ChartScope): HistoryQuoteAggregation | null {
        switch (scope) {
            case ChartScope.Intraday: return HistoryQuoteAggregation.Tick
            case ChartScope.Week:
            case ChartScope.Month:
                return HistoryQuoteAggregation.Hour
            case ChartScope.ThreeMonth: return HistoryQuoteAggregation.Day
            default: return null
        }
    }

    const getOtherChartOptions = (ohlcData: HistoryQuoteEdge[] | null | undefined, state: ChartToolModalState) => {
        let ohlcSeries = [];
        let volumeSeries = [];
        if (ohlcData && ohlcData.length > 1) {
            for (let i = 0; i < ohlcData.length; i++) {
                let curr: HistoryQuote | null | undefined = ohlcData[i].node;
                ohlcSeries.push([new Date(curr?.start).getTime(), curr?.lowPrice, curr?.highPrice, curr?.firstPrice, curr?.lastPrice]);
                // @ts-ignore
                if (curr.cumulativeVolume) {
                    volumeSeries.push([new Date(curr?.start).getTime(), curr?.cumulativeVolume]);
                }
            }
            return {
                ...createOptions(options),
                plotOptions: {
                    candlestick: {
                        color: '#ff4d7d',
                        upColor: '#18C48F',
                    }
                },
                series: createOtherChartSeries(ohlcSeries, volumeSeries, state),
                centerInCategory: true,
                connectNulls: {
                    enabled: true
                }
            }
        }
        else return createOptions(options)
    }

    function createOtherChartSeries(ohlcSeries: any[], volumeSeries: any[], state: ChartToolModalState) {
        let series = [];
        const {chartType, currentIndicator, currentOscillator} = state;
        if (ohlcSeries.length > 0) {
            series.push(
                {
                    id: 'other-dataseries' + chartType,
                    linkedTo: 'other-dataseries' + chartType,
                    name: chartType.charAt(0).toUpperCase() + chartType?.slice(1),
                    color: chartType === ChartTypes.CandleStick ? "#ff4d7d" : "black",
                    type: chartType,
                    data: ohlcSeries,
                    yAxis: 0
                },
                {
                    id: currentIndicator.value,
                    linkedTo: 'other-dataseries' + chartType,
                    name: currentIndicator.name,
                    type: currentIndicator.value,
                    yAxis: 0,
                    params: {
                    period: 1,
                       volumeSeriesID: 'other-dataseries'+ chartType
                    }
                })
            if (volumeSeries.length > 0) {
                series.push({
                    min: 0,
                    id: "volume-series",
                    colorByPoint: true,
                    colors: ['red', 'green'],
                    type: "column",
                    name: 'Volume',
                    data: volumeSeries,
                    yAxis: 1,
                     tooltip: {
                        pointFormatter: function (): any {
                            // @ts-ignore
                            return `<br><strong>Volume</strong>: ${shortNumberFormat(this.y)}<br>`
                        }
                    }
                })
            }
            if (currentOscillator.id !== 0) {
                series.push({
                    id: currentOscillator.value,
                    linkedTo: 'other-dataseries' + chartType,
                    name: currentOscillator.name,
                    type: currentOscillator.value,
                    yAxis: 2,
                    params: {
                        volumeSeriesID: 'other-dataseries'+ chartType
                    }
                })
            }
        }
        return series;
    }

    const handleIndicatorValueChange = (indicator: technicalIndicatorType) => {
        let curr: technicalIndicatorType = indicators[0];
        indicators.map((ind: technicalIndicatorType) => {
            if (ind.value === indicator.value) {
                curr = indicator;
            }
        })
        setState({...state, currentIndicator: curr, showIndicator: !state.showIndicator});
    }

    const handleOscillatorValueChange = (oscillator: technicalIndicatorType) => {
        let curr: technicalIndicatorType = oscillators[0];
        oscillators.map((osc: technicalIndicatorType) => {
            if (osc.value === oscillator.value) {
                curr = oscillator;
            }
        })
        setState({...state, currentOscillator: curr, showOscillator: !state.showOscillator});
    }

    const options: ChartOptionsType = {
        data: data?.instrument?.chart,
        props,
        volumeData: data?.instrument?.historyQuote,
        state,
        setState,
        setToggleChartOptions,
        toggleChartOptions
    }

    const chartStyles = useBootstrapBreakpoint({
        xl: {
            width: '490%', marginRight: '2px', marginLeft: '-135px'
        },
        md: {
            width: '100%', marginLeft: 0, marginRight: 0
        },
        sm: {
            width: '100%', marginLeft: 0, marginRight: 0, backgroundColor: 'white'
        }
    })

    async function rangeSelectorHandler(e: SyntheticEvent, scope: ChartScope, buttonId: number) {
        e.stopPropagation();
        if (scope) {
            await setToggleChartOptions(toggleChartOptions);
            setState({
                ...state,
                chartScope: scope,
                currentIndicator: state.currentIndicator,
                currentOscillator: state.currentOscillator,
                activeRangeSelectorButtonId: buttonId
            });
        }
    }

    return (
        <>
            {loading ? <div className={"p-1 text-center"} style={{ height: "40px", color: 'white' }}>
                <Spinner animation="border" style={{ color: "black" }} />
            </div> :
                <div className="main-chart-movement stock-chart-in-modal portrait-chart" style={{ height: 670 }}>
                    {data.instrument.chart.series.length > 0 &&
                        <>
                            <div className={"chart-tools-custon d-flex"}>
                                <div className={"chart-type-btn-wrapper"}>
                                    <span style={{ marginLeft: 5 }} className={"font-weight-bold font-size-18px"}>Ansicht</span>
                                    <div>
                                        <Button key={"1"} className={`chart-type-btn ${(state.chartType === ChartTypes.Area || state.chartType === ChartTypes.Line) ? "active" : "active-icon"}`} id={"1"} onClick={async () => {
                                            await setToggleChartOptions(true);
                                            if (state.chartScope === ChartScope.Intraday) {
                                                await setState({...state, chartType: ChartTypes.Area})
                                            } else {
                                                await setState({...state, chartType: ChartTypes.Line})
                                            }
                                        }}>
                                            <span id={"1"} ><img src={"https://code.highcharts.com/8.2.2/gfx/stock-icons/series-line.svg"} alt={"line"} /></span>
                                            <span id={"1"} >Linie</span>
                                        </Button>
                                        {
                                            data?.instrument && data?.instrument?.historyQuote?.edges?.length > 1 &&
                                            <Button key={"2"}
                                                 className={`chart-type-btn ${state.chartType === ChartTypes.CandleStick ? "active" : "active-icon"}`} id={"2"}
                                                 onClick={async () => {
                                                     await setToggleChartOptions(false);
                                                     await setState({...state, chartType: ChartTypes.CandleStick})
                                                 }}>
                                            <span id={"2"}><img
                                                src={"https://code.highcharts.com/8.2.2/gfx/stock-icons/series-candlestick.svg"}
                                                alt={"candlestick"}/></span>
                                            <span id={"2"}>Candlestick</span>
                                        </Button>}
                                        {data?.instrument && data?.instrument?.historyQuote?.edges?.length > 1 && <Button key={"3"}
                                                 className={`chart-type-btn ${state.chartType === ChartTypes.OHLC ? "active" : "active-icon"}`} id={"3"}
                                                 onClick={async () => {
                                                     await setToggleChartOptions(false);
                                                     await setState({...state, chartType: ChartTypes.OHLC})
                                                 }}>
                                            <span id={"3"}><img
                                                src={"https://code.highcharts.com/8.2.2/gfx/stock-icons/series-ohlc.svg"}
                                                alt={"ohlc"}/></span>
                                            <span id={"3"}>OHLC</span>
                                        </Button>}
                                    </div>
                                </div>

                                <div className={"d-md-flex d-none views-container"}>
                                    <div style={{ maxWidth: '267px', marginRight: '10%' }}>
                                        <label style={{fontSize: 18}} className={"font-weight-bold ml-1 mt-1 mb-0"} htmlFor={"indicators"}>Indikatoren im Chart</label>
                                        <Dropdown onToggle={() => setState({...state, showIndicator: !state.showIndicator})}  show={state.showIndicator} drop={"down"} id={"chart-indicators"}>
                                            <Dropdown.Toggle className={"d-flex justify-content-between align-items-center pl-3 pr-2"}>
                                                <span className={"text-truncate"}>{state.currentIndicator.name}</span>
                                                <img alt="Dropdown arrow down" src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}/>
                                            </Dropdown.Toggle>
                                        <Dropdown.Menu className={"chart-indicators"} >
                                          {indicators.map((indicator: technicalIndicatorType) => (
                                                <button onClick={() => handleIndicatorValueChange(indicator)} value={indicator.value} key={indicator.id}>
                                                    {indicator.name}
                                                </button>
                                            ))}
                                        </Dropdown.Menu>
                                        </Dropdown>
                                    </div>

                                    <div style={{ maxWidth: '267px', zIndex: 10000 }}>
                                        <label style={{ marginLeft: 8, fontSize: 18 }} className={"font-weight-bold mt-1 mb-0"} htmlFor={"oscillators"}>Indikatoren unter dem Chart</label>
                                        <Dropdown onToggle={() => setState({...state, showOscillator: !state.showOscillator})}  show={state.showOscillator} drop={"down"} id={"chart-indicators"}>
                                            <Dropdown.Toggle className={"d-flex justify-content-between align-items-center pl-3 pr-2"}>
                                                <span className={"text-truncate"}>{state.currentOscillator.name}</span>
                                                <img alt="Dropdown arrow down" src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}/>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu id={"chart-oscillators"} className={"chart-indicators"} >
                                                {oscillators.map((oscillator: technicalIndicatorType) => (
                                                    <button onClick={() => handleOscillatorValueChange(oscillator)} value={oscillator.value} key={oscillator.id}>
                                                        {oscillator.name}
                                                    </button>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                            <div className={"rangeSelector-btns-container my-2"}>
                                {
                                    CHART_TOOLS_RANGESELECTOR_BUTTONS.map((btn: rangeSelectorBtn) => (
                                        <button className={`rangeselector-btn`} onClick={(e) => rangeSelectorHandler(e, btn.scope, btn.id)}>
                                            <span style={state.activeRangeSelectorButtonId === btn.id ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>
                                                {btn.text}
                                            </span>
                                        </button>
                                    ))
                                }
                            </div>
                            <div className='d-flex'>
                                <HighchartsReact className={"bg-white stock-tool-main-chart"} containerProps={{
                                    style: {height: 665, ...chartStyles}
                                }}
                                    highcharts={Highcharts} constructorType={'stockChart'}
                                    options={toggleChartOptions ? createOptions(options) : getOtherChartOptions(data?.instrument?.historyQuote.edges, state)}
                                />
                            </div>
                        </>
                    }
                </div>
            }
        </>
    )
}

export default memo(ChartToolsComponentModal);

const createPlotLines = (chartThreshold?: number | null) => {
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
    return plotLines;
}
