import EtfSearchContext, {EtfSearchContextProps} from "./EtfSearchContext";
import {useQuery} from "@apollo/client";
import {
    AssetClass, AssetTypeGroup, EtfAllocation, EtfIssuer, EtfPosition,
    EtfRegion, EtfReplication,
    EtfSector,
    EtfStrategy,
    Query,
    SearchEtfCriterion
} from "../../../generated/graphql";
import {loader} from "graphql.macro";
import {Breadcrumb, Button, ButtonGroup, Carousel, CarouselItem, Col, Container, Row, Spinner} from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import {
    FilterOptionSelectorComponent
} from "../../layout/filter/FilterOptionSelectorComponent/FilterOptionSelectorComponent";
import {
    NumberOption, Option
} from "../../layout/filter/FilterOptionSelectorComponent/MultiSectionFilterOptionSelectorComponent";
import {EtfSearchResultInfo} from "./EtfSearchResultInfo";
import {useEffect, useState} from "react";
import {EtfSearchCard, GlobalEtfSearchProps} from "./BaseEtfSearchCard";
import classNames from "classnames";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";
import {CarouselWrapper} from "../../common";
import {createChunk} from "../../common/utils";
import {EtfGreaterPerformanceCard} from "./cards/EtfGreaterPerformanceCard";
import {EtfVolumeCard} from "./cards/EtfVolumeCard";
import {EtfTotalExpenseRatioSearchCard} from "./cards/EtfTotalExpenseRatioSearchCard";
import {EtfSmallerPerformanceCard} from "./cards/EtfSmallerPerformanceCard";
import {EtfGreaterKeyfigureDistanceCard} from "./cards/EtfGreaterKeyfigureDistanceCard";
import {EtfSmallerKeyfigureDistanceCard} from "./cards/EtfSmallerKeyfigureDistanceCard";
import {EtfMaxLoosingPeriodSearchCard} from "./cards/EtfMaxLoosingPeriodSearchCard";
import {EtfMarketPositionCard} from "./cards/EtfMarketPositionCard";
import {EtfMeinFinanztreffPortfolioRemovedCard} from "./cards/EtfMeinFinanztreffPortfolioRemovedCard";
import {EtfMeinFinanztreffPortfolioAddedCard} from "./cards/EtfMeinFinanztreffPortfolioAddedCard";
import {EtfMeinFinanztreffWatchlistRemovedCard} from "./cards/EtfMeinFinanztreffWatchlistRemovedCard";
import {EtfMeinFinanztreffWatchlistAddedCard} from "./cards/EtfMeinFinanztreffWatchlistAddedCard";
import {EtfVolumeIncreaseCard} from "./cards/EtfVolumeIncreaseCard";
import {EtfVolumeDecreaseCard} from "./cards/EtfVolumeDecreaseCard";
import {EtfDistributionCard} from "./cards/EtfDistributionCard";
import {EtfAgeCard} from "./cards/EtfAgeCard";
import {EtfStrategyCard} from "./cards/EtfStrategyCard";
import {EtfQuantoCard} from "./cards/EtfQuantoCard";
import {EtfAllocationCard} from "./cards/EtfAllocationCard";
import {EtfReplicationCard} from "./cards/EtfReplicationCard";
import {DEFAULT_ETF_OPTION, DEFAULT_ETF_OPTION_ID, EtfTypeOption} from "../utils";
import {getInfonlineTag, guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";
import { Helmet } from "react-helmet";

export const ETF_CARDS: EtfSearchCard[] = [
    EtfGreaterPerformanceCard, EtfSmallerPerformanceCard, EtfVolumeCard, EtfTotalExpenseRatioSearchCard,
    EtfMaxLoosingPeriodSearchCard, EtfGreaterKeyfigureDistanceCard, EtfSmallerKeyfigureDistanceCard,
    EtfMarketPositionCard, EtfMeinFinanztreffPortfolioAddedCard, EtfMeinFinanztreffPortfolioRemovedCard,
    EtfMeinFinanztreffWatchlistAddedCard, EtfMeinFinanztreffWatchlistRemovedCard,
    EtfVolumeIncreaseCard, EtfVolumeDecreaseCard, EtfDistributionCard, EtfAgeCard, EtfStrategyCard,
    EtfQuantoCard, EtfAllocationCard, EtfReplicationCard
]
    .sort((a, b) => {
        if (a.enabled == b.enabled) {
            return 0;
        }
        return a.enabled && !b.enabled ? -1 : 1;
    });


const TAGS: string[] =
    ETF_CARDS
        .map(current => current.tags || [])
        .map(current => [...current])
        .reduce((prev, current) => {
            current.forEach(item => {
                if (prev.indexOf(item) < 0) {
                    prev.push(item);
                }
            })
            return prev;
        }, [])
        .filter(current => !!current)
        .sort((a, b) => a.localeCompare(b));

interface EtfSearchState {
    searchProps: GlobalEtfSearchProps;
    category: string;
    overrideTypeId: boolean;
    cards: EtfSearchCard[];
}

const ALL_SELECTED = "Alle";

export function EtfSearch() {
    let { loading, data } = useQuery<Query>(loader("./getEtfSearchMetadata.graphql"));

    const [state, setState] = useState<EtfSearchState>({
        searchProps: {
            typeId: null,
            regionId: null,
            strategyId: null,
            sectorId: null
        },
        overrideTypeId: false,
        category: ALL_SELECTED,
        cards: ETF_CARDS
    });

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "etf_search_page");
    }, [])

    if (loading) {
        return (
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );
    }

    const value: EtfSearchContextProps = {
        etfTypes: [
            DEFAULT_ETF_OPTION,
            ...((data && [...data.classification.reduce((a: AssetTypeGroup[], b: AssetClass) => [...a, ...b.typeGroups],[])]) || [])
                            .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
                            .map(current => ({id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || null} as EtfTypeOption))
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

    let overrideTypeId = state.overrideTypeId ? state.searchProps.typeId : value.etfTypes.filter(current => current.id != DEFAULT_ETF_OPTION_ID)[0].id;
    let overrideSearchProps = {...state.searchProps, typeId: overrideTypeId};

    const updateCategory = (value: string) => {
        trigInfonline(guessInfonlineSection(),getInfonlineTag(guessInfonlineSection(), 'tabs') + '_' + value.toUpperCase())
        const cards = value == ALL_SELECTED ? ETF_CARDS : ETF_CARDS.filter(current => current.tags && current.tags.indexOf(value) >= 0);
        setState({ ...state, category: value, cards: cards });
    }


    return (
        <EtfSearchContext.Provider value={value}>
            <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            <div className="page-container">
                <Container className="page-header px-1 py-2">
                    <Row>
                        <Col>
                            <Container>
                                <Breadcrumb>
                                    <Breadcrumb.Item href="#">ETF</Breadcrumb.Item>
                                    <Breadcrumb.Item href="#">Suche</Breadcrumb.Item>
                                </Breadcrumb>
                                <div className="d-flex justify-content-between mb-3">
                                    <h4 className="font-weight-bold text-light page-title my-auto fs-24px">
                                        <SvgImage icon="icon_bulb_trading_ideen_white.svg" spanClass="arrow top-move ml-n3 ml-md-0 ml-xl-0 svg-grey" imgClass="flame-icon ml-1 ml-xl-n1 ml-md-n1"
                                                  width="28" />Smarte Suche ETF</h4>
                                    <div className="fs-15px my-auto text-white cursor-pointer"
                                         onClick={() =>
                                             setState({
                                                 ...state,
                                                 searchProps: {
                                                     typeId: value.etfTypes[0].id || null,
                                                     regionId: null,
                                                     sectorId: null,
                                                     strategyId: null
                                                 },
                                                 overrideTypeId: false
                                             })
                                         }
                                    >
                                        <span className="d-xl-inline d-lg-inline d-md-inline d-sm-none">Filter zurücksetzen</span>
                                        <SvgImage icon="icon_reset_white.svg" convert={false} imgClass="my-2 ml-2" width="20" />
                                    </div>
                                </div>
                                <Row className="row-cols-xl-5">
                                    <Col xl={3} md={6} xs={12} className="px-2">
                                        <FilterOptionSelectorComponent<string>
                                            name={"ETF-Art"}
                                            options={
                                                value.etfTypes
                                                    .filter(current => current.name != ALL_SELECTED)
                                                    .map(current => {
                                                    return { id: `${current?.id}`, name: `${current?.name}`, value: `${current?.id}` };
                                                })
                                            }
                                            onSelect={(value: Option<string> | null) => {
                                                trigInfonline(guessInfonlineSection(), "type");
                                                setState({
                                                    ...state,
                                                    searchProps: {
                                                        ...state.searchProps,
                                                        typeId: value?.value || null
                                                    },
                                                    overrideTypeId: true
                                                })
                                            }}
                                            selected={"" + overrideTypeId}
                                        />
                                    </Col>
                                    <Col xl={3} md={6} xs={12} className="px-2">
                                        <FilterOptionSelectorComponent<number>
                                            name={"Regionen & Länder"}
                                            options={
                                                value.etfRegions.map(current => {
                                                    return {
                                                        id: "" + current?.id || "0",
                                                        name: current?.name,
                                                        value: current.id || 0
                                                    };
                                                })
                                            }
                                            onSelect={(value: Option<number> | null) => {
                                                trigInfonline(guessInfonlineSection(), "region")
                                                setState({
                                                    ...state,
                                                    searchProps: {
                                                        ...state.searchProps,
                                                        regionId: value?.value || null
                                                    }
                                                })
                                            }}
                                            selected={"" + state.searchProps.regionId}
                                        />

                                    </Col>
                                    <Col xl={3} md={6} xs={12} className="px-2">
                                        <FilterOptionSelectorComponent<number>
                                            name={"Sektor"}
                                            options={
                                                value.etfSectors.map(current => {
                                                    return {
                                                        id: "" + current?.id || "0",
                                                        name: current?.name,
                                                        value: current.id || 0
                                                    };
                                                })
                                            }
                                            onSelect={(value: NumberOption | null) => {
                                                trigInfonline(guessInfonlineSection(), "sector")
                                                setState({
                                                    ...state,
                                                    searchProps: {
                                                        ...state.searchProps,
                                                        sectorId: value?.value || null
                                                    }
                                                })
                                            }}
                                            selected={"" + state.searchProps.sectorId}
                                        />
                                    </Col>
                                    <Col xl={3} md={6} xs={12} className="px-2">
                                        <FilterOptionSelectorComponent<number>
                                            name={"Strategie"}
                                            options={
                                                value.etfStrategies.map(current => {
                                                    return {
                                                        id: "" + current?.id || "0",
                                                        name:
                                                            <>{current?.name}</>,
                                                        value: current.id || 0};
                                                })
                                            }
                                            onSelect={(value: NumberOption | null) => {
                                                trigInfonline(guessInfonlineSection(), "strategy");
                                                setState({
                                                    ...state,
                                                    searchProps: {
                                                        ...state.searchProps,
                                                        strategyId: value?.value || null
                                                    }
                                                })
                                            }}
                                            selected={"" + state.searchProps.strategyId}
                                        />
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-center my-2">
                                    <EtfSearchResultInfo criteria={
                                        renderQuery(
                                            overrideSearchProps.typeId || null, overrideSearchProps.regionId,
                                            overrideSearchProps.sectorId, overrideSearchProps.strategyId
                                        )
                                    } enabled />
                                </Row>
                            </Container>

                        </Col>
                    </Row>
                </Container>
                <ButtonGroup>
                    <Row className={`ml-2 ml-xl-3 ml-md-3 mt-3`}>
                        <Button className={classNames("tagcloud", ALL_SELECTED == state.category && "active")}
                                onClick={() => updateCategory(ALL_SELECTED)}>{ALL_SELECTED}</Button>
                        {
                            TAGS.map((current, index) =>
                                <Button key={index} onClick={() => current && updateCategory(current)} className={classNames("tagcloud ", current == state.category && "active")}
                                >
                                    {current}
                                </Button>
                            )
                        }
                    </Row>
                </ButtonGroup>
                <Container className="px-3">                   
                    <EtfSearchCarousel cards={state.cards} props={{
                        ...overrideSearchProps,
                        typeId: overrideSearchProps.typeId || value.etfTypes[0].id || null
                    }}/>
                </Container>
            </div>
        </EtfSearchContext.Provider>
    );
}

interface EtfSearchCarouselProps {
    cards: EtfSearchCard[];
    props: GlobalEtfSearchProps;
}

function EtfSearchCarousel({cards, props}: EtfSearchCarouselProps) {
    const etfSearchCarouselItemsSize = useBootstrapBreakpoint({
        default: {itemsPerSlide: 3, showControls: true},
        md: {itemsPerSlide: 4, showControls: true},
        xl: {itemsPerSlide: 40, showControls: false}
    });

    return (
        <Carousel
            controlclass="dark-version"
            touch={true}
            prevIcon={
                <SvgImage color="black" icon="icon_direction_left_dark.svg"
                          spanClass="move-arrow svg-black" convert={true} />
            }
            nextIcon={
                <SvgImage color="black" icon="icon_direction_right_dark.svg"
                          spanClass="move-arrow svg-black" convert={true} />
            }
            controls={etfSearchCarouselItemsSize.showControls}
            indicators={etfSearchCarouselItemsSize.showControls}
            as={CarouselWrapper}
        >
            {
                createChunk(cards, etfSearchCarouselItemsSize.itemsPerSlide).map((items: EtfSearchCard[], index: number) =>
                    <CarouselItem key={index}>
                        <Row className="px-md-2 px-sm-0">                            {
                                items.map((Card: EtfSearchCard, index: number) =>
                                    <Card key={"FundSearchPage-card-" + index} defaultSearchProps={props}/>
                                )
                            }
                        </Row>
                    </CarouselItem>
                )
            }
        </Carousel>
    );
}

function renderQuery(typeId: string | null, regionId: number | null, sectorId: number | null, strategyId: number | null): SearchEtfCriterion {
    return {
        assetTypeGroup: typeId,
        regionId: regionId,
        strategyId: strategyId,
        sectorId: sectorId
    }
}

