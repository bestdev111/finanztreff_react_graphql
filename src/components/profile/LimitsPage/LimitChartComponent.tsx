import { formatPrice, formatTime, numberFormat, numberFormatWithSign, quoteFormat } from "../../../utils";
import classNames from "classnames";
import "./LimitChart.scss";
import SvgImage from "components/common/image/SvgImage";
import { AssetGroup } from "graphql/types";

export function LimitChartComponent({ className, variant, showLabel, currencyCode, assetGroup,
    referencePrice, currentPrice, targetPrice, percentChange, exchangeName, date, quoteDate, trailing, percent, hitStatus, effectiveLimitValue, upper }: AnalysisProgressChartComponentProps) {
    let variantStyle = variant || 'sm';
    let height = variantStyle === 'lg' ? 148 : 24;
    let { position, innerPosition } = getAnalysisChartProperties(referencePrice, targetPrice, currentPrice, currencyCode, upper);

    return (
        <div className={classNames("analysis-progress-chart w-100", "analysis-progress-chart-" + variantStyle, className)}
            style={{ paddingTop: showLabel ? (height / 2) + "px" : undefined }}>
            {position != null &&
                <div className={classNames("pb-3 label d-flex", (position >= 50) ? 'flex-row-reverse' : '')}
                    style={{
                        paddingLeft: position < 50 ? Math.max(position - 15, 0) + '%' : undefined,
                        paddingRight: position >= 50 ? Math.max(85 - position, 0) + '%' : undefined
                    }}>
                    <div className="fs-15px" >
                        <div style={{ fontSize: "12px" }}>
                            Aktuell ({exchangeName}, {formatTime(quoteDate, " Uhr")})
                        </div>
                        <div className="text-nowrap font-weight-bold mt-n1">
                            {formatPrice(currentPrice, assetGroup)} {currencyCode}
                            {percentChange &&
                                <span className={classNames("px-2", percentChange > 0 ? "text-green" : percentChange < 0 ? "text-red" : "")}
                                >{formatPrice(percentChange,assetGroup,currentPrice, "%")}</span>
                            }
                        </div>
                    </div>
                </div>
            }
            <div className="chart w-100 position-relative">
                {position != null && <div className="progress-pointer position-absolute" style={{ left: position + '%' }}>&nbsp;</div>}
                <div className={"chart-inner d-flex w-100"}>
                    <div className={classNames("line", upper ? "yellow-line" : "red-line")} style={{ width: '10%' }}>&nbsp;</div>
                    <div className={classNames("black-divider", !upper && "down-limit")}>&nbsp;</div>

                    {upper ?
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
                    <div className={classNames("black-divider", upper && "upper-limit")}>&nbsp;</div>
                    <div className={classNames("line", upper ? "green-line" : "yellow-line")} style={{ width: '10%' }}>&nbsp;</div>
                </div>
            </div>
            <div className={classNames("d-flex justify-content-between mt-4 pt-3 label footer px-0 px-md-4", !upper ? "flex-row-reverse" : "")}>
                <div className="text-nowrap" style={{ fontSize: "12px" }}>
                    <div className="my-n1">Start <b>{formatPrice(referencePrice, assetGroup)} {currencyCode}</b></div>
                    <div className={!upper ? "text-right" : undefined}>
                        {quoteFormat(date)}
                    </div>
                </div>
                <div>
                    <div className={classNames("d-flex", upper ? "text-right limit-label" : "limit-label")}
                        style={{ backgroundColor: hitStatus ? '#F1F1F1' : upper ? "#18C48F" : "#FF4D7D", color: hitStatus == false ? "white" : upper ? "#18C48F" : "#FF4D7D" }}>
                        <div>
                            <div className="mb-n1" style={{ fontSize: "12px" }}>{upper ? "Oberes Limit" : "Unteres Limit"}</div>
                            <div className="text-right fs-15px font-weight-bold text-nowrap">
                                {formatPrice(targetPrice, assetGroup)} {trailing || percent ? "%" : currencyCode}
                                {hitStatus == false &&
                                    <span className="ml-1">
                                        ({trailing || percent ? formatPrice(effectiveLimitValue, assetGroup ) + " " + currencyCode : effectiveLimitValue ? (formatPrice(getPercentOfChange(effectiveLimitValue, referencePrice), assetGroup) + "%") : "-100%"})
                                    </span>
                                }
                            </div>
                        </div>
                        <div>
                            {
                                trailing && <SvgImage icon="icon_repeat.svg" imgClass={hitStatus ? upper ? "svg-green" : "svg-red" : "svg-white"} convert={true} width="35" />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function getAnalysisChartProperties(referencePrice: number, targetPrice: number, currentPrice?: number, currencyCode?: string, upper?: boolean) {
    if (currencyCode === "GBX" && currentPrice) {
        currentPrice = currentPrice / 100;
    }
    let isPositive = upper;
    let axis = Math.abs(referencePrice - targetPrice);
    let max = Math.max(referencePrice, targetPrice) + axis * .1;
    let min = Math.min(referencePrice, targetPrice) - axis * .1;

    let position = calculationCurrentPricePosition(min, max, currentPrice, 3, 97);
    let innerPosition = calculationCurrentPricePosition(Math.min(referencePrice, targetPrice), Math.max(referencePrice, targetPrice), currentPrice);
    let isTargetAchieved = currentPrice && ((currentPrice > targetPrice && isPositive) || (currentPrice < targetPrice && !isPositive));
    return { min, max, axis, isPositive, position, innerPosition, isTargetAchieved }
}


function calculationCurrentPricePosition(min: number, max: number, currentPrice?: number, minPosition: number = 0, maxPosition: number = 100) {
    if (!currentPrice) {
        return null;
    }
    return Math.min(Math.max((currentPrice - min) / (max - min) * 100, minPosition), maxPosition);
}


interface AnalysisProgressChartComponentProps {
    assetGroup?: AssetGroup,
    variant?: 'sm' | 'lg';
    referencePrice: number;
    currentPrice?: number;
    percentChange?: number;
    targetPrice: number;
    currencyCode: string;
    date: string,
    exchangeName: string;
    showLabel?: boolean;
    className?: string;
    quoteDate: string;
    trailing?: boolean;
    percent?: boolean;
    hitStatus?: boolean;
    effectiveLimitValue?: number;
    upper?: boolean;
}

export function getPercentOfChange(target?: number, current?: number) {
    return target && current ?
        (((target - current) / current) * 100)
        : 0
}