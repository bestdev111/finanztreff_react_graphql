import SvgImage from "components/common/image/SvgImage";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { NewsInstrumentInfo } from "components/common/news/NewsInstrumentInfo";
import { Chart, InstrumentGroup, SnapQuote } from "graphql/types";
import { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {ChartPoint} from "../../../../generated/graphql"
import { getFinanztreffAssetLink, numberFormatWithSign, numberFormat } from "utils";
import Highcharts from "highcharts/highstock";

function createSeries(data: any[], dataThreshold?: number | null): SeriesOptionsType {
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
        tooltip: {valueDecimals: 2}
    };
}

function createOptions(data: Chart, minValue: number, maxValue: number): Highcharts.Options {
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
            plotLines: data.threshold?.value ? [{
                value: data.threshold?.value,
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
        series: data.series.map((serie: any) => createSeries(serie.data, data?.threshold?.value))
    }
}

interface CommodityFindInstrumentCardProps {
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
    line200dayValue?: any;
    alltimeValue?: any;
    yearValue?: any;
    performanceValue? : any;
    selected? : string;
    snapQuote?: SnapQuote;
    chart?: Chart
}

export function CommodityFindInstrumentCard(props: CommodityFindInstrumentCardProps) {
    let chartOptions: Highcharts.Options = {};
    let minValue: number | null = null, maxValue: number | null = null;
        if (props.chart && props.chart.series && props.chart.series.length > 0) {
            let points = props.chart.series[0].data || [];
            minValue = Math.min(...points.map((current: ChartPoint) => current.value));
            maxValue = Math.max(...points.map((current: ChartPoint) => current.value));
            chartOptions = createOptions(props.chart, minValue, maxValue);
    }
    // function commodityFilterRow(type?: string, period? : number){
    //     let value: any;
    //     let title: string= "";
    //     switch(type){
    //         case 'line200day':
    //             title = 'Abstand 200T Linie: ';
    //             value = props.line200dayValue; break;
    //         case 'alltime':
    //             title = 'Abstand Allzeithoch: ';
    //             value = props.alltimeValue; break;
    //         case 'year':
    //             title = 'Abstand 52wochenhoch: ';
    //             value = props.yearValue; break;
    //         case 'performance':
    //             title = 'Performance' + period;
    //             value = props.performanceValue; break;
    //     }
    
    //     return (
    //         <div className="commodity-filter-row">
    //             {title}
    //             <span className={"pl-1 text-"+ (value ? ( value < 0 )? 'red':'green' : "")}>
    //                 {numberFormatWithSign(value,"%")}
    //             </span>
    //         </div>
    //     );
    // }
    return (
        <>
            <Card className="text-dark p-2 borderless mb-sm-3 mb-xl-0 mb-md-0 commodity-find-card">
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
                    <div className="m-n3 d-flex justify-content-between">
                        <div className="d-flex">
                            <span className="pr-2 text-nowrap ml-n1" style={{fontSize: 16}}>{props.displayPrice}
                                {/* snap quote */}
                                <span className="font-size-12px"> {props.currency}</span> 
                                {/* percent */}
                            </span>
                                {
                                    !!props.snapQuote?.quote?.percentChange && (
                                        (props.snapQuote?.quote?.percentChange > 0) ?
                                            <>
                                                <span className="px-1 text-green"> +{numberFormat(props.snapQuote?.quote?.percentChange!)}%</span>
                                                <span className="svg-icon move-arrow">
                                                    <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt="" />
                                                </span>
                                            </>
                                            : props.snapQuote?.quote?.percentChange && (props.snapQuote?.quote?.percentChange < 0) ?
                                            <>
                                                <span className="px-1 text-pink"> {numberFormat(props.snapQuote?.quote?.percentChange!)}%</span>
                                                <span className="svg-icon move-arrow">
                                                    <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt="" />
                                                </span>
                                            </>
                                            :
                                            <>
                                                <span className="px-1"> 0.00%</span>
                                                <span className="svg-icon move-arrow">
                                                    <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"} alt="" width={27} />
                                                </span>
                                            </>
                                        )
                                }
                            <NewsInstrumentInfo className="font-weight-bolder" snapQuote={props.snapQuote}/>
                        </div>
                        {
                            props.chart && <HighchartsReact
                                highcharts={Highcharts}
                                constructorType='stockChart'
                                options={chartOptions}
                            />
                        }
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}