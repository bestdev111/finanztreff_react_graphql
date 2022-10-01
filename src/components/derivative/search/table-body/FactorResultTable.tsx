import React, {useState} from 'react'
import {DerivativeResultTableProps} from "./DiscountResultTable";
import {numberFormatDecimals, quoteFormat} from "../../../../utils";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import classNames from "classnames";
import {PortfolioInstrumentAdd} from "../../../common";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import {computeDueToCss} from "../DerivativeSearchResult";
import WKN, {Ask, Bid, DelayIndicator, DueTo, DueToValue, Time} from "./common/CommonTableElements";

interface FaktorResultTableProps extends DerivativeResultTableProps {
    optionName: string | null | undefined
}

export const FactorResultTable = ({id, wkn, group, dueTo, ask, bid, loading, optionName, assetTypeValue, typeNameValue, keyFigures}: FaktorResultTableProps) => {
    const [open, setOpen] = useState(false);

    return(
        <>
            <tr className = "border-bottom border-border-gray">
                <td className="pr-0 pr-lg-2 pt-md-3">
                    <span
                        className={classNames(group.derivative?.optionType === "CALL" ? "btn-green" : "btn-pink", "px-1 text-center text-white font-size-12px d-none d-md-block")}>
                        {optionName}
                    </span>
                    <span
                        className={classNames(group.derivative?.optionType === "CALL" ? "btn-green" : "btn-pink", "px-0 ml-sm-n2 mr-sm-2 px-1 text-center text-white font-size-12px d-block d-md-none")}>
                        {optionName === "LONG" ? "L" : "S"}
                    </span>
                </td>
                <td className="font-weight-bold pl-0 text-nowrap d-md-table-cell d-none">
                    <WKN typeNameValue={typeNameValue}  assetTypeValue={assetTypeValue} group={group} wkn={wkn}/>
                </td>
                <td className="font-weight-bold text-right pr-1">
                    {numberFormatDecimals(keyFigures?.gearing, 2, 2)}
                </td>
                <td className={"d-md-table-cell d-none text-center"}>{numberFormatDecimals(group.underlyings && group?.underlyings[0]?.strike, 2,2)}</td>
                <td className={"d-md-table-cell d-none text-center"}>{numberFormatDecimals(group.underlyings && group?.underlyings[0]?.knockOut , 2,2)}</td>
                <DueTo dueTo={dueTo} classNameLong={"d-md-table-cell d-none"}/>
                <td className={"d-xl-table-cell d-none"}>{group?.issuer?.name}</td>
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
                                    <span className={""}>Emittent: {group?.issuer?.name}</span>
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
                                                Akt. Basispreis: {numberFormatDecimals(group.underlyings && group?.underlyings[0]?.strike, 2,2)}
                                            </span>
                                        </div>
                                        <span>Akt. Barriere: {numberFormatDecimals(group.underlyings && group?.underlyings[0]?.knockOut, 2,2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Fälligkeit:
                                            <span
                                                className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 text-nowrap")}
                                            > <DueToValue dueTo={dueTo} /> </span>
                                            </span>
                                        <span>Emitent: <b>{group.issuer?.name}</b></span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="px-0">Zeit: {quoteFormat(bid?.when)}
                                            </span>
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

export default FactorResultTable
