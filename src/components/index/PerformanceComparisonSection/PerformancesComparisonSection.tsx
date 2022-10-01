import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { Container, Dropdown, Row, Spinner } from "react-bootstrap";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { SeriesOptionsType } from "highcharts/highstock";
import moment from 'moment';
import { loader } from "graphql.macro";
import { useState } from "react";
import { formatDateMonthAndYear } from "utils";
import './PerformancesComparisonSection.scss';
import ReactDOM from "react-dom";
import { PieChartColors } from "components/profile/utils";
import { Query } from "graphql/types";

export function PerformancesComparisonSection(props: { className?: string, title?: string, trim?: boolean, hasLegendFlags?: boolean, listId: string }) {

    let { loading, data } = useQuery<Query>(
        loader('./getListInstrumentsChart.graphql'),
        { variables: { listId: props.listId }, skip: !props.listId }
    );

    let optionsData: any;
    let chartOptions: Highcharts.Options = {};

    if (loading) return <><Spinner animation="border" /></>;

    if (data && data.list && data.list.content && data.list.content.length > 0) {
        let performancesComparison: DataPerformanceIndex[] = data.list.content.map((current, index) => {
            let data = current.chart?.series[0].data.map(data => {
                let chartPoint = {
                    value: (data.value / (current.chart?.series[0].data[0].value || 1) * 100),
                    when: moment(data.when.slice(0, 10)).toDate().setDate(1)
                }
                return chartPoint;
            }).filter((value, index, self) => {
                return self.map(current => current.when).indexOf(value.when) === index
            })
                || [];
            let name = props.trim ? current.name.slice(4, 8) + "(" + current.name.slice(28, 46) + ")" : current.name
            return ({ data: data, name: name, index: index })
        });

        optionsData = performancesComparison.map((current, index) => createSeries(current, true, index))
        optionsData.filter((current: any) => !!current.name);
        chartOptions = createOptions(optionsData);

        return (
            <section className={classNames("main-section mx-lg-3", props.className)}>
                <Container>
                    <h2 className="section-heading font-weight-bold performance-comparison">{props.title}</h2>
                    <div className="content-wrapper row">
                        <div className="highcharts-containter col-12 col-xl-9 ">

                            <HighchartsReact
                                highcharts={Highcharts}
                                constructorType='stockChart'
                                options={chartOptions}
                                callback={highchartsCallback}
                            />

                        </div>
                        <Row className="pt-sm-3 legend col-xl-3 legendArea">
                        </Row>
                    </div>
                </Container>
            </section>
        );
    }
    return (<></>)
}


function highchartsCallback(chart: any) {
    const legendArea = document.querySelector(".legendArea")
    chart.series.forEach((item: any, index: number) => {
        if (index < 9) {
            const myButton = document.createElement("div");
            myButton.className = "text-sm-truncate text-nowrap col-xl-12 col-lg-3 col-md-3 col-sm-6 col-6 cursor-pointer ";
            ReactDOM.render(<LegendItem item={item} />, myButton);
            myButton.addEventListener("click", function () {
                item.setVisible(!item.visible, true);
                item.visible ? myButton.classList.remove("inactive") : myButton.classList.add("inactive")
            });
            legendArea?.appendChild(myButton);
        }
    })
    const dropdownContainer = document.createElement("div");
    ReactDOM.render(<LegendDropdownItem series={chart.series} />, dropdownContainer);

    legendArea?.appendChild(dropdownContainer);
}


function createSeries(serie: DataPerformanceIndex, visibility: boolean, index?: number): SeriesOptionsType {
    let firstCourse = (serie && serie.data && serie.data.length > 0 && serie.data[0] && serie.data[0].value) ? serie.data[0].value : 0;
    return {
        name: serie.name,
        color: (index && index > 8) ? "black" : "",
        type: 'area',
        visible: visibility,
        fillColor: "transparent",
        lineWidth: (index && index > 8) ? 2.5 : 1.5,
        dataLabels: {
            enabled: false
        },
        data: serie && serie.data ? serie.data.map((current: any, index: number): any => {
            let when = current.when;
            return ({
                y: index === 0 ? 1 : Number.parseFloat(((current.value / firstCourse) * 100 - 100).toFixed(2)),
                x: when,
                z: formatDateMonthAndYear(current.when)
            })
        }
        ) : [],
    };
}

function createOptions(optionsData: any): Highcharts.Options {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        colors: PieChartColors,
        chart: {
            type: 'linear',
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
            labels: {
                enabled: false,
            },
            gridLineWidth: 0,
        },
        xAxis: {
            offset: -20,
            labels: {
                style: {
                    fontWeight: 'bold',
                },
                step: 2,
                formatter: function () {
                    return Number.parseInt(Highcharts.dateFormat('%Y', this.value)).toString();
                }
            },
            lineWidth: 2,
            tickWidth: 0,
        },
        tooltip: {
            headerFormat: '<small>{point.z}</small><table><br/>',
            //pointFormat: '{series.name}: <span class="text-red">{point.y}</span><br/>',
            shared: true,
            split: false,
            valueSuffix: "%",
            style: {
                fontFamily: "Roboto"
            },
        },
        series: optionsData,
    }
}

interface DataPerformanceIndex {
    data: {
        value: number;
        when: any
    }[]
    name: string;
    index: number;
}
function LegendItem(props: any) {
    return (
        <>
            <span className="dot mr-1" style={{ backgroundColor: props.item.color }}></span>
            <span className="font-weight-bold text-truncate" style={{ maxWidth: "220px" }}> {props.item.name} </span>
        </>
    )
}

function LegendDropdownItem(props: any) {
    const [state, setState] = useState(props.series[9])
    return (
        <Dropdown>
            <Dropdown.Toggle className="dropdown-legend-button text-truncate" id="dropdown-basic" style={{ maxWidth: "220px" }}>
                <span className="dot mr-1"></span> {state.name}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-legend-menu" >
                {
                    props.series.map((current: any, index: number) => {
                        if (index > 8 && current !== state) {
                            current.setVisible(false);
                            return (
                                <>
                                    <Dropdown.Item key={index} className="py-0 my-0 line-height-1 fs-15px" id={index} onClick={() => { setState(current); current.setVisible(true) }}>
                                        {current.name}
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                </>
                            );
                        }
                    })

                }
            </Dropdown.Menu>
        </Dropdown>
    )
}