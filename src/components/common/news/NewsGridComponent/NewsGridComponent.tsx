import React, {useRef} from "react";
import StackGrid from "react-stack-grid";
import NewsItem from "../NewsFeedItem/NewsItem";
import {useBootstrapBreakpoint} from "../../../../hooks/useBootstrapBreakpoint";
import {News, NewsCriteria} from "../../../../generated/graphql";
import {PaidNewsBox} from "../../PaidNewsBox";

interface NewsGridComponentProps {
    news: News[];
    loading?: boolean;
    isHomePage?: boolean;
    setSearchLabels?: (value?: string) => void
    clearTopics?: (val?: any) => void
    setSearchTopic?: (val?: any) => void
    loadMoreNews?: () => void
    newsPageLoader?: boolean;
    searchCriteria?: NewsCriteria
}

export const NewsGridComponent = (props: NewsGridComponentProps) => {
    let loaded: string[] = [];
    const columnWidth = useBootstrapBreakpoint({
        xl: '33.33%',
        lg: '50%',
        sm: '100%'
    });

    const gridRef = useRef();
    const updateGridLayout = () => {
        // @ts-ignore
        gridRef?.current?.updateLayout();
    };

    if (props.news.length === 0 && !props.loading) {
        loaded = [];
        return <h5 className= "d-flex justify-content-center mt-30px">Keine Nachrichten gefunden!</h5>
    }

    const isLoaded = (id: string) => {
        const idx = loaded.indexOf(id);
        if(idx === -1) {
            loaded.push(id);
            return false;
        } else return true;
    }

    return (
        <StackGrid columnWidth={columnWidth} monitorImagesLoaded={true} duration={0} gridRef={updateGridLayout} >
             <PaidNewsBox /> 
            {props.news.filter(value => !isLoaded(value.id)).map((value) => <NewsItem isHomePage={props.isHomePage} searchCriteria={props.searchCriteria} ivwCodeIdentifier={"news_modal"} newsPageLoader={props.newsPageLoader} loading={props.loading} loadMoreNews={props.loadMoreNews} newsItems={props.news} setSearchTopic={props.setSearchTopic} clearTopics={props.clearTopics} setSearchLabels={props.setSearchLabels} key={value.id} news={value}/>)}
        </StackGrid>
    );
}
