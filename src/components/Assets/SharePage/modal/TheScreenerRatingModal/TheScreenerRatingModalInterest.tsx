import SvgImage from "components/common/image/SvgImage";
import React, {Component} from "react";

export interface TheScreenerRatingModalInterestProps {
    rating: number;
    marketCapitalisation: number;
}

export class TheScreenerRatingModalInterest extends Component<TheScreenerRatingModalInterestProps> {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1"}>Interesse</span>
                        <span>
                            {this.props.rating
                            && Array(this.props.rating).fill(1)
                                .map(() =>
                                <SvgImage icon="icon_star_filled.svg"  imgClass="svg-blue" convert={false} width="32"/>
                                )
                            }
                        </span>
                    </h5>
                    {this.props.marketCapitalisation <= 1 ?
                        <p className="card-text"> Kleiner Marktwert </p> :
                        (this.props.marketCapitalisation <= 5 ?
                                <p className="card-text ml-n1"> Mittlerer Marktwert </p> :
                                <p className="card-text ml-n1"> Großer Marktwert </p>
                        )
                    }
                    <p className="card-text ml-n1">Ranking bezogen auf Ertragsveränderung, Preisbewertung, relativer Outperformance gegenüber dem Vergleichsindex und technischem Trend.</p>
                </div>
            </div>

        );
    }
}
