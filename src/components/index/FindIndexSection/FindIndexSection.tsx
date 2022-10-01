import { useState } from 'react';
import { Carousel, CarouselItem, Col, Container, Row, Spinner } from "react-bootstrap";
import '../../Home/HotSection/HotSection.scss';
import { useQuery } from "@apollo/client";
import { CarouselWrapper } from 'components/common';
import SvgImage from 'components/common/image/SvgImage';
import { createChunk } from 'components/common/utils';
import { Query, InstrumentEdge } from 'generated/graphql';
import { loader } from 'graphql.macro';
import { FindIndexModal } from './FindIndexModal';
import { IndustriesFilter, IndustriesSelectOptionEvent, IndustriesSelectTypeEvent } from './filters/IndustriesFilter';
import './FindIndexSection.scss';
import { CountriesAndRegionsFilter } from './filters/CountriesAndRegionsFilter';
import { IndexFindInstrumentCard } from './IndexFindInstrumentCard';
import { guessInfonlineSection, trigInfonline } from "../../common/InfonlineService";

interface RegionsSelectEvent {
    regionId?: number | undefined;
    region?: string | undefined;
}

interface OptionSelectEvent {
    optionId?: number | undefined;
    option?: string | undefined;
}

export function FindIndexSection() {
    const [{ region, regionId }, setRegion] = useState<RegionsSelectEvent>({ region: "Deutsche", regionId: 6 })


    const [{ option, optionId }, setIndexOption] = useState<OptionSelectEvent>({ option: undefined, optionId: undefined })
    const handleIndicesTypes = (type: IndustriesSelectTypeEvent, option: IndustriesSelectOptionEvent) => {
        trigInfonline(guessInfonlineSection(), "industries_filter")
        setIndexOption({ optionId: option.id, option: option.name });
    }

    let { loading, data } = useQuery<Query>(loader('./getInstrumentGroupSearchIndexPage.graphql'), {
        variables: { regionId: regionId ? regionId : null, sectorId: optionId ? optionId : null, first: 12, after: null }
    });

    return (
        <section className="main-section mt-0 pt-5 pb-4">
            <Container>
                <div className="d-flex flex-wrap" style={{ fontFamily: "Roboto" }}>
                    <div className="flex-grow-1 m-auto pb-sm-2">
                        <h2 className="section-heading font-weight-bold ">Index finden</h2>
                    </div>
                    <div className="filters-panel text-nowrap d-flex ml-2">
                        <CountriesAndRegionsFilter
                            region={region}
                            onSelect={ev => {
                                ev.name && trigInfonline(guessInfonlineSection(), ev.name)
                                setRegion({ region: ev.name, regionId: ev.id })
                            }}
                        />
                        <IndustriesFilter
                            onSelect={handleIndicesTypes}
                            industry={option}
                            industryId={optionId}
                        />
                    </div>

                </div>
                <div className=" mx-lg-n2">
                    {loading ?
                        <div className="text-center py-2"><Spinner animation="border" /></div> :
                        data && data.searchIndex.edges.length > 0 ?
                            <>
                                <Row className="mx-0 d-none d-lg-flex">
                                    {data && data.searchIndex.edges.map((current: InstrumentEdge, index: number) =>
                                        index < 12 &&
                                        <Col lg={6} xl={3} className="p-2" key={index}>
                                            {current && current.node.group && current.node && current.node.group.id && current.node.group.main &&
                                                <IndexFindInstrumentCard
                                                    snapQuote={current.node.snapQuote || undefined}
                                                    chart={current.node.group.main.chart || undefined}
                                                    showCardFooter={true}
                                                    name={current.node.name}
                                                    id={current.node.id}
                                                    group={current.node.group}
                                                    country={current.node.group.refCountry?.name}
                                                    isoAlphaCode={current.node.group.refCountry?.isoAlpha3.toLowerCase()}
                                                    className="index-find-instrument-card"
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
                                            spanClass="move-arrow d-none d-xl-block" convert={true} />
                                    }
                                    nextIcon={
                                        <SvgImage icon="icon_direction_right_white.svg"
                                            spanClass="move-arrow d-none d-xl-block" convert={true} />
                                    }
                                    controls={(data && data.searchIndex.edges.length > 6) || false}
                                    indicators={(data && data.searchIndex.edges.length > 6) || false}
                                    as={CarouselWrapper}
                                >
                                    {
                                        createChunk(data?.searchIndex.edges || [], 4).map((group: any, index: number) =>
                                            <CarouselItem key={index} className="pb-5">
                                                {
                                                    group.map((current: InstrumentEdge, index: number) =>
                                                        current && current.node.group && current.node && current.node.group.id && current.node.group.main &&
                                                        <IndexFindInstrumentCard
                                                            snapQuote={current.node.snapQuote || undefined}
                                                            chart={current.node.group.main.chart || undefined}
                                                            showCardFooter={true}
                                                            key={index}
                                                            name={current.node.group.name}
                                                            id={current.node.id}
                                                            group={current.node.group}
                                                            isoAlphaCode={current.node.group.refCountry?.isoAlpha3.toLowerCase()}
                                                            className="index-find-instrument-card my-2"
                                                        />
                                                    )
                                                }
                                            </CarouselItem>
                                        )
                                    }
                                </Carousel>
                                <FindIndexModal
                                    region={region}
                                    regionId={regionId}
                                    industry={option}
                                    industryId={optionId}
                                    showCardFooter={true}
                                    buttonName={region ? "Alle " + region + " - Indizes" : "Alle Indizes"}
                                    className="pt-2" />
                            </>
                            : <div className="text-center fs-16px font-weight-bold text-red">Keine weiteren Ergebnisse gefunden!</div>
                    }
                </div>
            </Container>
        </section>
    );
}
