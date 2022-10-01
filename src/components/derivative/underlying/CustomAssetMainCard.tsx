import React, { useState } from "react";
import AssetMainInfo, { getQuote } from "./AssetMainInfo";
import DerivativeLeftInfoRow from "../common/DerivativeLeftInfoRow";
import { Button } from "react-bootstrap";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import { AssetGroup, DerivativeOptionType, Instrument, Query, QuoteType } from "../../../generated/graphql";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { formatKeyFigureValue} from "../../../utils";
import { Link } from "react-router-dom";
import {getRandomEmittent} from "../../common/emittents/emittent";

interface CustomAssetMainCardProps {
    type: string;
    type1: string;
    type2: string;
    bottomInfo: string;
    otherTitle: string;
    instrument: Instrument | null;
    assetClassId: number | null | undefined;
    assetClassName: string | null | undefined;
    assetClassGroup: AssetGroup | null | undefined;
}


export function CustomAssetMainCardLg(props: CustomAssetMainCardProps) {

    const customMarginTop = useBootstrapBreakpoint({
        md: "-10px",
        xl: "-6px"
    })
    const weitereHeight = useBootstrapBreakpoint({
        xl: "193px"
    })

    const data = useQuery<Query>(
        loader('../getUnderlyingRangeBucket.graphql'),
        {
            variables: {
                assetClassId: props.assetClassId,
                underlyingInstrumentGroupId: props.instrument?.group?.id,
            },
            skip: !(props.instrument?.id && props.assetClassId)
        }
    );

    const getCount = function (from: number | null, to: number | null, type: DerivativeOptionType) {
        const item = data.data?.group?.derivativeKeyFigureRangeBucket?.find(
            i => i.from == from && i.to == to && i.optionType == type
        );

        return item ? (<a href={"/hebelprodukte/suche?from=" + from + "&to=" + to + "&type=" + type + "&asset=" + props.assetClassName +
            "&assetGroup=" + props.assetClassGroup + "&group=" + props.instrument?.group?.id}>{item.count}</a>) : '-';
    }

    const emittent = getRandomEmittent();
    const link = "/hebelprodukte/suche?aclass=" + props.assetClassName + "&underlying=" + props.instrument?.group?.id +
        "&issuerId="+emittent.id+"&issuerName="+emittent.name;

    if(!(props.instrument?.id && props.assetClassId)) return null;

    return <>
        <div className="col">
            <div className="data-wrapper vertical" >
                <div className="card-type pt-xl-1 mt-md-1 mt-xl-2 mb-xl-0 mb-md-0" >{props.type}</div>
                <AssetMainInfo homepage={true} bottomInfo={props.bottomInfo} showTime={false} assetClassId={props.assetClassId}
                    type1={props.type1} type2={props.type2} groupId={props.instrument?.group?.id} />

                <div className="weitere pb-md-2 pb-xl-3 mt-xl-1 mt-md-3" style={{ height: weitereHeight }}>
                    <div className="title mb-xl-0 mb-md-n2 mt-md-n1 mt-xl-n2" >{props.otherTitle}</div>
                    <div className="info-row pt-xl-0 pt-md-1" >
                        <span>Hebel</span>
                        <span>&#60;10</span>
                        <span>10-20</span>
                        <span>&#62;20</span>
                    </div>
                    <div className="info-row" >
                        <span className="call-put-tag call">{props.type1}</span>
                        <span className="call-put-value">{getCount(null, 10, DerivativeOptionType.Call)}</span>
                        <span className="call-put-value">{getCount(10, 20, DerivativeOptionType.Call)}</span>
                        <span className="call-put-value">{getCount(20, null, DerivativeOptionType.Call)}</span>
                    </div>
                    <div className="info-row mb-md-1 " style={{ paddingBottom: "5px" }} >
                        <span className="call-put-tag put">{props.type2}</span>
                        <span className="call-put-value">{getCount(null, 10, DerivativeOptionType.Put)}</span>
                        <span className="call-put-value">{getCount(10, 20, DerivativeOptionType.Put)}</span>
                        <span className="call-put-value">{getCount(20, null, DerivativeOptionType.Put)}</span>
                    </div>
                    <div className="bottom-row mt-md-0 mt-xl-1 mb-xl-2 justify-content-center" >
                        <div className="mt-xl-n1">{ emittent.name }</div>
                        <div className="info-row mt-xl-1  mt-md-1 pb-xl-1 justify-content-center" >
                            <Link to={link} >Produkte</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="button-row py-4  text-center  " style={{ marginTop: customMarginTop }} >
                <div className="font-weight-bold pb-1">Immer noch nichts dabei?</div>
                <Link to={"/hebelprodukte/suche?asset=Optionsscheine&underlying=" + props.instrument?.group?.id}
                      className="btn btn-primary" >Jetzt {props.type} suchen</Link>
            </div>
        </div>
    </>;
}

export function CustomAssetMainCardSm(props: CustomAssetMainCardProps) {
    const [collapsed, setCollapsed] = useState(true);
    function toggleCollapse() {
        setCollapsed(!collapsed);
    }

    const data = useQuery<Query>(
        loader('../getUnderlyingRangeBucket.graphql'),
        {
            variables: {
                assetClassId: props.assetClassId,
                underlyingInstrumentGroupId: props.instrument?.group?.id,
            },
            skip: !(props.instrument?.id && props.assetClassId)
        }
    );

    const getCount = function (from: number | null, to: number | null, type: DerivativeOptionType) {
        const item = data.data?.group?.derivativeKeyFigureRangeBucket?.find(
            i => i.from == from && i.to == to && i.optionType == type
        );

        return item ? (<a href={"/hebelprodukte/suche?from=" + from + "&to=" + to + "&type=" + type + "&asset=" + props.assetClassName +
            "&assetGroup=" + props.assetClassGroup + "&group=" + props.instrument?.group?.id}>{item.count}</a>) : '-';
    }

    const emittent = getRandomEmittent();
    const link = "/hebelprodukte/suche?aclass=" + props.assetClassName + "&underlying=" + props.instrument?.group?.id +
    "&issuerId="+emittent.id+"&issuerName="+emittent.name;

    return <>
        <div className="data-wrapper vertical">
            <div className="card-type pb-2 mt-n1">{props.type}</div>
            <div className="left-side">
                <DerivativeLeftInfoRow top={true} type={props.type1}
                    wkn={props.instrument?.wkn || ''}
                    issuer={props.instrument?.group?.issuer?.name || ''}
                    leverage={formatKeyFigureValue(props.instrument?.keyFigures?.gearing) || ''}
                    bid={getQuote(props.instrument?.snapQuote, QuoteType.Bid)}
                    ask={getQuote(props.instrument?.snapQuote, QuoteType.Ask)}

                />
                <DerivativeLeftInfoRow top={false} type={props.type2} leverage="15,84" wkn="A1EWWW" issuer="Goldman Sachs"
                    bid="153,84" ask="154,32" />
                <div className="bottom-info pt-md-2 mt-sm-0 ">{props.bottomInfo}</div>
            </div>
            <div className="weitere" >
                <div className="title mt-sm-0 mt-md-1" style={{ fontSize: 15 }} onClick={toggleCollapse.bind(props)}>
                    {props.otherTitle}
                    <i className="drop-arrow down right-float-arrow border-gray-dark" />
                </div>
                <div className={collapsed ? 'collapse mt-2' : 'mt-2'}  >
                    <div className="info-row">
                        <span>Hebel</span>
                        <span>&#60;10</span>
                        <span>10-20</span>
                        <span>&#62;20</span>
                    </div>
                    <div className="info-row">
                        <span className="call-put-tag call">{props.type1}</span>
                        <span className="call-put-value">{getCount(null, 10, DerivativeOptionType.Call)}</span>
                        <span className="call-put-value">{getCount(10, 20, DerivativeOptionType.Call)}</span>
                        <span className="call-put-value">{getCount(20, null, DerivativeOptionType.Call)}</span>
                    </div>
                    <div className="info-row pb-1">
                        <span className="call-put-tag put">{props.type2}</span>
                        <span className="call-put-value">{getCount(null, 10, DerivativeOptionType.Put)}</span>
                        <span className="call-put-value">{getCount(10, 20, DerivativeOptionType.Put)}</span>
                        <span className="call-put-value">{getCount(20, null, DerivativeOptionType.Put)}</span>
                    </div>
                    <div className="bottom-row" >
                        <div className="font-size-14px mt-n1 mb-sm-1  mb-md-0 ">{ emittent.name }</div>
                        <div className="info-row">
                            <Link to={link} >Produkte</Link>
                        </div>
                    </div>
                    <div className="button-row text-center mt-10px mt-md-0 mt-sm-0 " >
                        <span className="font-weight-bold">Nichts dabei?</span>
                        <Button>Jetzt Optionsscheine suchen</Button>
                    </div>
                </div>
            </div>
        </div>
    </>;
}
