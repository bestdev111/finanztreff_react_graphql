import React, {useState} from "react";
import classNames from "classnames";
import {numberFormatDecimals, quoteFormat} from "../../../../utils";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import {PortfolioInstrumentAdd} from "../../../common";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import {computeDueToCss, formatMoneyness, formatUnderlyingStrike} from "../DerivativeSearchResult";
import WKN, {Ask, Bid, DelayIndicator, DueTo, DueToValue, OptionType, Time} from "./common/CommonTableElements";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

export const WarrantClassicResultTable = ({keyFigures, group, loading, wkn, ask, bid, dueTo, id, typeNameValue}: DerivativeResultTableProps) => {

    const [open, setOpen] = useState(false);

    return(
        <>
            <tr className="border-bottom border-border-gray" onClick={()=> trigInfonline(guessInfonlineSection(),'search_result')}>
                <td className="pr-0 pr-lg-2 pt-md-3">
                    <OptionType group={group} classNameLong={"d-none d-xl-block"} classNameShort={" d-xl-none d-lg-block d-none"}/>
                </td>
                <td className="font-weight-bold pl-0 text-nowrap">
                    <WKN group={group} wkn={wkn}/>
                </td>
                {/*<td className={"d-xl-none d-md-table-cell d-none"}>{typeNameValue?.name}</td>*/}
                <td className="px-0 font-weight-bold text-right">
                    {numberFormatDecimals(keyFigures?.gearing, 2, 2)}
                </td>
                <td className="text-right d-md-table-cell d-none pr-md-1">
                        {group?.underlyings && group.underlyings.length === 1 ? formatUnderlyingStrike(group.underlyings[0]) : "-"}
                </td>
                <td className="d-xl-table-cell text-right d-lg-none d-sm-none">
                    {formatMoneyness(keyFigures?.moneyness)}</td>
                <td className="d-xl-none text-right d-lg-table-cell d-sm-none text-nowrap text-truncate">
                    {formatMoneyness(keyFigures?.moneyness)}</td>
                <DueTo dueTo={dueTo} classNameLong={"d-xl-table-cell d-none"}/>
                <td className="d-xl-table-cell d-none">
                    {group.issuer?.name}
                </td>
                <Bid bid={bid} group={group} loading={loading}/>
                <Ask ask={ask} group={group} loading={loading} classNameLong={"pr-3"} />
                <DelayIndicator loading={loading} bid={bid}/>
                <Time bid={bid} loading={loading}/>
                <td className="p-0 pt-1">
                    {id && group.id &&
                    <ProfileInstrumentAddPopup name={group.name} instrumentId={id} instrumentGroupId={group.id}
                                               portfolio={true} watchlist={true}
                                               className="d-none d-xl-table-cell"
                    >
                        <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons" imgClass="plus-butt-icon"/>
                    </ProfileInstrumentAddPopup>
                    }
                    <Button variant="link" onClick={() => setOpen(!open)}
                            className="p-0 d-inline-block d-xl-none ml-n3 ml-md-0">
                        <img alt="Collapse arrow down" style = {{width: 40}}
                             className="cursor-pointer mt-md-0 ml-n2"
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
                                    <span className="pl-0 pr-2">
                                        Emittent:
                                        <b>{group?.issuer?.name}</b>
                                    </span>
                                    <span className={"px-3"}>Fälligkeit:
                                    <span
                                        className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 text-nowrap")}
                                    ><DueToValue dueTo={dueTo} /></span></span>
                                    <span className="pl-3">Zeit: {quoteFormat(bid?.when)}</span>
                                </div>
                            </div>
                            <div className="font-size-14px mr-4 d-lg-none">
                                <div className="p-2">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                        <span className="px-0 text-left ml-n1">
                                            <PortfolioInstrumentAdd variant="link" className="text-white p-0 m-0">
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </PortfolioInstrumentAdd>
                                        </span>
                                            <span>Basispreis: <span>
                                                {group?.underlyings && group.underlyings.length === 1 ? formatUnderlyingStrike(group.underlyings[0]) : "-"}
                                            </span>
                                            </span>
                                        </div>
                                        <span className={""}>Fälligkeit: <span
                                            className={classNames(computeDueToCss(dueTo), " pr-3 text-nowrap")}
                                        ><DueToValue dueTo={dueTo} /></span></span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className={"text-truncate text-nowrap"} style={{maxWidth: '100%'}}>OS Wert: <span >
                                            {formatMoneyness(keyFigures?.moneyness)}
                                        </span></span>

                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="pt-1">Zeit: {quoteFormat(bid?.when)}</span>
                                        <span>Emittent: <b>{group.issuer?.name}</b></span>
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

export default WarrantClassicResultTable
