import { AdditionalInformationSection, AdditionalInformationSectionModals } from "components/common/asset/AdditionalInformationSection/AdditionalInformationSection";
import { Row, Col } from "react-bootstrap";
import {Instrument, InstrumentGroup} from "../../../graphql/types";
import { PerformanceSection } from "../../common/asset/PerformanceSection/PerformanceSection";
import { FundFeesSection } from "./RisikoFundFeedSection/FundFeesSection";
import { KeyFiguresSection } from "./KeyFiguresSection";
import { RiskAndFundSection } from "./RisikoFundFeedSection/RiskAndFundSection";
import { RiskSecton } from "./RisikoFundFeedSection/RiskSecton";
import { PerformanceInPeerGroupComparison } from "./PerformanceInPeerGroupSection/PerformanceInPeerGroupComparison";
import { InvestmentIdeaText } from "./InvestmentIdeaText";
import { AssetAllocationComponent } from "./AssetAllocationComponent/AssetAllocationComponent";
import { KGVSection } from "./KGVSection/KGVSection";
import { FundDocumentsForDownload } from "./FundDocumentsForDownload";
import { ShareClassesSection } from "./ShareClassesSection";
import { forwardRef, useImperativeHandle, useState } from "react";
import { PortfolioOverviewInPortraitComponent } from "components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent";
import { MostTradedAssets } from "components/Home/HotSection/UserStatistics/HostSectionAdvertisement";
import { AssetCategoryComponent } from "components/common/AssetCategoryComponent";

interface InstrumentQuoteInformationSectionProps {
    instrumentGroup: InstrumentGroup;
    instrumentId: number;
}

export const FundsQuoteAndExchangeSection = forwardRef((props: InstrumentQuoteInformationSectionProps, ref) => {
    let [state, setState] = useState({ instrumentId: props.instrumentId });

    useImperativeHandle(ref, () => ({
        changeInstrument(id: number) {
            setState({ ...state, instrumentId: id });
        }
    })
    );

    const instrument: Instrument = state.instrumentId > 0 ?
        props.instrumentGroup.content.filter(current => current.id === state.instrumentId)[0] :
        props.instrumentGroup.content.filter(current => current.main === true)[0];

    const fund = props.instrumentGroup.fund;
    const fundTranche = props.instrumentGroup.fundTranche;

    const CATEGORY_PAIRS = [{
        name: "Thema", value: fund?.topic?.name
    }, {
        name: "Regionen &amp; Länder", value: fund?.region?.name
    }, {
        name: "Strategie", value: fund?.strategy?.name
    }];

    return (
        <>
            <section className="main-section">
                <div className="container">
                    <div className="content-row mb-2">
                        <Row>
                            <AdditionalInformationSectionModals instrumentId={props.instrumentId} instrumentGroup={props.instrumentGroup}/>
                            <Col xl={9} lg={12}>
                                {CATEGORY_PAIRS &&
                                    <AssetCategoryComponent pairs={CATEGORY_PAIRS} />
                                }
                                {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} className="d-xl-none" instrumentId={props.instrumentId} /> */}
                                {fundTranche &&
                                    <RiskAndFundSection className={"d-xl-none"} fundTranche={fundTranche} />
                                }
                                {instrument && instrument.performance.length > 0 &&
                                    <PerformanceSection instrument={instrument} className="content-wrapper col" title="Fondsperformance" />
                                }
                                {props.instrumentGroup && fundTranche &&
                                    <KeyFiguresSection fundTranche={fundTranche} />
                                }
                                {fund &&
                                        <PerformanceInPeerGroupComparison instrumentGroup={props.instrumentGroup} instrument={instrument}
                                        type={fund.type || undefined} strategyName={fund.strategy?.name} topicName={fund.topic?.name} regionName={fund.region?.name} />   
                                }
                                {/* <CurrentFundOverviewText /> */}
                                {
                                    fund && fund.portfolios && fund.portfolios.length > 0 &&
                                    <AssetAllocationComponent portfolios={fund.portfolios} />
                                }
                                {fund && fund.investmentConcept &&
                                    <InvestmentIdeaText investmentConcept={fund.investmentConcept} />
                                }
                                {props.instrumentGroup && props.instrumentGroup.alternativeFundTranches && props.instrumentGroup.alternativeFundTranches.length > 0 && props.instrumentGroup.fundTranche &&
                                    <ShareClassesSection instrumentGroupFundTranches={props.instrumentGroup.alternativeFundTranches} fundTranche={props.instrumentGroup.fundTranche} />
                                }
                            </Col>
                            <Col xl={3} lg={12} className="pl-xl-0">
                                {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} className={"d-none d-xl-block"} instrumentId={props.instrumentId} /> */}
                                {fundTranche &&
                                    <Row className={"d-none d-xl-block"} >
                                        <Col md={6} sm={12} xl={12}>
                                            <FundFeesSection fundTranche={fundTranche} />
                                        </Col>
                                        <Col md={6} sm={12} xl={12}>
                                            <RiskSecton fundTranche={fundTranche} />
                                        </Col>
                                    </Row>
                                }
                                <Row>
                                    {fund &&
                                        <Col md={6} sm={12} xl={12}>
                                            <KGVSection fund={fund} />
                                        </Col>
                                    }
                                    {fundTranche && fundTranche.documents &&
                                        <Col md={6} sm={12} xl={12}>
                                            <FundDocumentsForDownload documents={fundTranche.documents} />
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
        </>
    );
});
