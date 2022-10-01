import React, {useState} from "react";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import {quoteFormat} from "../../../../utils";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import classNames from "classnames";
import {PortfolioInstrumentAdd} from "../../../common";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import {computeDueToCss} from "../DerivativeSearchResult";
import WKN, {Ask, Bid, DelayIndicator, DueTo, DueToValue, Time} from "./common/CommonTableElements";
import {
    getBonusBufferPerc,
    getBonusLevel, getPremiumAbsolute,
    getSecurity
} from "../../../Assets/Derivatives/components/WarrantCharacteristics";
import {
    getBarriereAktiv, getBarriereAktivSimple, getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc
} from "../../../Assets/CertificatesPage/WarrantCharacteristicsContainer";

export const BonusClassicResultTable = ({group, loading, wkn, ask, bid, dueTo, id, typeNameValue, assetTypeValue, keyFigures}: DerivativeResultTableProps) => {
    const [open, setOpen] = useState(false);

    return(
        <>
            <tr className = "border-bottom border-border-gray">
                <td className="font-weight-bold pl-0 text-nowrap">
                    <WKN typeNameValue={typeNameValue}  assetTypeValue={assetTypeValue} group={group} wkn={wkn}/>
                </td>
                <td className={"d-md-table-cell d-none"}>{group.assetType?.name}</td>
                <td className={"d-md-table-cell d-none"}>{ getBonusLevel(group.underlyings) }</td>
                <td className={"d-md-table-cell d-none"}>{ getSecurity(group.underlyings) }</td>
                <td className={"d-md-table-cell d-none"}>{ getDerivativeKeyFiguresValueWithCurr(keyFigures, group.underlyings, 'bonusBufferAbsolute') }</td>
                <td className={"d-md-table-cell d-none"}>{ getDerivativeKeyFiguresValueWithPerc(keyFigures, 'bonusAnnualReturn') }</td>
                <td className={"d-xl-table-cell d-none"}>{ getDerivativeKeyFiguresValueWithPerc(keyFigures, 'premiumAnnual') }</td>
                <td className={"d-xl-table-cell d-none"}>{ getBarriereAktivSimple(group.underlyings) }</td>
                <DueTo dueTo={dueTo} classNameLong={"d-xl-table-cell d-none"}/>
                <td className={"d-xl-table-cell d-none"}>{group?.issuer?.name}</td>
                <Bid bid={bid} group={group} loading={loading}/>
                <Ask ask={ask} group={group} loading={loading} classNameLong={"px-0"}/>
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
                                <div className="p-1 d-flex justify-content-between">
                                    {
                                        id && group.id &&
                                        <div className="d-flex justify-content-center">
                                            <div className="px-0 text-center ml-n1">
                                                <PortfolioInstrumentAdd variant="link" className="text-white p-0 m-0">
                                                    <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                              imgClass="plus-butt-icon"/>
                                                </PortfolioInstrumentAdd>
                                            </div>
                                        </div>
                                    }
                                    <div className={"pr-3"}>! <b>{ getBarriereAktiv(group.underlyings) }</b></div>
                                    <div className={"pr-3"}>Aufgeld p.a <b>{ getDerivativeKeyFiguresValueWithPerc(keyFigures, 'premiumAnnual') }</b></div>
                                    <div className={""}>Fälligkeit:
                                        <b
                                            className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 d-xl-table-cell text-nowrap")}
                                        > <DueToValue dueTo={dueTo} /></b>
                                    </div>
                                    <div>Emittent: <b>{group.issuer?.name}</b></div>
                                    <div>Zeit: <b>{quoteFormat(bid?.when)}</b></div>
                                </div>
                            </div>


                            <div className="font-size-14px mr-3 d-lg-none">
                                <div className="p-2">
                                    <div className="d-flex justify-content-center">
                                            <PortfolioInstrumentAdd variant="link" className="text-white p-0 m-0">
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </PortfolioInstrumentAdd>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>Typ:
                                            <b> {group.assetType?.name}</b>
                                        </div>
                                        <div>B.Level: <b>{ getBonusLevel(group.underlyings) }</b></div>
                                    </div>

                                    <div className={"d-flex justify-content-between"}>
                                        <div>Barriere: <b>{ getSecurity(group.underlyings) }</b></div>
                                        <div>B.Puffer %: <b>{ getDerivativeKeyFiguresValueWithCurr(keyFigures, group.underlyings, 'bonusBufferAbsolute') }</b></div>
                                    </div>

                                    <div className={"d-flex justify-content-between"}>
                                        <div>Aufgeld p.a: <b>{ getDerivativeKeyFiguresValueWithPerc(keyFigures, 'premiumAnnual') }</b></div>
                                        <div>!: <b>{ getBarriereAktiv(group.underlyings) }</b></div>
                                    </div>


                                    <div className="d-flex justify-content-between">
                                        <div>Fälligkeit:
                                            <b
                                                className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 d-xl-table-cell text-nowrap")}
                                            > <DueToValue dueTo={dueTo} /> </b>
                                        </div>
                                        <div>Zeit: <b>{quoteFormat(bid?.when)} </b></div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>Emittent: <b>{group.issuer?.name}</b></div>
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

export default BonusClassicResultTable
