import React from "react";
import {calculateEntryDelay} from "../../profile/utils";
import {formatPrice, formatTime, numberFormat} from "../../../utils";

export interface AssetRowHeaderInfoProps {
    exchCode: string;
    delay: number;
    quoteValue: number | null | undefined;
    currencyCode: string;
    percentChange: number;
    when: Date | null | undefined;
}

export default function AssetRowHeaderInfo(props: AssetRowHeaderInfoProps) {
    return <>
            <span className="asset-info">
                <span>
                    <span className="timing-info-box small-box">
                        <span className={"bg-"+(props.delay <= 1 ? "orange" : "gray-dark-asset")+" mr-2"}>{calculateEntryDelay(props.delay)}</span>
                    </span>
                    <span className="font-weight-bold">{formatPrice(props.quoteValue)} {props.currencyCode }</span>
                </span>
                <span className={"font-weight-bold text-" + (props.percentChange < 0 ? "red" : "green") } >{numberFormat(props.percentChange, '%')}</span>
                <span className="">{formatTime(props.when)} {props.exchCode}</span>
            </span>
    </>;
}

