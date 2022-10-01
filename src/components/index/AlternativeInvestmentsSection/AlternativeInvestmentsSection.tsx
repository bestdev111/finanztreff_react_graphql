import classNames from "classnames";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
// import './CommodityChartsSection.scss';
import { useState } from "react";
import { Button, Carousel, CarouselItem, Col, Container, Modal, Row } from "react-bootstrap";
import SvgImage from "components/common/image/SvgImage";
import './AlternativeInvestmentsSection.scss'
import { useViewport } from "hooks/useViewport";
import { CommodityResultsModal } from "components/commodity/CommodityChartsSection/CommodityResultsModal";
import { CarouselWrapper } from "components/common";
import { useMediaQuery } from "react-responsive";
import CommodityChartComponent from "components/commodity/CommodityChartsSection/CommodityChartComponent";

export default function AlternativeInvestmentsSection(props: { className?: string, title?: string, subtitle?: string }) {

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
            <div className="coming-soon-component alternative-investments-coming-soon">
                        <span className="text-white fs-18px w-100 d-flex justify-content-center alternative-investments-coming-soon-text">Coming soon...</span>
            </div>
            <h2 className="section-heading font-weight-bold performance-comparison">{props.title}</h2>
            <h5 className="subtitle pt-2">{props.subtitle}</h5>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-xl-6">
                        <Container className="content-wrapper">
                                <div className="row">
                                    <div className="col-6">
                                    <h2 className="card-text font-weight-bold d-flex">Anlage-Strategie:<h2 className="card-text-color font-weight-bold text-red pl-1">Short</h2></h2>
                                    </div>
                                    <div className="col-6">
                                    <h2 className="font-weight-bold product-text">1 Produkt</h2>
                                    </div>
                                </div>
                        </Container>
                    </div>
                    <div className="col-sm-12 col-md-6 col-xl-6">
                        <Container className="content-wrapper">
                                <div className="row">
                                    <div className="col-6">
                                    <h2 className="card-text font-weight-bold d-flex">Anlage-Strategie:<h2 className="card-text-color font-weight-bold text-green pl-1">Long</h2></h2>
                                    </div>
                                    <div className="col-6">
                                    <h2 className="font-weight-bold product-text">11 Produkte</h2>
                                    </div>
                                </div>
                        </Container>
                    </div>
                </div>
            
            <Row className="button-row d-flex mt-0 mt-lg-3 pb-3 pr-lg-2 mb-sm-4 pt-sm-2" onClick={() => setModalShow(true)}>
                <Col className="d-flex justify-content-center justify-content-lg-end" xs={12}>
                    <Button variant="primary">
                        Alle ETN anziegen
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