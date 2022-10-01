import React, {useState} from "react";
import {quoteFormat} from "../../../../utils";
import {Button, Collapse} from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import {PortfolioInstrumentAdd} from "../../../common";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import WKN, {Ask, Bid, DelayIndicator, DueTo, DueToValue, Time} from "./common/CommonTableElements";
import {indexTypMapping} from "./common/DerivativeTypeMapping";

export const IndexBasketResultTable = ({group, loading, wkn, dueTo, typeNameValue, ask, bid, id}: DerivativeResultTableProps) => {

    const [open, setOpen] = useState(false);

    return(
        <>
            <tr className="border-bottom border-border-gray">
                <td className="font-weight-bold pl-0 text-nowrap">
                    <WKN group={group} wkn={wkn}/>
                </td>
                <td className={"d-md-table-cell d-none text-nowrap text-truncate"} style={{maxWidth: '80px'}}>{indexTypMapping(typeNameValue?.name)}</td>
                <td>-</td>
                <DueTo dueTo={dueTo} classNameLong={"d-md-table-cell d-none"}/>
                <td className="d-md-table-cell d-none text-nowrap text-truncate" style={{maxWidth: '80px'}}>{group.issuer?.name}</td>
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
                                    <span className="ml-n3 d-inline-block" style={{width: '64px'}}>
                                            <ProfileInstrumentAddPopup name={group.name} instrumentId={id}
                                                                       instrumentGroupId={group.id}>
                                                <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons"
                                                          imgClass="plus-butt-icon"/>
                                            </ProfileInstrumentAddPopup>
                                        </span>
                                    }
                                    <span className="px-2">
                                        Zeit: {quoteFormat(bid?.when)}
                                    </span>
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
                                        <span>Performance: <span>-</span></span>
                                        <span>Fälligkeit: <DueToValue dueTo={dueTo} /></span>
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

export default IndexBasketResultTable
