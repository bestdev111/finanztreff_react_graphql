import { useQuery } from "@apollo/client"
import classNames from "classnames"
import { SharePeerGroupSectionPanel } from "components/Assets/SharePage/components/SharePeerGroupCompareSection/SharePeerGroupCompareSection"
import { CarouselWrapper } from "components/common"
import SvgImage from "components/common/image/SvgImage"
import { AssetLinkComponentSimple } from "components/profile/common/AssetLinkComponent"
import { getAssetGroup } from "components/profile/utils"
import { CalculationPeriod, FundType, Instrument, InstrumentGroup, PeerGroupCompareChart, PeerGroupPerformancePeriod, Query } from "generated/graphql"
import { loader } from "graphql.macro"
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint"
import { useState } from "react"
import { Carousel, CarouselItem, Col, Collapse, Container, Row, Spinner } from "react-bootstrap";
import './FundsPage.scss'
import { PerformancesPeriodChart } from "./PerformancesComparisonSection"

export function PerformanceInPeerGroupComparison(props: PerformanceInPeerGroupComparisonProps) {

    const itemsInRow = useBootstrapBreakpoint({
        xl: 4,
        lg: 3
    })

    let { loading, data } = useQuery<Query>(
        loader('./getInstrumentFundEtfPeergroups.graphql'),
        { variables: { groupId: props.instrumentGroup.id } }
    );

    const [openTagsArea, setOpenTagsArea] = useState(false);
    const [currentPeriod, setCurrentPeriod] = useState<CalculationPeriod>(CalculationPeriod.Month1);
    const PERIODS = [{
        id: CalculationPeriod.Month1,
        name: "1 Monat"
    }, {
        id: CalculationPeriod.Month3,
        name: "3 Monate"
    }, {
        id: CalculationPeriod.Month6,
        name: "6 Monate"
    }, {
        id: CalculationPeriod.Week52,
        name: "1 Jahr"
    }, {
        id: CalculationPeriod.Year3,
        name: "3 Jahre"
    }, {
        id: CalculationPeriod.Year5,
        name: "5 Jahre"
    }, {
        id: CalculationPeriod.Year10,
        name: "10 Jahre"
    }];

    if (loading) {
        return (<div className={"p-1"} style={{ height: "70px" }}><Spinner animation="border" /></div>);
    }

    const peerGroupPerformancePeriod: PeerGroupPerformancePeriod[] =
        data && data.group && data.group.etf && data.group.etf.peerGroup && data.group.etf.peerGroup.performance
        || data && data.group && data.group.fundTranche && data.group.fundTranche.peerGroup && data.group.fundTranche.peerGroup.performance
        || [];

    const fundCharts: (PeerGroupCompareFundChart | undefined)[] = PERIODS.map(
        period => {
            let currentPeerGroupPerformance = peerGroupPerformancePeriod.find(group => group.period && group.period === period.id);
            let data: PeerGroupCompareFundChart = {
                period: period,
                chart: {
                    breakPoint: currentPeerGroupPerformance && currentPeerGroupPerformance?.average || 0,
                    current: {
                        group: props.instrumentGroup,
                        value: props.instrumentGroup && props.instrumentGroup.content && props.instrumentGroup.content[0] && props.instrumentGroup.content[0]!.performance.find(p => p.period === period.id)?.performance
                    },
                    min: {
                        group: currentPeerGroupPerformance?.instrumentGroupMin,
                        value: currentPeerGroupPerformance?.minimum
                    },
                    max: {
                        group: currentPeerGroupPerformance?.instrumentGroupMax,
                        value: currentPeerGroupPerformance?.maximum
                    },
                }
            }
            return data;
        }
    ).filter(current => current.chart.current.value && current.chart.max.value && current.chart.min.value) || [];

    return (
        <>{
            fundCharts.length > 0 && peerGroupPerformancePeriod.length > 0 ?
                <>
                    <div className={"d-xl-block d-lg-block d-md-none d-sm-none"}>
                        <h2 className="section-heading font-weight-bold ml-n2 ml-md-0 mt-4">Performance im Peergroup*-Vergleich</h2>
                        <div className="content-wrapper">
                            <Container className="px-1">
                                <div className="row row-cols-xl-4 row-cols-lg-3 performance-in-peer-group-card">
                                    {
                                        fundCharts.map((current, index: number) =>
                                            current && index < itemsInRow &&
                                            <div key={index} className={classNames("px-2", current.period?.id === currentPeriod && "active")} onClick={() => setCurrentPeriod(current.period?.id || CalculationPeriod.Month1)}>
                                                <SharePeerGroupSectionPanel
                                                    customInstrumentNames={["Schlechtester", "Dieser " + getAssetGroup(props.instrument.group.assetGroup), "Bester"]}
                                                    name={current.period?.name || ""}
                                                    value={props.instrumentGroup && props.instrumentGroup.content && props.instrumentGroup.content[0] && props.instrumentGroup.content[0]!.performance.find(p => p.period === current.period?.id)?.performance|| 0}
                                                    chart={current.chart}
                                                />
                                            </div>

                                        )
                                    }
                                </div>
                            </Container>
                            {fundCharts.length>itemsInRow && 
                            <div className="d-flex justify-content-center text-center ">
                                <a className="text-blue mb-2" onClick={() => setOpenTagsArea(!openTagsArea)}>
                                    <span className="text-grey cursor-pointer">
                                        Weitere Zeiträume
                                        <SvgImage icon="icon_direction_down_blue_light.svg" style={openTagsArea ? { transform: "rotate(180deg)" } : {}}
                                            spanClass="svg-grey" width="27" />
                                    </span>
                                </a>
                            </div>
                            }
                            <Collapse in={openTagsArea}>
                                <Container className="px-1">
                                    <div className="row row-cols-xl-4 row-cols-lg-3 performance-in-peer-group-card">
                                        {
                                            fundCharts.map((current, index: number) =>
                                                current && index >= itemsInRow &&
                                                <div key={index} className={classNames("px-2", current.period?.id === currentPeriod && "active")} onClick={() => setCurrentPeriod(current.period?.id || CalculationPeriod.Month1)}>
                                                    <SharePeerGroupSectionPanel
                                                        name={current.period?.name || ""}
                                                        customInstrumentNames={["Schlechtester", "Dieser " + getAssetGroup(props.instrument.group.assetGroup), "Bester"]}
                                                        value={props.instrumentGroup && props.instrumentGroup.content && props.instrumentGroup.content[0] && props.instrumentGroup.content[0]!.performance.find(p => p.period === current.period?.id)?.performance|| 0}
                                                        chart={current.chart}
                                                    />
                                                </div>

                                            )
                                        }
                                    </div>
                                </Container>
                            </Collapse>
                            <div className="content">
                                {
                                    peerGroupPerformancePeriod.map(performance =>
                                        performance.period === currentPeriod &&
                                        <PerformancesPeriodChart
                                            periodName={PERIODS.find(current => current.id === performance.period)?.name || ""}
                                            period={performance.period}
                                            minId={performance.instrumentGroupMin.main?.id || 0}
                                            currentId={props.instrument.id}
                                            maxId={performance.instrumentGroupMax.main?.id || 0} />
                                    )
                                }
                                <Row>
                                    <Col className="font-weight-bold text-nowrap">
                                        <span className="dot mr-1" style={{ backgroundColor: "#FF4D7D", height: "10px", width: "10px" }}></span>
                                        <span className="text-truncate" style={{ maxWidth: "220px" }}>
                                            <AssetLinkComponentSimple name={"Schlechtester " + getAssetGroup(props.instrument.group.assetGroup) + " (WKN " + peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMin.wkn + ")"}
                                                seoTag={peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMin.seoTag || ""}
                                                assetGroup={peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMin.assetGroup || ""} exchangeCode={undefined} /> </span>
                                    </Col>
                                    <Col className="font-weight-bold text-center text-nowrap">
                                        <span className="dot mr-1" style={{ backgroundColor: "#383838", height: "14px", width: "14px", marginBottom: "-2px" }}></span>
                                        Dieser {getAssetGroup(props.instrument.group.assetGroup)}
                                    </Col>
                                    <Col className="font-weight-bold text-right text-nowrap">
                                        <span className="dot mr-1" style={{ backgroundColor: "#18C48F", height: "10px", width: "10px" }}></span>
                                        <AssetLinkComponentSimple name={"Bester " + getAssetGroup(props.instrument.group.assetGroup) + " (WKN " + peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMax.wkn + ")"}
                                            seoTag={peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMax.seoTag || ""}
                                            assetGroup={peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMax.assetGroup || ""} exchangeCode={undefined} />
                                    </Col>
                                </Row>
                                <div style={{ color: "#989898" }} className="fs-13px mt-5">
                                    *Verrglichen wird mit dem jeweils besten und schlechtesten
                                    {props.regionName &&
                                        <span className="font-weight-bold ml-1">
                                            {
                                                props.type && props.type.name &&
                                                <span>{props.type.name}</span>
                                            } aus der Region {props.regionName}.</span>
                                    }
                                    {props.topicName &&
                                        <span className="font-weight-bold ml-1">Thema {props.topicName}.</span>
                                    }
                                    {props.strategyName &&
                                        <span className="font-weight-bold ml-1">Strategie {props.strategyName} des entsprechenden Zeitraums.</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"d-xl-none d-lg-none d-md-none d-sm-block"}>
                        <h2 className="section-heading font-weight-bold ml-n2 ml-md-0 mt-4">Performance im Peergroup*-Vergleich</h2>
                        <div className="content-wrapper">
                            <Carousel touch={true}
                                className="d-lg-none"
                                controlclass={"mb-n2 dark-version"}
                                prevIcon={
                                    <SvgImage icon={`icon_direction_left_dark.svg`}
                                        spanClass="move-arrow d-none d-xl-block" />
                                }
                                nextIcon={
                                    <SvgImage icon={`icon_direction_right_dark.svg`}
                                        spanClass="move-arrow d-none d-xl-block" />
                                }
                                controls={true}
                                indicators={true}
                                as={CarouselWrapper}
                            >
                                {
                                    fundCharts.map((current, index) =>
                                        current &&
                                        <CarouselItem key={index} className="pb-5 highcharts-background-h-0">
                                            <div key={index} className="performance-in-peer-group-card mobile-version">
                                                <SharePeerGroupSectionPanel
                                                    customInstrumentNames={["Schlechtester", "Dieser " + getAssetGroup(props.instrument.group.assetGroup), "Bester"]}
                                                    name={current.period?.name || ""}
                                                    value={props.instrumentGroup && props.instrumentGroup.content && props.instrumentGroup.content[0] && props.instrumentGroup.content[0]!.performance.find(p => p.period === current.period?.id)?.performance|| 0}
                                                    chart={current.chart}
                                                />
                                            </div>
                                            {
                                                peerGroupPerformancePeriod.map(performance =>
                                                    performance.period === currentPeriod &&
                                                    <PerformancesPeriodChart
                                                        height={270}
                                                        periodName={PERIODS.find(current => current.id === performance.period)?.name || ""}
                                                        period={performance.period} minId={performance.instrumentGroupMin.main?.id || 0}
                                                        currentId={props.instrument.id} maxId={performance.instrumentGroupMax.main?.id || 0} />
                                                )
                                            }
                                            <Row>
                                                <Col xs={12} className="font-weight-bold text-nowrap">
                                                    <span className="dot mr-1" style={{ backgroundColor: "#FF4D7D", height: "10px", width: "10px" }}></span>
                                                    <span className="text-truncate" style={{ maxWidth: "220px" }}>
                                                        <AssetLinkComponentSimple name={"Schlechtester " + getAssetGroup(props.instrument.group.assetGroup) + " (WKN " + peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMin.wkn + ")"}
                                                            seoTag={peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMin.seoTag || ""}
                                                            assetGroup={peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMin.assetGroup || ""} exchangeCode={undefined} /> </span>
                                                </Col>
                                                <Col xs={12} className="font-weight-bold text-nowrap">
                                                    <span className="dot mr-1" style={{ backgroundColor: "#383838", height: "14px", width: "14px", marginBottom: "-2px" }}></span>
                                                    Dieser {getAssetGroup(props.instrument.group.assetGroup)}
                                                </Col>
                                                <Col xs={12} className="font-weight-bold text-nowrap">
                                                    <span className="dot mr-1" style={{ backgroundColor: "#18C48F", height: "10px", width: "10px" }}></span>
                                                    <AssetLinkComponentSimple name={"Bester "+ getAssetGroup(props.instrument.group.assetGroup) + " (WKN " + peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMax.wkn + ")"}
                                                        seoTag={peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMax.seoTag || ""}
                                                        assetGroup={peerGroupPerformancePeriod.find(current => current.period === currentPeriod)?.instrumentGroupMax.assetGroup || ""} exchangeCode={undefined} />
                                                </Col>
                                            </Row>
                                        </CarouselItem>
                                    )
                                }
                            </Carousel>
                            <div style={{ color: "#989898" }} className="fs-13px mt-3">
                                *Verrglichen wird mit dem jeweils besten und schlechtesten
                                {props.regionName &&
                                    <span className="font-weight-bold ml-1">
                                        {
                                            props.type && props.type.name &&
                                            <span>{props.type.name}</span>
                                        }
                                        aus der Region {props.regionName}.</span>
                                }
                                {props.topicName &&
                                    <span className="font-weight-bold ml-1">Thema {props.topicName}.</span>
                                }
                                {props.strategyName &&
                                    <span className="font-weight-bold ml-1">Strategie {props.strategyName} des entsprechenden Zeitraums.</span>
                                }
                            </div>
                        </div>
                    </div>
                </>
                : <></>
        }

        </>
    )
}

interface PerformanceInPeerGroupComparisonProps {
    instrumentGroup: InstrumentGroup;
    regionName?: string;
    topicName?: string;
    strategyName?: string;
    type?: FundType;
    instrument: Instrument
}

type PeerGroupCompareFundChart = {
    period?: {
        id: CalculationPeriod;
        name: string
    }
    chart: PeerGroupCompareChart;
}