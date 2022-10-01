import { AssetGroup, Instrument, Query } from "../../generated/graphql";
import { Carousel, CarouselItem, Spinner, Tab, Tabs } from "react-bootstrap";
import { useState } from "react";
import classNames from "classnames";
import { loader } from "graphql.macro";
import { useQuery } from "@apollo/client";
import { getFinanztreffAssetLink } from "../../utils";
import InfiniteScroll from "../common/scroller/InfiniteScroller";
import { Link } from 'react-router-dom';
import { getAssetGroup } from "../profile/utils";
import SvgImage from "../common/image/SvgImage";
import { CarouselWrapper } from "../common";
import { createChunk } from "../common/utils";
import { useBootstrapBreakpoint } from "../../hooks/useBootstrapBreakpoint";
import {guessInfonlineSection, trigInfonline} from "../common/InfonlineService";

interface SearchInstrumentsPerAssetProps {
    search: SearchQueryVars;
    closeTrigger?: () => void;
}

const SearchResult = ({ search, closeTrigger }: SearchInstrumentsPerAssetProps) => {

    let { data, loading, fetchMore } = useQuery<Query>(loader('./getInstrumentsSearch.graphql'), { variables: { ...search, first: 18 } });
    if (loading) {
        return <div className="mt-5 text-center"><Spinner animation="border" /></div>
    }
    return (
        <InfiniteScroll
            style={{ overflowY: 'auto' }}
            className="search-results d-xl-block d-none"
            dataLength={data?.search.edges.length || 0}
            hasMore={loading ? true : (data?.search.pageInfo?.hasNextPage || false)}
            next={() => fetchMore({ variables: { after: data?.search.pageInfo?.endCursor } })}
            loader={<div className="text-center" style={{ height: 25 }}><Spinner animation="border" size="sm" /></div>}
            height={300}
            scrollableTarget="instruments-search-result"
        >
            {data?.search?.edges?.map(ins => <ResultItem key={ins.cursor} closeTrigger={() => closeTrigger && closeTrigger()} instrument={ins.node} />)}
            {
                data?.search?.edges.length === 0 &&
                <div className="text-center mt-5">Keine Wertpapiere gefunden</div>
            }
        </InfiniteScroll>
    );
}

const SearchResultMedium = ({ search, closeTrigger }: SearchInstrumentsPerAssetProps) => {
    const carouselItems = useBootstrapBreakpoint(
        {
            default: 10,
            md: 10,
            sm: 5
        }
    )
    const customClass = useBootstrapBreakpoint({
        sm: "result-md",
        md: "result-md",
        xl: "result-item"
    })

    let { data, loading, fetchMore } = useQuery<Query>(loader('./getInstrumentsSearch.graphql'), { variables: { ...search, first: 18 } });
    if (loading) {
        return <div className="d-xl-none d-block mt-5 text-center"><Spinner animation="border" /></div>
    }

    const next: any = () => {
        fetchMore({ variables: { after: data?.search?.pageInfo?.endCursor } })
    }
    return (
        <div className='d-xl-none d-block'>
            <Carousel
                className={"custom-carousel-indicator main-search-carousel-md-sm"}
                onSlid={next}
                controlclass={'dark-version mb-n4'}
                touch={true}
                prevIcon={
                    <SvgImage color="black" icon="icon_direction_left_dark.svg"
                        spanClass="move-arrow svg-black" convert={false} />
                }
                nextIcon={
                    <SvgImage color="black" icon="icon_direction_right_dark.svg"
                        onClick={next}
                        spanClass="move-arrow svg-black" convert={false} />
                }
                controls={true}
                indicators={true}
                as={CarouselWrapper}
            >
                {
                    createChunk(data?.search?.edges as any[], carouselItems).map((items: any, index: number) =>
                        <CarouselItem key={index}>
                            {
                                items
                                    .map((item: any) =>
                                        <div
                                            className="border-bottom-1 border-border-gray py-2 py-xl-0 border-top-1 border-border-gray">
                                            <ResultItem classNames={customClass} key={item.cursor}
                                                closeTrigger={() => closeTrigger && closeTrigger()}
                                                instrument={item.node} />
                                            {
                                                !(data && data.search?.edges?.length > 0) &&
                                                <div className="text-center mt-5">Keine Wertpapiere gefunden</div>
                                            }
                                        </div>
                                    )
                            }
                        </CarouselItem>
                    )
                }
            </Carousel>
        </div>
    );
}

export const SearchInstrumentsComponent = (props: SearchInstrumentsComponentProps) => {
    const [key, setKey] = useState<string>("");
    // if(props.searchString!==key){
    //     setKey(props.searchString);
    // }
    const searchVariables: SearchQueryVars = { searchString: props.searchString };
    const { data, loading } = useQuery<Query>(loader('./getInstrumentsCount.graphql'), { variables: { ...searchVariables, assetGroup: null } })
    if (loading) {
        return <div className="mt-5 text-center"><Spinner animation="border" /></div>
    }
    let totalCount = (!!data?.search.assetGroups && data.search.assetGroups.reduce((a, b) => a + b.count, 0)) || 0;
    if (totalCount === 0) {
        return <div className="text-center mt-5">Keine Wertpapiere gefunden</div>;
    }

    let activeAssetGroups = data?.search.assetGroups.filter(current => current.count > 0) || [];
    let activeTab = (!!key && key) || "Alle";
    return (
        <Tabs activeKey={activeTab} onSelect={(k) => {  k && setKey(k) ; trigInfonline(guessInfonlineSection(),'assets_tabs') }} variant="tabs">
            <Tab eventKey={"Alle"} title={<span>Alle</span>} tabClassName={classNames("default",'asset-type-tag', 'mr-2', 'mt-2 mb-2 mb-xl-0', 'rounded-0 asset-tab-hover')}>
                {activeTab === "Alle" &&
                    <>
                        <SearchResult closeTrigger={props.closeTrigger} search={{ ...searchVariables, assetGroup: null }} />
                        <SearchResultMedium closeTrigger={props.closeTrigger} search={{ ...searchVariables, assetGroup: null}} />
                    </>
                }
            </Tab>
            {
                
                activeAssetGroups.map(current =>
                    <Tab eventKey={current.assetGroup} title={<span>{getAssetGroup(current.assetGroup)} ({current.count})</span>} tabClassName={classNames(current.assetGroup, 'asset-type-tag', 'mr-2', 'mt-2 mb-2 mb-xl-0', 'rounded-0 asset-tab-hover')}>
                        {activeTab === current.assetGroup &&
                            <>
                                <SearchResult closeTrigger={props.closeTrigger} search={{ ...searchVariables, assetGroup: [current.assetGroup] }} />
                                <SearchResultMedium closeTrigger={props.closeTrigger} search={{ ...searchVariables, assetGroup: [current.assetGroup] }} />
                            </>
                        }
                    </Tab>
                )
            }
        </Tabs>
    );
}

export interface SearchInstrumentsComponentProps {
    searchString: string;
    closeTrigger: () => void;
}

interface ResultItemProps {
    instrument: Instrument;
    closeTrigger?: () => void;
    classNames?: string
}

function ResultItem(props: ResultItemProps) {
    const { name, group, wkn } = props.instrument;
    let { seoTag } = props.instrument.group;
    const assetGroup = group.assetGroup;
    return (
        <div className={classNames("result-item", props.classNames)}>
            {assetGroup && seoTag ?
                <div className={" w-50  w-xl-100 product-name-search"}>
                    <Link to={(getFinanztreffAssetLink(assetGroup, seoTag))}
                        onClick={() => props.closeTrigger && props.closeTrigger()}
                        className="name font-weight-bold">{props.instrument?.group?.name}</Link></div> :
                <>{props.instrument?.group?.name}</>
            }
            <div className={"d-flex  justify-content-between w-50"}>
                <div className={"text-center"}>WKN: {wkn}</div>
                <div className={classNames("type asset-type-text-color font-weight-bold mr-2", assetGroup)}>{assetGroup && getAssetGroup(assetGroup)}</div>
            </div>
        </div>
    );
}

interface SearchQueryVars {
    assetGroup?: [AssetGroup] | null;
    searchString: string;
}
