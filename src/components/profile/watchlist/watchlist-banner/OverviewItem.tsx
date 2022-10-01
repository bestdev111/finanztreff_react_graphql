import Highcharts from 'highcharts';
import { Watchlist } from 'graphql/types';
import HighchartsReact from 'highcharts-react-official';
import { getAssetGroup, getColorOfAssetGroup, AssetTypes, percentChange } from '../../utils';
import classNames from 'classnames';
import { NewsCountComponent } from 'components/profile/common/NewsCount/NewsCountComponent';
import { useBootstrapBreakpoint } from 'hooks/useBootstrapBreakpoint';

export function OverviewItem(props: OverviewItemProps){

    const size = useBootstrapBreakpoint({
        xl: '300px',
        lg: '300px',
        md: '200px',
        sm: '200px'
    });

    const center = useBootstrapBreakpoint({
        xl: false,
        lg: false,
        md: true,
        sm: true
    });

    const options = {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            type: 'pie',
            backgroundColor: "#383838"
        },
        credits: { enabled: false },
        title: { text: '' },
        plotOptions: {
            pie: {
                innerSize: '70%',
                size: size,
                center: center ? [145, 90] : "",
                dataLabels: {
                    softConnector: false,
                    connectorColor: "white",
                },
            },
            series: {
                pointPadding: 0.4,
                borderWidth: 3,
                borderColor: "#383838",
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style: {
                        fontSize: "13px",
                        color: "white",
                        fontFamily: "Roboto",
                        backgroundColor: "#383838",
                        textOutline: false,
                        fontWeight: "100"
                    },
                },
            },
        },
        series: [{
            name: "Watchlists",
            backgroundColor: "#383838",
            dataLabels: {
                fontWeight: "20px",

            },
            data:
                AssetTypes.map(type => {
                    let len = props.watchlist.entries?.filter(current => current.instrument && current.instrument.group.assetGroup && current.instrument.group.assetGroup === type).length!
                    return len != null && len > 0 ? ({ name: getAssetGroup(type) + " (" + len + ")", y: len, color: getColorOfAssetGroup(type) }) : null;
                })
        }],
    };

    let width = props.watchlist?.entries!.length;
    let positiveMovement = props.watchlist?.entries!.filter(current => percentChange(current) > 0).length;
    let negativeMovement = props.watchlist?.entries!.filter(current => percentChange(current) < 0).length;
    let neutralMovement = props.watchlist?.entries!.filter(current => percentChange(current) === 0).length;

    let isinList : string[] = [];
    props.watchlist.entries?.filter(entry => entry && entry.instrument && entry.instrument.isin).map(entry => isinList.push(entry!.instrument!.isin!));
    return (
        <>
            <div className={classNames("carousel-item active")} slide-type="uberblick">
                <div className="slide-content row pr-dn">
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <h4 className="slide-title text-center">Überblick</h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="carousel-item-left-part col-xl-6">
                                <div className="chart-wrapper" mocked-chart="pie-chart-on-dark-no-legend-2" style={{height: center ? "300px" : "unset"}}>
                                    <h5 className="chart-inner-title">
                                        <div>{props.watchlist.entries?.length} Werte</div>
                                        <div>in dieser Watchlist</div>
                                    </h5>
                                    <HighchartsReact highcharts={Highcharts} options={options} />
                                </div>
                            </div>
                            <div className="carousel-item-right-part col-xl-6">

                                <div className="hor-progress-bar-wrapper">
                                    <div className="tools-hr-bar pt-xl-5 pt-lg-3 pt-sm-0">
                                        <div className="top-info text-center">
                                            Tops und Flops
                                        </div>
                                        <div className="bar-holder">
                                            <div className="horizontal-bar-movement height-big progress justify-content-between">
                                                <div className="progress-bar bg-pink" role="progressbar" style={{ width: negativeMovement / width * 100 + "%" }}>
                                                </div>
                                                <div className="progress-bar bg-kurs-grau with-edge-margin" role="progressbar" style={{ width: neutralMovement / width * 100 + "%" }}>
                                                </div>
                                                <div className="progress-bar bg-green" role="progressbar" style={{ width: positiveMovement / width * 100 + "%" }}>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bottom-info">
                                            <div className="bg-pink">FLOPS <span>({negativeMovement})</span></div>
                                            <div className="bg-kurs-grau">Keine Änderung <span>({neutralMovement})</span></div>
                                            <div className="bg-green">TOPS <span>({positiveMovement})</span></div>
                                        </div>
                                    </div>
                                    <NewsCountComponent className='news-count-component pb-sm-5' isins={isinList}/>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

interface OverviewItemProps {
    watchlist: Watchlist;
}