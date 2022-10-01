import React, {Component} from "react";
import classNames from "classnames";
import {numberFormat} from "../../../../utils";
import {QuoteInformation} from "./utils";

export class JapanesePriceCandle extends Component<JapanesePriceCandleProps, any> {
    render() {
        if (!this.props.info.lastPrice || !this.props.info.firstPrice || !this.props.info.highPrice || !this.props.info.lowPrice) {
            return <></>
        }
        let positiveDirection = this.props.info.lastPrice > this.props.info.firstPrice;
        let pixelsPerUnit = 210 / (this.props.max - this.props.min);
        return (
            <div className={classNames("bar-wrapper", this.props.classNames)}>
                <div className={classNames("candle-wrapper", positiveDirection ?  "positive-move" : "negative-move")} style={{top: ((this.props.max - this.props.info.highPrice) * pixelsPerUnit - 105) + "px"}} >
                    <div className="candle" style={
                        {
                            height: ((Math.abs(this.props.info.firstPrice - this.props.info.lastPrice)) * pixelsPerUnit) + "px",
                            top: ((Math.abs(this.props.info.highPrice - Math.max(this.props.info.firstPrice, this.props.info.lastPrice))) * pixelsPerUnit) + "px"
                        }
                    }>
                        {
                            positiveDirection ?
                                <>
                                    <div className="candle-data open-data">
                                        {this.props.info.closed ? <div>Close</div> : <div>Aktuell</div>}
                                        <div className="font-weight-bold">{numberFormat(this.props.info.lastPrice)}</div>
                                    </div>
                                    <div className="candle-data close-data">
                                        <div>Open</div>
                                        <div className="font-weight-bold">{numberFormat(this.props.info.firstPrice)}</div>
                                    </div>
                                </> :
                                <>
                                    <div className="candle-data open-data">
                                        {this.props.info.closed ? <div>Close</div> : <div>Aktuell</div>}
                                        <div className="font-weight-bold">{numberFormat(this.props.info.lastPrice)}</div>
                                    </div>
                                    <div className="candle-data close-data">
                                        <div>Open</div>
                                        <div className="font-weight-bold">{numberFormat(this.props.info.firstPrice)}</div>
                                    </div>
                                </>
                        }
                    </div>
                    <div className="candle-axis" style={{height: ((this.props.info.highPrice - this.props.info.lowPrice) * pixelsPerUnit) + "px"}}>&nbsp;</div>
                    <div className="candle-data high-data text-left">
                        <div>High</div>
                        <div className="font-weight-bold">{numberFormat(this.props.info.highPrice)}</div>
                    </div>
                    <div className="candle-data low-data text-left">
                        <div>Low</div>
                        <div className="font-weight-bold">{numberFormat(this.props.info.lowPrice)}</div>
                    </div>
                </div>
            </div>
        );
    }
}

interface JapanesePriceCandleProps {
    classNames?: string;
    info: QuoteInformation;
    min: number;
    max: number;
}

