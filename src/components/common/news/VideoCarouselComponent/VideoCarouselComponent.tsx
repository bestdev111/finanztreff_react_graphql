import { useQuery } from "@apollo/client";
import { CarouselWrapper } from "components/common/carousel";
import SvgImage from "components/common/image/SvgImage";
import { createChunk } from "components/common/utils";
import { loader } from "graphql.macro";
import {NewsCriteria, NewsSource, NewsTopic, Query} from "graphql/types";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { Spinner, Carousel, Row, Button } from "react-bootstrap";
import {useHistory} from "react-router-dom";
import NewsItem from "../NewsFeedItem/NewsItem";

interface VideoCarouselComponentProps {
    // news: News[];
    topic?: NewsTopic
    setSearchLabels?: (value?: string) => void
    setSearchTopic?: (val?: any) => void
    clearTopics?: (val?: any) => void
    showAllNewsButton?: boolean
    setNewsSource?: (val?: any) => void
    newsSource?: NewsSource
    isHomePage: boolean
}

export function VideoCarouselComponent(props: VideoCarouselComponentProps) {
    
    let { loading, data } = useQuery<Query>(loader('./getNewsAllTopics.graphql'));
    const history = useHistory();
    
    const columns = useBootstrapBreakpoint({
        xl: 3,
        lg: 2,
        sm: 1
    });

    return (
        <>
            {loading ?
                <Spinner animation="border" /> :
                <>
                <div style={{ overflowX: 'clip' }}>
                    <Carousel as={CarouselWrapper} className={`pb-xl-0 pb-sm-4 ${props.isHomePage ? "" : "px-2"}`} controlclass={'dark-version mb-sm-0  mb-md-n3'} slide={true} controls={columns===3 ? false: true} indicators={columns===3 ? false: true}
                            prevIcon={
                                <SvgImage icon="icon_direction_left_dark_big.svg" spanClass="move-arrow"
                                            convert={false}/> || <></>
                            }
                            nextIcon={
                                <SvgImage icon="icon_direction_right_dark_big.svg" spanClass="move-arrow"
                                            childBeforeImage={true} convert={false}/>|| <></>
                            }>
                        {
                            createChunk(data && data.newsTopics && data.newsTopics.filter(topic => topic.videoCapable) || [], columns)
                                .map((chunk: NewsTopic[], index: number) =>
                                    <Carousel.Item key={index} className="container">
                                        <Row className="row-cols-xl-3 row-cols-lg-2 row-cols-sm-1">
                                            {chunk.map((value, cursor) =><VideoCard isHomePage={props.isHomePage}  topic={value} clearTopics={props.clearTopics} setSearchTopic={props.setSearchTopic} setSearchLabels={props.setSearchLabels}/>
                                        )}
                                        </Row>
                                    </Carousel.Item>
                                )
                        }
                    </Carousel>
                </div>
                </>
            }
             {props.showAllNewsButton &&
                <div className="text-center mt-sm-n1 my-lg-1">
                        <Button onClick={() => {
                            props.setSearchLabels && props.setSearchLabels('')
                            props.setNewsSource && props.setNewsSource({id: "VIDEO_FEED", name: "Der Aktionär TV"})
                            props.clearTopics && props.clearTopics({searchString: undefined})
                            history.push({
                                pathname: '/nachrichten',
                                state: {
                                    keyword: {id: "VIDEO_FEED", name: "Der Aktionär TV"},
                                    showValueInDropdown: true
                                }
                            })
                        }} className="mt-md-n4 mt-sm-n1 float-xl-right mr-2">Alle Videos</Button>
                </div>
             }
        </>
    );
}

function VideoCard(props: any){
    let { loading, data } = useQuery<Query>(
        loader('./getNewsOverviewFeed.graphql'),
        { variables: { first: 12, source: ['VIDEO_FEED'], topic: [props.topic.id] } }
    );

    const searchCriteria: NewsCriteria = {source: ['VIDEO_FEED'], topic: [props.topic.id] }
    return(
        <>
        {loading ?
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
                        :
            data && data.newsSearch && data.newsSearch.edges && !!data.newsSearch.edges.map(current => current.node)[0] &&
            <NewsItem
                searchCriteria={searchCriteria}
                ivwCodeIdentifier={"video_modal"}
                showModalButton={true}
                topic={props.topic}
                newsItems={data?.newsSearch?.edges?.map(current => current.node) || []} clearTopics={props.clearTopics} setSearchTopic={props.setSearchTopic}
                setSearchLabels={props.setSearchLabels}
                key={0}
                news={data.newsSearch.edges.map(current => current.node)[0]}
                isHomePage={props.isHomePage}
            />
        }
        </>
    );
}
