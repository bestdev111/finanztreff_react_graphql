import React, {Component} from "react";
import {FundamentalKeyFigures} from "../../../../../generated/graphql";
import {KeyFigureChart} from "../../../../common/charts/KeyFigureChart/KeyFigureChart";
import {createSeries} from "./utils";

export class AssetCapitalStructureDevelopmentCharts extends Component<AssetCapitalStructureDevelopmentChartsProps, { }> {
    render() {
        const hideFundamentalKeyfigures = (field: string): boolean => createSeries(this.props.company, field).length !== 0;
        const hideSection = (): boolean => {
            return (hideFundamentalKeyfigures( "intensityOfInvestments") || hideFundamentalKeyfigures( "intensityOfLabor") || hideFundamentalKeyfigures("equityRatio") || hideFundamentalKeyfigures("debtEquityRatio"));
        }
        return (
            <div className="charts-row small-charts">
                {hideSection() && <h3 className="content-wrapper-heading font-weight-medium ml-0 pl-1" style={{marginTop:'55px'}}>Entwicklung der Vermögens- und
                    Kapitalstruktur</h3>}
                <div className="row gutter-5 row-cols-xl-4 row-cols-lg-2 row-cols-sm-1">
                    {hideFundamentalKeyfigures("intensityOfInvestments") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Anlageintensität</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        height={'200px'}
                                        series={[{name: "Anlageintensität", points: createSeries(this.props.company, "intensityOfInvestments")}]}
                                        createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("intensityOfLabor") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Arbeitsintensität</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        series={[{name: "Arbeitsintensität", points: createSeries(this.props.company, "intensityOfLabor")}]}
                                        height={'200px'}
                                        createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("equityRatio") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Eigenkapitalquote</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        series={[{name: "Eigenkapitalquote", points: createSeries(this.props.company, "equityRatio")}]}
                                        height={'200px'}
                                        createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("debtEquityRatio") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Fremdkapitalquote</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        series={[{name: "Fremdkapitalquote", points: createSeries(this.props.company, "debtEquityRatio")}]}
                                        height={'200px'}
                                        createZones={true}/>
                                </div>
                            </div>}
                </div>
            </div>
        );
    }
}

export interface AssetCapitalStructureDevelopmentChartsProps {
    company: FundamentalKeyFigures[];
}
