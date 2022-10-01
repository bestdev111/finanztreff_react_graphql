import { PortfolioOverviewInPortraitComponent } from "components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent";
import { MostTradedAssets } from "components/Home/HotSection/UserStatistics/HostSectionAdvertisement";
import { InstrumentGroup, Instrument } from "graphql/types";
import { forwardRef, useState, useImperativeHandle } from "react";
import { Row, Col, Container } from "react-bootstrap";

interface InstrumentQuoteInformationSectionProps {
    instrumentGroup: InstrumentGroup;
    instrumentId: number;
}

export const MMRQuoteAndExchangeSection = forwardRef((props: InstrumentQuoteInformationSectionProps, ref) => {
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

    return (
        <section className="main-section">
            <Container>
            <Row>
                <Col xl={9} sm={12} className="pr-xl-28px">
                    <PortfolioOverviewInPortraitComponent instrumentGroup={props.instrumentGroup} />
                </Col>
                <Col xl={3} sm={12} className="mt-3 pl-xl-1 ml-xl-n3 pr-xl-0 " >
                    <MostTradedAssets titleClassName="line-height-1 mb-n1 fs-16px pt-2" buttonClassName="fs-16px pb-2" assetNameLenght={20} />
                </Col>
            </Row>
            </Container>
        </section>
    );
});
