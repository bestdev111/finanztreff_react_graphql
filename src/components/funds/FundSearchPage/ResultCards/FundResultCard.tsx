import classNames from "classnames";
import { RiskSectionDonut } from "components/Assets/FundsPage/RisikoFundFeedSection/RiskSecton";
import SvgImage from "components/common/image/SvgImage";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import {CalculationPeriod, ChartScope, Instrument, InstrumentGroupFundTranche} from "graphql/types";
import {Row, Col, Collapse, Button} from "react-bootstrap";
import {extractQuotes, formatPrice, numberFormat, quoteFormat, shortNumberFormat} from "utils";
import { FundChartComponent } from "./ChartComponent/getFundPerformanceChart";
import {useState} from "react";
import {SizeMe} from "react-sizeme";
import {useViewport} from "../../../../hooks/useViewport";
import {RangeChartDonut} from "../../../common/charts/RangeChartDonut/RangeChartDonut";

export function FundResultCard(props: { fund: Instrument }) {
    const [open, setOpen] = useState(false);
    const {width} = useViewport();
    let performanceOneYear = props.fund && props.fund.performance && props.fund.performance.filter(p => p.period === CalculationPeriod.Week52)[0];
    let performanceThreeYears = props.fund && props.fund.performance && props.fund.performance.filter(p => p.period === CalculationPeriod.Year3)[0];
    let { nav } = extractQuotes(props.fund.snapQuote);
    return (
        <div className="bg-white fund-result-card mb-3 d-flex flex-column flex-md-row" style={{boxShadow: "0px 3px 6px #00000029"}}>
            <div className="d-flex flex-md-column icon-line justify-content-md-start justify-content-sm-between px-1">
                <div className="d-flex flex-row flex-md-column">
                    {props.fund.group && props.fund.group.id
                        && <ProfileInstrumentAddPopup
                            instrumentId={props.fund.id}
                            instrumentGroupId={props.fund.group.id}
                            name={props.fund.name}
                            className="p-0 mr-n1"
                            watchlist={true} portfolio={true}>
                            <SvgImage icon="icon_plus_blue.svg" imgClass="svg-blue mt-2" width="28" />
                        </ProfileInstrumentAddPopup>
                    }
                    { !props.fund.group.fundTranche?.main &&
                        <SvgImage icon="icon_tranch.svg" convert={true} imgClass="svg-blue mt-2" width="32" />
                    }
                </div>
                <span className="bg-grass-green p-1 my-auto text-white d-inline-block d-md-none" style={{ fontSize: "12px" }}>
                        {props.fund.group.fund?.type?.name ? props.fund.group.fund?.type?.name : "FOND"}
                </span>
            </div>
            <div className="p-1 p-md-2 ">
                <div className={"d-flex flex-row justify-content-start"}>
                    <div className={""}>
                        <span className="d-none d-md-inline-block bg-grass-green my-auto text-white p-1" style={{ fontSize: "12px" }}>
                            {props.fund.group.fund?.type?.name ? props.fund.group.fund?.type?.name : "FOND"}
                        </span>
                    </div>
                    <div className="ml-2 text-truncate" style={{width: (width < 576 ? 500 : (width < 1280 ? 576: Math.min(1000, width*.75))) + "px"}}>
                        <AssetLinkComponent className={"fs-18px text-blue"} instrument={props.fund} />
                    </div>
                </div>
                <div className="mt-3 fund-information d-flex flex-column flex-md-row flex-wrap">
                    <div className={"d-flex w-100"}>
                        <div className={"d-none d-md-inline-block"}>
                            <div className="fs-13px text-kurs-grau mb-n4">Zeitraum: 3J</div>
                            <FundChartComponent instrumentId={props.fund.id} chartType={ChartScope.ThreeYear} height={90} width={230}/>
                            <div className="">
                                <span className="fs-22px font-weight-bold">{formatPrice(nav?.value, props.fund.group?.assetGroup,props?.fund?.snapQuote?.quote?.value,  props.fund.group.fundTranche?.currency?.displayCode || "")}</span>
                                <div className="mt-n2 line-height-1" >
                                    <span className="fs-13px">{quoteFormat(nav?.when)}</span>
                                    <span className="fs-13px"> Börse: {props.fund.exchange.name}</span>
                                </div>
                            </div>
                        </div>
                        <Row className={"px-xl-4 px-0 flex-fill"}>
                            <Col xl={2} sm={4} className={"d-flex flex-column text-center justify-content-end"}>
                                <SizeMe>
                                    {({size}) =>
                                        <RangeChartDonut value={props.fund.group?.fundTranche?.totalExpenseRatio || 0}
                                                       width={(size.width || 120) * 0.95} height={(size.width || 120) * .35}/>
                                    }
                                </SizeMe>
                                <div className={classNames("font-weight-bold fs-15px", !props.fund.group.fundTranche?.totalExpenseRatio && "text-gray")}>Gebühren (TER)</div>
                            </Col>
                            <Col xl={2} sm={4} className={"d-flex flex-column text-center justify-content-end"}>
                                <SizeMe>
                                    {({size}) =>
                                        <RiskSectionDonut riskFactor={props.fund.group.fundTranche?.srri?.value || 0}
                                                          width={(size.width || 120) * 0.95} height={(size.width || 120)  * .35}/>
                                    }
                                </SizeMe>
                                <div className={classNames("font-weight-bold text-center fs-15px ml-lg-0 ml-md-n4", !props.fund.group.fundTranche?.srri?.value && "text-gray")}>Risiko (KID)</div>
                            </Col>
                            <Col xl={2} sm={4} className={"d-flex flex-column text-center justify-content-end"}>
                                <div className={classNames("fs-22px font-weight-bold", getColor(performanceOneYear && performanceOneYear.performance || 0))}>
                                    {numberFormat(performanceOneYear && performanceOneYear.performance, " %")}
                                </div>
                                <div className="fs-15px font-weight-bold text-center">Perf. 1 Jahr</div>
                            </Col>
                            <Col xl={2} sm={4} className={"d-flex flex-column text-center justify-content-end"}>
                                <div className={classNames("fs-22px font-weight-bold text-center", getColor(performanceThreeYears && performanceThreeYears.performance || 0))}>
                                    {numberFormat(performanceThreeYears && performanceThreeYears.performance, " %")}
                                </div>
                                <div className="fs-15px font-weight-bold text-center">Perf. 3 Jahre</div>
                            </Col>
                            <Col xl={2} sm={4} className={"d-flex flex-column text-center justify-content-end"}>
                                <div className="fs-22px font-weight-bold text-center">
                                    {numberFormat(performanceOneYear && performanceOneYear.deltaAveragePrice, " %")}
                                </div>
                                <div className="fs-15px font-weight-bold text-center">Abstand 52W</div>
                            </Col>
                            <Col xl={2} sm={4} className={"d-flex flex-column text-center justify-content-end"}>
                                <div className="fs-22px font-weight-bold text-center text-nowrap">
                                    {shortNumberFormat(props.fund.group?.fundTranche?.investmentVolume?.value)}
                                </div>
                                <div className="fs-15px font-weight-bold text-center">Fondsvol.</div>
                            </Col>
                            <Col sm={12} className={"d-none d-xl-block"}>
                                <FundInformation fund={props.fund}/>
                            </Col>
                        </Row>
                    </div>
                    <div className={"flex-grow-1"}>
                        {width < 576 &&
                            <div className="d-flex justify-content-center align-items-center cursor-default">
                                <Button variant={"link"} className="text-blue" onClick={() => setOpen(!open)}>
                                    Details anzeigen
                                    <SvgImage icon="icon_direction_down_blue_light.svg" width={"27"}
                                              className="pt-n1" style={{transform: open ? "rotate(180deg)" : ""}}/>
                                </Button>
                            </div>
                        }
                        <Collapse in={(open && width < 576) || (576 <= width && width <= 1024)}>
                            <div className={"fund-details w-100"}>
                                <div className={"d-flex flex-column"}>
                                    <div className={"d-inline-block d-md-none "}>
                                        <SizeMe>
                                            {({size}) =>
                                                <>
                                                    <div className="fs-13px text-kurs-grau mb-n4">Zeitraum: 3J</div>
                                                    <FundChartComponent instrumentId={props.fund.id} chartType={ChartScope.ThreeYear} height={150} width={size.width || 360}/>
                                                    <div className="">
                                                        <span className="fs-22px font-weight-bold">{formatPrice(nav?.value,null,props?.fund?.snapQuote?.quote?.value,  props.fund.group.fundTranche?.currency?.displayCode || "")}</span>
                                                        <div className="mt-n2 line-height-1" >
                                                            <span className="fs-13px">{quoteFormat(nav?.when)}</span>
                                                            <span className="fs-13px"> Börse: {props.fund.exchange.name}</span>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </SizeMe>
                                    </div>
                                    <FundInformation fund={props.fund}/>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FundInformation(props: {fund: Instrument}) {
    let options = props.fund.group.fundTranche ? generateInfo(props.fund.group.fundTranche) : [];
    return (
        <>
            <div className="d-flex">
                <div className="fs-15px">
                    <span className="font-weight-bold mr-1">Region</span>
                    <span className="text-nowrap">{props.fund.group.fund?.region?.name || "-"}</span>
                </div>
                <div className="fs-15px mx-2">
                    <span className="font-weight-bold mr-1">Thema</span>
                    <span className="text-nowrap ">{props.fund.group.fund?.topic?.name || "-"}</span>
                </div>
                <div className="fs-15px">
                    <span className="font-weight-bold mr-1">Strategie</span>
                    <span className="text-nowrap">{props.fund.group.fund?.strategy?.name || "-"}</span>
                </div>
            </div>
            <div className="fs-15px" style={{ lineHeight: "1.2" }}>
                {options.join(", ")}
                <br/>
                { !!props.fund.group.fund?.company?.name && "KVG: " + props.fund.group?.fund?.company?.name }
            </div>
        </>
    )
}

function generateInfo(fundTranche: InstrumentGroupFundTranche) {
    let options = [];
    if (fundTranche.currency?.displayCode) {
        options.push(fundTranche.currency?.displayCode);
    }
    if (fundTranche.distributing != undefined) {
        options.push(
            !fundTranche.distributing ? "thesaurierend" : "ausschüttend"
        )
    }
    if (fundTranche.germanVwlCapable != undefined) {
        options.push(
            !fundTranche.germanVwlCapable ? "nicht VL-fähig" : "VL-fähig"
        )
    }
    if (fundTranche.savingPlanCapable != undefined) {
        options.push(
            !fundTranche.savingPlanCapable ? "nicht Sparplanfähig" : "Sparplanfähig"
        )
    }
    return options;
}


export function getColor(value?: number) {
    return value && value > 0 ? "text-green" : value && value < 0 ? "text-pink" : ""
}
