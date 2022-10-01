import React, {useEffect, useState} from "react";
import { Breadcrumb, Button, ButtonGroup, Carousel, CarouselItem, Col, Container, Row, Spinner } from "react-bootstrap";
import SvgImage from "components/common/image/SvgImage";
import "./BondSearch.scss";
import { Query, CurrencyBucket, BondIssuer } from "graphql/types";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import  BondSearchContext, { BondSearchContextProps } from "./BondSearchContext";
import classNames from "classnames";
import { createChunk } from "components/common/utils";
import { CarouselWrapper } from "components/common";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { BondSearchCard, GlobalBondSearchProps } from "./BaseBondSearchCard";
import { FilterOptionSelectorComponent } from "../../layout/filter/FilterOptionSelectorComponent/FilterOptionSelectorComponent";
import { BondSearchResultInfo } from "./BondSearchResultInfo"
import {
    NumberOption,
    Option
} from "../../layout/filter/FilterOptionSelectorComponent/MultiSectionFilterOptionSelectorComponent";
import { BondIssueSizeCard } from "./BondSearchCards/BondIssueSizeCard";
import { BondIsmaYieldCard } from "./BondSearchCards/BondIsmaYieldCard";
import { BondYieldAndSubOrdinatedCard } from "./BondSearchCards/BondYieldAndSubOrdinatedCard";
import { BondRemainingLifeCard } from "./BondSearchCards/BondRemainingLifeCard";
import { BondDurationCard } from "./BondSearchCards/BondDurationCard";
import { AnleihenInflationCard } from "./BondSearchCards/AnleihenInflationCard";
import { AnleihenCourseTypeCard } from "./BondSearchCards/AnleihenCourseTypeCard";
import { BondEmissionCurrencyCard } from "./BondSearchCards/BondEmissionCurrencyCard";
import { BondMaturityAndDurationCard } from "./BondSearchCards/BondMaturityAndDurationCard";
import { BondMinimumInvestmentCard } from "./BondSearchCards/BondMinimumInvestmentCard";
import { BondFilterBySubOrdinateDebtCard } from "./BondSearchCards/BondFilterBySubOrdinateDebtCard";
import { AnleihenOutputVolumeCard } from "./BondSearchCards/AnleihenOutputVolumeCard";
import { BondTradingCurrencyCard } from "./BondSearchCards/BondTradingCurrencyCard";
import { AnleihenRightToCancelCard } from "./BondSearchCards/AnleihenRightToCancelCard";
import { AnleihenRightToCancelEmitentCard } from "./BondSearchCards/AnleihenRightToCancelEmitentCard";
import { AnleihenBondsTypeCard } from "./BondSearchCards/AnleihenBondsTypeCard"
import {
    IndexSelectorComponent,
    Option as IndexOption
} from "../../filters/IndexSelectorComponent/IndexSelectorComponent";
import {BondTypeOption, DEFAULT_BOND_OPTION, DEFAULT_BOND_OPTION_ID, renderDefaultQuery} from "../utils";
import {getInfonlineTag, guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";
import {Helmet} from "react-helmet";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";


export const BOND_CARDS: BondSearchCard[] = [
    BondIssueSizeCard, BondIsmaYieldCard, BondYieldAndSubOrdinatedCard, BondRemainingLifeCard,
    BondDurationCard, AnleihenInflationCard, AnleihenCourseTypeCard, BondEmissionCurrencyCard,
    BondMaturityAndDurationCard, BondMinimumInvestmentCard, BondFilterBySubOrdinateDebtCard, AnleihenOutputVolumeCard,
    BondTradingCurrencyCard, AnleihenRightToCancelCard, AnleihenRightToCancelEmitentCard, AnleihenBondsTypeCard
]
    .sort((a, b) => {
        if (a.enabled == b.enabled) {
            return 0;   
        }
        return a.enabled && !b.enabled ? -1 : 1;
    });

const TAGS: string[] =
    BOND_CARDS
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

const ALL_SELECTED = "Alle";

const DEFAULT_BOND_TYPE = "Unternehmensanleihe";

interface BondsSearchState {
    searchProps: GlobalBondSearchProps;
    category: string;
    overrideTypeId: boolean;
    cards: BondSearchCard[];
}

export function BondSearch() {
    let { loading, data } = useQuery<Query>(loader("./getBondSearchMetadata.graphql"));
    const [state, setState] = useState<BondsSearchState>({
        searchProps: {
            // topicId: null,
            typeId: null,
            // regionId: null,
            issuerId: null,
            regionId: null,
            nominalCurrencyId: null
        },
        overrideTypeId: false,
        category: ALL_SELECTED,
        cards: BOND_CARDS
    });

    useEffect(() => {
        trigInfonline("bondsSearch", "bonds_search_page");
    }, [])

    if (loading) {
        return (
            <div className="text-center py-2">
                <Spinner animation="border" />
            </div>
        );
    }

    const value: BondSearchContextProps = {
        bondTypes: [
            DEFAULT_BOND_OPTION,
            ...((data && [...data.bondTypes]) || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
                .map(current => ({id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || null} as BondTypeOption))
        ],
        bondIssuers: ((data && [...data.bondIssuers]) || []).sort((a, b) => (a?.legalName || "").localeCompare(b?.legalName || "")).map(current => current as BondIssuer),
        bondNominalCurrencies: ((data && [...data.bondNominalCurrencyBuckets]) || []).sort((a, b) => (a?.currency?.displayCode || "").localeCompare(b?.currency?.displayCode || "")).map(current => current as CurrencyBucket),
        bondTradingCurrencies: ((data && [...data.bondTradingCurrencyBuckets]) || []).sort((a, b) => (a?.currency?.displayCode || "").localeCompare(b?.currency?.displayCode || "")).map(current => current as CurrencyBucket)
    };

    const issuerOptions: (IndexOption & {value: number})[] =
        value.bondIssuers
            .map(current => ({id: "" + current?.id  || "" , name: current?.legalName || "", value: current?.id || 0}));

    let overrideTypeId = state.overrideTypeId ? state.searchProps.typeId : (value.bondTypes.find(item => item.name == DEFAULT_BOND_TYPE) || value.bondTypes.filter(item => item.id != DEFAULT_BOND_OPTION_ID)[0]).id;
    let overrideSearchProps = {...state.searchProps, typeId: overrideTypeId};

    const updateCategory = (value: string) => {
        trigInfonline(guessInfonlineSection(),getInfonlineTag(guessInfonlineSection(), 'tabs') + '_' + value.toUpperCase())
        const cards = value == ALL_SELECTED ? BOND_CARDS : BOND_CARDS.filter(current => current.tags && current.tags.indexOf(value) >= 0);
        setState({ ...state, category: value, cards: cards });
    }

    return (
        <BondSearchContext.Provider value={value}>
            <Helmet>
                <title>finanztreff.de - Anleihensuche | Smarte Suche | Suchen und vergleichen Sie Anleihen</title>
                <meta name="description"
                      content="Finden Sie alle Informationen zu Anleihen. Aktuelle Kurse, Charts & News, Kennzahlen, Rendite ✔, Outperformance Wahrscheinlichkeit, Sharp Ratio, Volatilität, Zinsen - bei finanztreff.de!"/>
                <meta name="keywords"
                      content="Anleihe, Bonds, Pfandbriefe, Obligationen, Schuldverschreibungen, Unternehmensanleihe, Staatsanleihe, Bundesanleihe, Länderanleihe, Rendite, Bundesanleihen Zinsen aktuell, Zinsen, Rendite, Kupon, Laufzeit, Renten, Anleihen-Arten"/>
            </Helmet>
            <>
                <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated) ,null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                </Helmet>
            </>
            <div className="page-container">
                <Container className="page-header px-1 py-2">
                    <Row>
                        <Col>
                            <Container>
                                <Breadcrumb>
                                    <Breadcrumb.Item href="#">Anleihen</Breadcrumb.Item>
                                    <Breadcrumb.Item href="#">Suche</Breadcrumb.Item>
                                </Breadcrumb>
                                <div className="d-flex justify-content-between mb-3">
                                    <div style={{marginTop: 3}} className="font-weight-bold d-flex ml-n2 ml-md-0">
                                        <SvgImage icon="icon_bulb_trading_ideen_white.svg" spanClass="arrow ml-n2 pr-md-0 pr-2 ml-md-0 ml-xl-0 svg-grey"
                                                  imgClass="flame-icon ml-1 ml-xl-n1 ml-md-n1" width="28"/>
                                        <h1 className={"font-weight-bold text-light fs-24px ml-n2 ml-md-0 ml-xl-0 page-title mb-n1"}>Smarte Suche Anleihen</h1>
                                    </div>
                                    <div className="fs-15px my-auto text-white cursor-pointer"
                                         onClick={() =>
                                             setState({
                                                 ...state,
                                                 searchProps: {
                                                     typeId: value.bondTypes[0].id, regionId: null,
                                                     nominalCurrencyId: null, issuerId: null
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
                                    <Col xl={3} md={4} xs={12} className="px-2">
                                        <FilterOptionSelectorComponent<number>
                                            name={"Anleihenart"}
                                            options={
                                                value.bondTypes
                                                    .filter(current => current.id != DEFAULT_BOND_OPTION_ID)
                                                    .map(current => {
                                                        return {
                                                            id: `${current?.id}`,
                                                            name: `${current?.name}`,
                                                            value: current?.value || null
                                                        } as Option<number>;
                                                    })
                                            }
                                            onSelect={(value: Option<number> | null) => {
                                                trigInfonline(guessInfonlineSection(), "type")
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
                                    <Col xl={3} md={4} xs={12} className="px-2">
                                        <IndexSelectorComponent<IndexOption & {value: number}>
                                            title="Emittent"
                                            // subtitle="Emittent"
                                            options={issuerOptions}
                                            selected={(state.searchProps.issuerId && ("" + state.searchProps.issuerId)) || null}
                                            onSelect={(ev ) => {
                                                trigInfonline(guessInfonlineSection(), "issuer")
                                                setState({
                                                    ...state,
                                                    searchProps: {
                                                        ...state.searchProps,
                                                        issuerId: ev && ev.selected?.value || null
                                                    }
                                                })
                                            }}
                                        />
                                    </Col>
                                    <Col xl={3} md={4} xs={12} className="px-2">
                                        <FilterOptionSelectorComponent<number>
                                            name={"Währung"}
                                            options={
                                                value.bondNominalCurrencies.map(current => {
                                                    return {
                                                        id: "" + current?.currency?.id || "0",
                                                        name:
                                                            <>
                                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + current.currency?.displayCode?.toLowerCase() + ".svg"}
                                                             alt="" className="mr-1" width="24px" height="16px" />
                                                                {current?.currency?.displayCode}
                                                            </>,
                                                        value: current.currency?.id || 0};
                                                })
                                            }
                                            onSelect={(value: NumberOption | null) => {
                                                trigInfonline(guessInfonlineSection(), "currency")
                                                setState({
                                                    ...state,
                                                    searchProps: {
                                                        ...state.searchProps,
                                                        nominalCurrencyId: value?.value || null
                                                    }
                                                })
                                            }}
                                            selected={"" + state.searchProps.nominalCurrencyId}
                                        />
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-center my-2">
                                    <BondSearchResultInfo criteria={renderDefaultQuery(overrideSearchProps, value)}
                                                          details={overrideSearchProps} enabled />
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
                    <BondSearchCarousel cards={state.cards} props={{
                        ...overrideSearchProps,
                        typeId: overrideSearchProps.typeId || value.bondTypes[0].id
                    }}/>
                </Container>
            </div>
        </BondSearchContext.Provider>
    );
}

interface BondSearchCarouselProps {
    cards: BondSearchCard[];
    props: GlobalBondSearchProps;
}

function BondSearchCarousel({cards, props}: BondSearchCarouselProps) {
    const bondSearchCarouselItemsSize = useBootstrapBreakpoint({
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
            
            controls={bondSearchCarouselItemsSize.showControls}
            indicators={bondSearchCarouselItemsSize.showControls}
            as={CarouselWrapper}
        >
            {
                createChunk(cards, bondSearchCarouselItemsSize.itemsPerSlide).map((items: BondSearchCard[], index: number) =>
                    <CarouselItem key={index}>
                        <Row className="px-md-2 px-sm-0">
                            {
                                items.map((Card: BondSearchCard, index: number) =>
                                    <Card key={"FundSearchPage-card-" + index}
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
