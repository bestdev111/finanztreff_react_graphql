import React from 'react'
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import classNames from "classnames";
import {getColorOfAssetGroup} from "../../../profile/utils";
import {Color} from "highcharts";
import {
    formatAssetGroup, numberFormatShortGraph,
    Period,
    periodMap
} from "../../../../utils";
import _ from "underscore"

const blueColor = '#0d5a94'

interface PerformanceComparisonProps extends React.HTMLAttributes<HTMLElement>{
    assetGroup: any;
    header: string;
    legendName?: string
    groupId?: any
    v1?: string
    v2?: string
    v3?: string
    v4?: string
}

export const PerformanceComparison = (props: PerformanceComparisonProps) => {
    let axisArr1: any[] = [];

    const performanceChartOptions = (assetGroup: string, legendName?: string, legend2?: string, data1?: any[], data2?: any[], axis1?: any[]) => {
        return {
            stockTools: {
                gui: {
                    enabled: false
                }
            },
            chart: {
                type: 'line',
                height: 300,
                marginTop: 15
            },
            title: {
                text: ''
            },
            xAxis: {
                type: 'string',
                // tickPixelInterval: 150,
                categories: mappedOrder,
                labels: {
                    format: `{value}`,
                },
            },
            tooltip: {
                valueSuffix: '%'
            },
            credits: {
                enabled: false
            },
            colors: [getColorOfAssetGroup(assetGroup), blueColor],
            yAxis: {
                title: {text: ''},
                labels: {
                    format: `{value}%`,
                    align: 'right',
                    x: 10,
                    y: -3
                },
                opposite: true
            },
            plotOptions: {
                series: {
                    lineWidth: 2,
                    dashStyle: 'dash',
                    marker: {
                        symbol: 'circle',
                        radius: 9,
                        lineWidth: 2,
                        lineColor: null,
                    },
                }
            },
            legend: {
                itemDistance: 0,
                symbolHeight: 0,
                symbolWidth: 0,
                labelFormatter: function (): string {
                    // @ts-ignore
                    const {name, color, visible} = this;
                    return `<button class=" custom-button-style btn text-white p-1 rounded-0 m-1 font-size-12px" 
                        style="background-color:${visible ? color : 'gray'}"
                    >
                        ${name}
                    </button>`;
                },
                useHTML: true
            },
            exporting: {
                enabled: false
            },
            showCredits: {
                enabled: false
            },
            series: [{
                name: legendName,
                data: getPerformance(mainSorted[0], underlyingSorted[0]).map(val => val.performance),
                marker: {
                    fillColor: Color.parse(getColorOfAssetGroup(assetGroup)).brighten(0.3).get()
                }
            }, {
                name: `BASISWERT - ${legend2}`,
                data: getPerformance(underlyingSorted[0], mainSorted[0]).map(val => val.performance),
                marker: {
                    fillColor: Color.parse(blueColor).brighten(0.3).get()
                }
            }],
        }
    }

    let underlyingBeforeSort: any[] = [];
    let mainBeforeSort: any[] = [];
    props.groupId?.underlyings[0]?.instrument?.performance.forEach((val: any) => {
        let obj = {...val}
        obj.performance = (!isNaN(obj.performance) || obj.performance != null) ? parseFloat(numberFormatShortGraph(obj.performance)) : obj.performance
        underlyingBeforeSort.push(obj)
    })
    props.groupId?.main?.performance.forEach((val: any) => {
        let obj = {...val}
        obj.performance = (!isNaN(obj.performance) || obj.performance != null) ? parseFloat(numberFormatShortGraph(obj.performance)) : obj.performance
        mainBeforeSort.push(obj)
    })

    let order: string[] = ["WEEK1", "MONTH1", "MONTH6", "CURRENT_YEAR", "WEEK52", "YEAR3"]
    let mappedOrder: any[] = [periodMap(Period.WEEK1), periodMap(Period.MONTH1), periodMap(Period.MONTH6), periodMap(Period.CURRENT_YEAR), periodMap(Period.WEEK52), periodMap(Period.YEAR3)]
    let underlyingSorted: any[] = []
    let mainSorted: any[] = []

    underlyingSorted.push(_.sortBy(underlyingBeforeSort, function(obj: any){
        return  _.indexOf(order, obj.period);
    }));

    mainSorted.push(_.sortBy(mainBeforeSort, function(obj: any){
        return _.indexOf(order, obj.period)
    }));

    function getPerformance(main: any[], underlying: any[]) {
        if (!main || !underlying) {
            return [];
        }
        return main.filter(item => {
            return underlying.find((v) => v.period === item.period && item.performance !== null && v.performance !== null && !isNaN(item.performance) && !isNaN(v.performance));
        })
    }

    return (
        <div className={classNames("content-wrapper", props.className)}>
            <h2 className="content-wrapper-heading font-weight-bold ml-1">
                {props.header}
            </h2>
            <div className="content ml-n3 ml-xl-0 ml-md-0" style={{height: 500, maxHeight: 500, overflowY: 'hidden'}}>
                <figure>
                    <div className="performance-chart-wrapper ml-n3 ml-md-0 pl-1 pl-md-0">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={performanceChartOptions(
                                props.assetGroup,
                                `${formatAssetGroup(props.assetGroup).toUpperCase()} - ${props.groupId?.wkn}`,
                                props.groupId?.underlyings[0]?.group?.wkn,
                                getPerformance(underlyingSorted[0], mainSorted[0]),
                                getPerformance(mainSorted[0], underlyingSorted[0]),
                                props.groupId?.main?.performance?.forEach((val: any) => {axisArr1.push(periodMap(val?.period))}),
                            )}/>
                    </div>
                </figure>
                <div className="performance-content pl-3 pr-2 mt-sm-n3 mt-md-0">
                    Lohnt sich dieses {props.v1} gegenüber einem direkten Investment in den Basiswert? In dieser Grafik
                    sehen Sie wie sich das {props.v2} <strong>{props.v3}</strong> zum Zeitpunkt der Fälligkeit bei entsprechender Entwicklung des
                    Basiswertes <strong>{props.v4}</strong> verhalt.
                </div>
            </div>
        </div>
    )
}

export default PerformanceComparison
