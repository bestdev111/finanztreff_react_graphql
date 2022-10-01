import React, {useState} from "react";
import {Button, Container, Modal, Row} from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import './MostTradedDerivativesSection.scss'
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";
import { MarketDerivativeSection } from "./MarketDerivativeSection";

export default function MostTradedDerivativesSection(props: any) {
    const [showBannerFilterModal, setShowBannerFilterModal] = useState<boolean>(false)
const customMarginBottomHeading = useBootstrapBreakpoint({xl:"26px"
})
    function doHideBannerFilterModal() {
        setShowBannerFilterModal(false)
    }

    function doShowBannerFilterModal() {
        setShowBannerFilterModal(true)
    }

        return <>
            <section className="home-banner derivate-page most-traded-derivative-section">
                <div className="top-row">
                    <Container>
                        <Row>
                            <div className="stock-group col d-flex align-items-center mt-xl-n2">Derivate / Überblick</div>
                            <div className="action-icons-holder col d-flex">
                                <SvgImage icon="icon_share_white.svg" spanClass="share-butt action-icons"
                                          imgClass="share-butt-icon"/>
                            </div>
                        </Row>
                        <h1 className="banner-inner-heading most-traded-derivative-page-main-heading mt-16px d-sm-none  d-xl-block mb-xl-4"  style={{marginBottom:customMarginBottomHeading}}>Derivate Überblick</h1>
                    </Container>
                </div>
                <MarketDerivativeSection/>

                {/* <Container className="bg-dark" style={{overflowX: 'clip'}}>
                    <div className="sub-navigation d-flex justify-content-between">
                        <div className="inner-title d-none d-xl-block mt-xl-1">Meistgehandelte Derivate</div>
                        <div className="inner-title d-none d-lg-block d-xl-none mb-md-2 mt-md-n1 mb-xl-0 mt-xl-0">Meistgehandelte</div>
                        <div className="inner-title d-lg-none" onClick={doShowBannerFilterModal}>
                            Meistgehandelte Zertifikate
                            <SvgImage icon="icon_direction_down_dark.svg"
                                      spanClass="drop-arrow-image open-icon top-move"
                                      imgClass="svg-white" convert={true}/>
                        </div>
                        <div className="d-none d-xl-block mt-xl-2">
                            <a href="#">Zertifikate</a>
                            <a href="#" className="active">Optionsscheine</a>
                            <a href="#">Knock Outs</a>
                            <a href="#">Factor</a>
                            <a href="#" className="special-button">Top Morgan Stanley Produkte</a>
                        </div>
                        <div className="d-none d-xl-none d-lg-flex align-items-center">
                            <a href="#">Zertifikate</a>
                            <a href="#" className="active">OS</a>
                            <a href="#">KO</a>
                            <a href="#">Faktor</a>
                            <a href="#" className="special-button">Top Morgan Stanley Produkte</a>
                        </div>
                    </div>
                    <Carousel className={"pb-xl-36px mt-sm-n3 mt-md-0"} as={CarouselWrapper}
                              prevIcon={
                                  <SvgImage icon="icon_direction_left_white.svg" spanClass="move-arrow"
                                            convert={true}>Meistgesucht</SvgImage>
                              }
                              nextIcon={
                                  <SvgImage icon="icon_direction_right_white.svg" spanClass="move-arrow"
                                            childBeforeImage={true} convert={true}>Meistgehandelt</SvgImage>
                              }>
                        {
                            createChunk(data, 5).map((groups: any[], index: number) =>
                                <Carousel.Item key={index}>
                                    <Row
                                        className="gutter-16 gutter-mobile-8 row-cols-xl-6 row-cols-lg-3 row-cols-sm-2 " >
                                        {groups.map((item: any, index: number) => <MostTradedDerivativeCard key={index}
                                                                                                            derivative={item}/>)}
                                        <MostTradedDerivativeSpecialCard/>
                                    </Row>
                                </Carousel.Item>
                            )
                        }
                    </Carousel>
                </Container>
             */}
            </section>

            <Modal className="bottom modal-dialog-sky-placement" backdrop={"static"} show={showBannerFilterModal}>
                <Modal.Dialog className="all-white-modal filters-modal">
                    <div className="modal-content">
                        <Modal.Header>
                            <h5 className="modal-title">Ansicht</h5>
                            <button type="button" className="close text-blue"
                                    onClick={doHideBannerFilterModal}>
                                <span>schließen</span>
                                <SvgImage icon="icon_close_blue.svg" spanClass="close-modal-butt"
                                          convert={false}/>
                            </button>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="filter-body">
                                <div className="body-row only-buttons">
                                    <button className="btn btn-border-gray active" type="button">Meistgehandelte
                                    </button>
                                    <button className="btn btn-border-gray" type="button">Meistgesuchte</button>
                                    <button className="btn btn-border-gray" type="button">Top 5 was weiss ich</button>
                                </div>
                                <div className="body-row only-buttons">
                                    <button className="btn btn-border-gray" type="button">Zertifikate</button>
                                    <button className="btn btn-border-gray active" type="button">Optionsscheine</button>
                                    <button className="btn btn-border-gray" type="button">Knock Outs</button>
                                    <button className="btn btn-border-gray" type="button">Faktor</button>
                                    <button className="btn btn-border-gray font-weight-bold" type="button">Top Morgan
                                        Stanley Produkte
                                    </button>
                                </div>
                                <div className="filter-footer">
                                    <Button className="text-blue d-flex align-items-center" variant="link"
                                            onClick={doHideBannerFilterModal}>
                                        <SvgImage icon="icon_check_hook_green.svg" convert={false}/>
                                        <span>Anwenden</span>
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </div>
                </Modal.Dialog>
            </Modal>

        </>
            ;
}
