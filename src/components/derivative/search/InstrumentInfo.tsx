import {gql, useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";
import React, {useEffect} from "react";
import classNames from "classnames";
import {Instrument, Query} from "../../../generated/graphql";
import {formatPrice, numberFormat, numberFormatWithSign, quoteFormat} from "../../../utils";

const INSTRUMENT_INFO_QUERY = gql`
    query getInstrumentSnapQuote($instrumentId:Int!) {
        instrument(id:$instrumentId) {
            isin
            id
            wkn
            exchange {
                name
                id
            }
            snapQuote {
                lastChange
                instrumentId
                delay
                quote(type:TRADE) {
                    value
                    change
                    percentChange
                    when
                }
            }
            currency{
                id
                displayCode
            }
        }
    }
`;

interface EditorialFeedInstrumentInfoProps {
    instrument: Instrument | undefined;
    onInstrumentLoaded?: (instrument: Instrument|null|undefined) => any;
    className?: string;
}

export const InstrumentInfo = ({instrument, onInstrumentLoaded, className}: EditorialFeedInstrumentInfoProps) => {

    useEffect(() =>{
        if(onInstrumentLoaded) onInstrumentLoaded(data?.instrument);
    });
    let {loading, data} = useQuery<Query>(INSTRUMENT_INFO_QUERY, {variables: {instrumentId: instrument?.id}});
    
    let snapQuote = null;

    if (loading) {
        return <div className="mr-4 my-auto"><Spinner animation="border" size="sm" as="span"/></div>;
    }

    if (data?.instrument != null) {
        instrument = data.instrument;
        snapQuote = instrument?.snapQuote;
    }

    return (<>
        <div className={classNames("d-flex", className)}>
            <div className="text-right">
                { instrument &&
                    <span className="bg-orange text-white font-size-12px px-1 mr-1 mr-md-2">
                    {snapQuote?.delay && (snapQuote?.delay === 1 ? 'RT' : '+15')}
                </span>}
                <span
                    className="font-weight-bold mr-2 mr-md-3">{snapQuote?.quote?.value && formatPrice(snapQuote?.quote.value, data?.instrument?.group?.assetGroup,snapQuote?.quote.value, data?.instrument?.currency.displayCode)}
                </span>
                {
                    snapQuote?.quote?.percentChange &&
                    <span
                        className={classNames('text-nowrap font-weight-bold mr-3', snapQuote?.quote?.percentChange < 0 ? 'text-pink' : 'text-green')}>
                        {numberFormatWithSign(snapQuote?.quote.percentChange, '%')}
                    </span>
                }
                {
                    snapQuote?.quote?.when &&
                    <span className="d-none d-md-inline text-nowrap mr-3">{quoteFormat(snapQuote?.quote.when, ' Uhr')}</span>
                }
                <span>{data?.instrument?.exchange?.name}</span>
            </div>
            {
                instrument &&
                <div className="text-right ml-2">
                <span>WKN: {instrument?.wkn}</span>
                <span className="ml-3 d-none d-xl-inline">ISIN: {instrument?.isin}</span>
            </div>}
        </div>
    </>);
}

