import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {AssetGroup, DerivativeOptionType, InstrumentGroup, Query} from "../../../generated/graphql";
import {loader} from "graphql.macro";
import {Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";
import {getRandomEmittent} from "../../common/emittents/emittent";

export function AssetOtherInfoSm(props: any) {
    const pHref = props.getProduktHref();

    if (props.getCountFn)
        return (<>
            <div className={"weitere " + props.className}>
                <div className="title">{props.title}</div>
                <div className="wrap d-flex">
                    <div className="infos">
                        <div className="info-row">
                            <span>Hebel</span>
                            <span>&lt;10</span>
                            <span>10-20</span>
                            <span>&gt;20</span>
                        </div>
                        <div className="info-row">
                            <span className="call-put-tag call text-capitalize">{props.type1 || 'call'}</span>
                            <span className="call-put-value">{props.getCountFn(null, 10, DerivativeOptionType.Call)}</span>
                            <span className="call-put-value">{props.getCountFn(10, 20, DerivativeOptionType.Call)}</span>
                            <span className="call-put-value">{props.getCountFn(20, null, DerivativeOptionType.Call)}</span>
                        </div>
                        <div className="info-row">
                            <span className="call-put-tag put text-capitalize">{props.type2 || 'put'}</span>
                            <span className="call-put-value">{props.getCountFn(null, 10, DerivativeOptionType.Put)}</span>
                            <span className="call-put-value">{props.getCountFn(10, 20, DerivativeOptionType.Put)}</span>
                            <span className="call-put-value">{props.getCountFn(20, null, DerivativeOptionType.Put)}</span>
                        </div>
                    </div>
                    <div className="bottom-row">
                        <div>{ pHref.name }</div>
                        <div className="text-blue font-weight-bold fnt-size-16">
                            <Link to={pHref.link} >Produkte</Link>
                        </div>
                        <div className="werbung">Werbung</div>
                    </div>
                </div>
            </div>
        </>);
    else return null;
}


export function AssetOtherInfoXl(props: any) {
    const pHref = props.getProduktHref();

    return (
        <>
            <div className={"weitere " + props.className}>
                <div className="title" style={{marginTop: "-2px"}}>{props.title}</div>
                <div className="" style={{height: "98px", marginTop: "-1px"}}>
                    <div className="info-row">
                        <span className="call-put-tag call text-capitalize">{props.type1 || 'call'}</span>
                        <span>Hebel</span>
                        <span className="call-put-tag put text-capitalize">{props.type2 || 'put'}</span>
                    </div>
                    <div className="info-row" style={{marginTop: "-1px"}}>
                        <span className="call-put-value">{props.getCountFn(null, 10, DerivativeOptionType.Call)}</span>
                        <span>&#60;10</span>
                        <span className="call-put-value">{props.getCountFn(null, 10, DerivativeOptionType.Put)}</span>
                    </div>
                    <div className="info-row" style={{marginTop: "-2px"}}>
                        <span className="call-put-value">{props.getCountFn(10, 20, DerivativeOptionType.Call)}</span>
                        <span>10-20</span>
                        <span className="call-put-value">{props.getCountFn(10, 20, DerivativeOptionType.Put)}</span>
                    </div>
                    <div className="info-row" style={{marginTop: "-2px"}}>
                        <span className="call-put-value">{props.getCountFn(20, null, DerivativeOptionType.Call)}</span>
                        <span>&#62;20</span>
                        <span className="call-put-value">{props.getCountFn(20, null, DerivativeOptionType.Put)}</span>
                    </div>
                </div>
                <div className="bottom-row" style={{marginTop: "16px"}}>
                    <div className="" style={{marginTop: "-4px"}}>{ pHref.name }</div>
                    <div className="text-blue font-weight-bold fnt-size-16">
                        <Link to={pHref.link} >Produkte</Link>
                    </div>
                </div>
            </div>
        </>);
}

export interface AssetOtherInfoProps {
    assetClassId: number | undefined;
    assetClassName: string | null | undefined;
    assetClassGroup: AssetGroup | null | undefined;
    underlyingInstrumentGroupId: number | undefined;
    title: string;
    type1: string;
    type2: string;
    homepage: boolean;
    className: string;
    data?: InstrumentGroup;
}

export function AssetOtherInfo(props: AssetOtherInfoProps) {

    const [info, setInfo] = useState<any>(props.data);

    // const data = useQuery<Query>(
    //     loader('../getUnderlyingRangeBucket.graphql'),
    //     {
    //         variables: {
    //             assetClassId: props.assetClassId,
    //             underlyingInstrumentGroupId: props.underlyingInstrumentGroupId,
    //         },
    //         skip: (!(props.underlyingInstrumentGroupId && props.assetClassId) || !props.data)
    //     }
    // );

    // useEffect(() => {
    //     console.log(data.data)
    //     setInfo(data.data);
    // }, [data.data]);


    const getCount = function (from: number | null, to: number | null, type: DerivativeOptionType) {
        if(!info || !info.derivativeKeyFigureRangeBucket) return null;

        const item = info.derivativeKeyFigureRangeBucket.find(
            (i: any) => i.from == from && i.to == to && i.optionType == type
        );

        return item ? (<a href={"/hebelprodukte/suche?from=" + from + "&to=" + to + "&type=" + type + "&aclass=" + props.assetClassName +
        "&underlying=" + props.underlyingInstrumentGroupId}>{item.count}</a>) : '-';
    }

    const getProduktHref = function () {
        const emittent = getRandomEmittent();

        return {
            link: "/hebelprodukte/suche?aclass=" + props.assetClassName + "&underlying=" + props.underlyingInstrumentGroupId +
                "&issuerId="+emittent.id+"&issuerName="+emittent.name,
            name: emittent.name
        };
    }

    if (info) {
        return (
            <>
                    <AssetOtherInfoXl className="d-none d-xl-block" title={props.title} getProduktHref={getProduktHref}
                                      type1={props.type1} type2={props.type2} homepage={true} getCountFn={getCount}/>
                    <AssetOtherInfoSm className="d-xl-none" title={props.title} homepage={true} getProduktHref={getProduktHref}
                                      type1={props.type1} type2={props.type2} data={info} getCountFn={getCount}/>
            </>
        )
    } else
        return <div className="mr-4 my-auto"><Spinner animation="border" size="sm" as="span"/></div>;
}
