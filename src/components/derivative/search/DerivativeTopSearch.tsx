import React, {useContext, useState} from "react";
import {Carousel, CarouselItem, Row} from "react-bootstrap";
import './DerivativeTopSearch.scss'
import {UnderlyingSearchInput} from "./UnderlyingSearchInput";
import {DerivativeTypeInput} from "./DerivativeTypeInput";
import SvgImage from "../../common/image/SvgImage";
import {CarouselWrapper} from "../../common";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";
import {ActiveConfigContext, ConfigContext} from "../DerivativeSearch";
import {trigInfonline} from "../../common/InfonlineService";


export const DerivativeTopSearch = () => {
    const {activeConfig, setActiveConfig} = useContext(ActiveConfigContext);
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const config = getSearchConfig();
    const [carouselButtonState, setCarouselButtonState] = useState<boolean>(true)

    const titleFontSize = useBootstrapBreakpoint({
        xl: 25,
        md: 25,
        sm: 20
    });

    return (
        <div className="derivative-search-wrapper bg-dark">
            <div className="search-area">
                <div>
                    <Row className="no-gutters" style={{overflowX: 'clip'}}>
                        <div className="col-lg-12">
                            <div className="search-bg pb-0">
                                <Row>
                                    <div className="col-lg-12">
                                        <div className="search-top">
                                            <div className="search-top-left mt-md-n2 pb-md-2 d-md-block d-none">
                                                <a href="#"><i className="fal fa-share-alt"/></a>
                                                <a href="#">Derivative / Derivatesuche</a>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <Row className={"mt-lg-n3"}>
                                    <div className="col-lg-12 px-0">
                                        <div className="search-containt view-selection">
                                            <Carousel
                                                activeIndex={activeConfig}
                                                touch={true}
                                                prevIcon={
                                                    <SvgImage spanClass="move-arrow mr-sm-n2 dts-op svg-icon d-xl-block"
                                                              icon="icon_direction_left_white.svg" convert={true}
                                                              onClick={() => setCarouselButtonState(true)}>
                                                        <span onClick={() => {
                                                            trigInfonline('derivatives', '003_05_02_Derivate_Suche_Basis')
                                                            setActiveConfig(0)
                                                        }}
                                                              className={`btn-carousel font-size-13px ${carouselButtonState ? "bg-white text-dark" : ""} mt-xl-1 p-sm-1 ml-xl-2 p-xl-1`}
                                                        >nach Basiswert...</span>
                                                    </SvgImage>
                                                }
                                                nextIcon={
                                                    <SvgImage
                                                        spanClass="move-arrow svg-icon ml-sm-n2 dts-op ml-xl-1 d-xl-block "
                                                        childBeforeImage={true}
                                                        icon="icon_direction_right_white.svg" convert={true}
                                                        onClick={() => setCarouselButtonState(false)}>
                                                                    <span onClick={() => {
                                                                        trigInfonline('derivatives', '003_05_02_Derivate_Suche_Art')
                                                                        setActiveConfig(1)
                                                                    }}
                                                                          className={`ml-n2 ml-xl-n3 btn-carousel font-size-13px ${carouselButtonState ? "" : "bg-white text-dark"}  mt-xl-1  p-sm-1 mr-xl-2 p-xl-1`}
                                                                    >nach Derivateart...</span>
                                                    </SvgImage>
                                                }
                                                controls={true}
                                                as={CarouselWrapper}
                                            >
                                                <CarouselItem
                                                    className=" mb-5 mt-md-n3 mt-xl-n1 pt-md-1 mt-n3 pt-1 pb-xl-5">
                                                    <h1 className="ml-3 derivative-search-page-title" style={{
                                                        fontFamily: 'Roboto Slab',
                                                        fontSize: titleFontSize
                                                    }}>Derivatesuche nach Basiswert</h1>
                                                    <Row className="px-md-2">
                                                        <div
                                                            className="col-md-8 text-center pb-3 pb-md-4 px-4 pr-md-0 pr-xl-2 pl-md-3 pl-xl-4 mt-n1 mt-md-0"
                                                            style={{lineHeight: 2.5}}>
                                                            <UnderlyingSearchInput className="w-100 mb-0"/>
                                                            {
                                                                !config.assetClass &&
                                                                <span
                                                                    className="text-light op-8 mb-xl-n5 pb-xl-2 d-xl-block d-none">Bitte wählen Sie zuerst einen Basiswert aus</span>
                                                            }
                                                        </div>
                                                        <DerivativeTypeInput
                                                            className="col-md-4 px-4 pl-md-0 pt-0 mt-n2 mt-md-0"
                                                            disabled={!config.underlying}
                                                        />
                                                    </Row>
                                                </CarouselItem>
                                                <CarouselItem
                                                    className="mb-5 mt-md-n3 mt-xl-n1 pt-md-1 pb-4 mt-n3 pt-1 pb-xl-5">
                                                    <h1 className="ml-3 derivative-search-page-title" style={{
                                                        fontFamily: 'Roboto Slab',
                                                        fontSize: titleFontSize
                                                    }}>Derivatesuche nach Derivative-Art und Typ</h1>
                                                    <Row className="px-md-2 pb-xl-4">
                                                        <div
                                                            className={"col-md-4 px-4 pr-md-0 mr-md-n3 pl-xl-4 text-center  mt-n1 mt-md-0"}
                                                            style={{lineHeight: 2.5}}>
                                                            <DerivativeTypeInput/>
                                                            {
                                                                !config.assetClass &&
                                                                <span
                                                                    className="text-light mb-xl-n5 pb-xl-2 op-8 mb-xl-n4 text-wrap d-none d-xl-block">Bitte wählen Sie zuerst eine Derivative-Art aus</span>
                                                            }
                                                        </div>
                                                        <div className="col-md-8 px-4 pr-md-0 pr-xl-2 pl-md-3 pl-xl-4">
                                                            <UnderlyingSearchInput
                                                                disabled={!config.assetClass}
                                                                className="w-100 mb-0  pt-3 mt-n2 pt-md-0 mt-md-0"/>
                                                        </div>
                                                    </Row>
                                                </CarouselItem>
                                            </Carousel>
                                        </div>
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default DerivativeTopSearch
