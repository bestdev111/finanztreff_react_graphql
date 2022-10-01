import { useState } from 'react'
import { Button, ButtonGroup, Carousel, CarouselItem, Col, Container, Row, Spinner } from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import { SearchCard } from "../../common/SearchCard/BaseSearchCard";
import { BOND_CARDS } from "../../bond/BondSearchPage/BondSearch";
import { ETF_CARDS } from "../../etf/search/EtfSearch";
import { useQuery } from "@apollo/client";
import {
    AssetClass,
    AssetTypeGroup,
    BondIssuer,
    CurrencyBucket,
    EtfAllocation,
    EtfIssuer,
    EtfPosition,
    EtfRegion,
    EtfReplication,
    EtfSector,
    EtfStrategy, FundCurrency, FundRegion, FundStrategy, FundTopic, Query
} from "../../../generated/graphql";
import { loader } from "graphql.macro";
import BondSearchContext, { BondSearchContextProps } from "../../bond/BondSearchPage/BondSearchContext";
import EtfSearchContext, { EtfSearchContextProps } from "../../etf/search/EtfSearchContext";
import FundsSearchContext, { FundsSearchContextProps } from "../../funds/FundSearchPage/FundsSearchContext";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import { CarouselWrapper } from "../../common";
import { createChunk } from "../../common/utils";
import { FUND_CARDS } from "../../funds/FundSearchPage/FundsSearch";
import { FundSearchCard } from "../../funds/FundSearchPage/BaseFundSearchCard";
import classNames from "classnames";
import { DEFAULT_ETF_OPTION, EtfTypeOption } from "../../etf/utils";
import { BondTypeOption, DEFAULT_BOND_OPTION } from "../../bond/utils";
import { DEFAULT_FUND_OPTION, FundTypeOption } from "../../funds/utils";
import ShareSearchContext, { ShareSearchContextProps } from "../../shares/search/ShareSearchContext";
import { SHARE_SEARCH_CARDS } from "../../shares/search/ShareSearch";
import { SelectBottomBox } from "../../common/select/SelectBottomBox/SelectBottomBox";
import { BondSearchCard } from 'components/bond/BondSearchPage/BaseBondSearchCard';
import { EtfSearchCard } from 'components/etf/search/BaseEtfSearchCard';
import { ShareSearchCard } from 'components/shares/search/BaseShareSearchCard';
import { trigInfonline } from "../../common/InfonlineService";

const CARDS: (BondSearchCard | EtfSearchCard | FundSearchCard | ShareSearchCard)[] = [
    ...BOND_CARDS, ...ETF_CARDS, ...FUND_CARDS, ...SHARE_SEARCH_CARDS
]
    .sort((a, b) => {
        if (a.enabled == b.enabled) {
            return 0;
        }
        return a.enabled && !b.enabled ? -1 : 1;
    });

function getAllCards(arr: (BondSearchCard | EtfSearchCard | FundSearchCard | ShareSearchCard)[]) {
    for (let i = 0; i < CARDS.length; i++) {
        arr.push(SHARE_SEARCH_CARDS[i], FUND_CARDS[i], ETF_CARDS[i], BOND_CARDS[i]);
    }
    arr = arr.filter(el => el !== undefined)
    arr = arr.sort((a, b) => {
        if (a.enabled == b.enabled) {
            return 0;
        }
        return a.enabled && !b.enabled ? -1 : 1;
    })
    return arr;
}

const ALL_SELECTED = { text: "Alle", assetInfo: 'ALLE' };

interface TradingIdeasComponentState {
    tag: string;
    cards: (BondSearchCard | EtfSearchCard | FundSearchCard | ShareSearchCard)[];
}

export function TradingIdeasComponent() {
    let { loading, data } = useQuery<Query>(loader("./getTradeSearchMetadata.graphql"));
    const [state, setState] = useState<TradingIdeasComponentState>({
        tag: ALL_SELECTED.text,
        cards: getAllCards([])
    });

    if (loading) {
        return (
            <div className="text-center py-2">
                <Spinner animation="border" />
            </div>
        );
    }

    const bondValue: BondSearchContextProps = {
        bondTypes: [
            DEFAULT_BOND_OPTION,
            ...((data && [...data.bondTypes]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
                .map(current => ({ id: "" + current?.id || "", name: current?.name || "", value: current?.id || null } as BondTypeOption))
        ],
        bondIssuers: ((data && [...data.bondIssuers]) || []).sort((a, b) => (a?.legalName || "").localeCompare(b?.legalName || "")).map(current => current as BondIssuer),
        bondNominalCurrencies: ((data && [...data.bondNominalCurrencyBuckets]) || []).sort((a, b) => (a?.currency?.displayCode || "").localeCompare(b?.currency?.displayCode || "")).map(current => current as CurrencyBucket),
        bondTradingCurrencies: ((data && [...data.bondTradingCurrencyBuckets]) || []).sort((a, b) => (a?.currency?.displayCode || "").localeCompare(b?.currency?.displayCode || "")).map(current => current as CurrencyBucket)
    };

    const etfValue: EtfSearchContextProps = {
        etfTypes: [
            DEFAULT_ETF_OPTION,
            ...((data && [...data.classification.reduce((a: AssetTypeGroup[], b: AssetClass) => [...a, ...b.typeGroups], [])]) || [])
                .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
                .map(current => ({ id: "" + current?.id || "", name: current?.name || "", value: current?.id || null } as EtfTypeOption))
        ],
        etfAllocations: ((data && [...data.etfAllocation]) || [])
            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
            .map(current => current as EtfAllocation),
        etfPositions: ((data && [...data.etfPosition]) || [])
            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
            .map(current => current as EtfPosition),
        etfRegions: ((data && [...data.etfRegions]) || [])
            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
            .map(current => current as EtfRegion),
        etfStrategies: ((data && [...data.etfStrategies]) || [])
            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
            .map(current => current as EtfStrategy),
        etfSectors: ((data && [...data.etfSectors]) || [])
            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
            .map(current => current as EtfSector),
        etfReplications: ((data && [...data.etfReplications]) || [])
            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
            .map(current => current as EtfReplication),
        etfIssuers: ((data && [...data.etfIssuers]) || [])
            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
            .map(current => current as EtfIssuer)
    };

    const fundValue: FundsSearchContextProps = {
        fundTypes: [
            DEFAULT_FUND_OPTION,
            ...((data && [...data.fundTypes]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || "")).map(current => current as FundTypeOption)
        ],
        fundTopics: ((data && [...data.fundTopics]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || "")).map(current => current as FundTopic),
        fundRegions: ((data && [...data.fundRegions]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || "")).map(current => current as FundRegion),
        fundStrategies: ((data && [...data.fundStrategies]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || "")).map(current => current as FundStrategy),
        fundCurrencies: ((data && [...data.fundCurrencies]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || "")).map(current => current as FundCurrency)
    };

    const updateTag = (value: { text: string, assetInfo: string }) => {
        const cards = value.text == ALL_SELECTED.text ? getAllCards([]) : CARDS.filter(current => current.assetInfo === value.assetInfo);
        setState({ ...state, tag: value.text, cards: cards });
    }

    const handleSelect = (value: string) => {
        const cards = value == ALL_SELECTED.assetInfo ? getAllCards([]) : CARDS.filter(current => current.assetInfo === value);
        setState({ ...state, tag: value, cards: cards });
    }

    let regionsArr: any = [{ id: null, name: 'Alle' }];
    regionsArr = regionsArr.concat(data?.regions);
    const shareValue: ShareSearchContextProps = {
        shareRegions: (data && regionsArr) || []
    }

    const TAGS = [
        { text: 'Aktien', assetInfo: "AKTIEN" },
        { text: 'Fonds', assetInfo: "FONDS" },
        { text: 'ETF', assetInfo: "ETF" },
        { text: 'Anleihen', assetInfo: "ANLEIHEN" },
    ];

    return (
        <FundsSearchContext.Provider value={fundValue}>
            <EtfSearchContext.Provider value={etfValue}>
                <BondSearchContext.Provider value={bondValue}>
                    <ShareSearchContext.Provider value={shareValue}>
                        <Row className='align-items-center justify-content-between trading-ideas-wrapper mt-4 mx-0'>
                            <Col>
                                <Row className="pl-md-3 pl-sm-0 text-truncate font-weight-bold align-items-center">
                                    <SvgImage icon="icon_bulb_trading_ideen.svg" spanClass="arrow top-move" imgClass="trading-ideas-icon-home-page" />
                                    <h2 className="trading-ideas-heading font-family-roboto-slab">Trading-Ideen</h2>
                                </Row>
                            </Col>
                            <Col className="text-right d-md-block d-sm-none">
                                <ButtonGroup className="">
                                    <Button variant="inline"
                                        className={classNames("text-blue fs-16px mx-2 px-0 pb-0 border-button-blue font-weight-bold", (ALL_SELECTED.assetInfo.toLowerCase() !== state.tag.toLowerCase()) ? "active" : "")}
                                        onClick={() => {
                                            updateTag(ALL_SELECTED);
                                            trigInfonline('homepage', 'ALLE')
                                        }}>
                                        {ALL_SELECTED.text}
                                    </Button>
                                    {TAGS.map((current: { assetInfo: string, text: string }, index: number) => (
                                        <Button key={index} variant="inline"
                                            className={classNames("text-blue fs-16px mx-2 px-0 pb-0 border-button-blue font-weight-bold", (current.assetInfo.toLowerCase() !== state.tag.toLowerCase()) && "active")}
                                            onClick={() => {
                                                current && updateTag(current);
                                                trigInfonline('homepage', current.assetInfo)
                                            }}>
                                            {current.text}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </Col>
                            <Col className="text-right d-md-none">
                                <SelectBottomBox defaultValue={state.tag} className={"font-weight-bold text-blue pr-0 mr-n2 pb-2"} title={"Trading-Ideen"}
                                    icon={<SvgImage spanClass={"drop-arrow-image top-move indicator ml-2"} icon={"icon_direction_down_blue.svg"} width="17" />}
                                    options={[{ name: ALL_SELECTED.text, value: ALL_SELECTED.assetInfo }, ...TAGS.map(curr => {
                                        return {
                                            name: curr.text,
                                            value: curr.assetInfo
                                        }
                                    })]}
                                    onSelect={(value) => {
                                        trigInfonline('homepage', value);
                                        handleSelect(value)
                                    }}
                                />
                            </Col>
                        </Row>
                        <Container className="px-3">
                            <TradingIdeasCarousel cards={state.cards} />
                        </Container>
                    </ShareSearchContext.Provider>
                </BondSearchContext.Provider>
            </EtfSearchContext.Provider>
        </FundsSearchContext.Provider>
    )
}


interface TradingIdeasCarouselProps {
    cards: (BondSearchCard | EtfSearchCard | FundSearchCard | ShareSearchCard)[];
}

function TradingIdeasCarousel({ cards }: TradingIdeasCarouselProps) {
    const tradeIdeasItemsSize = useBootstrapBreakpoint({
        default: 3,
        md: 4,
        xl: 8
    });

    const [activeSlide, setActiveSlide] = useState<number>(0);

    return (
        <Carousel
            controlclass="dark-version"
            touch={true}
            prevIcon={
                <SvgImage onSelect={()=>trigInfonline("homepage", "trading_slider")}  color="black" icon="icon_direction_left_dark.svg"
                    spanClass="move-arrow svg-black" convert={true} />
            }
            nextIcon={
                <SvgImage onSelect={()=>trigInfonline("homepage", "trading_slider")} color="black" icon="icon_direction_right_dark.svg"
                    spanClass="move-arrow svg-black" convert={true} />
            }
            controls={true} indicators={true}
            as={CarouselWrapper}
            onSlid={(eventKey: number) => {setActiveSlide(eventKey);trigInfonline("homepage", "trading_slider")}}
        >
            {
                createChunk(cards, tradeIdeasItemsSize).map((items: SearchCard[], i: number) =>
                    <CarouselItem key={i} className="pb-5">
                        <Row className="px-md-2 px-sm-0">
                            {items.map((Card: SearchCard, index: number) =>
                                activeSlide === i &&
                                <Card key={"all-serach-card-" + index} />
                            )
                            }
                        </Row>
                    </CarouselItem>
                )
            }
        </Carousel>
    );
}
