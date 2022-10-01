import { CommodityIndicesSection } from "components/commodity/CommodityIndicesSection/CommodityIndicesSection";
import { AdditionalInformationSection, AdditionalInformationSectionModals } from "components/common/asset/AdditionalInformationSection/AdditionalInformationSection";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Instrument, InstrumentGroup } from "../../../graphql/types";
import {PerformanceSection} from "../../common/asset/PerformanceSection/PerformanceSection";
import { PerformanceInPercentComponent } from "../SharePage/components/SharePerformaneInPercentComponent/PerformanceInPercentComponent";
import { ShareTechnicalFiguresComponent } from "../SharePage/components/ShareTechnicalFiguresComponent/ShareTechnicalFiguresComponent";


interface InstrumentQuoteInformationSectionProps {
	instrumentId: number;
	instrumentGroup: InstrumentGroup;
}

export const CommodityQuoteAndExchangeSection = forwardRef((props: InstrumentQuoteInformationSectionProps, ref) => {
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
                <h2 className="section-heading font-weight-bold ml-n2 ml-md-0" id="kurse-anchor">Kurse &amp; Börsen</h2>
                <div className="content-row">
                    <Row>
                        <Col xl={9} sm={12}>
                            <PerformanceSection instrument={instrument} className="content-wrapper col"/>
                            <ShareTechnicalFiguresComponent instrumentGroup={props.instrumentGroup} instrument={instrument}/>
                            <PerformanceInPercentComponent instrument={instrument}/>
                        </Col>
                        <Col xl={3} sm={12} className="pl-xl-0">
							{/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup} instrumentId={props.instrumentId}/> */}
                            <CommodityIndicesSection insideTitle={true} className="pt-0"/>
                            <AdditionalInformationSectionModals instrumentGroup={props.instrumentGroup} instrumentId={props.instrumentId}/>
                        </Col>
                    </Row>
                </div>
            </div>
        </section>
    );
});
