import React, { useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import classNames from "classnames";
import { Col, Row, Spinner } from "react-bootstrap";
import { AssetType, InstrumentGroup, Maybe, Query } from "generated/graphql";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { useHistory } from "react-router-dom";
import "./AlternativesFromUnderlineComponent.scss";
import { useMediaQuery } from "react-responsive";

function Legends(props: any) {
    let passedData = props.passData.group.alternativeDerivativeProducts;
    const { push } = useHistory();
    passedData.map((item: any, key: any) => {
        if(data.length > passedData.length){
            data.splice(-1)
        }
        if(passedData[key].name !== null){
            if(passedData[key].optionType === null){
                data[key].name = passedData[key].assetClass.name;
                data[key].y = passedData[key].count;
                data[key].optionId = passedData[key].assetClass.id;
            }
            if(passedData[key].optionType !== null){
                if(passedData[key].assetClass.name === 'Optionsscheine'){
                    data[key].name = passedData[key].assetClass.name + " " + passedData[key].optionType
                }
                if(passedData[key].assetClass.name === 'Knock-Out'){
                    if(passedData[key].optionType === "PUT"){data[key].name = passedData[key].assetClass.name + " Short"}if(passedData[key].optionType === "CALL"){data[key].name = passedData[key].assetClass.name + " Long"}
                }
                if(passedData[key].assetClass.name === 'Faktor'){
                    data[key].name = passedData[key].assetClass.name + " " + passedData[key].optionType
                }
                data[key].y = passedData[key].count;
                data[key].optionId = passedData[key].assetClass.id;
                data[key].optionType = passedData[key].optionType;
            }
        }
    })

    let minimalRiskArray = passedData.filter(function (el: any) {
        return el.assetClass.investmentRiskLevel.name === "Minimal"
    })
    let gerlingRiskArray = passedData.filter(function (el: any) {
        return el.assetClass.investmentRiskLevel.name === "Gerling"
    })
    let moderatRiskArray = passedData.filter(function (el: any) {
        return el.assetClass.investmentRiskLevel.name === "Moderat"
    })
    let hochRiskArray = passedData.filter(function (el: any) {
        return el.assetClass.investmentRiskLevel.name === "Hoch"
    })
    let sehrHochRiskArray = passedData.filter(function (el: any) {
        return el.assetClass.investmentRiskLevel.name === "Sehr Hoch"
    })

    risk.map((item: any, key: any) => {
        switch (key) {
            case 0: risk[0].length = minimalRiskArray.length; risk[0].y = minimalRiskArray.map((item: any) => item.count).reduce((a: any, b: any) => a + b, 0); break;
            case 1: risk[1].length = gerlingRiskArray.length; risk[1].y = gerlingRiskArray.map((item: any) => item.count).reduce((a: any, b: any) => a + b, 0); break;
            case 2: risk[2].length = moderatRiskArray.length; risk[2].y = moderatRiskArray.map((item: any) => item.count).reduce((a: any, b: any) => a + b, 0); break;
            case 3: risk[3].length = hochRiskArray.length; risk[3].y = hochRiskArray.map((item: any) => item.count).reduce((a: any, b: any) => a + b, 0); break;
            case 4: risk[4].length = sehrHochRiskArray.length; risk[4].y = sehrHochRiskArray.map((item: any) => item.count).reduce((a: any, b: any) => a + b, 0); break;
        }
    })

    const [render, setRender] = useState(0);

    function toggle(item: any) {
        item.setVisible(!item.visible);
        setRender(render + 1);
    }

    function onFocus(item: any) {
        if (item.visible) {
            item.series.data.forEach((i: any) => i.setState('inactive'));
            item.setState('hover');
            setRender(render + 1);
        }
    }

    function onBlur(item: any) {
        if (item.visible) {
            item.series.data.forEach((i: any) => i.setState(''));
            setRender(render + 1);
        }
    }

    return (
        <Row>
            <Col xs={1} className="d-flex p-0">
                <div className="my-auto" style={{ transform: 'rotate(-90deg)' }}>RISIKO</div>
            </Col>
            <Col xs={4} className="pl-0 py-0 pr-1">
                <div className="d-flex flex-column">
                    {
                        props.chart?.series[0].data.map((item: any, key: any) =>
                            <div key={key}>
                                <div style={{
                                    backgroundColor: item.color,
                                    width: 5,
                                    height: item.length * 20
                                }} className="float-right">&nbsp;</div>
                                <div
                                    className={"font-size-12px float-right my-" + (item.length > 1 ? item.length : 0)}>{item.name}&nbsp;</div>
                            </div>
                        )
                    }
                </div>
            </Col>
            <Col xs={6} className="p-0">
                {
                    render > -1 && props.chart?.series[1].data.map((item: any, key: any) =>
                        <div className="font-size-12px text-nowrap cursor-pointer" key={key}
                            onClick={() => 
                                {
                                    if(item.y === 0){
                                        return false
                                    }
                                    if(item.y > 0  && props.underlyingObject){
                                        handleRedirectWithPropsAlternatives(push, props.underlyingObject, item.options, props.assetClassObject, props.assetTypeObject, props.issuerObject);
                                    }
                            }
                            } 
                            onMouseEnter={() => onFocus(item)}
                            onMouseLeave={() => onBlur(item)}>
                            <svg height="20" width="20">
                                <circle cx="10" cy="10" r="4" fill={item.visible ? item.color : '#cccccc'} />
                            </svg>
                            {(item.y === 0) ? <span style={{ color: '#cccccc', cursor: 'default', pointerEvents: 'none'}}>{item.name} ({item.y})</span> : <span style={{ color: item.visible ? "initial" : '#cccccc', cursor: 'pointer' }}>{item.name} ({item.y})</span>}
                        </div>
                    )
                }
            </Col>
        </Row>
    );
}

interface AlternativesFromUnderlineComponentProps {
    className?: string;
    issuerId?: string;
    assetType?: Maybe<AssetType> | undefined;
    groupId?: Maybe<InstrumentGroup> | undefined,
    warrantGroupId?: Maybe<InstrumentGroup> | undefined,
    underlying? : Maybe<InstrumentGroup> | undefined;
    assetClass?: any;

}

export function AlternativesFromUnderlineComponent(props: AlternativesFromUnderlineComponentProps) {
    let underlyingInstrumentGroupId
    if (props && props?.groupId) {
        underlyingInstrumentGroupId = props.groupId.id
    }
    const [chart, setChart] = useState();
    let { loading: chartLoading, data: chartData } = useQuery<Query>(loader('./getAlternativeFromUnderline.graphql'), {
        variables: { underlyingInstrumentGroupId: underlyingInstrumentGroupId },
    });
    const isMobile = useMediaQuery({
        query: '(max-width: 767.5px)'
    })
    let underlyingObject: any
    underlyingObject = JSON.parse(JSON.stringify(props.groupId?.content.slice(-1)[0]));
    Object.defineProperty(underlyingObject, "instrument", {
        value: {exchange: props.groupId?.content.slice(-1)[0].exchange,
                id: props.groupId?.content.slice(-1)[0].id,
                snapQuote: props.groupId?.content.slice(-1)[0].snapQuote
                },
        writable: true
    })
    let assetClassObject = {
        assetGroup: "",
        id: 1,
        leveraged: true,
        name: "",
        types: [],
    }
    let assetTypeObject = {
        id: "",
        name: "",
    }
    let issuerObject = {
        id: "",
        name: "",
    }
    const { push } = useHistory();
    // console.log(props.warrantGroupId?.issuer)
    const dualPieChartOptions = {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            width: 365,
            type: 'pie',
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
        },
        title: {
            text: ''
        },
        plotOptions: {
            pie: {
                allowPointSelect: true
            },
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click(event:any) {
                                if(event.point.options.clickable && underlyingObject){
                                    handleRedirectWithPropsAlternatives(push, underlyingObject, event.point.options, assetClassObject, assetTypeObject, issuerObject)
                                }else{
                                    event.preventDefault();
                                }
                            // console.log(event.point.options)
                        }
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            symbolHeight: 8,
            labelFormatter: function (): any {
                // @ts-ignore
                const { name, y, series, color, length } = this;
                if (series.name === 'risk') {
                    return `<div class="d-flex">
                                ${name}
                                <div style="background-color: ${color}; width: 5px; height: ${length * 20}px"></div>
                            </div>`;
                }
                return `${name} ${y}`;
            },
            itemStyle: {
                fontWeight: 'normal',
            },
            useHTML: true
        },
        tooltip: {      
            shared: true,
            useHTML:true,
            formatter:
            function (): any {
                // @ts-ignore
                const { y, color, point } = this;
                return `<div>${point?.name}</div><span style="color: ${color}">●</span><b> ${y}</b><br/>`;
            }, 
        },
    
        series: [
            {
                name: 'risk',
                colorByPoint: false,
                data: risk,
                size: '65%',
                innerSize: '92%',
                dataLabels: {
                    enabled: false
                },
            },
            {
                name: 'securities',
                colorByPoint: true,
                data: data,
                size: '100%',
                innerSize: '70%',
                dataLabels: {
                    enabled: false
                },
                shadow: false,
            }
        ],
    
    }
    const dualPieChartOptionsMobile = {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            type: 'pie',
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
        },
        title: {
            text: ''
        },
        plotOptions: {
            pie: {
                allowPointSelect: true
            },
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click(event:any) {
                                if(event.point.options.clickable && underlyingObject){
                                    handleRedirectWithPropsAlternatives(push, underlyingObject, event.point.options, assetClassObject, assetTypeObject, issuerObject)
                                }else{
                                    event.preventDefault();
                                }
                            // console.log(event.point.options)
                        }
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false,
            symbolHeight: 8,
            labelFormatter: function (): any {
                // @ts-ignore
                const { name, y, series, color, length } = this;
                if (series.name === 'risk') {
                    return `<div class="d-flex">
                                ${name}
                                <div style="background-color: ${color}; width: 5px; height: ${length * 20}px"></div>
                            </div>`;
                }
                return `${name} ${y}`;
            },
            itemStyle: {
                fontWeight: 'normal',
            },
            useHTML: true
        },
        tooltip: {      
            shared: true,
            useHTML:true,
            formatter:
            function (): any {
                // @ts-ignore
                const { y, color, point } = this;
                return `<div>${point?.name}</div><span style="color: ${color}">●</span><b> ${y}</b><br/>`;
            }, 
        },
    
        series: [
            {
                name: 'risk',
                colorByPoint: false,
                data: risk,
                size: '65%',
                innerSize: '92%',
                dataLabels: {
                    enabled: false
                },
            },
            {
                name: 'securities',
                colorByPoint: true,
                data: data,
                size: '100%',
                innerSize: '70%',
                dataLabels: {
                    enabled: false
                },
                shadow: false,
            }
        ],
    
    }
    return (
        <>
            { !isMobile ? 
                <div className={classNames("content-wrapper", props.className)}>
                {/* <h3 className="content-wrapper-heading font-weight-bold">
                    Produkte auf {props.groupId?.name}
                </h3> */}
                {
                    chartLoading ?
                        <div className="text-center py-2">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                        :
                        <div className="content d-flex center-alternative-chart">
                            <div style={{maxWidth:"365px"}}>
                            <HighchartsReact highcharts={Highcharts} options={dualPieChartOptions}
                                callback={setChart} />
                            </div>
                            <div style={{paddingLeft: "10px"}}>
                            <Legends chart={chart} passData={chartData} groupId={props.groupId} underlyingObject={underlyingObject} assetClassObject={assetClassObject} assetTypeObject={assetTypeObject} issuerObject={issuerObject}/>
                            </div>
                        </div>
                        
                        
                }
            </div>
            :
            <div className={classNames("content-wrapper", props.className)} style={{ maxWidth: "365px" }}>
                {
                    chartLoading ?
                        <div className="text-center py-2">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                        :
                        <div className="content">
                            <HighchartsReact highcharts={Highcharts} options={dualPieChartOptionsMobile}
                                callback={setChart} />
                            <Legends chart={chart} passData={chartData} issuerId={props.issuerId} assetType={props.assetType} groupId={props.groupId} warrantGroupId={props.warrantGroupId} underlying={props.underlying} assetClass={props.assetClass}/>
                        </div>
                }
            </div>
            }
            

        </>
    )
}

const data = [
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#07416e'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#5595c6'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#0c5891'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#002948'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#397eb2'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#033358'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#216ba2'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#043962'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#87bfe9'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#094a7b'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#6eaad7'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#0a4f84'
    }, 
    {
        name: 'null',
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#9fd2f9'
    }, 
    {
        name: "null",
        y: 0,
        optionType: "null",
        optionId: 0,
        clickable: true,
        color: '#043962'
    }
];



const risk = [
    {
        name: "Minimal",
        y: 0,
        length: 0,
        color: "#18C48F"
    }, {
        name: "Gering",
        y: 0,
        length: 0,
        color: "#3dfbc0"
    }, {
        name: "Moderat",
        y: 0,
        length: 0,
        color: "#ffcc00"
    }, {
        name: "Hoch",
        y: 0,
        length: 0,
        color: "#ff8842"
    }, {
        name: "Sehr Hoch",
        y: 0,
        length: 0,
        color: "#ff4d7d"
    }
];

export function handleRedirectWithPropsAlternatives(variable:any, underlying:any, clickedItem:any, assetClass:any, assetType: any, issuer:any) {
    if(clickedItem?.name.split(" ").length > 1){
        let clickedItemArray = clickedItem.name.split(" ");
        let clickedItemClass = clickedItemArray[0];
        let clickedItemType = clickedItemArray[1];
        if(clickedItemClass === 'Index'){
            clickedItemClass = 'Index / Partizipation'
        }
        if(clickedItemType === 'CALL'){
            clickedItemType = 'CALL'
        }
        if(clickedItemType === 'PUT'){
            clickedItemType = 'PUT'
        }
        if(clickedItemType === 'Long'){
            clickedItemType = 'CALL'
        }
        if(clickedItemType === 'Short'){
            clickedItemType = 'PUT'
        }
        variable({
            pathname: '/hebelprodukte/suche',
            search: '?aclass=' + clickedItemClass + '&type=' + clickedItemType + '&underlying=' + underlying.group.id + '&issuerId=' + issuer.id + '&issuerName=' + issuer.name,
        })
    }else{
        variable({
            pathname: '/hebelprodukte/suche',
            search: '?aclass=' + clickedItem?.name + '&underlying=' + underlying.group.id + '&issuerId=' + issuer.id + '&issuerName=' + issuer.name,
        })
    }
    return false;
}

export default AlternativesFromUnderlineComponent
