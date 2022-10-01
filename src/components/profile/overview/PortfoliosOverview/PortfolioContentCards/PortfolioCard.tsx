import classNames from "classnames";
import { CarouselWrapper } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { AccountOverviewModal } from "components/profile/modals";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { PortfolioSettings } from "components/profile/modals/PortfolioWatchlistSettings/PortfolioSettings";
import { PortfolioAllertModal } from "components/profile/portfolio/PortfolioBanner/PortfolioAlert/PortfolioAlertModal";
import { getDataForAssetAllocationPieCharts } from "components/profile/utils";
import { Portfolio } from "graphql/types";
import { useState, useEffect } from "react";
import { Col, Carousel, Button, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChartViewCard } from "./PortfolioCardViews/ChartViewCard";
import { PerformanceViewCard } from "./PortfolioCardViews/PerformanceViewCard";

export function PortfolioCard({ portfolio, index, memo, refreshTrigger, realportfolio }: PortfolioCardProps) {
    const [showMemo, setShowMemo] = useState(memo);
    useEffect(() => {
        setShowMemo(memo);
    }, [memo]);

    let listIsins: string[] = [];
    portfolio.entries?.map(entry => entry && entry.instrument && !!entry.instrument.isin && listIsins.push(entry.instrument.isin));

    const notificationShow = portfolio.eom || portfolio.wd1 || portfolio.wd2 || portfolio.wd3 || portfolio.wd4
        || portfolio.wd5 || portfolio.wd6 || portfolio.wd7;

    return (
        <Container key={index} className="" style={{ boxShadow: "0px 3px 6px #00000029" }}>
            {portfolio.real && realportfolio && 
                <Row className="text-white bg-orange position-relative" style={{ height: "5px" }}></Row>
            }
            <Row className="portfolios-overview">
                <Col className="bg-white w-90" xs={11}>
                    <Container className={classNames("portfolio-card-height pb-2 px-0", (portfolio.real && realportfolio) ? "pt-0 real" : "pt-2" )}>
                        <Row className="fs-12px mb-1 px-2">
                            {notificationShow &&
                                < img src={process.env.PUBLIC_URL + "/static/img/svg/icon_envelope_filled_dark.svg"} width="20" alt="" />
                            }
                            <Link className="fs-18px font-weight-bold" onClick={()=>window.scrollTo({ top: 0, behavior: 'smooth' })}
                             to={{pathname: realportfolio ? `/mein-finanztreff-realportfolios/portfolio/${portfolio.id}` : `/mein-finanztreff/portfolio/${portfolio.id}`,state: "scrollToTop"}}>{portfolio.name}</Link>
                        </Row>
                        {portfolio.real && realportfolio && 
                            <Row className="text-orange mb-2 fs-12px line-height-1 mt-n1 px-2">
                                Real-Portfolio
                            </Row>
                        }
                        <Row className="">
                            <Col className="px-0">
                                <Carousel
                                    className="portfolio-box-carousel pb-3"
                                    touch={true}
                                    prevIcon={<SvgImage icon="icon_direction_left_dark.svg" spanClass="move-arrow" convert={false} />}
                                    nextIcon={<SvgImage icon="icon_direction_right_dark.svg" spanClass="move-arrow" convert={false} />}
                                    controls={true}
                                    indicators={true}
                                    as={CarouselWrapper}
                                >
                                    <Carousel.Item key={0} className={classNames("pb-4")} >
                                        <PerformanceViewCard portfolio={portfolio} refreshTrigger={refreshTrigger} />
                                    </Carousel.Item>
                                    <Carousel.Item key={1} className="pb-4" >
                                        <ChartViewCard portfolio={portfolio} refreshTrigger={refreshTrigger} />
                                    </Carousel.Item>
                                </Carousel>
                            </Col>
                            <div className="d-none">
                                <div>
                                    {
                                        getDataForAssetAllocationPieCharts("Gattung", portfolio.entries, portfolio).map((each: any, index: any) =>
                                            <span key={index} id="portfolios-types-list">{each.name}</span>
                                        )
                                    }
                                </div>
                            </div>
                        </Row>
                        {showMemo && portfolio.memo && portfolio.memo !== "" &&
                            <Row className="py-1">
                                <Col>
                                    <span className="svg-icon">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="24" alt="" className="ml-n2" />
                                    </span>
                                    <span className="pl-2" ><i>{portfolio.memo}</i></span>
                                </Col>
                            </Row>
                        }
                    </Container>
                </Col>
                <Col className="bg-gray-light px-2 text-center w-10" xs={1}>
                    <Row className="justify-content-between">
                        <Col className="px-0 text-center">
                            <PortfolioSettings portfolio={portfolio} onComplete={refreshTrigger} className="top d-flex justify-content-center d-none">
                                <span className="mt-2">
                                    <SvgImage icon={"icon_menu_vertical_blue.svg"} spanClass="cursor-pointer" convert={false} width="27" />
                                </span>
                            </PortfolioSettings>
                        </Col>
                        <Col className="px-0 mt-5 pt-4">
                            <Button variant="link" className="px-2 mt-3" disabled={portfolio.memo === "" || !portfolio.memo} onClick={() => setShowMemo(!showMemo)}>
                                <SvgImage icon={"icon_note.svg"} convert={false} width="28" />
                            </Button>
                            {(portfolio.portfolioAlert || portfolio.positionAlert) ?
                                <PortfolioAllertModal portfolio={portfolio}>
                                    <img src="/static/img/svg/icon_portfolioalert_on_dark.svg" width="27" className="svg-convert ml-2" alt="" />
                                </PortfolioAllertModal>
                                :
                                <PortfolioAllertModal portfolio={portfolio}>
                                    <img src="/static/img/svg/icon_portfolioalert_off_dark.svg" width="27" className="svg-convert ml-2" alt="" />
                                </PortfolioAllertModal>
                            }
                            <NewsModalMeinFinanztreff isins={listIsins} iconWidth={27} className="my-2 ml-1" />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

interface PortfolioCardProps {
    portfolio: Portfolio
    index: number
    refreshTrigger: () => void
    memo: boolean
    realportfolio?: boolean
}
