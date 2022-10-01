import { Instrument, Query, QuoteHistoryEdge } from "../../../../../generated/graphql";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import moment from "moment";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { quoteFormat } from "utils";
import './PerformanceInPercentComponent.scss';
import { Spinner } from "react-bootstrap";

interface PerformanceInPercentComponentProps {
    instrument: Instrument;
    instrumentId?: number
}

export function PerformanceInPercentComponent(props: PerformanceInPercentComponentProps) {
    let instrumentId =  props.instrument?.id;

    let { loading, data } = useQuery<Query>(
        loader('./getPerformancePercent.graphql'),
        {
            variables: {
                instrumentId: instrumentId,
                from: moment().subtract(1, 'years').format('YYYY-MM-DD'),
                to: moment().format('YYYY-MM-DD')
            },
            skip: !instrumentId
        }
    );

    if (loading) {
        return (
            <div className="text-center py-2">
                <Spinner animation="border" />
            </div>
        );
    }

    let chartOptions: Highcharts.Options = {};
    let minValue: number | null = null, maxValue: number | null = null;
    let minDate: any, maxDate: any;

    if (data && data.instrument && data.instrument.quoteHistory && data.instrument.quoteHistory.edges && data.instrument.quoteHistory.edges.length > 0) {

        let points = data.instrument.quoteHistory.edges;
        minValue = Math.min(...points.map((current: QuoteHistoryEdge) => current.node?.changePercent || 0));
        maxValue = Math.max(...points.map((current: QuoteHistoryEdge) => current.node?.changePercent || 0));
        minDate = points.filter((current: QuoteHistoryEdge) => current.node?.changePercent === minValue)[0] && points.filter((current: QuoteHistoryEdge) => current.node?.changePercent === minValue)[0].node?.date || 0;
        maxDate = points.filter((current: QuoteHistoryEdge) => current.node?.changePercent === maxValue)[0] && points.filter((current: QuoteHistoryEdge) => current.node?.changePercent === maxValue)[0].node?.date || 0;
        chartOptions = createOptions(points, minValue, maxValue);

        let simetricValue = Math.abs(minValue || 0) > Math.abs(maxValue || 0) ? -(minValue || 0) : maxValue;

        let objDiv = document.getElementById("scrool-top-end");

        if (objDiv && objDiv.children[1]) {
            objDiv?.children[1].scrollTo({ left: 3000, behavior: 'smooth' });
        }

        return (
            <div className="content-wrapper col">
                <div className=" d-sm-block d-md-flex justify-content-between pb-xl-1 pb-md-3">
                    <h3 className="content-wrapper-heading mt-sm-1 mt-md-n1 w-75 mb-sm-5 mb-md-2 mb-xl-2 font-weight-bold">
                        Tage an denen {props.instrument.name} <span className="text-green">gestiegen</span> oder <span className="text-red">gefallen</span> ist</h3>
                </div>
                <div className="content column-chart-container">
                    <div className="column-chart-container-inner">
                        <span className="text-green column-label-y-top">größte Bewegung nach <b>oben</b> am {quoteFormat(maxDate)}</span>
                        <div className="d-flex scrool-top-end" id="scrool-top-end">
                            {
                                !loading &&
                                <>
                                    <div className="y-scale">
                                        <span>{Math.floor(simetricValue || 0)}%</span>
                                        <span>{Math.floor(simetricValue || 0) * 0.5}%</span>
                                        <span>0%</span>
                                        <span>{-Math.floor(simetricValue || 0) * 0.5}%</span>
                                        <span>{-Math.floor(simetricValue || 0)}%</span>
                                    </div>
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        constructorType='stockChart'
                                        options={chartOptions}
                                    />
                                </>
                            }
                        </div>
                        <span className="text-red column-label-y-bottom">größte Bewegung nach <b>unten</b> am {quoteFormat(minDate)}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (<></>);
}

export function createOptions(edges: QuoteHistoryEdge[], minValue: number, maxValue: number): Highcharts.Options {

    let simetricValue = Math.abs(minValue) > Math.abs(maxValue) ? -minValue : maxValue;

    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            type: 'area',
            backgroundColor: 'transparent',
            height: 300,
            width: 3000
        },
        navigator: { enabled: false },
        legend: { enabled: false },
        scrollbar: { enabled: false },
        rangeSelector: {
            enabled: false
        },
        xAxis: {
            visible: true,
            offset: -125,
            tickLength: 0,
            lineColor: "transparent",
            labels: {
                step: 2,
                style: {
                    color: "#383838",
                },
                formatter: function (): string {
                    return moment(this.value).format("MMMM YYYY");
                }
            },
            lineWidth: 2,
        },
        yAxis: {
            type: 'linear',
            gridLineWidth: 0,
            labels: {
                step: 12,
                style: {
                    color: "transparent"
                }
            },
            max: simetricValue * 1.1,
            min: -simetricValue * 1.1,
            floor: -simetricValue * 1.1,
            ceiling: simetricValue * 1.1,
            plotLines: [{
                color: '#B7B7B7',
                width: 1,
                value: minValue,
                dashStyle: "ShortDash",
            }, {
                color: '#B7B7B7',
                width: 1,
                value: maxValue,
                dashStyle: "ShortDash",
            }, {
                color: '#383838',
                width: 2,
                value: 0,
                zIndex: 3
            }]
        },
        plotOptions: {
            column: {
                pointWidth: 7,
                groupPadding: 0,
                pointPadding: 2,
                borderWidth: 1,
            }
        },
        tooltip: {
            valueSuffix: "%",
            valueDecimals: 2,
            headerFormat: '{point.date}<br/>',
            pointFormat: '<span class="point-tooltip"><b> <span class="point-tooltip-style" style="color:{point.borderColor}; font-size: "24px";"> {point.y}</span></b></span>',
            shared: true,
            split: false,
        },
        credits: { enabled: false },
        series: [{
            name: "Kurs",
            type: 'column',
            data: edges.map(current => {
                let changePercent = current.node?.changePercent || 0;
                return ({
                    y: changePercent,
                    name: new Date(current.node?.date).getTime(),
                    date: moment(current.node?.date).format("DD MM YYYY"),
                    x: new Date(current.node?.date).getTime(),
                    borderColor: ((current.node?.changePercent || 0) < 0 ? '#f5335b' : "#18C48F"),
                });
            })
            // .concat({
            //     y: tradeQuote.percentChange || 0,
            //     name: new Date(tradeQuote?.when).getTime(),
            //     date: quoteFormat(tradeQuote?.when),
            //     x: new Date(tradeQuote?.when).getTime(),
            //     borderColor: ((tradeQuote.percentChange || 0) < 0 ? '#f5335b' : "#18C48F"),
            // })
            ,
            pointStart: 0,
            pointInterval: 0.5,
            color: '#D2F8EC',
            negativeColor: '#FFDBE5',

        }]
    }
}
