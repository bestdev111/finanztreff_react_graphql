import React, {useEffect, useState} from 'react'
import {Table} from "react-bootstrap";
import classNames from "classnames";
import {
    numberFormat,
    numberFormatDecimals,
    numberFormatWithSign
} from "../../../../utils";
import {InstrumentGroup} from "../../../../generated/graphql";

interface UnderlyingVsWarrantProps extends React.HTMLAttributes<HTMLElement>{
    underLyingTitle: string;
    assetGroup: string;
    instrumentGroup : InstrumentGroup | undefined | null;
    label : string;
}

export const UnderlyingVSWarrant = (props: UnderlyingVsWarrantProps) => {
    return (
        <div className={classNames("content-wrapper", props.className)}>
            <h3 className="content-wrapper-heading font-weight-bold  pb-2">
                {props.underLyingTitle}
            </h3>
            <div className="content">
                {props.instrumentGroup?.underlyings?.length === 1 ?
                    <Table className=" mt-sm-n3 mt-md-0 table-borderless small-table">
                        <>
                        <tr>
                            <td  className=" p-0 font-weight-bold " colSpan={2} style={{width:208, height: 29}}  ><div className="mr-1 d-flex justify-content-center align-items-center py-1" style={{background: "#f1f1f1"}} >Basiswert</div></td>
                            <td  className=" p-0 font-weight-bold " colSpan={2} style={{width:208, height :29}} ><div className="d-flex justify-content-center align-items-center py-1" style={{background: "#f1f1f1"}}>{props.label}</div></td>
                        </tr>
                        </>
                        <tbody>
                        {props.instrumentGroup?.refundRelativeScenario?.map((row: any, index: number) =>
                            <ResultRow key={index} {...row}
                                       currencyValue={props.instrumentGroup?.underlyings?.map((value:any) => value.instrument?.currency?.displayCode)}/>)}
                        </tbody>
                    </Table> : <div style={{height: 450}}>&nbsp;</div>}
                <div className="mt-3 pb-0 mr-n3">
                    <span className="text-gray font-size-13px">* In der Regel kann das Wertpapier noch am Ausübungstag beim Emittenten gehandelt werden.</span>
                </div>
            </div>
        </div>

    )
}

interface ResultRowProps {
    underlyingPerformance?: any;
    underlyingValue?: any;
    value?: any;
    performance?: any;
    currencyValue?: any;
}

function ResultRow({underlyingPerformance, underlyingValue, value, performance, currencyValue}: ResultRowProps) {

    const [performanceColor, setPerformanceColor] = useState<string | undefined>()
    const [percentageSign, setPercentageSign] = useState<any>()

    useEffect(() => {
        if (underlyingPerformance === 0){
            setPercentageSign(numberFormatWithSign(underlyingPerformance))
        }
        else {
            setPercentageSign(numberFormatWithSign(underlyingPerformance) + "%")
        }
    }, [underlyingPerformance, percentageSign])

    useEffect(() => {
        if (performance < 0) {
            setPerformanceColor('text-danger')
        } else if (performance === 0) {
            setPerformanceColor('text-dark')
        } else {
            setPerformanceColor('text-green')
        }
    }, [performance])
    return (
        <>
            <tr className="border-bottom border-border-gray bg-white">
                <td className="font-weight-bold pt-sm-2 pb-sm-2 px-md-0 pl-md-2 mr-xl-2" style={{width: "21%"}}>
                    <span className= "ml-n2 mr-1"> {`${percentageSign}`}</span>
                </td>
                <td className=" text-right d-flex justify-content-start w-20 pt-sm-2 pb-sm-2 px-md-0 pl-xl-4">
                    <span className="mr-1"> {numberFormat(underlyingValue)}</span>
                    <span> {currencyValue}</span>
                </td>
                <td className="font-weight-bold px-sm-0  pt-sm-2 pb-sm-2 px-md-0" style={{width: "13%"}}>
                    <span className=""> {(numberFormatDecimals(value))}</span>
                </td>
                <td className={`${performanceColor} text-right  pt-sm-2 pb-sm-2 px-md-0`}>{numberFormatWithSign(performance)}%</td>

            </tr>
        </>
    );
}


export default UnderlyingVSWarrant
