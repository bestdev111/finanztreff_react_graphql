import classNames from "classnames";
import { RiskSectionDonut } from "components/Assets/FundsPage/RisikoFundFeedSection/RiskSecton";
import { InstrumentSnapQuoteCardChart } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { CalculationPeriod, ChartScope, Instrument, QuoteType } from "graphql/types";
import { Row, Col } from "react-bootstrap";
import {formatPrice, numberFormat, quoteFormat, shortNumberFormat} from "utils";
import { FundChartComponent } from "components/funds/FundSearchPage/ResultCards/ChartComponent/getFundPerformanceChart";
import {RangeChartDonut} from "../../common/charts/RangeChartDonut/RangeChartDonut";

export function CommodityResultCard(props: { fund?: Instrument }) {

    if (props.fund) {
        let performanceOneYear = props.fund && props.fund.performance && props.fund.performance.filter(p => p.period === CalculationPeriod.Week52)[0];
        let performanceThreeYears = props.fund && props.fund.performance && props.fund.performance.filter(p => p.period === CalculationPeriod.Year3)[0];
        let nav = props.fund.snapQuote?.quotes?.filter(q => q?.type === QuoteType.NetAssetValue)[0];
        return (
            <>
                <div className="d-xl-flex d-lg-flex d-md-flex bg-white fund-result-card mb-3 d-sm-none">
                    <div className="icon-line">
                        <div className=" pr-1">
                            {props.fund.group && props.fund.group.id
                                && <ProfileInstrumentAddPopup
                                    instrumentId={props.fund.id}
                                    instrumentGroupId={props.fund.group.id}
                                    name={props.fund.name}
                                    className="p-0 mr-n1"
                                    watchlist={true} portfolio={true}>
                                    <SvgImage icon="icon_plus_blue.svg" imgClass="svg-blue mt-2 mx-1" width="28" />
                                </ProfileInstrumentAddPopup>
                            }
                        </div>
                        {props.fund.group.fundTranche?.main===false &&                        
                        <div>
                            <SvgImage icon="icon_tranch.svg" convert={true} imgClass="svg-blue mt-2" width="32" />
                        </div>
                        }
                    </div>
                    <div className="card-body">
                        <div>
                            <span className="bg-grass-green p-1 text-white my-auto" style={{ fontSize: "12px" }}>
                                {props.fund.group.fund?.type?.name ? props.fund.group.fund?.type?.name : "FOND"}
                            </span>
                            <span className="fs-18px ml-2 text-blue text-truncate">
                                <AssetLinkComponent instrument={props.fund} />
                            </span>
                        </div>
                        <div className="mt-3 d-flex">
                            <div>
                                <div className="fs-13px text-kurs-grau mb-n4">Zeitraum: 3J</div>
                                <FundChartComponent instrumentId={props.fund.id} chartType={ChartScope.ThreeYear} height={90} width={230}/>
                                <div className="">
                                    <span className="fs-22px font-weight-bold">{formatPrice(nav?.value, props.fund?.group?.assetGroup, props.fund.snapQuote?.quote?.value,  props.fund.group.fundTranche?.currency?.displayCode || "")}</span>
                                    <div className="mt-n2 line-height-1" >
                                        <span className="fs-13px">{quoteFormat(nav?.when)}</span>
                                        <span className="fs-13px"> Börse: {props.fund.exchange.name}</span>
                                    </div>
                                </div>
                            </div>
                            <Row xl={6} md={3} className="w-100">
                                <Col xl={3} className="pl-4">
                                    <div className="pie-chart ml-xl-2">
                                        <RangeChartDonut value={props.fund.group?.fundTranche?.totalExpenseRatio || 0} width={180} height={140} fontSize={22} titlePosition={15} />
                                    </div>
                                    <div className={classNames("font-weight-bold text-center fs-15px pie-title", !props.fund.group.fundTranche?.totalExpenseRatio && "text-gray")}>Gebühren (TER)</div>
                                </Col>
                                <Col xl={2} className="ml-2 mt-2">
                                    <div className={classNames("fs-22px font-weight-bold text-center", getColor(performanceOneYear && performanceOneYear.performance || 0))}>
                                        {numberFormat(performanceOneYear && performanceOneYear.performance, " %")}
                                    </div>
                                    <div className="fs-15px font-weight-bold text-center">Perf. 1 Jahr</div>
                                </Col>
                                <Col xl={2} className="mt-2">
                                    <div className={classNames("fs-22px font-weight-bold text-center", getColor(performanceThreeYears && performanceThreeYears.performance || 0))}>
                                        {numberFormat(performanceThreeYears && performanceThreeYears.performance, " %")}
                                    </div>
                                    <div className="fs-15px font-weight-bold text-center">Perf. 3 Jahre</div>
                                </Col>
                                <Col xl={2} className="mt-2">
                                    <div className="fs-22px font-weight-bold text-center">
                                        {numberFormat(performanceOneYear && performanceOneYear.deltaAveragePrice, " %")}
                                    </div>
                                    <div className="fs-15px font-weight-bold text-center">Abstand 52W</div>
                                </Col>
                                <Col xl={2} className="mt-2">
                                    <div className="fs-22px font-weight-bold text-center text-truncate">
                                        {shortNumberFormat(props.fund.group?.fundTranche?.investmentVolume?.value)}
                                    </div>
                                    <div className="fs-15px font-weight-bold text-center">Fondsvolumen</div>
                                </Col>
                                <Col xl={6} className="ml-3 d-none d-xl-flex pb-2 mt-2 mb-n3">
                                    <div className="fs-15px mr-5">
                                        <span className="font-weight-bold mr-2">Region</span>
                                        <span className="text-nowrap">{props.fund.group.fund?.region?.name || "-"}</span>
                                    </div>
                                    <div className="fs-15px d-none d-xl-flex  mr-5">
                                        <span className="font-weight-bold mr-2">Thema</span>
                                        <span className="text-nowrap">{props.fund.group.fund?.topic?.name || "-"}</span>
                                    </div>
                                    <div className="fs-15px d-none d-xl-flex  mr-5">
                                        <span className="font-weight-bold mr-2">Strategie</span>
                                        <span className="text-nowrap">{props.fund.group.fund?.strategy?.name || "-"}</span>
                                    </div>
                                </Col>
                                <Col xl={6}>
                                    &nbsp;
                                </Col>
                                <Col xl={12} className="mt-n4 pl-5 d-none d-xl-flex pt-1">
                                    <Row xl={4} className="fs-15px w-50" style={{ lineHeight: "1.2" }}>
                                        {props.fund.group.fundTranche?.currency?.displayCode || ""}

                                        {props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.distributing === false ?
                                            ", ausschüttend" : props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.distributing ?
                                                ", thesaurierend" : ""}

                                        {props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.germanVwlCapable === false ?
                                            ", nicht VL-fähig" : props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.germanVwlCapable ?
                                                ", VL-fähig" : ""}
                                        {/* nicht Sparplanfähig, */}
                                        <br />
                                        {props.fund.group?.fund?.company?.name && "KVG: " + props.fund.group?.fund?.company?.name}
                                    </Row>

                                </Col>
                            </Row>
                        </div>
                        <div className="d-flex d-xl-none my-1">
                            <div className="fs-15px mr-3">
                                <span className="font-weight-bold mr-2">Region</span>
                                <span className="text-nowrap">{props.fund.group.fund?.region?.name || "-"}</span>
                            </div>
                            <div className="fs-15px mr-3">
                                <span className="font-weight-bold mr-2">Thema</span>
                                <span className="text-nowrap">{props.fund.group.fund?.topic?.name || "-"}</span>
                            </div>
                            <div className="fs-15px">
                                <span className="font-weight-bold mr-2">Strategie</span>
                                <span className="text-nowrap">{props.fund.group.fund?.strategy?.name || "-"}</span>
                            </div>
                        </div>
                        <div className="fs-15px w-75 d-xl-none" style={{ lineHeight: "1.2" }}>
                            {props.fund.group.fundTranche?.currency?.displayCode || ""}

                            {props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.distributing === false ?
                                ", ausschüttend" : props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.distributing ?
                                    ", thesaurierend" : ""}

                            {props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.germanVwlCapable === false ?
                                ", nicht VL-fähig" : props.fund.group && props.fund.group.fundTranche && props.fund.group.fundTranche.germanVwlCapable ?
                                    ", VL-fähig" : ""}
                            {/* nicht Sparplanfähig, */}
                            &nbsp;
                            {props.fund.group?.company?.name && "KVG: " + props.fund.group?.company?.name}
                        </div>
                    </div>
                </div>
            </>
        );
    }
    return (
        <>
            <div className="d-xl-flex d-lg-flex d-md-flex bg-white fund-result-card mb-3 d-sm-none">
                <div className="icon-line">
                    <div>
                        <SvgImage icon="icon_plus_white.svg" convert={true} imgClass="svg-blue mt-2" width="28" />
                    </div>
                    <div>
                        <SvgImage icon="icon_tranch.svg" convert={true} imgClass="svg-blue mt-2" width="32" />
                    </div>
                </div>
                <div className="card-body">
                    <div>
                        <span className="bg-grass-green p-1 text-white my-auto" style={{ fontSize: "12px" }}>
                            AKTIENFOND
                        </span>
                        <span className="fs-18px ml-2 text-blue text-truncate">
                            Allianz Global Investors Fund Allianz Enhanced Short Term Euro AT
                        </span>

                    </div>
                    <div className="mt-3 d-flex">
                        <div>
                            <div className="fs-13px text-kurs-grau mb-n4">Zeitraum: 3J</div>
                            <InstrumentSnapQuoteCardChart instrumentId={10} height={90} width={230} />
                            <div className="">
                                <span className="fs-22px font-weight-bold">177,88 EUR</span>
                                <div className="mt-n2 line-height-1" >
                                    <span className="fs-13px">25.08.2015</span>
                                    <span className="fs-13px"> Börse: Investmentfonds</span>
                                </div>
                            </div>
                        </div>
                        <Row xl={6} md={3} className="w-100">
                            <Col xl={2} className="pl-4">
                                <div className="pie-chart">
                                    <RangeChartDonut value={5} width={180} height={140} fontSize={22} titlePosition={15} />
                                </div>
                                <div className="font-weight-bold text-center fs-15px pie-title text-truncate">Gebühren (TER)</div>
                            </Col>
                            <Col xl={2} className="ml-n2">
                                <div className="pie-chart">
                                    <RiskSectionDonut riskFactor={5} width={180} height={140} fontSize={22} titlePosition={15} />
                                </div>
                                <div className="font-weight-bold text-center fs-15px pie-title">Risiko (KID)</div>
                            </Col>
                            <Col xl={2} className="ml-2 mt-2">
                                <div className="text-pink fs-22px font-weight-bold">
                                    -10,05%
                                </div>
                                <div className="fs-15px font-weight-bold">Perf. 1 Jahr</div>
                            </Col>
                            <Col xl={2} className="mt-2">
                                <div className="text-green fs-22px font-weight-bold">
                                    +83,75%
                                </div>
                                <div className="fs-15px font-weight-bold">Perf. 3 Jahre</div>
                            </Col>
                            <Col xl={2} className="mt-2">
                                <div className="fs-22px font-weight-bold">
                                    50,75%
                                </div>
                                <div className="fs-15px font-weight-bold">Abstand 52W</div>
                            </Col>
                            <Col xl={2} className="mt-2">
                                <div className="fs-22px font-weight-bold">
                                    1,2Mio
                                </div>
                                <div className="fs-15px font-weight-bold">Fondsvolumen</div>
                            </Col>
                            <Col xl={2} className="ml-3 d-none d-xl-flex">
                                <div className="fs-15px">
                                    <span className="font-weight-bold mr-2">Region</span>
                                    <span className="text-nowrap">Amerika</span>
                                </div>
                            </Col>
                            <Col xl={3}>
                                <div className="fs-15px d-none d-xl-flex">
                                    <span className="font-weight-bold mr-2">Thema</span>
                                    <span className="text-nowrap">Aktien Amerika</span>
                                </div>
                            </Col>
                            <Col xl={2}>
                                <div className="fs-15px d-none d-xl-flex">
                                    <span className="font-weight-bold mr-2">Strategie</span>
                                    <span className="text-nowrap">Aktien Amerika</span>
                                </div>
                            </Col>
                            <Col xl={6}>
                                &nbsp;
                            </Col>
                            <Col xl={12} className="mt-n4 pl-5 d-none d-xl-flex">
                                <Row xl={4} className="fs-15px w-50" style={{ lineHeight: "1.2" }}>
                                    EUR, thesaurierend, nicht VL-fähig, nicht Sparplanfähig, KAG: Deka Investmentfonds Deutschland und Co KG
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <div className="d-flex d-xl-none my-1">
                        <div className="fs-15px mr-3">
                            <span className="font-weight-bold mr-2">Region</span>
                            <span className="text-nowrap">Amerika</span>
                        </div>
                        <div className="fs-15px mr-3">
                            <span className="font-weight-bold mr-2">Thema</span>
                            <span className="text-nowrap">Aktien Amerika</span>
                        </div>
                        <div className="fs-15px">
                            <span className="font-weight-bold mr-2">Strategie</span>
                            <span className="text-nowrap">Aktien Amerika</span>
                        </div>
                    </div>
                    <div className="fs-15px w-75 d-xl-none" style={{ lineHeight: "1.2" }}>
                        EUR, thesaurierend, nicht VL-fähig, nicht Sparplanfähig, KAG: Deka Investmentfonds Deutschland und Co KG
                    </div>
                </div>
            </div>
        </>
    );
}

export function getColor(value?: number) {
    return value && value > 0 ? "text-green" : value && value < 0 ? "text-red" : ""
}
