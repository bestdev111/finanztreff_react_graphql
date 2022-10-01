import { useQuery } from "@apollo/client";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { SeriesOptionsType } from "highcharts/highstock";
import moment from 'moment';
import { loader } from "graphql.macro";
import { formatDate, quoteFormat } from "utils";
import { PieChartColors } from "components/profile/utils";
import './FundsPage.scss';
import { CalculationPeriod, ChartPoint, Instrument, Query } from "graphql/types";

interface PerformancesPeriodChartProps {
    period: CalculationPeriod,
    periodName: string,
    minId: number,
    currentId: number,
    maxId: number,
    height?: number
}

function getChartScope(value: CalculationPeriod) {
    if (value === CalculationPeriod.Month1)
        return "MONTH";
    if (value === CalculationPeriod.Month3)
        return "THREE_MONTH";
    if (value === CalculationPeriod.Month6)
        return "SIX_MONTH";
    if (value === CalculationPeriod.Week52)
        return "YEAR";
    if (value === CalculationPeriod.Year3)
        return "THREE_YEAR";
    if (value === CalculationPeriod.Year5)
        return "FIVE_YEAR";
    if (value === CalculationPeriod.Year10)
        return "TEN_YEAR";
}

export function PerformancesPeriodChart(props: PerformancesPeriodChartProps) {
    let { loading: loadingMin, data: dataMin } = useQuery<Query>(
        loader('./getInstrumentChartComparison.graphql'),
        { variables: { instrumentId: props.minId, chartScope: getChartScope(props.period) } }
    );
    let { loading: loadingMax, data: dataMax } = useQuery<Query>(
        loader('./getInstrumentChartComparison.graphql'),
        { variables: { instrumentId: props.maxId, chartScope: getChartScope(props.period) } }
    );
    let { loading: loadingCurrent, data: dataCurrent } = useQuery<Query>(
        loader('./getInstrumentChartComparison.graphql'),
        { variables: { instrumentId: props.currentId, chartScope: getChartScope(props.period) } }
    );

    const loading: boolean = loadingMin || loadingMax || loadingCurrent;

    if (loading) {
        return (<div className={"p-1"} style={{ height: "70px" }}><Spinner animation="border" /></div>);
    }

    let data: Instrument[] = [];

    if (dataMin && dataMin.instrument && dataMax && dataMax.instrument && dataCurrent && dataCurrent.instrument) {
        if (dataCurrent.instrument.chart && dataCurrent.instrument.chart.series[0].data.length === 0) {
            return (
                <Container className="px-0">
                    <Row>
                        <Col className="px-2 text-pink font-weight-bold text-center my-4 fs-18px">
                            Kein Chart verfügbar!
                        </Col>
                    </Row>
                </Container>
            );
        }
        data = [ dataCurrent.instrument, dataMin.instrument,dataMax.instrument];
        const series: DataPerformanceIndex[] = data.map((instr, index) => {
            const dataSeries: ChartPoint[] = [];
            instr.chart && instr.chart.series[0].data.map((current: any) => {
                if (!dataSeries.find(d => d.when.slice(0, 10) === current.when.slice(0, 10))) {
                    dataSeries.push({ when: current.when.slice(0, 10), value: current.value });
                }
            });
            const serie: DataPerformanceIndex = { data: dataSeries, name: instr.name, index: index, wkn: instr.wkn || "" };
            return serie;
        })
        let min = Number.parseFloat(Math.min(...series.map(serie => Math.min(...serie.data.map(data => (data.value / serie.data[0].value) * 100 - 100)))).toFixed(0));
        let max = Number.parseFloat(Math.max(...series.map(serie => Math.max(...serie.data.map(data => (data.value / serie.data[0].value) * 100 - 100)))).toFixed(0));
        let optionsData = series.map((current, index) => createSeries(current, index));
        let chartOptions = createOptions(optionsData, min, max, props.height);

        return (
            <Container className="px-0">
                <Row>
                    <Col className="px-2">
                        <h2 className="section-heading font-weight-bold performance-comparison mt-3 px-1">Chartvergleich {props.periodName}</h2>
                        <HighchartsReact
                            highcharts={Highcharts}
                            constructorType='stockChart'
                            options={chartOptions} />
                    </Col>
                </Row>
            </Container>
        )

    }
    return (<></>)
}

function createSeries(serie: DataPerformanceIndex, index?: number): SeriesOptionsType {
    let firstCourse = (serie.data[0] && serie.data[0].value) ? serie.data[0].value : 0;
    return {
        name: "",
        color: (index == 0) ? "#18C48F" : (index == 1) ? "black" : "#FF4D7D",
        type: 'area',
        fillColor: "transparent",
        lineWidth: 2.5,
        dataLabels: {
            enabled: false
        },
        data: serie.data.map((current, index): any => {
            let when = moment(current.when.slice(0, 10)).toDate().setHours(1);
            return ({
                y: index === 0 ? 1 : Number.parseFloat(((current.value / firstCourse) * 100 - 100).toFixed(2)),
                x: when,
                z: formatDate(current.when)
            })
        }
        ),
    };
}

function createOptions(optionsData: SeriesOptionsType[], min: number, max: number, height?: number): Highcharts.Options {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        colors: PieChartColors,
        chart: {
            type: 'linear',
            // marginTop: 0,
            // marginBottom: 0,
            height: height
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        title: { text: '' },
        yAxis: {
            min: min * 1.1,
            max: max * 1.1,
            // min: min* (min < 0 ? 1.2 : 0.8),
            // max: max*0.95,
            labels: {
                enabled: false,
            },
            gridLineWidth: 0,
        },
        xAxis: {
            lineWidth: 2,
            tickWidth: 0,
            type: "datetime",
            labels: {
                step: 2,
                formatter: function() {
                return Highcharts.dateFormat('%e %B %Y', this.value);
                }
            }

        },
        tooltip: {
            shared: true,
            split: false,
            headerFormat: "{point.z}",
            pointFormat: '<br/><span style="color:{point.color}">\u25CF <span style="color:"black""> <b>{point.y} % </span></span>',
            style: {
                fontFamily: "Roboto"
            },
        },
        series: optionsData,
    }
}

interface DataPerformanceIndex {
    data: ChartPoint[]
    name: string;
    index: number;
    wkn: string;
}