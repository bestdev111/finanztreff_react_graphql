import classNames from "classnames";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import './CommodityChartsSection.scss';
import { useState } from "react";
import { Button, Carousel, CarouselItem, Col, Container, Modal, Row } from "react-bootstrap";
import SvgImage from "components/common/image/SvgImage";

import { useViewport } from "hooks/useViewport";
import { CommodityResultsModal } from "./CommodityResultsModal";
import { CarouselWrapper } from "components/common";
import { useMediaQuery } from "react-responsive";
import CommodityChartComponent from "./CommodityChartComponent";

export default function CommodityChartsSection(props: { className?: string, title?: string }) {

    const [state, setState] = useState<FundsSearchState>({
        topic: null,
        type: null,
        region: null,
        strategy: null,
        currency: null,
    });

    const [showModal, setModalShow] = useState(false);
    const closeModal = () => setModalShow(false);

    let { width } = useViewport();

    const isDesktop = useMediaQuery({
        query: '(min-width: 1281px)'
    });

    const isTablet = useMediaQuery({
        query: '(max-width: 1280px)'
    })

    const isMobile = useMediaQuery({
        query: '(max-width: 767px)'
    })
    return (
        <section className={classNames("main-section mx-lg-3", props.className)} id="commodity-chart-section">
            <Container>
                <div className="coming-soon-component commodity-charts-coming-soon">
                        <span className="text-white fs-18px w-100 d-flex justify-content-center commodity-charts-coming-soon-text">Coming soon...</span>
                </div>
                <h2 className="section-heading font-weight-bold performance-comparison">{props.title}</h2>
                <div className="content-wrapper row">
                    <div className="highcharts-containter col-12 col-xl-12 ">
                            {
                            isMobile === true ?
                            <Carousel
                                touch={true}
                                prevIcon={
                                    <SvgImage icon="icon_direction_left_dark.svg"
                                        spanClass="move-arrow d-none d-xl-block d-sm-block" convert={false} />
                                }
                                nextIcon={
                                    <SvgImage icon="icon_direction_right_dark.svg"
                                        spanClass="move-arrow d-none d-xl-block d-sm-block" convert={false} />
                                }
                                controls={true}
                                indicators={true}
                                as={CarouselWrapper}
                            >
                                        <CarouselItem className="pb-5">
                                                <div className="row">
                                                    <div className="col-sm-12"><CommodityChartComponent chartData={[{name:'Agrikultur-basket',y:228,id:1},{name:'Baumwolle',y:177,id:2},{name:'Getreide',y:47,id:3},{name:'Kaffee',y:58,id:4},{name:'Kakao',y:564,id:5},{name:'Mais',y:51,id:6},{name:'Sojabonen',y:95,id:7},{name:'Weizen',y:82,id:8},{name:'Zucker',y:412,id:9}]} title={'Agrikultur'}/></div>
                                                </div>
                                        </CarouselItem>
                                        <CarouselItem className="pb-5">
                                                <div className="row">
                                                    <div className="col-sm-12"><CommodityChartComponent chartData={[{name:'nachwachsende Rohstoffe',y:225,id:1},{name:'Rohstoff-basket',y:127,id:2},{name:'Rohstoffe ex energie',y:97,id:3}]} title={'Allgemein'}/></div>
                                                </div>
                                        </CarouselItem>
                                        <CarouselItem className="pb-5">
                                                <div className="row">
                                                    <div className="col-sm-12"><CommodityChartComponent chartData={[{name:'Edelmetall-basket',y:125,id:1},{name:'Gold',y:49,id:2},{name:'Palladium',y:129,id:3},{name:'Platin',y:62,id:4},{name:'Silber',y:201,id:5}]} title={'Edelmetalle'}/></div>
                                                </div>
                                        </CarouselItem>
                                        <CarouselItem className="pb-5">
                                                <div className="row">
                                                    <div className="col-sm-12"><CommodityChartComponent chartData={[{name:'Brent Öl',y:224,id:1},{name:'Energie-Basket',y:119,id:2},{name:'Erdgas',y:69,id:3},{name:'Erdöl',y:122,id:4},{name:'Heizöl',y:168,id:5},{name:'Rohöl',y:83,id:6},{name:'WTI Öl',y:92,id:7}]} title={'Energie'}/></div>
                                                </div>
                                        </CarouselItem>
                                        <CarouselItem className="pb-5">
                                                <div className="row">
                                                    <div className="col-sm-12"><CommodityChartComponent chartData={[{name:'Aluminium',y:179,id:1},{name:'Industriemetall-Basket',y:176,id:2},{name:'Kupfer',y:115,id:3},{name:'Nickel',y:99,id:4},{name:'Zink',y:214,id:5}]} title={'Industrie-metalle'}/></div>
                                                </div>
                                        </CarouselItem>
                                        <CarouselItem className="pb-5">
                                                <div className="row">
                                                    <div className="col-sm-12"><CommodityChartComponent chartData={[{name:'Lebendrind',y:269,id:1},{name:'Lebendvieh-Basket',y:193,id:2},{name:'Magerschwein',y:115,id:3}]} title={'Lebendvieh'}/></div>
                                                </div>
                                        </CarouselItem>
                            </Carousel>
                            :
                            <Carousel
                                touch={true}
                                prevIcon={
                                    <SvgImage icon="icon_direction_left_dark.svg"
                                        spanClass="move-arrow d-none d-xl-block d-sm-block" convert={false} />
                                }
                                nextIcon={
                                    <SvgImage icon="icon_direction_right_dark.svg"
                                        spanClass="move-arrow d-none d-xl-block d-sm-block" convert={false} />
                                }
                                controls={true}
                                indicators={true}
                                as={CarouselWrapper}
                            >
                                        <CarouselItem className="pb-5">
                                                <div className="row">
                                                    {isTablet === true ? 
                                                    <>
                                                    <div className="col-md-4"><CommodityChartComponent chartData={[{name:'Agrikultur-basket',y:228,id:1},{name:'Baumwolle',y:177,id:2},{name:'Getreide',y:47,id:3},{name:'Kaffee',y:58,id:4},{name:'Kakao',y:564,id:5},{name:'Mais',y:51,id:6},{name:'Sojabonen',y:95,id:7},{name:'Weizen',y:82,id:8},{name:'Zucker',y:412,id:9}]} title={'Agrikultur'}/></div>
                                                    <div className="col-md-4"><CommodityChartComponent chartData={[{name:'nachwachsende Rohstoffe',y:225,id:1},{name:'Rohstoff-basket',y:127,id:2},{name:'Rohstoffe ex energie',y:97,id:3}]} title={'Allgemein'}/></div>
                                                    <div className="col-md-4"><CommodityChartComponent chartData={[{name:'Edelmetall-basket',y:125,id:1},{name:'Gold',y:49,id:2},{name:'Palladium',y:129,id:3},{name:'Platin',y:62,id:4},{name:'Silber',y:201,id:5}]} title={'Edelmetalle'}/></div>
                                                    </>
                                                    :
                                                    <>
                                                    <div className="col-xl-3"><CommodityChartComponent chartData={[{name:'Agrikultur-basket',y:228,id:1},{name:'Baumwolle',y:177,id:2},{name:'Getreide',y:47,id:3},{name:'Kaffee',y:58,id:4},{name:'Kakao',y:564,id:5},{name:'Mais',y:51,id:6},{name:'Sojabonen',y:95,id:7},{name:'Weizen',y:82,id:8},{name:'Zucker',y:412,id:9}]} title={'Agrikultur'}/></div>
                                                    <div className="col-xl-3"><CommodityChartComponent chartData={[{name:'nachwachsende Rohstoffe',y:225,id:1},{name:'Rohstoff-basket',y:127,id:2},{name:'Rohstoffe ex energie',y:97,id:3}]} title={'Allgemein'}/></div>
                                                    <div className="col-xl-3"><CommodityChartComponent chartData={[{name:'Edelmetall-basket',y:125,id:1},{name:'Gold',y:49,id:2},{name:'Palladium',y:129,id:3},{name:'Platin',y:62,id:4},{name:'Silber',y:201,id:5}]} title={'Edelmetalle'}/></div>
                                                    <div className="col-xl-3"><CommodityChartComponent chartData={[{name:'Brent Öl',y:224,id:1},{name:'Energie-Basket',y:119,id:2},{name:'Erdgas',y:69,id:3},{name:'Erdöl',y:122,id:4},{name:'Heizöl',y:168,id:5},{name:'Rohöl',y:83,id:6},{name:'WTI Öl',y:92,id:7}]} title={'Energie'}/></div>
                                                    </>
                                                    }
                                                </div>
                                        </CarouselItem>
                                        <CarouselItem className="pb-5">
                                                <div className="row">
                                                {isTablet === true ? 
                                                    <>
                                                    <div className="col-md-4"><CommodityChartComponent chartData={[{name:'Brent Öl',y:224,id:1},{name:'Energie-Basket',y:119,id:2},{name:'Erdgas',y:69,id:3},{name:'Erdöl',y:122,id:4},{name:'Heizöl',y:168,id:5},{name:'Rohöl',y:83,id:6},{name:'WTI Öl',y:92,id:7}]} title={'Energie'}/></div>
                                                    <div className="col-md-4"><CommodityChartComponent chartData={[{name:'Aluminium',y:179,id:1},{name:'Industriemetall-Basket',y:176,id:2},{name:'Kupfer',y:115,id:3},{name:'Nickel',y:99,id:4},{name:'Zink',y:214,id:5}]} title={'Industrie-metalle'}/></div>
                                                    <div className="col-md-4"><CommodityChartComponent chartData={[{name:'Lebendrind',y:269,id:1},{name:'Lebendvieh-Basket',y:193,id:2},{name:'Magerschwein',y:115,id:3}]} title={'Lebendvieh'}/></div>
                                                    </>
                                                    :
                                                    <>
                                                    <div className="col-xl-3"><CommodityChartComponent chartData={[{name:'Aluminium',y:179,id:1},{name:'Industriemetall-Basket',y:176,id:2},{name:'Kupfer',y:115,id:3},{name:'Nickel',y:99,id:4},{name:'Zink',y:214,id:5}]} title={'Industrie-metalle'}/></div>
                                                    <div className="col-xl-3"><CommodityChartComponent chartData={[{name:'Lebendrind',y:269,id:1},{name:'Lebendvieh-Basket',y:193,id:2},{name:'Magerschwein',y:115,id:3}]} title={'Lebendvieh'}/></div>
                                                    </>
                                                    }
                                                </div>
                                        </CarouselItem>
                            </Carousel>
                            }
                    </div>
                </div>
            </Container>
            <Row className="button-row d-flex mt-0 mt-lg-3 pb-3 pr-lg-2 mb-sm-4 pt-sm-2" onClick={() => setModalShow(true)}>
                <Col className="d-flex justify-content-center justify-content-lg-end" xs={12}>
                    <Button variant="primary">
                        Alle ETC anziegen
                    </Button>
                </Col>
            </Row>
                                {
                                    showModal &&
                                    <>
                                        <Modal
                                            show={showModal}
                                            scrollable={true}
                                            className={classNames("fund-cards-in-modal modal-dialog-sky-placement", width < 576 && 'bottom')}
                                            onHide={closeModal}
                                            contentClassName="bg-white"
                                            dialogClassName="px-2"
                                        >
                                            <ModalHeaderMeinFinanztreff title="ETC - Edelemetalle - Edelmetall-Basket" close={closeModal} />
                                            <Modal.Body id="fund-search-results" className="bg-border-gray fund-search-result">
                                                <CommodityResultsModal topic={state.topic} type={state.type} region={state.region} strategy={state.strategy} currency={state.currency} />
                                            </Modal.Body>
                                        </Modal>
                                    </>
                                }
        </section>
    );
}

interface FundsSearchState {
    topic: number | null;
    type: number | null,
    region: number | null,
    strategy: number | null,
    currency: number | null,
}