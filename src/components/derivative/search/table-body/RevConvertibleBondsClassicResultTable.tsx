import React, {useState} from "react";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import WKN, {Ask, Bid, DelayIndicator, DueTo, DueToValue, Time} from "./common/CommonTableElements";
import {revConvertibleTypMapping} from "./common/DerivativeTypeMapping";
import {computeDueToCss, formatUnderlyingStrike} from "../DerivativeSearchResult";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import SvgImage from "../../../common/image/SvgImage";
import {Button, Collapse} from "react-bootstrap";
import classNames from "classnames";
import {formatKeyFigureValue, quoteFormat} from "../../../../utils";
import {PortfolioInstrumentAdd} from "../../../common";
import {
    getMaxAnnualReturn, getSidewaysAnnualReturn,
    getUnderlyingsBasisprise,
    getZins
} from "../../../Assets/Derivatives/components/WarrantCharacteristics";

export const RevConvertibleBondsClassicResultTable = ({
                                                          group,
                                                          keyFigures,
                                                          loading,
                                                          wkn,
                                                          ask,
                                                          bid,
                                                          dueTo,
                                                          id,
                                                          typeNameValue, assetTypeValue
                                                      }: DerivativeResultTableProps) => {
    const [open, setOpen] = useState<boolean>(false);


    return (
        <>
            <tr className="border-bottom border-border-gray">
                <td className="font-weight-bold pl-0 pr-0 text-nowrap">
                    <WKN typeNameValue={typeNameValue} assetTypeValue={assetTypeValue} group={group} wkn={wkn}/>
                </td>
                <td className={"d-md-table-cell d-none"}>{group.assetType?.name}</td>
                <td className="text-right d-md-table-cell d-none pr-md-1 text-nowrap">
                    {getUnderlyingsBasisprise(group.underlyings)}
                </td>
                <td className={"d-md-table-cell d-none text-right"}>
                    {getZins(group)}
                </td>
                <td className={"d-md-table-cell text-right text-nowrap pl-0 pr-0"}>
                    {getMaxAnnualReturn(keyFigures, group.underlyings)}
                </td>
                <td className={"d-xl-table-cell d-none text-right"}>
                    {getSidewaysAnnualReturn(keyFigures)}
                </td>
                <DueTo dueTo={dueTo} classNameLong={"d-xl-table-cell d-none"}/>
                <td className={"d-xl-table-cell d-none"}>{group?.issuer?.name}</td>
                <Bid bid={bid} group={group} loading={loading}/>
                <Ask ask={ask} group={group} loading={loading}/>
                <DelayIndicator loading={loading} bid={bid}/>
                <Time bid={bid} loading={loading}/>
                <td className="p-0 text-right pt-xl-1">
                    {id && group.id &&
                        <ProfileInstrumentAddPopup name={group.name} instrumentId={id} instrumentGroupId={group.id}
                                                   portfolio={true} watchlist={true}
                                                   className="d-none d-xl-table-cell"
                        >
                            <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons" imgClass="plus-butt-icon"/>
                        </ProfileInstrumentAddPopup>
                    }

                    <Button variant="link" onClick={() => setOpen(!open)}
                            className="p-0 d-inline-block d-xl-none ml-n3 ml-md-0 btn btn-link">
                        <img alt="Collapse arrow down" style={{width: 40}}
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
                                <div className="p-1 d-flex justify-content-between" style={{lineHeight: "3rem"}}>
                                    {id && group.id &&
                                        <span className="d-inline-block ml-n3" style={{width: '64px'}}>
                                            <ProfileInstrumentAddPopup name={group.name} instrumentId={id}
                                                                       instrumentGroupId={group.id}>
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </ProfileInstrumentAddPopup>
                                        </span>
                                    }
                                    <div>SW Rend p.a.: <b>{getSidewaysAnnualReturn(keyFigures)}</b></div>

                                    <div className="">Fälligkeit:
                                        <b
                                            className={classNames(computeDueToCss(dueTo), "text-center text-nowrap")}
                                        > <DueToValue dueTo={dueTo} /></b>
                                    </div>

                                    <div>Emittent: <b>{group.issuer?.name}</b></div>

                                    <div>Zeit: <b>{quoteFormat(bid?.when)}</b></div>
                                </div>
                            </div>

                            <div className="font-size-14px mr-3 d-lg-none">
                                <div className="p-2">
                                    <div className="d-flex justify-content-center">
                                        <div className="px-0 text-center ml-n1">
                                            <PortfolioInstrumentAdd variant="link" className="text-white p-0 m-0">
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </PortfolioInstrumentAdd>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>Typ:
                                            <b> {group.assetType?.name}</b>
                                        </div>
                                        <div>Basispreis: <b>{getUnderlyingsBasisprise(group.underlyings)}</b></div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>Zins. p.a: <b>{getZins(group)}</b></div>
                                        <div>Max Rend p.a: <b>{getMaxAnnualReturn(keyFigures, group.underlyings)}</b>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>SW Rend p.a.: <b>{getSidewaysAnnualReturn(keyFigures)}</b></div>
                                        <div>Fälligkeit:
                                            <b
                                                className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 d-xl-table-cell text-nowrap")}
                                            > <DueToValue dueTo={dueTo} /></b>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>Emittent: <b>{group.issuer?.name}</b></div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>Zeit: <b>{quoteFormat(bid?.when)}</b></div>
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

export default RevConvertibleBondsClassicResultTable
