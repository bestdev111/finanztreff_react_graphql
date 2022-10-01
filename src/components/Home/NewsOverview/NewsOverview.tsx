import {useQuery} from "@apollo/client";
import {NewsCriteria, NewsFeed, Query} from "../../../generated/graphql";
import {loader} from "graphql.macro";
import {Button, Container, Row, Spinner} from "react-bootstrap";
import {useState} from "react";
import SvgImage from "../../common/image/SvgImage";
import './NewsOverview.scss';
import {NavLink} from "react-router-dom";
import {NewsCarouselComponent} from "../../common/news/NewsCarouselComponent/NewsCarouselComponent";
import {NewsGridComponent} from "../../common/news/NewsGridComponent/NewsGridComponent";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";
import { VideoCarouselComponent } from "components/common/news/VideoCarouselComponent/VideoCarouselComponent";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

export const VideosOverview = () => {
    return (
        <section className="main-section news-overview">
            <Container className="px-0 px-md-2 ">
                <div className="carouse-container">
                    <NewsCarousel showAllNewsButton={true}/>
                </div>
            </Container>
        </section>
    );
}

export const NewsOverview = (props:any) => {

    return (
        <section className="main-section news-overview news-overview-wrapper">
            <Container className="px-0 px-md-2 ">
                <h2 className="section-heading font-weight-bold ml-0 mb-n3 ml-md-2">
                    Die wichtigsten Finanznachrichten im Überblick
                </h2>
                <div className="carouse-container">
                    <NewsCarousel isHomePage={props.isHomePage} showAllNewsButton={true}/>
                </div>
                <div className="carouse-container">
                    <VideoCarouselComponent isHomePage={props.isHomePage} newsSource={props.newsSource} setNewsSource={props.setNewsSource} showAllNewsButton={true} topic={props.topic} clearTopics={props.clearTopics} setSearchTopic={props.setSearchTopic} setSearchLabels={props.setSearchLabels} />
                </div>
                <BottomFeed isHomePage={props.isHomePage}/>
            </Container>
        </section>
    );
}

interface BottomFeedProps{
    isHomePage ?: boolean ;
}

export function BottomFeed(props:BottomFeedProps) {
    let [loadingMore, setLoadingMore] = useState(false);
    const newsItemSize = useBootstrapBreakpoint({
        md: 6,
        sm: 3,
        default: 3
    })

    let {loading, data, fetchMore} = useQuery<Query>(
        loader('./getNewsOverviewFeed.graphql'),
        {
            variables: {
                first: newsItemSize, source: ['TOP_FEED', 'COMPACT_FEED', 'RSS_FEED']
            },
        }
    );

    const loadMoreNews = () => {
        if (!loading && data?.newsSearch?.pageInfo?.endCursor) {
            trigInfonline(guessInfonlineSection(), 'load_more_news')
            const endCursor = data.newsSearch?.pageInfo?.endCursor;
            setLoadingMore(true);
            fetchMore && fetchMore({
                variables: {
                    first: 9,
                    after: endCursor,
                    feeds: ['TOP_FEED', 'COMPACT_FEED', 'RSS_FEED']
                }
            }).finally(() => setLoadingMore(false));
        }
    }

    const searchCriteria: NewsCriteria={source: ['TOP_FEED', 'COMPACT_FEED', 'RSS_FEED']}

    return (
        <>
            <div className="p-0 bottom-feed pt-xl-3 pb-xl-1 mt-lg-n1">
                <NewsGridComponent isHomePage={props.isHomePage} searchCriteria={searchCriteria} loadMoreNews={loadMoreNews} news={data?.newsSearch?.edges.map(current => current.node) || []} loading={loadingMore}/>
                {
                    (loading || loadingMore)
                        ?
                        <div className="text-center py-2">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                        :
                        <Row>
                            <div className="col-md-4 offset-md-4 col-12">
                                <div className="text-center">
                                    <Button variant="link" onClick={loadMoreNews} className="text-blue">
                                        Mehr anzeigen
                                        <SvgImage spanClass="top-move" convert={false} width={"27"}
                                                  icon="icon_direction_down_blue_light.svg"
                                                  imgClass="svg-primary"/>
                                    </Button>
                                </div>
                            </div>
                            <div className="col-md-4 col-12 text-center my-auto">
                                <NavLink to="/nachrichten/" onClick={() => trigInfonline('homepage', 'show_all_news')}>
                                    <Button className="float-md-right mr-md-2 mr-xl-1">Alle News</Button>
                                </NavLink>
                            </div>
                        </Row>
                }
            </div>
        </>
    );
}

export function NewsCarousel(props: any) {
    return (
        <>
            {/* ISSUE: Rerender caused by query executed in this component */}
            {/* TODO: Merge all news queries into a single one */}
                <NewsCarouselComponent isHomePage={props.isHomePage} topic={props.topic} clearTopics={props.clearTopics} setSearchTopic={props.setSearchTopic} setSearchLabels={props.setSearchLabels}/>
            {
                props.showAllNewsButton &&
                <div className="text-center mt-sm-n1 my-lg-1">
                    <NavLink to={{
                        state: {
                            keyword: {id: NewsFeed.EditorialFeed, name: 'finanztreff.de'},
                            showValueInDropdown: true
                        },
                        pathname: '/nachrichten/'
                    }} onClick={() => trigInfonline('homepage', 'load_more_news')} >
                        <Button className=" float-md-right mr-2 d-xl-block d-none" style={{marginTop:'-35px'}}>Mehr aus der finanztreff.de Redaktion</Button>
                        <Button className="mx-auto d-xl-none d-flex mt-30px mt-md-0">Mehr aus der finanztreff.de Redaktion</Button>
                    </NavLink>
                </div>
            }
        </>
    );
}
