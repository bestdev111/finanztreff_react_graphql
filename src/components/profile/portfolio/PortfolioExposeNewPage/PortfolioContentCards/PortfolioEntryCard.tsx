import classNames from "classnames";
import { CarouselWrapper } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { MetricsViewCard } from "components/profile/common/CommonComponents/MetricsViewCard";
import { NewsFeedViewCard } from "components/profile/common/CommonComponents/NewsFeedViewCard";
import { InstrumentLimits } from "components/profile/common/InstrumentLimits/InstrumentLimits";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { totalPortfolioList, getAssetGroup, calculatePortfolioEntry } from "components/profile/utils";
import { PortfolioEntry, Portfolio, LimitEntry, QuoteType, UserProfile } from "graphql/types";
import moment from "moment";
import { useState, useEffect } from "react";
import { Col, Carousel, Button } from "react-bootstrap";
import { MainSeetingsModal } from "../../../modals/MainSettingsModals/MainSettingsModal";
import { ChartViewCard } from "../CardViews/ChartViewCard";
import { PerformanceViewCard } from "../CardViews/PerformanceViewCard";
import { PortfolioViewCard } from "../CardViews/PortfolioViewCard";
import {guessInfonlineSection, trigInfonline} from "../../../../common/InfonlineService";
import { propTypes } from "react-bootstrap/esm/Image";

export function PortfolioEntryCard({ profile, entry, portfolioEntries, portfolio, index, limits, view, memo, refreshTrigger, realportfolio }: PortfolioCardProps) {
    let [purchasePrice, income, priceGain, totalInPortoflio] = totalPortfolioList(portfolio);
    let current = view === "Portfolio" ? 0
        : view === "Chart" ? 1
            : view === "Kennzahlen" ? 2
                : view === "PerformanceKacheln" ? 3
                    : 4;
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

    const [initial, yesterday, last] = calculatePortfolioEntry(entry);
    const percentOfPortfolio: number = last / totalInPortoflio * 100;
    const quote = entry && entry.snapQuote && entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
    const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;
    return (
        <Col key={entry.id} className="px-xl-2 px-lg-2 px-0"> {/* key={index} ? */}
            <div className={classNames("content-wrapper p-0 d-flex flex-row justify-content-between", oldAssetNoTradding && "bg-gray-neutral")}>
                <div className="portfolio-card-width py-2">
                    <div className={"d-flex mt-n2 text-white bg-" + assetType} style={{ width: percentOfPortfolio + "%", height: "3px", bottom: "-1px" }}></div>
                    <div className="mt-2 mx-2 text-container-max-width">
                        <span className={"mr-2 asset-type-tag " + assetType}>{assetClass}</span>
                        <AssetLinkComponent size={25} instrument={entry.instrument} className="fs-18px text-truncate" />
                    </div>
                    <div >
                        <Carousel
                            activeIndex={activeIndex} onSelect={changeSlide}
                            className="portfolio-box-carousel pb-3"
                            touch={true}
                            prevIcon={<SvgImage icon="icon_direction_left_dark.svg" spanClass="move-arrow" convert={false} />}
                            nextIcon={<SvgImage icon="icon_direction_right_dark.svg" spanClass="move-arrow" convert={false} />}
                            controls={true}
                            indicators={true}
                            as={CarouselWrapper}
                            onSlid={(eventKey: number, direction: 'left' | 'right') => {
                                trigInfonline(guessInfonlineSection(), "portfolio_tile_view");
                                setActiveIndex(eventKey);
                            }}
                        >
                            <Carousel.Item key={0} className={classNames("pb-4", "")} >
                                <PortfolioViewCard portfolio={portfolio} portfolioEntry={entry} />
                            </Carousel.Item>
                            <Carousel.Item key={1} className="pb-4" >
                                <ChartViewCard portfolioEntry={entry} />
                            </Carousel.Item>
                            <Carousel.Item key={2} className="pb-4" >
                                <MetricsViewCard entry={entry} />
                            </Carousel.Item>
                            <Carousel.Item key={3} className="pb-3" >
                                <PerformanceViewCard portfolioEntry={entry} />
                            </Carousel.Item>
                            <Carousel.Item key={4} className="pb-3" >
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
                        <MainSeetingsModal
                            entries={portfolioEntries}
                            portfolio={portfolio}
                            index={index}
                            refreshTrigger={refreshTrigger}
                            realportfolio={realportfolio}
                        >
                            <span className="mt-2">
                                <SvgImage icon={"icon_menu_vertical_blue.svg"} spanClass="cursor-pointer" convert={false} width="27" />
                            </span>
                        </MainSeetingsModal>
                    </div>
                    <div>
                        <Button variant="link" className="px-2 mt-n2 mb-n2" disabled={entry.memo === "" || !entry.memo} onClick={() => setShowMemo(!showMemo)}>
                            <SvgImage icon={"icon_note.svg"} convert={false} width="28" />
                        </Button>
                        {entry.instrumentId && entry.instrumentGroupId &&
                            <div className="ml-n2">
                                <InstrumentLimits
                                    profile={profile}
                                    instrumentGroupId={entry.instrumentGroupId}
                                    instrumentId={entry.instrumentId}
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

interface PortfolioCardProps {
    profile: UserProfile;
    entry: PortfolioEntry;
    portfolioEntries: PortfolioEntry[];
    portfolio: Portfolio;
    index: number;
    limits: LimitEntry[];
    refreshTrigger: () => void;
    view: string;
    memo: boolean;
    realportfolio?: boolean;
}
