import classNames from "classnames";
import { CarouselWrapper } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { AnalysesTitle } from "components/profile/common/CommonComponents/NewsAndAnalysesComponent/AnalysesTitle";
import { NewsTitle } from "components/profile/common/CommonComponents/NewsAndAnalysesComponent/NewsTitle";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { WatchlistSettings } from "components/profile/modals/PortfolioWatchlistSettings/WatchlistSettings";
import { Watchlist } from "graphql/types";
import { useState } from "react";
import { Col, Carousel, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChartViewCard } from "./WatchlistCardViews/ChartViewCard";

export function WatchlistCard({ watchlist, index, showMemo, refreshTrigger }: WatchlistCardProps) {
    const [state, setState] = useState<{ globalShowMemo: boolean, localShowMemo: boolean }>({ globalShowMemo: showMemo, localShowMemo: false });
    if (state.globalShowMemo !== showMemo) {
        setState({ globalShowMemo: showMemo, localShowMemo: showMemo });
    }

    let listIsins: string[] = [];
    watchlist.entries?.map(entry => entry && entry.instrument && !!entry.instrument.isin && listIsins.push(entry.instrument.isin));

    const notificationShow = watchlist.eom || watchlist.wd1 || watchlist.wd2 || watchlist.wd3 || watchlist.wd4
        || watchlist.wd5 || watchlist.wd6 || watchlist.wd7;

    return (
        <Col key={index} className="px-xl-2 px-lg-2 px-0">
            <div className="content-wrapper p-0 d-flex flex-row justify-content-between watchlist-card-height">
                <div className="watchlist-card-width py-2">
                    <div className="mx-2 text-container-max-width font-weight-bold fs-18px">
                        {notificationShow &&
                            < img src={process.env.PUBLIC_URL + "/static/img/svg/icon_envelope_filled_dark.svg"} width="20" alt="" className="pb-1" />
                        }
                        <Link to={{pathname: `/mein-finanztreff/watchlist/${watchlist.id}`, state: "scrollToTop"}}>{watchlist.name}</Link>
                    </div>
                    <div style={{ height: "208px" }}>
                        {watchlist.entries && watchlist.entries.filter(entry => !!entry.instrument).length > 0 &&
                            <Carousel
                                className="portfolio-box-carousel pb-3"
                                touch={true}
                                prevIcon={<SvgImage icon="icon_direction_left_dark.svg" spanClass="move-arrow" convert={false} />}
                                nextIcon={<SvgImage icon="icon_direction_right_dark.svg" spanClass="move-arrow" convert={false} />}
                                controls={true}
                                indicators={true}
                                as={CarouselWrapper}
                            >
                                <Carousel.Item key={0} className={classNames("pb-4")} >
                                    <ChartViewCard watchlist={watchlist} refreshTrigger={refreshTrigger} />
                                </Carousel.Item>
                                <Carousel.Item key={1} className="pb-4" >
                                    <div className="mx-2">
                                        <div className="d-flex justify-content-center text-center news-item-carousel">
                                            <NewsTitle isins={listIsins} />
                                            <AnalysesTitle isins={listIsins} />
                                        </div>
                                    </div>
                                </Carousel.Item>
                            </Carousel>
                        }
                    </div>
                    <div className="text-right pr-2">
                        <Link to={{pathname: `/mein-finanztreff/watchlist/${watchlist.id}`, state: "scrollToTop"}}><button className="btn btn-primary">Zur Watchlist</button></Link>
                    </div>
                    {state.localShowMemo && watchlist.memo && watchlist.memo !== "" &&
                        <div className="py-1 d-flex pl-2">
                            <span className="svg-icon">
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                            </span>
                            <span className="pl-2" ><i>{watchlist.memo}</i></span>
                        </div>
                    }
                </div>
                <div className="action-wrapper d-flex flex-column justify-content-between">
                    <WatchlistSettings watchlist={watchlist} onComplete={refreshTrigger} className="top d-flex justify-content-center d-none">
                        <span className="mt-2 ml-n2">
                            <SvgImage icon={"icon_menu_vertical_blue.svg"} spanClass="cursor-pointer" convert={false} width="27" />
                        </span>
                    </WatchlistSettings>
                    <div className="bottom">
                        <Button variant="link" className="px-2 mt-n2" disabled={watchlist.memo === "" || !watchlist.memo} onClick={() => setState({ ...state, localShowMemo: !state.localShowMemo })}>
                            <SvgImage icon={"icon_note.svg"} convert={false} width="28" />
                        </Button>
                        <NewsModalMeinFinanztreff isins={listIsins} iconWidth={27} className="my-2 ml-2" />
                    </div>
                </div>
            </div>
        </Col>
    );
}

interface WatchlistCardProps {
    watchlist: Watchlist
    index: number
    refreshTrigger: () => void
    showMemo: boolean
}
