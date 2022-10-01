import React, {Component} from "react";
import {FundamentalKeyFigures} from "../../../../../generated/graphql";
import {createSeries} from "./utils";
import {KeyFigureChart} from "../../../../common/charts/KeyFigureChart/KeyFigureChart";

export class LiquidityRatiosDevelopment extends Component<LiquidityRatiosDevelopmentProps, { }> {
    render() {
        const hideFundamentalKeyfigures = (field: string): boolean => createSeries(this.props.company, field).length !== 0;
        const hideSectionHeading = (): boolean => {
            return (hideFundamentalKeyfigures("cashGrade1") || hideFundamentalKeyfigures("cashGrade2") ||
                hideFundamentalKeyfigures("cashGrade3") || hideFundamentalKeyfigures("workingCapital"));
        }
        return (
            <div className="charts-row small-charts">
                {hideSectionHeading() && <h3 className="content-wrapper-heading font-weight-medium ml-0 pl-1" style={{marginTop:'55px'}}>Entwicklung der Liquiditätskennzahlen</h3>}
                <div className="row gutter-5 row-cols-xl-4 row-cols-lg-2 row-cols-sm-1">
                    {hideFundamentalKeyfigures( "cashGrade1") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Liquidität 1. Grades</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        series={[{name: "Liquidität 1. Grades", points: createSeries(this.props.company, "cashGrade1")}]}
                                        height={'200px'}
                                        createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("cashGrade2") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Liquidität 2. Grades</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        series={[{name: "Liquidität 2. Grades", points: createSeries(this.props.company, "cashGrade2")}]}
                                        height={'200px'}
                                        createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("cashGrade3") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Liquidität 3. Grades</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        height={'200px'}
                                        series={[{name: "Liquidität 3. Grades", points: createSeries(this.props.company, "cashGrade3")}]}
                                        createZones={true}/>
                                </div>
                            </div>}
                    {hideFundamentalKeyfigures("workingCapital") &&
                            <div className="col">
                                <div className="top-chart-legend font-weight-bold pl-1">Working Capital</div>
                                <div className="chart-wrapper">
                                    <KeyFigureChart
                                        height={'200px'}
                                        series={[{name: "Working Capital", points: createSeries(this.props.company, "workingCapital")}]}
                                        createZones={true}/>
                                </div>
                            </div>}
                </div>
            </div>
        );
    }
}

export interface LiquidityRatiosDevelopmentProps {
    company: FundamentalKeyFigures[];
}
