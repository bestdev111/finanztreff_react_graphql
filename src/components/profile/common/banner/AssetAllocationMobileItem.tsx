import { Portfolio, Watchlist } from 'graphql/types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {useState} from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';
import { getDataForAssetAllocationPieCharts, PieChartColors } from '../../utils'


interface AssetAllocationMobileItemProps {
    portfolio?: Portfolio
    watchlist?: Watchlist
    isWatchlist: boolean
}

interface AssetAllocationMobileItemState {
    chartName: string
}

export function AssetAllocationMobileItem(props: AssetAllocationMobileItemProps) {

    let [state, setState] = useState<AssetAllocationMobileItemState>({ chartName: "Gattung" });
    let items: any = props.isWatchlist ? props.watchlist?.entries : props.portfolio?.entries;

    let option = {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        colors: PieChartColors,
        chart: { type: 'pie', backgroundColor: "#383838", height: "350px", margin: [0, 0, 0, 0] },
        credits: { enabled: false },
        title: { text: '' },
        legend: {
            layout: 'vertical',
            itemStyle: {
                color: 'white',
                fontWeight: "100",
            },
            //align: 'center',
            verticalAlign: 'bottom',
            x: -80,
            y: 0,
            maxHeight: "100px"
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
                size: "50%",
                center: [195, 80]
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
            data: getDataForAssetAllocationPieCharts(state.chartName, items, props.portfolio)
        }
        ],
    }
    return (
        <Row className="px-2 my-5 d-xl-none d-lg-none d-md-none d-sm-flex text-white">
            <Col xl={12} lg={12} md={12} sm={12} className="px-0">
                <Row className="text-white justify-content-center fs-15px">Asset Allocation</Row>
                <Row className="w-100">
                    <Dropdown className="mobile-dropdown">
                        <Dropdown.Header>
                            <DropdownToggle className="mobile-button">
                                {state.chartName}
                            </DropdownToggle>
                        </Dropdown.Header>
                        <DropdownMenu className="dropdown-menu-mobile">
                            {["Gattung", "Währung", "Branchen", "Region"].map(each =>
                                <Dropdown.Item onSelect={() => setState({ chartName: each })} key={each}>
                                    {each}
                                </Dropdown.Item>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                    <Row className="asset-allocation-mobile-version">
                        <HighchartsReact highcharts={Highcharts} options={option} />
                    </Row>
                </Row>
            </Col>
        </Row>
    );

}
