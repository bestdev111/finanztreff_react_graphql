import React, {Component} from "react";

export interface TheScreenerRatingModalNumberOfAnalysesProps {
    numberOfAnalysts: number;
}

export class TheScreenerRatingModalNumberOfAnalyses extends Component<TheScreenerRatingModalNumberOfAnalysesProps> {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1"}>Anzahl der Analysten</span>
                        <span>{ this.props.numberOfAnalysts }</span>
                    </h5>
                    {this.props.numberOfAnalysts <= 6 ?
                        <>
                            <p className="card-text ml-n1"> Nur von wenigen Analysten verfolgt </p>
                            <p className="card-text ml-n1"> In den zurückliegenden sieben Wochen haben
                                durchschnittlich {this.props.numberOfAnalysts} Analysten eine Schätzung des Gewinns pro
                                Aktie für diesen Titel abgegeben. </p>
                        </> :
                        (this.props.numberOfAnalysts < 12 ?
                                <>
                                    <p className="card-text ml-n1"> Bei den Analysten von mittlerem Interesse </p>
                                    <p className="card-text ml-n1"> In den zurückliegenden sieben Wochen haben
                                        durchschnittlich {this.props.numberOfAnalysts} des Gewinns pro Aktie für diesen
                                        Titel abgegeben.</p>
                                </> :
                                <>
                                    <p className="card-text ml-n1"> Starkes Analysteninteresse </p>
                                    <p className="card-text ml-n1"> In den zurückliegenden sieben Wochen haben
                                        durchschnittlich {this.props.numberOfAnalysts} Analysten eine Schätzung des
                                        Gewinns pro Aktie für diesen Titel abgegeben.</p>
                                </>
                        )
                    }
                </div>
            </div>
        );
    }
}

