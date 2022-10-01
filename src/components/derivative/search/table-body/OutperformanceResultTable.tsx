import React, {useState} from 'react'
import {quoteFormat} from "../../../../utils";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import WKN, {Ask, Bid, DelayIndicator, DueTo, DueToValue, Time} from "./common/CommonTableElements";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import classNames from "classnames";
import {computeDueToCss} from "../DerivativeSearchResult";
import {PortfolioInstrumentAdd} from "../../../common";
import {CalculationPeriod} from "../../../../generated/graphql";
import {getMaxReturnAbsolute, getPremiumAbsolute} from "../../../Assets/Derivatives/components/WarrantCharacteristics";
import {
    getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc,
    getPerformance
} from "../../../Assets/CertificatesPage/WarrantCharacteristicsContainer";

export const OutperformanceResultTable = ({
                                              group,
                                              performance,
                                              keyFigures,
                                              loading,
                                              wkn,
                                              ask,
                                              bid,
                                              id,
                                              typeNameValue,
                                              dueTo,
                                              assetTypeValue
                                          }: DerivativeResultTableProps) => {

    const [open, setOpen] = useState(false);

    return (
        <>
            <tr className="border-bottom border-border-gray">
                <td className="font-weight-bold pl-0 text-nowrap">
                    <WKN typeNameValue={typeNameValue} assetTypeValue={assetTypeValue} group={group} wkn={wkn}/>
                </td>
                <td className="px-0">{group.assetType?.name}</td>
                <td className="d-none d-md-table-cell text-right">{getPerformance(performance, CalculationPeriod.Month1)}</td>
                <td className="d-none d-md-table-cell text-right">{getDerivativeKeyFiguresValueWithPerc(keyFigures, 'premiumAbsolute')}</td>
                <td className="d-none d-md-table-cell text-right">{getDerivativeKeyFiguresValueWithCurr(keyFigures, group.underlyings, 'maxReturnAbsolute')}</td>
                <DueTo classNameLong={"d-xl-table-cell d-none"} dueTo={dueTo}/>
                <td className={"d-md-table-cell d-none"}>{group?.issuer?.name}</td>
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
                            className="p-0 d-inline-block d-xl-none">
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
                                <div className="p-1 d-flex">
                                    {id && group.id &&
                                        <div className="d-inline-block ml-n3" style={{width: '64px'}}>
                                            <ProfileInstrumentAddPopup name={group.name} instrumentId={id}
                                                                       instrumentGroupId={group.id}>
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </ProfileInstrumentAddPopup>
                                        </div>
                                    }
                                    <div>Emittent: <b>{group.issuer?.name}</b></div>
                                    <div className={"pl-2"}>Fälligkeit:
                                        <b
                                            className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 d-xl-table-cell text-nowrap")}
                                        > <DueToValue dueTo={dueTo} /></b>
                                    </div>
                                    <div className={"pl-2"}>Zeit: <b>{quoteFormat(bid?.when)}</b></div>
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
                                        <div>Performance:
                                            <b> {getPerformance(performance, CalculationPeriod.Month1)}</b>
                                        </div>
                                        <div>Aufgeld p.a: <b>{getDerivativeKeyFiguresValueWithPerc(keyFigures, 'premiumAbsolute')}</b>
                                        </div>
                                    </div>

                                    <div className={"d-flex justify-content-between"}>
                                        <div>Akt.
                                            Erstattung: <b>{getDerivativeKeyFiguresValueWithCurr(keyFigures, group.underlyings, 'maxReturnAbsolute')}</b>
                                        </div>
                                        <div>Fälligkeit:
                                            <b
                                                className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 d-xl-table-cell text-nowrap")}
                                            > <DueToValue dueTo={dueTo} /></b>
                                        </div>
                                    </div>


                                    <div className="d-flex justify-content-between">
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

export default OutperformanceResultTable
