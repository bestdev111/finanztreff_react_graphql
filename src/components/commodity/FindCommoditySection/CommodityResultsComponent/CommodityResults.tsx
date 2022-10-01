import { Carousel, CarouselItem, Col, Container, Row, Spinner } from "react-bootstrap";
import '../../../Home/HotSection/HotSection.scss';
import { useQuery } from "@apollo/client";
import { CarouselWrapper } from 'components/common';
import SvgImage from 'components/common/image/SvgImage';
import { createChunk } from 'components/common/utils';
import { Query, Instrument } from 'generated/graphql';
import { loader } from 'graphql.macro';
import { CommodityFindInstrumentCard } from './CommodityFindInstrumentCard';
import { FindCommodityModal } from './FindCommodityModal';
import { formatPrice } from "../../../../utils";
import '../FindCommoditySection.scss';

export function CommodityResults() {

    let { data, loading } = useQuery<Query>(
        loader('./getCommodityInstruments.graphql'),
        {variables: {chartScope: "INTRADAY"}}
    );

    if (loading) {
        return (<div className="text-center py-2"><Spinner animation="border" /></div>);
    }

    if (data && data.list && data.list.content) {
        return (
            <Container>
                <div className="d-flex flex-wrap" style={{ fontFamily: "Roboto" }}>
                    <div className="flex-grow-1 m-auto pb-sm-2">
                        <h2 className="section-heading font-weight-bold fs-20px">Rohstoff Liste</h2>
                    </div>
                </div>
                <div className=" mx-lg-n2">
                    <Row className="mx-0 d-none d-lg-flex">
                        {data.list.content.map((current: Instrument, index: number) =>
                            index < 12 &&
                            <Col lg={6} xl={3} className="p-2" key={index}>
                                {current && current.group && current.group.id && current.snapQuote && current.chart
                                    && <CommodityFindInstrumentCard
                                        snapQuote={current.snapQuote}
                                        chart ={current.chart}
                                        displayPrice={formatPrice(current.snapQuote.quote?.value, current.group.assetGroup)}
                                        currency={current.currency.displayCode}
                                        name={current.group.name}
                                        id={current.id}
                                        group={current.group}
                                        line200dayValue={current.group.main?.indicators?.movingAverage?.deltaLine200Day}
                                        alltimeValue={current.group.main?.stats.find(current => current.period === 'ALL_TIME')?.deltaHighPrice}
                                        selected="line200day"
                                    />
                                }
                            </Col>
                        )
                        }
                    </Row>
                    <Carousel
                        className="d-lg-none"
                        touch={true}
                        prevIcon={
                            <SvgImage icon="icon_direction_left_white.svg"
                                spanClass="move-arrow d-none d-xl-block" />
                        }
                        nextIcon={
                            <SvgImage icon="icon_direction_right_white.svg"
                                spanClass="move-arrow d-none d-xl-block" />
                        }
                        controls={data.list.content.length > 6}
                        indicators={data.list.content.length > 6}
                        as={CarouselWrapper}
                    >
                        {
                            createChunk(data.list.content, 4).map((group: any, index: number) =>
                                <CarouselItem key={index} className="pb-5">
                                    {
                                        group.map((current: Instrument, index: number) =>
                                            current && current.group && current && current.group.id && current.snapQuote && current.chart
                                            && <CommodityFindInstrumentCard
                                                snapQuote={current.snapQuote}
                                                className="my-2"
                                                key={index}
                                                chart = {current.chart}
                                                displayPrice={formatPrice(current.snapQuote.quote?.value, current.group.assetGroup)}
                                                currency={current.currency.displayCode}
                                                name={current.group.name}
                                                id={current.id}
                                                group={current.group}
                                                line200dayValue={current.group.main?.indicators?.movingAverage?.deltaLine200Day}
                                                alltimeValue={current.group.main?.stats && current.group.main?.stats.find(current => current.period === 'ALL_TIME')?.deltaHighPrice}
                                                selected="line200day"
                                            />
                                        )
                                    }
                                </CarouselItem>
                            )
                        }
                    </Carousel>
                    <FindCommodityModal commodities={data.list.content} />
                </div>
            </Container>
        );
    }

    return(<></>);
}
