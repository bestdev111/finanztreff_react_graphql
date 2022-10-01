import {useBootstrapBreakpoint} from "../../../../hooks/useBootstrapBreakpoint";
import {PieChartColors} from "../../../profile/utils";
import {numberFormat} from "../../../../utils";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

interface RangeChartDonutProps {
    value: number;
    width?: number;
    height?: number;
    fontSize?: number;
    titlePosition?: number;
    margin?: string;
    palette?: RangeChartDonutPalette;
    graphHeight?: string;
    textFormat?: (value: number) => string;
}

export interface RangeChartDonutPalette {
    positive: string;
    negative: string;
    neutral: string;
    title: {
        positive: string;
        negative: string;
        neutral: string;
    }
}

const DEFAULT_CHART_PALETTE: RangeChartDonutPalette = {
    positive: "#18C48F",
    negative: "#FF4D7D",
    neutral: "gray",
    title: {
        positive: "#18C48F",
        negative: "#FF4D7D",
        neutral: "gray",
    }
}

export function RangeChartDonut(props: RangeChartDonutProps) {
    const donutWidth = useBootstrapBreakpoint({
        xl:275,
        md: 275,
        sm: 160,
        default: 275
    });

    const donutHeight = useBootstrapBreakpoint({
        xl: 300,
        md: 300,
        sm: 250,
        default: 300
    });

    const palette = props.palette || DEFAULT_CHART_PALETTE;

    let height = (props.height && props.height * 2) || donutHeight;
    let width = props.width ? props.width : donutWidth;
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
            margin: [(height/-10),  (width / -7), (height/-3), (width / -10)],
            style: {
                marginBottom: (height/-3) + "px",
                //     marginLeft: (width / -4) + "px",
                //     marginRight: (width / -4) + "px"
            }
        },
        title: {
            text: (props.textFormat || numberFormat)(props.value),
            align: 'center',
            verticalAlign: 'middle',
            style: {
                color: props.value > 0 ? palette.title.positive : props.value < 0 ? palette.title.negative : palette.title.neutral,
                fontWeight: 'bold',
                fontSize: textSize + "px"
            },
            y: height / 4
        },
        credits: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    distance: 1,
                    enabled: true,
                    connectorWidth: 0,
                    y: -14,
                    color: "grey",
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
            innerSize: '87%',
            size: "65%",
            borderWidth: 0,
            data: [{
                name: "", y: 30, color: "white",
                innerSize: '85%',
            },
                {
                    name: "Ø", y: 2, color: "white",
                    innerSize: '85%',
                },
                {
                    name: "", y: 70, color: "white",
                    innerSize: '85%',
                }, {
                    name: "", y: 5, color: "black",
                    innerSize: '85%',
                }, {
                    name: "", y: 70, color: "white",
                    innerSize: '85%',
                }]
        }, {
            type: 'pie',
            innerSize: '85%',
            size: '75%',
            borderWidth: 0,
            data: [{
                name: "", y: 30, color: props.value ===0 ? palette.neutral : palette.positive,
                innerSize: '85%',
            },
                {
                    name: "", y: 2, color: "white",
                    innerSize: '85%',
                },
                {
                    name: "", y: 70, color: props.value ===0 ? palette.neutral : palette.negative,
                    innerSize: '85%',
                }, {
                    name: "", y: 5, color: "black",
                    innerSize: '85%',
                }, {
                    name: "", y: 70, color: props.value ===0 ? palette.neutral : palette.negative,
                    innerSize: '85%',
                }]
        },
            {
                type: 'pie',
                innerSize: '90%',
                size: "82%",
                borderWidth: 0,
                data: [{
                    name: "", y: 30, color: "white",
                    innerSize: '85%',
                },
                    {
                        name: "", y: 2, color: "white",
                        innerSize: '85%',
                    },
                    {
                        name: "", y: 70, color: "white",
                        innerSize: '85%',
                    }, {
                        name: "", y: 5, color: "black",
                        innerSize: '85%',
                    }, {
                        name: "", y: 70, color: "white",
                        innerSize: '85%',
                    }]
            }]
    }

    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            >
            </HighchartsReact>
        </>
    );
}
