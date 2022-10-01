import {NewsInstrument, QuoteType, SnapQuote} from "../../../../generated/graphql";
import classNames from "classnames";
import { Link } from "react-router-dom";
import {formatPrice, numberFormat, UpdateStateProps} from "../../../../utils";
import {usePercentChangeVisualization} from "../../../../hooks/usePercentChangeVisualization";
import {useEffect, useState} from "react";

interface NewsItemInstrumentInfoProps {
    snapQuote: SnapQuote | null | undefined;
    url: string
    instruments: NewsInstrument[]
    isHomePage?:boolean
}

export const NewsItemInstrumentInfo = (props: NewsItemInstrumentInfoProps) => {
    const pushEvent =  usePercentChangeVisualization(props?.snapQuote?.instrumentId)
    let currentSnapQuote = pushEvent?.value || props.snapQuote;
    const quote = currentSnapQuote?.quotes?.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);

    return (
        <>
            <div className={classNames(`d-flex snap-quote w-100`, props.snapQuote?.quote?.percentChange && props.snapQuote?.quote?.percentChange > 0 ? "positive-movement" : "negative-movement")}>
                {props.url ?
                    <Link to={props.url} className={`asset-name asset-link text-truncate font-weight-bold font-weight-bold`} style={{ color: "rgba(38, 38, 38)" }}>{props?.instruments && props?.instruments[0]?.group?.name}</Link> :
                    <span>{props?.instruments && props?.instruments[0]?.group?.name}</span>
                }
                {quote != null &&
                    <div className={"stock-information d-flex flex-nowrap ml-2"}>
                        <div className={'stock'}>
                            {quote.value != null &&
                                <span className={"stock-value ml-xl-n1 ml-md-n2 ml-sm-n1"}>{formatPrice( quote.value, props.instruments[0]?.group?.assetGroup)}</span>
                            }
                            {props?.instruments && props.instruments[0]?.group?.main?.currency?.displayCode &&
                                <span className={'stock-currency ml-n1'} id={'currency-font-size'}>{props.instruments[0]?.group?.main?.currency?.displayCode}</span>
                            }
                        </div>
                        {quote && quote.percentChange != null &&
                            <div className={'stock-movement d-flex flex-nowrap ml-2'}>
                                <span className={classNames((quote.percentChange > 0 ? 'text-green' : 'text-pink'), props.isHomePage && pushEvent.toggle ? 'asset-value-movement-blinker' : '')}>
                                    {quote?.percentChange && quote.percentChange > 0 ? "+" : " "}
                                    {numberFormat(quote?.percentChange || 0)}%
                                </span>
                                <span className="arrow d-flex flex-nowrap svg-icon arrow-movement" style={{ marginTop: '3px' }}>
                                    {quote?.percentChange > 0 ?
                                        <img
                                            src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_up_green.svg"}
                                            alt="" className="move-arrow-icon pl-1 pb-1" /> :
                                        (quote?.percentChange < 0?
                                            <img
                                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_down_red.svg"}
                                                alt="" className="move-arrow-icon pl-1 pb-1" /> :
                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"}
                                                alt="" className="move-arrow-icon pl-1 pb-1" />
                                        )
                                    }
                                </span>
                            </div>
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default NewsItemInstrumentInfo
