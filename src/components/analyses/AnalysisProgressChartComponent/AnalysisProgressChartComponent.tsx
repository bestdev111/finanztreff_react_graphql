import {Link} from "react-router-dom";
import {numberFormat} from "../../../utils";
import React from "react";
import './AnalysisProgressChartComponent.scss';
import classNames from "classnames";

interface AnalysisProgressChartComponentProps {
    variant?: 'sm' | 'lg';
    referencePrice: number;
    currentPrice?:number;
    percentChange?: number;
    targetPrice: number;
    analysisCurrencyCode: string;
    currencyCode: string;
    timeFrame?: number;
    showLabel?: boolean;
    name?: string;
    url?: string | null;
    className?: string;
    updated?: boolean;
}

export function AnalysisProgressChartComponent({className, variant, showLabel, analysisCurrencyCode,
                                                   referencePrice, currentPrice, targetPrice, percentChange,
                                                   currencyCode, timeFrame, url, name, updated}: AnalysisProgressChartComponentProps) {
    let variantStyle = variant || 'sm';
    let height = variantStyle === 'lg' ? 148 : 24;
    let {isPositive, position, innerPosition, isTargetAchieved } = getAnalysisChartProperties(referencePrice, targetPrice, currentPrice, currencyCode);

    let currentPricePercent = currencyCode=="GBX" ? (currentPrice || 0)/100 : currentPrice || 0;
    return (
        <div className={classNames("analysis-progress-chart w-100", "analysis-progress-chart-" + variantStyle, className)}
             style={{paddingTop: showLabel ? (height / 2) + "px" : undefined }}>
            {position != null &&
                <div className={classNames("pb-3 label d-flex", (position >= 50) ? 'flex-row-reverse' : '')}
                     style={{
                         paddingLeft: position < 50 ? Math.max(position - 15, 0) + '%' : undefined,
                         paddingRight: position >= 50 ? Math.max(85 - position , 0) + '%' : undefined
                     }}>
                    <div className="fs-15px" >
                            <div className="font-weight-bold pr-3 text-dark text-ellipsis">
                                {!!name
                                     && (url ?
                                     <Link to={url} className="font-weight-bold text-dark">{name}</Link> :
                                         <>{name}</>)
                                }

                            </div>
                            <div className="text-nowrap">
                                {numberFormat(currentPrice)} {currencyCode}
                                {
                                    !!percentChange && (
                                        (percentChange > 0) ?
                                            <>
                                                <span className="px-1 text-green"> +{numberFormat(percentChange!)}%</span>
                                                <span className="svg-icon move-arrow">
                                                    <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt="" />
                                                </span>
                                            </>
                                            : percentChange && (percentChange < 0) ?
                                            <>
                                                <span className="px-1 text-red"> {numberFormat(percentChange!)}%</span>
                                                <span className="svg-icon move-arrow">
                                                    <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt="" />
                                                </span>
                                            </>
                                            :
                                            <>
                                                <span className="px-1"> 0.00%</span>
                                                <span className="svg-icon move-arrow">
                                                    <img className="pb-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"} alt="" width={27} />
                                                </span>
                                            </>
                                        )
                                }
                            </div>
                        </div>
                </div>
            }
            <div className="chart w-100 position-relative">
                {position != null && <div className="progress-pointer position-absolute" style={{ left: position  + '%'}}>&nbsp;</div>}
                {!isTargetAchieved && currentPrice &&
                    <div className="progress-value label">
                        <span className={isPositive ? "text-green" : "text-pink"}>{numberFormat((targetPrice - currentPricePercent)/ currentPricePercent * 100 )}%</span>
                    </div>
                }
                <div className={"chart-inner d-flex w-100"}>
                    <div className="line red-line" style={{width: '10%'}}>&nbsp;</div>
                    <div className="black-divider">&nbsp;</div>

                    { (targetPrice > referencePrice) ?
                        <>
                            <div className={"middle w-100 position-relative"}>
                                {innerPosition !== null &&
                                    <div className="line position-absolute stripped inner"
                                         style={{
                                             left: Math.min(Math.max(innerPosition, 0), 100) + '%',
                                             width: Math.min(Math.max(100 - innerPosition, 0), 100) + '%'
                                         }}
                                     > &nbsp; </div>
                                }
                                <div className="line linear-gradient positive-analyse w-100 inner">&nbsp;</div>
                                <span className="position-absolute arrow arrow-right">&nbsp;</span>
                            </div>
                        </> :
                        <>
                            <div className={"middle w-100 position-relative"}>
                                {innerPosition !== null &&
                                <div className="line position-absolute stripped inner"
                                     style={{
                                         left: 0,
                                         width: Math.min(Math.max(innerPosition, 0), 100) + '%'
                                     }}>
                                    &nbsp;
                                </div>
                                }
                                <div className="line linear-gradient negative-analyse w-100 inner">&nbsp;</div>
                                <div className="position-absolute arrow arrow-left">&nbsp;</div>
                            </div>
                        </>
                    }
                    <div className="black-divider">&nbsp;</div>
                    <div className="line green-line" style={{width: '10%'}}>&nbsp;</div>
                </div>
            </div>
            <div className={classNames("d-flex justify-content-between mt-2 label footer px-0 px-md-4", (targetPrice < referencePrice) ? "flex-row-reverse" : "")}>
                <div>
                    <div className="font-weight-bold">Kurs am Analysezeitpunkt</div>
                    <div className={(targetPrice < referencePrice) ? "text-right" : undefined}>
                        {numberFormat(referencePrice)} {analysisCurrencyCode}
                    </div>
                </div>
                <div>
                    <div className="font-weight-bold">
                        {updated && <img className="align-middle" width="24" alt="search news icon"
                                         src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                                     />
                        }
                        Kursziel {timeFrame && <>({timeFrame}M)</>}
                    </div>
                    <div className={(targetPrice < referencePrice) ? undefined : "text-right" }>
                        {numberFormat(targetPrice)} {analysisCurrencyCode}
                    </div>
                </div>
            </div>
        </div>
    );
}


function getAnalysisChartProperties(referencePrice: number, targetPrice: number,  currentPrice?: number, currencyCode?: string) {
    if (currencyCode === "GBX" && currentPrice) {
        currentPrice = currentPrice / 100;
    }
    let isPositive = (referencePrice < targetPrice);
    let axis = Math.abs(referencePrice - targetPrice);
    let max = Math.max(referencePrice, targetPrice) + axis * .1;
    let min = Math.min(referencePrice, targetPrice) - axis * .1;

    let position = calculationCurrentPricePosition(min, max, currentPrice, 3, 97);
    let innerPosition = calculationCurrentPricePosition(Math.min(referencePrice, targetPrice), Math.max(referencePrice, targetPrice), currentPrice);
    let isTargetAchieved = currentPrice && (( currentPrice > targetPrice && isPositive) || ( currentPrice < targetPrice && !isPositive));
    return { min, max, axis, isPositive, position, innerPosition, isTargetAchieved}
}

function calculationCurrentPricePosition(min: number, max: number, currentPrice?: number, minPosition: number = 0, maxPosition: number = 100) {
    if (!currentPrice) {
        return null;
    }
    return Math.min(Math.max((currentPrice - min) / (max - min) * 100, minPosition), maxPosition);
}
