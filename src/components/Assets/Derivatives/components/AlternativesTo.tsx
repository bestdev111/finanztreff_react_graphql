import React, { useState } from 'react'
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import classNames from "classnames";
import { AssetType, InstrumentGroup, Maybe, Query } from 'generated/graphql';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './AlternativesTo.scss'; 

let PIE_COLOR = ['#0D5A94', '#117F8F', '#159C8C', '#18B589', '#63BD5C', '#18C48F', '#3dfbc0', '#ffcc00', '#ff8842', '#ff4d7d']

function Legends(props:any){
    const { push } = useHistory();
    let chartData: any[] = []
    const [render, setRender] = useState(0);
    function toggle(item: any) {
        item.setVisible(!item.visible);
        setRender(render + 1);
    }

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
                                handleRedirectWithPropsTo(push, props.underlying.underlyings, props.assetClass, item.options)
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
}


export const AlternativesTo = (props: AlternativesToProps) => {
    let underlyingInstrumentGroupId
    let optionType
    let chartData: any[] = [];
    if (props && props?.groupId && props?.groupId?.underlyings && props.groupId.underlyings[0]) {
        underlyingInstrumentGroupId = props.groupId.underlyings[0].groupId
    }
    if (props && props?.groupId && props?.groupId?.derivative && props.groupId.derivative.optionType) {
        optionType = props.groupId.derivative.optionType
    }
    let { loading, data } = useQuery<Query>(loader('./getAlternativeIssuerProducts.graphql'), {
        variables: { underlyingInstrumentGroupId: underlyingInstrumentGroupId, assetType: props.assetType?.id, optionType: optionType },
        skip: !underlyingInstrumentGroupId
    });
    let filteredData = data?.group?.derivativeIssuer.filter((function (el: any) {
        return el.count > 0
    }))
    if (filteredData !== undefined && filteredData !== null && filteredData.length > 0) {
        filteredData.map((item: any, key: any) => {
            if (filteredData) {
                chartData.push({ name: filteredData[key]?.issuer?.name, y: filteredData[key].count, id: filteredData[key]?.issuer?.id })
            }
        })
    }
    let productName
    if(props.underlying && props.underlying.underlyings && props.underlying.underlyings[0] && props.underlying.underlyings[0].group){
        productName = props.underlying.underlyings[0].group.name;
    }
    let productType = props?.groupId?.assetClass?.name;
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
            text: '',
        },
        colors: PIE_COLOR,
        plotOptions: {
            pie: {
                point: {
                    events: {
                        legendItemClick(event:any){
                            handleRedirectWithPropsTo(push, props.underlying?.underlyings, props.assetClass, event.point.options)
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
            data: chartData,
            point: {
                events: {
                    click: function(event:any) {
                        handleRedirectWithPropsTo(push, props.underlying?.underlyings, props.assetClass, event.point.options)
                    }
                }
            }
        }]
    }

    if(!underlyingInstrumentGroupId) return null;

    return (
        <>
        <div className={classNames("content-wrapper", props.className)} style={{ maxWidth: "365px" }}>
                        <h3 className="content-wrapper-heading font-weight-bold">
                            Alternative {productType} auf {productName}
                        </h3>
            {
                loading ?
                    <div className="text-center py-2">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                    :
                        <div className="content">
                                <HighchartsReact highcharts={Highcharts} options={alternativeChartProperties} callback={setChart}/>
                                <Legends chart={chart} passData={chartData} assetType={props.assetType} groupId={props.groupId} underlying={props.underlying} assetClass={props.assetClass}/>
                        </div>
            }
            </div>
        </>
    )
}

export function handleRedirectWithPropsTo(variable:any, underlying:any, assetClass: any, clickedItem?:any) {
    let clickedId = clickedItem?.id
    let clickedName = clickedItem?.name
        variable({
            pathname: '/hebelprodukte/suche',
            search: '?aclass=' + assetClass.name + '&underlying=' + underlying[0]?.group.id + '&issuerId=' + clickedId + '&issuerName=' + clickedName,
        })
    return false;
}

export default AlternativesTo

