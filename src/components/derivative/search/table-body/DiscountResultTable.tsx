import React, {useState} from 'react'
import classNames from "classnames";
import {formatKeyFigureValue, numberFormatDecimals, quoteFormat} from "../../../../utils";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import {PortfolioInstrumentAdd} from "../../../common";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import {
    DerivativeInstrumentKeyFigures,
    Instrument,
    InstrumentGroup, InstrumentPerformance,
    Quote,
    SnapQuote
} from "../../../../generated/graphql";
import {computeDueToCss, formatUnderlyingCap, formatUnderlyingStrike} from "../DerivativeSearchResult";
import WKN, {Ask, Bid, DelayIndicator, DueTo, DueToValue, Time} from "./common/CommonTableElements";
import {getMaxAnnualReturn} from "../../../Assets/Derivatives/components/WarrantCharacteristics";
import {
    getCap,
    getDerivativeKeyFiguresValueWithPerc
} from "../../../Assets/CertificatesPage/WarrantCharacteristicsContainer";

export interface DerivativeResultTableProps {
    keyFigures: DerivativeInstrumentKeyFigures | undefined | null
    performance?: InstrumentPerformance[]
    snapQuote?: SnapQuote | undefined | null
    group: InstrumentGroup
    loading: boolean
    wkn: string | undefined | null
    bid: Quote | undefined
    ask: Quote | undefined
    id: number
    dueTo: number | null
    typeNameValue: any
    assetTypeValue?: any
}

export const DiscountResultTable = ({keyFigures, snapQuote, group, loading, wkn, ask, bid, id, typeNameValue, dueTo, assetTypeValue}: DerivativeResultTableProps) => {
    const [open, setOpen] = useState(false);

    return(
        <>
        <tr className = "border-bottom border-border-gray">
            <td className="font-weight-bold pl-0 text-nowrap">
                <WKN typeNameValue={typeNameValue} assetTypeValue={assetTypeValue} group={group} wkn={wkn}/>
            </td>
            <td className = "d-md-table-cell d-none">{group?.assetType?.name}</td>
            <td>
                { getCap(group?.underlyings) }
            </td>
            <td className = "d-md-table-cell d-none">
                { getDerivativeKeyFiguresValueWithPerc(keyFigures, 'discountAbsolute') }
            </td>
            <td className = "d-md-table-cell d-none text-nowrap text-truncate">
                { getDerivativeKeyFiguresValueWithPerc(keyFigures, 'maxAnnualReturn') }
            </td>
            <td className = "d-xl-table-cell d-none">
                { getDerivativeKeyFiguresValueWithPerc(keyFigures, 'sidewaysAnnualReturn') }
            </td>
            <DueTo classNameLong={"d-xl-table-cell d-none"} dueTo={dueTo}/>
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
                                    <div>SW Rend p.a.: <b>{ getDerivativeKeyFiguresValueWithPerc(keyFigures, 'sidewaysAnnualReturn') }</b></div>

                                    <div className="">Fälligkeit:
                                        <b
                                            className={classNames(computeDueToCss(dueTo), "text-center text-nowrap")}
                                        > <DueToValue dueTo={dueTo} /> </b>
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
                                        <div>Discount: <b>{ getDerivativeKeyFiguresValueWithPerc(keyFigures, 'discountAbsolute') }</b></div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>Max Rend p.a: <b>{getMaxAnnualReturn(keyFigures, group.underlyings)}</b>
                                        </div>
                                        <div>SW Rend p.a.: <b>{ getDerivativeKeyFiguresValueWithPerc(keyFigures, 'sidewaysAnnualReturn') }</b></div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>Fälligkeit:
                                            <b
                                                className={classNames(computeDueToCss(dueTo), " px-0 px-md-1 d-xl-table-cell text-nowrap")}
                                            > <DueToValue dueTo={dueTo} /> </b>
                                        </div>
                                        <div>Zeit: <b>{quoteFormat(bid?.when)}</b></div>
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

export default DiscountResultTable
