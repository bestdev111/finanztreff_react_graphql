import React from "react";
import SvgImage from "../../common/image/SvgImage";
import TradingIdeasCard from "./TradingIdeasCard";
import { AssetGroup } from "../../../generated/graphql";
import { Carousel, CarouselItem, Container, Row } from "react-bootstrap";
import { CarouselWrapper } from "../../common";
import { createChunk } from "../../common/utils";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";

interface DerivativeTradingIdeasProps {
    heading: string;
    description: string;
    count: number;
    assetGroup: AssetGroup | null | undefined;
}

export const DerivativeTradingIdeas = ({ description, assetGroup, count, heading }: DerivativeTradingIdeasProps) => {
    const carouselItemsSize = useBootstrapBreakpoint({
        default: 3,
        md: 8,
        xl: 8,
        sm: 4
    });

    return null;

    return (
        <>
            <Container style={{ overflowX: 'clip' }} className={"d-xl-block d-none pt-2"}>
                <div className="content mt-2">
                    <div className={""}>
                        <h2 className="mt-4 text-nowrap section-heading font-weight-bold d-xl-block d-md-block d-none">
                            <SvgImage icon="icon_bulb_trading_ideen.svg" spanClass="arrow top-move ml-n3 ml-md-0 ml-xl-0" imgClass="flame-icon ml-1 ml-xl-n1 ml-md-n1"
                                width="28" />
                            <span className="pl-md-2" style={{ fontFamily: 'Roboto Slab', fontSize: '24px' }}>Trading-Ideen - Derivate2</span>
                        </h2>

                        <h2 className="mt-4 text-nowrap section-heading font-weight-bold d-xl-none d-md-none d-block">
                            <SvgImage icon="icon_bulb_trading_ideen.svg" spanClass="arrow top-move ml-n3 ml-md-0 ml-xl-0" imgClass="flame-icon ml-1 ml-xl-n1 ml-md-n1"
                                width="28" />
                            <span className="pl-md-2" style={{ fontFamily: 'Roboto Slab', fontSize: '20px' }}>Trading-Ideen - Derivate1</span>
                        </h2>
                    </div>
                    <Carousel as={CarouselWrapper} controlclass={"dark-version my-0 pt-5"} slide={true}
                        prevIcon={
                            <SvgImage icon="icon_direction_left_dark_big.svg" spanClass="move-arrow pt-3"
                                convert={false} />
                        }
                        nextIcon={
                            <SvgImage icon="icon_direction_right_dark_big.svg" spanClass="move-arrow pt-3"
                                childBeforeImage={true} convert={false} />
                        }
                    >
                        {
                            createChunk(
                                Array.from({ length: 20 }).map((value, index) =>
                                    <div key={index} className="col-xl-3 col-lg-4 col-sm-12 p-2  p-1">
                                        <TradingIdeasCard
                                            heading={heading}
                                            assetGroup={assetGroup}
                                            count={count}
                                            description={description}
                                        />

                                    </div>
                                ), 5
                            ).map((val: any, index: number) => <CarouselItem key={index}>
                                <div className="coming-soon-component derivative-trading-ideas-section">
                                    <span className="text-white fs-18px coming-soon-text d-flex justify-content-center">Coming soon...</span>
                                </div>
                                <Row className={"p-1 pr-3 mt-n1"}>
                                    {
                                        Array.from({ length: carouselItemsSize }).map((value, index: number) =>
                                            <div key={index} className="col-xl-3 col-lg-5 col-sm-12 ml-md-5 ml-xl-0 pr-0">
                                                <TradingIdeasCard
                                                    heading={heading}
                                                    assetGroup={assetGroup}
                                                    count={count}
                                                    description={description}
                                                />
                                            </div>
                                        )
                                    }
                                </Row>
                            </CarouselItem>
                            )
                        }
                    </Carousel>
                </div>
            </Container>
        </>
    )
}

export default DerivativeTradingIdeas
