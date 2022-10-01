import classNames from "classnames";
import { CarouselWrapper, PortfolioInstrumentAdd } from "components/common";
import { DropdownRouterLink } from "components/common/DropDownRouterLink";
import SvgImage from "components/common/image/SvgImage";
import { AssetAllocationItem } from "components/profile";
import { AssetAllocationMobileItem } from "components/profile/common/banner/AssetAllocationMobileItem";
import { PortfolioSettings } from "components/profile/modals/PortfolioWatchlistSettings/PortfolioSettings";
import { TransactionImportModal } from "components/profile/modals/TransactionImportModal/TransactionImportModal";
import { calculateChange, calculatePortfolio, calculatePortfolioErtrage, getMinDate } from "components/profile/utils";
import { Portfolio, PortfolioPerformanceEntry } from "graphql/types";
import moment from "moment";
import {Button, Carousel, CarouselItem, Col, Container, Nav, NavDropdown, Row, Spinner} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { fullDateTimeFormat, numberFormat, numberFormatDecimals, numberFormatWithSign, REALDATE_FORMAT } from "utils";
import { PortfolioAllertModal } from "./PortfolioAlert/PortfolioAlertModal";
import './PortfolioBanner.scss';
import { AccountOverview, LastTransactionItem, PortfolioDevelopmentItem } from "./PortfolioBannerSlides";
import {useState} from "react";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

export function PortfolioBanner(props: PortfolioBannerProps) {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const startDate = getMinDate(props.portfolio);
    const [initial, yesterday, last] = calculatePortfolio(props.portfolio);
    const ertrage: number = calculatePortfolioErtrage(props.portfolio);
    const total = last + ertrage;
    const [diff, diffPct] = calculateChange(initial, total);
    const broker = "Deutsche Bank"

    let changeSlide = (selectedIndex: number) => {
        setActiveIndex(selectedIndex);
    };

    const location = useLocation();
    if(location.state==="scrollToTop"){
        window.scrollTo(0, 0);
        location.state=undefined;
    }

    const notificationShow = props.portfolio.eom || props.portfolio.wd1 || props.portfolio.wd2 || props.portfolio.wd3 || props.portfolio.wd4
        || props.portfolio.wd5 || props.portfolio.wd6 || props.portfolio.wd7;

    return (
        <Container className="portoflio-new-banner bg-gray-dark">
            <Row className="d-xl-flex d-lg-flex d-md-flex d-sm-none align-items-center">
                <Col xs={4} className="px-0">
                    <Link className="fs-13px text-decoration-none text-opacity-white" to={"/mein-finanztreff/portfolios/"}>Mein finanztreff / Portfolios / </Link><span className="fs-13px text-opacity-white">{props.portfolio.name}</span>
                </Col>
                <Col xs={8} className="pr-0">
                    <Row className="justify-content-end pr-0 pb-1">
                        <PortfolioAllertModal portfolio={props.portfolio}>
                            <span className="d-flex mr-2 align-items-center">
                                {(props.portfolio.portfolioAlert || props.portfolio.positionAlert) ?
                                    <SvgImage icon="icon_portfolioalert_on_white.svg" width="23" />
                                    :
                                    <SvgImage icon="icon_portfolioalert_off_white.svg" width="23" />
                                }
                                <span className="ml-1">Portfolioalert</span>
                            </span>
                        </PortfolioAllertModal>
                        {props.portfolio.real && props.realportfolio ?
                            <TransactionImportModal portfolio={props.portfolio} onComplete={props.refreshTrigger}>
                                <span className="d-flex align-items-center text-white">
                                    <SvgImage icon="icon_import_portfolioitem_orange.svg" width="25" />
                                    <span className="ml-1">Order-PDFs importieren</span>
                                </span>
                            </TransactionImportModal>
                            :
                            <PortfolioInstrumentAdd
                                portfolioId={props.portfolio.id} onComplete={() => props.refreshTrigger()}
                                variant="link" className="text-white p-0 m-0 mr-n2"
                            >
                                <span className="d-flex mr-2 align-items-center">
                                    <SvgImage icon="icon_plus_white.svg" width="23" />
                                    <span className="ml-1">Wertpapier</span>
                                </span>
                            </PortfolioInstrumentAdd>
                        }
                        <PortfolioSettings portfolio={props.portfolio} onComplete={props.refreshTrigger}>
                            <span className="d-flex align-items-center mx-xl-0 mx-lg-0 mx-md-0 mx-sm-n2">
                                <SvgImage icon="icon-gear-white.svg" width="23" />
                                <span className="ml-1">Einstellungen</span>
                            </span>
                        </PortfolioSettings>
                        {/* <span  onClick={() => {window.print()}} className="d-flex align-items-center mx-xl-0 mx-lg-0 mx-md-0 mx-sm-n2 mr-xl-1 mr-lg-0">
                                <SvgImage style={{filter: "brightness(0) invert(1)"}} icon="icon-print.svg" width="19" />
                                <span className="ml-1 mr-2"></span>
                        </span> */}
                    </Row>
                </Col>
            </Row>
            <Row className="d-xl-none d-lg-none d-md-flex">
                {props.portfolio.real && props.realportfolio &&
                    <Col xs={12} className="pl-0 text-orange line-height-1 font-weight-bold fs-11px mb-n2">
                        Real Portfolio - {broker}
                    </Col>
                }
                <Col className="px-0 ml-n3 dropdown-menu-banner">
                    <NavDropdown title={
                        <>
                            {notificationShow &&
                                <SvgImage icon="icon_envelope_filled_white.svg" width="18" imgClass="mt-n1" />
                            }
                            <Button variant="" className="text-white p-0 m-0">
                                <h1 className="fs-20-24-32 d-inline">{props.portfolio.name}</h1>
                                <SvgImage icon="icon_direction_down_white.svg" width="30" imgClass="pb-1" />
                            </Button>
                        </>}
                        className={"dropdown-select no-after-pointer dark-drop"}
                        id={"portfolio-dropdown"}>
                        <Nav className={'ml-sm-2 mt-sm-1'}>
                        {props.portfolios.filter(current => current.id !== props.portfolio.id).map(current =>
                            <NavDropdown.Item className={'px-sm-0'}  as={DropdownRouterLink} key={current.id} href={"/mein-finanztreff/portfolio/" + current.id}>{current.name}</NavDropdown.Item>
                        )}
                        </Nav>
                    </NavDropdown>
                </Col>
                <Col className="d-flex justify-content-end px-0 pb-1 mr-n3">
                    <PortfolioAllertModal portfolio={props.portfolio}>
                        {(props.portfolio.portfolioAlert || props.portfolio.positionAlert) ?
                            <SvgImage icon="icon_portfolioalert_on_white.svg" width="23" spanClass="mr-2 pr-1" />
                            :
                            <SvgImage icon="icon_portfolioalert_off_white.svg" width="23" spanClass="pr-2"/>
                        }
                    </PortfolioAllertModal>
                    {props.portfolio.real && props.realportfolio ?
                        <TransactionImportModal portfolio={props.portfolio} onComplete={props.refreshTrigger}>
                            <SvgImage icon="icon_plus_white.svg" width="23" spanClass="pt-2 px-1" />
                        </TransactionImportModal>
                        :
                        <PortfolioInstrumentAdd
                            portfolioId={props.portfolio.id} onComplete={() => props.refreshTrigger()}
                            variant="link" className="text-white p-0 m-0 mr-n2 pr-n1"
                        >
                            <SvgImage icon="icon_plus_white.svg" width="23" spanClass="" />
                        </PortfolioInstrumentAdd>
                    }
                    <PortfolioSettings portfolio={props.portfolio} onComplete={props.refreshTrigger}>
                        <SvgImage icon="icon-gear-white.svg" width="23" spanClass="" />
                    </PortfolioSettings>
                </Col>
            </Row>
            <Row className="border-bottom-2 border-dark pb-1">
                <Col xl={6} lg={4} className="px-0 d-xl-block d-lg-block d-md-block d-sm-none dropdown-menu-banner-xl">
                    {props.portfolio.real && props.realportfolio &&
                        <div className="text-orange font-weight-bold" style={{ paddingLeft: "2px" }}>Real Portfolio - {broker}</div>
                    }
                    <NavDropdown title={
                        <>
                            {notificationShow &&
                                <SvgImage icon="icon_envelope_filled_white.svg" imgClass="ml-n1 mt-n2 width-20-30-40" />
                            }
                            <Button variant="" className="text-white p-0 m-0 mt-xl-0 mt-lg-n2">
                                <h1 className="fs-22-24-32 d-inline">{props.portfolio.name}</h1>
                                <SvgImage icon="icon_direction_down_white.svg" width="30" imgClass="pb-3" />
                            </Button>
                        </>}
                        className={classNames("dropdown-select no-after-pointer dark-drop", (props.portfolio.real && props.realportfolio) ? "mt-xl-0 mt-lg-n2" : "mt-xl-3 mt-lg-3")}
                        id={"portfolio-dropdown-xl"}>
                        {props.portfolios.filter(current => current.id !== props.portfolio.id).map(current =>
                            <NavDropdown.Item onClick={()=>  trigInfonline("mf_portfolios", "portfolio_page")} as={DropdownRouterLink} key={current.id} href={"/mein-finanztreff/portfolio/" + current.id}>{current.name}</NavDropdown.Item>
                        )}
                    </NavDropdown>
                </Col>
                <Col xl={3} lg={4} sm={6} className="text-white pr-xl-5 pr-xl-2">
                    <Row className="justify-content-xl-end justify-content-lg-end justify-content-md-end justify-content-md-start fs-11-13-15 text-truncate">
                        <div>Investiertes Kapital: {numberFormat(initial)} EUR</div>
                    </Row>
                    <Row className="justify-content-xl-end justify-content-lg-end justify-content-md-end justify-content-md-start fs-22-24-32 mt-n1">
                        <div className="">{numberFormatDecimals(total, 2, 2)}<span className="fs-sm-12px pl-2">EUR</span></div>
                    </Row>
                </Col>
                <Col xl={3} lg={4} sm={6} className="text-white">
                    <Row className="justify-content-end fs-11-13-13 text-opacity-white">
                        <div className=''>Seit Auflage am {REALDATE_FORMAT(startDate)}</div>
                    </Row>
                    <Row className="justify-content-end fs-15-20-28 text-truncate">
                        <div className={classNames("px-xl-3 px-lg-2 px-md-1 px-sm-1", getBackgroundColor(diffPct))}>
                            {diff === 0 ?
                                <SvgImage spanClass="pr-xl-2 pr-lg-2 pr-md-1 pr-sm-1" icon={getArrowMovement(0)} imgClass="mt-n1 width-20-30-40" />
                                : <SvgImage spanClass="pr-xl-3 pr-lg-2 pr-md-1 pr-sm-1" icon={getArrowMovement(diff)} imgClass="mt-n1 width-15-20-30" />

                            }
                            <span className="pr-xl-4 pr-lg-3 pr-md-2 pr-sm-1">{numberFormatWithSign(diff)}</span>
                            <span className="">{numberFormatWithSign(diffPct)}%</span>
                        </div>
                    </Row>
                    <Row className="justify-content-end fs-11-13-13 text-opacity-white">
                        <div className=''>Stand: {fullDateTimeFormat(moment())} Uhr</div>
                    </Row>
                </Col>
            </Row>
            <Row className="carousel-portfolio-overview pr-dn">
                <Carousel
                    activeIndex={activeIndex} onSelect={changeSlide}
                    prevIcon={<span className="move-arrow svg-icon"><img src="/static/img/svg/icon_direction_left_white.svg" className="svg-convert" alt="" /></span>}
                    nextIcon={<span className="move-arrow svg-icon"><img src="/static/img/svg/icon_direction_right_white.svg" className="svg-convert" alt="" /></span>}
                    as={CarouselWrapper}
                    onSlid={(eventKey: number) => {
                        trigInfonline(guessInfonlineSection(), `portfolio_banner_item_${eventKey}`);
                        setActiveIndex(eventKey);
                    }}
                >
                    <CarouselItem key={0}>
                        <PortfolioDevelopmentItem portfolio={props.portfolio} refreshTrigger={props.refreshTrigger} />
                    </CarouselItem>
                    <CarouselItem key={1}>
                        <AssetAllocationItem portfolio={props.portfolio} isWatchlist={false} />
                        <AssetAllocationMobileItem portfolio={props.portfolio} isWatchlist={false} />
                    </CarouselItem>
                    <CarouselItem key={2}>
                        <LastTransactionItem portfolio={props.portfolio} performanceEntries={props.performanceEntries} />
                    </CarouselItem>
                    <CarouselItem key={3}>
                        <AccountOverview portfolio={props.portfolio} refreshTrigger={props.refreshTrigger} />
                    </CarouselItem>
                </Carousel>
            </Row>
        </Container>
    );
}


interface PortfolioBannerProps {
    portfolio: Portfolio;
    performanceEntries: PortfolioPerformanceEntry[];
    portfolios: Portfolio[];
    realportfolio?: boolean
    refreshTrigger: () => void;
}


function getBackgroundColor(value: number) {
    return value > 0 ? "bg-green" : value < 0 ? "bg-pink" : "bg-gray";
}

function getArrowMovement(value: number) {
    return value > 0 ? "icon_arrow_long_up_white.svg" : value < 0 ? "icon_arrow_long_down_white.svg" : "icon_arrow_short_right_white.svg";
}
