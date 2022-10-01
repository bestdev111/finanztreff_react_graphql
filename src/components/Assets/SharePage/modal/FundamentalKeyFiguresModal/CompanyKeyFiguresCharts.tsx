import React, {Component} from "react";
import {FundamentalKeyFigures} from "../../../../../generated/graphql";
import {createSeries} from "./utils";
import {KeyFigureChart} from "../../../../common/charts";

export class CompanyKeyFiguresCharts extends Component<CompanyKeyFiguresChartsProps, {}> {
    render() {
        const hideFundamentalKeyfigures = (field: string): boolean => {
            return createSeries(this.props.company, field).length !== 0 || createSeries(this.props.estimates, field).length !==0
        };
        return (
            <div className="charts-row big-charts border-border-gray border-bottom-2 pb-4">
                <h3 className="content-wrapper-heading font-weight-medium ml-0 pl-1">Kennzahlen Unternehmen</h3>
                <div className="row row-cols-xl-2 row-cols-lg-2 row-cols-sm-1">
                    {hideFundamentalKeyfigures( "priceToEarningsRatio") &&
                        <div className="col">
                            <div className="top-chart-legend font-weight-bold pl-1">KGV</div>
                            <div className="chart-wrapper">
                                <KeyFigureChart
                                    history={[{name: "KGV", points: createSeries(this.props.company, "priceToEarningsRatio")}]}
                                    estimate={[{name: "KGV", points: createSeries(this.props.estimates, "priceToEarningsRatio", 'e')}]}
                                    createZones={true}
                                    height={'200px'}
                                />
                            </div>
                        </div>}
                    {hideFundamentalKeyfigures("priceToCashFlowRatio") &&
                        <div className="col">
                            <div className="top-chart-legend font-weight-bold pl-1">KCV</div>
                            <div className="chart-wrapper">
                                <KeyFigureChart
                                    history={[{name: "KCV", points: createSeries(this.props.company, "priceToCashFlowRatio")}]}
                                    estimate={[{name: "KCV", points: createSeries(this.props.estimates, "priceToCashFlowRatio", 'e')}]}
                                    createZones={true}
                                    height={'200px'}
                                />
                            </div>
                        </div>}
                </div>
                <div className="row row-cols-xl-2 row-cols-lg-2 row-cols-sm-1">
                    {hideFundamentalKeyfigures("priceToSalesRatio") &&
                        <div className="col">
                            <div className="top-chart-legend font-weight-bold pl-1">KUV</div>
                            <KeyFigureChart
                                history={[{name: "KUV", points: createSeries(this.props.company, "priceToSalesRatio")}]}
                                estimate={[{name: "KUV", points: createSeries(this.props.estimates, "priceToSalesRatio", 'e')}]}
                                createZones={true}
                                height={'200px'}
                            />
                            <div className="chart-wrapper">
                            </div>
                        </div>}
                    {
                        hideFundamentalKeyfigures("dividendPerShare") || hideFundamentalKeyfigures("dividendYield") &&
                        <div className="col">
                            <div className="top-chart-legend font-weight-bold pl-1">Dividende Dividendenrendite</div>
                            <div className="chart-wrapper">
                                <KeyFigureChart
                                    history={[
                                        {name: "Dividende", points: createSeries(this.props.company, "dividendPerShare"), color: '#0D5A94'},
                                        {name: "Dividendenrendite", points: createSeries(this.props.company, "dividendYield"), color: '#63BD5C'},
                                    ]}
                                    estimate={[
                                        {name: "Dividende", points: createSeries(this.props.estimates, "dividendPerShare", 'e'), color: '#0D5A94'},
                                        {name: "Dividendenrendite", points: createSeries(this.props.estimates, "dividendYield", 'e'), color: '#63BD5C'},
                                    ]}
                                    height={'200px'}
                                />
                            </div>
                        </div>}
                </div>
            </div>
        );
    }
}

export interface CompanyKeyFiguresChartsProps {
    company: FundamentalKeyFigures[];
    estimates: FundamentalKeyFigures[];
}
