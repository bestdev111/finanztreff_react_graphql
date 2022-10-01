import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Row, Spinner } from "react-bootstrap";
import Interweave from "interweave";
import { fullDateTimeFormat, getFinanztreffAssetLink, Instrument_Names, newsReadingTime, removeImagesAndFigures, topicLabels } from "../../../../utils";
import { News, NewsConnection, NewsCriteria, NewsInstrument, NewsTopic, Query } from "../../../../generated/graphql";
import './NewsModal.scss'
import { NewsMediaComponent } from '../NewsMediaComponent/NewsMediaComponent'
import SvgImage from "../../image/SvgImage";
import { InstrumentInfo } from "../NewsInstrumentInfo/InstrumentInfo";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { useSwipeable } from "../../swiper";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";

export function NewsModal() {
    const location = useLocation<NewsModalProperties>();
    const history = useHistory();
    const pathParam = useParams<{ id: string }>();

    let { data: singleNewsData } = useQuery<Query>(
        loader('./getCurrentNews.graphql'),
        { variables: { id: pathParam.id }, skip: !!location.state || !pathParam.id }
    );

    let { loading, data, fetchMore } = useQuery<Query>(
        loader('./getNewsGridModal.graphql'),
        { variables: { first: 9, criteria: location.state && location.state.searchCriteria }, skip: history.location.state === undefined || !pathParam.id }
    );

    return (
        <>
            {data && pathParam.id &&
                <ExportBody fetchMore={fetchMore} newsConnection={data?.newsSearch} loading={loading} />
            }
            {singleNewsData && singleNewsData.news && pathParam.id &&
                <ExportSingleNewsBody news={singleNewsData.news} />
            }
        </>
    );
}

function ExportBody({ fetchMore, newsConnection, loading }: { fetchMore: any, newsConnection: NewsConnection, loading: boolean }) {
    const location = useLocation<NewsModalProperties>();
    const history = useHistory();
    const closeModal = () => {
        if (location.state.pathname) {
            history.push({
                pathname: location.state.pathname,
            })
        }
        else history.push({ pathname: "/nachrichten/" })
    };

    const getCurrentIndex = (): number => {
        let currentIndex = -1;
        newsConnection.edges.map(current => current.node).map((current, index) => {
            if (current.id === location.state.news.id) {
                currentIndex = index
            }
            return;
        })
        return currentIndex;
    }

    function changeLocationState(currentNews: News) {
        let currentLocationState: NewsModalProperties = {
            ...location.state,
            news: currentNews
        };
        location.state = currentLocationState;
    }

    let [loadingMore, setLoadingMore] = useState(false);
    const [lenght, setLenght] = useState(newsConnection.edges.length)

    let { headline, source, when, body, instruments, keywords, id, streams, links } = location.state.news;
    let newsAdvertisment = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        let refreshAdsScript = document.createElement('script');
        refreshAdsScript.type = 'text/javascript';
        refreshAdsScript.text = `Ads_BA_refresh();`;
        refreshAdsScript.id = 'refresh-script'
        if (newsAdvertisment.current !== null) {
            let elementScriptNews = document.createElement('script');
            elementScriptNews.type = 'text/javascript';
            elementScriptNews.text = `Ads_BA_AD('MR1')`;

            if (newsAdvertisment.current !== null && newsAdvertisment.current.hasChildNodes()) {
                newsAdvertisment.current.innerHTML = '';
            }
            if (newsAdvertisment.current !== null && !newsAdvertisment.current.hasChildNodes()) {
                newsAdvertisment.current.appendChild(elementScriptNews);
                if (document.getElementById('refresh-script') !== null) {
                    document.getElementById('refresh-script')?.remove();
                }
                if (document.getElementById('refresh-script') === null) {
                    document.head.appendChild(refreshAdsScript);
                }
            }
        }
    }, [newsAdvertisment])

    const getNextNews = () => {
        let currIdx: number = getCurrentIndex();
        let nextIdx: number = currIdx + 1;
        if (nextIdx === (newsConnection.edges.map(current => current.node) || []).length) {
            setLoadingMore(true);
            if (!loading && newsConnection.pageInfo?.endCursor && newsConnection.pageInfo?.hasNextPage) {
                fetchMore({
                    variables: {
                        first: 9,
                        after: newsConnection.pageInfo?.endCursor,
                    }
                }).finally(() => {
                    if (loading === false) {
                        setLoadingMore(false);
                    }
                })
            }
        } else {
            let nextNewsItem: News | undefined = newsConnection.edges.map(current => current.node) && newsConnection.edges.map(current => current.node)[nextIdx as number];
            changeLocationState(nextNewsItem);
            nextNewsItem && history.push({
                pathname: '/nachrichten/' + nextNewsItem.id + "/",
                state: location.state,
            })
        }
    }

    if (lenght !== newsConnection.edges.length) {
        setLenght(newsConnection.edges.length);
        getNextNews();
    }

    const getPreviousNews = () => {
        let currIdx: number = getCurrentIndex();
        let prevIdx: undefined | number = currIdx && currIdx - 1;
        let prevNewsItem: News | undefined = newsConnection.edges.map(current => current.node) && newsConnection.edges.map(current => current.node)[prevIdx as number];
        changeLocationState(prevNewsItem);
        prevNewsItem && history.push({
            pathname: '/nachrichten/' + prevNewsItem.id + "/",
            state: location.state
        })
    }

    const handlersLeftSwipe = useSwipeable({ onSwipedLeft: () => newsConnection.edges.map(current => current.node).length && getCurrentIndex() < newsConnection.edges.map(current => current.node).length && getNextNews() })
    const handlersRightSwipe = useSwipeable({ onSwipedRight: () => getPreviousNews() })
    const ref: React.MutableRefObject<null> = useRef(null);

    const refPassThrough = (el: any) => {
        handlersLeftSwipe.ref(el);
        handlersRightSwipe.ref(el);
        ref.current = el;
    }
    let transformHeadline = headline?.replace(/\u00a0/g, " ");
    let transformContent = body?.replace(/(\r\n|\r|\n)/g, '<br>');

    function triggerivw() {
        if (location.state.news.feed === 'VIDEO_FEED') {
            trigInfonline(guessInfonlineSection(), "video_modal")
        } else {
            trigInfonline(guessInfonlineSection(), "news_modal")
        }
    }
    return (
        <Modal
            show={true}
            onHide={closeModal}
            dialogClassName="news-detail-modal news-item-modal-wrapper"
            style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
            className="news-modal modal-dialog-sky-placement"
        >
            <div className={"d-flex bg-white"}>
                <div className={"next-news-button cursor-pointer pl-xl-2"} onClick={() => getPreviousNews()}><div className={"mr-xl-3 px-xl-0"} />
                    {getCurrentIndex() > 0 && <div className={"btn px-xl-0 mr-xl-2 d-xl-block d-none next-news-button"}>
                   <div onClick={triggerivw}> <SvgImage  icon={"icon_direction_left_dark_big.svg"} /></div>
                    </div>}
                </div>
                <div>
                    <Modal.Header className='border-0'>
                        <Row className="row-cols-1 " style={{ height: "28px" }}>
                            <div className="col d-flex mt-xl-1 justify-content-between mt-n3 mt-md-0">
                                <Modal.Title className={"pl-xl-1 ml-xl-n4 ml-n3 pl-1 ml-md-n1 pl-md-0"}>
                                    <h5>
                                        <SvgImage icon="icon_news.svg" spanClass="icon-news top-move" width="1.25rem"
                                            convert={false}
                                            imgClass="svg-gray-dark mr-1" />
                                        <span>Nachrichten</span>
                                    </h5>
                                </Modal.Title>
                                <button style={{ position: 'relative' }} type="button" className="close text-blue mr-md-n2 mr-xl-n4 neg-margin" onClick={closeModal}>
                                    <span>schließen</span>
                                    <SvgImage imgClass={"mx-xl-n1"} icon="icon_close_blue.svg" spanClass="close-modal-butt" width={"27"} />
                                </button>
                            </div>
                        </Row>
                    </Modal.Header>
                    <div style={{ backgroundColor: "#fff" }} {...handlersLeftSwipe} ref={refPassThrough}>
                        <Modal.Body onClick={triggerivw}>
                            <div className={" d-xl-block"} style={{ minHeight: "29px" }}>
                                {location.state.news.medias && <NewsMediaComponent news={location.state.news} className="big-image-wrap" medias={location.state.news.medias} inModal={true} streams={streams || []} />}
                            </div>
                            <div >
                                <h1 className="media-title media-title-news mt-xl-4 roboto-heading font-weight-bold d-sm-none d-md-block" style={{ fontSize: "41px" }}>{transformHeadline}</h1>
                                <h1 className="media-title media-title-news mt-xl-4 roboto-heading font-weight-bold d-md-none" style={{ fontSize: "24px" }}>{transformHeadline}</h1>
                            </div>
                            <span className="news-resume mb-xl-1" >{fullDateTimeFormat(when)} | Quelle: {source?.name} | Lesedauer etwa {newsReadingTime(body)} min.</span>
                            {
                                newsAdvertisment &&
                                <div style={{ textAlign: 'center' }}>
                                    <div id='Ads_BA_MR1' ref={newsAdvertisment}></div>
                                </div>
                            }
                            <div className={"d-flex"}>
                                <div className={"mt-xl-3 mt-md-3"}>
                                    <Interweave transform={node => {
                                        // @ts-ignore
                                        return transformBody(node, instruments);
                                    }} content={transformContent} onBeforeParse={fixBody} />

                                </div>
                            </div>
                            {
                                links && links.length > 0 && links[0] && links[0].href &&
                                <a className="d-flex justify-content-end text-blue mb-2" href={links[0].href} target="_blank" rel="nofollow">Hier zum vollständigen Artikel</a>
                            }
                        </Modal.Body>

                        {(keywords?.length != undefined && keywords?.length != 0) &&
                            <div className="d-flex flex-wrap">
                                <h4 className={"font-weight-bold font-size-14px w-100 ml-3 "} style={{ marginTop: '45px', marginBottom: '-10px' }}>Schlagworte:</h4>
                                {keywords && keywords.map((keyword: string) => (
                                    <div className="d-flex flex-wrap">
                                        <Button variant={'inline-contrast font-size-13px pt-0'} style={{ margin: '16px', marginBottom: '-4px', height: '19px', marginRight: '-2px' }}
                                            onClick={() => {
                                                history.push({
                                                    pathname: '/nachrichten/',
                                                    state: {
                                                        keyword: keyword,
                                                        showValueInDropdown: false
                                                    }
                                                })
                                            }}>
                                            {keyword}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        }

                        <div className="d-flex flex-wrap my-4">
                            <h4 className={"font-weight-bold font-size-14px w-100 ml-3 "} style={{ marginTop: '15px', marginBottom: '-6px' }}>Weitere Nachrichten zu:</h4>
                            {Instrument_Names && Instrument_Names.map((Instrument_Names: string) => (
                                <div className="d-flex flex-wrap">
                                    <Button variant={'inline-contrast font-size-13px pt-0'} style={{ margin: '12px', marginBottom: '-4px', height: '19px', marginRight: '-2px' }}
                                        onClick={() => {
                                            history.push({
                                                pathname: '/nachrichten/',
                                                state: {
                                                    keyword: Instrument_Names,
                                                    showValueInDropdown: false
                                                }
                                            })
                                        }}>
                                        {Instrument_Names}
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex flex-wrap my-4">
                            <h4 className={"font-weight-bold font-size-14px w-100 ml-3 "} style={{ marginTop: '15px', marginBottom: '-10px' }}>Weitere Themen:</h4>
                            {topicLabels.map((topic: NewsTopic) => (
                                <div className="d-flex flex-wrap">
                                    <Button variant={'inline-contrast font-size-13px pt-0'} style={{ margin: '16px', marginBottom: '-4px', height: '19px', marginRight: '-2px' }}
                                        onClick={() => {
                                            history.push({
                                                pathname: '/nachrichten/',
                                                state: {
                                                    keyword: topic,
                                                    showValueInDropdown: true
                                                }
                                            })
                                        }}>
                                        {topic.name}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={"next-news-button cursor-pointer pr-xl-2"} onClick={getNextNews}>
                    {<div className={"btn px-xl-0 ml-xl-2 d-xl-block d-none next-news-button"}>
                        {loadingMore === true ? <Spinner className={"text-center"} animation="border" /> :
                            newsConnection.pageInfo?.hasNextPage && <div onClick={triggerivw}> <SvgImage  icon={"icon_direction_right_dark_big.svg"} /></div>
                        }
                    </div>}
                </div>
            </div>
        </Modal>)
}

function ExportSingleNewsBody({ news }: { news: News }) {
    let { headline, source, when, body, instruments, keywords, id, streams, links } = news;
    let newsAdvertisment = useRef<HTMLDivElement | null>(null);
    const history = useHistory();

    const closeModal = () => {
        history.push({ pathname: "/nachrichten/" })
    };
    useEffect(() => {
        let refreshAdsScript = document.createElement('script');
        refreshAdsScript.type = 'text/javascript';
        refreshAdsScript.text = `Ads_BA_refresh();`;
        refreshAdsScript.id = 'refresh-script'
        if (newsAdvertisment.current !== null) {
            let elementScriptNews = document.createElement('script');
            elementScriptNews.type = 'text/javascript';
            elementScriptNews.text = `Ads_BA_AD('MR1')`;

            if (newsAdvertisment.current !== null && newsAdvertisment.current.hasChildNodes()) {
                newsAdvertisment.current.innerHTML = '';
            }
            if (newsAdvertisment.current !== null && !newsAdvertisment.current.hasChildNodes()) {
                newsAdvertisment.current.appendChild(elementScriptNews);
                if (document.getElementById('refresh-script') !== null) {
                    document.getElementById('refresh-script')?.remove();
                }
                if (document.getElementById('refresh-script') === null) {
                    document.head.appendChild(refreshAdsScript);
                }
            }
        }
    }, [newsAdvertisment]);

    let transformHeadline = headline?.replace(/\u00a0/g, " ");
    let transformContent = body?.replace(/(\r\n|\r|\n)/g, '<br>');

    return (
        <Modal
            show={true}
            onHide={closeModal}
            dialogClassName="news-detail-modal news-item-modal-wrapper"
            style={{ backgroundColor: "rgba(56, 56, 56, 0.6)" }}
            className="news-modal modal-dialog-sky-placement"
        >
            <div className={"d-flex bg-white"}>
                <div>
                    <Modal.Header className='border-0 mx-xl-3 mx-sm-1'>
                        <Row className="row-cols-1 " style={{ height: "28px" }}>
                            <div className="col d-flex mt-xl-1 justify-content-between mt-n3 mt-md-0">
                                <Modal.Title className={"pl-xl-1 ml-xl-n4 ml-n3 pl-1 ml-md-n1 pl-md-0"}>
                                    <h5>
                                        <SvgImage icon="icon_news.svg" spanClass="icon-news top-move" width="1.25rem"
                                            convert={false}
                                            imgClass="svg-gray-dark mr-1" />
                                        <span>Nachrichten</span>
                                    </h5>
                                </Modal.Title>
                                <button style={{ position: 'relative' }} type="button" className="close text-blue mr-md-n2 mr-xl-n4 neg-margin" onClick={closeModal}>
                                    <span>schließen</span>
                                    <SvgImage imgClass={"mx-xl-n1"} icon="icon_close_blue.svg" spanClass="close-modal-butt" width={"27"} />
                                </button>
                            </div>
                        </Row>
                    </Modal.Header>
                    <Modal.Body className="mx-xl-3 mx-sm-1" onClick={()=>trigInfonline(guessInfonlineSection(),'video_modal')}>
                        <div className={" d-xl-block"} style={{ minHeight: "29px" }}>
                            {news.medias && <NewsMediaComponent news={news} className="big-image-wrap" medias={news.medias} inModal={true} streams={streams || []} />}
                        </div>
                        <div >
                            <h1 className="media-title media-title-news mt-xl-4 roboto-heading font-weight-bold d-sm-none d-md-block" style={{ fontSize: "41px" }}>{transformHeadline}</h1>
                            <h1 className="media-title media-title-news mt-xl-4 roboto-heading font-weight-bold d-md-none" style={{ fontSize: "24px" }}>{transformHeadline}</h1>
                        </div>
                        <span className="news-resume mb-xl-1" >{fullDateTimeFormat(when)} | Quelle: {source?.name} | Lesedauer etwa {newsReadingTime(body)} min.</span>
                        {
                            newsAdvertisment &&
                            <div style={{ textAlign: 'center' }}>
                                <div id='Ads_BA_MR1' ref={newsAdvertisment}></div>
                            </div>
                        }
                        <div className={"d-flex"}>
                            <div className={"mt-xl-3 mt-md-3"}>
                                <Interweave transform={node => {
                                    // @ts-ignore
                                    return transformBody(node, instruments);
                                }} content={transformContent} onBeforeParse={fixBody} />

                            </div>
                        </div>
                        {
                            links && links.length > 0 && links[0] && links[0].href &&
                            <a className="d-flex justify-content-end text-blue mb-2" href={links[0].href} target="_blank" rel="nofollow">Hier zum vollständigen Artikel</a>
                        }
                    </Modal.Body>

                    {(keywords?.length != undefined && keywords?.length != 0) &&
                        <div className="d-flex flex-wrap">
                            <h4 className={"font-weight-bold font-size-14px w-100 ml-3 "} style={{ marginTop: '45px', marginBottom: '-10px' }}>Schlagworte:</h4>
                            {keywords && keywords.map((keyword: string) => (
                                <div className="d-flex flex-wrap">
                                    <Button variant={'inline-contrast font-size-13px pt-0'} style={{ margin: '16px', marginBottom: '-4px', height: '19px', marginRight: '-2px' }}
                                        onClick={() => {
                                            history.push({
                                                pathname: '/nachrichten/',
                                                state: {
                                                    keyword: keyword,
                                                    showValueInDropdown: false
                                                }
                                            })
                                        }}>
                                        {keyword}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    }

                    <div className="d-flex flex-wrap my-4">
                        <h4 className={"font-weight-bold font-size-14px w-100 ml-3 "} style={{ marginTop: '15px', marginBottom: '-6px' }}>Weitere Nachrichten zu:</h4>
                        {Instrument_Names && Instrument_Names.map((Instrument_Names: string) => (
                            <div className="d-flex flex-wrap">
                                <Button variant={'inline-contrast font-size-13px pt-0'} style={{ margin: '12px', marginBottom: '-4px', height: '19px', marginRight: '-2px' }}
                                    onClick={() => {
                                        history.push({
                                            pathname: '/nachrichten/',
                                            state: {
                                                keyword: Instrument_Names,
                                                showValueInDropdown: false
                                            }
                                        })
                                    }}>
                                    {Instrument_Names}
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex flex-wrap my-4">
                        <h4 className={"font-weight-bold font-size-14px w-100 ml-3 "} style={{ marginTop: '15px', marginBottom: '-10px' }}>Weitere Themen:</h4>
                        {topicLabels.map((topic: NewsTopic) => (
                            <div className="d-flex flex-wrap">
                                <Button variant={'inline-contrast font-size-13px pt-0'} style={{ margin: '16px', marginBottom: '-4px', height: '19px', marginRight: '-2px' }}
                                    onClick={() => {
                                        history.push({
                                            pathname: '/nachrichten/',
                                            state: {
                                                keyword: topic,
                                                showValueInDropdown: true
                                            }
                                        })
                                    }}>
                                    {topic.name}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>)
}

export interface NewsModalProperties {
    searchCriteria?: NewsCriteria
    news: News;
    pathname: any;
}

export interface LocationState {
    searchCriteria?: NewsCriteria
    news?: News;
    pathname: any;
}

function transformBody(node: HTMLElement, instruments?: NewsInstrument[]): React.ReactNode {
    if (node.tagName.match(/[A-Z0-9]{12}/)) {
        let item = instruments?.find(i => i?.group?.isin === node.tagName);
        if (item) {
            // @ts-ignore
            const { assetGroup, seoTag } = item?.group;
            return (<>
                <InstrumentInfo id={item?.group?.id} name={item?.group?.name}
                    url={assetGroup && seoTag && getFinanztreffAssetLink(assetGroup, seoTag)} />
            </>);
        } else {
            return <></>;
        }
    } else {
        return removeImagesAndFigures(node);
    }
}

export function fixBody(rawBody: string): string {
    if (!rawBody) {
        return rawBody;
    }
    return rawBody.replace(/<([A-Z0-9]{12})>/g, '<$1></$1>');
}
