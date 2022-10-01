import { TheScreenerRatingRisk } from "../../../../../generated/graphql";
import React, { Component } from "react";
import { formatDate } from "../../../../../utils";

export interface TheScreenerRatingModalRiskProps {
    risk: TheScreenerRatingRisk;
}

export class TheScreenerRatingModalRisk extends Component<TheScreenerRatingModalRiskProps> {
    render() {
        if ((!this.props.risk.zone && this.props.risk.zone!==0) || !this.props.risk.date) {
            return <></>;
        }
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between pt-1">
                        <span className={" ml-n1 mt-n1"}>Risiko</span>
                        <span className="d-flex">
                            <span className="mt-1 ml-1">
                                {this.props.risk.zone < 0 ?
                                    <span className="rects-spans green-arrow">
                                        <span className="bg-green">&nbsp;</span>
                                        <span className="bg-yellow">&nbsp;</span>
                                        <span className="bg-pink">&nbsp;</span>
                                    </span>
                                    :
                                    (this.props.risk.zone > 0 ?
                                        <span className="rects-spans red-arrow">
                                            <span className="bg-green">&nbsp;</span>
                                            <span className="bg-yellow">&nbsp;</span>
                                            <span className="bg-pink">&nbsp;</span>
                                        </span> :
                                        <span className="rects-spans yellow-arrow">
                                            <span className="bg-green">&nbsp;</span>
                                            <span className="bg-yellow">&nbsp;</span>
                                            <span className="bg-pink">&nbsp;</span>
                                        </span>
                                    )
                                }
                            </span>
                        </span>
                    </h5>
                    {this.props.risk.zone < 0 ?
                        <>
                            <p className="card-text ml-n1"> Hoch </p>
                            <p className="card-text ml-n1">
                                Die Aktie ist seit dem {formatDate(this.props.risk.date)} als hoch
                                riskanter Titel eingestuft.
                            </p>
                        </> :
                        (this.props.risk.zone > 0 ?
                            <>
                                <p className="card-text ml-n1"> Mittel </p>
                                <p className="card-text ml-n1">
                                    Die Aktie ist seit dem{formatDate(this.props.risk.date)} als
                                    mittel riskanter Titel eingestuft.
                                </p>
                            </> :
                            <>
                                <p className="card-text ml-n1"> Tief </p>
                                <p className="card-text ml-n1">
                                    Die Aktie ist seit dem {formatDate(this.props.risk.date)} als
                                    niedrig riskanter Titel eingestuft.
                                </p>
                            </>
                        )
                    }
                </div>
            </div>
        );
    }
}
