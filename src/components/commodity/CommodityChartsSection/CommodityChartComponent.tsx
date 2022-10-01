import { useState } from 'react'
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import classNames from "classnames";
import { AssetType, InstrumentGroup, Maybe } from 'generated/graphql';
import { useHistory } from 'react-router-dom';
import './CommodityChartComponent.scss'; 

let PIE_COLOR = ['#0D5A94', '#117F8F', '#159C8C', '#18B589', '#63BD5C', '#18C48F', '#3dfbc0', '#ffcc00', '#ff8842', '#ff4d7d']

function Legends(props:any){
    const [render, setRender] = useState(0);
    function onFocus(item: any) {
        if (item.visible) {
            item.series.data.forEach((i: any) => i.setState('inactive'));
            item.setState('hover');
            setRender(render + 1);
        }
    }

    function onBlur(item: any) {
        if (item.visible) {
            item.series.data.forEach((i: any) => i.setState(''));
            setRender(render + 1);
        }
    }
    return (
        <div>
            <div className="text-left alternatives-to-centered-legend">
                {
                    (render > -1 && props?.chart && props.chart?.series && props.chart?.series[0]) && props.chart?.series[0].data.map((item: any, key: any) =>
                        <div className="font-size-12px text-nowrap" key={key}
                            onClick={() =>
                                {
                                // handleRedirectWithProps(push, props.underlying.underlyings, props.assetClass, props.assetType, props.groupId, item.options)
                                }
                            } 
                            onMouseEnter={() => onFocus(item)}
                            onMouseLeave={() => onBlur(item)}>
                            <svg height="20" width="20">
                                <circle cx="10" cy="10" r="4" fill={item.visible ? item.color : '#cccccc'} />
                            </svg>
                            {(item.y === 0) ? <span style={{ color: '#cccccc', cursor: 'default', pointerEvents: 'none'}}>{item.name} ({item.y})</span> : <span style={{ color: item.visible ? "initial" : '#cccccc', cursor: 'pointer' }}>{item.name} ({item.y})</span>}
                        </div>
                    )
                }
            </div>
    </div>
    );
}

interface AlternativesToProps {
    className?: string;
    assetType?: Maybe<AssetType> | undefined;
    groupId?: Maybe<InstrumentGroup> | undefined;
    underlying? : Maybe<InstrumentGroup> | undefined;
    assetClass?: any;
    chartData: any;
    title?: any;
}

export const CommodityChartComponent = (props: AlternativesToProps) => {
    const { push } = useHistory();
    const [chart, setChart] = useState();
    const alternativeChartProperties = {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            
        },
        title: {
            text : props.title,
            verticalAlign: 'middle',
            y: 25,
            style:{"fontWeight":"bold"}
        },
        colors: PIE_COLOR,
        plotOptions: {
            pie: {
                point: {
                    events: {
                        legendItemClick(event:any){
                            // handleRedirectWithProps(push, props.underlying?.underlyings, props.assetClass, props.assetType, props.groupId)
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                showInLegend: true,
                startAngle: 0,
                endAngle: 0,
                size: '100%'
            }
        },
        legend: {
            enabled: false,
            symbolHeight: 8,
            labelFormatter: function (): any {
                // @ts-ignore
                const { name, series, color, length } = this;
                if (series.name === 'risk') {
                    return `<div class="d-flex">
                                ${name}
                                <div style="background-color: ${color}; width: 5px; height: ${length * 20}px"></div>
                            </div>`;
                }
            },
            itemStyle: {
                fontWeight: 'normal',
            },
            useHTML: true
        },
        tooltip: {      
            shared: true,
            useHTML:true,
            formatter:
            function (): any {
                // @ts-ignore
                const { y, color, point } = this;
                return `<div>${point.name}</div><span style="color: ${color}">●</span><b> ${y}</b><br/>`;
            }, 
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'pie',
            name: '',
            innerSize: '70%',
            data: props.chartData,
            point: {
                events: {
                    click: function(event:any) {
                        // handleRedirectWithProps(push, props.underlying?.underlyings, props.assetClass,props.assetType, props.groupId, event.point.options)
                    }
                }
            }
        }]
    }
    return (
        <>
        <div className={classNames(props.className)} style={{ maxWidth: "500px" }}>
            {
                        <div className="content">
                                <HighchartsReact highcharts={Highcharts} options={alternativeChartProperties} callback={setChart}/>
                                <Legends chart={chart} passData={props.chartData}/>
                        </div>
            }
            </div>
        </>
    )
}

export default CommodityChartComponent