import React, {useState} from "react";
import {numberFormatDecimals, quoteFormat} from "../../../../utils";
import classNames from "classnames";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import {PortfolioInstrumentAdd} from "../../../common";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import {
    computeDueToCss,
    formatUnderlyingCap,
    formatUnderlyingDiffCap,
    formatUnderlyingStrike
} from "../DerivativeSearchResult";
import WKN, {Ask, Bid, DelayIndicator, DueTo, DueToValue, OptionType, Time} from "./common/CommonTableElements";
import {getKurs} from "../../../Assets/CertificatesPage/WarrantCharacteristicsContainer";
import {
    calcAbstandBasispreisAbs,
    calcAbstandCapAbs
} from "../../../Assets/Derivatives/components/WarrantCharacteristics";

export const WarrantDiscountResultTable = ({group, loading, wkn, ask, bid, dueTo, id, keyFigures}: DerivativeResultTableProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <tr className="border-bottom border-border-gray">
                <td className="pr-0 pr-lg-2 pt-md-3">
                    <OptionType classNameLong={"d-none d-xl-block"} classNameShort={"d-none d-xl-none d-lg-block"} group={group}/>
                </td>
                <td className="font-weight-bold pl-0">
                    <WKN group={group} wkn={wkn}/>
                </td>
                <td className = "d-lg-table-cell d-none text-right">
                    {numberFormatDecimals(keyFigures?.maxReturn, 2, 2)}
                </td>
                <td className="d-table-cell d-md-none text-right">{numberFormatDecimals(keyFigures?.maxReturn, 2, 2)}</td>
                <td className="text-left d-md-table-cell d-none pr-md-1 text-right">
                    {group?.underlyings && group.underlyings.length === 1 ? formatUnderlyingStrike(group.underlyings[0]) : "-"} {/* Basispreis*/}
                </td>
                <td className = "d-none d-lg-table-cell text-right">
                    {group?.underlyings && group.underlyings.length === 1 ? formatUnderlyingCap(group.underlyings[0]) : "-"}
                </td>
                <td className = "d-xl-table-cell d-none text-right">
                    { calcAbstandCapAbs(group?.underlyings, getKurs(group?.underlyings))}
                </td>
                <DueTo classNameLong={"d-xl-table-cell d-none pl-xl-4 text-left"} dueTo={dueTo}/>
                <td className = "d-xl-table-cell d-none">{group?.issuer?.name}</td>
                <Bid bid={bid} group={group} loading={loading}/>
                <Ask ask={ask} group={group} loading={loading}/>
                <DelayIndicator loading={loading} bid={bid}/>
                <Time bid={bid} loading={loading}/>
                <td className="p-0 pt-1 text-right">
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
                                    <span className="d-inline-block ml-n3" style={{width: '64px'}}>
                                            <ProfileInstrumentAddPopup name={group.name} instrumentId={id}
                                                                       instrumentGroupId={group.id}>
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </ProfileInstrumentAddPopup>
                                        </span>
                                    }
                                    <span className="ml-n2 pr-3">
                                        Diff Cap: <span>
                                        { calcAbstandCapAbs(group?.underlyings, getKurs(group?.underlyings)) }
                                    </span>
                                    </span>
                                    <span className="px-3">Emittent: <span>{group?.issuer?.name}</span></span>
                                    <span className="">Fälligkeit:
                                        <span
                                            className={classNames(computeDueToCss(dueTo), "text-center text-nowrap")}
                                        ><DueToValue dueTo={dueTo} /></span>
                                    </span>
                                    <span className="pl-4">Zeit: {quoteFormat(bid?.when)}</span>
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
                                        <span>Basispreis: <span>
                                            {group?.underlyings && group.underlyings.length === 1 ? formatUnderlyingStrike(group.underlyings[0]) : "-"}
                                        </span></span>
                                        <span>Cap: <span>{group?.underlyings && group.underlyings.length === 1 ? formatUnderlyingCap(group.underlyings[0]) : "-"}</span></span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className={""}>Fälligkeit: <span
                                            className={classNames(computeDueToCss(dueTo), " pr-3 text-nowrap")}
                                        ><DueToValue dueTo={dueTo} /></span></span>
                                        <span>Emittent: <b>{group.issuer?.name}</b></span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Diff Cap: <span>{ calcAbstandCapAbs(group?.underlyings, getKurs(group?.underlyings)) }</span></span>
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

export default WarrantDiscountResultTable
