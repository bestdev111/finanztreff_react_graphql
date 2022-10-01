import React, {useState} from "react";
import {quoteFormat} from "../../../../utils";
import classNames from "classnames";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import {PortfolioInstrumentAdd} from "../../../common";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import {computeDueToCss} from "../DerivativeSearchResult";
import WKN, {Ask, Bid, DelayIndicator, DueTo, DueToValue, OptionType, Time} from "./common/CommonTableElements";

export const WarrantStayResultTable = ({group, loading, wkn, ask, bid, dueTo, id, typeNameValue}: DerivativeResultTableProps) => {
    const [open, setOpen] = useState(false);

    return(
        <>
            <tr className="border-bottom border-border-gray">
                <td className="pr-0 pr-lg-2 pt-md-3">
                    <OptionType group={group} classNameLong={"d-none d-lg-block"} classNameShort={"d-block d-lg-none"}/>
                </td>
                <td className="font-weight-bold pl-0">
                    <WKN group={group} wkn={wkn}/>
                </td>
                <td className={"d-md-none d-table-cell"}>-</td>
                <td className="d-xl-none d-md-table-cell d-none">{typeNameValue.name}</td>
                <DueTo classNameLong={"d-xl-table-cell d-none pl-xl-4"} dueTo={dueTo}/>
                <td className = "d-xl-table-cell d-md-none d-none">{group?.issuer?.name}</td>
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
                             className="cursor-pointer mt-2 mt-md-0"
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
                                        <span className="px-2 text-right d-inline-block" style={{width: '64px'}}>
                                            <ProfileInstrumentAddPopup name={group.name} instrumentId={id}
                                                                       instrumentGroupId={group.id}>
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </ProfileInstrumentAddPopup>
                                        </span>
                                    }
                                    <span className="px-3">Emittent: <span>{group?.issuer?.name}</span></span>
                                    <span className="px-3">Fälligkeit:
                                        <span
                                            className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 d-xl-table-cell d-none text-nowrap")}
                                        ><DueToValue dueTo={dueTo} /></span>
                                    </span>
                                    <span className="pl-3">Zeit: {quoteFormat(bid?.when)}</span>
                                </div>
                            </div>

                            <div className="font-size-14px mr-3 d-lg-none">
                                <div className="p-2">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                        <span className="px-0 text-left ml-n1">
                                            <PortfolioInstrumentAdd variant="link" className="text-white p-0 m-0">
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </PortfolioInstrumentAdd>
                                        </span>
                                        </div>
                                        <span>Hit-Schwelle: <span>-</span></span>
                                        <span className="px-3">Fälligkeit:
                                            <span
                                                className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 d-xl-table-cell d-none text-nowrap")}
                                            ><DueToValue dueTo={dueTo} /></span>
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Emittent: <b>{group.issuer?.name}</b></span>
                                        <span className="pt-1">Zeit: {quoteFormat(bid?.when)}</span>
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

export default WarrantStayResultTable
