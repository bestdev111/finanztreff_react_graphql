import React from "react";
import classNames from "classnames";
import {Item} from "./EmissionsInformation";
import {formatDate} from "../../../../utils";
import {AssetGroup} from "../../../../generated/graphql";
import {Spinner} from "react-bootstrap";

interface TradeInformationProps extends React.HTMLAttributes<HTMLElement>{
    groupId?: any
    assetGroup?: AssetGroup
    loading?: boolean
}

const TradeInformation = ({groupId, loading, className}: TradeInformationProps) => {
    return (
        <div className={classNames("content-wrapper px-sm-3", className)}>
            <h2 className="content-wrapper-heading border-bottom-4 border-gray-light font-weight-bold pb-2 ">
                Handelsinformationen
            </h2>
            <div className="content">
                <Item title="Ausübungstag" value={loading ? <Spinner animation={"border"}/> : formatDate(groupId?.derivative?.maturityDate)}/>
                <Item title="Letzter Handelstag*" value={loading ? <Spinner animation={"border"}/> : formatDate(groupId?.main?.lastTradingDay)}/>
                <Item title="Auszahlungstag" value={loading ? <Spinner animation={"border"}/> : formatDate(groupId?.derivative?.paymentDate)}/>
                <Item title="Erster Handelstag" value={loading ? <Spinner animation={"border"}/> : formatDate(groupId?.main?.firstTradingDay)}/>
                <Item title="Börsenplatz" value={loading ? <Spinner animation={"border"}/> : groupId?.main?.exchange?.name}/>
                <Item title="Handelszeiten" value={loading ? <Spinner animation={"border"}/> : `${groupId?.main?.exchange?.openingTime} - ${groupId?.main?.exchange?.closingTime}`}/>
                <div className="mt-3 pb-1 d-md-block d-none">
                    <span className="text-gray">* In der Regel kann das Wertpapier noch am Ausübungstag beim Emittenten gehandelt werden.</span>
                </div>
                <div className="mt-3 pb-1 d-sm-block d-md-none " style={{fontSize:"13px"}}>
                    <span className="text-gray">* In der Regel kann das Wertpapier noch am Ausübungstag beim Emittenten gehandelt werden.</span>
                </div>
            </div>
        </div>
    )
}

export default TradeInformation
