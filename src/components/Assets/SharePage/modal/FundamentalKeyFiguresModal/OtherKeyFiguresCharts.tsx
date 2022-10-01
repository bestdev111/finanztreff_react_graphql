import React, {Component} from "react";
import {FundamentalKeyFigures} from "../../../../../generated/graphql";
import {createSeries} from "./utils";
import {KeyFigureChart} from "../../../../common/charts/KeyFigureChart/KeyFigureChart";

export class OtherKeyFiguresCharts extends Component<OtherKeyFiguresChartsProps, {}> {
    render() {
        const hideFundamentalKeyfigures = (field: string): boolean => createSeries(this.props.company, field).length !== 0;
        const hideSection = (): boolean => {
            return (hideFundamentalKeyfigures("dilutedEarningPerShare") || hideFundamentalKeyfigures("employees") ||
                hideFundamentalKeyfigures("personnelExpenses") || hideFundamentalKeyfigures("salesPerEmployee"));
        }
        return (
            (hideSection() &&
                <div className="charts-row small-charts">
                    <h3 className="content-wrapper-heading font-weight-medium ml-0 pl-1"
                        style={{marginTop: '55px'}}>Entwicklung weiterer
                        Kennzahlen</h3>
                    <div className="row gutter-5 row-cols-xl-4 row-cols-lg-2 row-cols-sm-1">
                        {hideFundamentalKeyfigures("dilutedEarningPerShare") &&
                        <div className="col">
                            <div className="top-chart-legend font-weight-bold pl-1">Ergebnis je Aktie verwässert</div>
                            <div className="chart-wrapper">
                                <KeyFigureChart
                                    series={[{
                                        name: "Ergebnis je Aktie verwässert",
                                        points: createSeries(this.props.company, "dilutedEarningPerShare")
                                    }]}
                                    height={'200px'}
                                    createZones={true}/>
                            </div>
                        </div>}
                        {hideFundamentalKeyfigures("employees") &&
                        <div className="col">
                            <div className="top-chart-legend font-weight-bold pl-1">Anzahl der Mitarbeiter</div>
                            <div className="chart-wrapper">
                                <KeyFigureChart
                                    series={[{
                                        name: "Anzahl der Mitarbeiter",
                                        points: createSeries(this.props.company, "employees")
                                    }]}
                                    height={'200px'}
                                    createZones={true}/>
                            </div>
                        </div>}
                        {hideFundamentalKeyfigures("personnelExpenses") &&
                        <div className="col">
                            <div className="top-chart-legend font-weight-bold pl-1">Personalkosten</div>
                            <div className="chart-wrapper">
                                <KeyFigureChart
                                    series={[{
                                        name: "Personalkosten",
                                        points: createSeries(this.props.company, "personnelExpenses")
                                    }]}
                                    height={'200px'}
                                    createZones={true}/>
                            </div>
                        </div>}
                        {hideFundamentalKeyfigures("salesPerEmployee") &&
                        <div className="col">
                            <div className="top-chart-legend font-weight-bold pl-1">Umsatz pro Mitarbeiter</div>
                            <div className="chart-wrapper">
                                <KeyFigureChart
                                    series={[{
                                        name: "Umsatz pro Mitarbeiter",
                                        points: createSeries(this.props.company, "salesPerEmployee")
                                    }]}
                                    height={'200px'}
                                    createZones={true}/>
                            </div>
                        </div>}
                    </div>
                </div>
            )


    )

    }
}
export interface OtherKeyFiguresChartsProps {
    company: FundamentalKeyFigures[];
}
