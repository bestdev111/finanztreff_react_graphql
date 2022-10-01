import { News, NewsCriteria, Query, SearchCriteria } from "../../../../generated/graphql";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { Button, Spinner } from "react-bootstrap";
import { useRef, useState } from "react";
import SvgImage from "../../image/SvgImage";
import { NavLink } from "react-router-dom";
import { useBootstrapBreakpoint } from "../../../../hooks/useBootstrapBreakpoint";
import { hideIfEmpty } from "../../../../utils";
import { trigInfonline, guessInfonlineSection } from "components/common/InfonlineService";
import StackGrid from "react-stack-grid";
import NewsItem from "../NewsFeedItem/NewsItem";

export interface NewsAssetPageSectionProps {
    isin?: string;
    groupName?: string;
    title?: string;
}

interface NewsAssetPageSectionState {
    loadingMore: boolean;
}
export const NewsAssetPageSection = (props: NewsAssetPageSectionProps) => {

    // const newsAssetPageSize = useBootstrapBreakpoint({
    //     xl: 11,
    //     md: 11,
    //     sm: 3,
    //     default: 3
    // })

    let { loading, data, fetchMore } = useQuery<Query>(
        loader('./getAssetNewsFeed.graphql'),
        { variables: { isin: props.isin, first: 9 }, skip: !props.isin }
    );
    let [state, setState] = useState<NewsAssetPageSectionState>({ loadingMore: false });

    const loadMoreNews = () => {
        trigInfonline(guessInfonlineSection(), "load_more_news");
        if (data?.newsSearch?.pageInfo?.endCursor) {
            const endCursor = data?.newsSearch?.pageInfo?.endCursor;
            setState({ ...state, loadingMore: true });
            if (fetchMore) {
                fetchMore({
                    variables: {
                        first: 12,
                        after: endCursor,
                    }
                }).finally(() => setState({ ...state, loadingMore: false }))
            }
        }
    }

    const searchCriteria: NewsCriteria= props.isin ? {isin: [props.isin] } : {}

    return (
        <section className="main-section mb-4">
            <div className="container px-lg-2">
                <h2 className="section-heading font-weight-bold ml-n2 ml-md-2"> {props.title ? props.title : ("Aktuelle Finanznachrichten - " + props.groupName)}</h2>
                {loading ?
                    <div className="text-center py-2">
                        <Spinner animation="border" />
                    </div>
                    :
                    data && data.newsSearch && data.newsSearch.edges && data.newsSearch.edges.length > 0 ?
                        <>
                            <NewsGridComponent searchCriteria={searchCriteria} news={data.newsSearch.edges.map(current => current.node) || []} />
                            <div className="text-center">
                                <Button variant="link text-blue" onClick={loadMoreNews}>
                                    {!state.loadingMore && data.newsSearch.pageInfo && data.newsSearch.pageInfo.hasNextPage ?
                                        <>
                                            Mehr anzeigen
                                            <SvgImage spanClass="top-move" convert={false} width={"27"}
                                                icon="icon_direction_down_blue_light.svg"
                                                imgClass="svg-primary" />
                                        </>
                                        :
                                        <div className="text-center py-2">
                                            <Spinner animation="border" />
                                        </div>
                                    }
                                </Button>
                                <NavLink to="/nachrichten/" onClick={() => trigInfonline(guessInfonlineSection(), 'show_all_news')}>
                                    <Button className="float-md-right text-md-right px-md-2 mr-md-2 mt-md-1 d-md-block d-sm-none">Alle News</Button>
                                </NavLink>
                            </div>
                            <div className="text-right px-2 d-sm-block d-md-none">
                                <NavLink to="/nachrichten/" onClick={() => trigInfonline(guessInfonlineSection(), 'show_all_news')}>
                                    <Button className="float-md-right">Alle News</Button>
                                </NavLink>
                            </div>
                        </>
                        :
                        <h5 className="d-flex justify-content-center mt-30px">Keine Nachrichten gefunden!</h5>
                }
            </div>

        </section>
    );
}



interface NewsGridComponentProps {
    news: News[];
    searchCriteria?: SearchCriteria
}

export const NewsGridComponent = (props: NewsGridComponentProps) => {
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

    return (
        <StackGrid columnWidth={columnWidth} monitorImagesLoaded={true} duration={0} gridRef={updateGridLayout} >
            {props.news.map((current) => <NewsItem searchCriteria={props.searchCriteria} ivwCodeIdentifier={"news_modal"} newsItems={props.news} key={current.id} news={current}/>)}
        </StackGrid>
    );
}
