import classNames from "classnames";
import { useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";

export function WelcomeBeta() {
    const [isOpen, setModalOpen] = useState(handleOpen);

    return (
        <>
            <Modal show={isOpen} onHide={() => setModalOpen(false)} size="lg" className="limit-add-modal fade modal-dialog-sky-placement" backdrop="static">
                <Container className="px-md-3 px-sm-0 bg-white">
                    <Row className="bg-white py-2 px-xl-3 px-lg-2 px-md-2 px-sm-3 rounded-top" style={{ minWidth: "inherit" }}>
                        <Col className={classNames("font-weight-bold roboto-heading fs-20-22-24 px-0")}>Willkommen in der finanztreff.de beta!</Col>
                    </Row>
                </Container>
                <Modal.Body className="border-0 bg-white">
                    <iframe className="info-content" width="100%"
                        title={""}
                        key={0}
                        src={"/iframe-infolayer/index.html"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                    {/* <Container className="bg-white pt-2">
                        <Row className="border-top-1 border-gray-light px-xl-3 px-lg-2 px-md-2 px-sm-2">
                            <Col className="px-0 fs-13px">
                                Wir stellen gerade auf die neue Betaversion um und kämpfen aktuell mit den letzten Problemen. Bitte haben Sie etwas Verständnis dafür, dass es hier und da noch nicht ganz rund läuft. Der "alte" finanztreff ist bis auf weiteres unter <a target="_blank" className="font-weight-bold" href="http://alt.finanztreff.de">https://alt.finanztreff.de</a> für Sie zu erreichen.
                            </Col>
                        </Row>
                    </Container>
                    <Container className="text-white my-2 ">
                        <Row className="bg-dark-blue px-xl-3 px-lg-2 px-md-2 px-sm-2">
                            <Col xs={12} className="fs-20px font-weight-bold px-0 py-2 roboto-heading">
                                Wichtiger Hinweis für "Mein finanztreff.de" Nutzer.
                            </Col>
                            <Col xs={12} className="fs-15px font-weight-bold py-2 px-0">
                                Sie können sich in der Beta NICHT direkt mit Ihren alten Nutzerdaten anmelden.
                            </Col>
                            <Col xs={12} className="fs-15px py-2 px-0">
                                Aus technischen Gründen können Sie sich leider nicht sofort mit Ihren alten Nutzerdaten in der Beta anmelden. Sie können Ihre Portfolios, Watchlisten und Limits in wenigen Schritten vom "alten" finanztreff in die Beta kopieren. Und so geht's:
                            </Col>
                            <Col xs={12} className="fs-18px font-weight-bold py-2 px-0">
                                1. Mit Ihrer E-Mail Adresse neuen Account in der Beta registrieren.
                            </Col>
                            <Col xs={12} className="fs-18px font-weight-bold py-2 px-0">
                                2. Mit diesem neu angelegten Account in der Beta einloggen.
                            </Col>
                            <Col xs={12} className="fs-18px font-weight-bold py-2 px-0">
                                3. Importfunktion starten und Ihre finanztreff.de Daten in die Beta holen.
                            </Col>
                            <Col xs={12} className="fs-15px py-2 px-0">
                                Nach dem Import sind Ihre Original-Daten nicht weg. Alternativ können Sie also Ihr gewohntes "Mein finanztreff" mit Ihren bisherigen Nutzerdaten unter https://alt.finanztreff.de/ weiter nutzen.                            </Col>
                        </Row>
                    </Container> */}
                    <Container className="bg-white pt-2 pb-xl-0 pb-lg-3 pb-md-3 pb-sm-3">
                        <Row className="">
                            <Col className="text-right px-0">
                                <Button variant="primary" onClick={() => setModalOpen(false)}>
                                    <span className="pt-sm-1">schließen</span>
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}

function handleOpen() {
    if (!window.localStorage.getItem('isBetaWelcomeShown')) {
        window.localStorage.setItem('isBetaWelcomeShown', "true");
        return true;
    }
    return false;
}
