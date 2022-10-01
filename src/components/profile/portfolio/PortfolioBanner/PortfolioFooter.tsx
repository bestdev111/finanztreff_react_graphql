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
import { Button, Carousel, CarouselItem, Col, Container, NavDropdown, Row, Spinner } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { fullDateTimeFormat, numberFormat, numberFormatDecimals, numberFormatWithSign, REALDATE_FORMAT } from "utils";
import { PortfolioAllertModal } from "./PortfolioAlert/PortfolioAlertModal";
import './PortfolioBanner.scss';
import { AccountOverview, LastTransactionItem, PortfolioDevelopmentItem } from "./PortfolioBannerSlides";
import { useState } from "react";
import { guessInfonlineSection, trigInfonline } from "../../../common/InfonlineService";

export function PortfolioFooter(props: PortfolioBannerProps) {
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
    if (location.state === "scrollToTop") {
        window.scrollTo(0, 0);
        location.state = undefined;
    }

    const notificationShow = props.portfolio.eom || props.portfolio.wd1 || props.portfolio.wd2 || props.portfolio.wd3 || props.portfolio.wd4
        || props.portfolio.wd5 || props.portfolio.wd6 || props.portfolio.wd7;

    return (
        <Container className="mb-2 px-xl-3 px-lg-3 px-md-3 px-sm-0">
            <Container className="border-top-2 pb-4" style={{borderColor: "#D1D1D1"}}/>
            <Container className="portoflio-new-banner footer bg-white" style={{ boxShadow: "#00000029 0px 3px 6px" }}>
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
                                    <SvgImage icon="icon_envelope_filled_dark.svg" width="18" imgClass="mt-n1" />
                                }
                                <Button variant="" className="p-0 m-0">
                                    <h1 className="fs-20-24-32 d-inline">{props.portfolio.name}</h1>
                                    <SvgImage icon="icon_direction_down_dark.svg" width="30" imgClass="pb-1" />
                                </Button>
                            </>}
                            className={"dropdown-select portfolio no-after-pointer dark-drop"}
                            id={"portfolio-dropdown"}>
                            {props.portfolios.filter(current => current.id !== props.portfolio.id).map(current =>
                                <NavDropdown.Item as={DropdownRouterLink} key={current.id} href={"/mein-finanztreff/portfolio/" + current.id}>{current.name}</NavDropdown.Item>
                            )}
                        </NavDropdown>
                    </Col>
                </Row>
                <Row className="pb-1">
                    <Col xl={6} lg={4} className="px-0 d-xl-block d-lg-block d-md-block d-sm-none dropdown-menu-banner-xl">
                        {props.portfolio.real && props.realportfolio &&
                            <div className="text-orange font-weight-bold" style={{ paddingLeft: "2px" }}>Real Portfolio - {broker}</div>
                        }
                        <NavDropdown title={
                            <>
                                {notificationShow &&
                                    <SvgImage icon="icon_envelope_filled_dark.svg" imgClass="ml-n1 mt-n2 width-20-30-40" />
                                }
                                <Button variant="" className="p-0 m-0 mt-xl-0 mt-lg-n2">
                                    <h1 className="fs-22-24-32 d-inline">{props.portfolio.name}</h1>
                                    <SvgImage icon="icon_direction_down_dark.svg" width="30" imgClass="pb-3" />
                                </Button>
                            </>}
                            className={classNames("dropdown-select no-after-pointer dark-drop", (props.portfolio.real && props.realportfolio) ? "mt-xl-0 mt-lg-n2" : "mt-xl-3 mt-lg-3")}
                            id={"portfolio-dropdown-xl"}>
                            {props.portfolios.filter(current => current.id !== props.portfolio.id).map(current =>
                                <NavDropdown.Item onClick={() => trigInfonline("mf_portfolios", "portfolio_page")} as={DropdownRouterLink} key={current.id} href={"/mein-finanztreff/portfolio/" + current.id}>{current.name}</NavDropdown.Item>
                            )}
                        </NavDropdown>
                    </Col>
                    <Col xl={3} lg={4} sm={6} className="pr-xl-5 pr-xl-2">
                        <Row className="justify-content-xl-end justify-content-lg-end justify-content-md-end justify-content-md-start fs-11-13-15 text-truncate">
                            <div>Investiertes Kapital: {numberFormat(initial)} EUR</div>
                        </Row>
                        <Row className="justify-content-xl-end justify-content-lg-end justify-content-md-end justify-content-md-start fs-22-24-32 mt-n1">
                            <div className="">{numberFormatDecimals(total, 2, 2)}<span className="fs-sm-12px pl-2">EUR</span></div>
                        </Row>
                    </Col>
                    <Col xl={3} lg={4} sm={6} className="" >
                        <Row className="justify-content-end fs-11-13-13 text-gray">
                            <div className=''>Seit Auflage am {REALDATE_FORMAT(startDate)}</div>
                        </Row>
                        <Row className="justify-content-end fs-15-20-28 text-truncate ">
                            <div className={classNames("px-xl-3 px-lg-2 px-md-1 px-sm-1 text-white", getBackgroundColor(diffPct))}>
                                {diff === 0 ?
                                    <SvgImage spanClass="pr-xl-2 pr-lg-2 pr-md-1 pr-sm-1" icon={getArrowMovement(0)} imgClass="mt-n1 width-20-30-40" />
                                    : <SvgImage spanClass="pr-xl-3 pr-lg-2 pr-md-1 pr-sm-1" icon={getArrowMovement(diff)} imgClass="mt-n1 width-15-20-30" />

                                }
                                <span className="pr-xl-4 pr-lg-3 pr-md-2 pr-sm-1">{numberFormatWithSign(diff)}</span>
                                <span className="">{numberFormatWithSign(diffPct)}%</span>
                            </div>
                        </Row>
                        <Row className="justify-content-end fs-11-13-13 text-gray">
                            <div className=''>Stand: {fullDateTimeFormat(moment())} Uhr</div>
                        </Row>
                    </Col>
                </Row>
            </Container>
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