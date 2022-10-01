import {NewsFeed, NewsSource, NewsTopic, Query} from "../../../generated/graphql";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {PageHeaderFilterComponent} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import React, {useCallback, useContext, useEffect, useState} from "react";
import PageHeaderFilterContext from "../../layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import {Button, Card, Spinner} from "react-bootstrap";
import {usePageHeaderFilterState} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import {useLocation} from "react-router-dom";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface TopicAndFeedSelectorComponentProps {
    onSelect?: (ev: TopicAndFeedSelectEvent) => void;
    label: string | undefined
    searchTopic: NewsTopic | undefined
    setSearchTopic?: (val?: NewsTopic | undefined) => void
    newsSource?: NewsSource | undefined
    setNewsSource?: (val: NewsSource | undefined) => void
}

interface TopicAndFeedSelectorComponentState {
    description?: string;
    topic?: NewsTopic;
    feed?: NewsSource;
}

export interface TopicAndFeedSelectEvent {
    topic?: string;
    feed?: string;
}

function calculateTopicAndFeedDescription(topic?: NewsTopic, feed?: NewsSource) {
    let description: string = '';
    if (topic) {
        description = description + topic.name;
        if (feed) {
            description = description + ', ';
        }
    }
    if (feed) {
        description = description + feed.name;
    }
    return description;
}


interface TopicAndFeedSelectorContentComponentProps {
    onSelect?: (ev: TopicAndFeedSelectorContent) => void;
    searchTopic: NewsTopic | undefined
    setSearchTopic?: (val?: NewsTopic | undefined) => void
    newsSource?: NewsSource | undefined
    setNewsSource?: (val: NewsSource | undefined) => void
}

interface TopicAndFeedSelectorContent {
    topic?: NewsTopic;
    feed?: NewsSource;
}

function TopicAndFeedSelectorContentComponent(props: TopicAndFeedSelectorContentComponentProps) {
    const location: any = useLocation();
    const {loading: topicsLoading, data: topicsData} = useQuery<Query>(loader('./getNewsTopics.graphql'))
    const {loading: feedLoading, data: feedData} = useQuery<Query>(loader('./getNewsSource.graphql'))
    let [state, setState] = usePageHeaderFilterState<TopicAndFeedSelectorComponentState>({});
    let context  = useContext(PageHeaderFilterContext);
    let closeDropDown = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    function notifyListeners(topic?: NewsTopic, feed?: NewsSource) {
        if (props.onSelect) {
            props.onSelect({topic: topic || undefined, feed: feed || undefined});
        }
    }

    function handleClassNameValueChange(currentTopic: NewsTopic): string | undefined {
        if (currentTopic.id === state.topic?.id){
            props.setSearchTopic && props.setSearchTopic(props?.searchTopic)
            return "active";
        }
        if (currentTopic.id === state.topic?.id){
            return "active";
        }
        return "";
    }

    useEffect(()=>{
        if(props.searchTopic?.id){
            setState({...state,topic:props.searchTopic,description:props.searchTopic?.name as string | undefined})
        }
    }, [props?.searchTopic?.id])

    useEffect(()=>{
        if(location?.state?.keyword?.id === NewsFeed.VideoFeed){
            setState({...state,feed:props.newsSource,description:props.newsSource?.name as string | undefined})
        }
        if(location?.state?.keyword?.id === NewsFeed.EditorialFeed){
            setState({...state,feed:props.newsSource,description:props.newsSource?.name as string | undefined})
        }
    }, [location?.state])

    return (
        <Card className="other-selector-card py-2 border-0">
            <Card.Body className="px-3 py-2">
                <div className="drop-inn2-all">
                    <Button variant={'inline-contrast'}
                            onClick={() => {
                                trigInfonline(guessInfonlineSection(), "news_search");
                                setState({...state, topic: undefined, feed: undefined, description: ''});
                                notifyListeners();
                                closeDropDown();
                            }}
                            className={(!state.feed && !state.topic ? 'active' : undefined)}>
                        Alle
                    </Button>
                </div>
                <div className="d-flex flex-wrap">
                    <h3 className={"font-weight-bold font-size-22px w-100"}>Thema</h3>
                    <div className="d-flex flex-wrap">
                        {topicsLoading ? <Spinner animation={'border'}/> :
                            <>
                                {topicsData?.newsTopics?.map((topic: NewsTopic) =>
                                    <Button variant={'inline-contrast'}
                                            key={topic.id}
                                            id={'topic' + topic.id}
                                            // className={props.searchTopic ? props.searchTopic.id === topic.id ? 'active' : undefined : state.topic?.id === topic.id ? 'active' : undefined}
                                            className={handleClassNameValueChange(topic)}
                                            onClick={() => {
                                                trigInfonline(guessInfonlineSection(), "news_search");
                                                let finalTopic: NewsTopic | undefined = state.topic === topic ? undefined : (topic || undefined);
                                                setState({
                                                    ...state,
                                                    topic: finalTopic,
                                                    description: calculateTopicAndFeedDescription(finalTopic, state.feed)
                                                });
                                                notifyListeners(finalTopic, state.feed);
                                                closeDropDown();
                                            }}>
                                        {topic.name}
                                    </Button>
                                )}
                            </>
                        }
                    </div>
                </div>
                <div className="d-flex flex-wrap">
                    <h3 className={"font-weight-bold 14px font-size-22px w-100"}>Quelle</h3>
                    <div className="d-flex flex-wrap">
                        {feedLoading ? <Spinner animation={'border'}/> :
                            <>
                                {feedData?.newsSource?.map((feed: NewsSource) => (
                                    <Button variant={'inline-contrast'}
                                            key={feed.id}
                                            className={state.feed?.id === feed.id ? 'active' : undefined}
                                            onClick={() => {
                                                trigInfonline(guessInfonlineSection(), "news_search");
                                                let finalFeed: NewsSource | undefined = state.feed === feed ? undefined : (feed || undefined);
                                                setState({
                                                    ...state,
                                                    feed: finalFeed,
                                                    description: calculateTopicAndFeedDescription(state.topic, finalFeed)
                                                });
                                                notifyListeners(state.topic, finalFeed);
                                                closeDropDown();
                                            }}>
                                        {feed.name}
                                    </Button>
                                ))}
                            </>
                        }
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

interface TopicAndFeedSelectorComponentState {
    description?: string;
}

export function TopicAndFeedSelectorComponent(props: TopicAndFeedSelectorComponentProps) {
    let [state, setState] = useState<TopicAndFeedSelectorComponentState>({description: ''});
    useEffect(() => {
        if (props.label !== ""){
            setState({...state, topic: undefined, feed: undefined, description: ''});
        }
    }, [props.label])

    useEffect(() => {
        if (props.searchTopic){
            setState({...state, description: props.searchTopic.name as string | undefined})
        }
        props.onSelect && props?.onSelect({topic: props.searchTopic?.id as string | undefined})
    }, [props.searchTopic])

    useEffect(() => {
        if (props.newsSource){
            setState({...state, description: props.newsSource.name as string | undefined})
        }
        props.onSelect && props?.onSelect({topic: props.newsSource?.id as string | undefined})
    }, [props.newsSource])

    return (
        <PageHeaderFilterComponent title={"Themen & Quellen"} description={state.description} variant={"other-selector"}>
            <TopicAndFeedSelectorContentComponent newsSource={props.newsSource} setNewsSource={props.setNewsSource} setSearchTopic={props.setSearchTopic} searchTopic={props.searchTopic} onSelect={(ev) => {
                setState({description: calculateTopicAndFeedDescription(ev.topic, ev.feed)});
                if (props.onSelect) {
                    props.onSelect({topic: ev.topic?.id || undefined, feed: ev.feed?.id || undefined});
                }
            }}/>
        </PageHeaderFilterComponent>
    );
}
