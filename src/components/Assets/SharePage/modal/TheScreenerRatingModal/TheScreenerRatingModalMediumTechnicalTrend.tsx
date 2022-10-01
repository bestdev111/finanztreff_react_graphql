import {
    Currency,
    TheScreenerRatingMediumTermTechnicalTrend,
    TheScreenerRatingTechnicalReverse
} from "../../../../../generated/graphql";
import { Component } from "react";
import { formatDate, numberFormat } from "../../../../../utils";
import SvgImage from "components/common/image/SvgImage";

export interface TheScreenerRatingModalMediumTechnicalTrendProps {
    mediumTechnicalTrend: TheScreenerRatingMediumTermTechnicalTrend;
    currency: Currency;
    technicalReverse: TheScreenerRatingTechnicalReverse;
}

export class TheScreenerRatingModalMediumTechnicalTrend extends Component<TheScreenerRatingModalMediumTechnicalTrendProps> {
    render() {
        if (this.props.mediumTechnicalTrend.value === undefined || this.props.mediumTechnicalTrend.value == null) {
            return <></>;
        }
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1"}>Мittelfristiger technischer Trend</span>
                        <span>
                            {
                                this.props.mediumTechnicalTrend.value > 0.1
                                &&
                                <>
                                    <SvgImage icon="icon_arrow_short_fullup_green.svg" imgClass="svg-green" convert={false} width="28" />
                                    <SvgImage icon="icon_star_filled.svg" imgClass="svg-blue" convert={false} width="32"/>
                                </>
                            }
                            {
                                (-0.1 <= this.props.mediumTechnicalTrend.value && this.props.mediumTechnicalTrend.value <= 0.1) &&
                                <>
                                    <SvgImage icon="icon_arrow_short_halfup_green.svg" imgClass="svg-green" convert={false} width="28" />
                                    <SvgImage icon="icon_star_filled.svg" imgClass="svg-blue" convert={false} width="32"/>
                                </>
                            }
                            {
                                this.props.mediumTechnicalTrend.value === -0.1
                                && <>
                                    <SvgImage icon="icon_arrow_short_halfdown_red.svg" imgClass="svg-red" convert={false} width="28" />
                                    <SvgImage icon="icon_star.svg" imgClass="svg-blue" convert={false} width="32"/>

                                </>
                            }
                            {
                                this.props.mediumTechnicalTrend.value < -1
                                &&
                                <>
                                    <SvgImage icon="icon_arrow_short_fulldown_red.svg" imgClass="svg-red" convert={false} width="28" />
                                    <SvgImage icon="icon_star.svg" imgClass="svg-blue" convert={false} width="32"/>
                                </>
                            }
                        </span>
                    </h5>
                    {
                        this.props.mediumTechnicalTrend.value === 1 &&
                        <>
                            <p className="card-text ml-n1"> Positiver Markttrend seit dem {formatDate(this.props.mediumTechnicalTrend.date)} </p>
                            <p className="card-text ml-n1">
                                Der mittelfristige technische 40-Tage Trend ist seit
                                dem {formatDate(this.props.mediumTechnicalTrend.date)} positiv. Der bestätigte
                                technische Trendwendepunkt (Tech Reverse + 1.75%) ist
                                <b> {numberFormat(this.props.technicalReverse.min)} {this.props.currency.displayCode} </b>
                            </p>
                        </>
                    }
                    {
                        (-0.1 <= this.props.mediumTechnicalTrend.value && this.props.mediumTechnicalTrend.value <= 0.1) &&
                        <>
                            <p className="card-text ml-n1">
                                Neutraler Markttrend nach vorgängig (seit
                                dem {formatDate(this.props.mediumTechnicalTrend.date)} anhaltender) negativer Phase
                            </p>
                            <p className="card-text ml-n1">
                                Die Aktie wird in der Nähe ihres 40-Tage Durchschnitts gehandelt (in einer Bandbreite
                                von +1.75% bis -1.75%).
                                Zuvor unterlag der Wert einem negativen Trend und dies seit
                                dem {formatDate(this.props.mediumTechnicalTrend.date)}.
                                Der bestätigte technische Trendwendepunkt (Tech Reverse + 1.75%) liegt bei
                                <b> {numberFormat(this.props.technicalReverse.max)} {this.props.currency.displayCode}</b>
                            </p>
                        </>
                    }
                    {
                        this.props.mediumTechnicalTrend.value === -1 &&
                        <>
                            <p className="card-text ml-n1">
                                Negativer Markttrend seit dem {formatDate(this.props.mediumTechnicalTrend.date)}
                            </p>
                            <p className="card-text ml-n1">
                                Der mittelfristige technische 40-Tage Trend ist seit dem {formatDate(this.props.mediumTechnicalTrend.date)} negativ.
                                Der bestätigte technische Trendwendepunkt (Tech Reverse + 1.75%) liegt bei
                                <b> {numberFormat(this.props.technicalReverse.max)} {this.props.currency.displayCode}</b>
                            </p>
                        </>
                    }
                </div>
            </div>
        );
    }
}
