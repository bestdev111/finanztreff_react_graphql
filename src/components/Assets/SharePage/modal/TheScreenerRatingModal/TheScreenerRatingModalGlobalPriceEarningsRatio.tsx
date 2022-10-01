import React, {Component} from "react";
import { numberFormat } from "utils";

export interface TheScreenerRatingModalGlobalPriceEarningsRatioProps {
    value: number;
    premium?: number;
}

export class TheScreenerRatingModalGlobalPriceEarningsRatio extends Component<TheScreenerRatingModalGlobalPriceEarningsRatioProps> {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={"ml-n1"}>G/PE Ratio</span>
                        <span>{ numberFormat(this.props.value) }</span>
                    </h5>
                    { this.props.value < 0 ?
                        <>
                            <p className="card-text ml-n1"> Unternehmen in Schwierigkeiten </p>
                            <p className="card-text ml-n1"> Ein <b>negatives</b> "Verhältnis zwischen Wachstum plus geschätzte Dividende und Kurs-Gewinn Zahl" zeigt an, dass sich entweder das vorhergesagte Wachstum verlangsamt (negatives jährliches Wachstum) oder die Finanzanalysten einen Verlust (negatives PE) erwarten. </p>
                        </> :
                        (this.props.value <= 0.6 ?
                                <>
                                    <p className="card-text ml-n1"> Premium relativ zur Wachstumserwartung </p>
                                    <p className="card-text ml-n1"> Liegt das "Verhältnis zwischen Wachstum plus geschätzte Dividende und Kurs-Gewinn Zahl" <b>unter 0.6</b>, so beinhaltet der Kurs bereits einen <b>starken Aufschlag</b> gegenüber dem normalen Preis für das Wachstumspotential. Hier: 50% Aufschlag. </p>
                                </> :
                                (this.props.value <= 0.9 ?
                                        <>
                                            <p className="card-text ml-n1"> { numberFormat(this.props.premium) } Premium relativ zur Wachstumserwartung </p>
                                            <p className="card-text ml-n1"> Liegt das "Verhältnis zwischen Wachstum plus geschätzte Dividende und Kurs-Gewinn Zahl" <b>unter 0.9</b>, so beinhaltet der Kurs bereits einen <b>Aufschlag</b> gegenüber dem normalen Preis für das Wachstumspotential. Hier: { numberFormat(this.props.premium) } </p>
                                        </> :
                                        (this.props.value <= 1.5 ?
                                                <>
                                                    <p className="card-text ml-n1"> { numberFormat(this.props.premium) } Discount relativ zur Wachstumserwartung </p>
                                                    <p className="card-text ml-n1"> Ein "Verhältnis zwischen Wachstum plus geschätzte Dividende und Kurs-Gewinn Zahl" <b>von über 0.9</b> weist auf einen <b>Preisabschlag</b> gegenüber dem normalen Preis für das Wachstumspotential hin, von in diesem Fall { numberFormat(this.props.premium) } </p>
                                                </> :
                                                (this.props.value <= 1.6 ?
                                                        <>
                                                            <p className="card-text ml-n1"> Discount relativ zur Wachstumserwartung </p>
                                                            <p className="card-text ml-n1"> Ein "Verhältnis zwischen Wachstum plus geschätzte Dividende und Kurs-Gewinn Zahl" <b>von über 0.9</b> weist auf einen <b>Preisabschlag</b> gegenüber dem normalen Preis für das Wachstumspotential hin, von in diesem Fall über 40%. </p>
                                                        </> :
                                                        <>
                                                            <p className="card-text ml-n1"> Hoher Abschlag zur Wachstumserwartung basiert auf einer Ausnahmesituation </p>
                                                            <p className="card-text ml-n1"> Liegt das "Verhältnis zwischen Wachstum plus geschätzte Dividende und Kurs-Gewinn Zahl" <b>über 1.6</b>, so befindet sich das Unternehmen in der Regel in einer <b>Ausnahmesituation</b>. In diesem Fall ist das erwartete PE (Kurs-Gewinn-Verhältnis) ein besserer Indikator für das nachhaltige Wachstum, als der prozentuale Wachstumswert (LT Growth). </p>
                                                        </>
                                                )
                                        )
                                )
                        )
                    }
                </div>
            </div>
        );
    }
}
