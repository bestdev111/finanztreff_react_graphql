import { Button, Carousel, Container, Row, Spinner } from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import { CarouselWrapper } from "../../../common";
import { useBootstrapBreakpoint } from "../../../../hooks/useBootstrapBreakpoint";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import ShareScreenerRatingCard from "./ShareScreenerRatingCard";
import { TheScreenerRating, TheScreenerRatingChange } from "generated/graphql";
import { ShareScreenerRatingModal } from "./ShareScreenerRatingModal";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

export function ShareScreenerRating() {
    const carouselItemsSize = useBootstrapBreakpoint({
        default: 3,
        md: 8,
        xl: 8,
        sm: 4
    });
    const { data, loading } = useQuery(
        loader('./theScreenerRatingSearchUpdate.graphql'), { variables: { first: 24 } }
    );
    let screenerRatings: TheScreenerRating[] = [];
    if (!loading) {
        screenerRatings = data.theScreenerRatingSearch;
    }
    return (
        <div className={"px-0 px-md-3 pt-md-4"}>
            <div className={"d-lg-flex align-items-center ml-sm-n1"}>
                <h2 className={"section-heading font-weight-bold roboto-heading my-1 ml-md-1"} style={{ fontSize: "24px" }}>theScreener Rating</h2>
                <span className={"pl-3 mt-2"} style={{ fontSize: "15px" }}> Neueste Up & Downgrades </span>
            </div>
            <Container className={"bg-white"} style={{ overflowX: 'hidden', boxShadow: "#00000029 0px 3px 6px" }}>
                <Carousel as={CarouselWrapper} controlclass={"dark-version"} slide={true} className="mt-4"
                          onSelect={() => trigInfonline(guessInfonlineSection(), "stock_screener_rating")}
                    prevIcon={
                        <SvgImage icon="icon_direction_left_dark_big.svg" spanClass="move-arrow"
                            convert={false} />
                    }
                    nextIcon={
                        <SvgImage  icon="icon_direction_right_dark_big.svg" spanClass="move-arrow"
                            childBeforeImage={true} convert={false} />
                    }
                >
                    {loading ? <div className="text-center py-2"><Spinner animation="border" /></div> :
                        generateCarouselItems(screenerRatings, carouselItemsSize)
                    }
                </Carousel>
            </Container>
            <div className={"d-flex justify-content-end mt-3 px-sm-2 mr-n2"}>
                <Button className={"mr-3"}>
                    <ShareScreenerRatingModal onClickFunction={() => trigInfonline('aktienuberblick', 'layer_thescreener_alle_upgrades')} title="Upgrades seit letzter Anpassung "
                                              change={TheScreenerRatingChange.Upgrade}>Alle Upgrades</ShareScreenerRatingModal>
                </Button>
                <Button>
                    <ShareScreenerRatingModal onClickFunction={() => trigInfonline('aktienuberblick', 'layer_thescreener_alle_downgrades')} title="Downgrades seit letzter Anpassung" change={TheScreenerRatingChange.Downgrade}>Alle Downgrades</ShareScreenerRatingModal>
                </Button>

            </div>
        </div>
    )
}

export default ShareScreenerRating;

function generateCarouselItems(data: TheScreenerRating[], size: number) {
    let array = [];
    let i = 0;
    while (i * size < data.length) {
        array.push(
            <Carousel.Item key={i}>
                <Row className={"p-1"} key={i}>
                    {
                        data.slice(i * size, (i + 1) * size).map((current: TheScreenerRating, index: number) =>
                            <div key={index} className="col-xl-3 col-lg-5 col-sm-12 ml-md-5 ml-xl-0">
                                <ShareScreenerRatingCard previousRating={current.previousRating || 0}
                                    updatedRating={current.rating || 0}
                                    date={current.date}
                                    instrumentGroup={current.group}
                                    status={(current.rating && current.previousRating && current.rating > current.previousRating) ? "Upgrade" : "Downgrade"}
                                    showStatus={true}
                                    nameIsBold={true}
                                />
                            </div>
                        )
                    }
                </Row>
            </Carousel.Item>
        );
        i++;
    }
    return array;

}
