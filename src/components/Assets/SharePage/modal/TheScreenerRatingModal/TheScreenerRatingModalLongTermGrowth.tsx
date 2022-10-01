import {TheScreenerRatingLongTermGrowth} from "../../../../../generated/graphql";
import React, {Component} from "react";
import { numberFormat } from "utils";

export interface TheScreenerRatingModalLongTermGrowthProps {
    longTermGrowth: TheScreenerRatingLongTermGrowth;
}

export class TheScreenerRatingModalLongTermGrowth extends Component<TheScreenerRatingModalLongTermGrowthProps> {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1"}>Langzeit Wachstum-Schätzung</span>
                        {this.props.longTermGrowth.value && this.props.longTermGrowth.value <= 0 ?
                            <span className="text-red"> {numberFormat(this.props.longTermGrowth.value,"%")} </span> :
                            <span className="text-green"> {numberFormat(this.props.longTermGrowth.value,"%")} </span>
                        }
                    </h5>
                    <p className="card-text ml-n1">Wachstum heute bis { this.props.longTermGrowth.value } p.a.</p>
                    <p className="card-text ml-n1"> Die durchschnittlichen jährlichen Wachstumsraten gelten für die Gewinne von heute bis { this.props.longTermGrowth.year } </p>
                </div>
            </div>

        );
    }
}
