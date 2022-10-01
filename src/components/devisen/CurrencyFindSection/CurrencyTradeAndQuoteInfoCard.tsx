import { SnapQuote } from "generated/graphql";
import  classNames from "classnames";
import {formatPrice, numberFormatDecimals} from "utils";

export function CurrencyTradeQuoteInfoCard(props: { snapQuote?: SnapQuote , fontSize?: string}) {
    return (
        <div>
            <div className={classNames(props.fontSize, "font-weight-bold")}>
                {numberFormatDecimals(props.snapQuote?.quote?.value, 4)}
                <span className="arrow flex-nowrap svg-icon arrow-movement pl-1">
                    {props?.snapQuote?.quote && props?.snapQuote.quote.percentChange ?
                        (props.snapQuote.quote?.percentChange > 0 ?
                            <img
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_up_green.svg"}
                                alt="" className="move-arrow-icon pl-1 pb-1" width="24px" /> :
                            <img
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_down_red.svg"}
                                alt="" className="move-arrow-icon pl-1 pb-1" width="24px" />
                        ) :
                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"}
                            alt="" className="move-arrow-icon pl-1 pb-1" width="24px" />
                    }
                </span>
            </div>
            <div className="mt-n1 text-truncate">
                <span className={"mr-2 font-weight-bold " + (props?.snapQuote?.quote?.change && props.snapQuote.quote.change > 0 ? 'text-green' : 'text-pink')}>
                    {props?.snapQuote?.quote?.change && props?.snapQuote.quote.change > 0 ? "+" : " "}
                    {formatPrice(props?.snapQuote?.quote?.change || 0)}
                </span>
                <span className={"mr-2 " + (props?.snapQuote?.quote?.percentChange && props?.snapQuote.quote.percentChange > 0 ? 'text-green' : 'text-pink')}>
                    {props?.snapQuote?.quote?.percentChange && props.snapQuote.quote.percentChange > 0 ? "+" : " "}
                    {numberFormatDecimals(props?.snapQuote?.quote?.percentChange || 0, 4)}%
                </span>
            </div>
        </div>
    );
}