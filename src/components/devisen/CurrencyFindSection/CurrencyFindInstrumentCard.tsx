import Highcharts from "highcharts/highstock";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { SeriesOptionsType } from "highcharts";
import SvgImage from "components/common/image/SvgImage";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { Chart, InstrumentGroup, Query, ChartPoint, SnapQuote } from "generated/graphql";
import HighchartsReact from "highcharts-react-official";
import { getFinanztreffAssetLink } from "utils";
import classNames from "classnames";
import './CurrencyFindInstrumentCard.scss';
import { CurrencyTradeQuoteInfoCard } from "./CurrencyTradeAndQuoteInfoCard";


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
    chartScope?: string;
    snapQuote?: SnapQuote;
    chart?: Chart
    fontSize?: string;
}

export function CurrencyFindInstrumentCard(props: IndexFindInstrumentCardProps) {
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
                <div id="currency-find-instrument-card">
                    <div className="d-flex justify-content-between">
                        <div className="d-inline-flex">
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + props.group.name.slice(0, 3).toLowerCase() + ".svg"} alt="" className="svg-blue" width="24px" height="16px" />
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
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + props.group.name.slice(4, 7).toLowerCase() + ".svg"} alt="" className="svg-convert svg-blue" width="24px" height="16px" />
                        </div>
                        <div className="d-flex justify-content-end">
                        <SvgImage icon="icon_arrow_leftandright.svg" convert={false} imgClass="shrink-08 disabled-switch-icon-fix" width="28" style={{ marginTop: "-5px", marginBottom: "5px" }} />
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
                </div>
                <Card.Body className="my-n2 ml-n1">
                    <div className="m-n3 d-flex justify-content-between pb-0 align-items-end">
                        <CurrencyTradeQuoteInfoCard fontSize={props.fontSize} snapQuote={props.snapQuote}/>
                        {
                            props.chart && props.chart.series.length > 0 && <HighchartsReact
                                highcharts={Highcharts}
                                constructorType='stockChart'
                                options={chartOptions}
                            />
                        }
                    </div>
                </Card.Body>
                { props.showCardFooter && 
                <Card.Footer className="d-flex border-top-1 pt-1 px-0 bg-white pb-0 justify-content-between align-items-center borderless shadow-none">
                    <div className="ml-0 font-size-13px">Passende Produkte</div>
                    <div>
                        <span className="mt-1 mx-1 text-blue font-weight-bold font-size-13px currency-instrument-card-disabled-fix">Zertifikate</span>
                        <span className="mt-1 mx-1 text-blue font-weight-bold font-size-13px currency-instrument-card-disabled-fix">KO</span>
                        <span className="mt-1 mx-1 text-blue font-weight-bold font-size-13px currency-instrument-card-disabled-fix">OS</span>
                    </div>
                </Card.Footer>
                }
            </Card>
        </>
    );
}