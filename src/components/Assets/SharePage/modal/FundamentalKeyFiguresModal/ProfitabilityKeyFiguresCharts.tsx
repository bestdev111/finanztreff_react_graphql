import React, {Component} from "react";
import {FundamentalKeyFigures} from "../../../../../generated/graphql";
import {createSeries} from "./utils";
import {KeyFigureChart} from "../../../../common/charts";

export class ProfitabilityKeyFiguresCharts extends Component<ProfitabilityKeyFiguresChartsProps, {}> {
    render() {
        const hideFundamentalKeyfigures = (field: string): boolean => createSeries(this.props.company, field).length !== 0;
        return (
            <div className="charts-row small-charts">
                <h3 className="content-wrapper-heading font-weight-medium ml-0 pl-1" style={{marginTop:'55px'}}>Entwicklung der
                    Rentabilitätskennzahlen</h3>
                <div className="row gutter-5 row-cols-xl-4 row-cols-lg-2 row-cols-sm-1">
                    {hideFundamentalKeyfigures("equityRatio") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Eigenkapitalrendite
                                </div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        series={[{name: "Eigenkapitalrendite", points: createSeries(this.props.company, "equityRatio")}]}
                                        height={'200px'}
                                        createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("salesRatio") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Umsatzrendite</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        series={[{name: "Umsatzrendite", points: createSeries(this.props.company, "salesRatio")}]}
                                        height={'200px'}
                                        createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("returnOnAssets") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Gesamtrentabilität</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        series={[{name: "Gesamtrentabilität", points: createSeries(this.props.company, "returnOnAssets")}]}
                                        height={'200px'}
                                        createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("returnOnInvestment") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Return on Investment</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        series={[{name: "Return on Investment", points: createSeries(this.props.company, "returnOnInvestment")}]}
                                        height={'200px'}
                                        createZones={true}/>
                                </div>
                            </div>}
                </div>
            </div>
        );
    }
}


export interface ProfitabilityKeyFiguresChartsProps {
    company: FundamentalKeyFigures[];
}

