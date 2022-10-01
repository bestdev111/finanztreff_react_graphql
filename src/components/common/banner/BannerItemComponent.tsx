import React, { CSSProperties, useContext, useState } from "react";
import {
    Accordion,
    AccordionContext,
    Button,
    Col,
    Dropdown,
    Row,
    useAccordionToggle
} from "react-bootstrap";
import { RangeChartComponent } from "./RangeChartComponent";
import { BannerItemFader } from "./BanerItemFader";
import { CertificateTypeName, extractQuotes, numberFormat, quoteFormat, shortNumberFormat } from "../../../utils";
import { PageBannerSnapQuote } from "./PageBannerSnapQuote";
import { PageBannerSnapQuoteChange } from './PageBannerSnapQuoteChange';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from "classnames";
import SvgImage from "../image/SvgImage";
import { BannerChartComponent } from "./BannerChartComponent";
import { Instrument, InstrumentGroup, ExchangeType, AssetGroup, SnapQuote } from "../../../generated/graphql";
import { SnapQuoteDelayIndicator } from "../indicators";
import {usePercentChangeVisualization} from "../../../hooks/usePercentChangeVisualization";

const AssetAccordionCustomToggle = function ({ eventKey, callback, children }: AssetAccordionCustomToggleProps) {
    const currentEventKey = useContext(AccordionContext);
    const decoratedOnClick = useAccordionToggle(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = currentEventKey === eventKey;
    return (
        <div className={classNames("details-button-wrapper d-flex d-md-none", isCurrentEventKey ? "selected" : "")} onClick={decoratedOnClick}>
            <span>{children}</span>
            <SvgImage icon="icon_direction_down_white.svg" convert={false} imgClass="svg-white" style={{ transform: "rotate(180deg)" }}
                spanClass="drop-arrow-image top-move" />
        </div>
    );
}
interface AssetAccordionCustomToggleProps {
    eventKey: string;
    callback?: any;
    children?: React.ReactNode;
}

function AssetDetailsComponent(props: AssetDetailsComponentProps) {

    const instrument = props.instrument;
    const [isinCopied, setIsinCopied] = useState<boolean>(false);
    const [wknCopied, setWknCopied] = useState<boolean>(false);

    return (
        <div className={classNames('mr-md-n3 mr-xl-0, mr-sm-0', props.className)} style={{ lineHeight: "0.5" }}>
            <span className={classNames("asset-type", props.assetClassName)} id="asset-type">{props.assetTypeGroupName && props.assetTypeGroupName} {props.fundType ? props.fundType : props.assetClass} </span>
            {props.assetType && props.typeId !== CertificateTypeName.Faktor && <span style={{ textTransform: 'none' }}
                className={classNames("asset-type bg-white text-dark")}> {props.assetType} </span>}
            {instrument.isin &&
                <span className="asset-info fs-11px mr-sm-n1 mr-md-0">

                    <span>ISIN: </span>
                    <span id="isin-value" style={{ marginRight: '6px' }}> {instrument.isin}</span>
                    <CopyToClipboard text={instrument.isin} onCopy={() => {
                        setIsinCopied(true);
                        setWknCopied(false);
                    }}>
                        <Button className="move-arrow svg-icon top-move copy-button" title={isinCopied ? "Copied" : "Copy"}>
                            <SvgImage icon='icon_copy_white.svg' convert={false} spanClass="copy-icon" width={'28'} />
                        </Button>
                    </CopyToClipboard>
                </span>
            }
            {instrument.wkn &&
                <span className="asset-info fs-11px ">
                    <span style={{ marginLeft: '16px' }}>WKN:</span>
                    <span id="wkn-value" style={{ marginRight: '6px' }}> {instrument.wkn} </span>
                    <CopyToClipboard text={instrument.wkn} onCopy={() => {
                        setWknCopied(true);
                        setIsinCopied(false);
                    }}>
                        <Button className="move-arrow svg-icon top-move copy-button" title={wknCopied ? "Copied" : "Copy"} >
                            <SvgImage icon='icon_copy_white.svg' convert={false} spanClass="copy-icon" width={'28'} />
                        </Button>
                    </CopyToClipboard>
                    <span className={` ${props.assetClassName != 'aktie'} ? 'd-sm-block':'d-none' d-md-none`}></span>
                </span>
            }
            {props.group?.issuer?.name && <span className={"asset-info fs-11px"}>Emittent: {props.group?.issuer?.name}</span>}
            <div className={"d-md-none w-25"} />
            {instrument.tickerSymbol && <span className="asset-info fs-11px">Symbol: {instrument.tickerSymbol}</span>}
            {instrument?.group?.sector?.name &&
                <span className="asset-info">Branche: {instrument?.group?.sector?.name}</span>}
            {instrument.marketCapitalization && <span className="asset-info fs-11px" style={{ marginLeft: '8px' }}>MarketCap.
                : {shortNumberFormat(instrument.marketCapitalization)}</span>}
        </div>

    );
}

interface AssetDetailsComponentProps {
    className?: string;
    assetClass: string;
    assetType?: string;
    instrument: Instrument;
    assetClassName: string;
    typeId?: string | null | undefined
    group?: InstrumentGroup;
    fundType?: string
    assetTypeGroupName?: string;
}

export const BannerItemComponent = (props: any) => {
    const instrument: any = props.instrument;
    const [currentInstrument, setCurrentInstrument] = useState<Instrument>(instrument);
    const updateDropdown = (ins: Instrument) => {
        setCurrentInstrument(ins);
    }
    let { value, toggle } = usePercentChangeVisualization(props.instrument.id);

    return (
        <>
            <div className="slide-content">
                <Accordion>
                    <Row className={"mt-n2 mt-md-0"}>
                        <Col>
                            <div className="stock-name-holder">
                                <div>
                                    <h1 style={{ lineHeight: 1 }} className="stock-name mb-0">{currentInstrument.name}</h1>
                                </div>
                                <AssetAccordionCustomToggle eventKey="assetDetails">Details</AssetAccordionCustomToggle>
                            </div>
                        </Col>
                    </Row>
                    <Row className="fs-11px">
                        <Col >
                            <Accordion.Collapse eventKey="assetDetails" className="px-0">
                                <AssetDetailsComponent
                                    className={"d-md-none"} instrument={currentInstrument}
                                    assetClassName={props.assetClassName}
                                    assetClass={props.assetClass} assetType={props.assetType}
                                    group={props.group}
                                    assetTypeGroupName={props.assetTypeGroupName}
                                    fundType={props.fundType}
                                />
                            </Accordion.Collapse>
                        </Col>
                    </Row>
                </Accordion>
                <Row className="fs-11px">
                    <div className="carousel-item-left-part col-xl-7 col-lg-12">
                        <AssetDetailsComponent className={"top d-none d-md-block"}
                            instrument={currentInstrument}
                            assetClassName={props.assetClassName}
                            assetClass={props.assetClass}
                            assetType={props.assetType}
                            assetTypeGroupName={props.assetTypeGroupName}
                            typeId={props.typeId}
                            group={props.group}
                            fundType={props.fundType}
                        />
                        <div className="main-info">
                            <div className="row">
                                <div className="price-info col">
                                    <Row>
                                        <Col className="dropdown-portrait-banner">
                                            <Dropdown onSelect={(eventKey: any) => { props.onSelectExchange(eventKey); }}>
                                                <Dropdown.Toggle className="btn btn-dark dropdown-toggle hide-drop-icon pr-2"
                                                    style={{
                                                        backgroundColor: '#5b5b5b',
                                                        border: '1px solid #727272',
                                                        maxWidth: '200px',
                                                        padding: '3px 8px',
                                                        paddingRight: '30px',
                                                        borderRadius: '0',
                                                        fontSize: '12px',
                                                        lineHeight: '1',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                    {currentInstrument.exchange.name} in {currentInstrument.currency.name}
                                                    <SvgImage spanClass='m-n2 ml-5px' icon={"icon_direction_down_white.svg"} />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="dropdown-select"
                                                    style={{
                                                        position: 'absolute',
                                                        willChange: 'transform',
                                                        top: '0px',
                                                        left: '0px',
                                                        transform: 'translate3d(0px, 23px, 0px)',
                                                        backgroundColor: '#5b5b5b',
                                                        border: '1px solid #727272'
                                                    } as CSSProperties}>
                                                    {
                                                        props.instruments.map(
                                                            (i: any, idx: number) =>
                                                                <Dropdown.Item className={classNames("dropdown-item", i.showDelay && "bigger")} key={i}
                                                                    eventKey={idx.toString()}>
                                                                    <Row className="">
                                                                        <Col xs={6} className="pr-0 text-truncate">
                                                                            {i.showDelay && <SnapQuoteDelayIndicator delay={i.delay} />} {i.name}
                                                                        </Col>
                                                                        <Col xs={3} className="pl-0 text-right">
                                                                            {i.showDelay && shortNumberFormat(i.volume)}
                                                                        </Col>
                                                                        <Col xs={3} className="pl-0 text-right">
                                                                            {(i.date)}
                                                                        </Col>
                                                                    </Row>
                                                                </Dropdown.Item>
                                                        )
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col xs={12}>
                                            <PageBannerSnapQuote
                                                toggle={toggle}
                                                delay={currentInstrument.snapQuote?.delay || undefined}
                                                instrumentId={currentInstrument.id}
                                                snapQuote={value || currentInstrument.snapQuote || undefined}
                                                currency={
                                                    (currentInstrument.currency.displayCode === "XXZ" ?
                                                        currentInstrument.currency.sign : currentInstrument.currency.displayCode) || ""
                                                }
                                                assetGroup={currentInstrument.group.assetGroup as AssetGroup}
                                                investmentFund={currentInstrument.exchange.type === ExchangeType.InvestmentFund} />
                                        </Col>
                                    </Row>
                                </div>
                                {!!currentInstrument.group.assetGroup &&
                                    <PageBannerSnapQuoteChange
                                        toggle={toggle}
                                        snapQuote={value || currentInstrument.snapQuote || undefined}
                                        assetGroup={currentInstrument.group.assetGroup}
                                    />
                                }
                            </div>

                            <div className="hor-graphs mt-30px d-none d-xl-block">
                                <div className="row justify-content-between m-none">
                                    {
                                        currentInstrument.rangeCharts &&
                                        <>
                                            {currentInstrument.rangeCharts.intraday &&
                                                <RangeChartComponent data={currentInstrument.rangeCharts.intraday} period={'1T'}
                                                    title={'Eröffnung ' + numberFormat(currentInstrument.rangeCharts.intraday.threshold)} />
                                            }
                                            {currentInstrument.rangeCharts.year &&
                                                <RangeChartComponent data={currentInstrument.rangeCharts.year} period={'52W'}
                                                    title={'ø 52W'} />
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <BannerChartComponent setChartScope={props.setChartScope} setEntireInstrument={updateDropdown} group={props.group}
                        instrument={currentInstrument}
                        underlyings={props.underlyings}
                        keyFigures={props.keyFigures}
                        investmentFund={currentInstrument.group.assetGroup === AssetGroup.Fund && currentInstrument.exchange.type === ExchangeType.InvestmentFund}
                    />
                    <div className="hor-graphs mt-30px d-block d-xl-none pt-5 range-chart-border-sm pb-5 pb-md-2 mr-0">
                        <div className="row justify-content-between m-none">
                            {
                                currentInstrument.rangeCharts &&
                                <>
                                    {currentInstrument.rangeCharts.intraday != null &&
                                        <RangeChartComponent data={currentInstrument.rangeCharts.intraday} period={'1T'}
                                            className={"mr-md-5 mr-xl-0 mr-xl-0"}
                                            title={'Eröffnung ' + numberFormat(currentInstrument.rangeCharts.intraday.threshold)} />
                                    }
                                    {currentInstrument.rangeCharts.year != null &&
                                        <RangeChartComponent data={currentInstrument.rangeCharts.year} period={'52W'}
                                            title={'ø 52W'} className={"pr-0 pl-2 pl-md-0"} />
                                    }
                                </>
                            }
                        </div>
                    </div>
                </Row>
            </div>

            <BannerItemFader key={props.index}
                visible={props.activeSlide !== props.index}
                exchange={currentInstrument.exchange.name}
                currency={currentInstrument.currency.name}
            />
        </>
    );
}
