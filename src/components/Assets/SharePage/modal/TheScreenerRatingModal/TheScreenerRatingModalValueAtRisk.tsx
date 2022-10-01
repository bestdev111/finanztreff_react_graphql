import {TheScreenerRatingValueAtRisk} from "../../../../../generated/graphql";
import React, {Component} from "react";

export interface TheScreenerRatingModalValueAtRiskProps {
    valueAtRisk: TheScreenerRatingValueAtRisk;
}
export class TheScreenerRatingModalValueAtRisk extends Component<TheScreenerRatingModalValueAtRiskProps> {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1"}>Value at Risk</span>
                        <span>{this.props.valueAtRisk.value}</span>
                    </h5>
                    <p className="card-text ml-n1">Das geschätzte mittlere Value at Risk beträgt {this.props.valueAtRisk.value} oder {this.props.valueAtRisk.relative}%</p>
                    <p className="card-text ml-n1">Das geschätzte mittlere Value at Risk beträgt {this.props.valueAtRisk.value}. Das Risiko liegt deshalb bei {this.props.valueAtRisk.relative}%. Dieser Wert basiert auf der mittelfristigen historischen Volatilität.</p>
                </div>
            </div>

        );
    }
}
