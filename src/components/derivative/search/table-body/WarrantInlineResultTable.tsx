import React, {useState} from "react";
import {getAssetLink, numberFormatDecimals, quoteFormat} from "../../../../utils";
import classNames from "classnames";
import {Link} from "react-router-dom";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import {PortfolioInstrumentAdd} from "../../../common";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import {computeDueToCss, formatUnderlyingStrike} from "../DerivativeSearchResult";
import {Ask, Bid, DelayIndicator, DueTo, DueToValue, OptionType, Time} from "./common/CommonTableElements";
import {getDerivativeKeyFiguresValueWithPerc} from "../../../Assets/CertificatesPage/WarrantCharacteristicsContainer";

export const WarrantInlineResultTable = ({group, loading, wkn, ask, bid, dueTo, id, keyFigures}: DerivativeResultTableProps) => {
    const [open, setOpen] = useState(false);

    return(
        <>
            <tr className="border-bottom border-border-gray">
                <td className="pr-0 pr-lg-2 pt-md-3">
                    <OptionType classNameLong={"d-none d-xl-block"} classNameShort={"d-xl-none d-lg-block d-none"} group={group}/>
                </td>
                <td className="font-weight-bold pl-0 text-nowrap">
                    <Link className="font-weight-bold" to={getAssetLink(group) || "#"}>{wkn}</Link>
                    {wkn &&
                    <CopyToClipboard text={wkn}>
                        <Button variant="link"
                                className="move-arrow svg-icon top-move my-n2 copy-button d-none d-lg-inline-block d-xl-none">
                              <SvgImage icon= "icon_copy_white.svg" convert={false} spanClass="copy-icon" width={'28'} />
                        </Button>
                    </CopyToClipboard>
                    }
                </td>
                <td className={"d-md-table-cell text-right d-none"}>
                    {group?.underlyings &&
                    group.underlyings.length === 1 ?
                        numberFormatDecimals(group.underlyings[0].knockOutLower, 2, 2)+ " " +
                        (group.underlyings[0].currency?.displayCode || "") : "-"}
                </td>
                <td className={"d-md-table-cell text-right d-none"}>
                    {group?.underlyings && group.underlyings.length === 1 ?
                        numberFormatDecimals(group.underlyings[0].knockOutUpper, 2, 2)+ " " +
                        (group.underlyings[0].currency?.displayCode || "") : "-"}
                </td>
                <td className={"d-md-table-cell text-right d-none"}>
                    { getDerivativeKeyFiguresValueWithPerc(keyFigures, 'sidewaysReturn') }
                </td>
                <DueTo classNameLong={"d-xl-table-cell text-center d-none"} dueTo={dueTo}/>
                <td className = "d-xl-table-cell d-none">{group?.issuer?.name}</td>
                <Bid bid={bid} group={group} loading={loading}/>
                <Ask ask={ask} group={group} loading={loading}/>
                <DelayIndicator loading={loading} bid={bid}/>
                <Time bid={bid} loading={loading}/>
                <td className="p-0 text-right">
                    {id && group.id &&
                    <ProfileInstrumentAddPopup name={group.name} instrumentId={id} instrumentGroupId={group.id}
                                               portfolio={true} watchlist={true}
                                               className="d-none d-xl-table-cell"
                    >
                        <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons" imgClass="plus-butt-icon"/>
                    </ProfileInstrumentAddPopup>
                    }
                    <Button variant="link" onClick={() => setOpen(!open)}
                            className="p-0 d-inline-block d-xl-none">
                        <img alt="Collapse arrow down" style = {{width: 40}}
                             className="cursor-pointer mt-md-0"
                             src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
                        />
                    </Button>
                </td>
            </tr>
            <tr className="d-xl-none">
                <td colSpan={12} className="p-0 ">
                    <Collapse in={open}>
                        <div>
                            <div className="d-none d-lg-block">
                                <div className="p-1">
                                    {id && group.id &&
                                    <span className="ml-n3 d-inline-block" style={{width: '64px'}}>
                                            <ProfileInstrumentAddPopup name={group.name} instrumentId={id}
                                                                       instrumentGroupId={group.id}>
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </ProfileInstrumentAddPopup>
                                        </span>
                                    }
                                    <span className="ml-n2 pr-3">Emittent: <span>{group?.issuer?.name}</span></span>
                                    <span className="px-3">Fälligkeit:
                                        <span
                                            className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 text-nowrap")}
                                        ><DueToValue dueTo={dueTo} /></span>
                                    </span>
                                    <span className="pl-3">Zeit: {quoteFormat(bid?.when)}</span>
                                </div>
                            </div>

                            <div className="font-size-14px mr-3 d-lg-none">
                                <div className="p-2">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                        <span className="px-0 text-right ml-n1">
                                            <PortfolioInstrumentAdd variant="link" className="text-white p-0 m-0">
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </PortfolioInstrumentAdd>
                                        </span>
                                        </div>
                                        <span></span>
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <span>Barriere unten: <span>
                                            {group?.underlyings &&
                                            group.underlyings.length === 1 ?
                                                numberFormatDecimals(group.underlyings[0].knockOutLower, 2, 2)+ " " +
                                                (group.underlyings[0].currency?.displayCode || "") : "-"}
                                        </span></span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Barriere oben: <span>
                                            {group?.underlyings && group.underlyings.length === 1 ?
                                                numberFormatDecimals(group.underlyings[0].knockOutUpper, 2, 2)+ " " +
                                                (group.underlyings[0].currency?.displayCode || "") : "-"}
                                        </span></span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Seitwärtsertrag %: { getDerivativeKeyFiguresValueWithPerc(keyFigures, 'sidewaysReturn') }</span>
                                        <span className="">Fälligkeit:
                                            <span
                                                className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 text-nowrap")}
                                            ><DueToValue dueTo={dueTo} /></span>
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Emittent: <b>{group.issuer?.name}</b></span>
                                        <span className="">Zeit: {quoteFormat(bid?.when)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </td>
            </tr>

        </>
    )
}

export default WarrantInlineResultTable
