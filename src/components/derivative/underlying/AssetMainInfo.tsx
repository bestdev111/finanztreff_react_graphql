import React, {useEffect, useState} from "react";
import AssetMainInfoRow from "../common/DerivativeLeftInfoRow";
import {useQuery} from "@apollo/client";
import {DerivativeOptionType, Instrument, Query, QuoteType, SnapQuote} from "../../../generated/graphql";
import {loader} from "graphql.macro";
import {Spinner} from "react-bootstrap";
import {formatKeyFigureValue, formatPrice, formatTime, getFinanztreffAssetLink, quoteFormat} from "../../../utils";
import {Link} from "react-router-dom";


export function getQuote(quotes: SnapQuote | null | undefined, type: QuoteType) {
    return formatPrice(getQuoteValue(quotes, type));
}
export function getQuoteValue(quotes: SnapQuote | null | undefined, type: QuoteType) {
    let res: any;
    if (quotes && quotes.quotes) quotes.quotes.forEach(
        q => {
            if (q?.type === type) res = q.value;
        });

    return res;
}

export function getWhen(quotes: SnapQuote | null | undefined, type: QuoteType) {
    let res: any;
    if (quotes) quotes.quotes.forEach(
        q => {
            if (q?.type === type) res = q.when;
        });

    return quoteFormat(res);
}


export default function AssetMainInfo(props: any) {
    const data = useQuery<Query>(
        loader('../getDerivativeOverviewResult.graphql'),
        {
            variables: {
                assetClass: props.assetClassId,
                underlyingInstrumentGroupId: props.groupId,
                first: 1,
                gearingFrom: 10,
                gearingTo: 20
            },
            skip: !(props.assetClassId && props.groupId)
        }
    );

    useEffect(() => {
        if (props.onDataLoaded && !data.loading) { // @ts-ignore
            props.onDataLoaded(data.data?.buckets);
        }
    }, [data.loading]);

    if (data && data.loading) {
        return <>
            <div className={"p-1"} style={{height: "70px"}}><Spinner animation="border"/></div>
        </>
    }

    // @ts-ignore
    const call: Instrument = data?.data?.callOption?.edges && data?.data?.callOption?.edges[0] ? data?.data?.callOption?.edges[0].node : null;
    // @ts-ignore
    const put : Instrument = data?.data?.putOption?.edges && data?.data?.putOption?.edges[0] ? data?.data?.putOption?.edges[0].node : null;

    return (<div className="left-side">
            {
               call &&
                    <AssetMainInfoRow top={true} type={props.type1 || "call"}
                                      issuer={call.group?.issuer?.name || ''}
                                      wkn={call.wkn || ''}
                                      leverage={formatKeyFigureValue(call.derivativeKeyFigures?.gearing) || ''}
                                      bid={getQuote(call.snapQuote, QuoteType.Bid)}
                                      ask={getQuote(call.snapQuote, QuoteType.Ask)}
                                      bidTime={props.showTime && getWhen(call.snapQuote, QuoteType.Bid)}
                                      askTime={props.showTime && getWhen(call.snapQuote, QuoteType.Ask)}
                                      homepage={props.homepage}
                                      group={call.group}
                                      id={call.id}
                                      linkTo={getFinanztreffAssetLink(call.group?.assetGroup || '',
                                              call.group?.seoTag || '',
                                              call.exchange?.code || '')}
                    />
            }
            {
               put &&
                    <AssetMainInfoRow
                        linkTo={getFinanztreffAssetLink(put.group?.assetGroup || '',
                            put.group?.seoTag || '',
                            put.exchange?.code || '')}
                        top={true} type={props.type2 || "put"}
                                      issuer={put.group?.issuer?.name || ''}
                                      wkn={put.wkn || ''}
                                      leverage={formatKeyFigureValue(put.derivativeKeyFigures?.gearing) || ''}
                                      bid={getQuote(put.snapQuote, QuoteType.Bid)}
                                      ask={getQuote(put.snapQuote, QuoteType.Ask)}
                                      bidTime={props.showTime && getWhen(put.snapQuote, QuoteType.Bid)}
                                      askTime={props.showTime && getWhen(put.snapQuote, QuoteType.Ask)}
                                      homepage={props.homepage}
                                      group={put.group}
                                      id={put.id}
                    />
            }
            <div
                className={`bottom-info ${props.homepage ? " py-sm-3 p-md-1 pb-3 pb-md-3 mt-md-1 mt-xl-2 pb-xl-0 mr-1 mb-xl-0 mb-md-n1 " : " mt-sm-1 mr-1 mt-md-0 mt-xl-n2 pb-md-1 pt-sm-3 mb-xl-0 mb-md-n2"} `}
                style={{marginTop: "-10px"}}>
                {props.bottomInfo}
            </div>
        </div>);
}
