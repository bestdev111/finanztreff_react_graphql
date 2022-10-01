import { AssetGroup, SnapQuote } from "../../../generated/graphql";
import {extractQuotes, formatPriceWithSign} from "../../../utils";
import classNames from "classnames";
import SvgImage from "../image/SvgImage";

export function PageBannerSnapQuoteChange({toggle, snapQuote, assetGroup}: PageBannerSnapQuoteProperties) {
    if (!snapQuote) {
        return <></>
    }
    let { trade, nav } = extractQuotes(snapQuote);
    let quote = trade ? trade : nav;

    if (!quote?.change && !quote?.percentChange) {
        return <></>;
    }


    const iconStyle = {
        transform: 'rotate(315deg)'
    }

    let className = classNames(
        "main-move-data mt-xl-0","mr-sm-n3","mr-md-0 mt-sm-n2", quote?.change && quote?.change > 0 ? "positive-move" : (quote?.change && quote?.change < 0 ? "negative-move" : "no-move"), "d-flex");
    return <>
        <div className={
            classNames(
                "movement-info col d-flex mt-2 mr-md-n3 mr-xl-0 mr-sm-0",
                toggle && "asset-value-movement-blinker-font"
            )
        } style={{fontSize:"10px"}}>
            <div className={className} style={{ boxShadow: "#00000029 0px 3px 6px", paddingTop: "3px" }}>
                <span className="move-arrow svg-icon top-move">
                    {quote?.change && quote?.change > 0 ?
                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_up_white.svg"}
                             alt=""/> :
                        (
                            quote?.change && quote?.change < 0 ?
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_down_white.svg"}
                                     alt=""/> : quote?.change && quote?.change == 0 &&
                                <SvgImage style={iconStyle} icon={"icon_arrow_long_down_white.svg"} width={"33"}
                                          imgClass={"svg-white"}/>
                        )
                    }
                </span>
                <span className="move-number">{formatPriceWithSign(quote?.change, assetGroup)}</span>
                <span className="move-percent">{formatPriceWithSign(quote?.percentChange, assetGroup, quote.value, '%')}</span>
            </div>
        </div>
   </>;
}

interface PageBannerSnapQuoteProperties {
    toggle: boolean;
    snapQuote: SnapQuote | undefined;
    assetGroup?: AssetGroup
}
