import React, {useState} from "react";
import SvgImage from "../../common/image/SvgImage";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Button} from 'react-bootstrap'
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";
import {ProfileInstrumentAddPopup} from "../../common/modals/ProfileInstrumentAddPopup";
import {InstrumentGroup} from "../../../generated/graphql";
import { Link } from "react-router-dom";

interface DerivativeLeftRowInfoProps {
    type: string;
    leverage: string;
    wkn: string;
    issuer: string;
    bid: string;
    ask: string;
    bidTime?: string;
    askTime?: string;
    homepage?:boolean;
    top: boolean
    group? : InstrumentGroup;
    id?: number;
    linkTo?: any;
}

let types = ['call', 'put', 'long', 'short'];

const findType = (t: string) => types[types.indexOf(t.toLowerCase()) % 2];

export default function DerivativeLeftInfoRow(props: DerivativeLeftRowInfoProps) {
    const [isinCopied, setIsinCopied] = useState<boolean>(false);
    const[wknCopied, setWknCopied] = useState<boolean>(false);
    const customChangesMarginTop =  useBootstrapBreakpoint({
        md:"8px",
        xl:"7px",
        sm:"3px"
    })

    const customChangesMarginBottom = useBootstrapBreakpoint({
        xl:"-6px",
        md:"0px",
        sm:"-7px"
    })

    return <>
        <div
            className={`d-flex info-row ${props.homepage ? `mt-10px  pb-md-3 mb-xl-n1 mb-xl-3 py-xl-2 pt-xl-1 pt-md-2 mb-md-0 mt-sm-n1 mb-sm-n2 py-sm-1 mt-md-1 ${props.top ? "" : "info-row-overview"} ` : `py-md-2 py-sm-3 derivative-info-row-left ${props.top ? "" : "derivative-info-row-right"}`}`}
            style={{marginTop: customChangesMarginTop, marginBottom: customChangesMarginBottom}}>
            <Link to={props.linkTo}>
            <div className="tag-wrap">
                        <span className={"call-put-tag text-capitalize " + findType(props.type)}>
                            {props.type}
                        </span>
            </div>
            </Link>
            <div className={`data-info ${props.homepage ? "":""} mt-0 mt-md-n2 mt-xl-0`} >
                <div className={` value  ${props.homepage ? `mt-sm-0 mt-md-2 mt-xl-0 ${props.top? "temp-data-d":"temp-data-b "}`:""} p-0 pb-0 mb-md-n2 `} >
                    <Link to={props.linkTo}>
                        <span className={`font-size-22px ${props.top?"":"temp-data-g"}`}>{props.leverage} </span><span className={`ml-1 mt-xl-2 line-height-16px mt-sm-1 ${props.homepage ? "":""} font-weight-light font-size-12px`} style={{color:"rgb(56, 56, 56)"}}>Hebel</span>
                    </Link>

                    <div className="add-wrap" style={{ height: "2rem", paddingTop: "-1rem"}}>
                        {
                            props.id && props.group?.id &&
                            <ProfileInstrumentAddPopup name={props.group.name} instrumentId={props.id} instrumentGroupId={props.group.id}
                                                       portfolio={true} watchlist={true}
                            >
                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons" imgClass="plus-butt-icon" />
                            </ProfileInstrumentAddPopup>
                        }
                    </div>
                </div>
                <div
                    className={props.homepage ? `mt-xl-n1  ${props.top ? "left-info-overview" : " right-info-overview"}` : `mb-xl-n1 ${props.top ? "derivative-info-left" : "derivative-info-right"}`}>
                    <div className={`mt-n2 ${props.homepage ? `mt-md-1 `:"mt-md-1 mt-xl-n2"}`}>
                            <span className={`left-side-info mb-xl-n5 ${props.homepage ? "mt-xl-2":"pt-xl-2 mt-xl-1"} font-weight-bold `} >WKN: {props.wkn}
                                <CopyToClipboard text={props.wkn} onCopy={() => {
                                    setWknCopied(true);
                                    setIsinCopied(false);
                                }}>
                      <Button
                          className="move-arrow svg-icon top-move copy-button" title={wknCopied ? "Copied": "Copy"} >
                            <SvgImage icon="icon_copy_dark.svg" style={{height:25}} spanClass="copy-icon "/>
                           </Button>
                        </CopyToClipboard>

                            </span>
                        <span className="font-weight-bold" style={{minWidth: 60}}>Bid: {props.bid}</span>
                        <span>&nbsp;{props.bidTime}</span>
                    </div>
                    <div className={` ${props.homepage ? " mt-md-n2 pb-md-0 mt-xl-0 mb-xl-1 mt-md-1 mt-sm-n2":" mt-sm-n1 mt-md-1"}`}>
                        <span className={`left-side-info ${props.homepage ? "" : ""}` }>Emittent: {props.issuer}</span>
                        <span className="font-weight-bold" style={{minWidth: 60}}>Ask: {props.ask}</span>
                        <span>&nbsp;{props.askTime}</span>
                    </div>
                </div>
            </div>
        </div>
    </>;
}
