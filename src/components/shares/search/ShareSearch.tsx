import React, { SetStateAction, useEffect, useState } from "react";
import { Breadcrumb, Button, ButtonGroup, Carousel, CarouselItem, Col, Container, Row, Spinner } from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import './ShareSearch.scss'
import { GlobalShareSearchProps, ShareSearchCard } from "./BaseShareSearchCard";
import ShareSearchContext, { ShareSearchContextProps } from "./ShareSearchContext";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { Period, Query } from "../../../generated/graphql";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import { CarouselWrapper } from "../../common";
import { createChunk } from "../../common/utils";
import classNames from "classnames";
import MarketCapCard from "./cards/MarketCapCard";
import DividendPayoutRatioCard from "./cards/DividendPayoutRatioCard";
import UpdatingSharesCard from "./cards/UpdatingSharesCard";
import UpdatingSalesCard from "./cards/UpdatingSalesCard";
import CompaniesRisingDividendCard from "./cards/CompaniesRisingDividendCard";
import StocksRisingDividendCard from "./cards/StocksRisingDividendCard";
import CompaniesWithChangingDividendCard from "./cards/CompaniesWithChangingDividendCard";
import CompaniesIncreasingDividendCard from "./cards/CompaniesIncreasingDividendCard";
import SharesWithRisingDividendCard from "./cards/SharesWithRisingDividendCard";
import RisingDividendAndCashflowCard from "./cards/RisingDividendAndCashflowCard";
import SharesUpdatingAnnuallyCard from "./cards/SharesUpdatingAnnuallyCard";
import SharesUpdatingAnnuallyThreeYearsCard from "./cards/SharesUpdatingAnnuallyThreeYearsCard";
import StocksWithRisingTurnoverCard from "./cards/StocksWithRisingTurnoverCard";
import { Helmet } from "react-helmet";
import { trigInfonline, guessInfonlineSection, getInfonlineTag } from "components/common/InfonlineService";
import PerformanceMarketCapCard from "./cards/performanceCards/PerformanceMarketCapCard";
import PerformanceStatusCard from "./cards/performanceCards/PerformanceStatusCard";
import NewAllTimeHighPerformanceCard from "./cards/performanceCards/NewAllTimeHighPerformanceCard";
import PerformanceWithANewYearCard from "./cards/performanceCards/PerformanceWithANewYearCard";
import PerformanceWithNewYearAndMarketCapCard from "./cards/performanceCards/PerformanceWithNewYearAndMarketCapCard";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";

export type TagsType = {
    id: string
    text: string
}

export type BannerButtonsType = {
    cards: ShareSearchCard[]
    id: number,
    name: string
    tags: TagsType[]
}

export const SHARE_SEARCH_CARDS: ShareSearchCard[] = [MarketCapCard, UpdatingSharesCard, UpdatingSalesCard, CompaniesRisingDividendCard,
    StocksRisingDividendCard, CompaniesWithChangingDividendCard, CompaniesIncreasingDividendCard, SharesWithRisingDividendCard, RisingDividendAndCashflowCard,
    SharesUpdatingAnnuallyCard, SharesUpdatingAnnuallyThreeYearsCard, StocksWithRisingTurnoverCard, DividendPayoutRatioCard
];

export const PERFORMANCE_SHARE_CARDS: ShareSearchCard[] = [PerformanceMarketCapCard, PerformanceStatusCard, NewAllTimeHighPerformanceCard,
    PerformanceWithANewYearCard, PerformanceWithNewYearAndMarketCapCard];

export const TAGS: TagsType[] = [
    {
        id: 'MARKET_CAP',
        text: 'Marktkapitalisierung',
    },
    {
        id: 'CASHFLOW',
        text: 'Cashflow',
    },
    {
        id: 'PROFIT',
        text: 'Gewinn',
    },
    {
        id: 'SALES',
        text: 'Umsatz',
    },
    {
        id: 'DIVIDEND',
        text: 'Dividende',
    }
];

export const PERFORMANCE_TAGS: TagsType[] = [
    {
        id: 'VOLATILITY',
        text: 'Volatilität',
    },
    {
        id: 'PERFORMANCE',
        text: 'Performance',
    },
];

export interface ShareSearchState {
    cards: ShareSearchCard[];
    searchProps: GlobalShareSearchProps
    category: string;
}

export const ALL_SELECTED = "Alle";

export const ShareSearch = () => {
    let { loading } = useQuery<Query>(loader('./getShareSearchMetaData.graphql'));
    let { data: regionsData } = useQuery<Query>(loader('./getShareRegions.graphql'))

    const BANNER_BUTTONS = [
        {name: "Performance", id: 0, cards: PERFORMANCE_SHARE_CARDS, tags: PERFORMANCE_TAGS},
        {name: "Technische Kennzahlen", id: 1, tags: [], cards: []},
        {name: "Fundamentale Kennzahlen", id: 2, tags: TAGS, cards: SHARE_SEARCH_CARDS},
        {name: "Chartsignale", id: 3, cards: [], tags: []}
    ];
    const BANNER_BUTTONS_IVW = ["003_01_02_AS_P", "003_01_02_AS_TK", "003_01_02_AS_FK", "003_01_02_AS_CS"];

    useEffect(() => trigInfonline(guessInfonlineSection(), 'aktienpage'), []);
    const [state, setState] = useState<ShareSearchState>({
        searchProps: {
            regionId: null,
            period: Period.Last_1Year,
            trends: [],
            ranges: [],
            marketCapitalization: null
        },
        cards: SHARE_SEARCH_CARDS,
        category: ALL_SELECTED
    })
    const [activeSection, setActiveSection] = useState<number>(BANNER_BUTTONS[2].id);
    const [filterTags, setFilterTags] = useState<TagsType[]>(TAGS);
    const [filteredCards, setFilteredCards] = useState<ShareSearchCard[]>(SHARE_SEARCH_CARDS);
    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "share_search_page");
    }, [])

    if (loading) {
        return (
            <div className="text-center py-2">
                <Spinner animation="border" />
            </div>
        );
    }

    let regionsArr: any = [{ id: null, name: 'Alle' }];
    regionsArr = regionsArr.concat(regionsData?.regions);
    const value: ShareSearchContextProps = {
        shareRegions: (regionsData && regionsArr) || []
    }

    const updateCategory = (value: string) => {
        trigInfonline("sharessearch", "tabs")
        const cards = value == ALL_SELECTED ? filteredCards : filteredCards.filter(current => current.tags && current.tags.indexOf(value) >= 0);
        setState({ ...state, category: value, cards: cards });
    }

    function mainTabSelectHandler(current: BannerButtonsType, index: number) {
        trigInfonline(guessInfonlineSection(), BANNER_BUTTONS_IVW[index]);
        setActiveSection(current.id);
        setState({...state, cards: current.cards, category: ALL_SELECTED})
        setFilterTags(current.tags);
        setFilteredCards(current.cards);
    }

    return (
        <ShareSearchContext.Provider value={value}>
            <Helmet>
                <title>finanztreff.de - Aktiensuche | Smart | Suchen und vergleichen Sie Ihre Aktien</title>
                <meta name="description"
                    content="Aktiensuche nach aktuellen Kursen, Performance, Dividende ✔, Cashflow, Gewinn, Chartsignalen, Technischen und fundamentalen Kennzahlen auf finanztreff.de!" />
                <meta name="keywords"
                    content="Outperformer, Aktienvergleich, Aktie suchen, Aktien finden, Aktien finder, Marktkapitalisierung, Cashflow, Gewinn, Umsatz, Dividende, Chartsignale, Kennzahlen" />
                <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            <div className="page-container">
                <Container className="page-header px-md-3 px-sm-2 py-2">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Aktien</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Aktiensuche</Breadcrumb.Item>
                    </Breadcrumb>
                    <Row className="justify-content-start mb-3">
                        <Col className={'pl-10px'}>
                            <div style={{ marginBottom: 2 }} className="font-weight-bold d-flex ml-1">
                                <SvgImage icon="icon_bulb_trading_ideen_white.svg" spanClass="arrow ml-n2 pr-md-0 pr-2 ml-md-0 ml-xl-0 svg-grey"
                                    imgClass="flame-icon ml-1 ml-xl-n1 ml-md-n1" width="28" />
                                <h1 className={"font-weight-bold text-light fs-24px ml-n2 ml-md-0 ml-xl-0 page-title mb-n1"}>Smarte Suche Aktien</h1>
                            </div>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col>
                            {BANNER_BUTTONS.map((current: BannerButtonsType, index: number) =>
                                <Button variant="primary" key={index} className={classNames("mb-2 mr-md-3 mr-sm-2 share-search-buttons", index !== activeSection && "bg-gray-light border-gray-light text-dark")}
                                        disabled={index !== activeSection}
                                    onClick={() => mainTabSelectHandler(current, index)}
                                >
                                    {current.name}
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Container>
                <ButtonGroup>
                    <Row className={`ml-2 ml-xl-3 ml-md-3 mt-3`}>
                        <Button className={classNames("tagcloud ", ALL_SELECTED == state.category && "active border-blue")}
                            onClick={() => updateCategory(ALL_SELECTED)}>{ALL_SELECTED}</Button>
                        {
                            filterTags.map((current, index) =>
                                <Button key={index} className={classNames("tagcloud", current.text == state.category && "active border-blue")} onClick={() => updateCategory(current.text)}>{current.text}</Button>
                            )
                        }
                    </Row>
                </ButtonGroup>
                <Container className="px-3">
                    <ShareSearchCarousel setState={setState} cards={state.cards} props={state.searchProps} />
                </Container>
            </div>
        </ShareSearchContext.Provider>
    )
}

interface ShareSearchCarouselProps {
    cards: ShareSearchCard[];
    props: GlobalShareSearchProps
    setState: SetStateAction<any>;
}

export function ShareSearchCarousel({ cards, props, setState }: ShareSearchCarouselProps) {
    const shareSearchCarouselItemSize = useBootstrapBreakpoint({
        default: { itemsPerSlide: 4, showControls: true },
        md: { itemsPerSlide: 13, showControls: false },
        xl: { itemsPerSlide: 13, showControls: false }
    });
    return (
        <Carousel controlclass="dark-version" touch={true} prevIcon={
            <SvgImage color="black" icon="icon_direction_left_dark.svg"
                spanClass="move-arrow svg-black" convert={true} />
        }
            nextIcon={
                <SvgImage color="black" icon="icon_direction_right_dark.svg"
                    spanClass="move-arrow svg-black" convert={true} />
            }
            controls={shareSearchCarouselItemSize.showControls} indicators={shareSearchCarouselItemSize.showControls}
            as={CarouselWrapper}
        >
            {
                createChunk(cards, shareSearchCarouselItemSize.itemsPerSlide).map((items: ShareSearchCard[], index: number) =>
                    <CarouselItem key={index}>
                        <Row className="px-md-2 px-sm-0">
                            {
                                items.map((Card: ShareSearchCard, index: number) =>
                                    <Card cardResult={null} setState={setState} tableHeaders={[]} key={"search-card-" + index} defaultSearchProps={props} />
                                )
                            }
                        </Row>
                    </CarouselItem>
                )
            }
        </Carousel>
    )
}
