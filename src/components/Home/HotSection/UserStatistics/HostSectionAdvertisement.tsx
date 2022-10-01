import { useKeycloak } from "@react-keycloak/web";
import classNames from "classnames";
import { CarouselWrapper } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { Component} from "react";
import { Carousel, Container, Row, Col, Button} from "react-bootstrap";
import './HotSectionAdvertisement.scss';

import { MostTradedModal } from "./StatisticsModal/StatisticsModal";
import { MostTraded } from "./MostTraded";
import {trigInfonline} from "../../../common/InfonlineService";

export class HostSectionAdvertisement extends Component<{}, {}> {
    render() {
        return (
            <section className="main-section home-statistics-mf">
                <Container className="banner-container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 pr-sm-0 custom-padding-right" >
                            <Carousel
                                onSelect={() => trigInfonline("homepage", "host_adv_slider")}
                                className="carousel-inner-hidden"
                                touch={true}
                                controlclass="dark-version"
                                prevIcon={
                                    <SvgImage icon="icon_direction_left_dark.svg"
                                        spanClass="move-arrow d-none d-xl-block d-sm-block" convert={false} />
                                }
                                nextIcon={
                                    <SvgImage icon="icon_direction_right_dark.svg"
                                        spanClass="move-arrow d-none d-xl-block d-sm-block" convert={false} />
                                }
                                as={CarouselWrapper}
                            >
                                {CAROUSEL_DATA.map((slide, index) =>
                                    <Carousel.Item key={index} className="pb-5">
                                        <CarouselSlideContent pictureSrc={slide.pictureSrc} title={slide.title} body={slide.body} />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                        </div>

                        <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 custom-padding-left">
                            <MostTradedAssets />
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

}

export function MostTradedAssets({ titleClassName, buttonClassName, assetNameLenght }: { titleClassName?: string, buttonClassName?: string, assetNameLenght?: number }) {
    let { initialized, keycloak } = useKeycloak();
    const logedIn: boolean = initialized && !keycloak?.authenticated;
    return (
        <>
            <Row className="bg-dark-blue text-white pt-2 mx-lg-0 mx-md-1 mx-sm-0 most-traded-section mb-4">
                <Col className={classNames("trading-title roboto-heading col-sm-12 font-weight-bold px-lg-n2", titleClassName ? titleClassName : "text-nowrap")}>
                    So handeln finanztreff.de Nutzer
                </Col>
                <Col className={classNames("col-xl-12 col-lg-6 col-md-12 col-sm-12", logedIn ? "mt-xl-2" : "mt-xl-5 mt-lg-0")}>
                    <MostTraded trades={false} purchased={true} logedIn={logedIn} assetNameLenght={assetNameLenght} itemsReturned={5} days={7} chartWidth={50} className="statistics" />
                </Col>
                <Col className="col-xl-12 d-xl-block d-sm-none my-1">
                    <Row className="border-top-1 border-gray-light mx-2"></Row>
                </Col>
                <Col className={classNames("col-xl-12 col-lg-6 col-md-12 col-sm-12", logedIn ? "mb-xl-2" : "mb-xl-5 mb-lg-0")}>
                    <MostTraded trades={false} purchased={false} logedIn={logedIn} assetNameLenght={assetNameLenght} itemsReturned={5} days={7} chartWidth={50} className="statistics" />
                </Col>
                {logedIn ?
                    <>
                        <Col className={classNames("col-xl-12 col-lg-6 col-md-12 col-sm-12 font-weight-bold mb-xl-n2 mb-lg-n1 line-height-1", buttonClassName ? buttonClassName : "fs-20px")}>
                            Angemeldete Nutzer sehen mehr!
                        </Col>
                        <Col className="col-xl-12 col-lg-6 col-md-12 col-sm-12 mb-xl-n2 mb-lg-n3 mb-md-n4 mb-sm-n4 button-position">
                            <Button variant="primary" className="bg-white text-dark-blue border-0 fs-14px mt-xl-2 mt-lg-0 mb-xl-4 mb-lg-n1 mb-sm-4" onClick={() => keycloak.login()}>
                                Jetzt registrieren oder anmelden
                            </Button>
                        </Col>
                    </>
                    :
                    <Col className="">
                        <MostTradedModal />
                    </Col>

                }
            </Row>
        </>
    );
}



interface CarouselSlideProps {
    pictureSrc: string;
    title: string;
    body: string;
}

function CarouselSlideContent({ pictureSrc, title, body }: CarouselSlideProps) {
    let { initialized, keycloak } = useKeycloak();
    const logedIn: boolean = initialized && !keycloak?.authenticated;

    return (
        <div className="w-100 d-flex flex-column justify-content-end carousel-item-height">
            <div className="carousel-item-inner-img-height">
                <img className="w-100" src={process.env.PUBLIC_URL + "/static/img/home-slides-images/" + pictureSrc} alt={title} />
            </div>
            <div className="bg-dark-blue w-100 text-white pl-3  px-xl-3 px-lg-3 px-md-1 px-sm-2">
                <div className="mt-2 fs-24px roboto-heading title-line-height">{title}</div>
                <div className="mt-1 fs-15px body-line-height" >{body}</div>
                {
                    logedIn ?
                        <div>
                            <Button variant="primary" className="bg-white text-dark-blue border-0 fs-14px mt-2 mb-3" onClick={() => keycloak.login()}>
                                Jetzt "Mein finanztreff" entdecken
                            </Button>
                        </div>
                        :
                        <div>
                            <Button variant="primary" className="bg-white text-dark-blue border-0 fs-14px mt-2 mb-3" href="/mein-finanztreff/">
                                Jetzt "Mein finanztreff" entdecken
                            </Button>
                        </div>
                }
            </div>
        </div>
    );
}

const CAROUSEL_DATA: CarouselSlideProps[] = [
    {
        pictureSrc: "blog___01__der_neue_finanztreff_de___twitter.jpg",
        title: 'Das neue "Mein finanztreff"',
        body: "Wir wollen im neuen finanztreff neue Wege gehen und laden Sie ein uns zu begleiten. Das responsive Design bietet Ihnen auf allen Geräten genau die Informationen und Funktionen, die Sie für Ihre Anlageentscheidungen brauchen."
    }, {
        pictureSrc: "blog___08b__import___twitter___1.jpg",
        title: "Nehmen Sie Ihre finanztreff-Daten mit.",
        body: 'Wir machen Ihnen den Wechsel leicht. Import starten, mit Ihren alten Nutzerdaten anmelden, Daten auswählen, fertig! Jetzt sind sie bereit die Funktionen des neuen "Mein finanztreff" zu entdecken.'
    }, {
        pictureSrc: "blog___17__portfolioansichten___twitter.jpg",
        title: "Das Portfolio - zugeschnitten auf Ihre Bedürfnisse",
        body: 'Zum Testen von Anlagestrategien oder Nachbildung Ihrer echten Portfolios können Sie den Portfolio-Bereich von "Mein finanztreff" nutzen. Zahlreiche Auswertungen und Analysen lassen Sie zielsicher erkennen wie erfolgreich sind.'
    }, {
        pictureSrc: "blog___28__portfolioalert___twitter.jpg",
        title: "Neu: Der Portfolio-Alert",
        body: "Haben Sie Angst entscheidende Kursbewegungen zu verpassen? Mit dem neuen Porfolioalert beobachten Sie mit einem Klick alle Einzelwerte und das Gesamtportfolio auf einmal. Schneller und einfacher geht es nun wirklich nicht!"
    }, {
        pictureSrc: "watchlist.jpg",
        title: "Mit Watchlisten wichtige Werte im Blick behalten",
        body: "Verpassen Sie keine Entwicklungen, Nachrichten oder Analysen Ihrer Werte mehr."
    }, {
        pictureSrc: "blog___19__limit_hinzuf_gen___twitter.jpg",
        title: "Limits - wir beobachten Ihre Werte damit Sie ruhig schlafen können",
        body: "Wir beobachten die Märkte für Sie und benachrichtigen Sie sofort per Email wenn eines Ihrer Limits getroffen wurde. Watchlisten von finanztreff.de - weil schnelle Reaktionen wichtig sind."
    },
]
