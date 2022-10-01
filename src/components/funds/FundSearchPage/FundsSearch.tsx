import { useEffect, useState } from "react";
import { Breadcrumb, Button, ButtonGroup, Carousel, CarouselItem, Col, Container, Row, Spinner } from "react-bootstrap";
import SvgImage from "components/common/image/SvgImage";
import "./FundsSearch.scss";
import { FundTopic, FundRegion, FundStrategy, FundCurrency, Query, SearchFundCriterion } from "graphql/types";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import FundsSearchContext, { FundsSearchContextProps } from "./FundsSearchContext";
import { FundTotalExpenseRatioSearchCard } from "./FundSearchCards/FundTotalExpenseRatioSearchCard";
import classNames from "classnames";
import { createChunk } from "components/common/utils";
import { CarouselWrapper } from "components/common";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { FundVolumeCard } from "./FundSearchCards/FundVolumeCard";
import { FundPerformanceForPeriodSearchCard } from "./FundSearchCards/FundPerformanceForPeriodSearchCard";
import { FundMinimalPerformanceSearchCard } from "./FundSearchCards/FundMinimalPerformanceSearchCard";
import { FundDistanceForPeriodSearchCard } from "./FundSearchCards/FundDistanceForPeriodSearchCard";
import { FundVolatilitySearchCard } from "./FundSearchCards/FundVolatilitySearchCard";
import { FundMeinFinanztreffSearchCard } from "./FundSearchCards/FundMeinFinanztreffSearchCard";
import { FundPerformanceSavingSearchCard } from "./FundSearchCards/FundPerformanceSavingSearchCard";
import { FundSavingPlansSearchCard } from "./FundSearchCards/FundSavingPlansSearchCard";
import { FundAgingSearchCard } from "./FundSearchCards/FundAgingSearchCard";
import { FundRiskSearchCard } from "./FundSearchCards/FundRiskSearchCard";
import { FundSharpRatioSearchCard } from "./FundSearchCards/FundSharpRatioSearchCard";
import {FundSearchCard, GlobalFundSearchProps} from "./BaseFundSearchCard";
import {
    FilterOptionSelectorComponent,
} from "../../layout/filter/FilterOptionSelectorComponent/FilterOptionSelectorComponent";
import {FundSearchResultInfo} from "./FundSeachResultInfo";
import {
    MultiSectionFilterOptionSelectorComponent,NumberOption
} from "../../layout/filter/FilterOptionSelectorComponent/MultiSectionFilterOptionSelectorComponent";
import {DEFAULT_FUND_OPTION, DEFAULT_FUND_OPTION_ID, FundTypeOption, renderDefaultQuery} from "../utils";
import {Helmet} from "react-helmet";
import { trigInfonline, getInfonlineTag } from "components/common/InfonlineService";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";

export const FUND_CARDS: FundSearchCard[] = [FundVolumeCard, FundTotalExpenseRatioSearchCard, FundPerformanceForPeriodSearchCard, FundMinimalPerformanceSearchCard,
    FundDistanceForPeriodSearchCard, FundVolatilitySearchCard, FundMeinFinanztreffSearchCard, FundPerformanceSavingSearchCard,
    FundSavingPlansSearchCard, FundAgingSearchCard, FundRiskSearchCard, FundSharpRatioSearchCard]
    .sort((a, b) => {
        if (a.enabled == b.enabled) {
            return 0;   
        }
        return a.enabled && !b.enabled ? -1 : 1;
    });

const TAGS: string[] =
    FUND_CARDS
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
        .sort((a, b) => a.localeCompare(b));

const ALL_SELECTED = "Alle";

interface FundsSearchState {
    searchProps: GlobalFundSearchProps;
    category: string;
    overrideTypeId: boolean;
    cards: FundSearchCard[];
}

export function FundsSearch() {
    let { loading, data } = useQuery<Query>(loader("./getFundSearchMetadata.graphql"));
    const [state, setState] = useState<FundsSearchState>({
        searchProps: {
            topicId: null,
            typeId: null,
            regionId: null,
            strategyId: null,
            currencyId: null
        },
        overrideTypeId: false,
        category: ALL_SELECTED,
        cards: FUND_CARDS
    });

    // useEffect(() => {
    //     trigInfonline('fonds', 'suche');
    // }, [])


    useEffect(() => {
        trigInfonline("fonds_search", "funds_search_page");
    }, [])

    if (loading) {
        return (
            <div className="text-center py-2">
                <Spinner animation="border" />
            </div>
        );
    }

    const value: FundsSearchContextProps = {
        fundTypes: [
            DEFAULT_FUND_OPTION,
            ...((data && [...data.fundTypes]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
                .map(current => ({id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || null} as FundTypeOption))
        ],
        fundTopics: ((data && [...data.fundTopics]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || "")).map(current => current as FundTopic),
        fundRegions: ((data && [...data.fundRegions]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || "")).map(current => current as FundRegion),
        fundStrategies: ((data && [...data.fundStrategies]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || "")).map(current => current as FundStrategy),
        fundCurrencies: ((data && [...data.fundCurrencies]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || "")).map(current => current as FundCurrency)
    };

    let overrideTypeId = state.overrideTypeId ? state.searchProps.typeId : (value.fundTypes.find(current => current.id != DEFAULT_FUND_OPTION_ID) || value.fundTypes[0]).id ;
    let overrideSearchProps = {...state.searchProps, typeId: overrideTypeId};

    const updateCategory = (value: string) => {
        trigInfonline("fonds_search",getInfonlineTag("fonds_search", 'tabs') + '_' + value.toUpperCase())
        const cards = value == ALL_SELECTED ? FUND_CARDS : FUND_CARDS.filter(current => current.tags && current.tags.indexOf(value) >= 0);
        setState({ ...state, category: value, cards: cards });
    }

    return (
        <FundsSearchContext.Provider value={value}>
            { data &&
            <Helmet>
                <title>finanztreff.de - Fondssuche | Smart | Suchen und vergleichen Sie Fonds</title>
                <meta name="description"
                      content="Finden Sie alle Informationen zu unterschiedlichen Fondsarten kostenlos ✔. Aktuelle Kurse, Charts, Anteilsklassen, Anlageideen, Fondsgebühren, TER ✔, Analysen & Kennzahlen in Fonds-Portraits - bei finanztreff.de!"/>
                <meta name="keywords"
                      content="Aktienfonds, Rentenfonds, Geldmarktfonds, Immobilienfonds, Mischfonds, wertgesicherte Fonds, Laufzeitfonds, Sparplan, Fondssuche, Fonds Suche, Fonds TER, Sparen, Vermögenswirksame Leistungen, Performance, TER, VL-Sparen"/>
            </Helmet>
            }
            <>
                <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                </Helmet>
            </>
            <div className="page-container">
                <Container className="page-header px-1 py-2">
                    <Row>
                        <Col>
                            <Container>
                                <Breadcrumb className={'ml-n2'}>
                                    <Breadcrumb.Item href="#">Fonds</Breadcrumb.Item>
                                    <Breadcrumb.Item href="#">Suche</Breadcrumb.Item>
                                </Breadcrumb>
                                <Row className="justify-content-between mb-3 pl-10px ml-sm-n4 ml-md-n3">
                                    <div style={{marginTop: 3}} className="font-weight-bold d-flex">
                                        <SvgImage icon="icon_bulb_trading_ideen_white.svg" spanClass="arrow ml-n1 pr-md-0 pr-2  svg-grey"
                                                  imgClass="flame-icon ml-1 ml-xl-n1 ml-md-n1" width="28"/>
                                        <h1 className={"font-weight-bold text-light fs-24px ml-n2 ml-md-0 ml-xl-0 page-title mb-n1"}>Smarte Suche Fonds</h1>
                                    </div>
                                    <div className="fs-15px my-auto text-white cursor-pointer mr-2"
                                         onClick={() =>
                                             setState({
                                                 ...state,
                                                 searchProps: {
                                                     typeId: value.fundTypes[0].id, regionId: null,
                                                     topicId: null, currencyId: null, strategyId: null
                                                 },
                                                 overrideTypeId: false
                                             })
                                        }
                                    >
                                        <span className="d-xl-inline d-lg-inline d-md-inline d-sm-none">Filter zurücksetzen</span>
                                        <SvgImage icon="icon_reset_white.svg" convert={false} imgClass="my-2 ml-2" width="20" />
                                    </div>
                                </Row>
                                <Row className="row-cols-xl-5">
                                    <Col md={4} xs={12} className="px-2">
                                        <FilterOptionSelectorComponent<number>
                                            name={"Fondsart"}
                                            options={
                                                value.fundTypes
                                                    .filter(current => current.id !== DEFAULT_FUND_OPTION_ID)
                                                    .map(current => {
                                                        return { id: current?.id || "0", name: current?.name || "", value:current?.id && parseInt(current.id) || 0  };
                                                    })
                                            }
                                            onSelect={(value: NumberOption | null) => {
                                                trigInfonline('fonds_search', 'fondstart');
                                                setState({
                                                    ...state,
                                                    searchProps: {
                                                        ...state.searchProps,
                                                        typeId: value?.id || null
                                                    },
                                                    overrideTypeId: true
                                                })
                                            }}
                                            selected={"" + overrideTypeId}
                                        />
                                    </Col>
                                    <Col md={4} xs={12} className="px-2">
                                        <FilterOptionSelectorComponent<number>
                                            name={"Thema"}
                                            options={
                                                value.fundTopics.map(current => {
                                                    return { id: current?.id || "0", name: current?.name || "", value: current?.id && parseInt(current.id) || 0  };
                                                })
                                            }
                                            onSelect={(value: NumberOption | null) => {
                                                trigInfonline('fonds_search', 'thema')
                                                setState({
                                                    ...state,
                                                    searchProps: {
                                                        ...state.searchProps,
                                                        topicId: value?.value || null
                                                    }
                                                })
                                            }}
                                            selected={"" + state.searchProps.topicId}
                                        />
                                    </Col>
                                    <Col md={4} xs={12} className="px-2">
                                        <MultiSectionFilterOptionSelectorComponent<number>
                                            name={"Regionen & Länder"}
                                            options={
                                                {
                                                    "Regionen":
                                                        value.fundRegions.filter(current => !current.countryIsoAlpha3)
                                                            .map(current => {
                                                                return {
                                                                    id: current?.id || "0",
                                                                    name: current?.name || "",
                                                                    value: parseInt(current.id) || 0
                                                                };
                                                            }),
                                                    "Länder":
                                                        value.fundRegions.filter(current => !!current.countryIsoAlpha3)
                                                            .map(current => {
                                                                return {
                                                                    id: current?.id || "0",
                                                                    name:
                                                                    <>
                                                                        {current.countryIsoAlpha3 &&
                                                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + current.countryIsoAlpha3.toLowerCase() + ".svg"}
                                                                                 alt="" className="mr-1" width="24px" height="16px" />}
                                                                            {current?.name}
                                                                    </>,
                                                                    value: parseInt(current.id) || 0
                                                                };
                                                            }),
                                                }
                                            }
                                            onSelect={(value) => {
                                                trigInfonline('fonds_search', 'regionen');
                                                setState({
                                                    ...state,
                                                    searchProps: {
                                                        ...state.searchProps,
                                                        regionId: value && value.value?.value || null
                                                    }
                                                })
                                            }}
                                            selected={"" + state.searchProps.regionId}
                                        />
                                    </Col>
                                    <Col md={4} xs={12} className="px-2">
                                        <FilterOptionSelectorComponent<number>
                                            name={"Strategie"}
                                            options={
                                                value.fundStrategies.map(current => {
                                                    return { id: current?.id || "0", name: current?.name || "", value: current?.id && parseInt(current.id) || 0 };
                                                })
                                            }
                                            onSelect={(value: NumberOption | null) => {
                                                trigInfonline('fonds_search', 'strategy')
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
                                    <Col md={4} xs={12} className="px-2">
                                        <FilterOptionSelectorComponent<number>
                                            name={"Währung"}
                                            options={
                                                value.fundCurrencies.map(current => {
                                                    return {
                                                        id: current?.id || "0",
                                                        name:
                                                            <>
                                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + current.name.toLowerCase() + ".svg"}
                                                             alt="" className="mr-1" width="24px" height="16px" />
                                                                {current?.name}
                                                            </>,
                                                        value: parseInt(current.id) };
                                                })
                                            }
                                            onSelect={(value: NumberOption | null) => {
                                                trigInfonline('fonds_search', 'waehrungs');
                                                setState({
                                                    ...state,
                                                    searchProps: {
                                                        ...state.searchProps,
                                                        currencyId: value?.value || null
                                                    }
                                                })
                                            }}
                                            selected={"" + state.searchProps.currencyId}
                                        />
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-center my-2">
                                    <FundSearchResultInfo className="py-1 rounded-1" criteria={
                                        renderDefaultQuery({
                                            topicId: overrideSearchProps.topicId, strategyId: overrideSearchProps.strategyId,
                                            typeId: overrideSearchProps.typeId, regionId: overrideSearchProps.regionId,
                                            currencyId: overrideSearchProps.currencyId
                                        }, value)
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
                    <FundSearchCarousel cards={state.cards} props={{
                        ...overrideSearchProps,
                        typeId: overrideSearchProps.typeId || value.fundTypes[0].id
                    }}/>
                </Container>
            </div>
        </FundsSearchContext.Provider>
    );
}

interface FundSearchCarouselProps {
    cards: FundSearchCard[];
    props: GlobalFundSearchProps;
}

function FundSearchCarousel({cards, props}: FundSearchCarouselProps) {
    const fundSearchCarouselItemsSize = useBootstrapBreakpoint({
        default: {itemsPerSlide: 3, showControls: true},
        md: {itemsPerSlide: 4, showControls: true},
        xl: {itemsPerSlide: 16, showControls: false}
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
            controls={fundSearchCarouselItemsSize.showControls}
            indicators={fundSearchCarouselItemsSize.showControls}
            as={CarouselWrapper}
        >
            {
                createChunk(cards, fundSearchCarouselItemsSize.itemsPerSlide).map((items: FundSearchCard[], index: number) =>
                    <CarouselItem key={index}>
                        <Row className="px-md-2 px-sm-0">  
                            {
                                items.map((Card: FundSearchCard, index: number) =>
                                    <Card key={"fund-FundSearchPage-card-" + index}
                                          defaultSearchProps={props}/>
                                )
                            }
                        </Row>
                    </CarouselItem>
                )
            }
        </Carousel>
    );
}


function renderQuery(topicId: number | null, strategyId: number | null, typeId: number | null, regionId: number | null, currencyId: number | null): SearchFundCriterion {
    return {
        fundTopicId: topicId,
        fundCurrencyId: currencyId,
        fundRegionId: regionId,
        fundTypeId: typeId,
        fundStrategyId: strategyId,
    }
}
