import classNames from 'classnames';
import { Portfolio, Watchlist } from 'graphql/types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getDataForAssetAllocationPieCharts, PieChartColors } from '../../utils';
import './AssetAllocation.scss';
import { useBootstrapBreakpoint } from 'hooks/useBootstrapBreakpoint';
import { Col, Row } from 'react-bootstrap';

interface AssetAllocationItemProps {
    portfolio?: Portfolio;
    watchlist?: Watchlist;
    isWatchlist: boolean;
}

export function AssetAllocationItem(props: AssetAllocationItemProps) {

    let items: any = props.isWatchlist ? props.watchlist?.entries : props.portfolio?.entries;

    const piechartSize = useBootstrapBreakpoint({
        xl: '90%',
        lg: '110%',
        md: '130%'
    });

    function getOptions(dataType: string, size?: any): any {
        return {
            stockTools: {
                gui: {
                    enabled: false
                }
            },
            colors: PieChartColors,
            chart: { type: 'pie', backgroundColor: "#383838", height: "290px" },
            credits: { enabled: false },
            title: { text: '' },
            legend: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    innerSize: '70%',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    size: size ? size : piechartSize,
                    center: [, 100]
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
            tooltip: {
                headerFormat: "",
                pointFormat: props.isWatchlist ? '<span style="color:{point.color}">\u25CF <span style="color:"black""> {point.name} ({point.y})</span></span>' :
                    '<span style="color:{point.color}">\u25CF <span style="color:"black"">{point.len} {point.name} mit Gewichtung {point.y} %</span></span>'
            },
            series: [{
                type: 'pie',
                backgroundColor: "#383838",
                data: getDataForAssetAllocationPieCharts(dataType, items, props.portfolio),
            }],
        };
    }

    return (
        <Row className="mb-5 mt-2 px-2 d-xl-flex d-lg-flex d-md-flex d-sm-none text-white">
            <Col xl={12} lg={12} md={12} sm={12} className="px-0">
                <Row className="text-white justify-content-center fs-15-21-23">Asset Allocation</Row>
                <Row>
                    {["Gattung", "Währung", "Branchen", "Region"].map((each, index) =>
                        <Col xl={3} lg={3} key={index} className="px-1 asset-allocation-desktop-version">
                            <HighchartsReact highcharts={Highcharts} options={getOptions(each)} />
                            <h5 className="chart-inner-title">{each}</h5>
                            <div className={classNames("legend-big-asset-allocation ml-5 mt-xl-n4 mt-lg-n5 pt-1 ")}>
                                <LegendItem items={getDataForAssetAllocationPieCharts(each, items, props.portfolio)} />
                            </div>
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    );
}

function LegendItem(props: { items: { color: string, name: string, y: number }[] }) {
    return (<>
        {
            props.items.map((each, index) =>
                <div key={index} className="text-truncate">
                    <span className="dot mr-1" style={{ backgroundColor: PieChartColors[index] }}></span>
                    <span className="font-weight-bold"> {each.name.length > 15 ? (each.name.slice(0, 12) + "...") : each.name} </span>
                </div>
            )
        }
    </>
    );
}
