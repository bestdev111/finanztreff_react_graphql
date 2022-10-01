import { BestAndWorseComponent } from "components/Assets/IndexPage/components/IndexBestAndWorseSection/BestAndWorseComponent";
import { CarouselWrapper } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { Instrument } from "generated/graphql";
import { Carousel, Row } from "react-bootstrap";
import { guessInfonlineSection, trigInfonline } from "../../../common/InfonlineService";

export function BestAndWorseCarouselComponent(props: BestAndWorseProps) {

    return (
        <Carousel as={CarouselWrapper} controlclass={"dark-version"} slide={true}
            onSlid={(index: number) => {
                trigInfonline(guessInfonlineSection(), 'bsa' + switchBSAIVW(props.instruments[index].group.seoTag));
            }}
            prevIcon={
                <SvgImage icon="icon_direction_left_dark_big.svg" spanClass="move-arrow"
                    convert={false} />
            }
            nextIcon={
                <SvgImage icon="icon_direction_right_dark_big.svg" spanClass="move-arrow"
                    childBeforeImage={true} convert={false} />
            }
        >
            {generateCarouselItems(props.instruments)}
        </Carousel>
    )
}

interface BestAndWorseProps {
    instruments: Instrument[];
}

function generateCarouselItems(data: Instrument[]) {
    let array = [];
    let i = 0;
    while (i < data.length) {
        array.push(
            <Carousel.Item key={i}>
                <Row className={"p-1"} key={i}>
                    {
                        data.slice(i, (i + 1)).map((current: Instrument) =>
                            <div key={current.id} className="col p-1">
                                <BestAndWorseComponent title={"Beste und schlechteste Aktien - " + current.group.name} group={current.group} />
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

export function switchBSAIVW(seoTag: string | null | undefined) {
    switch (seoTag) {
        case "TecDAX-Performance-Index":
            return "_tecDax"
        case "DAX-Deutscher-Aktienindex":
            return "_dax"
        case "SDAX-Performance-Index":
            return "_sdax"
        case "MDAX-Performance-Index":
            return "_mdax"
        case "ATX-Austrian-Traded-EUR-Preis-Index":
            return "_atx"
        case "EURO-STOXX-50-EUR-Price-Index":
            return "_euro_stoxx"
        case "Dow-Jones-30-Index":
            return "_dow_jones"
        case "NASDAQ-100-Index":
            return "_nasdaq"
        case "NIKKEI-225-Index":
            return "_nikkie"
        case "Hang-Seng-Index":
            return "_hang_sang"
        case "DE000A2BLGY6":
            return "_scale_all"
        default:
            return ""
    }
}