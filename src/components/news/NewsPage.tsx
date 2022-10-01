import { useEffect, useState } from 'react'
import { useQuery } from "@apollo/client";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { loader } from "graphql.macro";
import 'react-datepicker/dist/react-datepicker.css'
import './NewsPage.scss';
import {NewsCriteria, NewsFeed, Query} from "../../generated/graphql";
import moment from 'moment'
import {Helmet} from "react-helmet";

import {
    TopicAndFeedSelectEvent,
    TopicAndFeedSelectorComponent
} from "./TopicAndFeedSelectorComponent/TopicAndFeedSelectorComponent";
import {
    PeriodSelectEvent,
    PeriodSelectorComponent,
    PredefinedPeriod
} from "./PeriodSelectorComponent/PeriodSelectorComponent";
import { TextFilterComponent } from "../layout/filter/TextFilterComponent/TextFilterComponent";
import NewsContent from "./NewsContent";
import { useLocation } from "react-router-dom";
import {guessInfonlineSection, trigInfonline} from "../common/InfonlineService";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from 'components/common/TargetingService';
import keycloak from 'keycloak';
import { NewsModal } from 'components/common/news/NewsModal/NewsModal';

interface NewsPageState {
    predefinedPeriod?: PredefinedPeriod;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    searchString?: string;
    topic?: string;
    feed?: string;
}

const NewsPage = () => {
    const location: any = useLocation();
    const NEWS_PAGE_SIZE: number = 18;
    const [state, setState] = useState<NewsPageState>({});
    let clearFilter: boolean = !state.startDate && !state.endDate && !state.topic && !state.feed && !state.searchString;
    const [searchLabels, setSearchLabels] = useState((location?.state && (location?.state?.showValueInDropdown === false)) ? location?.state.keyword : '')
    const [searchTopic, setSearchTopic] = useState((location?.state && (location?.state?.showValueInDropdown === true)) ? location?.state.keyword : '')
    const [newsSource, setNewsSource] = useState((location?.state && (location?.state?.showValueInDropdown === true)) ? location?.state.keyword : '')
    let [loadingMore, setLoadingMore] = useState(false);
    let {loading, data, fetchMore } = useQuery<Query>(
        loader('./getNewsFeed.graphql'),
        {
            variables: {
                first: NEWS_PAGE_SIZE, after: null, searchString: state.searchString ? state.searchString.toUpperCase() : undefined,
                intervalStart: state.startDate ? state.startDate.toISOString(true) : undefined,
                intervalEnd: state.endDate ? state.endDate.toISOString(true) : undefined,
                topics: state.topic ? [state.topic] : undefined,
                source: state.feed ? [state.feed] : (clearFilter ?  ['COMPACT_FEED', 'RSS_FEED', 'TOP_FEED', 'VIDEO_FEED'] : undefined)
            }
        }
    );

    useEffect(() => {
        if (location.state && location.state.showValueInDropdown === false) {
            setState({ ...state, searchString: location.state.keyword })
            setSearchLabels( location?.state.keyword || '')
        }
    }, [location, setSearchLabels ])

    useEffect(() => {
        if (searchTopic) {
            setState({ ...state, topic: searchTopic.id })
            setSearchTopic( location?.state.keyword || '' )
        }
    }, [setSearchTopic, location])

    useEffect(() => {
        if (location?.state?.keyword?.id === NewsFeed.VideoFeed){
            setState({...state, feed: NewsFeed.VideoFeed})
        }
        if (location?.state?.keyword?.id === NewsFeed.EditorialFeed){
            setState({...state, feed: NewsFeed.EditorialFeed})
        }
    }, [location?.state])

    const loadMoreNews = () => {
        if (!loading && data && data.newsSearch && data.newsSearch.pageInfo) {
            const endCursor = data.newsSearch.pageInfo?.endCursor;
            setLoadingMore(true);
            fetchMore && fetchMore({ variables: { after: endCursor } }).finally(() => setLoadingMore(false));
        }
    }

    useEffect(() => {
        if(!location.state) {
            trigInfonline(guessInfonlineSection(), "news_page")
        }
    }, [])

    const searchCriteria : NewsCriteria = {searchString: state.searchString ? state.searchString.toUpperCase() : undefined,
        intervalStart: state.startDate ? state.startDate.toISOString(true) : undefined,
        intervalEnd: state.endDate ? state.endDate.toISOString(true) : undefined,
        topic: state.topic ? [state.topic ] : undefined,
        source: state.feed ? [state.feed] : (clearFilter ?  ['COMPACT_FEED', 'RSS_FEED', 'TOP_FEED', 'VIDEO_FEED'] : undefined)};
    return (
        <div className="page-container news-page-wrapper">
            <Helmet>
                <title>finanztreff.de - News | Übersicht | News Suche nach Themen und Quellen</title>
                <meta name="description"
                      content= "News im Überblick: Lesen Sie jeden Tag aktuelle News ✔ von den Finanzmärkten, Marktberichte & Wirtschaftsnachrichten ➨ auf finanztreff.de topaktuell und kostenlos!"/>
                <meta name="keywords"
                      content="Börsennachrichten, Börsennews, Finanznachrichten, Wirtschaft News, Nachrichten, Dax, Börse News heute, Analysen, News aktuell, Finanzmärkte heute"/>
                <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            <Container className="page-header px-1 py-2">
                
                                <NewsModal />
                <Row>
                    <Col>
                        <Container>
                            <Breadcrumb>
                                <Breadcrumb.Item href="#">News</Breadcrumb.Item>
                                <Breadcrumb.Item href="#">Newssuche</Breadcrumb.Item>
                            </Breadcrumb>
                            <h1 className="font-weight-bold news-page-heading text-light">Nachrichten</h1>
                            <Row>
                                <Col xl={6} md={12} xs={12} className="px-2">
                                    <TextFilterComponent
                                        searchTopic={searchTopic}
                                        title={"Suchbegriff"}
                                        label={searchLabels}
                                        onSelect={(ev) => setState({ ...state, searchString: ev.text ? ev.text : searchLabels ? searchLabels : '' })}
                                    />
                                </Col>
                                <Col xl={3} md={6} xs={12} className="px-2">
                                    <PeriodSelectorComponent
                                        onSelect={(ev: PeriodSelectEvent) => setState({ ...state, startDate: ev.startDate, endDate: ev.endDate })} />
                                </Col>
                                <Col xl={3} md={6} xs={12} className="px-2">
                                    <TopicAndFeedSelectorComponent
                                        setNewsSource={setNewsSource}
                                        newsSource={newsSource}
                                        setSearchTopic={setSearchTopic}
                                        searchTopic={searchTopic || location?.state?.keyword}
                                        label={searchLabels}
                                        onSelect={(ev: TopicAndFeedSelectEvent) => {
                                            setState({ ...state, topic: ev.topic, feed: ev.feed })
                                        }} />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <NewsContent
                searchCriteria={searchCriteria}
                newsPageLoader={loadingMore}
                setSearchTopic={setSearchTopic}
                clearTopics={setState}
                setSearchLabels={setSearchLabels}
                newsData={data}
                clearFilter={clearFilter}
                loadMoreNews={loadMoreNews}
                loading={loading}
                setNewsSource={setNewsSource}
            />
        </div>
    );
}

export default NewsPage;
