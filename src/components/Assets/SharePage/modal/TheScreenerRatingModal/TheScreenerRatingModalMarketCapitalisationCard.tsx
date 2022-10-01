import {Currency} from "../../../../../generated/graphql";
import React, {Component} from "react";
import {shortNumberFormat} from "../../../../../utils";

interface TheScreenerRatingModalMarketCapitalisationCardProps {
    name: string;
    marketCapitalisation: number;
    currency: Currency;
}

export class TheScreenerRatingModalMarketCapitalisationCard extends Component<TheScreenerRatingModalMarketCapitalisationCardProps> {
    render() {
        let cap = this.props.marketCapitalisation / 1_000_000_000;
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={"ml-n1"}>Marktkapitalisierung in {this.props.currency.sign}</span>
                        <span>{shortNumberFormat(this.props.marketCapitalisation)}</span>
                    </h5>
                    {cap <= 1 ?
                        <>
                            <p className="card-text ml-n1"> Kleiner Marktwert </p>
                            <p className="card-text ml-n1">
                                Mit einer Marktkapitalisierung von &lt;{this.props.currency.sign}1 Mrd., ist <b>{this.props.name}</b>
                                ein niedrig kapitalisierter Titel.
                            </p>
                        </> :
                        (cap <= 5 ?
                            <>
                                <p className="card-text ml-n1"> Mittlerer Marktwert </p>
                                <p className="card-text"> Mit einer Marktkapitalisierung zwischen {this.props.currency.sign}1 und {this.props.currency.sign}5 Mrd., ist <b>{this.props.name}</b> ein mittel kapitalisierter Titel. </p>
                            </> :
                            <>
                                <p className="card-text ml-n1"> Großer Marktwert </p>
                                <p className="card-text ml-n1"> Mit einer Marktkapitalisierung von &gt;{this.props.currency.sign}5 Mrd., ist <b>{this.props.name}</b> ein hoch kapitalisierter Titel. </p>
                            </>)
                    }
                </div>
            </div>
        );
    }
}

