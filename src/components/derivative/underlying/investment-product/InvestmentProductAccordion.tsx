import React, {useEffect, useState} from "react";
import {Accordion, Card, Spinner} from "react-bootstrap";
import {useQuery} from "@apollo/client";
import {AssetClass, Instrument, Query} from "../../../../generated/graphql";
import {loader} from "graphql.macro";
import {extractQuotes, formatPrice, numberFormat} from "../../../../utils";


interface Weitere {
    classic: number; reverse: number; alle: number;
}


export interface InvestmentProductAccordionProps {
    eventKey: any;
    instrument: Instrument;
    assetClass: AssetClass;
    visible?: boolean;
}


export default function InvestmentProductAccordion({eventKey, instrument, assetClass, visible}: InvestmentProductAccordionProps) {
    const [weitere, setWeitere] = useState<Weitere>({classic: 0, reverse: 0, alle: 0});

    const data = useQuery<Query>(
        loader('../../getDerivativeOverviewResult.graphql'),
        {
            variables: {
                assetClass: assetClass.id,
                underlyingInstrumentGroupId: instrument.group.id,
                first: 1,
            }
        }
    );

    const weitereData = useQuery<Query>(
        loader('../../getDerivativeAnalogWeitere.graphql'),
        {
            variables: {
                assetClassId: assetClass.id,
                instrumentGroupId: instrument.group.id,
            }
        }
    );

    useEffect(() => {
        if(weitereData.data) {
            const _w: Weitere = {classic: 0, reverse: 0, alle: 0};

            weitereData?.data?.group?.derivativeAssetTypeBucket?.forEach(
                i => {
                    if(i.assetType?.name && i.assetType?.name.indexOf('Classic') > -1) _w.classic += i.count;
                    if(i.assetType?.name && i.assetType?.name.indexOf('Reverse') > -1) _w.reverse += i.count;
                    _w.alle += i.count;
                }
            )
            setWeitere(_w);
        }
    }, [weitereData.loading]);


    if(data.loading || weitereData.loading) return <div className={"p-3"} style={{height: "100px", width: "100%", textAlign: "center"}}><Spinner animation="border"/></div>;

    // @ts-ignore
    const d = data.data?.callOption?.edges && data.data?.callOption?.edges[0]? data.data?.callOption?.edges[0].node : null;

    return  d ? (<>
        <Card className="border-0">
            <Card.Header className="bg-border-gray border-0 p-0">
                <Accordion.Toggle eventKey={eventKey} as={"span"}
                                  className="d-block position-relative collapsed collapsible-link text-body font-weight-bold p-10px">
                    {assetClass.name}<i className="drop-arrow right-float-arrow border-blue"/>
                </Accordion.Toggle>
            </Card.Header>
            <div className="m-n1 m-md-0">
                <Accordion.Collapse eventKey={eventKey}>
                    <Card.Body>
                        <div className="middle-section">
                            <div className="wkn">WKN: {d?.wkn}</div>
                            <div className="font-weight-bold fnt-size-16">
                                <span>Seitwärtsrendite p.a.:</span>
                                <span>&nbsp;&nbsp;{numberFormat(d?.derivativeKeyFigures?.premiumAnnual, '%')}</span>
                            </div>
                            <div className="info-row">
                                <div>{d?.group?.assetType?.name}</div>
                                <div>Emittent: {d?.group?.issuer?.name}</div>
                            </div>
                            <div className="info-row">
                                <span>Bid: {formatPrice(extractQuotes(d?.snapQuote)?.bid?.value)}</span>
                                <span>Ask: {formatPrice(extractQuotes(d?.snapQuote)?.ask?.value)}</span>
                            </div>
                        </div>
                        <div className="bottom-section">
                            <div className="title">Weitere</div>
                            {
                                weitereData.loading ? <div className={"p-3"} style={{height: "100px", width: "100%", textAlign: "center"}}><Spinner animation="border"/></div> :
                                    <>
                                        <div className="d-flex justify-content-around fnt-size-13 font-weight-bold">
                                            <span>Classic <span className="text-blue">{weitere.classic}</span></span>
                                            <span>Reverse <span className="text-blue">{weitere.reverse}</span></span>
                                            <span>Alle {assetClass.name}&nbsp;<span className="text-blue">{weitere.alle}</span></span>
                                        </div>
                                    </>
                            }
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </div>
        </Card>
    </>) : null;
}
