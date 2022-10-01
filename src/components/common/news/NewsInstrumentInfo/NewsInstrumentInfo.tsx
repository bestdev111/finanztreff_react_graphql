import {Link} from "react-router-dom";
import {extractQuotes, formatPrice, getGridPerformanceClass, numberFormat, UpdateStateProps} from "../../../../utils";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {Spinner} from "react-bootstrap";
import {Query, QuoteType, SnapQuote} from "../../../../graphql/types";
import React, {useEffect, useState} from "react";
import classNames from "classnames";
import { getTradeQuote } from "components/profile/utils";
import {usePercentChangeVisualization} from "../../../../hooks/usePercentChangeVisualization";

interface EditorialFeedInstrumentInfoProps {
    id?: number;
    name?: string;
    url?: string | null;
    showPrice?: boolean;
    showCurrency?: boolean;
    className?: string;
    onReceived?: (snapQuote: SnapQuote | null) => void;
    isNewsPage?:boolean;
    snapQuote?: SnapQuote | null| undefined;
}

export const NewsInstrumentInfo = (props: EditorialFeedInstrumentInfoProps) => {
    let {loading, data} = useQuery<Query>(
            loader('./getInstrumentSnapQuote.graphql'),
        {
            skip: !!props.snapQuote || !props.id,
            variables: {instrumentId: props.id}
        }
        );
    let snapQuote = null;
    if (loading) {
        return <div className="instrument-info-loading"><Spinner animation="border" size="sm"/></div>;
    }
    if (data?.instrument != null) {
        snapQuote = data?.instrument.snapQuote;
        if (props.onReceived) {
            props.onReceived(snapQuote || null);
        }
    }
    return (
        <NewsInstrumentInfoComponent
            {...props}
            snapQuote={props.snapQuote || snapQuote}
            currencyCode={props.showCurrency ? data?.instrument?.currency?.displayCode || undefined : undefined}
            isNewsPage={props.isNewsPage}
        />
    );
}

interface NewsInstrumentInfoComponentProps {
    snapQuote?: SnapQuote | null| undefined;
    name?: string;
    url?: string | null;
    showPrice?: boolean;
    currencyCode?: string;
    className?: string;
    isNewsPage?:boolean;
    isHomeComponent ?:boolean
}

export function NewsInstrumentInfoComponent(props: NewsInstrumentInfoComponentProps) {
    const pushEvent =  usePercentChangeVisualization(props.snapQuote?.instrumentId)
    let currentSnapQuote = pushEvent?.value || props.snapQuote;
    const quote = extractQuotes(currentSnapQuote).trade || extractQuotes(currentSnapQuote).nav;

    return (
        <div className={classNames(`d-flex ${!props.isNewsPage ? "justify-content-between":""}`, props.className, quote && quote.percentChange && quote.percentChange > 0 ? "positive-movement" : "negative-movement")}>
            {props.url ?
                <Link to={props.url} className={`asset-name asset-link text-truncate font-weight-bold ${!props.isNewsPage ? 'font-weight-bold':''}`} style={{color:"rgba(38, 38, 38)"}}>{props.name}</Link> :
                <span>{props.name}</span>
            }
            { quote &&
            <div className={"stock-information d-flex flex-nowrap ml-2"}>
                <div className={'stock'}>
                    { props.showPrice && quote.value != null &&
                        <>
                            <span className={`${props.isNewsPage ? "stock-value ml-xl-n1 ml-md-n2   ml-sm-n1": " stock-value"}`}>{formatPrice(quote.value)}</span>
                            { props.currencyCode &&
                                <span className={`stock-currency ${!props.isNewsPage ? 'news-currency-code ml-xl-1 ml-1':'ml-n1'}`} id={!props.isNewsPage ? '': 'currency-font-size'}>{props.currencyCode}</span>
                            }
                        </>
                    }
                </div>
                {   quote.percentChange != null &&
                    <div className={'stock-movement d-flex flex-nowrap ml-2'}>
                        {!props.isHomeComponent ? <span className={(quote.percentChange > 0 ? 'text-green' : 'text-pink')}>
                            {quote?.percentChange && quote.percentChange > 0 ? "+" : " "}
                                {numberFormat(quote?.percentChange || 0)}%
                        </span> :
                            <span className={classNames(quote.percentChange > 0 ? 'text-green' : 'text-pink',pushEvent.toggle ? 'asset-value-movement-blinker' : '')}>
                            {quote?.percentChange && quote.percentChange > 0 ? "+" : " "}
                                {numberFormat(quote?.percentChange || 0)}%
                        </span>
                        }
                        <span className="arrow d-flex flex-nowrap svg-icon arrow-movement" style={{marginTop:`${!props.isNewsPage?'5px':'3px'}`}}>
                            {quote.percentChange > 0 ?
                                        <img
                                            src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_up_green.svg"}
                                            alt="" className="move-arrow-icon pl-1 pb-1"/> :
                                (quote.percentChange < 0 ?
                                        <img
                                            src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_down_red.svg"}
                                            alt="" className="move-arrow-icon pl-1 pb-1"/> :
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"}
                                             alt="" className="move-arrow-icon pl-1 pb-1"/>)
                            }
                        </span>
                    </div>
                }
            </div>
            }
        </div>
    )
}

