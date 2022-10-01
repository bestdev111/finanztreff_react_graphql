import React from "react";
import {DerivativeOptionType, InstrumentGroup, Quote} from "../../../../../generated/graphql";
import {Link} from "react-router-dom";
import {formatPrice, getAssetLink, quoteFormat} from "../../../../../utils";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {Button, Spinner} from "react-bootstrap";
import SvgImage from "../../../../common/image/SvgImage";
import {SnapQuoteDelayIndicator} from "../../../../common";
import classNames from "classnames";
import {computeDueToCss} from "../../DerivativeSearchResult";
import {useMediaQuery} from "react-responsive";

export interface CommonProps{
    wkn?: string | undefined | null
    group?: InstrumentGroup
    loading?: boolean
    bid?: Quote | undefined
    ask?: Quote | undefined
    id?: number
    dueTo?: number | null
    typeNameValue?: any
    classNameLong?: string
    classNameShort?: string
    assetTypeValue?: string
    showOnTablet?: boolean
}

export function WKN({group, wkn}: CommonProps){
    const isDesktop = useMediaQuery({
        query: '(min-width: 1281px)'
    });

    return(
        <>
            <Link className="font-weight-bold" to={{pathname: getAssetLink(group) || "#"}}>{wkn}</Link>
            {wkn && isDesktop &&
            <CopyToClipboard text={wkn}>
                <Button variant="link"
                        className="move-arrow svg-icon top-move my-n2 copy-button d-inline-block d-xl-none">
                  <SvgImage icon= 'icon_copy_white.svg' convert={false} spanClass="copy-icon" width={'28'} />
                </Button>
            </CopyToClipboard>
            }
        </>
    )
}

export function Bid({bid, loading, group, classNameLong}: CommonProps){
    return(
        <td className={`font-weight-bold text-nowrap text-right ${classNameLong}`}>
            {loading ? <Spinner animation="border"/> : formatPrice(bid?.value, group?.assetGroup)}
        </td>
    )
}

export function Ask({ask, group, loading, classNameLong}: CommonProps){
    return(
        <td className={`font-weight-bold text-nowrap text-right ${classNameLong}`}>
            {loading ? <Spinner animation="border"/> : formatPrice(ask?.value, group?.assetGroup)}
        </td>
    )
}

export function Time({loading, bid, showOnTablet}: CommonProps){
    return(
        <td className={"text-left pl-1 pr-0 d-none " + (showOnTablet ? "d-md-table-cell" : "d-xl-table-cell " ) } >
            {loading ? <Spinner animation="border"/> :
                <>
                    {quoteFormat(bid?.when)}
                </>
            }
        </td>
    )
}

export function DelayIndicator({bid, loading}: CommonProps){
    return(
        <td className="text-right d-none d-xl-table-cell px-0">
            {!loading &&
            <SnapQuoteDelayIndicator className={"d-none d-xl-inline-block"} delay={bid?.delay}/>
            }
        </td>
    )
}


export function OptionType({group, classNameLong, classNameShort}: CommonProps){
    return (
        <>
            <span
                className={classNames(group?.derivative?.optionType === DerivativeOptionType.Call ? "btn-green" : "btn-pink", `px-1 text-center text-white font-size-12px ${classNameLong}`)}>
                {group?.derivative?.optionType}
            </span>

            <span
                className={classNames(group?.derivative?.optionType === "CALL" ? "btn-green" : "btn-pink", "px-0 ml-sm-n2 mr-sm-2 px-1 text-center text-white font-size-12px d-inline-block d-md-block d-xl-none")}>
                        {group?.derivative?.optionType === "CALL" ? "C" : "P"}
            </span>
        </>
    )
}

export function DueTo({dueTo, classNameLong}: CommonProps){
    return(
            <td className={classNames(computeDueToCss(dueTo), `text-center px-0 px-md-1 text-nowrap ${classNameLong}`)}>
                <DueToValue dueTo={dueTo} />
            </td>
    )
}
export function DueToValue({dueTo}: CommonProps){
    return(<>
                {dueTo != null ? (dueTo >= 0 ? dueTo + "T" : "-") : "Open End"}
            </>)
}

export function DueToLeftAligh({dueTo, classNameLong}: CommonProps){
    return(
            <td className={classNames(computeDueToCss(dueTo), `text-left px-0 px-md-1 text-nowrap ${classNameLong}`)}>
                <DueToValue dueTo={dueTo} />
            </td>
    )
}

export default WKN
