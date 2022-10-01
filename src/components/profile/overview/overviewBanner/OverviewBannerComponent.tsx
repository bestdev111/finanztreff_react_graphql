import { Carousel, Col, Row } from 'react-bootstrap';
import { PortoflioItem } from './PortfolioItem';
import { WatchlistItem } from './WatchlistItem';
import { LimitEntry, Portfolio, Watchlist } from '../../../../graphql/types';
import { CarouselWrapper } from "../../../common";
import { LimitItem } from './LimitItem';
import {useEffect, useState} from 'react';
import classNames from 'classnames';
import { guessInfonlineSection, trigInfonline } from "../../../common/InfonlineService";
import { Link } from 'react-router-dom';

export function OverviewBannerComponent(props: OverviewBannerProps) {

    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        if (activeIndex === 0) {
            trigInfonline(guessInfonlineSection(), "portfolios")
        }
        if (activeIndex === 1) {
            trigInfonline(guessInfonlineSection(), "watchlists")
        }
        else if (activeIndex === 2){
            trigInfonline(guessInfonlineSection(), "limits")
        }
    }, [activeIndex])

    return (
        <>
            <section className="home-banner mein-finanztreff overview">
                <div className="top-row">
                    <div className="container">
                        <Row className="row">
                            {!!props.page ?
                                <Col className="page-path">
                                    <Link style={{ textDecoration: "none" }} className="page-path" to={"/mein-finanztreff/"}>Mein finanztreff </Link>
                                    / {props.page === "watchlists" ? "Watchlisten" : "Portfolios"}
                                </Col>
                            :
                                <Col className="page-path">Mein finanztreff</Col>
                            }
                        </Row>
                    </div>
                </div>
                <Carousel className="carousel-lg overview-page-banner"
                    activeIndex={activeIndex}
                    prevIcon={!!!props.page && <>
                        <span className="move-arrow svg-icon" onClick={() => setActiveIndex(activeIndex == 0 ? 2 : activeIndex == 2 ? 1 : 0)}>
                            <img src="/static/img/svg/icon_direction_left_white.svg" className="svg-convert" alt="" />
                        </span>
                        <span onClick={() => {
                            setActiveIndex(0)
                        }}
                            className={classNames("fs-13px mt-xl-1  p-sm-1 mr-xl-2 p-xl-1 ", activeIndex == 0 && "rounded bg-white text-dark")}
                        >
                            Portfolios
                        </span>
                        <span onClick={() => {
                            setActiveIndex(1)
                        }}
                            className={classNames("fs-13px mt-xl-1  p-sm-1 mr-xl-2 p-xl-1 ", activeIndex == 1 && "rounded bg-white text-dark")}
                        >
                            Watchlisten
                        </span>
                        <span onClick={() => {
                            setActiveIndex(2)
                        }}
                            className={classNames("fs-13px mt-xl-1  p-sm-1 mr-xl-2 p-xl-1 ", activeIndex == 2 && "rounded bg-white text-dark")}
                        >
                            Limits
                        </span>
                    </>}
                    nextIcon={!!!props.page && <span className="move-arrow svg-icon" onClick={() => setActiveIndex(activeIndex == 0 ? 1 : activeIndex == 1 ? 2 : 0)}>
                        <img src="/static/img/svg/icon_direction_right_white.svg" className="svg-convert" alt="" />
                    </span>}

                    as={CarouselWrapper}>
                    {props.portfolios &&
                        <Carousel.Item key="0">
                            <PortoflioItem userName={props.userName} portfolios={props.portfolios} />
                        </Carousel.Item>
                    }
                    {props.watchlists &&
                        <Carousel.Item key="1">
                            <WatchlistItem userName={props.userName} watchlists={props.watchlists} />
                        </Carousel.Item>
                    }

                    {props.limits &&
                        <Carousel.Item key="2">
                            <LimitItem userName={props.userName} limits={props.limits} refetch={() => props.refetch()} />
                        </Carousel.Item>
                    }
                </Carousel>

                <Carousel className="carousel-xs"
                    prevIcon={!!!props.page && <span className="move-arrow svg-icon"><img src="/static/img/svg/icon_direction_left_white.svg" className="svg-convert" alt="" /></span>}
                    nextIcon={!!!props.page && <span className="move-arrow svg-icon"><img src="/static/img/svg/icon_direction_right_white.svg" className="svg-convert" alt="" /></span>}
                    as={CarouselWrapper}>
                    {props.portfolios &&
                        <Carousel.Item key="0">
                            <PortoflioItem userName={props.userName} portfolios={props.portfolios} />
                        </Carousel.Item>
                    }

                    {props.watchlists &&
                        <Carousel.Item key="1">
                            <WatchlistItem userName={props.userName} watchlists={props.watchlists} />
                        </Carousel.Item>
                    }

                    {props.limits &&
                        <Carousel.Item key="2">
                            <LimitItem userName={props.userName} limits={props.limits} refetch={() => props.refetch()} />
                        </Carousel.Item>
                    }
                </Carousel>
            </section>
        </>
    )

}
interface OverviewBannerProps {
    userName: String;
    portfolios?: Array<Portfolio>;
    watchlists?: Array<Watchlist>;
    limits?: Array<LimitEntry>;
    page?: string;
    refetch: (value?: LimitEntry) => void;
}
