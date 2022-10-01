import React, {Component} from "react";
import {numberFormat} from "../../../../utils";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import {PieChartColors} from "../../../profile/utils";


function createPieChart(data: ShareHolder[]): any {
    let points = data.sort((a: ShareHolder, b: ShareHolder) => b.percent - a.percent).map((value: ShareHolder, index) => {
        return {
            name: value.name,
            y: value.percent,
            color: PieChartColors[index % PieChartColors.length],
        }
    });
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            type: 'pie', margin: [0, 0, 0, 0], spacingTop: 0,
            spacingBottom: 0, spacingLeft: 0, spacingRight: 0, height: '300px',
            backgroundColor: null, plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false,
            style:{
               marginLeft:"15px"
            }
        },
        title: { text: '' },
        yAxis: { title: { text: '' } },
        rangeSelector: { enabled: false },
        scrollbar: { enabled: false },
        navigator: { enabled: false },
        credits: { enabled: false },
        plotOptions: {
            pie: {
                size: '225px', innerSize: '75%', center: ['112px', '50%'], showInLegend: true, cursor: 'pointer',
                dataLabels: { enabled: false },
            }
        },
        tooltip: {
            // @ts-ignore
            formatter: function() {
                // @ts-ignore
                return '<b>' + this.point.name + '</b>: <br />' + numberFormat(this.y, '%');
            },
            split: false
        },
        series: [
            {
                colorByPoint: true,
                data: points,
                showInLegend: true,
                allowPointSelect: true,
                states: {
                    hover: { }
                },
            },
        ],
        legend: {
            enabled: true, layout: 'vertical', align: 'right', verticalAlign: 'middle', itemMarginBottom: 4,
            squareSymbol: false, symbolRadius: 6, symbolHeight: 6, symbolWidth: 6, x: -20,
            itemStyle: { 'fontSize': '14px', 'fontWeight': 'normal', 'fontFamily': 'Roboto', 'color': '#383838' },
            useHTML: true,
            labelFormatter: function(): any {
                // @ts-ignore
                return '<span class="legend-asset-wrapper d-flex ml-4">' + this.name +
                    // @ts-ignore
                    ' <span class="legend-asset-percent pl-2"> ' + numberFormat(this.y, '%') + '</span>' +
                    '</span>'
                    ;
            },
        },
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: '480px',
                            // height: (16 / 9 * 100) + '%',
                            marginBottom: 190,
                        },
                        legend: {
                            floating: false,
                            align: 'center',
                            verticalAlign: 'bottom',
                            x: 0,
                            y: 10,

                        }
                    }
                }
            ]
        },

    };
}

export class CompanyShareHolderChart extends Component<CompanyShareHolderChartProps, {}> {
    render() {
        return (
            <div className="chart-wrapper" >
                <HighchartsReact
                    containerProps={{style: {height: this.props.height || undefined}}}
                    highcharts={Highcharts}
                    constructorType={'stockChart'}
                    options={createPieChart(this.props.shareHolders)}
                />
            </div>
        )
    }
}


export interface ShareHolder {
    name: string;
    percent: number;
}

export interface CompanyShareHolderChartProps {
    shareHolders: ShareHolder[];
    height?: string;
}
