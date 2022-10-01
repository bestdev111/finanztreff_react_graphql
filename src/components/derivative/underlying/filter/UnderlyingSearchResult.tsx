import React from "react";
import UnderlyingSearchResultItem from "./UnderlyingSearchResultItem";
import {Spinner} from "react-bootstrap";
import {QueryResult} from "@apollo/client";
import InfiniteScroll from "../../../common/scroller/InfiniteScroller";
import {Instrument, Query} from "../../../../generated/graphql";

interface UnderlyingSearchResultProps {
    result: QueryResult<Query>,
    onCustomAssetSelect: (asset: Instrument) => any
}

export function UnderlyingSearchResult({result, onCustomAssetSelect}: UnderlyingSearchResultProps) {
    if (result.loading) {
        return (
            <div className="search-results" style={{height: 300}}>
                <div className="mt-5 text-center"><Spinner animation="border"/></div>
            </div>
        );
    }
    return (
        <InfiniteScroll
            className="search-results"
            dataLength={result.data?.search.edges.length || 0}
            hasMore={result.loading ? true : (result.data?.search.pageInfo?.hasNextPage || false)}
            next={() => result.fetchMore({variables: {after: result.data?.search.pageInfo?.endCursor}})}
            loader={<div className="text-center" style={{height: 25}}><Spinner animation="border" size="sm"/></div>}
            height={350}
        >
            {
                result.data?.search?.edges?.map(ins =>
                    <UnderlyingSearchResultItem key={ins.cursor} instrument={ins.node}
                                                onCustomAssetSelect={onCustomAssetSelect}/>)
            }
            {
                !result.data?.search?.edges?.length &&
                <div className="text-center mt-5">Keine Wertpapiere gefunden</div>
            }
        </InfiniteScroll>
    );
}