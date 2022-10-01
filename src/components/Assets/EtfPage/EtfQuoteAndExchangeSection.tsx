import { AdditionalInformationSection, AdditionalInformationSectionModals } from "components/common/asset/AdditionalInformationSection/AdditionalInformationSection";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Instrument, InstrumentGroup } from "../../../graphql/types";
import { PerformanceSection } from "../../common/asset/PerformanceSection/PerformanceSection";
import { AssetAllocationComponent } from "../FundsPage/AssetAllocationComponent/AssetAllocationComponent";
import { PerformanceInPeerGroupComparison } from "../FundsPage/PerformanceInPeerGroupSection/PerformanceInPeerGroupComparison";
import { EtfIssuerSection } from "./EtfIssuerSection";
import { EtfFeaturesSection } from "./EtfFeaturesSection";
import { EtfInvestmentConcept } from "./EtfOverview";
import { EtfKeyFigures } from "./EtfKeyFigures";
import { RangeChartDonut } from "../../common/charts/RangeChartDonut/RangeChartDonut";
import { AssetCategoryComponent } from "components/common/AssetCategoryComponent";
import { PortfolioOverviewInPortraitComponent } from "components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent";
import { MostTradedAssets } from "components/Home/HotSection/UserStatistics/HostSectionAdvertisement";

interface EtfQuoteAndExchangeSectionProps {
    instrumentId: number;
    instrumentGroup: InstrumentGroup;
}

export const EtfQuoteAndExchangeSection = forwardRef((props: EtfQuoteAndExchangeSectionProps, ref) => {
    let [state, setState] = useState({ instrumentId: props.instrumentId });

    useImperativeHandle(ref, () => ({
        changeInstrument(id: number) {
            setState({ ...state, instrumentId: id });
        }
    })
    );

    const instrument: Instrument = state.instrumentId > 0 ?
        props.instrumentGroup.content.filter(current => current.id === state.instrumentId)[0] :
        props.instrumentGroup.content.filter(current => current.main)[0];

    const etf = props.instrumentGroup.etf;
    const CATEGORY_PAIRS = [{
        name: "Allokation", value: props.instrumentGroup.etf?.allocation?.name || undefined
    }, {
        name: "Regionen & Länder", value: props.instrumentGroup.etf?.region?.name || undefined
    }, {
        name: "Strategie", value: props.instrumentGroup.etf?.strategy?.name || undefined
    }];

    return (
        <section className="main-section">
            <div className="container">
                <div className="content-row mb-2">
                    <Row>
                        <AdditionalInformationSectionModals instrumentGroup={props.instrumentGroup} instrumentId={props.instrumentId}/>
                        <Col xl={9} lg={12}>
                            {CATEGORY_PAIRS &&
                                <AssetCategoryComponent pairs={CATEGORY_PAIRS} />
                            }
                            {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} className="d-xl-none" instrumentId={props.instrumentId}/> */}
                            {
                                instrument && instrument.performance.length > 0 &&
                                <PerformanceSection instrument={instrument} className="content-wrapper col" title="Fondsperformance" />
                            }
                            {etf &&
                                    <PerformanceInPeerGroupComparison instrumentGroup={props.instrumentGroup} instrument={instrument}
                                        strategyName={etf.strategy?.name || undefined} regionName={etf.region?.name || undefined} />       
                            }
                            <Row className="d-xl-none" >
                                {
                                    props.instrumentGroup.etf?.keyFigures &&
                                    <Col md={6} sm={12} xl={12} className="pr-md-0">
                                        <div className="content-wrapper">
                                            <h2 className="content-wrapper-heading font-weight-bold">Gebühren</h2>
                                            <div className="content mx-2 mt-md-n3">
                                                <RangeChartDonut width={320}
                                                    value={props.instrumentGroup.etf.keyFigures?.totalExpenseRatio || 0} />
                                                <h3 className="content-wrapper-heading font-weight-bold text-center">
                                                    Total Expense Ratio (TER)
                                                </h3>
                                            </div>
                                        </div>
                                        <EtfKeyFigures instrument={instrument}
                                            keyFigures={props.instrumentGroup.etf?.keyFigures || undefined} />
                                    </Col>
                                }
                                <Col md={6} sm={12} xl={12}>
                                    {props.instrumentGroup.etf?.benchmark &&
                                        <div className="content-wrapper">
                                            <h2 className="content-wrapper-heading font-weight-bold">Vergleichsindex</h2>
                                            <div className="content">
                                                <div className="fs-18px">{props.instrumentGroup.etf?.benchmark?.name}</div>
                                                <Button variant="primary" className="border-gray-light bg-gray-light text-blue mt-2" disabled={true}>
                                                    Weitere ETF mit dieser Benchmark
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    {props.instrumentGroup.etf?.issuer &&
                                        <EtfIssuerSection issuer={props.instrumentGroup.etf.issuer}
                                            domicile={props.instrumentGroup.etf?.domicile || null}
                                        />
                                    }
                                </Col>
                            </Row>
                            {props.instrumentGroup.etf?.investmentConcept &&
                                <EtfInvestmentConcept concept={props.instrumentGroup.etf?.investmentConcept || ""} />
                            }
                            {
                                props.instrumentGroup.etf?.portfolios && props.instrumentGroup.etf?.portfolios.length > 0 &&
                                <AssetAllocationComponent portfolios={props.instrumentGroup.etf?.portfolios} />
                            }
                        </Col>
                        <Col xl={3} lg={12} className="pl-xl-0 d-none d-xl-block">
                            {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} instrumentId={props.instrumentId}/> */}
                            <Row>
                                {props.instrumentGroup.etf && props.instrumentGroup.etf.keyFigures?.totalExpenseRatio !== null &&
                                    <Col md={6} sm={12} xl={12}>
                                        <div className="content-wrapper">
                                            <h2 className="content-wrapper-heading font-weight-bold">Fondsgebühren</h2>
                                            <div className="content mx-2 mt-md-n3">
                                                <RangeChartDonut value={props.instrumentGroup.etf.keyFigures?.totalExpenseRatio || 0} />
                                                <h3 className="content-wrapper-heading font-weight-bold text-center">Total Expense Ratio (TER)</h3>
                                            </div>
                                        </div>
                                    </Col>
                                }
                                <Col md={6} sm={12} xl={12}>
                                    <EtfKeyFigures instrument={instrument}
                                        keyFigures={props.instrumentGroup.etf?.keyFigures || undefined} />
                                </Col>
                                {props.instrumentGroup.etf?.benchmark &&
                                    <Col md={6} sm={12} xl={12}>
                                        <div className="content-wrapper">
                                            <h2 className="content-wrapper-heading font-weight-bold">Vergleichsindex</h2>
                                            <div className="content">
                                                <div className="fs-18px">{props.instrumentGroup.etf?.benchmark.name}</div>
                                                <Button variant="primary" className="border-gray-light bg-gray-light text-blue mt-2" disabled={true}>
                                                    Weitere ETF mit dieser Benchmark
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                {props.instrumentGroup.etf?.issuer &&
                                    <Col md={6} sm={12} xl={12}>
                                        <EtfIssuerSection issuer={props.instrumentGroup.etf?.issuer}
                                            domicile={props.instrumentGroup.etf?.domicile}
                                        />
                                    </Col>
                                }
                            </Row>
                        </Col>
                        <Col sm={12}>
                            <Row>
                                <Col xl={9} sm={12}>
                                    <PortfolioOverviewInPortraitComponent instrumentGroup={props.instrumentGroup} />
                                </Col>
                                <Col xl={3} sm={12} className="pl-xl-0 pr-xl-3 mt-3">
                                    <MostTradedAssets titleClassName="line-height-1 mb-n1 fs-16px pt-2" buttonClassName="fs-16px pb-2" assetNameLenght={20} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </section>
    );
});
