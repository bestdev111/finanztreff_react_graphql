import { Button, Carousel, Col, Container, NavDropdown, Row } from 'react-bootstrap';
import { AssetAllocationItem } from '../../index';
import { Watchlist } from 'graphql/types';
import { WatchlistInstrumentAdd } from "../../../common/profile/WatchlistInstrumentAdd";
import { CarouselWrapper } from "../../../common";
import { DropdownRouterLink } from "../../../common/DropDownRouterLink";
import { Link } from 'react-router-dom';
import { OverviewItem } from '.';
import { AssetAllocationMobileItem } from 'components/profile/common/banner/AssetAllocationMobileItem';
import { WatchlistSettings } from 'components/profile/modals/PortfolioWatchlistSettings/WatchlistSettings';
import SvgImage from 'components/common/image/SvgImage';
import {useState} from "react";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface WatchlistBannerProps {
    watchlist: Watchlist;
    watchlists: Watchlist[];
    refreshTrigger: () => void;
}

export function WatchlistBannerComponent(props: WatchlistBannerProps) {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const notificationShow = props.watchlist.eom || props.watchlist.wd1 || props.watchlist.wd2 || props.watchlist.wd3 || props.watchlist.wd4
        || props.watchlist.wd5 || props.watchlist.wd6 || props.watchlist.wd7;

    let changeSlide = (selectedIndex: number) => {
        setActiveIndex(selectedIndex);
    };

    return (
        <>
            <section className="home-banner mein-finanztreff">
                <div className="top-row">
                    <Container>
                        <Row>
                            <Col className="page-path">
                                <Link style={{ textDecoration: "none" }} className="page-path" to={"/mein-finanztreff/watchlisten"}>
                                    Mein finanztreff / Watchlisten</Link> / {props.watchlist.name}
                                </Col>
                            <Col className="action-icons-holder bigger-icons with-legend d-flex mein-watchlist">
                                <WatchlistInstrumentAdd
                                    watchlistId={props.watchlist.id} onComplete={() => props.refreshTrigger()}
                                    variant="link" className="text-white p-0 m-0">
                                    <span className="svg-icon action-icons">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_plus_white.svg"} alt="" className="plus-butt-icon" />
                                        <span className={"d-none d-md-block"}>Wertpapier</span>
                                    </span>
                                </WatchlistInstrumentAdd>
                                <WatchlistSettings watchlist={props.watchlist} onComplete={props.refreshTrigger} className="p-0 m-0 ml-1">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon-gear-white.svg"} alt="" className="options-butt-icon" />
                                    <span className={"d-none d-md-block"}>Einstellungen</span>
                                </WatchlistSettings>
                                {/* <span onClick={() => {window.print()}} className="d-flex align-items-center mx-xl-0 mx-lg-0 mx-md-0 mx-sm-n2">
                                <span className="ml-1 mr-2"></span>
                                <SvgImage style={{filter: "brightness(0) invert(1)"}} icon="icon-print.svg" width="19" />
                                <span className="ml-1"></span>
                                </span> */}
                            </Col>
                        </Row>
                        <Row className="">
                            <Col xl={5} lg={4} md={1} className="pl-0">
                                <NavDropdown title={
                                    <>
                                    {notificationShow &&
                                        < img src={process.env.PUBLIC_URL + "/static/img/svg/icon_envelope_filled_white.svg"} width="28" alt="" className="" />
                                    }
                                        <Button variant="inline" className="text-white p-0 m-0 mt-xl-0 mt-lg-n2">
                                            <h1 className="fs-22-24-32 d-inline">{props.watchlist.name}</h1>
                                            <SvgImage icon="icon_direction_down_white.svg" width="30" imgClass='mt-n2' />
                                        </Button>
                                    </>}
                                    className={"dropdown-select no-after-pointer dark-drop"}
                                    id={"portfolio-dropdown"}>
                                    {props.watchlists.filter(current => current.id !== props.watchlist.id).map(current =>
                                        <NavDropdown.Item onClick={()=>  trigInfonline(guessInfonlineSection(), "watchlist_page")} as={DropdownRouterLink} key={current.id} href={"/mein-finanztreff/watchlist/" + current.id}>{current.name}</NavDropdown.Item>
                                    )}
                                </NavDropdown>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Carousel
                    activeIndex={activeIndex} onSelect={changeSlide}
                    prevIcon={
                        <span className="move-arrow svg-icon">
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_left_white.svg"} className="svg-convert" alt="" />
                        </span>}
                    nextIcon={
                        <span className="move-arrow svg-icon">
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_right_white.svg"} className="svg-convert" alt="" />
                        </span>
                    }
                    prevLabel={"Überblick"}
                    nextLabel={"Asset Alocation"}
                    as={CarouselWrapper}
                    onSlid={(eventKey: number) => {
                        trigInfonline(guessInfonlineSection(), `watchlist_banner_item_${eventKey}`);
                        setActiveIndex(eventKey);
                    }}
                >
                    <Carousel.Item key={0}>
                        <OverviewItem watchlist={props.watchlist} />
                    </Carousel.Item>
                    <Carousel.Item key={1}>
                        <AssetAllocationItem watchlist={props.watchlist} isWatchlist={true} />
                        <AssetAllocationMobileItem watchlist={props.watchlist} isWatchlist={true}/>
                    </Carousel.Item>
                </Carousel>
            </section>
        </>

    )
}
