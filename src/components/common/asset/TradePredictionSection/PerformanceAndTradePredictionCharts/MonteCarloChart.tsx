import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { Instrument } from "generated/graphql";
import { createInstrumentAnalysesSeries, createInstrumentPerformanceOptions, createInstrumentPerformanceSeries } from "./ChartOptionsAndSeries";
import { numberFormat, numberFormatDecimals } from "utils";
import { BestWarrantCard } from "./BestWarrantCard";
import { useMediaQuery } from "react-responsive";
import { Col, Row } from "react-bootstrap";

export function MonteCarloChart(props: MonteCarloChartProps) {
    let hasData = false;
    const instrument = props.instrument;
    const quoteHistoryEdges = props.instrument.quoteHistory.edges || [];
    const monteCarlo = props.instrument.monteCarlo!;
    const currency = props.instrument.currency && props.instrument.currency.displayCode || "";

    let chartOptions: Highcharts.Options = {
        chart: {
            height: '15em'
        },
        stockTools: {
            gui: {
                enabled: false
            }
        }
    };
    let minValue: number;
    let maxValue: number;

    let positive: number = 0;
    let negative: number = 0;
    let neutral: number = 0;

    const isTablet = useMediaQuery({
        query: '(max-width: 1280px)'
    });


    let value = { expectedValue: monteCarlo.avg || 1};
    let setExpectedValue: any = null;

    const onChildMount = (dataFromChild: any) => {
        value = dataFromChild[0];
        setExpectedValue = dataFromChild[1];
    };

    if ( quoteHistoryEdges.length > 0) {
        let points = quoteHistoryEdges.map(current => {return({value: current.node?.lastPrice, when: current.node?.date}) } ) || [];

        if (points.length > 0) {
            minValue = Math.min(...points.map((current: any) => current.value));
            maxValue = Math.max(...points.map((current: any) => current.value));

            let startDate: any = points[points.length - 1];
            positive = monteCarlo.max || 1;
            negative = monteCarlo.min || 1;
            neutral = instrument.monteCarlo && instrument.monteCarlo.avg ? instrument.monteCarlo.avg : startDate.value;
            let up: string = instrument.monteCarlo && instrument.monteCarlo.up ? Math.round(instrument.monteCarlo.up * 100).toString() : '50';
            // let down: string = instrument.monteCarlo && instrument.monteCarlo.down ? instrument.monteCarlo.down.toString() : '';

            let chartSeries = createInstrumentPerformanceSeries(points);
            minValue = Number.parseInt(Math.min(...[minValue, positive, negative, neutral]).toFixed(0));

            maxValue = Number.parseInt(Math.max(...[maxValue, positive, negative, neutral]).toFixed(0));

            chartOptions = createInstrumentPerformanceOptions([chartSeries,
                createInstrumentAnalysesSeries(startDate, "neutral", neutral),
                createInstrumentAnalysesSeries(startDate, "negative", negative),
                createInstrumentAnalysesSeries(startDate, "positive", positive)
            ], numberFormatDecimals(startDate.value), minValue, maxValue, currency, up);
            hasData = true;
        }
    }

    return (
        <div className="d-xl-flex">
            <div className="highcharts-containter col-12 px-0 chart-height">{
                (hasData) &&
                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType='stockChart'
                    options={chartOptions}
                />}
                <div style={{ position: "absolute", right: "30px", top: "0px" }}>
                    <div className="text-green fs-18px font-weight-bold mt-2 pb-5 cursor-pointer" onClick={() => setExpectedValue(positive)}>
                        {numberFormat(positive)}
                    </div>
                    <div className="text-dark fs-18px font-weight-bold my-5 pb-5 cursor-pointer" onClick={() => setExpectedValue(neutral)}>
                        {numberFormat(neutral)}
                    </div>
                    <div className="text-pink fs-18px font-weight-bold mt-5 cursor-pointer" onClick={() => setExpectedValue(negative)}>
                        {numberFormat(negative)}
                    </div>
                </div>
            </div>
            <div className={isTablet ? "col-12 d-lg-block" : " mt-n4 ml-3 section-right-part col-xl col-lg-3 col-sm-12 lg-12-content-6 sm-12-content-12 d-lg-block"}>
                <h3 className=" content-wrapper-heading font-weight-bold mb-5px mt-10px text-truncate">Passendes Produkt</h3>
                <div className="content">
                    <BestWarrantCard instrument={instrument} onMountExpectedValue={onChildMount} expectedValue={value.expectedValue} period={6} onMountPeriod={() => { }} />
                </div>
            </div>
        </div>
    );
}

interface MonteCarloChartProps {
    instrument: Instrument;
}