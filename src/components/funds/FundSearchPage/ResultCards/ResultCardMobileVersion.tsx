import classNames from "classnames";
import { RiskSectionDonut } from "components/Assets/FundsPage/RisikoFundFeedSection/RiskSecton";
import SvgImage from "components/common/image/SvgImage";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { CalculationPeriod, ChartScope, Instrument, QuoteType } from "graphql/types";
import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { numberFormat, quoteFormat, shortNumberFormat } from "utils";
import { FundChartComponent } from "./ChartComponent/getFundPerformanceChart";
import { getColor } from "./FundResultCard";
import {RangeChartDonut} from "../../../common/charts/RangeChartDonut/RangeChartDonut";

export function ResultCardMobileVersion(props: { fund?: Instrument }) {
    const [open, setOpen] = useState(false);
    if (props.fund) {
        let performanceOneYear = props.fund && props.fund.performance && props.fund.performance.filter(p => p.period === CalculationPeriod.Week52)[0];
        let performanceThreeYears = props.fund && props.fund.performance && props.fund.performance.filter(p => p.period === CalculationPeriod.Year3)[0];
        let nav = props.fund.snapQuote?.quotes?.filter(q => q?.type === QuoteType.NetAssetValue)[0];
        return (
            <>
                <div className="bg-white fund-result-card mb-3 d-xl-none d-lg-none d-md-none d-sm-block ml-n3">

                    <div className="icon-line-vertical d-flex justify-content-between w-100">
                        <div className="d-flex">
                            {props.fund?.group && props.fund.group.id
                                && <ProfileInstrumentAddPopup
                                    instrumentId={props.fund.id}
                                    instrumentGroupId={props.fund.group.id}
                                    name={props.fund.name}
                                    className="p-0 mr-n1"
                                    watchlist={true} portfolio={true}>
                                    <SvgImage icon="icon_plus_blue.svg" imgClass="svg-blue mt-2 mx-1" width="26" />
                                </ProfileInstrumentAddPopup>
                            }
                            {props.fund?.group.fundTranche?.main === false &&
                                <SvgImage icon="icon_tranch.svg" convert={true} imgClass="svg-blue mt-2" width="30" />
                            }
                        </div>
                        <div className="bg-grass-green p-1 text-white my-auto" style={{ fontSize: "12px" }}>
                            {props.fund?.group?.fund?.type?.name ? props.fund.group.fund?.type?.name : "FOND"}
                        </div>
                    </div>
                    <div className="fs-18px ml-2 text-blue text-truncate m-2">
                        <AssetLinkComponent instrument={props.fund} />
                    </div>
                    <div className="fs-18px d-flex my-3">
                        <div className="pie-chart mx-n4">
                            <RangeChartDonut value={props.fund.group?.fundTranche?.totalExpenseRatio || 0} width={180} height={140} fontSize={22} titlePosition={15} />
                            <div className="font-weight-bold text-center fs-15px pie-title text-truncate">Gebühren (TER)</div>
                        </div>
                        <div className="pie-chart mr-n4">
                            <RiskSectionDonut riskFactor={props.fund.group.fundTranche?.srri?.value || 0} width={180} height={140} fontSize={22} titlePosition={15} />
                            <div className={classNames("font-weight-bold text-center fs-15px pie-title", !props.fund.group.fundTranche?.srri?.value && "text-gray")}>Risiko (KID)</div>
                        </div>
                        <div>
                            <div className={classNames("fs-22px font-weight-bold text-center", getColor(performanceOneYear && performanceOneYear.performance || 0))}>
                                {numberFormat(performanceOneYear && performanceOneYear.performance, " %")}
                            </div>
                            <div className="fs-15px font-weight-bold">Perf. 1 Jahr</div>
                        </div>
                    </div>
                    <div className="d-flex my-3 font-weight-bold">
                        <div className="mx-2">
                            <div className={classNames("fs-22px font-weight-bold text-center", getColor(performanceThreeYears && performanceThreeYears.performance || 0))}>
                                {numberFormat(performanceThreeYears && performanceThreeYears.performance, " %")}
                            </div>
                            <div className="fs-15px font-weight-bold text-center text-truncate">Perf. 3 Jahre</div>
                        </div>
                        <div className="mx-2">
                            <div className="fs-22px font-weight-bold text-center">
                                {numberFormat(performanceOneYear && performanceOneYear.deltaAveragePrice, " %")}
                            </div>
                            <div className="fs-15px font-weight-bold text-center text-truncate">Abstand 52W</div>
                        </div>
                        <div className="mx-2">
                            <div className="fs-22px font-weight-bold text-center text-truncate">
                                {shortNumberFormat(props.fund.group?.fundTranche?.investmentVolume?.value)}
                            </div>
                            <div className="fs-15px font-weight-bold text-center">Fondsvolumen</div>

                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center cursor-default">
                        <a className="text-blue text-decoration-none" onClick={() => setOpen(!open)}>
                            <span className="text-blue">
                                Details anzeigen
                                <SvgImage icon="icon_direction_down_blue_light.svg" width={"27"} className="pt-n1" style={{ transform: open ? "rotate(180deg)" : "" }} />
                            </span>
                        </a>
                    </div>
                    <Collapse in={open}>
                        <div>
                            <div style={{ minWidth: "344px" }}>
                                <div className="fs-13px text-kurs-grau mb-n4 ml-2">Zeitraum: 3J</div>
                                <FundChartComponent instrumentId={props.fund.id} chartType={ChartScope.ThreeYear} height={150} width={360}/>
                            </div>
                            <div>
                                <div className="ml-2">
                                    <span className="fs-22px font-weight-bold">177,88 EUR</span>
                                    <div className="mt-n2 line-height-2" >
                                        <span className="fs-13px">{quoteFormat(nav?.when)}</span>
                                        <span className="fs-13px"> Börse: {props.fund.exchange.name}</span>
                                    </div>
                                </div>

                                <div className="ml-2 d-flex mt-3">
                                    <div className="fs-15px mr-5">
                                        <span className="font-weight-bold mr-2">Region</span>
                                        <span className="text-nowrap">{props.fund.group.fund?.region?.name || "-"}</span>
                                    </div>
                                    <div className="fs-15px">
                                        <span className="font-weight-bold mr-2">Thema</span>
                                        <span className="text-nowrap">{props.fund.group.fund?.topic?.name || "-"}</span>
                                    </div>
                                </div>
                                <div className="fs-15px m-2 pb-3" style={{ lineHeight: "1.2" }}>
                                    {props.fund.group.fundTranche?.currency?.displayCode || ""}

                                    {props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.distributing === false ?
                                        ", ausschüttend" : props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.distributing ?
                                            ", thesaurierend" : ""}

                                    {props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.germanVwlCapable === false ?
                                        ", nicht VL-fähig" : props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.germanVwlCapable ?
                                            ", VL-fähig" : ""}
                                    {props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.savingPlanCapable === false ?
                                        ", nicht Sparplanfähig" : props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.savingPlanCapable ?
                                            ", Sparplanfähig" : ""}
                                    <br />
                                    {props.fund.group?.fund?.company?.name && "KVG: " + props.fund.group?.fund?.company?.name}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </div>
            </>
        );
    }
    else {
        return (<></>)
    }
}
