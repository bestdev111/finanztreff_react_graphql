import React, {useEffect, useState} from "react";
import {AssetClass, Instrument, Query} from "../../../../generated/graphql";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {Spinner} from "react-bootstrap";
import {extractQuotes, getAssetLink, numberFormat} from "../../../../utils";
import { Link } from "react-router-dom";


export interface InvestmentProductAssetRowCarouselItemColProps {
    instrument: Instrument;
    assetClass: AssetClass;
}

interface Weitere {
    name: string; count: number; assetTypeGroupId: string;
}

export default function InvestmentProductAssetRowCarouselItemCol({instrument, assetClass}: InvestmentProductAssetRowCarouselItemColProps) {

    const [weitere, setWeitere] = useState<Weitere[]>([]);
    const [alle, setAlle] = useState(0);

    const data = useQuery<Query>(
        loader('../../getDerivativeOverviewAnalogeResult.graphql'),
        {
            variables: {
                assetClass: assetClass.id,
                underlyingInstrumentGroupId: instrument.group.id,
                first: 1,
            }
        }
    );

    const weitereData = useQuery<Query>(
        loader('../../getDerivativeAnalogProductsWeitere.graphql'),
        {
            variables: {
                assetClassId: assetClass.id,
                underlyingInstrumentGroupId: instrument.group.id,
            }
        }
    );

    useEffect(() => {
        if(weitereData.data) {
            let alle = 0;
            const _w: Weitere[] = [];

            weitereData?.data?.group?.derivativeAssetTypeGroupBucket?.forEach(
                i => {
                    if(i.assetTypeGroup?.name) {
                        _w.push({name: i.assetTypeGroup.name, count: i.count, assetTypeGroupId: i.assetTypeGroup.id || ''});
                    }
                    alle += i.count;
                }
            );
            setAlle(alle);
            setWeitere(_w);
        }
    }, [weitereData.loading]);


    if(data.loading) return <div className={"p-3"} style={{height: "100px", width: "100%", textAlign: "center"}}><Spinner animation="border"/></div>;

    const d = data.data?.searchDerivative?.edges[0]?.node;

    return (<>
        <div className="col">
            <div className="product-wrapper " style={{height:"fit-content"}} >
                <div className="top-section">
                    <div className="title mb-xl-1 mt-xl-n1">{assetClass.name}</div>
                </div>
                <div className="middle-section">
                    <div className="wkn mb-2">
                        <Link className="font-weight-bold" to={{
                            pathname: getAssetLink(d?.group) || "#",
                        }}>WKN: {d?.wkn}</Link>

                    </div>
                    <div
                        className="font-weight-bold fnt-size-16">
                        <div>Seitwärtsrendite p.a.:</div>
                        <div>{numberFormat(d?.keyFigures?.sidewaysAnnualReturn, '%')}</div>
                    </div>
                    <div className="fnt-size-12">
                        <div>{d?.group?.assetType?.name}</div>
                        <div>Emittent: {d?.group?.issuer?.name}</div>
                    </div>
                    <div className="d-flex justify-content-between  mt-xl-n1 fnt-size-12" style={{marginBottom:"14px"}}>
                        <span>Bid: {numberFormat(extractQuotes(d?.snapQuote)?.bid?.value)}</span>
                        <span>Ask: {numberFormat(extractQuotes(d?.snapQuote)?.ask?.value)}</span>
                    </div>
                </div>
                <div className="bottom-section" style={{marginTop:"-1px"}} >
                    <div className="title">Weitere</div>

                    {
                        weitereData.loading ? <div className={"p-3"} style={{height: "100px", width: "100%", textAlign: "center"}}><Spinner animation="border"/></div> :
                        <>
                            <div className="d-flex justify-content-between flex-wrap fnt-size-12 font-weight-bold">
                                {
                                    weitere.map(
                                        (w: Weitere) =>
                                            <span>{w.name}:&nbsp;
                                                <span className="text-blue">
                                                    <Link
                                                        to={"/hebelprodukte/suche?underlying=" + instrument.group.id + "&aclass="+assetClass.name+"&assetGroup="+
                                                        d?.group.assetGroup+"&atype="+w.assetTypeGroupId}>{w.count}</Link>
                                                </span>
                                            </span>
                                    )
                                }
                            </div>
                            <div className="fnt-size-12 text-center font-weight-bold pt-1">
                                Alle {assetClass.name}&nbsp;
                                <span className="text-blue">{alle}</span>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    </>);
}

