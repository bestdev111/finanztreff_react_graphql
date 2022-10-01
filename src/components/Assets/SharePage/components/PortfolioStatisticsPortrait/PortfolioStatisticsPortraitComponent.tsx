import { PortfolioOverviewInPortraitComponent } from "components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent";
import { MostTradedAssets } from "components/Home/HotSection/UserStatistics/HostSectionAdvertisement";
import { InstrumentGroup } from "generated/graphql";
import { Col, Row } from "react-bootstrap";

export const PortfolioStatisticsPortraitComponent = (props: PortfolioStatisticsPortraitComponentProps) => {
    return (
        <section className="main-section">
            <div className="container">
                <Row>
                    <Col sm={12}>
                        <Row>
                            <Col xl={9} sm={12}>
                                <PortfolioOverviewInPortraitComponent instrumentGroup={props.group} />
                            </Col>
                            <Col xl={3} sm={12} className="pl-xl-0 pr-xl-3 mt-3">
                                <MostTradedAssets titleClassName="line-height-1 mb-n1 fs-16px pt-2" buttonClassName="fs-16px pb-2" assetNameLenght={20} />
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </div>
        </section>
    );
}

export interface PortfolioStatisticsPortraitComponentProps {
    group: InstrumentGroup;
}
