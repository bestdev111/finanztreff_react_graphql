import React, {ReactNode, useEffect, useState} from 'react'
import classNames from "classnames";
import {formatDate, numberFormatDecimals, numberFormatShort, shortNumberFormat} from "../../../../utils";
import {Spinner} from "react-bootstrap";
import { PartnerLogo } from './PartnerLogo';

interface EmissionsInformationProps extends React.HTMLAttributes<HTMLElement> {
    groupId?: any;
    assetGroup?: any
    loading?: boolean
}

const EmissionsInformation = (props: EmissionsInformationProps) => {

    const [ distanceIssuePrice, setDistanceIssuePrice] = useState<any>()
    const [ underlyingPrice, setUnderlyingPrice ] = useState<any>()

    useEffect(() => {
        const lastPrice = props.groupId?.underlyings[0]?.instrument?.snapQuote?.lastPrice;
        const refPrice = props.groupId?.underlyings[0]?.referencePrice;
        const issuePrice = ((lastPrice - refPrice) * 100) / refPrice;
        setDistanceIssuePrice(issuePrice);
    }, [distanceIssuePrice, underlyingPrice, props.groupId?.underlyings])

    useEffect(() => {
        if (props.groupId?.underlyings.length === 0){
            setUnderlyingPrice(props.groupId?.underlyings[0]?.referencePrice + " " + props.groupId?.underlyings[0]?.currency?.displayCode)
        }
        else {
            setUnderlyingPrice(props.groupId?.underlyings[0]?.referencePrice)
        }
    }, [underlyingPrice, distanceIssuePrice, props.groupId?.underlyings])
    return (
        <div className={classNames("content-wrapper", props.className)}>
            <h2 className="content-wrapper-heading border-bottom-4 border-gray-light font-weight-bold pb-2">Emissionsinformationen
                {props.groupId?.issuer?.partner && <PartnerLogo className="mr-n3 float-right mt-n1"/>}
                {!props.groupId?.issuer?.partner && <></>}
            </h2>
            <div className="content">
                <Item title="Emittent" value={props.loading ? <Spinner animation={"border"}/> : props.groupId?.issuer?.name} valueCls="btn-link"/>
                <Item title="Emissionsdatum" value={props.loading ? <Spinner animation={"border"}/> : formatDate(props.groupId?.derivative?.issueDate)}/>
                <Item title="Emissionspreis" value={props.loading ? <Spinner animation={"border"}/> : `${props.groupId?.derivative?.issuePrice} ${props.groupId?.main?.currency?.displayCode}`}/>
                <Item title="Emissionsvolumen" value={props.loading ? <Spinner animation={"border"}/> : shortNumberFormat(props.groupId?.derivative?.issueSize)}/>
                <Item title="Basiswertkurs bei Emission" value={props.loading ? <Spinner animation={"border"}/> : `${numberFormatDecimals(underlyingPrice)} ${props.groupId?.main?.currency?.displayCode}`}/>
                <Item title="Abstand zum Emissionspreis" value={props.loading ? <Spinner animation={"border"}/> : `${numberFormatShort(distanceIssuePrice)}%`}/>
                <Item title="Produktbezeichnung des Emittenten" value={props.loading ? <Spinner animation={"border"}/> : props.groupId?.derivative?.nameTermSheet}/>
            </div>
        </div>
    )
}

interface ItemProps {
    title: string;
    value: ReactNode;
    valueCls?: string
}

export function Item(props: ItemProps) {
    return (
        <div className="mt-2 d-flex justify-content-between border-light border-bottom-2">
            <span className="mb-2">{props.title}</span>
            <span className={classNames("mb-2 text-right", props.valueCls)}>{props.value}</span>
        </div>
    );
}

export default EmissionsInformation
