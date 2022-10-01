import { useQuery } from "@apollo/client";
import { CarouselWrapper } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { getColor } from "components/funds/FundSearchPage/ResultCards/FundResultCard";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { loader } from "graphql.macro";
import {Instrument, Query, QuoteType, useUpdateStickyInstrumentSubscription} from "graphql/types";
import { Carousel, CarouselItem, Col, Container, Row, Spinner } from "react-bootstrap";
import {formatPrice, numberFormatWithSign, quoteFormatWithShortYear, STOCKCHANGE_TYPE, UpdateStateProps} from "utils";
import {useEffect, useState} from "react";
import classNames from "classnames";
import {usePercentChangeVisualization} from "../../../hooks/usePercentChangeVisualization";

export function IndexListSection() {
    const { data, loading } = useQuery<Query>(loader('./getIndexListSection.graphql'));

    if (loading) {
        return <div className="text-center py-2"><Spinner animation="border" /></div>;
    }

    if (data && data.list && data.list.content && data.list.content.length > 0) {
        const instruments = data.list.content;
        return (
            <>
                <Container className="text-white p-4 d-none d-xl-block">
                    <Row className="fs-15px" >
                        <Col xs={4} className="px-4">
                            {instruments.map((current, index) => index < 10 &&
                                <InstrumentColumns instrument={current} />
                            )}
                        </Col>
                        <Col xs={4} className="px-4 border-left-2 border-dark">
                            {instruments.map((current, index) => index >= 10 && index < 20 &&
                                <InstrumentColumns instrument={current} />
                            )}
                        </Col>
                        <Col xs={4} className="px-4 border-left-2 border-dark">
                            {instruments.map((current, index) => index >= 20 &&
                                <InstrumentColumns instrument={current} />
                            )}
                        </Col>
                    </Row>
                </Container>
                <Container className="text-white p-4 d-none d-xl-none d-lg-block d-md-block">
                    <Row className="fs-15px" >
                        <Col xs={6} className="px-4">
                            {instruments.map((current, index) => index < 15 &&
                                <InstrumentColumns instrument={current} />
                            )}
                        </Col>
                        <Col xs={6} className="px-4 border-left-2 border-dark">
                            {instruments.map((current, index) => index >= 15 &&
                                <InstrumentColumns instrument={current} />
                            )}
                        </Col>
                    </Row>
                </Container>
                <Container className="d-none d-md-none d-sm-inline-block pt-5 w-100 fs-15px">
                        <Carousel
                        className="pl-2 pr-2"
                            touch={true}
                            prevIcon={
                                <SvgImage icon="icon_direction_left_white.svg"
                                    spanClass="move-arrow d-none d-xl-block" convert={false} />
                            }
                            nextIcon={
                                <SvgImage icon="icon_direction_right_white.svg"
                                    spanClass="move-arrow d-none d-xl-block" convert={false} />
                            }
                            controls={true}
                            indicators={true}
                            as={CarouselWrapper}
                        >
                            <CarouselItem key={0} className="pb-5">
                                {instruments.map((current, index) => index < 15 &&
                                    <InstrumentColumns instrument={current} />
                                )}
                            </CarouselItem>
                            <CarouselItem key={1} className="pb-5">
                                {instruments.map((current, index) => index >= 15 &&
                                    <InstrumentColumns instrument={current} />
                                )}
                            </CarouselItem>

                        </Carousel>
                </Container>
            </>
        );
    }
    return (<></>)
}

function getNameOfGroup(name: string) {
    switch (name) {
        case 'DAX®':
            return 'DAX';
        case 'MDAX®':
            return 'MDAX';
        case 'TecDAX®':
            return 'TecDAX';
        case 'SDAX®':
            return 'SDAX';
        case 'VDAX®-NEW':
            return 'VDAX';
        case 'Scale All':
            return 'Scale All';
        case 'HDAX ® (Performance)':
            return 'HDAX';
        case 'Titan 20 Index EUR (Total Return)':
            return 'Titan 20';
        case 'GAFAM AR Index EUR (Price)':
            return 'GAFAM';
        case 'DER AKTIONAER EUROPA INFLATION INDEX (NET RETURN) (EUR)':
            return 'Europa Inflation';
        case 'EURO STOXX® 50':
            return 'E. Stoxx 50';
        case 'Euronext 100 Index® ':
            return 'Euronext 100';
        case 'ATX':
            return 'ATX';
        case 'SMI® Price':
            return 'SMI';
        case 'CAC 40® ':
            return 'CAC 40';
        case 'AEX® ':
            return 'AEX';
        case 'UK100 ':
            return 'Uk 100';
        case 'ShortDAX® Index EUR (Total Return)':
            return 'ShortDAX';
        case 'DAX 50 ESG INDEX (PRICE) (EUR)':
            return 'DAX 50 ESG';
        case 'STOXX® Europe 600 EUR (Net Return)':
            return 'Stoxx 600';
        case 'Dow Jones 30':
            return 'Dow 30';
        case 'NASDAQ 100':
            return 'Nasdaq 100';
        case 'S&P 500':
            return 'S&P 500';
        case 'NIKKEI 225':
            return 'Nikkei 225';
        case 'Hang Seng':
            return 'Hang Seng';
        case 'GOLD/US DOLLAR SPOT':
            return 'Gold';
        case 'SILVER/US DOLLAR SPOT':
            return 'Siber';
        case 'EUR/USD':
            return 'EUR/USD';
        case 'EURO-BUND-FUTURE':
            return 'Euro bund fut.';
    }
}


export function InstrumentColumns({ instrument }: { instrument: Instrument }) {
    const pushEvent =  usePercentChangeVisualization(instrument.id)
    let currentSnapQuote = pushEvent?.value || instrument.snapQuote;
    let currentQuote = (currentSnapQuote?.quotes || []).find(current => current?.type == QuoteType.Trade) || instrument.snapQuote?.quote;

    return (<>
        <Row className="" style={{ lineHeight: 1.7 }}>
            <Col md={4} xs={4} className="px-0 text-nowrap text-truncate">
                {instrument.exchange.code === "CGMD" &&
                    <img
                        src={process.env.PUBLIC_URL + "/static/img/svg/emi_logo_citi_white.svg"}
                        alt="" className="mt-n1" width={20} />
                }
                <span >
                    <AssetLinkComponent instrument={instrument} className="text-white font-weight-bold" title={getNameOfGroup(instrument.group.name)} />
                </span>
            </Col>
            <Col md={3} xs={3} className="text-right px-0 text-nowrap text-gray-weight-light">
                <span>
                    {formatPrice(currentQuote?.value, instrument.group.assetGroup)}
                </span>
                <span className="fs-11px ml-1">
                    {instrument.currency.displayCode}
                </span>
            </Col>
            <Col md={3} xs={3} className="text-right px-0 pr-2 text-nowrap">
                <span className={classNames(classNames(getColor(currentQuote?.percentChange || 0),
                    pushEvent.toggle ? 'asset-value-movement-blinker' : '',
                ))}>
                    {numberFormatWithSign(currentQuote?.percentChange, "%")}
                </span>
                <ArrowPercentChange value={currentQuote?.percentChange} />
            </Col>
            <Col md={2} xs={2} className="text-right px-0 text-nowrap text-gray-weight-light">
                <span className="fs-11px">
                    {quoteFormatWithShortYear(currentQuote?.when)}
                </span>
            </Col>
        </Row>
    </>)
}

export function ArrowPercentChange({ value }: { value?: number | null }) {
    if (value || value === 0) {
        return value > 0 ?
            (<img
                src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_up_green.svg"} width={15}
                alt="" className="move-arrow-icon pl-1 pb-1" />)
            :
            value < 0 ?
                (<img
                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_down_red.svg"} width={15}
                    alt="" className="move-arrow-icon pl-1 pb-1" />) :
                value === 0 ? (<img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"}
                    alt="" className="move-arrow-icon" width={23} />)
                    : <></>
    }
    return (<></>)
}
