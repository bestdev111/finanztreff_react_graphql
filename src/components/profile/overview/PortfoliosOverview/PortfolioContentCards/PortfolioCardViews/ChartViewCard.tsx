import classNames from "classnames";
import { getDataForAssetAllocationPieCharts } from "components/profile/utils";
import { Portfolio } from "graphql/types";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import ReactDOM from "react-dom";
import "./PortfolioCard.scss";
import { numberFormat } from "utils";

export function ChartViewCard(props: ChartViewCardProps) {

    let items = props.portfolio?.entries;

    function getOptions(dataType: string): any {
        return {
            stockTools: {
                gui: {
                    enabled: false
                }
            },
            chart: { type: 'pie' },
            credits: { enabled: false },
            title: { text: '' },
            legend: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    innerSize: '65%',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    center: [60, 60],
                    showInLegend: true,
                    size: "100%",
                },
                series: {
                    pointPadding: 0.4,
                    borderWidth: 3,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
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
                pointFormat: '<span style="color:{point.color}">\u25CF <span style="color:"black"">{point.len} {point.name} mit Gewichtung {point.y} %</span></span>'
            },
            series: [{
                type: 'pie',
                data: getDataForAssetAllocationPieCharts(dataType, items, props.portfolio),
            }],
        };
    }

    function highchartsCallback(chart: any, index: number) {
        const legendArea = document.querySelector(".legend-" + index);;
        ReactDOM.render(<LegendItem items={chart.options.series[0].data} />, legendArea);
    }

    return (
        <>
            <div className="d-flex chart-item-portfolio">
                <div className="pie-chart-portfolio m-1">
                    <HighchartsReact highcharts={Highcharts} options={getOptions("Gattung")} callback={(e: any) => highchartsCallback(e, props.portfolio.id)} />
                    <div className="chart-inner-text text-center">
                        <div className="font-weight-bold fs-35px mb-n3">
                            {props.portfolio.entries?.length}
                        </div>
                        <div className="fs-18px font-weight-bold">
                            Position(en)
                        </div>
                        <div className="fs-13px mt-n2">
                            <div>nach</div>
                            <div className="mt-n2">Gewichtung</div>
                        </div>
                    </div>
                </div>
                <div className={classNames("legend-big-asset-allocation ml-n4 mt-3 ", "legend-" + props.portfolio.id)} />
            </div>
        </>
    );
}

function LegendItem(props: { items: { color: string, name: string, y: number }[] }) {
    return (<>
        {
            props.items.map((each, index) =>
                <>
                    <div key={index} className="text-truncate mt-n1">
                        <span className="dot mr-1" style={{ backgroundColor: each.color }}></span>
                        <span className="text-truncate fs-14px legend-item-title roboto-slab"> {each.name} ({numberFormat(each.y, "%")}) </span>
                    </div>
                </>
            )
        }
    </>
    );
}

interface ChartViewCardProps {
    portfolio: Portfolio
    refreshTrigger: () => void;
}