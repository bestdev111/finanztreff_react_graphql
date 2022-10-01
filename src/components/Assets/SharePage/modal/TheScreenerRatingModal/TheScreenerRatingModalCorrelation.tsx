import React, { Component } from "react";
import { numberFormat } from "../../../../../utils";

export interface TheScreenerRatingModalCorrelationProps {
    correlation: number;
    referenceIndex: string;
}

export class TheScreenerRatingModalCorrelation extends Component<TheScreenerRatingModalCorrelationProps> {
    render() {
        return (

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1"}>Korrelation</span>
                        <span>{numberFormat(this.props.correlation * 100, "%")}</span>
                    </h5>
                    {
                        this.props.correlation < 0 ?
                            <>
                                <p className="card-text ml-n1"> Schwache Korrelation mit dem {this.props.referenceIndex}. </p>
                                <p className="card-text ml-n1"> Die Kursschwankungen sind nahezu unabhängig von den
                                    Indexbewegungen. Des Weiteren sind im Verhalten dieses Wertes überdurchschnittlich
                                    häufig gegenläufige Bewegungen zum Index zu erkennen. </p>
                            </> :
                            (this.props.correlation < 0.2 ?
                                <>
                                    <p className="card-text ml-n1"> Schwache Korrelation mit dem {this.props.referenceIndex}. </p>
                                    <p className="card-text ml-n1"> Die Kursschwankungen sind nahezu unabhängig von den
                                        Indexbewegungen. </p>
                                </> :
                                (this.props.correlation < 0.4 ?
                                    <>
                                        <p className="card-text ml-n1"> Schwache Korrelation mit dem {this.props.referenceIndex}. </p>
                                        <p className="card-text ml-n1"> Die Kursschwankungen sind wenig abhängig von
                                            den Indexbewegungen. </p>
                                    </> :
                                    (this.props.correlation < 0.6 ?
                                        <>
                                            <p className="card-text ml-n1"> Mittelstarke Korrelation mit
                                                dem {this.props.referenceIndex} </p>
                                            <p className="card-text ml-n1">
                                                {numberFormat(this.props.correlation * 100, "%")} der Kursschwankungen werden durch Indexbewegungen verursacht.
                                            </p>
                                        </> :
                                        <>
                                            <p className="card-text ml-n1"> Starke Korrelation mit
                                                dem {this.props.referenceIndex} </p>
                                            <p className="card-text ml-n1">
                                                {numberFormat(this.props.correlation * 100, "%")} der Kursschwankungen werden durch Indexbewegungen
                                                verursacht.
                                            </p>
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
