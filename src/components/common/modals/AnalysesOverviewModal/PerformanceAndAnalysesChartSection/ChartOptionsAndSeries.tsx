import { Analysis, AnalysisEdge, AnalysisRecommendation, Query } from "generated/graphql";
import Highcharts from "highcharts";
import { SeriesOptionsType } from "highcharts";
import moment from "moment";
import { numberFormatShort } from "utils";

export function createInstrumentPerformanceOptions(data: any, minValue: number, maxValue: number, currency: string): Highcharts.Options {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {type: 'linear',},
        rangeSelector: {enabled:false},
        scrollbar: {enabled: false},
        navigator: {enabled: false},
        credits: {enabled: false},
        title: {
            text: "Analysen der nächsten 12 Monate",
            align: "left",
            style: {
                fontFamily: "Roboto Slab",
                fontSize: "18px",
                fontWeight: "bold"
            }
        },
        plotOptions: {
            series: {
                marker: {
                    symbol: "cicle"
                }
            }
        },
        yAxis: {
            min: minValue,
            max: maxValue,
            gridLineWidth: 0,
            opposite: false,
            labels: {
                align: 'left',
                x: 5,
            style: {
                color: "#989898"
            }
            },
        },
        xAxis: {
            max: moment().add(12, 'M').toDate().getTime(),
            ordinal: false,
            lineColor: "white",
            labels: {
                style: {
                    color: "white",
                },
                step: 4,
                formatter: function () {
                    return Number.parseInt(Highcharts.dateFormat('%Y', this.value)).toString();
                }
            },
            lineWidth: 2,
            tickWidth: 0,
            plotLines: [{
                color: '#383838',
                label: {
                    text: "Aktueller Kurs",
                    align: 'right',
                    x:-10,
                    rotation: 0,
                    style: {
                        fontFamily: "Roboto",
                        color: "#383838"
                    }
                },
                width: 1,
                value: moment().subtract(1, 'days').toDate().getTime()
            },{
                color: '#989898',
                dashStyle: "ShortDash",
                label: {
                    text: "6 M",
                    align: 'right',
                    x:-10,
                    rotation: 0,
                    style: {
                        fontFamily: "Roboto",
                        color: "#383838"
                    }
                },
                width: 1,
                value: moment().add(6, 'M').toDate().getTime()
            }, {
                color: '#989898',
                dashStyle: "ShortDash",
                label: {
                    text: "12 M",
                    align: 'right',
                    x:-10,
                    rotation: 0,
                    style: {
                        fontFamily: "Roboto",
                        color: "#383838"
                    }
                },
                width: 1,
                value: moment().add(12, 'M').toDate().getTime()
            }]
        
        },
        tooltip: {
            split: true,
            formatter: function() {
              var points = this.points!,
                tooltipArray = ['<b>' + moment(this.x).format('DD MMMM YYYY') + '</b>']
        
                

              points.forEach(function(point, index) {
                point.point.options.z ? 
                tooltipArray.push('Analysen: <b>' + point.point.options.z + '</b>') 
                : tooltipArray.push('Kurs: <b>' + numberFormatShort(point.y) + " " + currency + '</b>');
              });
        
              return tooltipArray;
            }
          },
        series: data

    }
}

export function createInstrumentPerformanceSeries(data: any[]): SeriesOptionsType {

    return {
        name: '', type: 'area', 
        data: data.map((current): any => {
            return ({
                y: current.value,
                x: moment(current.when.slice(0, 10)).toDate(),
                z: null
            })
        }),
        marker:{
            enabled: false
        },
        color: 'black',
        fillColor: 'transparent',
        lineWidth: 2,
        tooltip: { valueDecimals: 2 }
    };
}

export function createInstrumentAnalysesSeries(data: Analysis[], startDate: any, type: any, currency?: string): SeriesOptionsType {
    let color = type===AnalysisRecommendation.Positive ? "var(--green)" : 
                    type===AnalysisRecommendation.Neutral ? "var(--yellow)" :
                        type===AnalysisRecommendation.Negative ? "var(--pink)" : 'black';
    let currentData = getDistinctedData(data, startDate, type)
    return {
        name: '' ,
        type: 'area', 
        data: currentData.map((current: any, index) => ({
            y: current.y *(currency==="GBX" && index!==0 ? 100 : 1),
            x: current.x,
            z: current.count,
            marker:{
                enabled: true,
            fillColor: color ,
            lineWidth: 2,
            lineColor: '#FFFFFF',
            radius: current.count!==0 ? current.count*4 + 2 : 0
            }
        })),
        color: color,
        dashStyle: "ShortDash",
        fillColor: 'transparent',
        lineWidth: 2,
        tooltip: {valueDecimals: 2}
    };
}

export function getDistinctedData(analysesData: Analysis[], startDate: any | undefined, type: any){
        
    // sort data by Date and filtered by type (positive, negative, neutral)
    let sortedAnalyses = analysesData
                .filter(current => 
                        current.recommendation === type && current.targetPrice!==0
                        )
                .sort((a:Analysis,b:Analysis) => moment(a.date).add(a.timeFrame, 'months').toDate().getTime()
                                     - moment(b.date).add(b.timeFrame, 'months').toDate().getTime())
                                     .filter(current => moment(current.date).add(current.timeFrame, 'months').toDate().getTime() > moment().toDate().getTime())
            || [];

    // get distincted Date array
    let distinctedYears = sortedAnalyses.map(current=>current.date)
                    .filter((value: any,index: number,self:any) => self.indexOf(value)===index);

    let distinctData = distinctedYears?.map(currentDate => {
        let current = sortedAnalyses
        .filter(edge => edge.date===currentDate);
        let sum: number = 0;
        current!.map(i => sum+=i?.targetPrice!);
        return{
            x: moment(current[0].date).add(current[0].timeFrame, 'months').toDate(),
            y: Number.parseInt((sum/(current?.length || 1)).toFixed(2)),
            count: current?.length || 1
        }

    });

    distinctData.unshift({
        x: moment(startDate.when.slice(0, 10)).toDate(),
        y: startDate.value,
        count: 0
    });
    return distinctData;
}