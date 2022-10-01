import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { createOwnPredictionSeries } from "./ChartOptionsAndSeries";
import { numberFormatDecimals, numberFormatShort } from "utils";
import moment from "moment";
import more from "highcharts/highcharts-more";
import draggable from "highcharts/modules/draggable-points";
import { useMediaQuery } from "react-responsive";
import { BestWarrantCard } from "./BestWarrantCard";
import { Instrument } from "graphql/types";

export function OwnPredictionChart(props: OwnPredictionChartProps) {

    let hasData: boolean = false;
    const NOW = moment().toDate().getTime();
    let devisor = Number.parseInt((NOW / 8000000000).toFixed(0));

    const isTablet = useMediaQuery({
        query: '(max-width: 1280px)'
    });

    const MONTHS_TO_TIME = Number.parseInt((NOW / devisor).toFixed(0));

    const quoteHistoryEdges = props.instrument.quoteHistory.edges || [];
    const monteCarlo = props.instrument.monteCarlo;
    const currency = props.instrument.currency && props.instrument.currency.displayCode || "";

    if (typeof Highcharts === "object") {
        more(Highcharts);
        draggable(Highcharts);
    }
    
    let value = { expectedValue: 
        monteCarlo && monteCarlo.avg ? 
        monteCarlo.avg 
        : quoteHistoryEdges.length>0 && quoteHistoryEdges[quoteHistoryEdges.length-1].node ? 
        quoteHistoryEdges[quoteHistoryEdges.length-1].node?.lastPrice || 1
        : 1};
    let setExpectedValue: any = null;

    const onChildMountExpectedValue = (dataFromChild: any) => {
        value = dataFromChild[0];
        setExpectedValue = dataFromChild[1];
    };

    let period = { value: 6 };
    let setPeriod: any = null;

    const onChildMountPeriod = (dataFromChild: any) => {
        period = dataFromChild[0];
        setPeriod = dataFromChild[1];
    };

    let chartOptions: Highcharts.Options = {};
    let minValue: number;
    let maxValue: number;


    hasData = false;

    function createOwnPredictionOptions(data: any, startValue: string, minValue: number, maxValue: number, NOW: number, MONTHS_TO_TIME: number, currency?: string): Highcharts.Options {
        return {
            stockTools: {
                gui: {
                    enabled: false
                }
            },
            chart: { type: 'xrange', height: 320 },
            rangeSelector: { enabled: false },
            scrollbar: { enabled: false },
            navigator: { enabled: false },
            credits: { enabled: false },
            title: { text: "" },
            plotOptions: {
                series: {
                    dragDrop: {
                        draggableX: true,
                        draggableY: true,
                        liveRedraw: true,
                    },
                    states: {
                        inactive: {
                            opacity: 1,

                        },
                        hover: {
                            animation: false,
                            enabled: false,
                            opacity: 1,
                            lineWidth: 2,
                        },
                    },
                    point: {
                        events: {
                            drop: function (e: any) {

                                setExpectedValue(e.newPoint.y);
                                let period = Math.round((e.newPoint.x - NOW) / MONTHS_TO_TIME);
                                setPeriod(period * (period === 3 ? 4 : 3));
                                ;
                            }

                        },
                    }
                }
            },
            yAxis: {
                min: minValue * 0.3,
                max: maxValue * 1.8,
                gridLineWidth: 0,
                lineColor: "white",
                labels: {
                    enabled: false
                }
            },
            tooltip: {
                formatter: function () {
                    let text: string = "";
                    switch (this.points![0].point.name) {
                        case "No tooltip": text = ""; break;
                        case "Pointer": text = "<b>Kursziel: " + numberFormatShort(this.y) + " " + currency + "</b><br/> Zeitraum: "
                            + (((this.x - NOW) / MONTHS_TO_TIME).toFixed(0) == "3" ? "12" : ((this.x - NOW) / MONTHS_TO_TIME * 3).toFixed(0)) + " Monate"; break;
                        default: text = "<b>Kurs: " + numberFormatShort(this.y) + " " + currency + "</b>"; break;
                    }

                    return text;
                }
            },
            xAxis: {
                max: moment().add(10, 'M').toDate().getTime(),
                plotBands: [
                    { from: moment().subtract(1, 'days').toDate().getTime(), to: moment().add(13, 'M').add(7, "d").toDate().getTime(), color: '#f1f1f1' },
                ],
                ordinal: false,
                lineColor: "#787878",
                labels: {
                    style: {
                        color: "#383838",
                    },
                    step: 1,
                    formatter: function () {
                        return moment(this.value).format("MMMM YYYY") === moment(NOW).format("MMMM YYYY") ?
                            "<b>Heute</b>" :
                            moment(NOW).add(9, "M").format("MMMM YYYY") === moment(this.value).format("MMMM YYYY") ?
                                moment(NOW).add(12, "M").format("MMMM YYYY")
                                : moment(this.value).format("MMMM YYYY")
                    }
                },
                lineWidth: 2,
                tickWidth: 0,
                plotLines: [{
                    color: '#383838',
                    label: {
                        text: '<span style="font-size: 18px; font-weigth: bold ">' + startValue + '</span><br/>Aktueller Kurs',
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
                    value: NOW
                }, {
                    color: '#383838',
                    label: {
                        text: '3M',
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
                    dashStyle: "ShortDash",
                    value: NOW + MONTHS_TO_TIME
                }, {
                    color: '#383838',
                    label: {
                        text: '6M',
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
                    dashStyle: "ShortDash",
                    value: NOW + MONTHS_TO_TIME * 2
                }, {
                    color: '#383838',
                    label: {
                        text: '12M',
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
                    dashStyle: "ShortDash",
                    value: NOW + MONTHS_TO_TIME * 3
                }]
            },
            series: data
        }
    }

    if (quoteHistoryEdges.length > 0) {
        let points = quoteHistoryEdges.map((current:any) => {return({value: current.node?.lastPrice, when: current.node?.date}) } ) || [];

        if (points.length > 0) {
            minValue = Math.min(...points.map((current: any) => current.value));
            maxValue = Math.max(...points.map((current: any) => current.value));

            let startDate: any = points[points.length - 1];
            const avg = monteCarlo && monteCarlo.avg ? monteCarlo.avg : startDate.value;

            let chartSeries = createOwnPredictionSeries(points)

            let pointerSerie = {
                name: "area",
                data: [
                    {
                        x: NOW,
                        y: startDate.value,
                        draggableX: false,
                        draggableY: false,
                        marker: {
                            enabled: true,
                            symbol: "cicle",
                            width: "0"
                        }
                    },
                    {
                        name: "Pointer",
                        x: NOW + MONTHS_TO_TIME * 2,
                        y: avg,
                        marker: {
                            enabled: true,
                            symbol: 'url(/static/img/svg/icon_montecarlo_navigator.svg)',
                            zIndex: "0",
                            width: 60,
                            height: 60
                        },
                        tooltip: {
                            enabled: true,
                            format: "Kursziel: 13.925,51 EUR Zeitraum: 3 Monate"
                        }
                    }],
                type: "area",
                dragDrop: {
                    draggableY: true,
                    draggableX: true,
                    dragMinY: 0,
                    dragMaxY: maxValue * 1.8,
                    redraw: false,
                    dragMinX: NOW + MONTHS_TO_TIME,
                    dragMaxX: NOW + MONTHS_TO_TIME * 4,
                    dragPrecisionX: MONTHS_TO_TIME,
                    dragPrecisionY: minValue * 0.01,
                },
                selected: true,
                color: "#0D5A94",
                fillColor: "transparent",
                fillOpacity: 0,
                lineWidth: 2,
                dashStyle: "ShortDash",
                zIndex: 0,
            }
            chartOptions = createOwnPredictionOptions([chartSeries, pointerSerie],
                numberFormatDecimals(startDate.value), minValue, maxValue, NOW, MONTHS_TO_TIME, currency);
            hasData = true;
        }
    }

    return (
        <div className="d-xl-flex">
            <div className="highcharts-containter col-12 ">{
                (hasData) &&
                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType='stockChart'
                    options={chartOptions}
                />}
            </div>
            <div className={isTablet ? "col-12 d-lg-block" : " mt-n4 ml-3 section-right-part col-xl col-lg-3 col-sm-12 lg-12-content-6 sm-12-content-12 d-lg-block"}>
                <h3 className=" content-wrapper-heading font-weight-bold mb-5px mt-10px text-truncate">Passendes Produkt</h3>
                <div className="content">
                    <BestWarrantCard instrument={props.instrument} onMountExpectedValue={onChildMountExpectedValue} onMountPeriod={onChildMountPeriod} expectedValue={value.expectedValue} period={period.value} />
                </div>
            </div>
        </div>
    );
}

interface OwnPredictionChartProps {
    instrument: Instrument;
}
