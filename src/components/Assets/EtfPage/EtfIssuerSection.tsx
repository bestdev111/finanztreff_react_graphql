import { PieChartColors } from "components/profile/utils";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ReactDOM from "react-dom";
import {EtfDomicile, EtfIssuer} from "../../../generated/graphql";

export function EtfIssuerSection(props: {issuer: EtfIssuer, domicile?: EtfDomicile | null}) {

    return (
        <div className="content-wrapper">
            <h2 className="content-wrapper-heading font-weight-bold">Emittent</h2>
            <h3 className="fs-18px">{ props.issuer.name }</h3>
            { props.domicile &&
                <div className="mt-3">
                    <div className="font-weight-bold">Domizil:</div>
                    <div> {props.domicile.name} </div>
                </div>
            }

            <h3 className="content-wrapper-heading font-weight-bold mt-4 mb-0">
                Weitere ETF des Emittenten
            </h3>
            <DonutKGV />
        </div>
    )
}

function DonutKGV() {
    return (
        <div style={{ maxWidth: "320px" }}>
            <div className="d-flex">
                <HighchartsReact highcharts={Highcharts} options={getOptions()} callback={highchartsCallback} />
                <span className="donut-KGV-legend mt-3"></span>
            </div>
        </div>
    );
}

function getOptions(): any {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        colors: PieChartColors,
        chart: {
            type: 'pie',
            height: "130px",
            width: 120
        },
        credits: { enabled: false },
        title: {
            text: "",
        },
        legend: { enabled: false },
        plotOptions: {
            pie: {
                innerSize: '65%',
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    connectorShape: 'crookedLine',
                    connectorColor: "black",
                    color: "black",
                    format: '{point.name} ({y})'
                },
                size: "100%",
            },
            series: {
                pointPadding: 0.4,
                borderWidth: 1.5,
                borderColor: "white",
                dataLabels: {
                    enabled: false,
                },
            },
        },
        tooltip: {
            headerFormat: "",
            pointFormat: '<span style="color:{point.color}">\u25CF <span style="color:"black""> {point.name} ({point.y})</span></span>'
        },
        series: [{
            type: 'pie',
            backgroundColor: "white",
            data: DATA,
        }],
    };
}

function highchartsCallback(chart: any) {
    const legendArea = document.querySelector(".donut-KGV-legend")
    chart.series[0].data.forEach((item: any, ind: number) => {
        const myButton = document.createElement("div");
        myButton.className = "text-truncate cursor-pointer";
        ReactDOM.render(<LegendItem item={item} index={ind} />, myButton);
        myButton.addEventListener("click", function () {
            item.setVisible(!item.visible, true);
            item.visible ? myButton.classList.remove("inactive") : myButton.classList.add("inactive")
        });
        legendArea?.appendChild(myButton);
    })
}

const DATA = [{
    name: "Aktienfonds (29)",
    y: 29
}, {
    name: "Mischfonds (10)",
    y: 10
}, {
    name: "Rentenfond (5)",
    y: 5
}, {
    name: "Sonstige (39)",
    y: 39
},
];

function LegendItem(props: any) {
    return (
        <>
            <span className="dot mr-1" style={{ backgroundColor: props.item.color, height: "10px", width: "10px" }}></span>
            <span className="font-weight-bold" style={{ width: "120px" }}> {props.item.name.length > 15 ? props.item.name.slice(0, 13) + "..." : props.item.name} </span>
        </>
    )
}
