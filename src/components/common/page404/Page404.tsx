import { Container, Row, Col, Button } from "react-bootstrap";
import {useEffect} from "react";
import {trigInfonline} from "../InfonlineService";

export function Page404() {

    useEffect(() => {
        trigInfonline("Error_page", "Error")
    }, [])

    return (
        <>
            <Container className="d-none d-xl-block text-white pt-0" style={{ backgroundImage: "url('/static/img/404_images/404_desktop.jpg')", width: "100%", height: "500px" }}>
                <Row className="justify-content-end">
                    <Col xs="6" className="mt-5">
                        <Row className="roboto-heading font-weight-bold line-height-1 mt-5" style={{ fontSize: "42px" }}>
                            <Col className="mt-3">Hier ist leider<br /> nichts zu holen!</Col>
                        </Row>
                        <Row className="fs-18px mt-4 pt-3">
                            <Col>
                                <b>Die von Ihnen aufgerufene Seite existiert nicht.</b><br />
                                Möglicherweise haben Sie einen veralteten Link bzw. ein altes<br />
                                Lesezeichen verwendet. Bitte korrigieren Sie die Adresse, gehen Sie<br />
                                zu unserer <b>Homepage</b> oder benutzen Sie die Suche oben um die<br />
                                gewünschte Information zu finden.
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="primary" href='/' className="fs-18px mt-4"> Zur Homepage</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Container className="d-xl-none d-lg-block d-md-block d-sm-none text-white pt-0" style={{ backgroundImage: "url('/static/img/404_images/404_tablet.jpg')", width: "100%", height: "500px" }}>
                <Row className="justify-content-end">
                    <Col xs="6" className="mt-3">
                        <Row className="roboto-heading font-weight-bold line-height-1 mt-5" style={{ fontSize: "42px" }}>
                            <Col className="mt-3">Hier ist leider<br /> nichts zu holen!</Col>
                        </Row>
                        <Row className="fs-15px mt-4 pt-3">
                            <Col>
                                <b>Die von Ihnen aufgerufene Seite existiert nicht.</b><br />
                                Möglicherweise haben Sie einen veralteten Link bzw.
                                ein altes Lesezeichen verwendet. Bitte korrigieren
                                Sie die Adresse, gehen Sie zu unserer <b>Homepage</b> oder benutzen Sie die Suche oben um die
                                gewünschte Information zu finden.
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="primary" href='/' className="fs-18px mt-5"> Zur Homepage</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Container className="d-none d-md-none d-sm-block text-white pt-0" style={{ backgroundImage: "url('/static/img/404_images/404_mobile.jpg')", width: "100%", height: "500px" }}>
                <Row className="justify-content-end">
                    <Col xs="12" className="mt-2">
                        <Row className="roboto-heading font-weight-bold line-height-1" style={{ fontSize: "30px" }}>
                            <Col className="mt-3">Hier ist leider<br /> nichts zu holen!</Col>
                        </Row>
                        <Row className="fs-13px mt-2 pt-1">
                            <Col>
                                <b className="fs-15px line-height-1">Die von Ihnen aufgerufene Seite existiert nicht.</b><br />
                                Möglicherweise haben Sie einen veralteten Link bzw.
                                ein altes Lesezeichen verwendet. Bitte korrigieren
                                Sie die Adresse, gehen Sie zu unserer <b>Homepage</b> oder benutzen Sie die Suche oben um die
                                gewünschte Information zu finden.
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right">
                                <Button variant="primary" href='/' className="fs-14px"> Zur Homepage</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}