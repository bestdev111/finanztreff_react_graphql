import { TheScreenerRatingBadNewsFactor } from "../../../../../generated/graphql";
import React, { Component } from "react";
import { numberFormat } from "../../../../../utils";

export interface TheScreenerRatingModalBadNewsFactorProps {
    badNews: TheScreenerRatingBadNewsFactor;
}

export class TheScreenerRatingModalBadNews extends Component<TheScreenerRatingModalBadNewsFactorProps> {
    render() {
        if ((!this.props.badNews.riskZone && this.props.badNews.riskZone!==0)|| (!this.props.badNews.factor && this.props.badNews.factor!==0)) {
            return <></>;
        }
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between pt-1">
                        <span className={" ml-n1 mt-n1"}>Bad News Factor</span>
                        <span className="d-flex">
                            <span>{numberFormat(this.props.badNews.factor / 100)}%</span>
                            <span className="mt-1 ml-1">
                                {this.props.badNews.riskZone > 0 ?
                                    <span className="rects-spans green-arrow">
                                        <span className="bg-green">&nbsp;</span>
                                        <span className="bg-yellow">&nbsp;</span>
                                        <span className="bg-pink">&nbsp;</span>
                                    </span> :
                                    (this.props.badNews.riskZone < 0 ?
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
                    {this.props.badNews.riskZone > 0 ?
                        <>
                            <p className="card-text ml-n1"> Geringe Kursrückgänge bei spezifischen Problemen </p>
                            <p className="card-text ml-n1"> Der Titel verzeichnet bei unternehmensspezifischen Problemen i.d.
                                R. geringe Kursabschläge in Höhe von durchschnittlich {numberFormat(this.props.badNews.factor / 100)}%. </p>
                        </> :
                        (this.props.badNews.riskZone < 0 ?
                            <>
                                <p className="card-text ml-n1"> Starke Kursrückgänge bei spezifischen Problemen </p>
                                <p className="card-text ml-n1"> Der Titel verzeichnet bei unternehmensspezifischen
                                    Problemen i.d. R. grosse Kursabschläge in Höhe von durchschnittlich
                                    {numberFormat(this.props.badNews.factor / 100)}% . </p>
                            </> :
                            <>
                                <p className="card-text ml-n1"> Durchschnittliche Kursrückgänge bei spezifischen
                                    Problemen </p>
                                <p className="card-text ml-n1"> Der Titel verzeichnet bei unternehmensspezifischen
                                    Problemen i.d. R. mittlere Kursabschläge in Höhe von durchschnittlich
                                    {numberFormat(this.props.badNews.factor / 100)}%. </p>
                            </>
                        )
                    }
                </div>
            </div>

        );
    }
}
