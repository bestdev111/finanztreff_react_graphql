import React, {Component} from "react";
import { numberFormat } from "utils";

export interface TheScreenerRatingModalLongTermEarningProps {
    longTermPriceEarnings: number;
    year: number;
}

export class TheScreenerRatingModalLongTermEarning extends Component<TheScreenerRatingModalLongTermEarningProps> {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1"}>Langzeit KGV-Schätzung</span>
                        <span>{numberFormat(this.props.longTermPriceEarnings)}</span>
                    </h5>
                    {this.props.longTermPriceEarnings < 0 ?
                        <>
                            <p className="card-text ml-n1"> Verlust vorhergesagt </p>
                            <p className="card-text ml-n1"> Der erwartete PE-Wert (Kurs-Gewinn-Verhältnis) ist negativ: Die
                                Finanzanalysten erwarten einen Verlust. </p>
                        </> :
                        <>
                            <p className="card-text ml-n1"> Erwartetes PE für {this.props.year} p.a. </p>
                            <p className="card-text ml-n1"> Der erwartete PE-Wert (Kurs-Gewinn-Verhältnis) gilt für das Jahr {this.props.year} </p>
                        </>
                    }
                </div>
            </div>
        );
    }
}

