import classNames from "classnames";
import { PieChartColors } from "components/profile/utils"
import { InstrumentGroupFundTranche } from "generated/graphql";
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";

const DONUT_COLORS = ["#63BD5C", "#CAC11F", "#FFC300", "#FF8D38", "#E65456", "#E03C68", "#B6325F"];

function getSeries(riskFactor: number, inner: boolean) {
    let series: any[] = [];
    DONUT_COLORS.map((current: string, index: number) => {
        series.push({
            name: "", y: 10, color:  inner || riskFactor === index + 1 ? (riskFactor===0 ? "gray" :current) : "white",
            innerSize: '85%',
        });
        series.push(
            {
                name: "", y: 0.5, color: "white",
                innerSize: '85%',
            });
    });
    return series;
}

export function RiskSecton(props: RiskSectionProps) {

    return (
        <>
            <div className="content-wrapper">
                <h2 className="content-wrapper-heading font-weight-bold">Risiko</h2>
                <div className="content">
                    <RiskSectionDonut riskFactor={props.fundTranche.srri?.value || 0}/>
                    <h3 className={classNames("content-wrapper-heading font-weight-bold text-center", !props.fundTranche.srri?.value && "text-gray")}>Risiko (KID)</h3> 
                    <div className={classNames("coming-soon-component risk-section", props.className)}>
                        <span className="text-white fs-18px coming-soon-text d-flex justify-content-center">Coming soon...</span>
                    </div>
                    <RiskSectionContent fundTranche={props.fundTranche} />
                </div>
            </div>
        </>
    )
}


interface RiskSectionProps {
    className?: string;
    fundTranche: InstrumentGroupFundTranche
}

export function RiskSectionContent(props: {fundTranche: InstrumentGroupFundTranche}) {
    return (
        <>
            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-between">
                <span className="">Sharpe Ratio (1J / 3J)</span>
                <span className=" font-weight-bold"> 5,00%</span>
                <span className=" font-weight-bold"> 5,00%</span>
            </div>
            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-between">
                <span className="">Volatilität (1J / 3J)</span>
                <span className=" font-weight-bold"> -- </span>
                <span className=" font-weight-bold"> --</span>
            </div>
            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-between">
                <span className="">Tracking Error</span>
                <span className=" font-weight-bold"> --</span>
            </div>
            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-between">
                <span className="">Jensens Alpha</span>
                <span className=" font-weight-bold"> 1,80%</span>
            </div>
            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-between">
                <span className="">Beta</span>
                <span className=" font-weight-bold"> 1,82%</span>
            </div>
            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-between">
                <span className="">Positive Regression</span>
                <span className=" font-weight-bold"> 51,79</span>
            </div>
            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-between">
                <span className="">Negative Regression</span>
                <span className=" font-weight-bold"> 95,70</span>
            </div>

        </>
    );
}

export function RiskSectionDonut(props: { riskFactor: number, width?: number, height?: number, fontSize?: number, titlePosition?: number }) {
    
    const donutWidth = useBootstrapBreakpoint({
        xl:275,
        md: 300,
        sm: 170,
        default: 275
    });

    const donutHeight = useBootstrapBreakpoint({
        xl: 300,
        md: 300,
        sm: 250,
        default: 300
    });

    let width = props.width ||  donutWidth;
    let height = (props.height && props.height * 2) || donutHeight;
    let textSize = height / 5;

    let options = {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        colors: PieChartColors,
        chart: {
            animation: false,
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            width, height,
            margin: [(height/-10),  width / -14, (height/-4),  width / -14],
            style: {
                marginBottom: (height/-3) + "px",
                // marginLeft: (props.riskFactor < 3 ? width/10 : (props.riskFactor > 5 ? -width/10 : 0)) + "px"
                //     marginLeft: (width / -4) + "px",
                //     marginRight: (width / -4) + "px"
            }
        },
        title: {
            text: props.riskFactor,
            align: 'center',
            verticalAlign: 'middle',
            style: {
                color: props.riskFactor === 0 ? "gray" : DONUT_COLORS[props.riskFactor - 1],
                fontWeight: 'bold',
                fontSize: textSize + "px"
            },
            y: height / 5,
            // x: textSize / 8,
        },
        credits: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,
                },
                startAngle: -90,
                endAngle: 90,
            },
            series: {
                states: {
                    inactive: {
                        opacity: 1
                    },
                    hover: {
                        enabled: false
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            innerSize: '85%',
            size: '75%',
            borderWidth: 0,
            data: getSeries(props.riskFactor, true)
        },
        {
            type: 'pie',
            innerSize: '75%',
            borderWidth: 0,
            data: getSeries(props.riskFactor, false)
        }]
    }
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        >
        </HighchartsReact>
    );
}
