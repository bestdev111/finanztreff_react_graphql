import { AssetTypes, getAssetGroup, getColorOfAssetGroup, getDataForAssetAllocationPieCharts, percentChange } from "components/profile/utils";
import { Watchlist, WatchlistEntry } from "graphql/types";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import "./WatchlistCard.scss";

export function ChartViewCard(props: ChartViewCardProps) {

    const items = props.watchlist.entries ? props.watchlist.entries.filter(entry => !!entry.instrument) : [];

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
                data: getDataForAssetAllocationPieCharts(dataType, items),
            }],
        };
    }

    return (
        <>
            {
                items.length > 0 ?
                    <div className="d-flex chart-item-watchlist">
                        <div className="pie-chart-watchlist m-1">
                            <HighchartsReact highcharts={Highcharts} options={getOptions("Gattung")} />
                            <div className="chart-inner-text text-center">
                                <div className="font-weight-bold fs-35px mb-n3">
                                    {props.watchlist.entries?.length}
                                </div>
                                <div className="fs-18px font-weight-bold">
                                    Position(en)
                                </div>
                            </div>
                        </div>
                        <div className="legend-big-asset-allocation ml-n4 mt-3 watchlist-overview">
                            <LegendItem entries={items} />
                        </div>
                    </div>
                    :
                    <></>
            }
        </>
    );
}

function LegendItem({ entries }: { entries: WatchlistEntry[] }) {
    return (<>
        {AssetTypes.map((assetType, index) => {
            let entriesWithCurrentAsset = entries.filter(entry => entry.instrument && entry.instrument.group && entry.instrument.group.assetGroup === assetType);
            if (entriesWithCurrentAsset && entriesWithCurrentAsset.length > 0) {
                return (
                    <div key={index} className="text-truncate mt-n1">
                        <span className="dot mr-1" style={{ backgroundColor: getColorOfAssetGroup(assetType) }}></span>
                        <span>{getAssetGroup(assetType)}</span>
                        <span className="numbers">
                            <span className="text-pink font-weight-bold"> {entriesWithCurrentAsset.filter(current => percentChange(current) > 0).length} </span>
                            |
                            <span className="text-kurs-grau"> {entriesWithCurrentAsset.filter(current => percentChange(current) === 0).length} </span>
                            |
                            <span className="text-green font-weight-bold"> {entriesWithCurrentAsset.filter(current => percentChange(current) < 0).length}</span>
                        </span>
                    </div>
                )
            }
            else return (<></>);
        })}
    </>
    );
}

interface ChartViewCardProps {
    watchlist: Watchlist
    refreshTrigger: () => void;
}