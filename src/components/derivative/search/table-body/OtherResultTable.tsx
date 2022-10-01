import React, {useState} from "react";
import WKN, {Ask, Bid, DelayIndicator, DueTo, Time} from "./common/CommonTableElements";
import {DerivativeResultTableProps} from "./DiscountResultTable";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import SvgImage from "../../../common/image/SvgImage";
import {Button} from "react-bootstrap";

export const OtherResultTable = ({
                                     group,
                                     loading,
                                     wkn,
                                     ask,
                                     bid,
                                     dueTo,
                                     id,
                                     typeNameValue
                                 }: DerivativeResultTableProps) => {

    const [open, setOpen] = useState<boolean>(false);
    return (
        <>
            <tr className="border-bottom border-border-gray">
                <td className="font-weight-bold pl-0 text-nowrap">
                    <WKN group={group} wkn={wkn}/>
                </td>
                <td>{typeNameValue?.name}</td>
                <td>-</td>
                <td>-</td>
                <DueTo dueTo={dueTo} classNameLong={"d-xl-table-cell d-none"}/>
                <td>{group?.issuer?.name}</td>
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
                        <img alt="Collapse arrow down" style={{width: 40}}
                             className="cursor-pointer mt-md-0"
                             src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
                        />
                    </Button>
                </td>
            </tr>
        </>
    )
}

export default OtherResultTable
