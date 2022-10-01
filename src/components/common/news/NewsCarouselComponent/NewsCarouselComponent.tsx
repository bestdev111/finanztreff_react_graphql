import {Carousel, Row, Spinner} from "react-bootstrap";
import {CarouselWrapper} from "../../index";
import SvgImage from "../../image/SvgImage";
import {createChunk} from "../../utils";
import NewsItem from "../NewsFeedItem/NewsItem";
import {useBootstrapBreakpoint} from "../../../../hooks/useBootstrapBreakpoint";
import {News, NewsCriteria, NewsTopic, Query} from "../../../../generated/graphql";
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";

interface NewsCarouselComponentProps {
    news?: News[];
    topic: NewsTopic
    setSearchLabels?: (value?: string) => void
    setSearchTopic?: (val?: any) => void
    clearTopics?: (val?: any) => void
    isHomePage: boolean
}
export const NewsCarouselComponent = (props: NewsCarouselComponentProps) => {
    const columns = useBootstrapBreakpoint({
        xl: 3,
        lg: 2,
        sm: 1
    });
    const infoline = guessInfonlineSection();
    let {loading, data} = useQuery<Query>(
        loader('./getNewsEditorialFeed.graphql'),
        {skip: !!props.news}
    );
    const searchCriteria: NewsCriteria = {source: ["EDITORIAL_FEED"] }
    return (
        <div style={{ overflowX: 'clip' }}>
        { loading && 
            <Spinner animation="border"/> 
        }
        {
            props.news ?
        <Carousel as={CarouselWrapper} controlclass={'dark-version pt-1 mb-sm-0 mb-md-n3'} slide={true} className={props.isHomePage ? "" : "px-2"}
            prevIcon={
                <SvgImage onClick={() => {
                    trigInfonline("homepage", "news_slider")}
                } icon="icon_direction_left_dark_big.svg" spanClass="move-arrow"
                          convert={false}/>
            }
            nextIcon={
                <SvgImage onClick={() => trigInfonline("homepage", "news_slider")}  icon="icon_direction_right_dark_big.svg" spanClass="move-arrow"
                          childBeforeImage={true} convert={false}/>
            }>
            {
                createChunk(props.news, columns)
                    .map((chunk: any[], index: number) =>
                        <Carousel.Item key={index} className="container">
                            <Row className="row-cols-xl-3 row-cols-lg-2 row-cols-sm-1">
                                {chunk.map((value, cursor) => <NewsItem searchCriteria={searchCriteria} ivwCodeIdentifier={"news_modal"} topic={props.topic} newsItems={props.news} clearTopics={props.clearTopics} setSearchTopic={props.setSearchTopic} setSearchLabels={props.setSearchLabels} key={cursor} news={value} />)}
                            </Row>
                        </Carousel.Item>
                    )
            }
        </Carousel> 
        :
        <Carousel as={CarouselWrapper} controlclass={props.isHomePage ?'dark-version pt-1 mb-md-n3' : 'dark-version pt-1' } slide={true} className={props.isHomePage ? "" : "px-2"}
            prevIcon={
                <SvgImage onSelect={() => {
                    trigInfonline("homepage", "news_slider")}
                } icon="icon_direction_left_dark_big.svg" spanClass="move-arrow"
                          convert={false}/>
            }
            nextIcon={
                <SvgImage onSelect={() => trigInfonline("homepage", "news_slider")}  icon="icon_direction_right_dark_big.svg" spanClass="move-arrow"
                          childBeforeImage={true} convert={false}/>
            }
                        onSlid={(eventKey: number) => {trigInfonline("homepage", "news_slider")}}
            >
            {
                data?.newsSearch.edges !== undefined &&
                createChunk(data?.newsSearch?.edges?.map(current => current.node), columns)
                    .map((chunk: any[], index: number) =>
                        <Carousel.Item key={index} className="container">
                            <Row className="row-cols-xl-3 row-cols-lg-2 row-cols-sm-1">
                                {chunk?.map((value, cursor) => <NewsItem
                                    searchCriteria={searchCriteria}
                                    ivwCodeIdentifier={"news_modal"}
                                    topic={props.topic}
                                    newsItems={data?.newsSearch?.edges.map(current => current.node)} clearTopics={props.clearTopics}
                                    setSearchTopic={props.setSearchTopic}
                                    setSearchLabels={props.setSearchLabels}
                                    key={cursor}
                                    news={value}
                                    isHomePage={props.isHomePage}
                                />)}

                            </Row>
                        </Carousel.Item>
                    )
            }
        </Carousel>
        }
        </div>

    );
}
