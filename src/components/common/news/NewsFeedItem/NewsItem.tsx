import { News, NewsCriteria, NewsTopic } from "../../../../generated/graphql";
import Interweave from "interweave";
import { formatNewsDate, getFinanztreffAssetLink, removeImagesAndFigures } from "../../../../utils";
import './NewsItem.scss';
import classNames from "classnames";
import { NewsMediaComponent } from '../NewsMediaComponent/NewsMediaComponent'
import NewsItemInstrumentInfo from "../NewsItemInstrumentInfo/NewsItemInstrumentInfo";
import { NewsGridModal } from '../NewsGridModal/NewsGridModal';
import { Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { LocationState } from "../NewsModal/NewsModal";
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";

export function NewsItem(props: NewsItemProps) {
    let { medias, headline, teaser, instruments, source, when, feed, streams } = props.news;
    const isVideoExposed: boolean = (feed === "VIDEO_FEED");
    const location = useLocation();
    const locationState: LocationState = { news: props.news, searchCriteria: props.searchCriteria, pathname: location.pathname }
    return (
        <>
            <div className={classNames("col news-stories-area news-page-item", feed)}  onClick={()=>{
            isVideoExposed ? trigInfonline(guessInfonlineSection(),'video_modal') :
            trigInfonline(guessInfonlineSection(),'news_modal')

            }} >
                {medias != null && medias.length > 0 &&
                    <Link className="text-decoration-none"
                        to={{
                            key: '',
                            pathname: "/nachrichten/" + props.news.id + "/",
                            state: locationState
                        }}>
                        <NewsMediaComponent news={props.news}
                            className=" cursor-pointer mb-n2 news-story-media"
                            medias={medias}
                            inModal={false}
                            streams={streams || []}
                        />
                    </Link>
                }
                <div className="story-heading mb-n1">
                    <div className="story-heading-title pb-1 mt-n1">
                        {isVideoExposed ?
                            <>
                                <span className="fs-13px text-white"><span className="fs-11px bg-white text-dark px-1 mr-1 font-weight-bold">VIDEO</span>{source?.name}</span>
                                <span className="fs-13px text-whit">{formatNewsDate(when, ' min', 'vor ')}</span>
                            </>
                            :
                            <>
                                <a href="#" className={feed === "EDITORIAL_FEED" ? "news-source-color-white" : "news-source-color-grey"}>{source?.name}</a>
                                <span className={feed === "EDITORIAL_FEED" ? "news-source-color-white" : "news-source-color-grey"}>{formatNewsDate(when, ' min', 'vor ')}</span>
                            </>
                        }
                    </div>
                    <Link className={classNames("text-decoration-none font-weight-bold ", feed === "NEWS_FEED" ? "text-blue" : "text-white")}
                        to={{
                            key: '',
                            pathname: "/nachrichten/" + props.news.id + "/",
                            state: locationState
                        }}
                         >
                        {isVideoExposed && headline && headline?.length > 60 ? headline.slice(0, 57) + "..." : headline}
                    </Link>
                </div>
                <div className={classNames("news-story-content pt-1", isVideoExposed && "video-story-text")}>
                    <div className="news-story-text stock-info-small-row mt-2 text-gray-dark">
                        {!isVideoExposed && <Interweave transform={removeImagesAndFigures} content={teaser} />}
                        {instruments != null && instruments?.length > 0 && instruments[0].group != null && instruments[0].group.name != null && instruments[0].group != null
                            && instruments[0].group.assetGroup && instruments[0].group.seoTag &&
                            <NewsItemInstrumentInfo
                                snapQuote={instruments[0]?.group?.main?.snapQuote}
                                url={getFinanztreffAssetLink(instruments[0].group.assetGroup as string, instruments[0].group?.seoTag as string)}
                                instruments={instruments}
                                isHomePage={props.isHomePage}
                            />
                        }
                    </div>
                </div>
                {isVideoExposed && props.showModalButton &&
                    <Row className='mx-sm-0 pt-2 mt-1 px-xs-2 px-md-0'>
                        <NewsGridModal feed={feed ? feed : undefined} topic={props.topic} title={"Weitere Videos - " + props.topic?.name} />
                    </Row>
                }
            </div>
        </>
    );
}

export interface NewsItemProps {
    searchCriteria?: NewsCriteria
    loading?: boolean
    isHomePage?: boolean
    news: News;
    topic?: NewsTopic,
    setSearchLabels?: (value?: string) => void
    clearTopics?: (val?: any) => void
    setSearchTopic?: (val?: any) => void
    newsItems?: News[]
    loadMoreNews?: () => void;
    newsPageLoader?: boolean;
    showModalButton?: boolean;
    ivwCodeIdentifier: string
}

export default NewsItem;
