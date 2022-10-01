import { useState } from 'react';
import { Carousel, CarouselItem, Col, Container, Row, Spinner } from "react-bootstrap";
import '../../Home/HotSection/HotSection.scss';
import { useQuery } from "@apollo/client";
import { CarouselWrapper } from 'components/common';
import SvgImage from 'components/common/image/SvgImage';
import { createChunk } from 'components/common/utils';
import { Query, InstrumentEdge } from 'generated/graphql';
import { loader } from 'graphql.macro';
import './FindIndexSection.scss';
import { FindCurrencyModal } from './FindCurrencyModal';
import { CurrencyEntriesDropdownComponent } from '../CurrencyPageDropdown/CurrencyEntriesDropdown';
import './CurrencyFindSection.scss';
import { SortFilter } from 'components/index/FindIndexSection/filters/SortFilter';
import { DaysFilter } from '../Filters/DaysFilter';
import { CurrencyFindInstrumentCard } from './CurrencyFindInstrumentCard';
import {getInfonlineTag, guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface CurrencyFindSectionState {
    idCurrency: string | null;
}

export function CurrencyFindSection() {
    const [state, setState] = useState<CurrencyFindSectionState>({idCurrency: 'EUR'});
    const [direction, setDirection] = useState<boolean>();
    const [description, setDescription] = useState<string>();
    const [performance, setPerformance] = useState<string>();
    let { loading, data } = useQuery<Query>(loader('./getCardPairsCrossRates.graphql'), {
        variables: { homeCurrencyCode: state.idCurrency, first: 9, after: null }
    });

    return (
        <section className="main-section mt-0 pt-5 pb-4" id='currency-find-section'>
            <Container>
                <div className="d-flex flex-wrap" style={{ fontFamily: "Roboto" }}>
                    <div className="flex-grow-1 m-auto pb-sm-2">
                        <h2 className="section-heading font-weight-bold button-styling">Devisen -</h2><CurrencyEntriesDropdownComponent name={""}
                        hasAllButton ={true}
                        description = {state.idCurrency}
                        onSelect={(v) => {
                            if(v?.institute){
                                trigInfonline(guessInfonlineSection(),getInfonlineTag(guessInfonlineSection(), 'find_currency') + '_' + v?.institute?.id.toUpperCase());
                                setState({
                                    idCurrency: v?.institute?.name.slice(0, 3).toUpperCase() ? v.institute.name.slice(0, 3).toUpperCase() : null,
                                    
                                })
                            }else{
                                trigInfonline(guessInfonlineSection(), "find_currency_alle");
                                setState({
                                idCurrency: null,
                            })}
                        }}
                        />
                    </div>
                    <div className="filters-panel text-nowrap d-flex ml-2">
                        <SortFilter
                                onSelect={() =>{}}
                                options={["Name", "Performance"]}
                                direction={direction}
                                description={description}
                        />
                        <DaysFilter
                            onSelect={() =>{}}
                            performance={performance}
                        />
                    </div>

                </div>
                <div className=" mx-lg-n2">
                    {loading ?
                        <div className="text-center py-2"><Spinner animation="border" /></div> :
                        data && data.searchCrossRate.edges.length > 0 ?
                            <>
                                <Row className="mx-0 d-none d-lg-flex">
                                    {data && data.searchCrossRate.edges.map((current: InstrumentEdge, index: number) =>
                                        index < 9 &&
                                        <Col lg={6} xl={4} className="p-2" key={index}>
                                            {current && current.node.group && current.node && current.node.group.id && current.node.group.main
                                                &&
                                                <CurrencyFindInstrumentCard
                                                    snapQuote={current.node.snapQuote || undefined}
                                                    chart={current.node.group.main.chart || undefined}
                                                    showCardFooter={true}
                                                    name={current.node.name}
                                                    id={current.node.id}
                                                    chartScope={"INTRADAY"}
                                                    group={current.node.group}
                                                    country={current.node.group.main?.country?.name}
                                                    isoAlphaCode={current.node.group.main?.country?.isoAlpha3.toLowerCase()}
                                                    className="currency-find-instrument-card"
                                                    fontSize={"fs-24px"}
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
                                    controls={(data && data.searchCrossRate.edges.length > 6) || false}
                                    indicators={(data && data.searchCrossRate.edges.length > 6) || false}
                                    as={CarouselWrapper}
                                >
                                    {
                                        createChunk(data?.searchCrossRate.edges || [], 4).map((group: any, index: number) =>
                                            <CarouselItem key={index} className="pb-5">
                                                {
                                                    group.map((current: InstrumentEdge, index: number) =>
                                                        current && current.node.group && current.node && current.node.group.id && current.node.group.main
                                                        && 
                                                        <CurrencyFindInstrumentCard
                                                        snapQuote={current.node.snapQuote || undefined}
                                                        chart={current.node.group.main.chart || undefined}
                                                        showCardFooter={true}
                                                        name={current.node.name}
                                                        id={current.node.id}
                                                        chartScope={"INTRADAY"}
                                                        group={current.node.group}
                                                        country={current.node.group.main?.country?.name}
                                                        isoAlphaCode={current.node.group.main?.country?.isoAlpha3.toLowerCase()}
                                                        className="currency-find-instrument-card"
                                                        fontSize={"fs-24px"}
                                                     />
                                                    )
                                                }
                                            </CarouselItem>
                                        )
                                    }
                                </Carousel>
                                <FindCurrencyModal
                                    idCurrency = {state.idCurrency}
                                    showCardFooter={true}
                                    buttonName={"Weitere Devisenkurse..."}
                                    className="pt-2" />
                            </>
                            : <div className="text-center fs-16px font-weight-bold text-red">Keine weiteren Ergebnisse gefunden!</div>
                    }
                </div>
            </Container>
        </section>
    );
}
