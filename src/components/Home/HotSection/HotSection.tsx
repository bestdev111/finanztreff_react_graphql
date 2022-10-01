import { Carousel, CarouselItem, Col, Container, Row, Spinner } from "react-bootstrap";
import './HotSection.scss';
import { useQuery } from "@apollo/client";
import { Instrument, Query } from "../../../generated/graphql";
import SvgImage from "../../common/image/SvgImage";
import { CarouselWrapper } from "../../common";
import { createChunk } from "../../common/utils";
import { HotSectionInstrumentCard } from "../../common/card/InstrumentCard/HotSectionInstrumentCard";
import { formatPrice } from "../../../utils";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import { Maybe } from 'graphql/jsutils/Maybe';
import { HotSectionModal } from './HotSectionModal';
import { loader } from "graphql.macro";

interface HotSectionProps {
    carouselIconColor: string
    isSharePage: boolean
    isHomePage?:  boolean
}

export function getAbsPercentChange(a: Maybe<Instrument>) {
    return a?.snapQuote?.quote?.percentChange ? Math.abs(a.snapQuote.quote.percentChange) : 0;
}

function median(values: number[]) {
    values.sort(function (a, b) { return a - b; });
    var half = Math.floor(values.length / 2);
    if (values.length % 2) {
        return values[half];
    } else {
        return (values[half - 1] + values[half]) / 2.0;
    }
}

export const HotSection = ({ isSharePage, carouselIconColor, isHomePage }: HotSectionProps) => {
    const { data, loading } = useQuery<Query>(loader('./getHotInstruments.graphql'), { variables: { id: "hot_instruments", chartScope: 'INTRADAY' } });

    const carouselItemsSize = useBootstrapBreakpoint({
        md: 6,
        sm: 4,
        default: 4
    })

    const trades: number[] = data?.list?.content ? data.list.content.map(x => x?.snapQuote?.cumulativeTrades ? x.snapQuote.cumulativeTrades : 0).filter(x => x != 0) : [0];
    const medianTrades = median(trades);

    return (
        <section className={`${isSharePage ? "" : "pt-5"} main-section mt-0`}>
            <Container className="px-lg-2">
                <div className={`section-heading font-weight-bold ml-n2 ml-lg-1 ml-n3 d-flex`} style={{ color: isSharePage ? "#383838" : "#fff" }}>
                    <div className={"mt-n1"}><SvgImage icon="icon_hot_flame_orange.svg" spanClass="arrow top-move"
                        imgClass="flame-icon pb-1 mb-1" convert={false} width={"28px"} /></div>
                    <div className={"ml-n3 ml-md-0"}><h2 className="section-heading">finanztreff.de HOT! Aktien</h2></div>
                </div>
                {/*<Container className="content-wrapper p-lg-0 m-0" style={{backgroundColor: backgroundColorValue}}>*/}
                <Container className="p-xl-0 m-0 px-0 px-md-3" style={{ backgroundColor: isSharePage ? "#F1F1F1" : "#383838" }}>
                    {loading ?
                        <div className="text-center py-2">
                            <Spinner animation="border" role="status" style={{ color: isSharePage ? "black" : "white" }}>
                            </Spinner>
                        </div>
                        :
                        <>
                            <Row className="mx-0 d-none d-xl-flex">
                                {data?.list?.content && data.list.content
                                    .map((current, index) => {
                                        return (
                                            <Col lg={4} xl={3} className="p-2" key={index}>
                                                {current && current.group && current.snapQuote && current.group.id
                                                    && <HotSectionInstrumentCard
                                                        name={current.group.name}
                                                        id={current.id}
                                                        group={current.group}
                                                        displayPrice={formatPrice(current.snapQuote.quote?.value, current.group.assetGroup)}
                                                        performance={current.snapQuote?.quote?.percentChange}
                                                        currency={current.currency.displayCode}
                                                        trend={getAbsPercentChange(current) > 1.0}
                                                        interest={current.snapQuote?.cumulativeVolume > medianTrades}
                                                        activity={false}
                                                        snapQuote={current.snapQuote}
                                                        chart={current.chart || undefined}
                                                        isHomePage={isHomePage}
                                                    />
                                                }
                                            </Col>
                                        )
                                    }
                                    )
                                }
                            </Row>
                            <Carousel
                                className="d-xl-none"
                                touch={true}
                                controlclass={isSharePage ? "dark-version pt-5 mb-0" : ""}
                                prevIcon={
                                    <SvgImage icon={`icon_direction_left_${carouselIconColor}.svg`}
                                        spanClass="move-arrow d-none d-xl-block" convert={false} />
                                }
                                nextIcon={
                                    <SvgImage icon={`icon_direction_right_${carouselIconColor}.svg`}
                                        spanClass="move-arrow d-none d-xl-block" convert={false} />
                                }
                                controls={(data?.list?.content && data.list.content.length > 6) || false}
                                indicators={(data?.list?.content && data.list.content.length > 6) || false}
                                as={CarouselWrapper}
                            >
                                {
                                    createChunk(data?.list?.content || [], carouselItemsSize).map((group: any, index: number) =>
                                        <CarouselItem key={index} className={`pb-5 ${isSharePage ? "mb-sm-n5" : ""}`}>
                                            <Row>
                                                {
                                                    group.map((current: any, index: number) => (
                                                        <Col lg={4} className={"px-md-1"}>
                                                            {
                                                                current && current.group && current.snapQuote && current.group.id
                                                                && <HotSectionInstrumentCard
                                                                    className={isSharePage ? "my-1" : "my-2"}
                                                                    key={index}
                                                                    name={current.group.name}
                                                                    id={current.id}
                                                                    group={current.group}
                                                                    displayPrice={formatPrice(current.snapQuote.quote?.value, current.group.assetGroup)}
                                                                    performance={current.snapQuote?.quote?.percentChange}
                                                                    currency={current.currency.displayCode}
                                                                    snapQuote={current.snapQuote}
                                                                    chart={current.chart || undefined}
                                                                />
                                                            }
                                                        </Col>
                                                    )
                                                    )
                                                }
                                            </Row>

                                        </CarouselItem>
                                    )
                                }
                            </Carousel>
                        </>
                    }
                    {data?.list?.content &&
                        <HotSectionModal isSharePage={isSharePage} group={data?.list?.content} medianTrades={medianTrades} />
                    }
                </Container>
            </Container>
        </section>
    );
}
