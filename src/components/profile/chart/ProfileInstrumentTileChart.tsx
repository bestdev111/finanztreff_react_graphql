import { InstrumentTileChart } from "../../common/charts/InstrumentTileChart/InstrumentTileChart";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { ChartPoint, ChartScope, Query } from "../../../generated/graphql";
import { loader } from "graphql.macro";
import { Spinner } from "react-bootstrap";

export const ProfileInstrumentTileChart = (props: ProfileInstrumentTileChartProps) => {
    const period = props.period ? props.period : ChartScope.Intraday;
    let { data, loading } = useQuery<Query>(
        loader('./getProfileInstrumentTileChart.graphql'),
        { variables: { instrumentId: props.instrumentId, chartScope: period } }
    )
    if (loading) {
        return <div className={"p-1"} style={{ height: "70px" }}><Spinner animation="border" /></div>;
    }
    let chart: ChartPoint[] = [];

    if (data?.instrument?.chart?.series && data?.instrument?.chart?.series.length > 0) {
        chart = data?.instrument?.chart.series[0].data;
        if (props.customPeriod) {
            chart = data?.instrument?.chart.series[0].data.filter(current => moment(current.when) > moment(props.customPeriod));
        }
        return (
            <InstrumentTileChart
                points={
                    (chart || []).map(current => ({ y: current.value, x: moment(current.when) }))
                }
                threshold={data?.instrument?.chart?.threshold?.value || undefined}
                height={props.height || 80}
                width={props.width || 364}
                enableMouseTracking={false}
            />
        );
    }

    return (<></>);
}

interface ProfileInstrumentTileChartProps {
    instrumentId: number;
    height?: number;
    width?: number;
    period?: ChartScope;
    customPeriod?: moment.Moment
}
