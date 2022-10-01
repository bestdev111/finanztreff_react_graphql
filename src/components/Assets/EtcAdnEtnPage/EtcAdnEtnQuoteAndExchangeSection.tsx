import { AdditionalInformationSection, AdditionalInformationSectionModals } from "components/common/asset/AdditionalInformationSection/AdditionalInformationSection";
import { PortfolioOverviewInPortraitComponent } from "components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent";
import { MostTradedAssets } from "components/Home/HotSection/UserStatistics/HostSectionAdvertisement";
import { Col, Row } from "react-bootstrap";
import { Instrument, InstrumentGroup } from "../../../graphql/types";
import {PerformanceSection} from "../../common/asset/PerformanceSection/PerformanceSection";


interface InstrumentQuoteInformationSectionProps {
	instrument: Instrument;
	instrumentGroup: InstrumentGroup;
}

export function EtcAdnEtnQuoteAndExchangeSection(props: InstrumentQuoteInformationSectionProps) {
    return (
        <section className="main-section mb-4">
            <div className="container">
				<h2 className="section-heading font-weight-bold" id="kurse-anchor">Kurse &amp; Börsen</h2>
                <div className="content-row">
                    <Row>
                        <Col xl={9} sm={12} >
                            <PerformanceSection instrument={props.instrumentGroup.content.filter(current => current.main===true)[0]} className="content-wrapper col"/>
                        </Col>
                        <Col xl={3} sm={12} className="pl-xl-0">
							{/* <AdditionalInformationSection instrumentGroup={props.instrumentGroup}/> */}
                            <AdditionalInformationSectionModals instrumentId={props.instrumentGroup.content.filter(current => current.main===true)[0].id} instrumentGroup={props.instrumentGroup}/>
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
}
