import React, {useState} from 'react'
import classNames from "classnames";
import {Link} from "react-router-dom";
import {
    getAssetLink,
    numberFormatDecimals,
    quoteFormat
} from "../../../../utils";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import {PortfolioInstrumentAdd} from "../../../common";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import {Ask, Bid, DelayIndicator, DueTo, DueToValue, Time} from "./common/CommonTableElements";
import {computeDueToCss, formatUnderlyingStrike} from "../DerivativeSearchResult";
import {KOTypMapping} from "./common/DerivativeTypeMapping";

interface KnockResultTableProps extends DerivativeResultTableProps{
    optionName: string | null | undefined
    diffSl: number | null | undefined
}

export const KnockResultTable = ({keyFigures, group, loading, wkn, ask, bid, id, typeNameValue,optionName, diffSl, dueTo, assetTypeValue}: KnockResultTableProps) => {
    const [open, setOpen] = useState(false);

    return(
            <>
                <tr className="border-bottom border-border-gray">
                    <td className="pr-0 pr-lg-2 pt-md-3">
                    <span
                        className={classNames(group.derivative?.optionType === "CALL" ? "btn-green" : "btn-pink", "px-1 text-center text-white font-size-12px d-none d-xl-block")}>
                        {optionName}
                    </span>
                        <span
                            className={classNames(group.derivative?.optionType === "CALL" ? "btn-green" : "btn-pink", "px-0 ml-sm-n2 mr-sm-2 px-1 text-center text-white font-size-12px d-inline-block d-md-block d-xl-none")}>
                        {optionName === "LONG" ? "L" : "S"}
                    </span>
                    </td>
                    <td className="font-weight-bold pl-0 text-nowrap">
                        <Link className="font-weight-bold" to={{
                            pathname: getAssetLink(group) || "#",
                            state: {
                                assetType: assetTypeValue,
                                typeName: typeNameValue
                            }
                        }}>{wkn}</Link>
                        {wkn &&
                        <CopyToClipboard text={wkn}>
                            <Button variant="link"
                                    className="move-arrow svg-icon top-move copy-button my-n2 d-none d-lg-inline-block d-xl-none">
                                <SvgImage icon= "icon_copy_dark.svg" convert={false} spanClass="copy-icon" width={'28'} />
                            </Button>
                        </CopyToClipboard>
                        }
                    </td>
                    <td className = "d-none d-md-table-cell text-nowrap">{group.assetType?.name}</td>
                    <td className="text-right font-weight-bold">
                        {numberFormatDecimals(keyFigures?.gearing, 2, 2)} {/* Hebel*/}
                    </td>
                    <td className="text-right d-md-table-cell d-none pr-md-1 text-nowrap">
                        {group?.underlyings && group.underlyings.length === 1 ? formatUnderlyingStrike(group.underlyings[0]) : "-"}
                    </td>
                    <td className="text-right d-lg-table-cell d-sm-none">
                        {numberFormatDecimals(group && group?.underlyings && group?.underlyings[0]?.knockOut,2,2)} &nbsp;
                        {group && group?.underlyings && group?.underlyings[0]?.currency?.displayCode}
                    </td>
                    <td className="text-right d-xl-table-cell d-none text-nowrap">{numberFormatDecimals(diffSl, 2, 2, '%')}</td>
                    <DueTo dueTo={dueTo} classNameLong={"d-xl-table-cell d-none"}/>
                    <td className="text-right d-xl-table-cell d-none">{group?.issuer?.name}</td>
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
                            <img alt="Collapse arrow down"
                                 className="cursor-pointer mt-md-0" style = {{width: 40}}
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
                                        <span className={"px-3"}>Emittent: <span>{group?.issuer?.name}</span></span>
                                        <span className={"px-3"}>Diff SL: <span>{diffSl}</span></span>
                                        <span className={"px-3"}>Fälligkeit:
                                            <span
                                                className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 text-nowrap")}
                                            ><DueToValue dueTo={dueTo} /></span></span>
                                        <span className="px-2">
                                        Zeit: {quoteFormat(bid?.when)}
                                    </span>
                                    </div>
                                </div>
                                <div className="font-size-14px d-lg-none">
                                    <div className="p-2">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                        <span className="px-0 text-left ml-n1">
                                            <PortfolioInstrumentAdd variant="link" className="text-white p-0 m-0">
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </PortfolioInstrumentAdd>
                                        </span>
                                                <span>
                                            Strike:
                                                    {group?.underlyings && group.underlyings.length === 1 ? formatUnderlyingStrike(group.underlyings[0]) : "-"}
                                        </span>
                                            </div>
                                            <span>SL: <span>{numberFormatDecimals(group && group?.underlyings && group?.underlyings[0]?.knockOut,2,2)} &nbsp;
                                                {group && group?.underlyings && group?.underlyings[0]?.currency?.displayCode}

                                            </span></span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Diff SL: <b>{diffSl}</b></span>
                                            <span>Fälligkeit:
                                                <span
                                                    className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 text-nowrap")}
                                                ><DueToValue dueTo={dueTo} /></span>
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Emittent: <b>{group.issuer?.name}</b></span>
                                            <span className="px-0">Zeit: {quoteFormat(bid?.when)}</span>
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

export default KnockResultTable
