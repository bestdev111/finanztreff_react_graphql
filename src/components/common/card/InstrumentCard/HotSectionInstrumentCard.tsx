import {Chart, ChartPoint, InstrumentGroup, QuoteType, SnapQuote} from "../../../../generated/graphql";
import Highcharts from "highcharts/highstock";
import {Card} from "react-bootstrap";
import classNames from "classnames";
import {Link} from "react-router-dom";
import {formatPrice, getAssetLink, numberFormat, numberFormatWithSign, UpdateStateProps} from "../../../../utils";
import HighchartsReact from "highcharts-react-official";
import {ProfileInstrumentAddPopup} from "../../modals/ProfileInstrumentAddPopup";
import SvgImage from "../../image/SvgImage";
import {NewsInstrumentInfo} from "../../news/NewsInstrumentInfo";
import moment from "moment";
import {SeriesOptionsType} from "highcharts";
import {usePercentChangeVisualization} from "../../../../hooks/usePercentChangeVisualization";
import {useEffect, useState} from "react";


function createSeries(data: any[], dataThreshold?: number | null): SeriesOptionsType {
    return {
        name: 'Kurs', type: 'area', data:
        data.map((current): any => ({
            y: current.value,
            x: moment(current.when).toDate()
        })),
        threshold: dataThreshold,
        color: '#18C48F',
        negativeColor: '#f5335b',
        fillColor: 'transparent',
        lineWidth: 1.5,
        tooltip: {valueDecimals: 2}
    };
}

function createOptions(series: ChartPoint[], minValue: number, maxValue: number, threshold?: number): Highcharts.Options {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            margin: [0, 0, 4, 0],
            backgroundColor: 'transparent',
            height: 32,
            width: 100,
            style: {padding: '0 0 0 0'}
        },
        rangeSelector: {enabled: false},
        scrollbar: {enabled: false},
        navigator: {enabled: false},
        legend: {enabled: false},
        xAxis: {
            visible: false
        },
        yAxis: {
            type: 'linear',
            gridLineWidth: 0,
            floor: minValue * 0.9,
            ceiling: maxValue * 1.25,
            plotLines: threshold ? [{
                value: threshold,
                width: 1,
                color: '#7c7c7c'
            }] : [],
            labels: {enabled: false}
        },
        plotOptions: {
            series: {
                cursor: 'default',
                allowPointSelect: false,
                enableMouseTracking: false,
                label: {connectorAllowed: false}
            }
        },
        credits: {enabled: false},
        series: [createSeries(series, threshold)]
    }
}

interface HotSectionItemProperties {
    id?: number;
    name: string;
    url?: string | null;
    delay?: number | null
    price?: number | null;
    displayPrice?: string | null;
    performance?: number | null;
    currency?: string | null;
    group: InstrumentGroup;
    className?: string;
    trend?: boolean;
    interest?: boolean;
    activity?: boolean;
    snapQuote?: SnapQuote | null| undefined;
    chart?: Chart;
    isHomePage?: boolean
}

export function HotSectionInstrumentCard(props: HotSectionItemProperties) {
    let chartOptions: Highcharts.Options = {};
    const pushEvent =  usePercentChangeVisualization(props.id)
    let currentSnapQuote = pushEvent?.value || props.snapQuote;
    let currentQuote = (currentSnapQuote?.quotes || []).find(current => current?.type == QuoteType.Trade) || props.snapQuote?.quote;

    if (props.chart && props.chart.series && props.chart.series.length > 0) {
        let points = [...(props.chart.series[0].data || [])];
        // if (!!currentQuote && currentQuote.value) {
        //     points.push({value: currentQuote.value || 0, when: currentQuote.when});
        // }
        let minValue = Math.min(...points.map((current: ChartPoint) => current.value));
        let maxValue = Math.max(...points.map((current: ChartPoint) => current.value));
        chartOptions = createOptions(points, minValue, maxValue, props.chart.threshold?.value || undefined);
    }

    return (
        <>
            <Card className={classNames("text-white bg-dark p-2", props.className)}>
                <div>
                    <div className="d-flex justify-content-between">
                        <Link className="text-white text-truncate" to={getAssetLink(props.group) || ""}
                              style={{fontSize: 17}}>{props.name}</Link>
                        {props.group && props.group.id && props.id
                            && <ProfileInstrumentAddPopup
                                instrumentId={props.id}
                                instrumentGroupId={props.group.id}
                                name={props.name}
                                className="p-0 mr-n1"
                                watchlist={true} portfolio={true}>
                                <SvgImage icon="icon_plus_white.svg" convert={false} imgClass="shrink-08" width="28"/>
                            </ProfileInstrumentAddPopup>
                        }
                    </div>
                </div>
                <Card.Body className="my-n2">
                    <div className="m-n3 d-flex justify-content-between">
                        <div className="d-flex">
                            <span className="pr-2 text-nowrap ml-n1" style={{fontSize: 16}}>{formatPrice(currentQuote?.value, props.group.assetGroup)}
                                <span className="font-size-12px"> {props.currency}</span>
                            </span>
                        </div>
                        <span className={classNames(
                            "px-1 ",
                            !!currentQuote?.percentChange && (currentQuote?.percentChange > 0? 'text-green' : 'text-pink') || undefined,
                            props.isHomePage && pushEvent.toggle && 'asset-value-movement-blinker'
                        )}>
                            {numberFormatWithSign(currentQuote?.percentChange!,'%')}
                        </span>
                        {
                            !!currentQuote?.percentChange && (
                                (currentQuote?.percentChange > 0) ?
                                    <span className="svg-icon move-arrow">
                                        <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt="" />
                                    </span>
                                    : currentQuote?.percentChange && (currentQuote?.percentChange < 0) ?
                                    <span className="svg-icon move-arrow">
                                        <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt="" />
                                    </span>
                                    :
                                    <span className="svg-icon move-arrow">
                                        <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"} alt="" width={27} />
                                    </span>
                                )
                        }
                        {props.chart &&
                            <HighchartsReact
                                highcharts={Highcharts}
                                constructorType='stockChart'
                                options={chartOptions}
                            />
                        }
                    </div>
                </Card.Body>
                <Card.Footer className="d-flex border-top-1 border-gray pt-1 pl-0 mb-n3">
                    <div className={props.trend ? 'd-flex mr-2' : 'd-flex op-3'}>
                        <SvgImage icon="icon_hot_flame_white.svg" imgClass="svg-white pb-1 mr-0"
                                  spanClass="fire-icon" convert={false} width="18"/>
                        <span className="mt-1 font-size-13px">Trend</span>
                    </div>
                    <div className={props.interest ? 'd-flex mr-2' : 'd-flex op-3'}>
                        <SvgImage icon="icon_hot_flame_white.svg" imgClass="svg-white pb-1 mx-0"
                                  spanClass="fire-icon" convert={false} width="18"/>
                        <span className="mt-1 font-size-13px">Interesse</span>
                    </div>
                    <div className={props.activity ? 'd-flex mr-2' : 'd-flex op-3'}>
                        <SvgImage icon="icon_hot_flame_white.svg" imgClass="svg-white pb-1 mx-0"
                                  spanClass="fire-icon" convert={false} width="18"/>
                        <span className="mt-1 font-size-13px">Aktivität</span>
                    </div>
                </Card.Footer>
            </Card>
        </>
    );
}
