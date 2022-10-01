import { Button, Carousel, Container, Row, Col } from "react-bootstrap";
import StockAnalysesCard from "./StockAnalysesCard";
import { CarouselWrapper } from "../../common";
import SvgImage from "../../common/image/SvgImage";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import { Instrument } from "generated/graphql";
import { AnalysesShareOverviewModal } from "components/shares/overview/ShareOverviewAnalysesModal/AnalysesShareOverviewModal";
import { NavLink } from "react-router-dom";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

export function StockAnalysesComponent(props: { instruments: Instrument[] | any }) {
    const carouselItemsSize = useBootstrapBreakpoint({
        xl: 5,
        lg: 3,
        md: 3,
        sm: 1,
        default: 3
    });

    return (
        <div className={"px-0 px-md-3"}>
            <div className={"d-lg-flex align-items-center pt-4"}>
                <h2 className={"section-heading font-weight-bold roboto-heading my-1 d-md-block d-none"} style={{ fontSize: "24px" }}>
                    Aktien-Analysen der letzten 30 Tage</h2>
                <h2 className={"font-weight-bold roboto-heading my-1 d-block d-md-none"} style={{ fontSize: "20px" }}>Aktien-Analysen der letzten 30 Tage</h2>
            </div>
            <Container className={"bg-white pb-2 pt-2 px-4"} style={{ overflowX: 'hidden', boxShadow: "#00000029 0px 3px 6px" }}>
                <Carousel as={CarouselWrapper} controlclass={"dark-version"} slide={true}
                          onSelect={() => trigInfonline(guessInfonlineSection(), "stock_analysis_slider")}
                    prevIcon={
                        <SvgImage icon="icon_direction_left_dark_big.svg" spanClass="move-arrow"
                            convert={false} />
                    }
                    nextIcon={
                        <SvgImage  icon="icon_direction_right_dark_big.svg" spanClass="move-arrow"
                            childBeforeImage={true} convert={false} />
                    }
                >
                    {props.instruments && generateCarouselItems(props.instruments, carouselItemsSize)}
                </Carousel>
            </Container>
            <div className="d-flex justify-content-end mt-3 mx-sm-n2">
                <NavLink to="/analysen" onClick={() => trigInfonline('aktienuberblick', 'layer_aktien_analysen_index')}>
                    <Button className="mr-2">Alle Analysen</Button>
                </NavLink>
            </div>
        </div>
    )
}

export default StockAnalysesComponent;

function generateCarouselItems(data: Instrument[], size: number) {
    let array = [];
    let i = 0;
    while (i * size < data.length) {
        array.push(
            <Carousel.Item key={i}>
                <Row className={"p-1 row-cols-xl-5 row-cols-lg-3 row-cols-sm-1"} key={i}>
                    {
                        data.slice(i * size, (i + 1) * size).map((current: Instrument) =>
                            <Col key={current.id} className="p-1">
                                <AnalysesShareOverviewModal instrumentGroup={current.group}>
                                    <StockAnalysesCard name={current.group.name}
                                        positiveValue={current.group.analysisReport?.positiveCount || 0}
                                        negativeValue={current.group.analysisReport?.negativeCount || 0}
                                        neutralValue={current.group.analysisReport?.neutralCount || 0}
                                    />
                                </AnalysesShareOverviewModal>
                            </Col>
                        )
                    }
                </Row>
            </Carousel.Item>
        );
        i++;
    }
    return array;
}
