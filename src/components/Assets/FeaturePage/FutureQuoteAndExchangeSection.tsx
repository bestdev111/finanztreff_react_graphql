import { Instrument, InstrumentGroup } from "../../../graphql/types";
import { AdditionalInformationSection, AdditionalInformationSectionModals } from "../../common/asset/AdditionalInformationSection/AdditionalInformationSection";
import { PerformanceSection } from "../../common/asset/PerformanceSection/PerformanceSection";
import { Col, Row } from "react-bootstrap";
import { forwardRef, useImperativeHandle, useState } from "react";
import { PortfolioOverviewInPortraitComponent } from "components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent";
import { ShareTechnicalFiguresComponent } from "../SharePage/components/ShareTechnicalFiguresComponent/ShareTechnicalFiguresComponent";
import { PerformanceInPercentComponent } from "../SharePage/components/SharePerformaneInPercentComponent/PerformanceInPercentComponent";
import { MostTradedAssets } from "components/Home/HotSection/UserStatistics/HostSectionAdvertisement";

interface InstrumentQuoteInformationSectionProps {
    // instrument: Instrument;
    instrumentGroup: InstrumentGroup;
    instrumentId: number;
}

export const FutureQuoteAndExchangeSection = forwardRef((props: InstrumentQuoteInformationSectionProps, ref) => {
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
                        <AdditionalInformationSectionModals instrumentId={props.instrumentId} instrumentGroup={props.instrumentGroup}/>
                        <Col xl={9} lg={12}>
                            {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} className="d-xl-none" /> */}
                            <PerformanceSection instrument={instrument} className="content-wrapper col" />
                            <ShareTechnicalFiguresComponent instrument={instrument} instrumentGroup={props.instrumentGroup} />
                            <PerformanceInPercentComponent instrument={instrument}/>
                        </Col>
                        <Col xl={3} lg={12} className="pl-xl-0">
                            {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} className={"d-none d-xl-block"} /> */}
                        </Col>
                        <Col sm={12}>
                            <Row>
                                <Col xl={9} sm={12}>
                                    <PortfolioOverviewInPortraitComponent instrumentGroup={props.instrumentGroup} />
                                </Col>
                                <Col xl={3} sm={12} className="pl-xl-0 pr-xl-3 mt-3">
                                    <MostTradedAssets titleClassName="line-height-1 mb-n1 fs-16px pt-2" buttonClassName="fs-16px pb-2" assetNameLenght={20}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </section>
    );
});
