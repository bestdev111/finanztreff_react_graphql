import classNames from "classnames";
import { CarouselWrapper } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { MetricsViewCard } from "components/profile/common/CommonComponents/MetricsViewCard";
import { NewsFeedViewCard } from "components/profile/common/CommonComponents/NewsFeedViewCard";
import { InstrumentLimits } from "components/profile/common/InstrumentLimits/InstrumentLimits";
import { EditWatchlistEntry } from "components/profile/modals";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { getAssetGroup } from "components/profile/utils";
import { WatchlistEntry, Watchlist, LimitEntry, QuoteType, UserProfile } from "graphql/types";
import moment from "moment";
import { useState, useEffect } from "react";
import { Col, Carousel, Button } from "react-bootstrap";
import { ChartViewCard } from "../CardViews/ChartViewCard";
import { PerformanceViewCard } from "../CardViews/PerformanceViewCard";
import {guessInfonlineSection, trigInfonline} from "../../../../common/InfonlineService";

export function WatchlistEntryCard({ profile, entry, watchlist, index, limits, view, memo, refreshTrigger }: WatchlistCardProps) {
    let current = view === "Chart" ? 0
        : view === "Kennzahlen" ? 1
            : view === "PerformanceKacheln" ? 2
                : 3;
    const [activeIndex, setActiveIndex] = useState<number>(current);
    useEffect(() => {
        setActiveIndex(current);
    }, [view]);

    const [showMemo, setShowMemo] = useState(memo);
    useEffect(() => {
        setShowMemo(memo);
    }, [memo])

    let changeSlide = (selectedIndex: number) => {
        setActiveIndex(selectedIndex);
    };

    const assetType = entry.instrument?.group.assetGroup;
    const assetClass = getAssetGroup(entry.instrument?.group.assetGroup || "");

    const quote = entry && entry.snapQuote && entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
    const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;
    
    return (
        <Col key={index} className="px-xl-2 px-lg-2 px-0">
            <div className={classNames("content-wrapper p-0 d-flex flex-row justify-content-between", oldAssetNoTradding && "bg-gray-neutral")}>
                <div className="watchlist-card-width py-2">
                    <div className="mt-2 mx-2 text-container-max-width">
                        <span className={"mr-2 asset-type-tag " + assetType}>{assetClass}</span>
                        <AssetLinkComponent size={25} instrument={entry.instrument} className="fs-18px text-truncate" />
                    </div>
                    <div >
                        <Carousel
                            activeIndex={activeIndex} onSelect={changeSlide}
                            className="watchlist-box-carousel pb-3"
                            touch={true}
                            prevIcon={<SvgImage icon="icon_direction_left_dark.svg" spanClass="move-arrow" convert={false} />}
                            nextIcon={<SvgImage icon="icon_direction_right_dark.svg" spanClass="move-arrow" convert={false} />}
                            controls={true}
                            indicators={true}
                            as={CarouselWrapper}
                            onSlid={(eventKey: number, direction: 'left' | 'right') => {
                                trigInfonline(guessInfonlineSection(), "watchlist_tile_view")
                                setActiveIndex(eventKey);
                            }}
                        >
                            <Carousel.Item key={0} className="pb-4" >
                                <ChartViewCard watchlistEntry={entry} />
                            </Carousel.Item>
                            <Carousel.Item key={1} className="pb-4" >
                                <MetricsViewCard entry={entry} />
                            </Carousel.Item>
                            <Carousel.Item key={2} className="pb-3" >
                                <PerformanceViewCard watchlistEntry={entry} />
                            </Carousel.Item>
                            <Carousel.Item key={3} className="pb-3" >
                                <NewsFeedViewCard entry={entry} />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                    {showMemo && entry.memo && entry.memo !== "" &&
                        <div className="pb-2 pt-1 mx-2">
                            <span className="svg-icon">
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                            </span>
                            <span className="pl-2" ><i>{entry.memo}</i></span>
                        </div>
                    }
                </div>
                <div className="action-wrapper d-flex flex-column justify-content-between">
                    <div>
                        <EditWatchlistEntry entry={entry} watchlist={watchlist} refreshTrigger={refreshTrigger}>
                            <span className="mt-2">
                                <SvgImage icon={"icon_menu_vertical_blue.svg"} spanClass="cursor-pointer" convert={false} width="27" />
                            </span>
                        </EditWatchlistEntry>
                    </div>
                    <div>

                        {entry.instrument && entry.instrument.id && entry.instrument.group.id &&
                            <ProfileInstrumentAddPopup
                                instrumentId={entry.instrument.id}
                                instrumentGroupId={entry.instrument.group.id}
                                name={entry.instrument.name}
                                className="p-0 ml-2 mt-n1"
                                portfolio={true}>
                                <img
                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_portfolio_plus_dark.svg"}
                                    alt="" className="portfolio-butt-icon" />
                            </ProfileInstrumentAddPopup>
                        }
                        <Button variant="link" className="px-2 mt-n2 mb-n2" disabled={entry.memo === "" || !entry.memo} onClick={() => setShowMemo(!showMemo)}>
                            <SvgImage icon={"icon_note.svg"} convert={false} width="28" />
                        </Button>
                        {entry.instrument && entry.instrument.id && entry.instrument.group.id &&
                            <div className="ml-n2">
                                <InstrumentLimits
                                    profile={profile}
                                    instrumentGroupId={entry.instrument.group.id}
                                    instrumentId={entry.instrument?.id}
                                    limits={limits}
                                    svgColor="dark"
                                    refreshTrigger={refreshTrigger}
                                />
                            </div>
                        }
                        {entry.instrument?.isin ?
                            <div className="ml-2 mb-2">
                                <NewsModalMeinFinanztreff isins={[entry.instrument.isin]} />
                            </div>
                            :
                            <Button variant="link" className="p-2 mt-n2" disabled>
                                <SvgImage icon={"icon_news.svg"} convert={false} width="26" />
                            </Button>
                        }
                    </div>
                </div>

            </div>
        </Col>
    );
}

interface WatchlistCardProps {
    profile: UserProfile;
    entry: WatchlistEntry;
    watchlistEntries: WatchlistEntry[];
    watchlist: Watchlist;
    index: number;
    limits: LimitEntry[];
    refreshTrigger: () => void;
    view: string;
    memo: boolean;
}

