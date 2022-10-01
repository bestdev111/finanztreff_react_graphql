import React, { useState } from 'react';
import { Carousel, CarouselItem, Col, Container, Row, Spinner } from "react-bootstrap";
import '../../../Home/HotSection/HotSection.scss';
import { useQuery } from "@apollo/client";
import { CarouselWrapper } from 'components/common';
import SvgImage from 'components/common/image/SvgImage';
import { createChunk } from 'components/common/utils';
import { Query, AssetGroup, InstrumentEdge } from 'generated/graphql';
import { loader } from 'graphql.macro';
import { CurrencyFindInstrumentCard } from './CurrencyFindInstrumentCard';
import { FindCurrencyModal } from './FindCurrencyModal';
import { SortFilter } from 'components/index/FindIndexSection/filters/SortFilter';
import { DaysFilter } from 'components/devisen/Filters/DaysFilter';
import './CurrencyFindSection.scss'
import { CurrencyEntriesDropdownComponent } from 'components/devisen/CurrencyPageDropdown/CurrencyEntriesDropdown';

interface CurrencyFindSectionState {
    idCurrency: string | null;
}

export function CurrencyFindSection(props: {title?: String, hasDropdown?: boolean}) {
    const region  = "";
    const [direction, setDirection] = useState(false);
    const [description, setDescription] = useState("Name");
    const [performance, setPerformance] = useState("INTRADAY");

    const [state, setState] = useState<CurrencyFindSectionState>({
        idCurrency: "",
    });

    let { loading, data } = useQuery<Query>(loader('./getInstrumentGroupSearchCurrencyPage.graphql'), {
        variables: { assetGroup: AssetGroup.Cross, searchString: state.idCurrency, first: 8, after: null },
    });

    return (
        <section className="main-section mt-0 pt-5 pb-4" id="currency-find-section">
            <Container>
                <div className="d-flex flex-wrap" style={{ fontFamily: "Roboto" }}>
                    <div className="flex-grow-1 m-auto pb-sm-2">
                        {props.hasDropdown === true ? <><h2 className="section-heading font-weight-bold button-styling">{props.title}</h2><CurrencyEntriesDropdownComponent name={""}
                        hasAllButton ={true}
                        onSelect={(v) => {
                            if(v?.institute === undefined){
                                setState({
                                    idCurrency: "",
                                })
                            }else{
                            setState({
                                idCurrency: v?.institute?.name.slice(0, 3).toUpperCase() ? v.institute.name.slice(0, 3).toUpperCase() + "/" : null,
                            })}
                        }}
                        /></> : <h2 className="section-heading font-weight-bold button-styling">{props.title}</h2> }
                        
                    </div>
                    <div className="filters-panel text-nowrap d-flex ml-2">
                        <SortFilter
                                onSelect={ev => { }}
                                options={["Name", "Performance"]}
                                direction={direction}
                                description={description}
                            />
                        <DaysFilter
                            // region={region}
                            onSelect={ev => {}}
                            performance={performance}
                        />
                    </div>

                </div>
                <div className=" mx-lg-n2">
                    {loading ? <div className="text-center py-2"><Spinner animation="border" /></div> :
                        <>
                            <Row className="mx-0 d-none d-lg-flex">
                                {data && data.search.edges.map((current: InstrumentEdge, index: number) =>
                                index<9 &&
                                    <Col lg={6} xl={4} className="p-2" key={index}>
                                        {current && current.node.group && current.node && current.node.group.id
                                            && <CurrencyFindInstrumentCard
                                                id={current.node.id}
                                                key={index}
                                                group={current.node.group}
                                                className="currency-find-instrument-card my-2"
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
                                        spanClass="move-arrow d-none d-xl-block" convert={false} />
                                }
                                nextIcon={
                                    <SvgImage icon="icon_direction_right_white.svg"
                                        spanClass="move-arrow d-none d-xl-block" convert={false} />
                                }
                                controls={(data && data.search.edges.length > 6) || false}
                                indicators={(data && data.search.edges.length > 6) || false}
                                as={CarouselWrapper}
                            >
                                {
                                    createChunk(data?.search.edges || [], 4).map((group: any, index: number) =>
                                        <CarouselItem key={index} className="pb-5">
                                            {
                                                group.map((current: InstrumentEdge, index: number) =>
                                                    current && current.node.group && current.node && current.node.group.id
                                                    && <CurrencyFindInstrumentCard
                                                        id={current.node.id}
                                                        key={index}
                                                        group={current.node.group}
                                                        className="currency-find-instrument-card my-2"
                                                    />
                                                )
                                            }
                                        </CarouselItem>
                                    )
                                }
                            </Carousel>
                        </>
                    }
                    <FindCurrencyModal
                        region={region} 
                        showCardFooter={true} 
                        buttonName={"Weitere Devisenkurse..."} 
                        className="pt-2"/>
                </div>
            </Container>
        </section>
    );
}