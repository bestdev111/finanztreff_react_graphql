import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import Highcharts from "highcharts/highstock";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { SeriesOptionsType } from "highcharts";
import SvgImage from "components/common/image/SvgImage";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { Chart, InstrumentGroup, Query, ChartPoint } from "generated/graphql";
import HighchartsReact from "highcharts-react-official";
import { getFinanztreffAssetLink } from "utils";
import classNames from "classnames";
import React from "react";
import { CurrencyTradeQuoteInfo } from "../CurrencyCardInfo/CurrencyTradeQuoteInfo";


export function createSeries(data: any[], dataThreshold?: number | null): SeriesOptionsType {
    return {
        name: 'Kurs', type: 'area', data: data.map((current): any => ({
            y: current.value,
            x: moment(current.when).toDate()
        })),
        threshold: dataThreshold,
        color: '#18C48F',
        negativeColor: '#f5335b',
        fillColor: 'transparent',
        lineWidth: 1.5,
        tooltip: { valueDecimals: 2 }
    };
}

export function createOptions(data: Chart, minValue: number, maxValue: number): Highcharts.Options {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            margin: [0, 0, 4, 0],
            backgroundColor: 'transparent',
            height: 48,
            width: 220,
            style: { padding: '0 0 0 0' }
        },
        rangeSelector: { enabled: false },
        scrollbar: { enabled: false },
        navigator: { enabled: false },
        legend: { enabled: false },
        xAxis: {
            visible: false
        },
        yAxis: {
            type: 'linear',
            gridLineWidth: 0,
            floor: minValue * 0.9,
            ceiling: maxValue * 1.25,
            plotLines: data.threshold?.value ? [{
                value: data.threshold?.value,
                width: 1,
                color: '#7c7c7c'
            }] : [],
            labels: { enabled: false }
        },
        plotOptions: {
            series: {
                cursor: 'default',
                allowPointSelect: false,
                enableMouseTracking: false,
                label: { connectorAllowed: false }
            }
        },
        credits: { enabled: false },
        series: data.series.map((serie: any) => createSeries(serie.data, data?.threshold?.value))
    }
}

interface CurrencyFindInstrumentCardProps {
    id: number;
    group: InstrumentGroup;
    className?: string;
}

export function CurrencyFindInstrumentCard(props: CurrencyFindInstrumentCardProps) {
    let { loading, data } = useQuery<Query>(
        loader('./getInstrumentChart.graphql'),
        { variables: { instrumentId: props.id, chartScope: 'INTRADAY' } }
    )
    let chartOptions: Highcharts.Options = {};
    let minValue: number | null = null, maxValue: number | null = null;
    if (!loading) {
        if (data?.instrument?.chart?.series && data?.instrument?.chart?.series.length > 0) {
            let points = data?.instrument?.chart?.series[0].data || [];
            minValue = Math.min(...points.map((current: ChartPoint) => current.value));
            maxValue = Math.max(...points.map((current: ChartPoint) => current.value));
            chartOptions = createOptions(data.instrument.chart, minValue, maxValue);
        }
    }
    return (
        <>
            <Card className={classNames("text-dark p-2 borderless mb-sm-3 mb-xl-0 mb-md-0", props.className)}>
                <div>
                    <div className="d-flex justify-content-between">
                        <div className="d-inline-flex">
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + props.group.name.slice(0, 3).toLowerCase() + ".svg"} alt="" className=" svg-blue" width="24px" height="16px" />
                            {props.group && props.group?.name &&
                                (props.group?.assetGroup && props.group?.seoTag ?
                                    <Link
                                        to={getFinanztreffAssetLink(props.group.assetGroup, props.group.seoTag)}
                                        className="fs-20px text-dark font-weight-bold line-height-16px text-truncate mx-1">
                                        {props.group.name.slice(0,7)}
                                    </Link> :
                                    <div className="fs-20px text-dark font-weight-bold line-height-16px text-truncate mx-1">
                                        {props.group.name.slice(0,7)}
                                    </div>
                                )
                            }
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + props.group.name.slice(4, 7).toLowerCase() + ".svg"} alt="" className=" svg-blue" width="24px" height="16px" />
                        </div>
                        <div className="d-flex justify-content-end">
                            <SvgImage icon="icon_arrow_leftandright.svg" convert={false} imgClass="shrink-08" width="28" style={{ marginTop: "-5px", marginBottom: "5px" }} />

                            {props.group && props.group.id && props.id
                                && <ProfileInstrumentAddPopup
                                    instrumentId={props.id}
                                    instrumentGroupId={props.group.id}
                                    name={props.group.name}
                                    className="p-0 mr-n1"
                                    watchlist={true} portfolio={true}>
                                    <SvgImage icon="icon_plus_blue.svg" convert={false} imgClass="shrink-08" width="28" style={{ marginTop: "-5px", marginBottom: "5px" }} />
                                </ProfileInstrumentAddPopup>
                            }
                        </div>
                    </div>
                </div>
                <Card.Body className="mt-n1 ml-n1">
                    <div className="m-n3 d-flex justify-content-between pb-0 align-items-end">
                        <CurrencyTradeQuoteInfo className="font-weight-bolder ml-n2 text-normal" id={props.id}/>
                        {
                            !loading && <HighchartsReact
                                highcharts={Highcharts}
                                constructorType='stockChart'
                                options={chartOptions}
                            />
                        }
                    </div>
                </Card.Body>
                <Card.Footer className="d-flex pt-1 px-0 bg-white pb-0 justify-content-between align-items-center">
                    <div className="ml-0 font-size-13px">Passende Produkte</div>
                    <div>
                        <span className="mt-1 mx-1 text-blue font-weight-bold font-size-13px">Zertifikate</span>
                        <span className="mt-1 mx-1 text-blue font-weight-bold font-size-13px">KO</span>
                        <span className="mt-1 mx-1 text-blue font-weight-bold font-size-13px">OS</span>
                    </div>
                </Card.Footer>
            </Card>
        </>
    );
}