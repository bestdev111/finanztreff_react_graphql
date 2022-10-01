import React from 'react'
import {NewsCarousel} from "../Home";
import InfiniteScroll from "../common/scroller/InfiniteScroller";
import {Spinner} from "react-bootstrap";
import {NewsGridComponent} from "../common/news/NewsGridComponent/NewsGridComponent";
import { NewsCriteria, Query } from 'generated/graphql';
import { VideoCarouselComponent } from 'components/common/news/VideoCarouselComponent/VideoCarouselComponent';

interface NewsContentProps {
    newsData: Query | undefined
    clearFilter: boolean
    loadMoreNews: () => void
    loading: boolean
    setSearchLabels?: (value?: string) => void
    clearTopics?: (val?: any) => void
    setSearchTopic?: (val?: any) => void
    newsPageLoader?: boolean;
    setNewsSource?: (val?: any) => void;
    searchCriteria?: NewsCriteria
}

export const NewsContent = ({newsData, loadMoreNews, loading, clearFilter, setSearchLabels, clearTopics, setSearchTopic, newsPageLoader, setNewsSource, searchCriteria}: NewsContentProps) => {
    return (
        <>
            {/*Editorial Feed News Carousel */}
            { clearFilter && <NewsCarousel isHomePage={false} clearTopics={clearTopics} setSearchLabels={setSearchLabels} setSearchTopic={setSearchTopic}/> }
            { clearFilter && <VideoCarouselComponent isHomePage={false} setNewsSource={setNewsSource} clearTopics={clearTopics}
                                                     setSearchLabels={setSearchLabels}
                                                     setSearchTopic={setSearchLabels}
                                                     showAllNewsButton={false}/>}
            <InfiniteScroll
                className='mt-3 '
                dataLength={newsData ? newsData.newsSearch.edges.length : 0}
                next={() => loadMoreNews()}
                hasMore={!!(newsData && newsData.newsSearch && newsData.newsSearch.pageInfo && newsData.newsSearch.pageInfo.hasNextPage)}
                loader={
                    <div className="text-center py-2">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                }
            >
                <div className="news-page-stories-area mr-xl-0" style={{overflowY: 'auto', overflowX: 'clip'}}>
                    {loading ?
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div> :
                        <NewsGridComponent searchCriteria={searchCriteria} newsPageLoader={newsPageLoader} loadMoreNews={loadMoreNews} setSearchTopic={setSearchTopic} clearTopics={clearTopics} setSearchLabels={setSearchLabels} loading={loading}
                            news={newsData?.newsSearch?.edges?.map(current => current.node) || []}/>
                    }
                </div>
            </InfiniteScroll>
        </>
    )
}

export default NewsContent
