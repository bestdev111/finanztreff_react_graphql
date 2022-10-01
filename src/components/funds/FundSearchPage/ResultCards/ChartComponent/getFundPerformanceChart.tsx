import { useQuery } from "@apollo/client";
import { InstrumentTileChart } from "components/common/charts/InstrumentTileChart/InstrumentTileChart";
import { ChartScope, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import moment from "moment";
import { Spinner } from "react-bootstrap";

export const FundChartComponent = (props: FundChartComponentProps) => {
    let { loading, data } = useQuery<Query>(
        loader('./getFundPerformanceChart.graphql'),
        { variables: { instrumentId: props.instrumentId, chartScope: props.chartType } }
    );
    return (
        <>
            <div className="main-chart-movement stock-chart mt-3 mb-n3" style={{ height: props.height, width: props.width }}>
                {loading ?
                    <div className="text-center py-2 font-weight-light"><Spinner animation="border" className="border-3" /></div>
                    :
                    (
                        data && data.instrument && data.instrument.chart && data.instrument.chart.series.length > 0 &&
                        <InstrumentTileChart
                            points={
                                (data.instrument.chart?.series[0].data || []).map(current => ({ y: current.value, x: moment(current.when) }))
                            }
                            height={props.height}
                            width={props.width}
                            enableMouseTracking={true}
                        />
                    )
                }
            </div>
        </>
    )
}

interface FundChartComponentProps {
    instrumentId: number,
    chartType: ChartScope;
    height: number;
    width: number;
}