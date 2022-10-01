import { LimitEntry, QuoteType } from 'graphql/types';
import Highcharts, { numberFormat } from 'highcharts';
import { PieChartColors } from '../../utils'
import HighchartsReact from 'highcharts-react-official';
import { Button } from 'react-bootstrap';
import SvgImage from 'components/common/image/SvgImage';
import classNames from 'classnames';
import { LimitEditDelete } from 'components/profile/LimitsPage/LimitsBanner/LimitEditDelete';
import { AssetLinkComponent } from 'components/profile/common/AssetLinkComponent';
import { ProfileInstrumentAddPopup } from 'components/common/modals/ProfileInstrumentAddPopup';
import { formatPrice } from 'utils';

export function LimitItem(props: LimitItemProps) {

    let currentLimits = props.limits
        .filter(current => current.instrument !== null && current.limitValue && current.hitStatus == false && current.initialValue)
        .sort((a, b) => getPercentage(a.instrument?.snapQuote?.lastPrice || 0, a.effectiveLimitValue || 0, a.upper || false) -
            getPercentage(b.instrument?.snapQuote?.lastPrice || 0, b.effectiveLimitValue || 0, b.upper || false));

    function getSeries() {
        return [
            { name: '<a style="color:white" href="/mein-finanztreff/limits"> Absolut Limits</a>', x: 'icon_absolute_white', y: currentLimits.filter(current => current.trailing == false && current.percent == false).length, z: currentLimits.filter(current => current.trailing == false && current.percent == false && current.upper).length },
            { name: '<a style="color:white" href="/mein-finanztreff/limits"> Relativ Limits</a>', x: 'icon_percent_white', y: currentLimits.filter(current => current.trailing == false && current.percent == true).length, z: currentLimits.filter(current => current.trailing == false && current.percent == true && current.upper).length },
            { name: '<a style="color:white" href="/mein-finanztreff/limits"> Tralings</a>', x: 'icon_repeat_white', y: currentLimits.filter(current => current.trailing == true).length, z: currentLimits.filter(current => current.trailing == true && current.upper).length }
        ]
    }

    let options = {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        colors: PieChartColors,
        chart: {
            type: 'pie',
            backgroundColor: "#383838"
        },
        title: { text: '' },
        credits: { enabled: false },
        plotOptions: {
            pie: {
                innerSize: '70%',
                size: "300px",
                dataLabels: {
                    softConnector: false,
                    connectorColor: "white",
                    connectorShape: "crookedLine",
                    crookDistance: "20%"
                },
            },

            series: {
                pointPadding: 0.4,
                borderWidth: 3,
                borderColor: "#383838",
                dataLabels: {
                    enabled: true,
                    formatter: function (chart: any) {
                        let point: any = this;
                        if (point.point.y > 0) return '<div class="name "><img src="/static/img/svg/' + point.point.x + '.svg" style="width: 23px; height: auto"></img>' + point.point.name + "<br/>"
                            + (Number.parseInt(point.point.z) > 0 ? ' <span style="background-color:#18C48F; padding: 3px; margin-left: 24px; border-radius: 0.1em"> <img src="/static/img/svg/icon_limit_top_white.svg" style="width: 23px; height: auto"></img>' + point.point.z + '</span></span>' : "")
                            + (Number.parseInt(point.point.y) - Number.parseInt(point.point.z) > 0 ? ' <span style="background-color:#e03c68; padding: 4px;' + (Number.parseInt(point.point.z) <= 0 ? "margin-left: 24px;" : "margin-left: 4px;") + 'border-radius: 0.1em"> <img src="/static/img/svg/icon_limit_bottom_white.svg" style="width: 23px; height: auto"></img>' + (point.point.y - point.point.z) + '</span></span></div>' : "");

                    },
                    //format: '{point.x} {point.name}',
                    useHTML: true,
                    style: {
                        fontSize: "13px",
                        color: "white",
                        fontFamily: "Roboto",
                        textOutline: false,
                        fontWeight: "100"
                    },
                },
            },
        },
        tooltip: {
            headerFormat: "",
            useHtml: true,
            pointFormat: '<span style="color:{point.color}">\u25CF <span style="background-color:"white !important"">{point.y} {point.name}</span></span>',
            backgroundColor: 'rgba(0 0 0 50)',
            style: {
                color: "white",
            },
        },
        series: [{
            name: "Portfolios",
            backgroundColor: "#383838",
            useHTML: true,
            data: getSeries()
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 360
                },
                chartOptions: {
                    chart: {
                        height: 200
                    },
                    plotOptions: {
                        pie: {
                            size: "160px",
                        }
                    },
                }
            }]
        }
    };

    function getPercentage(currentValue: number, targetValue: number, upper: boolean) {
        let percent = currentValue && targetValue ?
            Math.abs(targetValue - currentValue) / currentValue
            : 0
        percent = upper ? percent : -percent;
        return percent * 100;
    }

    return (
        <>
            <div className="carousel-item active" slide-type="my-portfolios">
                <div className="slide-content row">
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <h1 className="slide-title text-center">
                                    Hallo {props.userName}, hier sehen Sie den Gesamtüberblick über Ihre Limits
                                </h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="carousel-item-left-part col-xl-6">
                                <div className="chart-wrapper limit-pie-chart" mocked-chart="pie-chart-on-dark-no-legend">
                                    <HighchartsReact highcharts={Highcharts} options={options} />
                                    <h5 className="chart-inner-title">
                                        <div>{currentLimits.length} Limits</div>
                                        <div>Aufteilung nach</div>
                                        <div>Art</div>
                                    </h5>
                                </div>
                            </div>
                            <div className="carousel-item-right-part col-xl-6">

                                <div className="hor-graph-wrapper">
                                    <div className="top-row">
                                        <div className="d-flex justify-content-between">
                                            <div>Limits vor Zielerreichnung</div>
                                        </div>
                                    </div>

                                    <div className="d-none d-md-block pb-1 border-bottom-1" style={{ borderColor: "rgba(256,256,256,0.33)" }}>
                                        <div className="d-flex justify-content-between font-weight-bold">
                                            <div className="w-25 text-left">Wertpapier</div>
                                            <div className="w-25 text-right">Aktuell</div>
                                            <div className="w-25 text-right">Limit</div>
                                            <div className="w-25 text-right">Abstand</div>
                                        </div>
                                    </div>

                                    <div className="hor-graph pt-2">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                {currentLimits.map((current: LimitEntry, index: number) => {
                                                    const quote = current && current.instrument && current.instrument.snapQuote && current.instrument.snapQuote.quotes && current.instrument.snapQuote.quotes.filter(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue)[0];
                                                    const percentToTarger = current.effectiveLimitValue && current.effectiveLimitValue > 0 && quote && quote.value ? (Math.abs(Math.abs(current.effectiveLimitValue - quote.value) / quote.value) * 100) : 0;
                                                    if (index < 7)
                                                        return (
                                                            <div className={classNames("bar-holder", index > 4 && "d-none d-xl-block")} key={index}>
                                                                <div className="bar-legend d-flex justify-content-between w-100">
                                                                    <div className="d-flex font-weight-bold w-25 w-sm-50 text-no-wrap">
                                                                        <ProfileInstrumentAddPopup
                                                                            instrumentId={current.instrument?.id || 0}
                                                                            instrumentGroupId={current.instrument?.group.id || 0}
                                                                            name={current.instrument?.name || ""}
                                                                            className="p-0 mr-n1 mt-lg-n1 mt-xl-n1 mt-sm-0"
                                                                            watchlist={true} portfolio={true}>
                                                                            <SvgImage icon="icon_plus_white.svg" convert={false} imgClass="shrink-08" width="28" />
                                                                        </ProfileInstrumentAddPopup>
                                                                        <AssetLinkComponent instrument={current.instrument} className="ml-1 text-white text-truncate mt-lg-0 mt-sm-1" />
                                                                    </div>
                                                                    <div className="w-25 text-right mr-5 mr-md-0 d-none d-md-inline"> {numberFormat(quote?.value|| 0, 2)} {current.instrument?.currency.displayCode}</div>
                                                                    <LimitEditDelete
                                                                        limit={current}
                                                                        refreshTrigger={() => props.refetch()}
                                                                        variant="link" className="w-25 d-flex limit-value text-nowrap"
                                                                    >
                                                                        <span>
                                                                            {
                                                                                current.trailing ?
                                                                                    <>
                                                                                        <SvgImage icon="icon_repeat_white.svg" convert={false} width="25" />
                                                                                    </>
                                                                                    : current.percent ?
                                                                                        <>
                                                                                            <SvgImage icon="icon_percent_white.svg" convert={false} width="25" />
                                                                                        </>
                                                                                        : <>
                                                                                            <SvgImage icon="icon_absolute_white.svg" convert={false} width="25" />

                                                                                        </>
                                                                            }
                                                                            {
                                                                                current.upper ?
                                                                                    <>
                                                                                        <SvgImage icon="icon_limit_top_green.svg" convert={false} width="25" />
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <SvgImage icon="icon_limit_bottom_pink.svg" convert={false} width="25" />
                                                                                    </>
                                                                            }
                                                                        </span>
                                                                        <div>
                                                                            <span className="d-none d-xl-inline">
                                                                                {numberFormat(current.limitValue || 0, 2)} {current.trailing || current.percent ? "%" : current.instrument?.currency.displayCode}
                                                                            </span>
                                                                        </div>
                                                                    </LimitEditDelete>
                                                                    <div className='w-25 text-right font-weight-bold'>
                                                                        {formatPrice(percentToTarger, current.instrument?.group.assetGroup,quote?.value, "%")}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                })}


                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="mt-2 mx-sm-auto ml-lg-auto mr-lg-2">
                                <Button variant="primary" href="#limits-section">
                                    Zu den Limits
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

interface LimitItemProps {
    userName: String;
    limits: Array<LimitEntry>;
    refetch: (value?: LimitEntry) => void;
}