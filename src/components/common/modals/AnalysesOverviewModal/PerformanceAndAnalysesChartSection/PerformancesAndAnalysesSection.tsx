import { useQuery } from "@apollo/client";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { loader } from "graphql.macro";
import { Analysis, AnalysisRecommendation, ChartPoint, Query } from "generated/graphql";
import { createInstrumentAnalysesSeries, createInstrumentPerformanceOptions, createInstrumentPerformanceSeries, getDistinctedData } from "./ChartOptionsAndSeries";
import { AnalysesOverviewChartComponent } from "../AnalysesOverviewChartComponent";

export function PerformancesAndAnalysesSection(props: PerformancesAndAnalysesSectionProps) {
    let period = "SIX_MONTH";

    let { loading, data } = useQuery<Query>(
        loader('./getInstrumentChartComparison.graphql'),
        { variables: { instrumentId: props.instrumentId, chartScope: period } }
    );

    let chartOptions: Highcharts.Options = {};
    let minValue: number;
    let maxValue: number;

    let positive: any;
    let negative: any
    let neutral: any;

    let positivePostion: number = 0;
    let negativePostion: number = 0;
    let neutralPostion: number = 0;


    if (!loading && props.analyses) {
        if (data?.instrument?.chart?.series && data?.instrument?.chart?.series.length > 0) {
            let points = (data?.instrument?.chart?.series[0].data || []);
            minValue = Math.min(...points.map((current: ChartPoint) => current.value));
            maxValue = Math.max(...points.map((current: ChartPoint) => current.value));

            let startDate: any = points[points.length - 1]
            positive = createInstrumentAnalysesSeries(props.analyses, startDate, AnalysisRecommendation.Positive, props.currency);
            negative = createInstrumentAnalysesSeries(props.analyses, startDate, AnalysisRecommendation.Negative, props.currency);
            neutral = createInstrumentAnalysesSeries(props.analyses, startDate, AnalysisRecommendation.Neutral, props.currency);
            let chartSeries = createInstrumentPerformanceSeries(points)


            minValue = Number.parseInt(Math.min(...[
                minValue,
                Math.min(...positive.data.map((current: any) => current.y)),
                Math.min(...neutral.data.map((current: any) => current.y)),
                Math.min(...negative.data.map((current: any) => current.y))
            ]).toFixed(0));

            maxValue = Number.parseInt(Math.max(...[
                maxValue,
                Math.max(...positive.data.map((current: any) => current.y)),
                Math.max(...neutral.data.map((current: any) => current.y)),
                Math.max(...negative.data.map((current: any) => current.y))
            ]).toFixed(0));

            chartOptions = createInstrumentPerformanceOptions([positive, negative, neutral, chartSeries], minValue, maxValue,
                props.currency ? props.currency : props.analyses[0]?.currency?.displayCode || "");

            positive.data.map((current: any) => positivePostion += current.z);
            negative.data.map((current: any) => negativePostion += current.z);
            neutral.data.map((current: any) => neutralPostion += current.z);

        }
    }

    return (
        <>
            <div className="content-wrapper row mx-0">
                <div className="highcharts-containter col-12 ">{
                    props.analyses && !loading &&
                    <HighchartsReact
                        highcharts={Highcharts}
                        constructorType='stockChart'
                        options={chartOptions}
                    />}
                </div>
            </div>
            <AnalysesOverviewChartComponent positive={positivePostion} negative={negativePostion} neutral={neutralPostion} />
        </>
    );
}

interface PerformancesAndAnalysesSectionProps {
    analyses: Analysis[]
    instrumentId: number
    currency?: string
}