import React, {Component} from "react";

export interface TheScreenerRatingModalDividendProps {
    dividend: number;
    payout?: number;
}

export class TheScreenerRatingModalDividend extends Component<TheScreenerRatingModalDividendProps> {
    render() {
        return (

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1"}>Dividende {this.props.dividend} </span>
                        {this.props.dividend && this.props.dividend <= 0 ?
                            <span className="text-red"> {this.props.dividend}% </span> :
                            <span className="text-green"> +{this.props.dividend}% </span>
                        }
                    </h5>
                    {(this.props.dividend < 0 || this.props.dividend > 100) ?
                        <>
                            <p className="card-text ml-n1"> Dividende ist durch den Gewinn nicht gedeckt </p>
                            <p className="card-text ml-n1"> Die während den nächsten 12 Monaten erwartete Dividende ist durch
                                den Unternehmensgewinn voraussichtlich nicht gedeckt. </p>
                        </> :
                        (this.props.dividend == 0 ?
                                <>
                                    <p className="card-text ml-n1">Keine Dividende</p>
                                    <p className="card-text ml-n1">Die Gesellschaft bezahlt keine Dividende. </p>
                                </> :
                                (this.props.dividend <= 40 ?
                                        <>
                                            <p className="card-text ml-n1"> Dividende durch Gewinn gut gedeckt </p>
                                            <p className="card-text ml-n1"> Für die während den nächsten 12 Monaten erwartete
                                                Dividende müssen voraussichtlich <b> {this.props.payout} </b> des
                                                Gewinns verwendet werden. </p>
                                        </> :
                                        (this.props.dividend <= 70 ?
                                                <>
                                                    <p className="card-text ml-n1"> Dividende durch Gewinn gedeckt </p>
                                                    <p className="card-text ml-n1"> Für die während den nächsten 12 Monaten
                                                        erwartete Dividende müssen
                                                        voraussichtlich <b> {this.props.payout} </b> des Gewinns
                                                        verwendet werden. </p>
                                                </> :
                                                <>
                                                    <p className="card-text ml-n1"> Dividende ist nur unzureichend durch
                                                        Gewinne gedeckt </p>
                                                    <p className="card-text ml-n1"> Für die während den nächsten 12 Monaten
                                                        erwartete Dividende müssen
                                                        voraussichtlich <b> {this.props.payout} </b> des Gewinns
                                                        verwendet werden. </p>
                                                </>
                                        )
                                )
                        )
                    }
                </div>
            </div>
        );
    }
}

