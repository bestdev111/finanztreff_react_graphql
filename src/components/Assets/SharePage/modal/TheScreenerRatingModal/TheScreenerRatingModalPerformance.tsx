import SvgImage from "components/common/image/SvgImage";
import React, {Component} from "react";

export interface TheScreenerRatingModalPerformanceProps {
    performance: number;
    referenceIndex: string;
}

export class TheScreenerRatingModalPerformance extends Component<TheScreenerRatingModalPerformanceProps> {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1 "}>Relative Performance der letzten 4 Wochen gegen den {this.props.referenceIndex}</span>
                        {this.props.performance < 0 ?
                            <>
                                <span className="text-red"> {this.props.performance}% </span>
                                <SvgImage icon="icon_star.svg" imgClass="svg-blue" convert={false} width="32"/>
                            </>:
                            <>
                                <span className="text-green"> +{this.props.performance}% </span>
                                <SvgImage icon="icon_star_filled.svg" imgClass="svg-blue" convert={false} width="32"/>
                            </>
                        }
                    </h5>
                    {this.props.performance < 0 ?
                        <>
                            <p className="card-text ml-n1"> Unter Druck (vs. {this.props.referenceIndex}) </p>
                            <p className="card-text ml-n1">
                                Die relative "Underperformance" der letzten zwei Wochen im
                                Vergleich zum {this.props.referenceIndex} beträgt {this.props.performance}%.
                            </p>
                        </> :
                        <>
                            <p className="card-text ml-n1"> vs. {this.props.referenceIndex} </p>
                            <p className="card-text ml-n1">
                                Die relative "Outperformance" der letzten zwei Wochen im Vergleich
                                zum {this.props.referenceIndex} beträgt {this.props.performance}%.
                            </p>
                        </>
                    }
                </div>
            </div>
        );
    }
}

