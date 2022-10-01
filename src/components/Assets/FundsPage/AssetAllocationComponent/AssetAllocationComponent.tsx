import { CarouselWrapper } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { PieChartColors } from "components/profile/utils";
import { FundPortfolio } from "generated/graphql";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Carousel, CarouselItem, Row } from "react-bootstrap";
import ReactDOM from "react-dom";
import './AssetAllocation.scss';
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

export function AssetAllocationComponent(props: { portfolios: FundPortfolio[] }) {

    function getOptions(portfolio: FundPortfolio): any {
        return {
            stockTools: {
                gui: {
                    enabled: false
                }
            },
            colors: PieChartColors,
            chart: {
                type: 'pie',
                height: "300px",
                style: {
                    margin: "0 auto"
                }
            },
            credits: { enabled: false },
            title: {
                text: portfolio.name,
                verticalAlign: 'middle',
                widthAdjust: -300,
                style: {
                    fontSize: "25px",
                    fontWeight: "bold",
                    color: "#383838",
                    fontFamily: "Roboto",
                }
            },
            legend: { enabled: false },
            plotOptions: {
                pie: {
                    innerSize: '75%',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        connectorShape: 'crookedLine',
                        connectorColor: "black",
                        color: "black",
                        format: '{point.name} ({y}%)'
                    },
                    size: "100%",
                },
                series: {
                    pointPadding: 0.4,
                    borderWidth: 3,
                    borderColor: "white",
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        style: {
                            fontSize: "13px",
                            color: "black",
                            fontFamily: "Roboto",
                            backgroundColor: "white",
                            textOutline: false,
                            fontWeight: "100"
                        },
                    },
                },
            },
            tooltip: {
                headerFormat: "",
                pointFormat: '<span style="color:{point.color}">\u25CF <span style="color:"black""> {point.name} ({point.y}%)</span></span>'
            },
            series: [{
                type: 'pie',
                backgroundColor: "white",
                data: portfolio.entries.map(entry => {
                    return ({
                        name: entry.name || "",
                        y: entry.percent || 0
                    })
                }),
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 360
                    },
                    chartOptions: {
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    enabled: false
                                },
                            },
                        }
                    }
                }]
            }
        };
    }

    let counter = 0;

    function highchartsCallback(chart: any) {
        const legendArea = document.querySelector(".donut-chart-legend-" + counter)
        chart.series[0].data.forEach((item: any, ind: number) => {
            const myButton = document.createElement("div");
            myButton.className = "text-sm-truncate cursor-pointer mx-3";
            ReactDOM.render(<LegendItem item={item} index={ind} />, myButton);
            myButton.addEventListener("click", function () {
                item.setVisible(!item.visible, true);
                item.visible ? myButton.classList.remove("inactive") : myButton.classList.add("inactive")
            });
            legendArea?.appendChild(myButton);
        })
        counter++;
    }

    return (
        <div className="content-wrapper col">
            <h2 className="content-wrapper-heading font-weight-medium" id="assetallocation">Asset Allocation</h2>
            <div className="content  position-relative">
                <Carousel touch={true}
                    onSelect={() =>  trigInfonline(guessInfonlineSection(), "asset_allocation_slider")}
                    className="carousel-overflow-hidden"
                    controlclass={"mb-n2 dark-version"}
                    prevIcon={
                        <SvgImage  icon={`icon_direction_left_dark.svg`}
                            spanClass="move-arrow d-none d-xl-block"/>
                    }
                    nextIcon={
                        <SvgImage icon={`icon_direction_right_dark.svg`}
                            spanClass="move-arrow d-none d-xl-block"/>
                    }
                    controls={true}
                    indicators={true}
                    as={CarouselWrapper}
                >

                    {
                        props.portfolios.map((current: FundPortfolio, index: number) =>
                            <CarouselItem key={index} className="pb-5">
                                <div className="chart-wrapper">
                                    <HighchartsReact highcharts={Highcharts} options={getOptions(current)} callback={highchartsCallback} />
                                </div>
                                <Row className={"d-lg-none d-xl-none d-md-none d-sm-block donut-chart-legend-" + index}></Row>
                            </CarouselItem>
                        )
                    }
                </Carousel>
            </div>
        </div>
    );
}

function LegendItem(props: any) {
    return (
        <>
            <span className="dot mr-1" style={{ backgroundColor: props.item.color, height: "10px", width: "10px" }}></span>
            <span className="font-weight-bold text-truncate" style={{ maxWidth: "220px" }}> {props.item.name} </span>
        </>
    )
}
