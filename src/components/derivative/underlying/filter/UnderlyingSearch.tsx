import React, {useState} from "react";
import {FormControl, Spinner, Tab, Tabs} from "react-bootstrap";
import {UnderlyingSearchResult} from "./UnderlyingSearchResult";
import {AssetGroup, Instrument} from "../../../../generated/graphql";
import classNames from "classnames";
import {getAssetGroup} from "../../../profile/utils";
import {gql} from "graphql.macro";
import {QueryResult, useQuery} from "@apollo/client";
import {debounce} from "underscore";

const SEARCH_QUERY = gql`
    query getInstruments($assetGroup: [AssetGroup!], $searchString: String!, $first: Int!, $after: ID, $underlying: Boolean) {
        search(criteria: { assetGroup: $assetGroup, searchString: $searchString, underlying: $underlying }, first: $first, after: $after) {
            edges {
                cursor
                node {
                    id
                    name
                    seoTag
                    wkn
                    isin
                    group {
                        id
                        assetGroup
                    }
                    snapQuote {
                        lastChange
                        instrumentId
                        quote(type: TRADE) {
                            type
                            when
                            delay
                            value
                            percentChange
                            change
                        }
                    }
                    currency {
                        displayCode
                    }
                    exchange {
                        code
                    }
                }
            }    pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

interface UnderlyingSearchProps {
    onAssetSelected: (asset: Instrument) => any;
    inputSize?: 'sm' | 'lg'
}

export function UnderlyingSearch({onAssetSelected, inputSize}: UnderlyingSearchProps) {
    const first = 9;//items to load initially
    const [searchString, setSearchString] = useState('');
    const [activeTab, setActiveTab] = useState(AssetGroup.Share);
    const [underlyingValue, setUnderlyingValue] = useState<any>()
    const SHARE = useQuery<any>(SEARCH_QUERY, {variables: {assetGroup: [AssetGroup.Share], searchString, first, underlying: underlyingValue}});
    const INDEX = useQuery<any>(SEARCH_QUERY, {variables: {assetGroup: [AssetGroup.Index], searchString, first, underlying: underlyingValue}});
    const COMM = useQuery<any>(SEARCH_QUERY, {variables: {assetGroup: [AssetGroup.Comm], searchString, first, underlying: underlyingValue}});
    const CROSS = useQuery<any>(SEARCH_QUERY, {variables: {assetGroup: [AssetGroup.Cross], searchString, first, underlying: underlyingValue}});
    return (<>
        <UnderlyingSearchInputRow onUnderlying={setUnderlyingValue} onSearch={setSearchString} size={inputSize} result={{
            SHARE, INDEX, COMM, CROSS
        }} onSelect={setActiveTab}/>
        <Tabs activeKey={activeTab} variant="tabs">
            <Tab {...buildProps(AssetGroup.Share, SHARE, onAssetSelected)}/>
            <Tab {...buildProps(AssetGroup.Index, INDEX, onAssetSelected)}/>
            <Tab {...buildProps(AssetGroup.Comm, COMM, onAssetSelected)}/>
            <Tab {...buildProps(AssetGroup.Cross, CROSS, onAssetSelected)}/>
        </Tabs>
    </>);
}

function buildProps(group: AssetGroup, result: QueryResult, onCustomAssetSelect: (asset: Instrument) => any) {
    return {
        eventKey: group,
        title: group,
        tabClassName: 'd-none',
        children: <UnderlyingSearchResult result={result} onCustomAssetSelect={onCustomAssetSelect}/>
    };
}


interface UnderlyingSearchLgInputRowProps {
    size?: string;
    onSearch: (input: any) => any,
    onSelect: (assetGroup: AssetGroup) => any,
    result: any
    onUnderlying: (underlying: Boolean) => any;
}

function UnderlyingSearchInputRow({size, onSearch, result, onSelect, onUnderlying}: UnderlyingSearchLgInputRowProps) {
    return (<>
        <div className="common-input-row input-bg d-flex">
            <FormControl autoFocus className={"form-control-" + (size || 'md')} placeholder="Ergebnisse filtern..."
                         onChange={
                             debounce(
                                 (e: any) => {
                                     onSearch(e.target.value);
                                     onUnderlying(true);
                                 }, 500)
                         }
            />
            <div className="search-tags">
                <SearchTag assetGroup={AssetGroup.Share} result={result && result[AssetGroup.Share]}
                           onSelect={onSelect}/>
                <SearchTag assetGroup={AssetGroup.Index} result={result && result[AssetGroup.Index]}
                           onSelect={onSelect}/>
                <SearchTag assetGroup={AssetGroup.Comm} result={result && result[AssetGroup.Comm]}
                           onSelect={onSelect}/>
                <SearchTag assetGroup={AssetGroup.Cross} result={result && result[AssetGroup.Cross]}
                           onSelect={onSelect}/>
            </div>
        </div>
    </>);
}

interface SearchTagProps {
    assetGroup: AssetGroup,
    result?: QueryResult,
    onSelect: (assetGroup: AssetGroup) => any
}

const SearchTag = ({assetGroup, result, onSelect}: SearchTagProps) => {
    const name = getAssetGroup(assetGroup);
    return (<span className={classNames('asset-type-tag cursor-pointer', assetGroup)}
                  onClick={() => onSelect(assetGroup)}>{name}&nbsp;{len(result)}</span>);
};

function len(result?: QueryResult<any, Record<string, any>>) {
    if (result?.loading) return <Spinner animation="border" size="sm"/>;
    let hasNextPage = result?.data?.search.pageInfo?.hasNextPage;
    return '(' + (result?.data?.search?.edges?.length || 0) + (hasNextPage ? '+' : '') + ')';
}
