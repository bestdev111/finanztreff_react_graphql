import {Link} from "react-router-dom";
import {
    getGridPerformanceClass,
    numberFormatDecimals,
    numberFormatWithSign,
    UpdateStateProps,
} from "../../../../utils";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import classNames from "classnames";
import {useQuery} from "@apollo/client";
import {Chart, ChartPoint, Query, QuoteType} from "../../../../graphql/types";
import {Spinner} from "react-bootstrap";
import {SnapQuoteDelayIndicator} from "../../indicators";
import './InstrumentCard.scss';
import {ProfileInstrumentAddPopup} from "../../modals/ProfileInstrumentAddPopup";
import moment from "moment";
import {loader} from "graphql.macro";
import SvgImage from "../../image/SvgImage";
import {usePercentChangeVisualization} from "../../../../hooks/usePercentChangeVisualization";
import {useEffect, useState} from "react";

export interface  InstrumentCardProperties {
    id: number;
    groupId: number;
    name: string;
    url?: string | null;
    delay?: number
    price?: number | null;
    performance?: number | null;
    decimals?: number;
    currency?: string | null;
    lowPrice?: number;
    highPrice?: number;
    children?: any;
    scope?: 'INTRADAY' | 'WEEK'| 'MONTH' | 'THREE_MONTH'
                | 'SIX_MONTH' | 'YEAR' | 'THREE_YEAR' | 'FIVE_YEAR' | 'TEN_YEAR';
    isChartColorfull: boolean
    chart?: Chart
    isHomeComponent ?: boolean

}


function createSerie(isChartColorfull: boolean, data: any[], dataThreshold?: number | null): any {

    const fixTZ = function(current: any) {
        return moment(current.when).subtract(new Date().getTimezoneOffset(), 'minutes').toDate()
    }

    if(isChartColorfull){
        return {
            name: 'Kurs', type: 'area', data: data.map(current => {return {y: current.value, x: fixTZ(current) }}),
            threshold: dataThreshold, 
            lineWidth: 1.5,
            trackByArea: true, tooltip: {valueDecimals: 2},
            color: 'white', 
            fillColor: 'rgba(255, 255, 255, 0.3)',
            negativeColor: 'white', 
            negativeFillColor: 'rgba(255, 255, 255, 0.3)',
            stockTools: {
                gui: {
                    enabled: false
                }
            },
        }; 
    }
    return {
        name: 'Kurs', type: 'area', data: data.map(current => {return {y: current.value, x: fixTZ(current) }}),
        threshold: dataThreshold, 
        lineWidth: 1.5,
        trackByArea: true, tooltip: {valueDecimals: 2},
        color: '#18C48F',
        negativeColor: '#f5335b',
        fillColor: 'rgba(28, 216, 158,0.4)',
        negativeFillColor: 'rgba(245, 51, 91, 0.4)',
        stockTools: {
            gui: {
                enabled: false
            }
        },
    };
}

function createOptions(data: Chart, minValue: number, maxValue: number, isChartColorfull: boolean): any {
    return {
        chart: {backgroundColor: null, margin: [0, 0, 25, 0], height: 80,},
        rangeSelector: {enabled: false},
        scrollbar: {enabled: false},
        navigator: {enabled: false},
        legend: {enabled: false,},
        xAxis: {
            lineWidth: 2, lineColor: 'white', visible: true, plotLines: null, plotBands: null,
            labels: {style: {color: 'rgba(255, 255, 255)'}}
        },
        yAxis: {
            type: 'linear',
            startOnTick: false,
            lineColor: 'rgba(255, 255, 255, 0.3)',
            gridLineColor: 'rgba(255, 255, 255, 0.3)',
            gridLineWidth: 0,
            floor: minValue * 0.9,
            ceiling: maxValue * 1.25,
            plotLines: data.threshold?.value ? [{value: data.threshold?.value, width: 1, color: 'rgba(255, 255, 255)'}] : [],
            labels: {style: {color: 'rgba(255, 255, 255)'}}
        },
        plotOptions: {
            series: {
                cursor: 'default', allowPointSelect: false, enableMouseTracking: false,
                label: {connectorAllowed: false}
            }
        },
        stockTools: {
            gui: {
                enabled: false
            }
        },
        credits: {enabled: false},
        series: data.series.map((serie: any) => createSerie(isChartColorfull, serie.data, data?.threshold?.value)),
    }
}

export const InstrumentCard = (props: InstrumentCardProperties) => {
    let decimals = 2;
    if (props.decimals) {
        decimals = props.decimals;
    }
    let minValue: number | null = props.lowPrice || null, maxValue: number | null = props.highPrice || null;
    let chartOptions: Highcharts.Options = {};
        if (props.chart && props.chart.series && props.chart.series.length > 0) {
            let points = props.chart.series[0].data || [];
            minValue = Math.min(...points.map((current: ChartPoint) => current.value));
            maxValue = Math.max(...points.map((current: ChartPoint) => current.value));
            chartOptions = createOptions(props.chart, minValue, maxValue, props.isChartColorfull);
    }

    const pushEvent =  usePercentChangeVisualization(props.id)
    let currentValue = (pushEvent?.value?.quotes || []).find(current => current?.type == QuoteType.Trade)?.value || props.price;
    let currentPerformance = (pushEvent?.value?.quotes || []).find(current => current?.type == QuoteType.Trade)?.percentChange || props.performance;
    let cardStatusCss = classNames(props.isChartColorfull ? 'stock-graph-box' : "transparent-bg stock-graph-box", getGridPerformanceClass(currentPerformance));

    return (
        <div className={cardStatusCss}>
            <div className="top d-flex justify-content-between">
                <div>
                    { props.url ?
                        <Link to={props.url} className="asset-name">
                            {props.delay != null && <SnapQuoteDelayIndicator delay={props.delay}/>} {props.name}
                        </Link> :
                        <span className={"asset-name"}>
                            {props.delay != null && <SnapQuoteDelayIndicator delay={props.delay}/>} {props.name}
                        </span>
                    }
                </div>
                <ProfileInstrumentAddPopup
                    instrumentId={props.id}
                    instrumentGroupId={props.groupId}
                    name={props.name}
                    className="p-0 m-0 instrument-add-btn"
                    watchlist={true} portfolio={true}>
                    <SvgImage icon="icon_plus_white.svg" spanClass="mt-n1" convert={false} width="28" className='shrink-07'/>
                </ProfileInstrumentAddPopup>
            </div>
            <div className="value-info">
                <div className="d-flex">
                    <div className="quote-value text-nowrap">
                        <span>{numberFormatDecimals(currentValue, decimals)} </span>
                        <span className={"currency"}>{props.currency}</span>
                    </div>
                    <div className="change-value">
                        {props.isChartColorfull ?
                        <>
                            <span className={classNames(
                            props.isHomeComponent && pushEvent.toggle ? 'asset-value-movement-blinker':''
                            )}>{numberFormatWithSign(currentPerformance, '%')}</span>
                            {currentPerformance && currentPerformance > 0 ?
                                <img className={"svg-icon pl-1 d-none d-lg-inline-block"} src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_up_white.svg"} alt=""/> :
                                <img className={"svg-icon pl-1 d-none d-lg-inline-block"} src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_down_white.svg"} alt=""/>
                            }
                        </>
                        :
                        <>  
                            {currentPerformance && currentPerformance > 0 ?
                            <>
                                <span className="text-green">{numberFormatWithSign(currentPerformance, '%')}</span>
                                <img className={"svg-icon pl-1 d-none d-lg-inline-block"} src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_up_green.svg"} alt=""/>
                            </> :
                            <>
                                <span className="text-pink">{numberFormatWithSign(currentPerformance, '%')}</span>
                                <img className={"svg-icon pl-1 d-none d-lg-inline-block"} src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_down_red.svg"} alt=""/>
                            </>
                            }
                        </>
                        }
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <div className={"high-low-label"}>
                        {`Hoch: ${ maxValue == null ? '--' : numberFormatDecimals(maxValue, decimals) }`}
                    </div>
                    <div className={"high-low-label"}>
                        {`Tief: ${ minValue == null ? '--' : numberFormatDecimals(minValue, decimals) }`}
                    </div>
                </div>
            </div>
            <div className="graph-chart-wrapper stock-chart-bo " style={{height: '80px'}}>
                {props.chart && !!chartOptions && 
                    <HighchartsReact
                        containerProps={{style: {height: "80px"}}}
                        highcharts={Highcharts}
                        constructorType={'stockChart'}
                        options={chartOptions}
                    />
                }
            </div>
            {props.children}
        </div>
    );
}

export default { InstrumentCard };
