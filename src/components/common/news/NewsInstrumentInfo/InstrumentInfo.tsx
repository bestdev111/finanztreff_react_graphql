import {Link} from "react-router-dom";
import {numberFormatWithSign} from "../../../../utils";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {Spinner} from "react-bootstrap";
import {Query, QuoteType} from "../../../../graphql/types";
import React from "react";
import classNames from "classnames";

interface EditorialFeedInstrumentInfoProps {
    id: number | null | undefined;
    name: string | undefined;
    url?: string | null;
    className?: string;
}

export const InstrumentInfo = (props: EditorialFeedInstrumentInfoProps) => {
    let {loading, data} = useQuery<Query>(
        loader('./getNewsInstrumentSnapQuote.graphql'),
        {variables: {instrumentId: props.id}}
    );
    let snapQuote = null;
    if (loading) {
        return <Spinner animation="border" size="sm" as="span"/>;
    }
    if (data?.instrument != null) {
         snapQuote = data?.instrument?.snapQuote?.quotes?.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
    }
    return (<>
        {
            (snapQuote?.percentChange !== undefined && snapQuote?.percentChange !== null) &&
            <Link className={"newsInstrumentLink"} to={{
                pathname: props.url as string | undefined
            }}>
            <span
                className={classNames("ml-1 text-white text-nowrap", snapQuote?.percentChange < 0 ? 'bg-pink' : 'bg-green')}
                style={{
                    borderRadius: '5px',
                    padding: '1px 6px'
                }}>
                    {numberFormatWithSign(snapQuote?.percentChange, '%')}
                </span>
            </Link>
        }
    </>);
}