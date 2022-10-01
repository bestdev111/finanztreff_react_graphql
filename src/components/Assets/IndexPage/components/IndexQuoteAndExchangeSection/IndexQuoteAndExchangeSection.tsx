import { Instrument, InstrumentGroup } from "../../../../../graphql/types";
import { AdditionalInformationSection, AdditionalInformationSectionModals } from "../../../../common/asset/AdditionalInformationSection/AdditionalInformationSection";
import { PerformanceSection } from "../../../../common/asset/PerformanceSection/PerformanceSection";
import { PerformanceInPercentComponent } from "components/Assets/SharePage/components/SharePerformaneInPercentComponent/PerformanceInPercentComponent";
import { Col, Row } from "react-bootstrap";
import { forwardRef, useImperativeHandle, useState } from "react";


interface IndexQuoteAndExchangeSectionProps {
    instrumentId: number;
    instrumentGroup: InstrumentGroup;
}

export const IndexQuoteAndExchangeSection = forwardRef((props: IndexQuoteAndExchangeSectionProps, ref) => {
    let [state, setState] = useState({instrumentId: props.instrumentId});

    useImperativeHandle(ref, () => ({
        changeInstrument(id: number) {
            setState({instrumentId: id});
        }
      })
    );

    const instrument: Instrument = state.instrumentId > 0 ?
        props.instrumentGroup.content.filter(current => current.id === state.instrumentId)[0] :
        props.instrumentGroup.content.filter(current => current.main===true)[0];
    return (
        <section className="main-section mt-n2 mt-md-0">
            <div className="container">
                <h2 className="section-heading font-weight-bold ml-n2 ml-md-0" id="kurse-anchor">Kurse &amp; Kennzahlen</h2>
                <div className="content-row">
                    <Row>
                        <AdditionalInformationSectionModals instrumentId={props.instrumentId} instrumentGroup={props.instrumentGroup}/>
                        <Col xl={9} sm={12}>
                            {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} className="d-xl-none" instrumentId={props.instrumentId} /> */}
                            <PerformanceSection instrument={instrument} className="content-wrapper col" />
                            <PerformanceInPercentComponent instrument={instrument} />
                        </Col>
                        <Col xl={3} sm={12} className="pl-xl-0">
                            {/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} instrumentId={props.instrumentId} className="d-none d-xl-block" /> */}
                        </Col>
                    </Row>
                </div>
            </div>
        </section>
    );
});
