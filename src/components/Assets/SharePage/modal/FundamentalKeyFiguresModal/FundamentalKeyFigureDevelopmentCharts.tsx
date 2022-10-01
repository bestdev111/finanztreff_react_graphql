import React, {Component} from "react";
import {FundamentalKeyFigures} from "../../../../../generated/graphql";
import {createSeries} from "./utils";
import {KeyFigureChart} from "../../../../common/charts";

export class FundamentalKeyFigureDevelopmentCharts extends Component<FundamentalKeyFigureDevelopmentChartsProps, {}> {
    render() {
        const hideFundamentalKeyfigures = (field: string): boolean => createSeries(this.props.company, field).length !== 0;
        return (
            <div className="charts-row small-charts">
                <h3 className="content-wrapper-heading font-weight-medium ml-0 pl-1" style={{marginTop:'50px'}}>Entwicklung fundamentaler Kennzahlen</h3>
                <div className="row gutter-5 row-cols-xl-4 row-cols-lg-2 row-cols-sm-1">
                    {hideFundamentalKeyfigures("earningPerShare") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Gewinn/Aktie</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        height={'200px'}
                                        series={[{name: "Gewinn/Aktie", points: createSeries(this.props.company,  "earningPerShare")}]}
                                        createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("cashFlowPerShare") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Cashflow/Aktie</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart height={'200px'}
                                                    series={[{name: "Cashflow/Aktie", points: createSeries(this.props.company, "cashFlowPerShare")}]}
                                                    createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("salesPerShare") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Umsatz/Aktie</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart height={'200px'}
                                                    series={[{name: "Umsatz/Aktie", points: createSeries(this.props.company, "salesPerShare")}]}
                                                    createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("returnOnInvestment") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Dividende/Aktie</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart height={'200px'}
                                                    series={[{name: "Dividende/Aktie", points: createSeries(this.props.company, "returnOnInvestment")}]}
                                                    createZones={true}/>
                                </div>
                            </div>}
                </div>
            </div>
        );
    }
}

export interface FundamentalKeyFigureDevelopmentChartsProps {
    company: FundamentalKeyFigures[];
}
