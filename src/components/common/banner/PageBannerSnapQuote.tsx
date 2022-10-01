import React from "react";
import { AssetGroup, Quote, SnapQuote } from "../../../generated/graphql";
import {
    extractQuotes,
    extractQuotesFromFond,
    formatPrice,
    numberFormat,
    quoteFormat,
    shortNumberFormat
} from "../../../utils";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import classNames from "classnames";
import {usePercentChangeVisualization} from "../../../hooks/usePercentChangeVisualization";

export function PageBannerSnapQuote({snapQuote, toggle, delay, ...props}: PageBannerSnapQuoteProperties) {

    const rTBoxHeight = useBootstrapBreakpoint(
        {
            default: "44px",
            md: "44px",
            sm: "40px"
        }
    )
    const priceFontSize = useBootstrapBreakpoint({
        default: ((props.assetGroup === "CERT") || (props.assetGroup === "KNOCK") || (props.assetGroup === "WARR")) ? "19px" : "30px",
        xl: ((props.assetGroup === "CERT") || (props.assetGroup === "KNOCK") || (props.assetGroup === "WARR")) ? "19px" : "30px",
        md: ((props.assetGroup === "CERT") || (props.assetGroup === "KNOCK") || (props.assetGroup === "WARR")) ? "19px" : "30px",
        sm: "22px"
    })
    const customFontSizeMobileText = useBootstrapBreakpoint({
        default: "19px",
        xl: "19px",
        md: "19px",
        sm: "19px"
    })
    const customFontSizeMobileFigure = useBootstrapBreakpoint({
        default: ((props.assetGroup === "CERT") || (props.assetGroup === "KNOCK") || (props.assetGroup === "WARR")) ? "30px" : "19px",
        xl: ((props.assetGroup === "CERT") || (props.assetGroup === "KNOCK") || (props.assetGroup === "WARR")) ? "30px" : "19px",
        md: ((props.assetGroup === "CERT") || (props.assetGroup === "KNOCK") || (props.assetGroup === "WARR")) ? "30px" : "19px",
        sm: "19px"
    })


    if (!snapQuote) {
        return <></>
    }

    let { trade, nav, ask, bid, redemptionPrice, issuePrice } = extractQuotes(snapQuote);
    let quote = (!!props.investmentFund || !trade) ? nav : trade;
    let secondQuote = (!!props.investmentFund || !ask)  ? redemptionPrice : ask;
    let thirdQuote = (!!props.investmentFund || !bid) ? issuePrice : bid;

    return <>
        {quote &&
            <div className={classNames(
                "price-holder",
                props.assetGroup
            )}>
                {!!delay &&
                    (delay === 1 ?
                        <span className="rect-orange">RT</span> : // commodity share index
                        <span className={classNames("rect-white text-dark", props.investmentFund && "text-white")}>+15</span> // opshein knockout zertificate
                    )
                }
                {
                    <span className="price" style={{ fontSize: priceFontSize }}>{formatPrice(quote.value, props.assetGroup as AssetGroup)} <span
                        className="currency">{props.currency}</span></span>
                }
                {!!quote.size && <span className="time-stamp mr-2">{shortNumberFormat(quote.size)} Stück</span>}
                {!!quote.when && <span className="time-stamp">{quoteFormat(quote.when, ' Uhr')}</span>}
            </div>
        }             
        <div className="d-sm-block d-md-none ml-4 mt-n1 mb-n2">
            {!!quote?.size && <span className="time-stamp mr-2 ml-n4">{shortNumberFormat(quote.size)} Stück</span>}
            {!!quote?.when && <span className="">{quoteFormat(quote.when, ' Uhr')}</span>}
        </div>
        {
            !!thirdQuote && !!secondQuote &&
            <div className={"trade-info mt-xl-0" + props.assetGroup} style={{ lineHeight: "28px", marginTop: '9px' }}>
                {delay &&
                    (delay === 1 ?
                        <span className="rect-orange mt-md-10px mt-sm-2" style={{ height: rTBoxHeight }}>RT</span> :
                        <span className={classNames("rect-white text-dark", props.investmentFund && "text-white")}>+15</span>
                    )
                }
                <div className="trade-data">
                    <div className="bid-data">
                        <span className="label mr-1" style={{ fontSize: customFontSizeMobileText }}>{props.investmentFund ? "Ausgabe: " : "Bid: "} </span>
                        <span className="price" style={{ fontSize: customFontSizeMobileFigure }}>{formatPrice(thirdQuote.value, props.assetGroup as AssetGroup)}</span>
                        {thirdQuote.when && <span className="time-stamp">{quoteFormat(thirdQuote.when, ' Uhr')}</span>}
                        {thirdQuote.size && <span className="volume">{thirdQuote.size} Stück</span>}
                    </div>
                    <div className="ask-data pt-md-1 pt-sm-0">
                        <span className="label mr-1" style={{ fontSize: customFontSizeMobileText }}>{props.investmentFund ? "Rücknahme: " : "Ask: "} </span>
                        <span className="price" style={{ fontSize: customFontSizeMobileFigure }}>{formatPrice(secondQuote.value, props.assetGroup as AssetGroup)}</span>
                        {secondQuote.when && <span className="time-stamp">{quoteFormat(secondQuote.when, ' Uhr')}</span>}
                        {secondQuote.size && <span className="volume">{secondQuote.size} Stück</span>}
                    </div>
                </div>
            </div>
        }
        <div className="summary-data d-flex mt-md-0 mt-sm-n2">
            {!!snapQuote?.cumulativeTrades  &&
                <span className="mr-2">
                    <span className="label">Trades:</span> {shortNumberFormat(snapQuote.cumulativeTrades, 0)}
                </span>
            }
            {!!snapQuote?.cumulativeVolume &&
                <span className="mr-2">
                    <span className="label">GVolumen: {shortNumberFormat(snapQuote.cumulativeVolume, 0)}</span>
                </span>
            }
            {!!snapQuote?.cumulativeTurnover &&
                <span className="label">  GUmsatz: {shortNumberFormat(snapQuote.cumulativeTurnover)} {props.currency}</span>
            }
        </div>
    </>;
}

interface PageBannerSnapQuoteProperties {
    delay: number | undefined;
    toggle: boolean;
    instrumentId: number;
    snapQuote: SnapQuote | undefined;
    currency: string;
    assetGroup?: string;
    investmentFund?: boolean;
}
