import React, {Component} from "react";
import './MarketCarouselAdvertisement.scss';
import {Button, Col, Container, Row} from "react-bootstrap";
import {getRandomEmittent} from "../../../common/emittents/emittent";

export class MarketCarouselAdvertisement extends Component<{}, {}> {
    render() {
        const rHref = getRandomEmittent();

        return (
            <Container className={"market-carousel-advertisement px-0"}>
                <h5 className={"mb-3"}>Überdurchschnittlich am <br/> Dax partizipieren</h5>
                <Row className={"px-0 mb-1"}>
                    <Col className={"pr-0 fs-11px"}>
                        <Button variant={"long-button"}
                                onClick={() =>
                                    window.location.href="/hebelprodukte/suche?to=5&type=CALL&aclass=Knock-Out&atype=KNOCK_CLASSIC&&underlying=1361&issuerId="+rHref.id+"&issuerName="+rHref.name}>
                            Long</Button>
                    </Col>
                    <Col className={"px-0 pt-1 fs-11px font-weight-bolder"}>
                        Hebel &lt;5
                    </Col>
                    <Col className={"pl-0 fs-11px"}>
                        <Button variant={"short-button"}
                                onClick={() =>
                                    window.location.href="/hebelprodukte/suche?to=5&type=PUT&aclass=Knock-Out&atype=KNOCK_CLASSIC&&underlying=1361&issuerId="+rHref.id+"&issuerName="+rHref.name}>
                            Short</Button>
                    </Col>
                </Row>
                <Row className={"px-0 mb-1"}>
                    <Col className={"pr-0 fs-11px"}>
                        <Button variant={"long-button"}
                                onClick={() =>
                                    window.location.href="/hebelprodukte/suche?from=5&to=10&type=CALL&aclass=Knock-Out&atype=KNOCK_CLASSIC&&underlying=1361&issuerId="+rHref.id+"&issuerName="+rHref.name}>
                            Long</Button>
                    </Col>
                    <Col className={"px-0 pt-1 fs-11px font-weight-bolder"}>
                       Hebel 5-10
                    </Col>
                    <Col className={"pl-0 fs-11px"}>
                        <Button variant={"short-button"}
                                onClick={() =>
                                    window.location.href="/hebelprodukte/suche?from=5&to=10&type=PUT&aclass=Knock-Out&atype=KNOCK_CLASSIC&&underlying=1361&issuerId="+rHref.id+"&issuerName="+rHref.name}>
                            Short</Button>
                    </Col>
                </Row>
                <Row className={"px-0 mb-1"}>
                    <Col className={"pr-0 fs-11px"}>
                        <Button variant={"long-button"}
                                onClick={() =>
                                    window.location.href="/hebelprodukte/suche?from=10&type=CALL&aclass=Knock-Out&atype=KNOCK_CLASSIC&&underlying=1361&issuerId="+rHref.id+"&issuerName="+rHref.name}>
                            Long</Button>
                    </Col>
                    <Col className={"px-0 pt-1 fs-11px font-weight-bolder"}>
                        Hebel &gt;10
                    </Col>
                    <Col className={"pl-0 fs-11px"}>
                        <Button variant={"short-button"}
                                onClick={() =>
                                    window.location.href="/hebelprodukte/suche?from=10&type=PUT&aclass=Knock-Out&atype=KNOCK_CLASSIC&&underlying=1361&issuerId="+rHref.id+"&issuerName="+rHref.name}>
                            Short</Button>
                    </Col>
                </Row>
                <Row className={"mt-3 mx-0 mx-md-3 mx-xl-2 font-size-9px"}>
                    <Col xs={4} className={"special-label text-left px-0 line-height-16px"}>Werbung</Col>
                    <Col xs={8} className={"text-right px-0 font-size-13px font-weight-bolder line-height-16px"}>{ rHref.name }</Col>
                </Row>
            </Container>
        );
    }
}
