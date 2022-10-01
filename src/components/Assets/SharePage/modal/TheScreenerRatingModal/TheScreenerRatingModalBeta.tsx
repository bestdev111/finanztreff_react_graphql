import React, {Component} from "react";
import {numberFormat} from "../../../../../utils";

export interface TheScreenerRatingModalBetaProps {
    beta: number;
    referenceIndex: string;
}

export class TheScreenerRatingModalBeta extends Component<TheScreenerRatingModalBetaProps> {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1"}>Beta</span>
                        <span> +{numberFormat(this.props.beta/100)}%</span>
                    </h5>
                    <p className="card-text ml-n1">vs. {this.props.referenceIndex}</p>
                    {this.props.beta <= 90 ?
                        <p className="card-text ml-n1"> Geringe Anfälligkeit vs {this.props.referenceIndex}.</p>
                        : (this.props.beta <= 110 ?
                                <p className="card-text ml-n1"> Mittlere Anfälligkeit vs.{this.props.referenceIndex} </p> :
                                <p className="card-text ml-n1"> Geringe Kursrückgänge bei spezifischen Problemen </p>
                        )
                    }
                </div>
            </div>

        );
    }
}

