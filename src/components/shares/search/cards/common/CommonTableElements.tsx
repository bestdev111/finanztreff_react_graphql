import {Link} from "react-router-dom";
import {getFinanztreffAssetLink, numberFormatWithSign} from "../../../../../utils";
import React from "react";
import classNames from "classnames";
import {isColumnVisible} from "../../utils";
import {tableHeaderType} from "../../tables/shareTableHeaders";

interface CommonTableElementsProps {
    securityCategoryId?: string
    seoTag?: string
    bezeichnung?: string
    kurs?: string
    percentChange?: any
    region?: string
    displayCode?: string
    shareValue?: string
    dataIndex?: string | undefined
    period?: number | null
    className?: string
    value?: any
    tableHeaders?: tableHeaderType[] | undefined
}

export function ShowChangeArrowIcon({percentChange, className}: CommonTableElementsProps ) {
    return (
        <span className={classNames("px-1 mt-lg-n1", className)}>
                {
                    percentChange > 0 ? (
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"}
                                 alt="" className="move-arrow-icon share-table-green-icon mt-md-1 mt-n1"
                            />
                        )
                        :
                        percentChange < 0 ? (
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"}
                                     alt="" className="move-arrow-icon share-table-green-icon mt-md-1 mt-n1"
                                />
                            ) :
                            <img width={33}
                                 src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"}
                                 alt="move-arrow-icon share-table-green-icon mt-1" className="move-arrow-icon ml-n2"
                            />
                }
                </span>
    )
}
export function PercentageChange({percentChange}: CommonTableElementsProps){
    return (
        <span className={`font-size-15px ${percentChange > 0 || percentChange < 0 ? "pl-2": ""}`}>
             <span className={`${percentChange > 0 ? "text-green" : percentChange < 0 ? "text-color-pink" : "text-gray"} font-weight-bold`}>{numberFormatWithSign(percentChange)}</span>
            {!percentChange ? (
                <></>
            ) : (
                <span className={
                    `${percentChange > 0 ? "text-green" : percentChange < 0 ? "text-color-pink" : "text-gray"} font-weight-bold`}>%</span>
            )}
            </span>
    )
}

export function ShareName({securityCategoryId, seoTag, bezeichnung}: CommonTableElementsProps) {
    return (
        <td className="font-weight-bold pt-3 mb-0 pb-2 share-name-column large">
            &nbsp;&nbsp;
            {securityCategoryId && seoTag ?
                <Link to={(getFinanztreffAssetLink(securityCategoryId, seoTag))}
                      className="ml-xl-n2">{bezeichnung}</Link> :
                <>{bezeichnung}</>
            }
        </td>
    )
}

export function Kurs({kurs, percentChange, displayCode}: CommonTableElementsProps) {
    return (
        <td className="text-right pt-xl-3 mb-0 pb-2 d-flex justify-content-start mr-xl-4 mr-md-4 pl-0" style={{width: '170px'}}>
            <span className="font-weight-bold d-flex font-size-15px"><span style={{minWidth:"102px"}}>{kurs} {kurs !== '-' && <span >{displayCode}</span>}</span>
                <ShowChangeArrowIcon percentChange={percentChange}/>
            </span>
            <PercentageChange percentChange={percentChange}/>
        </td>
    )
}

export function Region({region}: CommonTableElementsProps) {
    return (
        <td className="text-left d-xl-table-cell pt-3 mb-0 pb-2 text-ellipsis" style = {{maxWidth: '100px'}}>{region}</td>
    )
}

export function CashflowSalesNetIncome({displayCode, percentChange, shareValue, tableHeaders, dataIndex, className = ""}: CommonTableElementsProps){
    return (
        <td className={classNames(className,`text-right pt-xl-3 mb-0 pb-2 justify-content-start ${isColumnVisible(dataIndex, tableHeaders) ? 'd-flex' : 'd-none'}`)}
            style={{width: '250px'}}>
            <span className="font-weight-bold d-flex font-size-15px">
                <span style={{minWidth:"100px", maxWidth: '120px', width: '120px'}}>
                    {shareValue} {displayCode}
                </span>
                <ShowChangeArrowIcon percentChange={percentChange}/>
            </span>
            <PercentageChange percentChange={percentChange}/>
        </td>
    )
}

export function CashflowSalesNetIncomeMobile({displayCode, percentChange, shareValue, tableHeaders, dataIndex}: CommonTableElementsProps){
    return (
        <td className={`text-right pt-xl-3 mb-0 pb-2 pl-0 ${isColumnVisible(dataIndex,tableHeaders) ? 'd-table-cell' : 'd-none'}`} style={{width: '250px'}}>
            <div>
                <span style={{minWidth: '115px'}} className={"font-weight-bold"}>{shareValue} {displayCode}</span>
                <ShowChangeArrowIcon percentChange={percentChange}/>
            </div>
            <br/>
            <div className={"mt-n4"}>
                <PercentageChange percentChange={percentChange}/>
                <ShowChangeArrowIcon percentChange={percentChange}/>
            </div>
        </td>
    )
}

export function Period({period, dataIndex, className, tableHeaders}: CommonTableElementsProps){
    return(
        <>
            <td className={classNames(`pt-3 ${isColumnVisible(dataIndex, tableHeaders) ? 'd-none d-xl-table-cell' : 'd-none'}`, className)}>{period}</td>
            <td className={classNames(`text-left ${isColumnVisible(dataIndex, tableHeaders) ? 'd-none d-md-table-cell d-xl-none ' : 'd-none'}`, className)}>{period}</td>
        </>
    )
}

export function TableColumn({value}: CommonTableElementsProps){
    return <td className={"pt-3"}>{value}</td>
}
