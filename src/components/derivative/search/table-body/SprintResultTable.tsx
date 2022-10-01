import React, {useState} from 'react'
import {quoteFormat} from "../../../../utils";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import WKN, {Ask, Bid, DelayIndicator, DueTo, Time} from "./common/CommonTableElements";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import classNames from "classnames";
import {computeDueToCss} from "../DerivativeSearchResult";
import {PortfolioInstrumentAdd} from "../../../common";
import {outperfSprintTypMapping} from "./common/DerivativeTypeMapping";

function DueToValue(props: { dueTo: number | null }) {
    return null;
}

export const SprintResultTable = ({group, loading, wkn, ask, bid, id, typeNameValue, dueTo, assetTypeValue}: DerivativeResultTableProps) => {

    const [open, setOpen] = useState(false);

    return(
        <>
            <tr className = "border-bottom border-border-gray">
                <td className="font-weight-bold pl-0 text-nowrap">
                    <WKN typeNameValue={typeNameValue} assetTypeValue={assetTypeValue} group={group} wkn={wkn}/>
                </td>
                <td className = "d-md-table-cell d-none text-truncate">{outperfSprintTypMapping(typeNameValue?.name)}</td>
                <td className = "d-table-cell d-md-none text-truncate px-0" style={{maxWidth: '60px'}}>{outperfSprintTypMapping(typeNameValue?.name)}</td>
                <td className = "d-none d-md-table-cell"> - </td>
                <td className = "d-none d-md-table-cell"> - </td>
                <td className = "d-none d-md-table-cell"> - </td>
                <DueTo classNameLong={"d-xl-table-cell d-none"} dueTo={dueTo}/>
                <td className={"d-xl-table-cell d-none"}>{group?.issuer?.name}</td>
                <Bid bid={bid} group={group} loading={loading}/>
                <Ask ask={ask} group={group} loading={loading} classNameLong={"px-0 text-left text-md-right"}/>
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
                                    <span className="">Emittent: <span
                                        className={"d-md-table-cell d-none"}>{group?.issuer?.name}</span>
                                    </span>
                                    <span className="pl-4">Fälligkeit: <span
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
                                            <span>Performance: <span>-</span></span>
                                        </div>
                                        <span> Aufgeld p.a: <span>-</span></span>
                                    </div>
                                    <div className = "d-flex justify-content-between">
                                         <span className=""> Akt. Erstattung: <span>-</span>
                                    </span>
                                       <span className="">Fälligkeit: <span
                                           className={classNames(computeDueToCss(dueTo), "text-center text-nowrap")}
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

export default SprintResultTable
