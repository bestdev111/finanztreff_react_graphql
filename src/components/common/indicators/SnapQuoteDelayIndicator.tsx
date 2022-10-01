import { Component } from "react";
import classNames from "classnames";

export class SnapQuoteDelayIndicator extends Component<SnapQuoteDelayIndicatorProperties, {}>{
    render() {
        let delay = this.props.delay;
        if (this.props.delay == null) {
            return <span className={classNames("timing-info-box",  this.props.className)}>&nbsp;</span>;
        }
        if (delay === 900) {
            return <span className={classNames("timing-info-box",  this.props.className)}><span className="bg-gray-dark">+15</span></span>;
        }
        return <span className={classNames("timing-info-box",  this.props.className)}><span className="bg-dark-orange">RT</span></span>;
    }
}

export interface SnapQuoteDelayIndicatorProperties {
    delay?: number | null
    className?: string;
}
