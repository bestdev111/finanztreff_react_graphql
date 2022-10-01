import {Component} from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import {AnalysisReportTarget} from "../../../../generated/graphql";

require('highcharts/highcharts-more.js')(Highcharts);

const chartOptions = {
    stockTools: {
        gui: {
            enabled: false
        }
    },

    chart: {
        type: 'bubble',
        plotBorderWidth: 0,
        zoomType: 'xy',
        gridLineWidth: 0,
        styledMode: 0,
        height: 200
    },

    legend: {
        enabled: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
        bubble: {
            borderWidth: 5,
        },
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        },
        borderWidth: 3,
    },

    title: {
        text: 'Kursziele'
    },

    xAxis: {
        gridLineWidth: 0,
        offset: -55,
        title: {
            text: ''
        },
        labels: {
            format: '{value}'
        },
        plotLines: [{
            label: {
                text: ''
            },
        }],
    },

    yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
            text: ''
        },
        labels: {
            format: ' '
        },
        plotLines: [{
            label: {
                text: '',
                x: -100
            }
        }],
    },
    tooltip: {
        outside: false,
        shadow: false,
        useHTML: true,
        formatter: function(): string {
            // @ts-ignore
            return 'Kurs: ' + this.point.x + '<br/>' + 'Anzahl: ' + this.point.z;
        }
    },
    series: [
        {
            data: [
                {x: 95, y: 0, z: 14, name: 'BE'},
            ],
            color: "#dc3545",
        },
    ]

}

const RED = '#dc3545';
const GREEN = '#18C48F';
const YELLOW = '#ffc107';

export class TradeRateBubbleChart extends Component<KurszieleChartProps, {}> {
    render() {
        chartOptions.series = this.props.targets.map(
            t => {
                return {
                    name: '',
                    data: [
                        {x: t.price || 0, y: 0, z: t.count || 0, name: ''},
                    ],
                    color: t.recommendation === 'NEGATIVE' ? RED : (t.recommendation === 'POSITIVE' ? GREEN : YELLOW),

                }
            }
        );

        return (
            <>
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </>
        );
    }
}

interface KurszieleChartProps {
    targets: AnalysisReportTarget[];
}