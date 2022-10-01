import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { Container, Dropdown, Row, Spinner } from "react-bootstrap";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { SeriesOptionsType } from "highcharts/highstock";
import moment from 'moment';
import { loader } from "graphql.macro";
import { useEffect, useState } from "react";
import { formatDateMonthAndYear } from "utils";
import './CurrencyPerformanceChart.scss';
import ReactDOM from "react-dom";
import { PieChartColors } from "components/profile/utils";
import { useMediaQuery } from "react-responsive";

export function CurrencyPerformanceChart(props: { className?: string, title?: string, trim?: boolean, hasLegendFlags?: boolean, idCurrency?: string, currencyList?: number[] }) {
    let [state, setState] = useState<CurrencyPerformanceChartState>({ performancesComparison: {} });
    let [currList, handleListUpdate] = useState([2485104, 2485088, 2485125, 2485096, 2485393, 2485751, 2485058, 2485072, 2485277, 2485111, 2485376, 2485533, 2485217, 2485080, 2485117, 2485662])
    let period = "FIVE_YEAR";
    const Data = (id: number, index: number) => {
        let { loading, data } = useQuery(
            loader('./getInstrumentChartComparison.graphql'),
            { variables: { instrumentId: id, chartScope: period } }
        );
        useEffect(() => {
            updateList(props.idCurrency);
        },[props.idCurrency])
        
        useEffect(() => {
            if (!loading) {
                let current = state.performancesComparison;
                let dates: number[] = [];
                let currentData = data.instrument.chart.series[0].data.filter((current: any) => {
                    if (!dates.includes(current.when.slice(0, 7))) {
                        dates.push(current.when.slice(0, 7));
                        return true;
                    }
                    return false;
                });
                var instrumentName: string = ""
                data.instrument.name.split(" ").slice(-2).map((current:any) => {
                    if(current !== "/"){
                        instrumentName += current + " ";
                    }

                });
                current[id] = { data: currentData, name: props.trim ? data.instrument.name.slice(4, 8) + "( " + instrumentName + ")" : data.instrument.name, index: index }
                setState({ ...state, performancesComparison: current });
            }
        }, [data, id, index, loading]);
    }

    let optionsData: any;
    let chartOptions: Highcharts.Options = {}
    currList.map((current: any, index: any) => Data(current, index));
    let loading = Object.keys(state.performancesComparison).length !== currList.length;
    if (loading) {
        return <><Spinner animation="border" /></>;
    }
    let series = Object.values(state.performancesComparison)
        .map(current => current.data
            .map(data => (data.value / current.data[0].value) * 100 - 100));

    let min = Number.parseFloat(Math.min(...series.map(serie => Math.min(...serie))).toFixed(0));
    let max = Number.parseFloat(Math.max(...series.map(serie => Math.max(...serie))).toFixed(0));

    optionsData = Object.values(state.performancesComparison).sort((a, b) => a.index - b.index).map((current, index) => createSeries(current, true, index));
    chartOptions = createOptions(optionsData, min, max);
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
    function updateList(value: string | undefined) {
        for (var member in state.performancesComparison) delete state.performancesComparison[member];
        if(value === 'EUR'){
            handleListUpdate([2485104, 2485088, 2485125, 2485096, 2485393, 2485751, 2485058, 2485072, 2485277, 2485111, 2485376, 2485533, 2485217, 2485080, 2485117, 2485662])
        }
        if(value === 'USD'){
            handleListUpdate([2502668, 2485959, 2489966, 2485841, 2502777, 2485836, 2489964, 2485846, 2489967, 2502770, 2502780, 2485154, 2485192, 2485195, 2485248, 2502790])
        }
        if(value === 'JPY'){
            handleListUpdate([2485344, 2487625, 2487587, 2485963, 2487588, 2487579, 2487572, 2487577, 2487609, 2487582, 2503054, 2487622, 2502971, 2503220, 2487608, 2487597])
        }
        if(value === 'GBP'){
            handleListUpdate([2504516, 2485417, 2487080, 2485413, 2485471, 2485482, 2485494, 2485486, 2485452, 2485477, 2485468, 2485428, 2485437, 2485436, 2485455, 2485460])
        }
        if(value === 'CHF'){
            handleListUpdate([2485833, 2485853, 2486428, 2485872, 2485871, 2485849, 2485879, 2485876, 2485862, 2485874, 11477139, 2485854, 2485858, 2485860, 2485864, 2503085])
        }
        if(value === 'HKD'){
            //HKD/DKK MISSING - 2485874 for example                                                               HERE
            handleListUpdate([2485404, 2485389, 2487106, 2485403, 2485407, 2485405, 2485409, 2485408, 2487120, 2485854, 2487102, 2485390, 2485392, 2502952, 2487119, 2487108])
        }
        // if(value === 'RUB'){
        //     //RUB/DKK MISSING
        //     handleListUpdate([2489228, 2502759, 2503069, 2489230, 2505253, 2489231, 2489219, 2489213, 2503068, 2489253, 2489232, 2489270, 2489266, 2489265, 2489252, 2489241])
        // }
        if(value === 'CNY'){
            handleListUpdate([2485851, 2503091, 2503048, 2502887, 2504436, 2503098, 2502885, 2502886, 2502892, 2486501, 2486507, 2503090, 2503089, 2486535, 2486524, 2486513])
        }
        if(value === 'AUD'){
            //AUD/DKK MISSING - 2485874 for example                                                                 HERE                     AUD/SGD
            handleListUpdate([2485931, 2505441, 2504281, 2485930, 2485937, 11518684, 2485934, 11182185, 11182191, 2485874, 2486066, 2485916, 2485417, 2485921, 2486082, 2486072])
        }
        if(value === 'CAD'){
            //CAD/CHF missing - 2485874 for example                 HERE    CAD/HKD                             CAD/DKK
            handleListUpdate([2485890, 2485883, 11182199, 2486382, 2485874, 2485417, 2485893, 2485898, 2486405, 2485874, 2486383, 2485884, 2486416, 2502823, 2485886, 2486395])
        }
        if(value === 'NZD'){
            //NZD/JPY missing - 2485874           HERE             NZD/CHF                            NZD/CAD  NZD/DKK                   NZD/SGD
            handleListUpdate([2485260, 2505452, 2485874, 2485259, 2485963, 2485258, 2485261, 2485268, 2485393, 2485494, 2488607, 2485250, 2489253, 11412419, 2503037, 2488616])
        }
        if(value === 'DKK'){
            //DKK/EUR missing   here                               DKK/CHF                                                                         DKK/SEK  DKK/NOK
            handleListUpdate([2485874, 2486735, 2486703, 2486694, 2485963, 2486695, 2486687, 2486681, 2502899, 2486718, 2486696, 2486733, 2486729, 2489253, 2485417, 2486706])
        }
        if(value === 'HUF'){
            //HUF/CHF missing                                      HERE                                                  HUF/DKK
            handleListUpdate([2487155, 2487200, 2487164, 2487157, 2485963, 11568588, 2487146, 2487140, 2502957, 2487180, 2485417, 2487197, 2487192, 11449247, 2487179, 2487167])
        }
        if(value === 'TWD'){
            handleListUpdate([2503008, 2503074, 2489799, 2485163, 2485165, 2485162, 2485164, 2485167, 2485166, 2485158, 2489788, 2489794, 2485156, 2489822, 2489811, 2489801])
        }
        if(value === 'SGD'){
            //SGD/JPY missing                   HERE                sgd/chf
            handleListUpdate([2489482, 2485200, 2485963, 2489484, 2485417, 2485207, 2485208, 2489469, 2485209, 2489506, 2489477, 2489485, 2485201, 2503003, 2489505, 2489494])
        }
        if(value === 'SEK'){
            //HERE             SEK/EUR                              SEK/CHF                                             SEK/DKK                             SEK/NOK
            handleListUpdate([2485963, 2503073, 11182189, 2489425, 2485417, 2503072, 2489417, 2489411, 2485216, 2489446, 2485417, 2489426, 2489460, 2489457, 2489253, 2489436])
        }
        if(value === 'NOK'){
            //MISSING         NOK/EUR                               NOK/CHF                                               NOK/DKK
            handleListUpdate([2485417, 2488586, 11182198, 2488544, 2485963, 2503057, 2488534, 2488528, 11475610, 2488567, 2489788, 2488545, 2488583, 2488579, 11182206, 2488556])
        }
        if(value === 'KWD'){
            //MISSING
            handleListUpdate([2487763, 2487807, 2503056, 2487765, 2487754, 2487766, 2487756, 2487748, 2487753, 2487787, 2487759, 2487767, 2487804, 2487800, 2487799, 2487786])
        }
    }
    
}

function createSeries(serie: any, visibility: boolean, index?: number): SeriesOptionsType {
    let firstCourse = (serie.data[0] && serie.data[0].value) ? serie.data[0].value : 0;
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
        data: serie.data.map((current: any, index: number): any => {
            let when = moment(current.when.slice(0, 10)).toDate().setDate(1);
            return ({
                y: index === 0 ? 1 : Number.parseFloat(((current.value / firstCourse) * 100 - 100).toFixed(2)),
                x: when,
                z: formatDateMonthAndYear(current.when)
            })
        }

        ),
    };
}

function createOptions(optionsData: any, min: number, max: number): Highcharts.Options {
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
            min: min * 0.9,
            max: max * 1.1,
            // min: min* (min < 0 ? 1.2 : 0.8),
            // max: max*0.95,
            labels: {
                enabled: false,
            },
            gridLineWidth: 0,
        },
        xAxis: {
            offset: - (300 / (Math.abs(max) + Math.abs(min)) * Math.abs(min)) - 33,
            //-(Math.abs(max)-Math.abs(min)) * .55 / 2,
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

interface CurrencyPerformanceChartState {
    performancesComparison: { [key: number]: DataPerformanceIndex };
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
    const isDesktop = useMediaQuery({
        query: '(min-width: 1279px)'
    })
    
    return (
        <>
            <span className="dot mr-1" style={{ backgroundColor: props.item.color }}></span>
            {isDesktop === true && <span className="font-weight-bold text-truncate" style={{ maxWidth: "220px" }}> {props.item.name} </span>}
            {isDesktop === false && <span className="font-weight-bold text-truncate" style={{ maxWidth: "220px" }}> {props.item && props.item.name && props.item.name.slice(0, 3)} </span>}
            {props.hasFlags ? <></> : <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + (props.item && props.item.name && props?.item?.name?.slice(0, 3).toLowerCase()) + ".svg"} alt="" className=" svg-blue table-flags-style" width="24px" height="16px"></img>}
        </>
    )
}

function LegendDropdownItem(props: any) {
    const [state, setState] = useState(props.series[9])
    const isDesktop = useMediaQuery({
        query: '(min-width: 1279px)'
    })
    return (
        <>
        <Dropdown>
            <Dropdown.Toggle className="dropdown-legend-button" id="dropdown-basic">
                {isDesktop === true && <><span className="dot mr-1"></span>{state.name}</>}
                {isDesktop === false && <><span className="dot mr-1"></span>{state.name?.slice(0, 3)}</>}
            </Dropdown.Toggle>
            <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + state.name?.slice(0, 3).toLowerCase() + ".svg"} alt="" className="svg-blue table-flags-style dropdown-flag-style" width="24px" height="16px"></img>

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
        </>
    )
}
