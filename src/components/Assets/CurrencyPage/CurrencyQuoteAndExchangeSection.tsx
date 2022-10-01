import { AdditionalInformationSection, AdditionalInformationSectionModals } from "components/common/asset/AdditionalInformationSection/AdditionalInformationSection";
import { Col, Row } from "react-bootstrap";
import { InstrumentGroup } from "../../../graphql/types";
import { PerformanceSection } from "../../common/asset/PerformanceSection/PerformanceSection";
import { PerformanceInPercentComponent } from "../SharePage/components/SharePerformaneInPercentComponent/PerformanceInPercentComponent";
import { ShareTechnicalFiguresComponent } from "../SharePage/components/ShareTechnicalFiguresComponent/ShareTechnicalFiguresComponent";
import { CurrencyFindInstrumentCard } from "./CurrencyFindSection/CurrencyFindInstrumentCard";


interface InstrumentQuoteInformationSectionProps {
    instrumentId: number;
    instrumentGroup: InstrumentGroup;
}

export function CurrencyQuoteAndExchangeSection(props: InstrumentQuoteInformationSectionProps) {
    const instrument = props.instrumentGroup.content.find(current => props.instrumentId===current.id) || props.instrumentGroup.content.filter(current => current.main === true)[0];
    return (
        <section className="main-section">
            <div className="container">
                <h2 className="section-heading font-weight-bold" id="kurse-anchor">Kurse &amp; Börsen</h2>
                <div className="content-row">
                    <Row>
                        <Col xl={9} sm={12}>
                            <PerformanceSection instrument={instrument} title="" className="content-wrapper col" />
                            <ShareTechnicalFiguresComponent instrumentGroup={props.instrumentGroup} instrument={instrument} />
                            <PerformanceInPercentComponent instrument={instrument} />
                        </Col>
                        <Col xl={3} sm={12} className="pl-xl-0">
                            {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} instrumentId={props.instrumentId} className={"mb-3"} /> */}
                            <AdditionalInformationSectionModals instrumentGroup={props.instrumentGroup} instrumentId={props.instrumentId}/>
                            {/* <CurrencyFindInstrumentCard id={props.instrumentId} group={props.instrumentGroup} className="max-width-326px mt-md-2" /> */}
                        </Col>
                    </Row>
                </div>
            </div>
        </section>
    );
}
