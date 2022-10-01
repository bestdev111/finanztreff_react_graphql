import { Instrument, InstrumentGroup } from "../../../graphql/types";
import { ShareDividendPaymentComponent } from "./components/ShareDividendPaymentComponent/ShareDividendPaymentComponent";
import { AdditionalInformationSection, AdditionalInformationSectionModals } from "../../common/asset/AdditionalInformationSection/AdditionalInformationSection";
import { PerformanceSection } from "../../common/asset/PerformanceSection/PerformanceSection";
import { SharePeerGroupCompareSection } from "./components/SharePeerGroupCompareSection/SharePeerGroupCompareSection";
import { ShareTechnicalFiguresComponent } from "./components/ShareTechnicalFiguresComponent/ShareTechnicalFiguresComponent";
import { ShareFundamentalKeyFiguresComponent } from "./components/ShareFundamentalKeyFiguresComponent/ShareFundamentalKeyFiguresComponent";
import { Share2TxtDescriptionComponent } from "./components/Share2TxtDescriptionComponent/Share2TxtDescriptionComponent";
import { Col, Row } from "react-bootstrap";
import { forwardRef, useImperativeHandle, useState } from "react";
import { PerformanceInPercentComponent } from "./components/SharePerformaneInPercentComponent/PerformanceInPercentComponent";
import { PortfolioOverviewInPortraitComponent } from "components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent";
import { MostTradedAssets } from "components/Home/HotSection/UserStatistics/HostSectionAdvertisement";
import { IndexParticipationComponent } from "./components/IndexParticipationComponent/IndexParticipationComponent";
import { WinLossCashFlowModal } from "./modal/WinLossCashFlowModal";
import { BalanceSheetModal } from "./modal/BalanceSheetModal";
import { CompanyProfileModal } from "./modal/CompanyProfileModal";
import { AnalysesOverviewModal } from "components/common/modals/AnalysesOverviewModal";

interface InstrumentQuoteInformationSectionProps {
    instrumentGroup: InstrumentGroup;
    instrumentId: number;
}

export const ShareQuoteAndExchangeSection = forwardRef((props: InstrumentQuoteInformationSectionProps, ref) => {
    let [state, setState] = useState({instrumentId: props.instrumentId});

    useImperativeHandle(ref, () => ({
        changeInstrument(id: number) {
            setState({...state, instrumentId: id});
        }
      })
    );
      
    const instrument: Instrument = state.instrumentId > 0 ?
        props.instrumentGroup.content.filter(current => current.id === state.instrumentId)[0] :
        props.instrumentGroup.content.filter(current => current.main===true)[0];

    return (
        <section className="main-section mt-n2 mt-md-0">
            <div className="container">
                <h2 className="section-heading font-weight-bold mt-xl-n4 mt-md-n4 mb-xl-n2 ml-n2 ml-md-0" id="kurse-anchor">Kurse &amp; Kennzahlen</h2>
                <div className="content-row">
                        
                    <Row>

                        <Col xl={9} lg={12} className="pr-xl-28px">
                            
                            <BalanceSheetModal instrumentGroup={props.instrumentGroup} instrument={instrument} />
                            <WinLossCashFlowModal instrumentGroup={props.instrumentGroup} instrument={instrument}  />
                            <CompanyProfileModal instrument={instrument} instrumentGroup={props.instrumentGroup} />
                            <AnalysesOverviewModal instrumentGroup={props.instrumentGroup} instrument={instrument}/>
                            {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} className="d-xl-none" instrumentId={props.instrumentId} /> */}
                            <PerformanceSection instrument={instrument} className="content-wrapper col" />
                            <SharePeerGroupCompareSection instrumentGroup={props.instrumentGroup} />
                            {/* <Share2TxtDescriptionComponent instrumentGroup={props.instrumentGroup} /> */}
                            <ShareTechnicalFiguresComponent instrument={instrument} instrumentGroup={props.instrumentGroup} />
                            <PerformanceInPercentComponent instrument={instrument}/>
                            
                        </Col>

                        <Col xl={3} lg={12} className="pl-xl-1 ml-xl-n3 pr-xl-0">

                            {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} className={"d-none d-xl-block"} instrumentId={props.instrumentId}/> */}
                            <Row>
                                <Col xl={12} md={6} sm={12}>
                                    <ShareDividendPaymentComponent instrumentGroup={props.instrumentGroup} />
                                </Col>
                                <Col xl={12} md={6} sm={12}>
                                    <ShareFundamentalKeyFiguresComponent instrumentGroup={props.instrumentGroup} instrument={instrument} />
                                </Col>
                                {props.instrumentGroup.indexParticipation.length > 0 &&
                                    <Col xl={12} md={12} sm={12}>
                                        <IndexParticipationComponent instrumentGroup={props.instrumentGroup} />
                                    </Col>
                                }
                            </Row>
                        </Col>
                        <Col sm={12}>
                            <Row>
                                <Col xl={9} sm={12} className="pr-xl-28px">
                                    <PortfolioOverviewInPortraitComponent instrumentGroup={props.instrumentGroup} />
                                </Col>
                                <Col xl={3} sm={12} className="mt-3 pl-xl-1 ml-xl-n3 pr-xl-0 " >
                                    <MostTradedAssets titleClassName="line-height-1 mb-n1 fs-16px pt-2" buttonClassName="fs-16px pb-2" assetNameLenght={20}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <AdditionalInformationSectionModals instrumentId={props.instrumentId} instrumentGroup={props.instrumentGroup}/>
                </div>
            </div>
        </section>
    );
});
