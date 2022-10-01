import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import Highcharts from "highcharts/highstock";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { SeriesOptionsType } from "highcharts";
import SvgImage from "components/common/image/SvgImage";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { NewsInstrumentInfo } from "components/common/news/NewsInstrumentInfo";
import { Chart, InstrumentGroup, Query, ChartPoint, ChartSeries, SnapQuote } from "generated/graphql";
import HighchartsReact from "highcharts-react-official";
import { getFinanztreffAssetLink, numberFormat } from "utils";
import { IndexCompositionModal } from "./IndexCompositionModal";
import './IndexFindInstrumentCard.scss';
import classNames from "classnames";


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
        chart: {
            margin: [0, 0, 4, 0],
            backgroundColor: 'transparent',
            height: 36,
            width: 200,
            style: { padding: '0 0 0 0' },
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
        stockTools: {
            gui: {
                enabled: false
            }
        },
        credits: { enabled: false },
        series: data.series.map((serie: any) => createSeries(serie.data, data?.threshold?.value))
    }
}

interface IndexFindInstrumentCardProps {
    id: number;
    name: string;
    url?: string | null;
    delay?: number | null;
    price?: number | null;
    displayPrice?: string | null;
    performance?: number | null;
    currency?: string | null;
    group: InstrumentGroup;
    className?: string;
    country?: string;
    isoAlphaCode?: string;
    showCardFooter?: boolean;
    snapQuote?: SnapQuote;
    skip?: boolean;
    chart?: Chart
}

export function IndexFindInstrumentCard(props: IndexFindInstrumentCardProps) {

    let chartOptions: Highcharts.Options = {};
    let minValue: number | null = null, maxValue: number | null = null;
    if (props.chart && props.chart.series && props.chart.series.length > 0) {
        let points = props.chart.series[0].data || [];
        minValue = Math.min(...points.map((current: ChartPoint) => current.value));
        maxValue = Math.max(...points.map((current: ChartPoint) => current.value));
        chartOptions = createOptions(props.chart, minValue, maxValue);
    }
    return (
        <>
            <Card className={classNames("text-dark p-2 borderless mb-sm-3 mb-xl-0 mb-md-0", props.className)}>
                <div>
                    <div className="d-flex justify-content-between">
                        {props.group && props.group?.name &&
                            (props.group?.assetGroup && props.group?.seoTag ?
                                <Link
                                    to={getFinanztreffAssetLink(props.group.assetGroup, props.group.seoTag)}
                                    className="fs-15px text-dark font-weight-bold line-height-16px max-width-260px max-height-32px text-truncate">
                                    {props.group.name}
                                </Link> :
                                <div className="fs-15px text-dark font-weight-bold line-height-16px max-width-260px max-height-32px text-truncate">
                                    {props.group.name}
                                </div>
                            )
                        }
                        {props.group && props.group.id && props.id
                            && <ProfileInstrumentAddPopup
                                instrumentId={props.id}
                                instrumentGroupId={props.group.id}
                                name={props.name}
                                className="p-0 mr-n1"
                                watchlist={true} portfolio={true}>
                                <SvgImage icon="icon_plus_blue.svg" convert={false} imgClass="shrink-08" width="28" style={{ marginTop: "-5px", marginBottom: "5px" }} />
                            </ProfileInstrumentAddPopup>
                        }
                    </div>
                </div>
                <Card.Body className="my-n2">
                    <div className="mt-n4 ml-n3 d-flex justify-content-between pb-0 align-items-end align-vertical-text">
                            <span className="pr-2 text-nowrap ml-n1" style={{fontSize: 16}}>{props.displayPrice}
                                {/* snap quote */}
                                <span className="font-size-12px"> {props.currency}</span> 
                                {/* percent */}
                            </span>
                            <NewsInstrumentInfo className="font-weight-bolder ml-n2 text-normal" id={props.id} showCurrency={true} showPrice={true} snapQuote={props.snapQuote}/>
                            {
                                !!props.snapQuote?.quote?.percentChange && (
                                    (props.snapQuote?.quote?.percentChange > 0) ?
                                        <>
                                            <span className="px-1 text-green"> +{numberFormat(props.snapQuote?.quote?.percentChange!)}%</span>
                                            <span className="svg-icon move-arrow pr-2">
                                                <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt="" />
                                            </span>
                                        </>
                                        : props.snapQuote?.quote?.percentChange && (props.snapQuote?.quote?.percentChange < 0) ?
                                        <>
                                            <span className="px-1 text-pink"> {numberFormat(props.snapQuote?.quote?.percentChange!)}%</span>
                                            <span className="svg-icon move-arrow pr-2">
                                                <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt="" />
                                            </span>
                                        </>
                                        :
                                        <>
                                            <span className="px-1"> 0.00%</span>
                                            <span className="svg-icon move-arrow pr-2">
                                                <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"} alt="" width={27} />
                                            </span>
                                        </>
                                    )
                            }
                            {
                                props.chart && props.chart.series.length>0 && <HighchartsReact
                                    highcharts={Highcharts}
                                    constructorType='stockChart'
                                    options={chartOptions}
                                />
                            }
                    </div>
                </Card.Body>
                {props.showCardFooter &&
                    <Card.Footer className="d-flex border-top-1 pt-1 px-0 bg-white pb-0 justify-content-between align-items-center">
                        <div className="d-flex ml-0 ">
                            {props.isoAlphaCode &&
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + props.isoAlphaCode + ".svg"} alt="" className="svg-convert svg-blue" width="24px" height="20px" />
                            }
                            <span className="ml-2 my-auto font-size-13px">{props.country}</span>
                        </div>
                        <div className="d-flex ">
                            {props.group.compositions && <IndexCompositionModal group={props.group} />}
                        </div>
                    </Card.Footer>
                }
            </Card>
        </>
    );
}
