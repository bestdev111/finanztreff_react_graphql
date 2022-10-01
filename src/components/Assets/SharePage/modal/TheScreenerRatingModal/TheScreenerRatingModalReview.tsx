import SvgImage from "components/common/image/SvgImage";
import React, {Component} from "react";

interface TheScreenerRatingModalReviewProps {
    rating: number;
    previousRating: number;
}

export class TheScreenerRatingModalReview extends Component<TheScreenerRatingModalReviewProps> {
    render() {
        return (
            <div className="content wb-m col px-3">
                <div className="d-flex justify-content-between">
                    <h3 className="content-wrapper-heading font-weight-bold">theScreener Rating</h3>
                </div>
                <div className="content">
                    <p className={"font-size-15px"}>
                        Mit theScreener Rating bieten wir Ihnen unabhängige und objektive Aktienanalysen an, die mit einfach
                        verständlichen Visualisierungen wie Sterne und Risikotachometer Ihnen bei der Auswahl Ihrer Anlageobjekte
                        eine Entscheidungshilfe bieten.
                    </p>
                    <div className="border-top-2 border-border-gray">
                        <div className="rating-row text-center mt-16px">
                            <div className="asset-name">Aktuelle Einstufung</div>
                            <div className="rating-stars d-flex align-items-center justify-content-center">
                                
                            <div className="d-inline-flex ml-5px mr-5px">
                                    {
                                        Array(this.props.previousRating)
                                            .fill(1)
                                            .map(() => <SvgImage icon="icon_star_filled.svg"  imgClass="svg-blue mr-n2" convert={false} width="27"/>)
                                    }
                                </div>
                                <div className="d-inline-flex ml-5px mr-5px">
                                    <span className="svg-icon">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_screener_dark.svg"} alt=""/>
                                    </span>
                                </div>
                                <div className="stars-holder img-width-small-desktop d-inline-flex ml-n1">
                                    {
                                        Array(this.props.rating)
                                            .fill(1)
                                            .map(() => <SvgImage icon="icon_star_filled.svg"  imgClass="svg-blue mr-n2" convert={false} width="27"/>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
