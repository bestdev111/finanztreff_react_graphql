import {TheScreenerRatingBearMarket} from "../../../../../generated/graphql";
import React, {Component} from "react";

export interface TheScreenerRatingModalBearMarketProps {
    bearMarket: TheScreenerRatingBearMarket;
}

export class TheScreenerRatingModalBearMarket extends Component<TheScreenerRatingModalBearMarketProps> {
    render() {
        if (!this.props.bearMarket.riskZone && this.props.bearMarket.riskZone!==0) {
            return <></>;
        }
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between pt-1">
                        <span className={" ml-n1 mt-n1"}>Bear Market Factor</span>
                        <span className="d-flex">
                            <span>{this.props.bearMarket.riskZone} </span>
                            <span className="mt-1 ml-1">
                            {this.props.bearMarket.riskZone > 0 ?
                                <span className="rects-spans green-arrow">
                                    <span className="bg-green">&nbsp;</span>
                                    <span className="bg-yellow">&nbsp;</span>
                                    <span className="bg-pink">&nbsp;</span>
                                </span> :
                                (this.props.bearMarket.riskZone < 0 ?
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
                    {this.props.bearMarket.riskZone > 0 ?
                        <>
                            <p className="card-text ml-n1"> Sehr defensiver Charakter bei sinkendem Index </p>
                            <p className="card-text ml-n1">
                                Die Aktie tendiert dazu, Indexrückgänge um
                                durchschnittlich {this.props.bearMarket.factor} abzuschwächen.
                            </p>
                        </> :
                        (this.props.bearMarket.riskZone < 0 ?
                                <>
                                    <p className="card-text ml-n1"> Hohes Risiko bei sinkendem Index </p>
                                    <p className="card-text ml-n1">
                                        Aktie tendiert dazu, Indexrückgänge um durchschnittlich {this.props.bearMarket.factor} zu verstärken.
                                    </p>
                                </> :
                                <>
                                    <p className="card-text ml-n1"> Mittleres Risiko bei Indexrückgängen </p>
                                    <p className="card-text ml-n1">
                                        Die Aktie tendiert dazu, Indexrückgänge in etwa gleichem Mass mitzuvollziehen.
                                    </p>
                                </>
                        )
                    }
                </div>
            </div>

        );
    }
}
