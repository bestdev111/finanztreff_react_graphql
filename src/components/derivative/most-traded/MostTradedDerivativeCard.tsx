import classNames from "classnames";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { Instrument, InstrumentGroupUnderlying } from "generated/graphql";
import { Link } from "react-router-dom";
import { getFinanztreffAssetLink, numberFormat } from "utils";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import {ProfileInstrumentAddPopup} from "../../common/modals/ProfileInstrumentAddPopup";
import SvgImage from "../../common/image/SvgImage";
import React from "react";

interface MostTradedDerivativeProps {
    derivative: {
        type: string,
        wkn: string,
        underlying: InstrumentGroupUnderlying,
        issuer: string,
        leverage: number,
        trades: number,
        maxRend?: number,
        instrument: Instrument,
    };
}

export default function MostTradedDerivativeCard(props: MostTradedDerivativeProps) {
    const customCardHeight = useBootstrapBreakpoint({
        xl: "220px"
    })
    const customMarginNegativeTop = useBootstrapBreakpoint({
        xl: "-2px"
    })
    const customMarginTop = useBootstrapBreakpoint({
        xl: "2px"
    })
    let { type, wkn, underlying, issuer, leverage, trades, maxRend, instrument } = props.derivative || {};

    return <>
        <div className="col">
            <div className={"big-card mb-sm-1 mt-sm-n1 mb-md-4 mt-md-n2 mb-xl-0 mt-xl-0 " + type + "-card"} style={{ minHeight: customCardHeight, marginTop: customMarginNegativeTop }}>
                <div className={classNames("top pb-xl-0", (type !== "put" && type !== "call") ? "bg-orange" : "")}>
                    <span className="text-capitalize">{instrument.group.assetGroup==="KNOCK" && type==="call" ? "long" : instrument.group.assetGroup==="KNOCK" && type==="put" ? "short" : type }</span>
                    {
                        instrument.id && instrument.group?.id &&
                        <ProfileInstrumentAddPopup name={instrument.group.name} instrumentId={instrument.id} instrumentGroupId={instrument.group.id}
                                                   portfolio={true} watchlist={true} className={"line-height-1 text-right mr-0 p-0"}
                        >
                            <SvgImage icon="icon_plus_white.svg" spanClass="action-icons" imgClass="plus-butt-icon" width="21" style={{ lineHeight: 21, float: "right" }} />
                        </ProfileInstrumentAddPopup>
                    }
                </div>
                <div className="data-section d-lg-none">
                    <div className="data-row">
                        <div className="wkn text-white">
                                <AssetLinkComponent instrument={instrument} title={"WKN: " + wkn} className={"text-white"}/>
                            <span className="font-weight-normal text-white">{issuer?.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                    </div>
                    <div className="data-row mt-0">
                        <div>Basiswert</div>
                        <div className="font-weight-bold d-block text-truncate text-white">
                            {underlying && underlying.group && underlying.group.assetGroup && underlying.group.seoTag ?
                                <Link
                                    className={"text-white"}
                                    to={getFinanztreffAssetLink(underlying.group.assetGroup, underlying.group.seoTag)}
                                >{underlying.name}
                                </Link> :
                                underlying && underlying.group && underlying.group.assetGroup && underlying.group.seoTag && underlying.exchange && underlying.exchange?.code ?
                                    <Link to={getFinanztreffAssetLink(underlying.group.assetGroup, underlying.group.seoTag, underlying.exchange.code)}
                                          className={"text-white"}
                                    >{underlying?.name}
                                    </Link>
                                    : <>{underlying?.name}</>
                            }
                        </div>
                    </div>
                    <div className="data-row">
                        {
                            (type === "Discount" || type === "Bonus") ?
                                <div className="font-weight-bold">max. Rend.: {numberFormat(maxRend)}</div>
                                :
                                <div className="font-weight-bold">Hebel: {numberFormat(leverage)}</div>
                        }
                        <div className="font-weight-bold">Trades: {trades}</div>
                    </div>
                </div>
                <div className="data-section d-none  d-lg-block">
                    <div className="data-row">
                        <div className="wkn" style={{ fontSize: 15 }}>
                            <AssetLinkComponent instrument={instrument} title={"WKN: " + wkn} className="text-white"/>
                        </div>
                    </div>
                    <div className="data-row mt-xl-2">
                        <div className={"font-size-13px"}>Basiswert:</div>
                        <div className={"font-size-13px"}>
                            {underlying && underlying.group && underlying.group.assetGroup && underlying.group.seoTag ?
                                <Link className="text-white"
                                    to={getFinanztreffAssetLink(underlying.group.assetGroup, underlying.group.seoTag)}
                                >{underlying.name}
                                </Link> :
                                underlying && underlying.group && underlying.group.assetGroup && underlying.group.seoTag && underlying.exchange && underlying.exchange?.code ?
                                    <Link className="text-white" to={getFinanztreffAssetLink(underlying.group.assetGroup, underlying.group.seoTag, underlying.exchange.code)}
                                    >{underlying?.name}
                                    </Link>
                                    : <>{underlying?.name}</>
                            }
                        </div>
                        <div className="padding-top-12 padding-bottom-3 mt-xl-n1">
                            <span className="font-size-12px">Emittent: {issuer}</span>
                        </div>
                    </div>
                    <div className="data-row">
                        {
                            (type === "Discount" || type === "Bonus") ?
                                <div className="font-weight-bold font-size-14px">max. Rend.: {numberFormat(maxRend)}</div>
                                :
                                <div className="font-weight-bold font-size-14px">Hebel: {numberFormat(leverage)}</div>
                        }
                    </div>
                    <div className="bottom-row pt-xl-3 pb-xl-0" style={{ marginTop: customMarginTop }}>
                        <div className="font-weight-bold font-size-14px mt-xl-n1">Trades: {trades}</div>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export function MostTradedDerivativeSpecialCard() {
    const customCardHeight = useBootstrapBreakpoint({
        xl: "220px"
    })
    return <>
        <div className="col" >
            <div className="big-card special-card mb-sm-1 mt-sm-n1 mb-md-4 mt-md-n2 mb-xl-0 mt-xl-0 " style={{ minHeight: customCardHeight }}>
                <div className="data-section">
                    <div className="data-row top">
                        <span>Überdurchschnittlich am Dax partizipieren</span>
                    </div>
                    <div className="data-row">
                        <div className="info-row">
                            <span className="tag long-tag">
                                <a target="_blank" href="/hebelprodukte/suche?to=5&type=CALL&asset=Knock-Out&assetGroup=KNOCK&
                                group=1361&issuerId=34&issuerName=Goldman Sachs">Long</a>
                            </span>
                            <span>Hebel &lt;5 </span>
                            <span className="tag short-tag">
                                                                <a target="_blank" href="/hebelprodukte/suche?to=5&type=PUT&asset=Knock-Out&assetGroup=KNOCK&
                                group=1361&issuerId=34&issuerName=Goldman Sachs">Short</a>
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="tag long-tag">Long</span>
                            <span>Hebel 5-10</span>
                            <span className="tag short-tag">Short</span>
                        </div>
                        <div className="info-row">
                            <span className="tag long-tag">Long</span>
                            <span>Hebel &gt;10</span>
                            <span className="tag short-tag">Short</span>
                        </div>
                    </div>
                    <div className="bottom-row mt-xl-3" >
                        <div className="werbung">Werbung</div>
                        <div className="">Morgan Stanley</div>
                    </div>
                </div>
            </div>
        </div>
    </>;
}
