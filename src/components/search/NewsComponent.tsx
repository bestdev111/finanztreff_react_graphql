import { NewsInstrumentInfoComponent } from "../common/news/NewsInstrumentInfo";
import { gql, useQuery } from "@apollo/client";
import { Carousel, CarouselItem, Spinner } from "react-bootstrap";
import InfiniteScroll from "../common/scroller/InfiniteScroller";
import { News, NewsCriteria, Query } from "../../generated/graphql";
import { getFinanztreffAssetLink } from "../../utils";
import SvgImage from "../common/image/SvgImage";
import { CarouselWrapper } from "../common";
import { createChunk } from "../common/utils";
import { useBootstrapBreakpoint } from "../../hooks/useBootstrapBreakpoint";
import { Link } from "react-router-dom";

const NEWS_QUERY = gql`
    query getMainNewsFeed($searchString: String ,$first: Int, $after: ID) {
        newsSearch(criteria: {feeds: null, searchString: $searchString, }, first: $first, after : $after) {
            edges {
            cursor
            node {
                id
                when
                body
                headline
                teaser
                links {
                    name
                    href
                }
                source {
                    id
                    name
                }
                medias {
                    source
                    width
                    height
                }
                streams {
                    mimeType
                    duration
                    width
                    height
                    source
                }
                feed
                keywords
                instruments {
                    group {
                        id
                        isin
                        name
                        assetGroup
                        seoTag
                        main {
                            id
                            snapQuote {
                                lastChange
                                instrumentId
                                lowPrice
                                highPrice
                                firstPrice
                                lastPrice
                                yesterdayPrice
                                cumulativeTrades
                                cumulativeTurnover
                                cumulativeVolume
                                quotes {
                                    delay
                                    type
                                    value
                                    percentChange
                                    change
                                    when
                                }
                            }
                            currency {
                                displayCode
                            }
                        }
                    }
                }
            }
        }
        pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
        }
        }
    }
`

export function NewsComponent({ searchString }: { searchString?: string }) {
    const first = 9;
    const result = useQuery<Query>(NEWS_QUERY, {
        variables: { searchString, first, after: null }
    });
    if (result.loading) {
        return <div className="mt-5 text-center"><Spinner animation="border" /></div>
    }
    return (
        <InfiniteScroll
            style={{ overflowY: 'auto' }}
            className="news-container d-none d-xl-block"
            dataLength={result.data?.newsSearch.edges?.length || 0}
            hasMore={result.loading ? true : (result.data?.newsSearch.pageInfo?.hasNextPage || false)}
            next={() => result.fetchMore({ variables: { after: result.data?.newsSearch.pageInfo?.endCursor } })}
            loader={<div className="text-center" style={{ height: 25 }}><Spinner animation="border" size="sm" /></div>}
            height={400}
            scrollableTarget="news-search-result"
        >
            {
                result.data?.newsSearch.edges?.map(ins => <NewsItem key={ins.cursor} {...ins.node} />)
            }
            {
                !result.data?.newsSearch.edges?.length &&
                <div className="text-center mt-5">Keine Wertpapiere gefunden</div>
            }
        </InfiniteScroll>
    );
}

export function NewsComponentMedium({ searchString }: { searchString?: string }) {
    const carouselItems = useBootstrapBreakpoint(
        {
            default: 7,
            md: 7,
            sm: 7
        }
    )
    const first = 9;
    const result = useQuery<Query>(NEWS_QUERY, {
        variables: { searchString, first, after: null }
    });

    const searchCriteria: NewsCriteria = { searchString: searchString }
    const next: any = () => {
        result.fetchMore({ variables: { after: result.data?.newsSearch.pageInfo?.endCursor } })
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
                    createChunk(result.data?.newsSearch.edges as any[], carouselItems).map((items: any, index: number) =>
                        <CarouselItem key={index}>
                            {
                                items
                                    .map((item: any) =>
                                        <div
                                            className="border-bottom-1 border-border-gray py-2 py-xl-0 border-top-1 border-border-gray">
                                            <NewsItem searchCriteria={searchCriteria} key={item.cursor} {...item.node} />
                                            {
                                                !result.data?.newsSearch.edges?.length &&
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

function NewsItem(props: News) {
    const { instruments, headline, id } = props;
    const [newsInstrument] = instruments || [];
    return (<>
        <div className="news-item">
            <Link className="news-title news-title-md text-truncate"
                to={{
                    key: '',
                    pathname: "/nachrichten/" + id + "/",
                }}>
                {headline}
            </Link>
            {
                newsInstrument && newsInstrument.group && newsInstrument.group.name != null
                && newsInstrument.group.assetGroup && newsInstrument.group.seoTag && newsInstrument.group.main &&

                <NewsInstrumentInfoComponent
                    snapQuote={newsInstrument.group?.main.snapQuote || undefined}
                    name={newsInstrument.group.name}
                    className="info"
                    showPrice={true}
                    url={getFinanztreffAssetLink(newsInstrument.group.assetGroup, newsInstrument.group.seoTag)}
                />
            }

        </div>
    </>);
}
